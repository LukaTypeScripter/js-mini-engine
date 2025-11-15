import {TokenI, TokenType} from "../core";
import {Expression, Statement, Program} from "../ast";
import * as AST from "../ast/builders";


export class Parser {
    #tokens: TokenI[];
    #current: number = 0;


    constructor(tokens: TokenI[]) {
        this.#tokens = tokens;
    }

    // ========================================================================
    // HELPER METHODS - These help us navigate through tokens
    // ========================================================================


    peek(): TokenI {
        return this.#tokens[this.#current];
    }


    isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }


    previous(): TokenI {
        return this.#tokens[this.#current - 1];
    }


    advance(): TokenI {
        if (!this.isAtEnd()) {
            this.#current++;
        }
        return this.previous();
    }


    check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }


    match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }


    consume(type: TokenType, message: string): TokenI {
        if (this.check(type)) {
            return this.advance();
        }
        throw this.error(this.peek(), message);
    }


    error(token: TokenI, message: string): Error {
        const location = `Line ${token.line}:${token.column}`;
        const tokenInfo = token.type === TokenType.EOF
            ? 'end of file'
            : `'${token.value}'`;

        return new Error(`${location} - Error at ${tokenInfo}: ${message}`);
    }

    // ========================================================================
    // EXPRESSION PARSING - Handles operator precedence correctly
    // ========================================================================

    parseExpression(): Expression {
        return this.parseAssignment();
    }


    parseAssignment(): Expression {
        const expr = this.parseLogicalOr();

        if (this.match(TokenType.EQUAL)) {
            const operator = this.previous().type;
            const value = this.parseAssignment();

            if (expr.type === 'Identifier') {
                return AST.createAssignmentExpression(expr as any, operator, value);
            }

            throw this.error(this.previous(), 'Invalid assignment target');
        }

        return expr;
    }


    parseLogicalOr(): Expression {
        let expr = this.parseLogicalAnd();

        while (this.match(TokenType.OR)) {
            const operator = this.previous().type;
            const right = this.parseLogicalAnd();
            expr = AST.createLogicalExpression(expr, operator, right);
        }

        return expr;
    }


    parseLogicalAnd(): Expression {
        let expr = this.parseEquality();

        while (this.match(TokenType.AND)) {
            const operator = this.previous().type;
            const right = this.parseEquality();
            expr = AST.createLogicalExpression(expr, operator, right);
        }

        return expr;
    }


    parseEquality(): Expression {
        let expr = this.parseComparison();

        while (this.match(TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL)) {
            const operator = this.previous().type;
            const right = this.parseComparison();
            expr = AST.createBinaryExpression(expr, operator, right);
        }

        return expr;
    }


    parseComparison(): Expression {
        let expr = this.parseTerm();

        while (this.match(
            TokenType.LESS,
            TokenType.LESS_EQUAL,
            TokenType.GREATER,
            TokenType.GREATER_EQUAL
        )) {
            const operator = this.previous().type;
            const right = this.parseTerm();
            expr = AST.createBinaryExpression(expr, operator, right);
        }

        return expr;
    }


    parseTerm(): Expression {
        let expr = this.parseFactor();

        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous().type;
            const right = this.parseFactor();
            expr = AST.createBinaryExpression(expr, operator, right);
        }

        return expr;
    }


    parseFactor(): Expression {
        let expr = this.parseUnary();

        while (this.match(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {
            const operator = this.previous().type;
            const right = this.parseUnary();
            expr = AST.createBinaryExpression(expr, operator, right);
        }

        return expr;
    }


    parseUnary(): Expression {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            const operator = this.previous().type;
            const right = this.parseUnary();
            return AST.createUnaryExpression(operator, right);
        }

        return this.parsePrimary();
    }


    parsePrimary(): Expression {
        if (this.match(TokenType.NUMBER)) {
            const token = this.previous();
            return AST.createLiteral(Number(token.value), token.value);
        }

        if (this.match(TokenType.STRING)) {
            const token = this.previous();
            return AST.createLiteral(token.value, `"${token.value}"`);
        }

        if (this.match(TokenType.TRUE)) {
            return AST.createLiteral(true, 'true');
        }
        if (this.match(TokenType.FALSE)) {
            return AST.createLiteral(false, 'false');
        }

        if (this.match(TokenType.NULL)) {
            return AST.createLiteral(null, 'null');
        }

        if (this.match(TokenType.IDENTIFIER)) {
            return AST.createIdentifier(this.previous().value);
        }

        if (this.match(TokenType.LPAREN)) {
            const expr = this.parseExpression(); // Start over inside ()!
            this.consume(TokenType.RPAREN, "Expected ')' after expression");
            return AST.createGroupingExpression(expr);
        }

        throw this.error(this.peek(), 'Expected expression');
    }

    // ========================================================================
    // STATEMENT PARSING - Parse different statement types
    // ========================================================================

    parse(): Program {
        const statements: Statement[] = [];

        while (!this.isAtEnd()) {
            statements.push(this.parseStatement());
        }

        return AST.createProgram(statements);
    }


    parseStatement(): Statement {
        if (this.match(TokenType.LET, TokenType.CONST)) {
            return this.parseVariableDeclaration();
        }

        if (this.match(TokenType.IF)) {
            return this.parseIfStatement();
        }

        if (this.match(TokenType.WHILE)) {
            return this.parseWhileStatement();
        }

        if (this.match(TokenType.FOR)) {
            return this.parseForStatement();
        }

        if (this.match(TokenType.RETURN)) {
            return this.parseReturnStatement();
        }

        if (this.match(TokenType.BREAK)) {
            return this.parseBreakStatement();
        }

        if (this.match(TokenType.CONTINUE)) {
            return this.parseContinueStatement();
        }

        if (this.check(TokenType.LBRACE)) {
            return this.parseBlockStatement();
        }

        return this.parseExpressionStatement();
    }


    parseVariableDeclaration(): Statement {
        const kind = this.previous().type === TokenType.LET ? 'let' : 'const';

        // Get identifier name
        const identifier = AST.createIdentifier(
            this.consume(TokenType.IDENTIFIER, 'Expected variable name').value
        );

        let initializer: Expression | null = null;
        if (this.match(TokenType.EQUAL)) {
            initializer = this.parseExpression();
        }

        if (kind === 'const' && initializer === null) {
            throw this.error(this.previous(), 'const declaration must have an initializer');
        }

        this.consume(TokenType.SEMICOLON, "Expected ';' after variable declaration");

        return AST.createVariableDeclaration(kind, identifier, initializer);
    }


    parseIfStatement(): Statement {
        this.consume(TokenType.LPAREN, "Expected '(' after 'if'");
        const condition = this.parseExpression();
        this.consume(TokenType.RPAREN, "Expected ')' after condition");

        const consequent = this.parseStatement();
        let alternate: Statement | null = null;

        if (this.match(TokenType.ELSE)) {
            alternate = this.parseStatement();
        }

        return AST.createIfStatement(condition, consequent, alternate);
    }


    parseWhileStatement(): Statement {
        this.consume(TokenType.LPAREN, "Expected '(' after 'while'");
        const condition = this.parseExpression();
        this.consume(TokenType.RPAREN, "Expected ')' after condition");

        const body = this.parseStatement();

        return AST.createWhileStatement(condition, body);
    }


    parseForStatement(): Statement {
        this.consume(TokenType.LPAREN, "Expected '(' after 'for'");

        let init: Statement | null = null;
        if (this.match(TokenType.SEMICOLON)) {
            init = null;
        } else if (this.match(TokenType.LET, TokenType.CONST)) {
            init = this.parseVariableDeclaration();
        } else {
            init = this.parseExpressionStatement();
        }

        let condition: Expression | null = null;
        if (!this.check(TokenType.SEMICOLON)) {
            condition = this.parseExpression();
        }
        this.consume(TokenType.SEMICOLON, "Expected ';' after loop condition");

        let update: Expression | null = null;
        if (!this.check(TokenType.RPAREN)) {
            update = this.parseExpression();
        }
        this.consume(TokenType.RPAREN, "Expected ')' after for clauses");

        const body = this.parseStatement();

        return AST.createForStatement(
            init as any,
            condition,
            update,
            body
        );
    }


    parseReturnStatement(): Statement {
        let value: Expression | null = null;

        if (!this.check(TokenType.SEMICOLON)) {
            value = this.parseExpression();
        }

        this.consume(TokenType.SEMICOLON, "Expected ';' after return value");

        return AST.createReturnStatement(value);
    }


    parseBreakStatement(): Statement {
        this.consume(TokenType.SEMICOLON, "Expected ';' after 'break'");
        return AST.createBreakStatement();
    }


    parseContinueStatement(): Statement {
        this.consume(TokenType.SEMICOLON, "Expected ';' after 'continue'");
        return AST.createContinueStatement();
    }


    parseBlockStatement(): Statement {
        this.consume(TokenType.LBRACE, "Expected '{'");

        const statements: Statement[] = [];

        while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
            statements.push(this.parseStatement());
        }

        this.consume(TokenType.RBRACE, "Expected '}' after block");

        return AST.createBlockStatement(statements);
    }


    parseExpressionStatement(): Statement {
        const expr = this.parseExpression();
        this.consume(TokenType.SEMICOLON, "Expected ';' after expression");
        return AST.createExpressionStatement(expr);
    }
}
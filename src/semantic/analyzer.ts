/**
 * Semantic Analyzer
 *
 * Walks through the AST and performs semantic validation:
 * - Variable declaration checking (no duplicates in same scope)
 * - Variable usage checking (must be declared before use)
 * - Const reassignment checking
 * - Control flow validation (break/continue only in loops)
 * - Basic type checking
 */

import {
    Program,
    Statement,
    Expression,
    VariableDeclaration,
    FunctionDeclaration,
    BlockStatement,
    IfStatement,
    WhileStatement,
    ForStatement,
    ReturnStatement,
    BreakStatement,
    ContinueStatement,
    ExpressionStatement,
    AssignmentExpression,
    BinaryExpression,
    UnaryExpression,
    LogicalExpression,
    Identifier,
    LiteralExpression,
    GroupingExpression,
    CallExpression
} from '../ast';

import { Environment, SymbolInfo } from './environment';
import {
    TypeName,
    inferLiteralType,
    checkBinaryOperation,
    checkUnaryOperation,
    checkLogicalOperation,
    areTypesCompatible
} from './types';

export interface AnalysisResult {
    success: boolean;
    errors: string[];
}

export class SemanticAnalyzer {
    private environment: Environment;

    private loopDepth: number = 0;

    private errors: string[] = [];

    constructor() {
        this.environment = new Environment();
    }

    /**
     * Analyze a program
     */
    analyze(program: Program): AnalysisResult {
        this.errors = [];

        try {
            for (const statement of program.body) {
                this.analyzeStatement(statement);
            }

            return {
                success: this.errors.length === 0,
                errors: this.errors
            };
        } catch (error) {
            if (error instanceof Error) {
                this.errors.push(error.message);
            }

            return {
                success: false,
                errors: this.errors
            };
        }
    }

    // ========================================================================
    // STATEMENT ANALYSIS
    // ========================================================================

    private analyzeStatement(stmt: Statement): void {
        switch (stmt.type) {
            case 'VariableDeclaration':
                this.analyzeVariableDeclaration(stmt as VariableDeclaration);
                break;

            case 'FunctionDeclaration':
                this.analyzeFunctionDeclaration(stmt as FunctionDeclaration);
                break;

            case 'ExpressionStatement':
                this.analyzeExpressionStatement(stmt as ExpressionStatement);
                break;

            case 'BlockStatement':
                this.analyzeBlockStatement(stmt as BlockStatement);
                break;

            case 'IfStatement':
                this.analyzeIfStatement(stmt as IfStatement);
                break;

            case 'WhileStatement':
                this.analyzeWhileStatement(stmt as WhileStatement);
                break;

            case 'ForStatement':
                this.analyzeForStatement(stmt as ForStatement);
                break;

            case 'ReturnStatement':
                this.analyzeReturnStatement(stmt as ReturnStatement);
                break;

            case 'BreakStatement':
                this.analyzeBreakStatement(stmt as BreakStatement);
                break;

            case 'ContinueStatement':
                this.analyzeContinueStatement(stmt as ContinueStatement);
                break;

            default:
                throw new Error(`Unknown statement type: ${(stmt as any).type}`);
        }
    }

    private analyzeVariableDeclaration(stmt: VariableDeclaration): void {
        const name = stmt.identifier.name;

        let type: TypeName = 'undefined';

        if (stmt.initializer) {
            type = this.analyzeExpression(stmt.initializer);
        }

        const info: SymbolInfo = {
            kind: stmt.kind,
            type: type,
            initialized: stmt.initializer !== null,
            line: 0,
            column: 0
        };

        try {
            this.environment.define(name, info);
        } catch (error) {
            if (error instanceof Error) {
                this.errors.push(error.message);
            }
        }
    }

    private analyzeFunctionDeclaration(stmt: FunctionDeclaration): void {
        const name = stmt.name.name;

        const info: SymbolInfo = {
            kind: 'let',
            type: 'function',
            initialized: true,
            line: 0,
            column: 0
        };

        try {
            this.environment.define(name, info);
        } catch (error) {
            if (error instanceof Error) {
                this.errors.push(error.message);
            }
        }

        const previousEnv = this.environment;
        this.environment = this.environment.createChild();

        try {
            for (const param of stmt.parameters) {
                const paramInfo: SymbolInfo = {
                    kind: 'let',
                    type: 'any',
                    initialized: true,
                    line: 0,
                    column: 0
                };

                try {
                    this.environment.define(param.name, paramInfo);
                } catch (error) {
                    if (error instanceof Error) {
                        this.errors.push(error.message);
                    }
                }
            }

            for (const bodyStmt of stmt.body.body) {
                this.analyzeStatement(bodyStmt);
            }
        } finally {
            this.environment = previousEnv;
        }
    }

    private analyzeExpressionStatement(stmt: ExpressionStatement): void {
        this.analyzeExpression(stmt.expression);
    }

    private analyzeBlockStatement(stmt: BlockStatement): void {
        const previousEnv = this.environment;
        this.environment = this.environment.createChild();

        try {
            for (const statement of stmt.body) {
                this.analyzeStatement(statement);
            }
        } finally {
            this.environment = previousEnv;
        }
    }

    private analyzeIfStatement(stmt: IfStatement): void {
        this.analyzeExpression(stmt.condition);

        this.analyzeStatement(stmt.consequent);

        if (stmt.alternate) {
            this.analyzeStatement(stmt.alternate);
        }
    }

    private analyzeWhileStatement(stmt: WhileStatement): void {
        this.analyzeExpression(stmt.condition);

        this.loopDepth++;

        try {
            this.analyzeStatement(stmt.body);
        } finally {
            this.loopDepth--;
        }
    }

    private analyzeForStatement(stmt: ForStatement): void {
        const previousEnv = this.environment;
        this.environment = this.environment.createChild();

        try {
            if (stmt.init) {
                this.analyzeStatement(stmt.init);
            }

            if (stmt.condition) {
                this.analyzeExpression(stmt.condition);
            }

            if (stmt.update) {
                this.analyzeExpression(stmt.update);
            }

            this.loopDepth++;

            try {
                this.analyzeStatement(stmt.body);
            } finally {
                this.loopDepth--;
            }
        } finally {
            this.environment = previousEnv;
        }
    }

    private analyzeReturnStatement(stmt: ReturnStatement): void {
        if (stmt.argument) {
            this.analyzeExpression(stmt.argument);
        }
    }

    private analyzeBreakStatement(_stmt: BreakStatement): void {
        if (this.loopDepth === 0) {
            this.errors.push("'break' statement can only be used inside a loop");
        }
    }

    private analyzeContinueStatement(_stmt: ContinueStatement): void {
        if (this.loopDepth === 0) {
            this.errors.push("'continue' statement can only be used inside a loop");
        }
    }

    // ========================================================================
    // EXPRESSION ANALYSIS - Returns the type of the expression
    // ========================================================================

    private analyzeExpression(expr: Expression): TypeName {
        switch (expr.type) {
            case 'LiteralExpression':
                return this.analyzeLiteral(expr as LiteralExpression);

            case 'Identifier':
                return this.analyzeIdentifier(expr as Identifier);

            case 'BinaryExpression':
                return this.analyzeBinaryExpression(expr as BinaryExpression);

            case 'UnaryExpression':
                return this.analyzeUnaryExpression(expr as UnaryExpression);

            case 'LogicalExpression':
                return this.analyzeLogicalExpression(expr as LogicalExpression);

            case 'AssignmentExpression':
                return this.analyzeAssignmentExpression(expr as AssignmentExpression);

            case 'GroupingExpression':
                return this.analyzeGroupingExpression(expr as GroupingExpression);

            case 'CallExpression':
                return this.analyzeCallExpression(expr as CallExpression);

            default:
                throw new Error(`Unknown expression type: ${(expr as any).type}`);
        }
    }

    private analyzeLiteral(expr: LiteralExpression): TypeName {
        return inferLiteralType(expr);
    }

    private analyzeIdentifier(expr: Identifier): TypeName {
        const name = expr.name;
        const symbol = this.environment.lookup(name);

        if (!symbol) {
            this.errors.push(`Variable '${name}' is not defined`);
            return 'any';
        }

        return symbol.type;
    }

    private analyzeBinaryExpression(expr: BinaryExpression): TypeName {
        const leftType = this.analyzeExpression(expr.left);
        const rightType = this.analyzeExpression(expr.right);

        try {
            return checkBinaryOperation(leftType, expr.operator, rightType);
        } catch (error) {
            if (error instanceof Error) {
                this.errors.push(error.message);
            }
            return 'any';
        }
    }

    private analyzeUnaryExpression(expr: UnaryExpression): TypeName {
        const operandType = this.analyzeExpression(expr.argument);

        try {
            return checkUnaryOperation(expr.operator, operandType);
        } catch (error) {
            if (error instanceof Error) {
                this.errors.push(error.message);
            }
            return 'any';
        }
    }

    private analyzeLogicalExpression(expr: LogicalExpression): TypeName {
        const leftType = this.analyzeExpression(expr.left);
        const rightType = this.analyzeExpression(expr.right);

        try {
            return checkLogicalOperation(leftType, expr.operator, rightType);
        } catch (error) {
            if (error instanceof Error) {
                this.errors.push(error.message);
            }
            return 'any';
        }
    }

    private analyzeAssignmentExpression(expr: AssignmentExpression): TypeName {
        const name = expr.left.name;
        const valueType = this.analyzeExpression(expr.right);

        const symbol = this.environment.assign(name);

        if (!symbol) {
            this.errors.push(`Cannot assign to undefined variable '${name}'`);
            return valueType;
        }

        if (!areTypesCompatible(symbol.type, valueType)) {
            this.errors.push(
                `Type error: Cannot assign ${valueType} to variable '${name}' of type ${symbol.type}`
            );
        }

        return valueType;
    }

    private analyzeGroupingExpression(expr: GroupingExpression): TypeName {
        return this.analyzeExpression(expr.expression);
    }

    private analyzeCallExpression(expr: CallExpression): TypeName {
        const calleeType = this.analyzeExpression(expr.callee);

        if (calleeType !== 'function' && calleeType !== 'any') {
            if (expr.callee.type === 'Identifier') {
                const name = (expr.callee as Identifier).name;
                this.errors.push(
                    `Cannot call '${name}' - it is not a function (type: ${calleeType})`
                );
            } else {
                this.errors.push(
                    `Cannot call expression - it is not a function (type: ${calleeType})`
                );
            }
        }

        for (const arg of expr.arguments) {
            this.analyzeExpression(arg);
        }

        return 'any';
    }

    /**
     * Get the current environment (for testing/debugging)
     */
    getEnvironment(): Environment {
        return this.environment;
    }

    /**
     * Get all errors collected during analysis
     */
    getErrors(): string[] {
        return this.errors;
    }
}

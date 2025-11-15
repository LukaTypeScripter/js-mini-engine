/**
 * Interpreter
 *
 * Executes a validated AST by walking through it and performing operations.
 * - Evaluates expressions (returns values)
 * - Executes statements (performs actions)
 * - Manages runtime state (variable values)
 * - Handles control flow (loops, conditionals, break, continue, return)
 */

import {
    Program,
    Statement,
    Expression,
    VariableDeclaration,
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

import { RuntimeEnvironment } from './runtime-env';
import {
    RuntimeValue,
    createNumberValue,
    createStringValue,
    createBooleanValue,
    createNullValue,
    createUndefinedValue,
    isString,
    toBoolean,
    toNumber,
    toString,
    areValuesEqual
} from './values';

import {
    BreakException,
    ContinueException,
    ReturnException
} from './control-flow';

import { TokenType } from '../core';

export class Interpreter {
    private environment: RuntimeEnvironment;

    private lastValue: RuntimeValue = createUndefinedValue();

    constructor() {
        this.environment = new RuntimeEnvironment();
    }

    /**
     * Execute a program
     */
    execute(program: Program): RuntimeValue {
        this.lastValue = createUndefinedValue();

        for (const statement of program.body) {
            this.executeStatement(statement);
        }

        return this.lastValue;
    }

    // ========================================================================
    // STATEMENT EXECUTION
    // ========================================================================

    private executeStatement(stmt: Statement): void {
        switch (stmt.type) {
            case 'VariableDeclaration':
                this.executeVariableDeclaration(stmt as VariableDeclaration);
                break;

            case 'ExpressionStatement':
                this.executeExpressionStatement(stmt as ExpressionStatement);
                break;

            case 'BlockStatement':
                this.executeBlockStatement(stmt as BlockStatement);
                break;

            case 'IfStatement':
                this.executeIfStatement(stmt as IfStatement);
                break;

            case 'WhileStatement':
                this.executeWhileStatement(stmt as WhileStatement);
                break;

            case 'ForStatement':
                this.executeForStatement(stmt as ForStatement);
                break;

            case 'ReturnStatement':
                this.executeReturnStatement(stmt as ReturnStatement);
                break;

            case 'BreakStatement':
                this.executeBreakStatement(stmt as BreakStatement);
                break;

            case 'ContinueStatement':
                this.executeContinueStatement(stmt as ContinueStatement);
                break;

            default:
                throw new Error(`Unknown statement type: ${(stmt as any).type}`);
        }
    }

    private executeVariableDeclaration(stmt: VariableDeclaration): void {
        const name = stmt.identifier.name;
        let value: RuntimeValue;

        if (stmt.initializer) {
            value = this.evaluateExpression(stmt.initializer);
        } else {
            value = createUndefinedValue();
        }

        this.environment.define(name, value);
    }

    private executeExpressionStatement(stmt: ExpressionStatement): void {
        this.lastValue = this.evaluateExpression(stmt.expression);
    }

    private executeBlockStatement(stmt: BlockStatement, newScope: boolean = true): void {
        const previousEnv = this.environment;

        if (newScope) {
            this.environment = this.environment.createChild();
        }

        try {
            for (const statement of stmt.body) {
                this.executeStatement(statement);
            }
        } finally {
            if (newScope) {
                this.environment = previousEnv;
            }
        }
    }

    private executeIfStatement(stmt: IfStatement): void {
        const condition = this.evaluateExpression(stmt.condition);

        if (toBoolean(condition)) {
            this.executeStatement(stmt.consequent);
        } else if (stmt.alternate) {
            this.executeStatement(stmt.alternate);
        }
    }

    private executeWhileStatement(stmt: WhileStatement): void {
        while (true) {
            const condition = this.evaluateExpression(stmt.condition);

            if (!toBoolean(condition)) {
                break;
            }

            try {
                this.executeStatement(stmt.body);
            } catch (error) {
                if (error instanceof BreakException) {
                    break;
                } else if (error instanceof ContinueException) {
                    continue;
                } else {
                    throw error;
                }
            }
        }
    }

    private executeForStatement(stmt: ForStatement): void {
        const previousEnv = this.environment;
        this.environment = this.environment.createChild();

        try {
            if (stmt.init) {
                this.executeStatement(stmt.init);
            }

            while (true) {
                if (stmt.condition) {
                    const condition = this.evaluateExpression(stmt.condition);
                    if (!toBoolean(condition)) {
                        break;
                    }
                }

                try {
                    this.executeStatement(stmt.body);
                } catch (error) {
                    if (error instanceof BreakException) {
                        break;
                    } else if (error instanceof ContinueException) {
                    } else {
                        throw error;
                    }
                }

                if (stmt.update) {
                    this.evaluateExpression(stmt.update);
                }
            }
        } finally {
            this.environment = previousEnv;
        }
    }

    private executeReturnStatement(stmt: ReturnStatement): void {
        const value = stmt.argument
            ? this.evaluateExpression(stmt.argument)
            : createUndefinedValue();

        throw new ReturnException(value);
    }

    private executeBreakStatement(_stmt: BreakStatement): void {
        throw new BreakException();
    }

    private executeContinueStatement(_stmt: ContinueStatement): void {
        throw new ContinueException();
    }

    // ========================================================================
    // EXPRESSION EVALUATION - Returns RuntimeValue
    // ========================================================================

    private evaluateExpression(expr: Expression): RuntimeValue {
        switch (expr.type) {
            case 'LiteralExpression':
                return this.evaluateLiteral(expr as LiteralExpression);

            case 'Identifier':
                return this.evaluateIdentifier(expr as Identifier);

            case 'BinaryExpression':
                return this.evaluateBinaryExpression(expr as BinaryExpression);

            case 'UnaryExpression':
                return this.evaluateUnaryExpression(expr as UnaryExpression);

            case 'LogicalExpression':
                return this.evaluateLogicalExpression(expr as LogicalExpression);

            case 'AssignmentExpression':
                return this.evaluateAssignmentExpression(expr as AssignmentExpression);

            case 'GroupingExpression':
                return this.evaluateGroupingExpression(expr as GroupingExpression);

            case 'CallExpression':
                return this.evaluateCallExpression(expr as CallExpression);

            default:
                throw new Error(`Unknown expression type: ${(expr as any).type}`);
        }
    }

    private evaluateLiteral(expr: LiteralExpression): RuntimeValue {
        const value = expr.value;

        if (typeof value === 'number') {
            return createNumberValue(value);
        } else if (typeof value === 'string') {
            return createStringValue(value);
        } else if (typeof value === 'boolean') {
            return createBooleanValue(value);
        } else if (value === null) {
            return createNullValue();
        }

        return createUndefinedValue();
    }

    private evaluateIdentifier(expr: Identifier): RuntimeValue {
        const name = expr.name;
        const value = this.environment.lookup(name);

        if (value === undefined) {
            throw new Error(`Runtime Error: Variable '${name}' is not defined`);
        }

        return value;
    }

    private evaluateBinaryExpression(expr: BinaryExpression): RuntimeValue {
        const left = this.evaluateExpression(expr.left);
        const right = this.evaluateExpression(expr.right);

        if (expr.operator === TokenType.PLUS) {
            if (isString(left) || isString(right)) {
                return createStringValue(toString(left) + toString(right));
            }
            return createNumberValue(toNumber(left) + toNumber(right));
        }

        if (expr.operator === TokenType.MINUS) {
            return createNumberValue(toNumber(left) - toNumber(right));
        }

        if (expr.operator === TokenType.STAR) {
            return createNumberValue(toNumber(left) * toNumber(right));
        }

        if (expr.operator === TokenType.SLASH) {
            const rightNum = toNumber(right);
            if (rightNum === 0) {
                return createNumberValue(Infinity);
            }
            return createNumberValue(toNumber(left) / rightNum);
        }

        if (expr.operator === TokenType.PERCENT) {
            return createNumberValue(toNumber(left) % toNumber(right));
        }

        if (expr.operator === TokenType.LESS) {
            return createBooleanValue(toNumber(left) < toNumber(right));
        }

        if (expr.operator === TokenType.LESS_EQUAL) {
            return createBooleanValue(toNumber(left) <= toNumber(right));
        }

        if (expr.operator === TokenType.GREATER) {
            return createBooleanValue(toNumber(left) > toNumber(right));
        }

        if (expr.operator === TokenType.GREATER_EQUAL) {
            return createBooleanValue(toNumber(left) >= toNumber(right));
        }

        if (expr.operator === TokenType.EQUAL_EQUAL) {
            return createBooleanValue(areValuesEqual(left, right));
        }

        if (expr.operator === TokenType.BANG_EQUAL) {
            return createBooleanValue(!areValuesEqual(left, right));
        }

        throw new Error(`Unknown binary operator: ${expr.operator}`);
    }

    private evaluateUnaryExpression(expr: UnaryExpression): RuntimeValue {
        const operand = this.evaluateExpression(expr.argument);

        if (expr.operator === TokenType.MINUS) {
            return createNumberValue(-toNumber(operand));
        }

        if (expr.operator === TokenType.BANG) {
            return createBooleanValue(!toBoolean(operand));
        }

        throw new Error(`Unknown unary operator: ${expr.operator}`);
    }

    private evaluateLogicalExpression(expr: LogicalExpression): RuntimeValue {
        const left = this.evaluateExpression(expr.left);

        if (expr.operator === TokenType.AND) {
            if (!toBoolean(left)) {
                return left;
            }
            return this.evaluateExpression(expr.right);
        }

        if (expr.operator === TokenType.OR) {
            if (toBoolean(left)) {
                return left;
            }
            return this.evaluateExpression(expr.right);
        }

        throw new Error(`Unknown logical operator: ${expr.operator}`);
    }

    private evaluateAssignmentExpression(expr: AssignmentExpression): RuntimeValue {
        const name = expr.left.name;
        const value = this.evaluateExpression(expr.right);

        const success = this.environment.assign(name, value);

        if (!success) {
            throw new Error(`Runtime Error: Cannot assign to undefined variable '${name}'`);
        }

        return value;
    }

    private evaluateGroupingExpression(expr: GroupingExpression): RuntimeValue {
        return this.evaluateExpression(expr.expression);
    }

    private evaluateCallExpression(_expr: CallExpression): RuntimeValue {
        // TODO: Implement when we add functions
        throw new Error('Function calls not yet implemented');
    }

    /**
     * Get the last evaluated value (for REPL)
     */
    getLastValue(): RuntimeValue {
        return this.lastValue;
    }

    /**
     * Get the current environment (for testing/debugging)
     */
    getEnvironment(): RuntimeEnvironment {
        return this.environment;
    }

    /**
     * Reset the interpreter state
     */
    reset(): void {
        this.environment = new RuntimeEnvironment();
        this.lastValue = createUndefinedValue();
    }
}

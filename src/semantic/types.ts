/**
 * Type System
 *
 * Defines types and type checking logic for the language.
 * Supports basic types: number, string, boolean, null, any
 */

import {  LiteralExpression } from '../ast/nodes';
import { TokenType } from '../core';

// Type names
export type TypeName = 'number' | 'string' | 'boolean' | 'null' | 'any' | 'undefined';

/**
 * Infer the type of a literal expression
 */
export function inferLiteralType(expr: LiteralExpression): TypeName {
    const value = expr.value;

    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'boolean') return 'boolean';
    if (value === null) return 'null';

    return 'any';
}

/**
 * Check if a binary operation is valid for the given types
 * Returns the result type or throws an error
 */
export function checkBinaryOperation(
    left: TypeName,
    operator: TokenType,
    right: TypeName
): TypeName {
    if (
        operator === TokenType.PLUS ||
        operator === TokenType.MINUS ||
        operator === TokenType.STAR ||
        operator === TokenType.SLASH ||
        operator === TokenType.PERCENT
    ) {
        if (operator === TokenType.PLUS && (left === 'string' || right === 'string')) {
            return 'string';
        }

        if (left === 'number' && right === 'number') {
            return 'number';
        }

        if (left === 'any' || right === 'any') {
            return 'any';
        }

        throw new Error(
            `Type error: Cannot perform ${getOperatorSymbol(operator)} operation on ${left} and ${right}`
        );
    }

    if (
        operator === TokenType.LESS ||
        operator === TokenType.LESS_EQUAL ||
        operator === TokenType.GREATER ||
        operator === TokenType.GREATER_EQUAL
    ) {
        if (left === 'number' && right === 'number') {
            return 'boolean';
        }

        if (left === 'string' && right === 'string') {
            return 'boolean';
        }

        if (left === 'any' || right === 'any') {
            return 'boolean';
        }

        throw new Error(
            `Type error: Cannot compare ${left} and ${right} with ${getOperatorSymbol(operator)}`
        );
    }

    if (operator === TokenType.EQUAL_EQUAL || operator === TokenType.BANG_EQUAL) {
        return 'boolean';
    }

    throw new Error(`Unknown binary operator: ${operator}`);
}

/**
 * Check if a unary operation is valid for the given type
 * Returns the result type or throws an error
 */
export function checkUnaryOperation(operator: TokenType, operand: TypeName): TypeName {
    if (operator === TokenType.BANG) {
        return 'boolean';
    }

    if (operator === TokenType.MINUS) {
        if (operand === 'number') {
            return 'number';
        }

        if (operand === 'any') {
            return 'any';
        }

        throw new Error(`Type error: Cannot negate ${operand}`);
    }

    throw new Error(`Unknown unary operator: ${operator}`);
}

/**
 * Check if a logical operation is valid
 * Logical operators: &&, ||
 */
export function checkLogicalOperation(
    _left: TypeName,
    operator: TokenType,
    _right: TypeName
): TypeName {
    if (operator === TokenType.AND || operator === TokenType.OR) {
        return 'any';
    }

    throw new Error(`Unknown logical operator: ${operator}`);
}

/**
 * Check if two types are compatible (for assignment)
 */
export function areTypesCompatible(target: TypeName, source: TypeName): boolean {
    if (target === source) return true;

    if (target === 'any' || source === 'any') return true;

    if (target === 'undefined') return true;

    return false;
}

/**
 * Get the union of two types
 * Used when a variable might have different types in different branches
 */
export function unionTypes(type1: TypeName, type2: TypeName): TypeName {
    if (type1 === type2) return type1;
    if (type1 === 'any' || type2 === 'any') return 'any';


    return 'any';
}

/**
 * Helper: Get operator symbol for error messages
 */
function getOperatorSymbol(operator: TokenType): string {
    switch (operator) {
        case TokenType.PLUS: return '+';
        case TokenType.MINUS: return '-';
        case TokenType.STAR: return '*';
        case TokenType.SLASH: return '/';
        case TokenType.PERCENT: return '%';
        case TokenType.LESS: return '<';
        case TokenType.LESS_EQUAL: return '<=';
        case TokenType.GREATER: return '>';
        case TokenType.GREATER_EQUAL: return '>=';
        case TokenType.EQUAL_EQUAL: return '==';
        case TokenType.BANG_EQUAL: return '!=';
        case TokenType.BANG: return '!';
        case TokenType.AND: return '&&';
        case TokenType.OR: return '||';
        default: return operator.toString();
    }
}

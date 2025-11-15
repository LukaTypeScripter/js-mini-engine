/**
 * Runtime Value System
 *
 * Represents actual values during program execution.
 * Unlike the type system (which tracks static types),
 * this tracks the actual runtime values.
 */

export type RuntimeValueType = 'number' | 'string' | 'boolean' | 'null' | 'undefined';

export interface RuntimeValue {
    type: RuntimeValueType;
    value: number | string | boolean | null | undefined;
}

// ========================================================================
// VALUE CONSTRUCTORS
// ========================================================================

export function createNumberValue(value: number): RuntimeValue {
    return { type: 'number', value };
}

export function createStringValue(value: string): RuntimeValue {
    return { type: 'string', value };
}

export function createBooleanValue(value: boolean): RuntimeValue {
    return { type: 'boolean', value };
}

export function createNullValue(): RuntimeValue {
    return { type: 'null', value: null };
}

export function createUndefinedValue(): RuntimeValue {
    return { type: 'undefined', value: undefined };
}

// ========================================================================
// TYPE CHECKING
// ========================================================================

export function isNumber(value: RuntimeValue): value is RuntimeValue & { type: 'number', value: number } {
    return value.type === 'number';
}

export function isString(value: RuntimeValue): value is RuntimeValue & { type: 'string', value: string } {
    return value.type === 'string';
}

export function isBoolean(value: RuntimeValue): value is RuntimeValue & { type: 'boolean', value: boolean } {
    return value.type === 'boolean';
}

export function isNull(value: RuntimeValue): value is RuntimeValue & { type: 'null', value: null } {
    return value.type === 'null';
}

export function isUndefined(value: RuntimeValue): value is RuntimeValue & { type: 'undefined', value: undefined } {
    return value.type === 'undefined';
}

// ========================================================================
// VALUE CONVERSION
// ========================================================================

/**
 * Convert a runtime value to a JavaScript boolean (for conditionals)
 * Follows JavaScript truthiness rules
 */
export function toBoolean(value: RuntimeValue): boolean {
    switch (value.type) {
        case 'boolean':
            return value.value as boolean;
        case 'number':
            return value.value !== 0 && !Number.isNaN(value.value as number);
        case 'string':
            return (value.value as string).length > 0;
        case 'null':
        case 'undefined':
            return false;
        default:
            return true;
    }
}

/**
 * Convert a runtime value to a JavaScript string (for display)
 */
export function toString(value: RuntimeValue): string {
    switch (value.type) {
        case 'number':
        case 'boolean':
            return String(value.value);
        case 'string':
            return value.value as string;
        case 'null':
            return 'null';
        case 'undefined':
            return 'undefined';
        default:
            return '[Unknown Value]';
    }
}

/**
 * Convert a runtime value to a JavaScript number (for arithmetic)
 */
export function toNumber(value: RuntimeValue): number {
    switch (value.type) {
        case 'number':
            return value.value as number;
        case 'boolean':
            return (value.value as boolean) ? 1 : 0;
        case 'string':
            const num = Number(value.value);
            return Number.isNaN(num) ? 0 : num;
        case 'null':
            return 0;
        case 'undefined':
            return NaN;
        default:
            return NaN;
    }
}

/**
 * Check if two runtime values are equal
 * Uses JavaScript's == semantics
 */
export function areValuesEqual(left: RuntimeValue, right: RuntimeValue): boolean {
    if (left.type === right.type) {
        return left.value === right.value;
    }

    if ((isNull(left) && isUndefined(right)) || (isUndefined(left) && isNull(right))) {
        return true;
    }

    if (isNumber(left) || isNumber(right)) {
        return toNumber(left) === toNumber(right);
    }

    return false;
}

/**
 * Display a runtime value for debugging
 */
export function displayValue(value: RuntimeValue): string {
    switch (value.type) {
        case 'string':
            return `"${value.value}"`;
        case 'number':
        case 'boolean':
        case 'null':
        case 'undefined':
            return toString(value);
        default:
            return '[Unknown]';
    }
}

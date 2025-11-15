/**
 * Control Flow Exceptions
 *
 * Special exceptions used to implement control flow statements.
 * These are thrown during interpretation and caught by loop/function handlers.
 *
 * - BreakException: Thrown by 'break' statement
 * - ContinueException: Thrown by 'continue' statement
 * - ReturnException: Thrown by 'return' statement (carries return value)
 */

import { RuntimeValue, createUndefinedValue } from './values';

/**
 * Thrown when a 'break' statement is executed
 * Caught by the nearest enclosing loop
 */
export class BreakException extends Error {
    constructor() {
        super('break');
        this.name = 'BreakException';
    }
}

/**
 * Thrown when a 'continue' statement is executed
 * Caught by the nearest enclosing loop
 */
export class ContinueException extends Error {
    constructor() {
        super('continue');
        this.name = 'ContinueException';
    }
}

/**
 * Thrown when a 'return' statement is executed
 * Caught by the function call handler
 * Carries the return value
 */
export class ReturnException extends Error {
    public value: RuntimeValue;

    constructor(value: RuntimeValue = createUndefinedValue()) {
        super('return');
        this.name = 'ReturnException';
        this.value = value;
    }
}

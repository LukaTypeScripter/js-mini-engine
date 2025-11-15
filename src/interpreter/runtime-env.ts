/**
 * Runtime Environment
 *
 * Stores actual variable values during program execution.
 * Similar to semantic analyzer's Environment, but stores VALUES instead of TYPES.
 *
 * Example:
 * Semantic: { x: { kind: 'let', type: 'number' } }
 * Runtime:  { x: { type: 'number', value: 42 } }
 */

import { RuntimeValue } from './values';

export class RuntimeEnvironment {
    private variables: Map<string, RuntimeValue> = new Map();

    private parent: RuntimeEnvironment | null = null;

    constructor(parent: RuntimeEnvironment | null = null) {
        this.parent = parent;
    }

    /**
     * Define a new variable in THIS scope
     * Unlike semantic analyzer, we allow shadowing without error
     */
    define(name: string, value: RuntimeValue): void {
        this.variables.set(name, value);
    }

    /**
     * Look up a variable's value in this scope or parent scopes
     * Returns undefined if not found
     */
    lookup(name: string): RuntimeValue | undefined {
        if (this.variables.has(name)) {
            return this.variables.get(name);
        }

        if (this.parent !== null) {
            return this.parent.lookup(name);
        }

        return undefined;
    }

    /**
     * Check if a variable exists in this scope or parent scopes
     */
    exists(name: string): boolean {
        return this.lookup(name) !== undefined;
    }

    /**
     * Assign a new value to an existing variable
     * Searches through scope chain to find the variable
     * Returns true if assignment succeeded, false if variable not found
     */
    assign(name: string, value: RuntimeValue): boolean {
        if (this.variables.has(name)) {
            this.variables.set(name, value);
            return true;
        }

        if (this.parent !== null) {
            return this.parent.assign(name, value);
        }

        return false;
    }

    /**
     * Create a child scope
     */
    createChild(): RuntimeEnvironment {
        return new RuntimeEnvironment(this);
    }

    /**
     * Get parent environment
     */
    getParent(): RuntimeEnvironment | null {
        return this.parent;
    }

    /**
     * Check if this is the global scope
     */
    isGlobal(): boolean {
        return this.parent === null;
    }

    /**
     * Get all variables in this scope (not including parents)
     * For debugging/testing
     */
    getVariables(): Map<string, RuntimeValue> {
        return new Map(this.variables);
    }

    /**
     * Clear all variables in this scope
     */
    clear(): void {
        this.variables.clear();
    }
}

/**
 * Environment (Symbol Table)
 *
 * Manages variable scopes and symbol lookup.
 * Each block/scope has its own environment that can access parent scopes.
 *
 * Example scope chain:
 * Global: { x: ... }
 *   └─ Block: { y: ... }  // Can access both x and y
 *       └─ Block: { z: ... }  // Can access x, y, and z
 */

import { TypeName } from './types';

export type VariableKind = 'let' | 'const';

export interface SymbolInfo {
    kind: VariableKind;
    type: TypeName;
    initialized: boolean;
    line: number;
    column: number;
}

export class Environment {
    private symbols: Map<string, SymbolInfo> = new Map();

    private parent: Environment | null = null;

    constructor(parent: Environment | null = null) {
        this.parent = parent;
    }

    /**
     * Define a new variable in THIS scope
     * Throws error if variable already exists in THIS scope
     */
    define(name: string, info: SymbolInfo): void {
        if (this.symbols.has(name)) {
            const existing = this.symbols.get(name)!;
            throw new Error(
                `Variable '${name}' already declared in this scope at line ${existing.line}:${existing.column}`
            );
        }

        this.symbols.set(name, info);
    }

    /**
     * Look up a variable in this scope or parent scopes
     * Returns undefined if not found
     */
    lookup(name: string): SymbolInfo | undefined {
        if (this.symbols.has(name)) {
            return this.symbols.get(name);
        }

        if (this.parent !== null) {
            return this.parent.lookup(name);
        }

        return undefined;
    }

    /**
     * Check if variable exists in this scope or parent scopes
     */
    exists(name: string): boolean {
        return this.lookup(name) !== undefined;
    }

    /**
     * Update an existing variable's value
     * Used for assignment validation
     * Returns the symbol info if found, undefined otherwise
     */
    assign(name: string): SymbolInfo | undefined {
        if (this.symbols.has(name)) {
            const info = this.symbols.get(name)!;

            if (info.kind === 'const') {
                throw new Error(
                    `Cannot assign to const variable '${name}' (declared at line ${info.line}:${info.column})`
                );
            }

            return info;
        }

        if (this.parent !== null) {
            return this.parent.assign(name);
        }

        return undefined;
    }

    /**
     * Create a child scope
     */
    createChild(): Environment {
        return new Environment(this);
    }

    /**
     * Get parent environment
     */
    getParent(): Environment | null {
        return this.parent;
    }

    /**
     * Check if this is the global scope
     */
    isGlobal(): boolean {
        return this.parent === null;
    }

    /**
     * Get all symbols in this scope (not including parents)
     */
    getSymbols(): Map<string, SymbolInfo> {
        return new Map(this.symbols);
    }
}

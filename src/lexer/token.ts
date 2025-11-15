import {TokenType} from "../core";


/**
 * Token class - Represents a single token with metadata
 */
export class Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;

  constructor(type: TokenType, value: string, line: number = 1, column: number = 0) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }

  /**
   * String representation of the token for debugging
   */
  toString(): string {
    return `Token(${this.type}, '${this.value}', ${this.line}:${this.column})`;
  }

  /**
   * Check if token is of a specific type
   */
  is(type: TokenType): boolean {
    return this.type === type;
  }

  /**
   * Check if token is one of multiple types
   */
  isOneOf(...types: TokenType[]): boolean {
    return types.includes(this.type);
  }
}





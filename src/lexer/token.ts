/**
 * Token Types - All possible token types in the language
 */
export enum TokenType {
  // Literals
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  IDENTIFIER = 'IDENTIFIER',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NULL = 'NULL',

  // Operators - Arithmetic
  PLUS = 'PLUS',          // +
  MINUS = 'MINUS',        // -
  STAR = 'STAR',          // *
  SLASH = 'SLASH',        // /
  PERCENT = 'PERCENT',    // %

  // Operators - Comparison
  EQUAL_EQUAL = 'EQUAL_EQUAL',      // ==
  BANG_EQUAL = 'BANG_EQUAL',        // !=
  LESS = 'LESS',                    // <
  LESS_EQUAL = 'LESS_EQUAL',        // <=
  GREATER = 'GREATER',              // >
  GREATER_EQUAL = 'GREATER_EQUAL',  // >=

  // Operators - Logical
  BANG = 'BANG',          // !
  AND = 'AND',            // &&
  OR = 'OR',              // ||

  // Operators - Assignment
  EQUAL = 'EQUAL',        // =

  // Punctuation
  LPAREN = 'LPAREN',      // (
  RPAREN = 'RPAREN',      // )
  LBRACE = 'LBRACE',      // {
  RBRACE = 'RBRACE',      // }
  LBRACKET = 'LBRACKET',  // [
  RBRACKET = 'RBRACKET',  // ]
  SEMICOLON = 'SEMICOLON', // ;
  COMMA = 'COMMA',        // ,
  DOT = 'DOT',            // .
  COLON = 'COLON',        // :

  // Keywords
  LET = 'LET',
  CONST = 'CONST',
  FUNCTION = 'FUNCTION',
  RETURN = 'RETURN',
  IF = 'IF',
  ELSE = 'ELSE',
  WHILE = 'WHILE',
  FOR = 'FOR',
  BREAK = 'BREAK',
  CONTINUE = 'CONTINUE',
  PRINT = 'PRINT',

  // Special
  EOF = 'EOF',
  ILLEGAL = 'ILLEGAL',
}

export interface TokenI {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

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

/**
 * Keywords map - Maps keyword strings to their token types
 */
export const KEYWORDS: Map<string, TokenType> = new Map([
  ['let', TokenType.LET],
  ['const', TokenType.CONST],
  ['function', TokenType.FUNCTION],
  ['return', TokenType.RETURN],
  ['if', TokenType.IF],
  ['else', TokenType.ELSE],
  ['while', TokenType.WHILE],
  ['for', TokenType.FOR],
  ['break', TokenType.BREAK],
  ['continue', TokenType.CONTINUE],
  ['true', TokenType.TRUE],
  ['false', TokenType.FALSE],
  ['null', TokenType.NULL],
  ['print', TokenType.PRINT],
]);

/**
 * Helper function to check if identifier is a keyword
 */
export function lookupIdentifier(identifier: string): TokenType {
  return KEYWORDS.get(identifier) || TokenType.IDENTIFIER;
}

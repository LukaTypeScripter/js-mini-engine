/**
 * AST Node Types - Represents the structure of parsed code
 */


import {TokenType} from "../core";

/**
 * Base interface for all AST nodes
 */
export interface Node {
  type: string;
}

/**
 * Base interface for all Expression nodes
 * Expressions produce values
 */
export interface Expression extends Node {}

/**
 * Base interface for all Statement nodes
 * Statements perform actions
 */
export interface Statement extends Node {}

// ============================================================================
// EXPRESSION NODES
// ============================================================================

/**
 * Literal values: numbers, strings, booleans, null
 * Examples: 42, "hello", true, null
 */
export interface LiteralExpression extends Expression {
  type: 'LiteralExpression';
  value: number | string | boolean | null;
  raw: string;
}

/**
 * Variable/identifier references
 * Example: myVar, userName
 */
export interface Identifier extends Expression {
  type: 'Identifier';
  name: string;
}

/**
 * Binary operations: +, -, *, /, ==, !=, <, >, etc.
 * Example: 2 + 3, x == 5
 */
export interface BinaryExpression extends Expression {
  type: 'BinaryExpression';
  left: Expression;
  operator: TokenType;
  right: Expression;
}

/**
 * Unary operations: -, !, etc.
 * Example: -x, !flag
 */
export interface UnaryExpression extends Expression {
  type: 'UnaryExpression';
  operator: TokenType;
  argument: Expression;
}

/**
 * Logical operations: &&, ||
 * Example: x && y, a || b
 */
export interface LogicalExpression extends Expression {
  type: 'LogicalExpression';
  left: Expression;
  operator: TokenType; // AND or OR
  right: Expression;
}

/**
 * Assignment: x = 5
 */
export interface AssignmentExpression extends Expression {
  type: 'AssignmentExpression';
  left: Identifier;
  operator: TokenType; // EQUAL
  right: Expression;
}

/**
 * Function call: func(arg1, arg2)
 */
export interface CallExpression extends Expression {
  type: 'CallExpression';
  callee: Expression; // Usually an Identifier
  arguments: Expression[];
}

/**
 * Grouping with parentheses: (2 + 3)
 */
export interface GroupingExpression extends Expression {
  type: 'GroupingExpression';
  expression: Expression;
}

// ============================================================================
// STATEMENT NODES
// ============================================================================

/**
 * Expression used as a statement
 * Example: x + 1;
 */
export interface ExpressionStatement extends Statement {
  type: 'ExpressionStatement';
  expression: Expression;
}

/**
 * Variable declaration
 * Example: let x = 10; const y = 20;
 */
export interface VariableDeclaration extends Statement {
  type: 'VariableDeclaration';
  kind: 'let' | 'const';
  identifier: Identifier;
  initializer: Expression | null;
}

/**
 * Block of statements: { ... }
 */
export interface BlockStatement extends Statement {
  type: 'BlockStatement';
  body: Statement[];
}

/**
 * If statement: if (condition) { ... } else { ... }
 */
export interface IfStatement extends Statement {
  type: 'IfStatement';
  condition: Expression;
  consequent: Statement;
  alternate: Statement | null;
}

/**
 * While loop: while (condition) { ... }
 */
export interface WhileStatement extends Statement {
  type: 'WhileStatement';
  condition: Expression;
  body: Statement;
}

/**
 * For loop: for (init; condition; update) { ... }
 */
export interface ForStatement extends Statement {
  type: 'ForStatement';
  init: VariableDeclaration | ExpressionStatement | null;
  condition: Expression | null;
  update: Expression | null;
  body: Statement;
}

/**
 * Function declaration
 * Example: function add(x, y) { return x + y; }
 */
export interface FunctionDeclaration extends Statement {
  type: 'FunctionDeclaration';
  name: Identifier;
  parameters: Identifier[];
  body: BlockStatement;
}

/**
 * Return statement: return x;
 */
export interface ReturnStatement extends Statement {
  type: 'ReturnStatement';
  argument: Expression | null;
}

/**
 * Break statement: break;
 */
export interface BreakStatement extends Statement {
  type: 'BreakStatement';
}

/**
 * Continue statement: continue;
 */
export interface ContinueStatement extends Statement {
  type: 'ContinueStatement';
}

/**
 * Program - Root node of the AST
 */
export interface Program extends Node {
  type: 'Program';
  body: Statement[];
}

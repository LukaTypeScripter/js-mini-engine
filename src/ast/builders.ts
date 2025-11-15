/**
 * AST Node Builder Functions
 * Helper functions to create AST nodes easily
 */

import * as AST from './nodes';
import {TokenType} from "../core";

// ============================================================================
// EXPRESSION BUILDERS
// ============================================================================

export function createLiteral(
  value: number | string | boolean | null,
  raw: string
): AST.LiteralExpression {
  return {
    type: 'LiteralExpression',
    value,
    raw,
  };
}

export function createIdentifier(name: string): AST.Identifier {
  return {
    type: 'Identifier',
    name,
  };
}

export function createBinaryExpression(
  left: AST.Expression,
  operator: TokenType,
  right: AST.Expression
): AST.BinaryExpression {
  return {
    type: 'BinaryExpression',
    left,
    operator,
    right,
  };
}

export function createUnaryExpression(
  operator: TokenType,
  argument: AST.Expression
): AST.UnaryExpression {
  return {
    type: 'UnaryExpression',
    operator,
    argument,
  };
}

export function createLogicalExpression(
  left: AST.Expression,
  operator: TokenType,
  right: AST.Expression
): AST.LogicalExpression {
  return {
    type: 'LogicalExpression',
    left,
    operator,
    right,
  };
}

export function createAssignmentExpression(
  left: AST.Identifier,
  operator: TokenType,
  right: AST.Expression
): AST.AssignmentExpression {
  return {
    type: 'AssignmentExpression',
    left,
    operator,
    right,
  };
}

export function createCallExpression(
  callee: AST.Expression,
  args: AST.Expression[]
): AST.CallExpression {
  return {
    type: 'CallExpression',
    callee,
    arguments: args,
  };
}

export function createGroupingExpression(
  expression: AST.Expression
): AST.GroupingExpression {
  return {
    type: 'GroupingExpression',
    expression,
  };
}

// ============================================================================
// STATEMENT BUILDERS
// ============================================================================

export function createExpressionStatement(
  expression: AST.Expression
): AST.ExpressionStatement {
  return {
    type: 'ExpressionStatement',
    expression,
  };
}

export function createVariableDeclaration(
  kind: 'let' | 'const',
  identifier: AST.Identifier,
  initializer: AST.Expression | null
): AST.VariableDeclaration {
  return {
    type: 'VariableDeclaration',
    kind,
    identifier,
    initializer,
  };
}

export function createBlockStatement(body: AST.Statement[]): AST.BlockStatement {
  return {
    type: 'BlockStatement',
    body,
  };
}

export function createIfStatement(
  condition: AST.Expression,
  consequent: AST.Statement,
  alternate: AST.Statement | null = null
): AST.IfStatement {
  return {
    type: 'IfStatement',
    condition,
    consequent,
    alternate,
  };
}

export function createWhileStatement(
  condition: AST.Expression,
  body: AST.Statement
): AST.WhileStatement {
  return {
    type: 'WhileStatement',
    condition,
    body,
  };
}

export function createForStatement(
  init: AST.VariableDeclaration | AST.ExpressionStatement | null,
  condition: AST.Expression | null,
  update: AST.Expression | null,
  body: AST.Statement
): AST.ForStatement {
  return {
    type: 'ForStatement',
    init,
    condition,
    update,
    body,
  };
}

export function createFunctionDeclaration(
  name: AST.Identifier,
  parameters: AST.Identifier[],
  body: AST.BlockStatement
): AST.FunctionDeclaration {
  return {
    type: 'FunctionDeclaration',
    name,
    parameters,
    body,
  };
}

export function createReturnStatement(
  argument: AST.Expression | null
): AST.ReturnStatement {
  return {
    type: 'ReturnStatement',
    argument,
  };
}

export function createBreakStatement(): AST.BreakStatement {
  return {
    type: 'BreakStatement',
  };
}

export function createContinueStatement(): AST.ContinueStatement {
  return {
    type: 'ContinueStatement',
  };
}

export function createProgram(body: AST.Statement[]): AST.Program {
  return {
    type: 'Program',
    body,
  };
}

import * as AST from '../../src/ast/builders';
import { TokenType } from '../../src/core';

describe('AST Builders', () => {
  describe('Expression Builders', () => {
    describe('createLiteral', () => {
      it('should create number literal', () => {
        const node = AST.createLiteral(42, '42');

        expect(node.type).toBe('LiteralExpression');
        expect(node.value).toBe(42);
        expect(node.raw).toBe('42');
      });

      it('should create string literal', () => {
        const node = AST.createLiteral('hello', '"hello"');

        expect(node.type).toBe('LiteralExpression');
        expect(node.value).toBe('hello');
        expect(node.raw).toBe('"hello"');
      });

      it('should create boolean literal', () => {
        const node = AST.createLiteral(true, 'true');

        expect(node.value).toBe(true);
      });

      it('should create null literal', () => {
        const node = AST.createLiteral(null, 'null');

        expect(node.value).toBe(null);
      });
    });

    describe('createIdentifier', () => {
      it('should create identifier', () => {
        const node = AST.createIdentifier('myVar');

        expect(node.type).toBe('Identifier');
        expect(node.name).toBe('myVar');
      });
    });

    describe('createBinaryExpression', () => {
      it('should create binary expression', () => {
        const left = AST.createLiteral(2, '2');
        const right = AST.createLiteral(3, '3');
        const node = AST.createBinaryExpression(left, TokenType.PLUS, right);

        expect(node.type).toBe('BinaryExpression');
        expect(node.operator).toBe(TokenType.PLUS);
        expect(node.left).toBe(left);
        expect(node.right).toBe(right);
      });
    });

    describe('createUnaryExpression', () => {
      it('should create unary expression', () => {
        const argument = AST.createIdentifier('x');
        const node = AST.createUnaryExpression(TokenType.MINUS, argument);

        expect(node.type).toBe('UnaryExpression');
        expect(node.operator).toBe(TokenType.MINUS);
        expect(node.argument).toBe(argument);
      });
    });

    describe('createLogicalExpression', () => {
      it('should create logical AND expression', () => {
        const left = AST.createIdentifier('x');
        const right = AST.createIdentifier('y');
        const node = AST.createLogicalExpression(left, TokenType.AND, right);

        expect(node.type).toBe('LogicalExpression');
        expect(node.operator).toBe(TokenType.AND);
        expect(node.left).toBe(left);
        expect(node.right).toBe(right);
      });
    });

    describe('createAssignmentExpression', () => {
      it('should create assignment expression', () => {
        const identifier = AST.createIdentifier('x');
        const value = AST.createLiteral(10, '10');
        const node = AST.createAssignmentExpression(identifier, TokenType.EQUAL, value);

        expect(node.type).toBe('AssignmentExpression');
        expect(node.left).toBe(identifier);
        expect(node.operator).toBe(TokenType.EQUAL);
        expect(node.right).toBe(value);
      });
    });

    describe('createCallExpression', () => {
      it('should create call expression with arguments', () => {
        const callee = AST.createIdentifier('func');
        const args = [AST.createLiteral(1, '1'), AST.createLiteral(2, '2')];
        const node = AST.createCallExpression(callee, args);

        expect(node.type).toBe('CallExpression');
        expect(node.callee).toBe(callee);
        expect(node.arguments).toHaveLength(2);
        expect(node.arguments[0]).toBe(args[0]);
      });

      it('should create call expression without arguments', () => {
        const callee = AST.createIdentifier('func');
        const node = AST.createCallExpression(callee, []);

        expect(node.arguments).toHaveLength(0);
      });
    });

    describe('createGroupingExpression', () => {
      it('should create grouping expression', () => {
        const expr = AST.createLiteral(5, '5');
        const node = AST.createGroupingExpression(expr);

        expect(node.type).toBe('GroupingExpression');
        expect(node.expression).toBe(expr);
      });
    });
  });

  describe('Statement Builders', () => {
    describe('createExpressionStatement', () => {
      it('should create expression statement', () => {
        const expr = AST.createIdentifier('x');
        const node = AST.createExpressionStatement(expr);

        expect(node.type).toBe('ExpressionStatement');
        expect(node.expression).toBe(expr);
      });
    });

    describe('createVariableDeclaration', () => {
      it('should create let declaration with initializer', () => {
        const id = AST.createIdentifier('x');
        const init = AST.createLiteral(10, '10');
        const node = AST.createVariableDeclaration('let', id, init);

        expect(node.type).toBe('VariableDeclaration');
        expect(node.kind).toBe('let');
        expect(node.identifier).toBe(id);
        expect(node.initializer).toBe(init);
      });

      it('should create const declaration', () => {
        const id = AST.createIdentifier('PI');
        const init = AST.createLiteral(3.14, '3.14');
        const node = AST.createVariableDeclaration('const', id, init);

        expect(node.kind).toBe('const');
      });

      it('should create declaration without initializer', () => {
        const id = AST.createIdentifier('x');
        const node = AST.createVariableDeclaration('let', id, null);

        expect(node.initializer).toBe(null);
      });
    });

    describe('createBlockStatement', () => {
      it('should create block with statements', () => {
        const stmt1 = AST.createExpressionStatement(AST.createLiteral(1, '1'));
        const stmt2 = AST.createExpressionStatement(AST.createLiteral(2, '2'));
        const node = AST.createBlockStatement([stmt1, stmt2]);

        expect(node.type).toBe('BlockStatement');
        expect(node.body).toHaveLength(2);
        expect(node.body[0]).toBe(stmt1);
      });

      it('should create empty block', () => {
        const node = AST.createBlockStatement([]);

        expect(node.body).toHaveLength(0);
      });
    });

    describe('createIfStatement', () => {
      it('should create if statement with else', () => {
        const condition = AST.createLiteral(true, 'true');
        const consequent = AST.createBlockStatement([]);
        const alternate = AST.createBlockStatement([]);
        const node = AST.createIfStatement(condition, consequent, alternate);

        expect(node.type).toBe('IfStatement');
        expect(node.condition).toBe(condition);
        expect(node.consequent).toBe(consequent);
        expect(node.alternate).toBe(alternate);
      });

      it('should create if statement without else', () => {
        const condition = AST.createLiteral(true, 'true');
        const consequent = AST.createBlockStatement([]);
        const node = AST.createIfStatement(condition, consequent);

        expect(node.alternate).toBe(null);
      });
    });

    describe('createWhileStatement', () => {
      it('should create while statement', () => {
        const condition = AST.createLiteral(true, 'true');
        const body = AST.createBlockStatement([]);
        const node = AST.createWhileStatement(condition, body);

        expect(node.type).toBe('WhileStatement');
        expect(node.condition).toBe(condition);
        expect(node.body).toBe(body);
      });
    });

    describe('createForStatement', () => {
      it('should create for statement with all parts', () => {
        const init = AST.createVariableDeclaration(
          'let',
          AST.createIdentifier('i'),
          AST.createLiteral(0, '0')
        );
        const condition = AST.createBinaryExpression(
          AST.createIdentifier('i'),
          TokenType.LESS,
          AST.createLiteral(10, '10')
        );
        const update = AST.createAssignmentExpression(
          AST.createIdentifier('i'),
          TokenType.EQUAL,
          AST.createLiteral(1, '1')
        );
        const body = AST.createBlockStatement([]);
        const node = AST.createForStatement(init, condition, update, body);

        expect(node.type).toBe('ForStatement');
        expect(node.init).toBe(init);
        expect(node.condition).toBe(condition);
        expect(node.update).toBe(update);
        expect(node.body).toBe(body);
      });
    });

    describe('createFunctionDeclaration', () => {
      it('should create function with parameters', () => {
        const name = AST.createIdentifier('add');
        const params = [AST.createIdentifier('x'), AST.createIdentifier('y')];
        const body = AST.createBlockStatement([]);
        const node = AST.createFunctionDeclaration(name, params, body);

        expect(node.type).toBe('FunctionDeclaration');
        expect(node.name).toBe(name);
        expect(node.parameters).toHaveLength(2);
        expect(node.body).toBe(body);
      });

      it('should create function without parameters', () => {
        const name = AST.createIdentifier('foo');
        const body = AST.createBlockStatement([]);
        const node = AST.createFunctionDeclaration(name, [], body);

        expect(node.parameters).toHaveLength(0);
      });
    });

    describe('createReturnStatement', () => {
      it('should create return with value', () => {
        const value = AST.createLiteral(42, '42');
        const node = AST.createReturnStatement(value);

        expect(node.type).toBe('ReturnStatement');
        expect(node.argument).toBe(value);
      });

      it('should create return without value', () => {
        const node = AST.createReturnStatement(null);

        expect(node.argument).toBe(null);
      });
    });

    describe('createBreakStatement', () => {
      it('should create break statement', () => {
        const node = AST.createBreakStatement();

        expect(node.type).toBe('BreakStatement');
      });
    });

    describe('createContinueStatement', () => {
      it('should create continue statement', () => {
        const node = AST.createContinueStatement();

        expect(node.type).toBe('ContinueStatement');
      });
    });

    describe('createProgram', () => {
      it('should create program with statements', () => {
        const stmt1 = AST.createExpressionStatement(AST.createLiteral(1, '1'));
        const stmt2 = AST.createExpressionStatement(AST.createLiteral(2, '2'));
        const node = AST.createProgram([stmt1, stmt2]);

        expect(node.type).toBe('Program');
        expect(node.body).toHaveLength(2);
      });

      it('should create empty program', () => {
        const node = AST.createProgram([]);

        expect(node.body).toHaveLength(0);
      });
    });
  });

  describe('Complex AST Construction', () => {
    it('should build complex expression tree: (2 + 3) * 4', () => {
      // (2 + 3) * 4
      const two = AST.createLiteral(2, '2');
      const three = AST.createLiteral(3, '3');
      const four = AST.createLiteral(4, '4');

      const addition = AST.createBinaryExpression(two, TokenType.PLUS, three);
      const grouping = AST.createGroupingExpression(addition);
      const multiplication = AST.createBinaryExpression(grouping, TokenType.STAR, four);

      expect(multiplication.type).toBe('BinaryExpression');
      expect(multiplication.operator).toBe(TokenType.STAR);
      expect(multiplication.left.type).toBe('GroupingExpression');
      expect(multiplication.right).toBe(four);
    });

    it('should build variable declaration: let x = 5 + 3', () => {
      const five = AST.createLiteral(5, '5');
      const three = AST.createLiteral(3, '3');
      const addition = AST.createBinaryExpression(five, TokenType.PLUS, three);
      const declaration = AST.createVariableDeclaration(
        'let',
        AST.createIdentifier('x'),
        addition
      );

      expect(declaration.type).toBe('VariableDeclaration');
      expect(declaration.identifier.name).toBe('x');
      expect(declaration.initializer?.type).toBe('BinaryExpression');
    });
  });
});

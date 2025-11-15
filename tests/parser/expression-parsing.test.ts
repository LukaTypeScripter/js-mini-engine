import { Parser } from '../../src/parser/parser';
import { Scanner } from '../../src/lexer/scanner';
import { TokenType } from '../../src/core';

describe('Expression Parsing', () => {
  function parseExpression(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    return parser.parseExpression();
  }

  describe('Primary Expressions', () => {
    it('should parse number literals', () => {
      const ast = parseExpression('42');

      expect(ast.type).toBe('LiteralExpression');
      expect((ast as any).value).toBe(42);
    });

    it('should parse decimal numbers', () => {
      const ast = parseExpression('3.14');

      expect((ast as any).value).toBe(3.14);
    });

    it('should parse string literals', () => {
      const ast = parseExpression('"hello"');

      expect(ast.type).toBe('LiteralExpression');
      expect((ast as any).value).toBe('hello');
    });

    it('should parse true', () => {
      const ast = parseExpression('true');

      expect((ast as any).value).toBe(true);
    });

    it('should parse false', () => {
      const ast = parseExpression('false');

      expect((ast as any).value).toBe(false);
    });

    it('should parse null', () => {
      const ast = parseExpression('null');

      expect((ast as any).value).toBe(null);
    });

    it('should parse identifiers', () => {
      const ast = parseExpression('myVar');

      expect(ast.type).toBe('Identifier');
      expect((ast as any).name).toBe('myVar');
    });
  });

  describe('Grouping Expressions', () => {
    it('should parse grouped expressions', () => {
      const ast = parseExpression('(42)');

      expect(ast.type).toBe('GroupingExpression');
      expect((ast as any).expression.type).toBe('LiteralExpression');
    });

    it('should throw error for unclosed parenthesis', () => {
      expect(() => parseExpression('(42')).toThrow("Expected ')'");
    });
  });

  describe('Unary Expressions', () => {
    it('should parse negation', () => {
      const ast = parseExpression('-5');

      expect(ast.type).toBe('UnaryExpression');
      expect((ast as any).operator).toBe(TokenType.MINUS);
      expect((ast as any).argument.value).toBe(5);
    });

    it('should parse logical not', () => {
      const ast = parseExpression('!true');

      expect(ast.type).toBe('UnaryExpression');
      expect((ast as any).operator).toBe(TokenType.BANG);
    });

    it('should parse double negation', () => {
      const ast = parseExpression('--5');

      expect(ast.type).toBe('UnaryExpression');
      expect((ast as any).argument.type).toBe('UnaryExpression');
    });
  });

  describe('Binary Expressions', () => {
    it('should parse addition', () => {
      const ast = parseExpression('2 + 3');

      expect(ast.type).toBe('BinaryExpression');
      expect((ast as any).operator).toBe(TokenType.PLUS);
      expect((ast as any).left.value).toBe(2);
      expect((ast as any).right.value).toBe(3);
    });

    it('should parse multiplication', () => {
      const ast = parseExpression('3 * 4');

      expect(ast.type).toBe('BinaryExpression');
      expect((ast as any).operator).toBe(TokenType.STAR);
    });

    it('should parse division', () => {
      const ast = parseExpression('10 / 2');

      expect((ast as any).operator).toBe(TokenType.SLASH);
    });

    it('should parse modulo', () => {
      const ast = parseExpression('10 % 3');

      expect((ast as any).operator).toBe(TokenType.PERCENT);
    });
  });

  describe('Operator Precedence', () => {
    it('should handle multiplication before addition', () => {
      const ast = parseExpression('2 + 3 * 4');

      // Should be: 2 + (3 * 4)
      expect(ast.type).toBe('BinaryExpression');
      expect((ast as any).operator).toBe(TokenType.PLUS);
      expect((ast as any).left.value).toBe(2);
      expect((ast as any).right.type).toBe('BinaryExpression');
      expect((ast as any).right.operator).toBe(TokenType.STAR);
    });

    it('should handle grouping to override precedence', () => {
      const ast = parseExpression('(2 + 3) * 4');

      // Should be: (2 + 3) * 4
      expect(ast.type).toBe('BinaryExpression');
      expect((ast as any).operator).toBe(TokenType.STAR);
      expect((ast as any).left.type).toBe('GroupingExpression');
      expect((ast as any).right.value).toBe(4);
    });

    it('should handle complex precedence', () => {
      const ast = parseExpression('2 + 3 * 4 - 5');

      // Should be: (2 + (3 * 4)) - 5
      expect(ast.type).toBe('BinaryExpression');
      expect((ast as any).operator).toBe(TokenType.MINUS);
    });
  });

  describe('Left-Associativity', () => {
    it('should parse left-to-right for addition', () => {
      const ast = parseExpression('1 + 2 + 3');

      // Should be: (1 + 2) + 3
      expect(ast.type).toBe('BinaryExpression');
      expect((ast as any).operator).toBe(TokenType.PLUS);
      expect((ast as any).left.type).toBe('BinaryExpression');
      expect((ast as any).right.value).toBe(3);
    });

    it('should parse left-to-right for multiplication', () => {
      const ast = parseExpression('2 * 3 * 4');

      // Should be: (2 * 3) * 4
      expect(ast.type).toBe('BinaryExpression');
      expect((ast as any).left.type).toBe('BinaryExpression');
      expect((ast as any).right.value).toBe(4);
    });
  });

  describe('Comparison Expressions', () => {
    it('should parse less than', () => {
      const ast = parseExpression('x < 5');

      expect(ast.type).toBe('BinaryExpression');
      expect((ast as any).operator).toBe(TokenType.LESS);
    });

    it('should parse greater than or equal', () => {
      const ast = parseExpression('x >= 10');

      expect((ast as any).operator).toBe(TokenType.GREATER_EQUAL);
    });
  });

  describe('Equality Expressions', () => {
    it('should parse equality', () => {
      const ast = parseExpression('x == 5');

      expect(ast.type).toBe('BinaryExpression');
      expect((ast as any).operator).toBe(TokenType.EQUAL_EQUAL);
    });

    it('should parse inequality', () => {
      const ast = parseExpression('x != 5');

      expect((ast as any).operator).toBe(TokenType.BANG_EQUAL);
    });
  });

  describe('Logical Expressions', () => {
    it('should parse logical AND', () => {
      const ast = parseExpression('true && false');

      expect(ast.type).toBe('LogicalExpression');
      expect((ast as any).operator).toBe(TokenType.AND);
    });

    it('should parse logical OR', () => {
      const ast = parseExpression('true || false');

      expect(ast.type).toBe('LogicalExpression');
      expect((ast as any).operator).toBe(TokenType.OR);
    });

    it('should handle AND before OR', () => {
      const ast = parseExpression('a || b && c');

      // Should be: a || (b && c)
      expect(ast.type).toBe('LogicalExpression');
      expect((ast as any).operator).toBe(TokenType.OR);
      expect((ast as any).right.type).toBe('LogicalExpression');
      expect((ast as any).right.operator).toBe(TokenType.AND);
    });
  });

  describe('Assignment Expressions', () => {
    it('should parse simple assignment', () => {
      const ast = parseExpression('x = 5');

      expect(ast.type).toBe('AssignmentExpression');
      expect((ast as any).left.name).toBe('x');
      expect((ast as any).right.value).toBe(5);
    });

    it('should parse chained assignment (right-associative)', () => {
      const ast = parseExpression('x = y = 5');

      // Should be: x = (y = 5)
      expect(ast.type).toBe('AssignmentExpression');
      expect((ast as any).left.name).toBe('x');
      expect((ast as any).right.type).toBe('AssignmentExpression');
      expect((ast as any).right.left.name).toBe('y');
    });

    it('should throw error for invalid assignment target', () => {
      expect(() => parseExpression('5 = x')).toThrow('Invalid assignment target');
    });
  });

  describe('Complex Expressions', () => {
    it('should parse complex arithmetic', () => {
      const ast = parseExpression('(2 + 3) * 4 - 5 / 2');

      expect(ast.type).toBe('BinaryExpression');
    });

    it('should parse complex logical expression', () => {
      const ast = parseExpression('x > 5 && y < 10 || z == 0');

      expect(ast.type).toBe('LogicalExpression');
    });

    it('should parse expression with all precedence levels', () => {
      const ast = parseExpression('x = a + b * c == d && e || f');

      expect(ast.type).toBe('AssignmentExpression');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for unexpected token', () => {
      expect(() => parseExpression('+')).toThrow('Expected expression');
    });

    it('should throw error for incomplete expression', () => {
      expect(() => parseExpression('2 +')).toThrow('Expected expression');
    });
  });
});

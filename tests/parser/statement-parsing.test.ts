import { Parser } from '../../src/parser/parser';
import { Scanner } from '../../src/lexer';

describe('Statement Parsing', () => {
  function parse(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    const parser = new Parser(tokens);
    return parser.parse();
  }

  describe('Variable Declarations', () => {
    it('should parse let declaration with initializer', () => {
      const ast = parse('let x = 5;');

      expect(ast.type).toBe('Program');
      expect(ast.body).toHaveLength(1);
      expect(ast.body[0].type).toBe('VariableDeclaration');
      expect((ast.body[0] as any).kind).toBe('let');
      expect((ast.body[0] as any).identifier.name).toBe('x');
      expect((ast.body[0] as any).initializer.value).toBe(5);
    });

    it('should parse const declaration', () => {
      const ast = parse('const PI = 3.14;');

      expect((ast.body[0] as any).kind).toBe('const');
      expect((ast.body[0] as any).identifier.name).toBe('PI');
    });

    it('should parse let without initializer', () => {
      const ast = parse('let x;');

      expect((ast.body[0] as any).initializer).toBe(null);
    });

    it('should throw error for const without initializer', () => {
      expect(() => parse('const x;')).toThrow('const declaration must have an initializer');
    });

    it('should parse complex initializer', () => {
      const ast = parse('let sum = 2 + 3 * 4;');

      expect((ast.body[0] as any).initializer.type).toBe('BinaryExpression');
    });
  });

  describe('Expression Statements', () => {
    it('should parse expression statement', () => {
      const ast = parse('x + 1;');

      expect(ast.body[0].type).toBe('ExpressionStatement');
      expect((ast.body[0] as any).expression.type).toBe('BinaryExpression');
    });

    it('should parse assignment as statement', () => {
      const ast = parse('x = 10;');

      expect((ast.body[0] as any).expression.type).toBe('AssignmentExpression');
    });
  });

  describe('Block Statements', () => {
    it('should parse empty block', () => {
      const ast = parse('{}');

      expect(ast.body[0].type).toBe('BlockStatement');
      expect((ast.body[0] as any).body).toHaveLength(0);
    });

    it('should parse block with statements', () => {
      const ast = parse('{ let x = 5; x + 1; }');

      expect((ast.body[0] as any).body).toHaveLength(2);
    });

    it('should parse nested blocks', () => {
      const ast = parse('{ { let x = 5; } }');

      expect(ast.body[0].type).toBe('BlockStatement');
      expect((ast.body[0] as any).body[0].type).toBe('BlockStatement');
    });
  });

  describe('If Statements', () => {
    it('should parse if without else', () => {
      const ast = parse('if (x > 5) { x = 0; }');

      expect(ast.body[0].type).toBe('IfStatement');
      expect((ast.body[0] as any).condition.type).toBe('BinaryExpression');
      expect((ast.body[0] as any).consequent.type).toBe('BlockStatement');
      expect((ast.body[0] as any).alternate).toBe(null);
    });

    it('should parse if with else', () => {
      const ast = parse('if (x > 5) { x = 0; } else { x = 10; }');

      expect((ast.body[0] as any).alternate).not.toBe(null);
      expect((ast.body[0] as any).alternate.type).toBe('BlockStatement');
    });

    it('should parse if-else-if chain', () => {
      const ast = parse('if (x > 10) { x = 0; } else if (x > 5) { x = 5; } else { x = 10; }');

      expect(ast.body[0].type).toBe('IfStatement');
      expect((ast.body[0] as any).alternate.type).toBe('IfStatement');
    });

    it('should parse if without braces', () => {
      const ast = parse('if (true) x = 5;');

      expect((ast.body[0] as any).consequent.type).toBe('ExpressionStatement');
    });
  });

  describe('While Statements', () => {
    it('should parse while loop', () => {
      const ast = parse('while (x > 0) { x = x - 1; }');

      expect(ast.body[0].type).toBe('WhileStatement');
      expect((ast.body[0] as any).condition.type).toBe('BinaryExpression');
      expect((ast.body[0] as any).body.type).toBe('BlockStatement');
    });

    it('should parse while without braces', () => {
      const ast = parse('while (true) x = x + 1;');

      expect((ast.body[0] as any).body.type).toBe('ExpressionStatement');
    });
  });

  describe('For Statements', () => {
    it('should parse complete for loop', () => {
      const ast = parse('for (let i = 0; i < 10; i = i + 1) { x = x + i; }');

      expect(ast.body[0].type).toBe('ForStatement');
      expect((ast.body[0] as any).init.type).toBe('VariableDeclaration');
      expect((ast.body[0] as any).condition.type).toBe('BinaryExpression');
      expect((ast.body[0] as any).update.type).toBe('AssignmentExpression');
      expect((ast.body[0] as any).body.type).toBe('BlockStatement');
    });

    it('should parse for with expression init', () => {
      const ast = parse('for (i = 0; i < 10; i = i + 1) {}');

      expect((ast.body[0] as any).init.type).toBe('ExpressionStatement');
    });

    it('should parse for without init', () => {
      const ast = parse('for (; i < 10; i = i + 1) {}');

      expect((ast.body[0] as any).init).toBe(null);
    });

    it('should parse for without condition', () => {
      const ast = parse('for (let i = 0;; i = i + 1) {}');

      expect((ast.body[0] as any).condition).toBe(null);
    });

    it('should parse for without update', () => {
      const ast = parse('for (let i = 0; i < 10;) {}');

      expect((ast.body[0] as any).update).toBe(null);
    });

    it('should parse infinite for loop', () => {
      const ast = parse('for (;;) {}');

      expect((ast.body[0] as any).init).toBe(null);
      expect((ast.body[0] as any).condition).toBe(null);
      expect((ast.body[0] as any).update).toBe(null);
    });
  });

  describe('Return Statements', () => {
    it('should parse return with value', () => {
      const ast = parse('return 42;');

      expect(ast.body[0].type).toBe('ReturnStatement');
      expect((ast.body[0] as any).argument.value).toBe(42);
    });

    it('should parse return without value', () => {
      const ast = parse('return;');

      expect((ast.body[0] as any).argument).toBe(null);
    });

    it('should parse return with expression', () => {
      const ast = parse('return x + 1;');

      expect((ast.body[0] as any).argument.type).toBe('BinaryExpression');
    });
  });

  describe('Break and Continue', () => {
    it('should parse break statement', () => {
      const ast = parse('break;');

      expect(ast.body[0].type).toBe('BreakStatement');
    });

    it('should parse continue statement', () => {
      const ast = parse('continue;');

      expect(ast.body[0].type).toBe('ContinueStatement');
    });
  });

  describe('Multiple Statements', () => {
    it('should parse multiple statements', () => {
      const ast = parse(`
        let x = 5;
        let y = 10;
        x = x + y;
      `);

      expect(ast.body).toHaveLength(3);
    });

    it('should parse complex program', () => {
      const ast = parse(`
        let x = 0;
        let sum = 0;

        while (x < 10) {
          sum = sum + x;
          x = x + 1;
        }

        return sum;
      `);

      expect(ast.body).toHaveLength(4);
    });
  });

  describe('Realistic Programs', () => {
    it('should parse fibonacci-like program', () => {
      const ast = parse(`
        let a = 0;
        let b = 1;
        let i = 0;

        while (i < 10) {
          let temp = a + b;
          a = b;
          b = temp;
          i = i + 1;
        }

        return b;
      `);

      expect(ast.type).toBe('Program');
      expect(ast.body.length).toBeGreaterThan(0);
    });

    it('should parse conditional logic', () => {
      const ast = parse(`
        let x = 10;

        if (x > 5) {
          x = x * 2;
        } else {
          x = x + 5;
        }

        return x;
      `);

      expect(ast.body).toHaveLength(3);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for missing semicolon', () => {
      expect(() => parse('let x = 5')).toThrow("Expected ';'");
    });

    it('should throw error for invalid variable name', () => {
      expect(() => parse('let 123 = 5;')).toThrow('Expected variable name');
    });

    it('should throw error for unclosed block', () => {
      expect(() => parse('{ let x = 5;')).toThrow("Expected '}'");
    });

    it('should throw error for missing condition parentheses', () => {
      expect(() => parse('if x > 5 {}')).toThrow("Expected '('");
    });
  });

  describe('Function Declarations', () => {
    it('should parse function without parameters', () => {
      const ast = parse('function foo() { return 42; }');

      expect(ast.body[0].type).toBe('FunctionDeclaration');
      expect((ast.body[0] as any).name.name).toBe('foo');
      expect((ast.body[0] as any).parameters).toHaveLength(0);
      expect((ast.body[0] as any).body.type).toBe('BlockStatement');
    });

    it('should parse function with single parameter', () => {
      const ast = parse('function add(x) { return x + 1; }');

      expect((ast.body[0] as any).name.name).toBe('add');
      expect((ast.body[0] as any).parameters).toHaveLength(1);
      expect((ast.body[0] as any).parameters[0].name).toBe('x');
    });

    it('should parse function with multiple parameters', () => {
      const ast = parse('function multiply(a, b, c) { return a * b * c; }');

      expect((ast.body[0] as any).parameters).toHaveLength(3);
      expect((ast.body[0] as any).parameters[0].name).toBe('a');
      expect((ast.body[0] as any).parameters[1].name).toBe('b');
      expect((ast.body[0] as any).parameters[2].name).toBe('c');
    });

    it('should parse function with empty body', () => {
      const ast = parse('function noop() {}');

      expect((ast.body[0] as any).body.body).toHaveLength(0);
    });

    it('should parse function with complex body', () => {
      const ast = parse(`
        function factorial(n) {
          if (n <= 1) {
            return 1;
          }
          return n * factorial(n - 1);
        }
      `);

      expect((ast.body[0] as any).body.body).toHaveLength(2);
      expect((ast.body[0] as any).body.body[0].type).toBe('IfStatement');
      expect((ast.body[0] as any).body.body[1].type).toBe('ReturnStatement');
    });

    it('should parse multiple function declarations', () => {
      const ast = parse(`
        function foo() { return 1; }
        function bar() { return 2; }
      `);

      expect(ast.body).toHaveLength(2);
      expect((ast.body[0] as any).name.name).toBe('foo');
      expect((ast.body[1] as any).name.name).toBe('bar');
    });

    it('should throw error for missing function name', () => {
      expect(() => parse('function () {}')).toThrow('Expected function name');
    });

    it('should throw error for missing parentheses', () => {
      expect(() => parse('function foo {}')).toThrow("Expected '('");
    });

    it('should throw error for missing body', () => {
      expect(() => parse('function foo()')).toThrow("Expected '{'");
    });
  });

  describe('Function Calls', () => {
    it('should parse function call without arguments', () => {
      const ast = parse('foo();');

      expect(ast.body[0].type).toBe('ExpressionStatement');
      expect((ast.body[0] as any).expression.type).toBe('CallExpression');
      expect((ast.body[0] as any).expression.callee.name).toBe('foo');
      expect((ast.body[0] as any).expression.arguments).toHaveLength(0);
    });

    it('should parse function call with single argument', () => {
      const ast = parse('log(42);');

      expect((ast.body[0] as any).expression.arguments).toHaveLength(1);
      expect((ast.body[0] as any).expression.arguments[0].value).toBe(42);
    });

    it('should parse function call with multiple arguments', () => {
      const ast = parse('add(1, 2, 3);');

      expect((ast.body[0] as any).expression.arguments).toHaveLength(3);
      expect((ast.body[0] as any).expression.arguments[0].value).toBe(1);
      expect((ast.body[0] as any).expression.arguments[1].value).toBe(2);
      expect((ast.body[0] as any).expression.arguments[2].value).toBe(3);
    });

    it('should parse function call with expression arguments', () => {
      const ast = parse('max(x + 1, y * 2);');

      expect((ast.body[0] as any).expression.arguments[0].type).toBe('BinaryExpression');
      expect((ast.body[0] as any).expression.arguments[1].type).toBe('BinaryExpression');
    });

    it('should parse nested function calls', () => {
      const ast = parse('outer(inner(5));');

      expect((ast.body[0] as any).expression.callee.name).toBe('outer');
      expect((ast.body[0] as any).expression.arguments[0].type).toBe('CallExpression');
      expect((ast.body[0] as any).expression.arguments[0].callee.name).toBe('inner');
    });

    it('should parse function call in assignment', () => {
      const ast = parse('let result = calculate(10);');

      expect((ast.body[0] as any).initializer.type).toBe('CallExpression');
    });

    it('should throw error for unclosed argument list', () => {
      expect(() => parse('foo(1, 2')).toThrow("Expected ')'");
    });
  });
});

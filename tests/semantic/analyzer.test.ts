import { SemanticAnalyzer } from '../../src/semantic/analyzer';
import { Parser } from '../../src/parser/parser';
import { Scanner } from '../../src/lexer/scanner';

describe('Semantic Analyzer', () => {
  function analyze(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const analyzer = new SemanticAnalyzer();
    return analyzer.analyze(ast);
  }

  describe('Variable Declarations', () => {
    it('should accept valid variable declaration', () => {
      const result = analyze('let x = 5;');

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept const declaration', () => {
      const result = analyze('const PI = 3.14;');

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject duplicate declaration in same scope', () => {
      const result = analyze(`
        let x = 5;
        let x = 10;
      `);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("already declared");
    });

    it('should allow same variable name in different scopes', () => {
      const result = analyze(`
        let x = 5;
        {
          let x = 10;
        }
      `);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow redeclaration in nested scope (shadowing)', () => {
      const result = analyze(`
        let x = 5;
        {
          let x = 10;
          {
            let x = 15;
          }
        }
      `);

      expect(result.success).toBe(true);
    });
  });

  describe('Variable Usage', () => {
    it('should accept using declared variable', () => {
      const result = analyze(`
        let x = 5;
        x + 1;
      `);

      expect(result.success).toBe(true);
    });

    it('should reject using undeclared variable', () => {
      const result = analyze('y + 1;');

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("not defined");
    });

    it('should accept using variable from parent scope', () => {
      const result = analyze(`
        let x = 5;
        {
          let y = x + 1;
        }
      `);

      expect(result.success).toBe(true);
    });

    it('should reject using variable from child scope', () => {
      const result = analyze(`
        {
          let x = 5;
        }
        let y = x + 1;
      `);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("not defined");
    });
  });

  describe('Const Reassignment', () => {
    it('should allow assignment to let variable', () => {
      const result = analyze(`
        let x = 5;
        x = 10;
      `);

      expect(result.success).toBe(true);
    });

    it('should reject assignment to const variable', () => {
      const result = analyze(`
        const PI = 3.14;
        PI = 3;
      `);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("Cannot assign to const");
    });

    it('should reject assignment to undeclared variable', () => {
      const result = analyze('x = 10;');

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("undefined variable");
    });

    it('should allow multiple assignments to let', () => {
      const result = analyze(`
        let x = 5;
        x = 10;
        x = 15;
      `);

      expect(result.success).toBe(true);
    });
  });

  describe('Control Flow Validation', () => {
    it('should accept break inside while loop', () => {
      const result = analyze(`
        while (true) {
          break;
        }
      `);

      expect(result.success).toBe(true);
    });

    it('should accept continue inside while loop', () => {
      const result = analyze(`
        while (true) {
          continue;
        }
      `);

      expect(result.success).toBe(true);
    });

    it('should reject break outside loop', () => {
      const result = analyze('break;');

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("only be used inside a loop");
    });

    it('should reject continue outside loop', () => {
      const result = analyze('continue;');

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("only be used inside a loop");
    });

    it('should accept break in nested loops', () => {
      const result = analyze(`
        while (true) {
          while (true) {
            break;
          }
        }
      `);

      expect(result.success).toBe(true);
    });

    it('should accept break/continue in for loop', () => {
      const result = analyze(`
        for (let i = 0; i < 10; i = i + 1) {
          if (i == 5) break;
          if (i == 3) continue;
        }
      `);

      expect(result.success).toBe(true);
    });
  });

  describe('Type Checking', () => {
    it('should accept number arithmetic', () => {
      const result = analyze(`
        let x = 5 + 3;
        let y = 10 - 2;
        let z = 4 * 2;
      `);

      expect(result.success).toBe(true);
    });

    it('should accept string concatenation', () => {
      const result = analyze(`
        let s = "hello" + "world";
      `);

      expect(result.success).toBe(true);
    });

    it('should accept string + number (concatenation)', () => {
      const result = analyze(`
        let s = "Count: " + 5;
      `);

      expect(result.success).toBe(true);
    });

    it('should reject string - number', () => {
      const result = analyze(`
        let x = "hello" - 5;
      `);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("Type error");
    });

    it('should reject boolean arithmetic', () => {
      const result = analyze(`
        let x = true + false;
      `);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should accept number comparisons', () => {
      const result = analyze(`
        let a = 5 > 3;
        let b = 10 <= 20;
      `);

      expect(result.success).toBe(true);
    });

    it('should accept equality comparisons', () => {
      const result = analyze(`
        let a = 5 == 5;
        let b = "hello" != "world";
      `);

      expect(result.success).toBe(true);
    });

    it('should accept logical operations', () => {
      const result = analyze(`
        let a = true && false;
        let b = true || false;
      `);

      expect(result.success).toBe(true);
    });

    it('should accept unary operations', () => {
      const result = analyze(`
        let a = -5;
        let b = !true;
      `);

      expect(result.success).toBe(true);
    });

    it('should reject negating a string', () => {
      const result = analyze(`
        let x = -"hello";
      `);

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain("Cannot negate");
    });
  });

  describe('Complex Programs', () => {
    it('should analyze fibonacci program', () => {
      const result = analyze(`
        let a = 0;
        let b = 1;
        let i = 0;

        while (i < 10) {
          let temp = a + b;
          a = b;
          b = temp;
          i = i + 1;
        }
      `);

      expect(result.success).toBe(true);
    });

    it('should analyze nested if-else', () => {
      const result = analyze(`
        let x = 10;

        if (x > 5) {
          let y = 20;
          if (y > 15) {
            x = x + 1;
          }
        } else {
          x = x - 1;
        }
      `);

      expect(result.success).toBe(true);
    });

    it('should find multiple errors', () => {
      const result = analyze(`
        x = 5;
        let x = 10;
        const y = 20;
        y = 25;
        break;
      `);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('should handle for loop scope correctly', () => {
      const result = analyze(`
        for (let i = 0; i < 10; i = i + 1) {
          let x = i;
        }
        let y = i;
      `);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("not defined");
    });
  });

  describe('Scope Chain', () => {
    it('should handle deeply nested scopes', () => {
      const result = analyze(`
        let a = 1;
        {
          let b = 2;
          {
            let c = 3;
            {
              let d = a + b + c;
            }
          }
        }
      `);

      expect(result.success).toBe(true);
    });

    it('should handle variable shadowing correctly', () => {
      const result = analyze(`
        let x = "outer";
        {
          let x = 5;
          let y = x + 10;
        }
        let z = x + " string";
      `);

      expect(result.success).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty program', () => {
      const result = analyze('');

      expect(result.success).toBe(true);
    });

    it('should handle empty blocks', () => {
      const result = analyze('{}');

      expect(result.success).toBe(true);
    });

    it('should handle variable without initializer', () => {
      const result = analyze(`
        let x;
        x = 5;
      `);

      expect(result.success).toBe(true);
    });
  });

  describe('Function Declarations', () => {
    it('should accept function declaration', () => {
      const result = analyze(`
        function add(x, y) {
          return x + y;
        }
      `);

      expect(result.success).toBe(true);
    });

    it('should accept function without parameters', () => {
      const result = analyze('function hello() { return 42; }');

      expect(result.success).toBe(true);
    });

    it('should reject duplicate function declaration', () => {
      const result = analyze(`
        function foo() { return 1; }
        function foo() { return 2; }
      `);

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('already declared');
    });

    it('should allow using parameters in function body', () => {
      const result = analyze(`
        function multiply(a, b) {
          return a * b;
        }
      `);

      expect(result.success).toBe(true);
    });

    it('should reject duplicate parameter names', () => {
      const result = analyze(`
        function bad(x, x) {
          return x;
        }
      `);

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('already declared');
    });

    it('should allow variables in function scope', () => {
      const result = analyze(`
        function test(x) {
          let y = x + 1;
          return y;
        }
      `);

      expect(result.success).toBe(true);
    });

    it('should not allow accessing function parameters outside function', () => {
      const result = analyze(`
        function foo(x) {
          return x;
        }
        let y = x;
      `);

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('not defined');
    });

    it('should allow nested function declarations', () => {
      const result = analyze(`
        function outer() {
          function inner() {
            return 42;
          }
          return inner();
        }
      `);

      expect(result.success).toBe(true);
    });
  });

  describe('Function Calls', () => {
    it('should accept calling declared function', () => {
      const result = analyze(`
        function greet() {
          return "hello";
        }
        let msg = greet();
      `);

      expect(result.success).toBe(true);
    });

    it('should reject calling undeclared function', () => {
      const result = analyze('let x = foo();');

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('not defined');
    });

    it('should reject calling non-function value', () => {
      const result = analyze(`
        let x = 5;
        x();
      `);

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('not a function');
    });

    it('should accept function call with arguments', () => {
      const result = analyze(`
        function add(a, b) {
          return a + b;
        }
        let sum = add(1, 2);
      `);

      expect(result.success).toBe(true);
    });

    it('should allow recursive function calls', () => {
      const result = analyze(`
        function factorial(n) {
          if (n <= 1) {
            return 1;
          }
          return n * factorial(n - 1);
        }
      `);

      expect(result.success).toBe(true);
    });
  });
});

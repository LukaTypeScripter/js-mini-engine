import { Interpreter } from '../../src/interpreter/interpreter';
import { Parser } from '../../src/parser/parser';
import { Scanner } from '../../src/lexer/scanner';

describe('Interpreter', () => {
  function run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const interpreter = new Interpreter();
    return interpreter.execute(ast);
  }

  function runAndGetValue(source: string): any {
    const result = run(source);
    return result.value;
  }

  describe('Literal Expressions', () => {
    it('should evaluate number literals', () => {
      const result = run('42;');

      expect(result.type).toBe('number');
      expect(result.value).toBe(42);
    });

    it('should evaluate string literals', () => {
      const result = run('"hello";');

      expect(result.type).toBe('string');
      expect(result.value).toBe('hello');
    });

    it('should evaluate boolean literals', () => {
      const result = run('true;');

      expect(result.type).toBe('boolean');
      expect(result.value).toBe(true);
    });

    it('should evaluate null', () => {
      const result = run('null;');

      expect(result.type).toBe('null');
      expect(result.value).toBe(null);
    });
  });

  describe('Arithmetic Operations', () => {
    it('should evaluate addition', () => {
      expect(runAndGetValue('2 + 3;')).toBe(5);
    });

    it('should evaluate subtraction', () => {
      expect(runAndGetValue('10 - 3;')).toBe(7);
    });

    it('should evaluate multiplication', () => {
      expect(runAndGetValue('4 * 5;')).toBe(20);
    });

    it('should evaluate division', () => {
      expect(runAndGetValue('20 / 4;')).toBe(5);
    });

    it('should evaluate modulo', () => {
      expect(runAndGetValue('10 % 3;')).toBe(1);
    });

    it('should handle division by zero', () => {
      expect(runAndGetValue('5 / 0;')).toBe(Infinity);
    });

    it('should respect operator precedence', () => {
      expect(runAndGetValue('2 + 3 * 4;')).toBe(14);
      expect(runAndGetValue('(2 + 3) * 4;')).toBe(20);
    });

    it('should handle complex arithmetic', () => {
      expect(runAndGetValue('2 + 3 * 4 - 5 / 2;')).toBe(11.5);
    });
  });

  describe('String Operations', () => {
    it('should concatenate strings', () => {
      expect(runAndGetValue('"hello" + " world";')).toBe('hello world');
    });

    it('should concatenate string and number', () => {
      expect(runAndGetValue('"Count: " + 5;')).toBe('Count: 5');
    });

    it('should concatenate number and string', () => {
      expect(runAndGetValue('5 + " items";')).toBe('5 items');
    });
  });

  describe('Comparison Operations', () => {
    it('should evaluate less than', () => {
      expect(runAndGetValue('3 < 5;')).toBe(true);
      expect(runAndGetValue('5 < 3;')).toBe(false);
    });

    it('should evaluate less than or equal', () => {
      expect(runAndGetValue('3 <= 5;')).toBe(true);
      expect(runAndGetValue('5 <= 5;')).toBe(true);
      expect(runAndGetValue('7 <= 5;')).toBe(false);
    });

    it('should evaluate greater than', () => {
      expect(runAndGetValue('5 > 3;')).toBe(true);
      expect(runAndGetValue('3 > 5;')).toBe(false);
    });

    it('should evaluate greater than or equal', () => {
      expect(runAndGetValue('5 >= 3;')).toBe(true);
      expect(runAndGetValue('5 >= 5;')).toBe(true);
      expect(runAndGetValue('3 >= 5;')).toBe(false);
    });
  });

  describe('Equality Operations', () => {
    it('should evaluate equality', () => {
      expect(runAndGetValue('5 == 5;')).toBe(true);
      expect(runAndGetValue('5 == 3;')).toBe(false);
      expect(runAndGetValue('"hello" == "hello";')).toBe(true);
      expect(runAndGetValue('"hello" == "world";')).toBe(false);
    });

    it('should evaluate inequality', () => {
      expect(runAndGetValue('5 != 3;')).toBe(true);
      expect(runAndGetValue('5 != 5;')).toBe(false);
    });

    it('should handle null and undefined equality', () => {
      expect(runAndGetValue('null == null;')).toBe(true);
    });
  });

  describe('Logical Operations', () => {
    it('should evaluate logical AND', () => {
      expect(runAndGetValue('true && true;')).toBe(true);
      expect(runAndGetValue('true && false;')).toBe(false);
      expect(runAndGetValue('false && true;')).toBe(false);
    });

    it('should evaluate logical OR', () => {
      expect(runAndGetValue('true || false;')).toBe(true);
      expect(runAndGetValue('false || true;')).toBe(true);
      expect(runAndGetValue('false || false;')).toBe(false);
    });

    it('should short-circuit AND', () => {
      // If left is false, right should not be evaluated
      expect(runAndGetValue('false && true;')).toBe(false);
    });

    it('should short-circuit OR', () => {
      // If left is true, right should not be evaluated
      expect(runAndGetValue('true || false;')).toBe(true);
    });
  });

  describe('Unary Operations', () => {
    it('should negate numbers', () => {
      expect(runAndGetValue('-5;')).toBe(-5);
      expect(runAndGetValue('--5;')).toBe(5);
    });

    it('should perform logical NOT', () => {
      expect(runAndGetValue('!true;')).toBe(false);
      expect(runAndGetValue('!false;')).toBe(true);
      expect(runAndGetValue('!!true;')).toBe(true);
    });
  });

  describe('Variable Declarations', () => {
    it('should declare and initialize variables', () => {
      const result = runAndGetValue(`
        let x = 5;
        x;
      `);

      expect(result).toBe(5);
    });

    it('should declare const variables', () => {
      const result = runAndGetValue(`
        const PI = 3.14;
        PI;
      `);

      expect(result).toBe(3.14);
    });

    it('should declare without initializer', () => {
      const result = run(`
        let x;
        x;
      `);

      expect(result.type).toBe('undefined');
    });

    it('should handle multiple variables', () => {
      const result = runAndGetValue(`
        let x = 5;
        let y = 10;
        x + y;
      `);

      expect(result).toBe(15);
    });
  });

  describe('Variable Assignments', () => {
    it('should assign to variables', () => {
      const result = runAndGetValue(`
        let x = 5;
        x = 10;
        x;
      `);

      expect(result).toBe(10);
    });

    it('should assign expressions', () => {
      const result = runAndGetValue(`
        let x = 5;
        let y = 3;
        x = x + y;
        x;
      `);

      expect(result).toBe(8);
    });

    it('should throw error for undefined variable', () => {
      expect(() => run('x = 5;')).toThrow('undefined variable');
    });
  });

  describe('Block Statements', () => {
    it('should execute block statements', () => {
      const result = runAndGetValue(`
        let x = 5;
        {
          let y = 10;
          x = x + y;
        }
        x;
      `);

      expect(result).toBe(15);
    });

    it('should handle variable shadowing', () => {
      const result = runAndGetValue(`
        let x = 5;
        {
          let x = 10;
          x;
        }
      `);

      expect(result).toBe(10);
    });

    it('should isolate block scope', () => {
      expect(() => run(`
        {
          let x = 5;
        }
        x;
      `)).toThrow('not defined');
    });
  });

  describe('If Statements', () => {
    it('should execute if branch when condition is true', () => {
      const result = runAndGetValue(`
        let x = 0;
        if (true) {
          x = 10;
        }
        x;
      `);

      expect(result).toBe(10);
    });

    it('should skip if branch when condition is false', () => {
      const result = runAndGetValue(`
        let x = 0;
        if (false) {
          x = 10;
        }
        x;
      `);

      expect(result).toBe(0);
    });

    it('should execute else branch', () => {
      const result = runAndGetValue(`
        let x = 0;
        if (false) {
          x = 10;
        } else {
          x = 20;
        }
        x;
      `);

      expect(result).toBe(20);
    });

    it('should handle if-else-if chains', () => {
      const result = runAndGetValue(`
        let x = 5;
        let result = 0;
        if (x < 0) {
          result = 1;
        } else if (x < 10) {
          result = 2;
        } else {
          result = 3;
        }
        result;
      `);

      expect(result).toBe(2);
    });
  });

  describe('While Loops', () => {
    it('should execute while loop', () => {
      const result = runAndGetValue(`
        let i = 0;
        let sum = 0;
        while (i < 5) {
          sum = sum + i;
          i = i + 1;
        }
        sum;
      `);

      expect(result).toBe(10); // 0+1+2+3+4
    });

    it('should handle while loop that never executes', () => {
      const result = runAndGetValue(`
        let x = 0;
        while (false) {
          x = 10;
        }
        x;
      `);

      expect(result).toBe(0);
    });
  });

  describe('For Loops', () => {
    it('should execute for loop', () => {
      const result = runAndGetValue(`
        let sum = 0;
        for (let i = 0; i < 5; i = i + 1) {
          sum = sum + i;
        }
        sum;
      `);

      expect(result).toBe(10); // 0+1+2+3+4
    });

    it('should handle for loop without init', () => {
      const result = runAndGetValue(`
        let i = 0;
        let sum = 0;
        for (; i < 5; i = i + 1) {
          sum = sum + i;
        }
        sum;
      `);

      expect(result).toBe(10);
    });

    it('should handle for loop without condition', () => {
      const result = runAndGetValue(`
        let sum = 0;
        for (let i = 0;; i = i + 1) {
          if (i >= 5) break;
          sum = sum + i;
        }
        sum;
      `);

      expect(result).toBe(10);
    });

    it('should handle for loop without update', () => {
      const result = runAndGetValue(`
        let sum = 0;
        for (let i = 0; i < 5;) {
          sum = sum + i;
          i = i + 1;
        }
        sum;
      `);

      expect(result).toBe(10);
    });
  });

  describe('Break and Continue', () => {
    it('should handle break in while loop', () => {
      const result = runAndGetValue(`
        let i = 0;
        let sum = 0;
        while (i < 10) {
          if (i == 5) break;
          sum = sum + i;
          i = i + 1;
        }
        sum;
      `);

      expect(result).toBe(10); // 0+1+2+3+4
    });

    it('should handle continue in while loop', () => {
      const result = runAndGetValue(`
        let i = 0;
        let sum = 0;
        while (i < 5) {
          i = i + 1;
          if (i == 3) continue;
          sum = sum + i;
        }
        sum;
      `);

      expect(result).toBe(12); // 1+2+4+5
    });

    it('should handle break in for loop', () => {
      const result = runAndGetValue(`
        let sum = 0;
        for (let i = 0; i < 10; i = i + 1) {
          if (i == 5) break;
          sum = sum + i;
        }
        sum;
      `);

      expect(result).toBe(10); // 0+1+2+3+4
    });

    it('should handle continue in for loop', () => {
      const result = runAndGetValue(`
        let sum = 0;
        for (let i = 0; i < 5; i = i + 1) {
          if (i == 2) continue;
          sum = sum + i;
        }
        sum;
      `);

      expect(result).toBe(8); // 0+1+3+4
    });
  });

  describe('Complex Programs', () => {
    it('should execute fibonacci program', () => {
      const result = runAndGetValue(`
        let a = 0;
        let b = 1;
        let i = 0;

        while (i < 10) {
          let temp = a + b;
          a = b;
          b = temp;
          i = i + 1;
        }

        b;
      `);

      expect(result).toBe(89); // 10th Fibonacci number
    });

    it('should execute factorial program', () => {
      const result = runAndGetValue(`
        let n = 5;
        let result = 1;

        for (let i = 1; i <= n; i = i + 1) {
          result = result * i;
        }

        result;
      `);

      expect(result).toBe(120); // 5! = 120
    });

    it('should handle nested loops', () => {
      const result = runAndGetValue(`
        let sum = 0;
        for (let i = 0; i < 3; i = i + 1) {
          for (let j = 0; j < 3; j = j + 1) {
            sum = sum + 1;
          }
        }
        sum;
      `);

      expect(result).toBe(9); // 3 * 3
    });

    it('should handle nested if-else', () => {
      const result = runAndGetValue(`
        let x = 5;
        let result = 0;

        if (x > 0) {
          if (x < 10) {
            if (x == 5) {
              result = 1;
            } else {
              result = 2;
            }
          } else {
            result = 3;
          }
        } else {
          result = 4;
        }

        result;
      `);

      expect(result).toBe(1);
    });

    it('should handle complex expression with variables', () => {
      const result = runAndGetValue(`
        let a = 5;
        let b = 3;
        let c = 2;
        (a + b) * c - a / b;
      `);

      expect(result).toBeCloseTo(14.333, 2);
    });
  });

  describe('Function Declarations and Calls', () => {
    it('should execute function without parameters', () => {
      const result = runAndGetValue(`
        function getNumber() {
          return 42;
        }
        getNumber();
      `);

      expect(result).toBe(42);
    });

    it('should execute function with parameters', () => {
      const result = runAndGetValue(`
        function add(a, b) {
          return a + b;
        }
        add(3, 4);
      `);

      expect(result).toBe(7);
    });

    it('should execute function with multiple statements', () => {
      const result = runAndGetValue(`
        function calculate(x) {
          let y = x * 2;
          let z = y + 10;
          return z;
        }
        calculate(5);
      `);

      expect(result).toBe(20);
    });

    it('should handle function without return', () => {
      const result = run(`
        function noReturn() {
          let x = 5;
        }
        noReturn();
      `);

      expect(result.type).toBe('undefined');
    });

    it('should handle recursive functions', () => {
      const result = runAndGetValue(`
        function factorial(n) {
          if (n <= 1) {
            return 1;
          }
          return n * factorial(n - 1);
        }
        factorial(5);
      `);

      expect(result).toBe(120);
    });

    it('should handle fibonacci recursive function', () => {
      const result = runAndGetValue(`
        function fib(n) {
          if (n <= 1) {
            return n;
          }
          return fib(n - 1) + fib(n - 2);
        }
        fib(7);
      `);

      expect(result).toBe(13);
    });

    it('should handle function scope correctly', () => {
      const result = runAndGetValue(`
        let x = 10;
        function test(y) {
          let z = x + y;
          return z;
        }
        test(5);
      `);

      expect(result).toBe(15);
    });

    it('should handle parameter shadowing', () => {
      const result = runAndGetValue(`
        let x = 10;
        function test(x) {
          return x + 1;
        }
        test(5);
      `);

      expect(result).toBe(6);
    });

    it('should throw error for wrong number of arguments', () => {
      expect(() => {
        run(`
          function add(a, b) {
            return a + b;
          }
          add(1);
        `);
      }).toThrow('expects 2 arguments but got 1');
    });

    it('should throw error when calling non-function', () => {
      expect(() => {
        run(`
          let x = 5;
          x();
        `);
      }).toThrow('Cannot call non-function');
    });

    it('should handle nested function calls', () => {
      const result = runAndGetValue(`
        function double(x) {
          return x * 2;
        }
        function addThenDouble(a, b) {
          return double(a + b);
        }
        addThenDouble(3, 4);
      `);

      expect(result).toBe(14);
    });

    it('should handle multiple function declarations', () => {
      const result = runAndGetValue(`
        function add(a, b) {
          return a + b;
        }
        function multiply(a, b) {
          return a * b;
        }
        multiply(add(2, 3), 4);
      `);

      expect(result).toBe(20);
    });

    it('should handle return in if statement', () => {
      const result = runAndGetValue(`
        function max(a, b) {
          if (a > b) {
            return a;
          }
          return b;
        }
        max(10, 20);
      `);

      expect(result).toBe(20);
    });

    it('should handle early return', () => {
      const result = runAndGetValue(`
        function test(x) {
          if (x < 0) {
            return 0;
          }
          let y = x * 2;
          return y;
        }
        test(-5);
      `);

      expect(result).toBe(0);
    });

    it('should isolate function scope from outer scope', () => {
      const result = runAndGetValue(`
        let x = 10;
        function test() {
          let x = 5;
          return x;
        }
        test();
        x;
      `);

      expect(result).toBe(10);
    });

    it('should handle complex recursive scenario', () => {
      const result = runAndGetValue(`
        function sum(n) {
          if (n <= 0) {
            return 0;
          }
          return n + sum(n - 1);
        }
        sum(10);
      `);

      expect(result).toBe(55);
    });

    it('should handle function calls in expressions', () => {
      const result = runAndGetValue(`
        function square(x) {
          return x * x;
        }
        let a = square(3);
        let b = square(4);
        a + b;
      `);

      expect(result).toBe(25);
    });

    it('should handle nested functions', () => {
      const result = runAndGetValue(`
        function outer() {
          function inner() {
            return 42;
          }
          return inner();
        }
        outer();
      `);

      expect(result).toBe(42);
    });
  });
});

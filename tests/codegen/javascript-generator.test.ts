import { JavaScriptGenerator } from '../../src/codegen';
import { Parser } from '../../src/parser/parser';
import { Scanner } from '../../src/lexer';

describe('JavaScript Code Generator', () => {
  function generate(source: string, options?: any): string {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const generator = new JavaScriptGenerator(options);
    return generator.generate(ast);
  }

  describe('Literal Expressions', () => {
    it('should generate number literals', () => {
      const code = generate('42;');

      expect(code.trim()).toBe('42;');
    });

    it('should generate string literals', () => {
      const code = generate('"hello";');

      expect(code.trim()).toBe('"hello";');
    });

    it('should generate boolean literals', () => {
      const code = generate('true;');

      expect(code.trim()).toBe('true;');
    });

    it('should generate null', () => {
      const code = generate('null;');

      expect(code.trim()).toBe('null;');
    });

    it('should handle strings', () => {
      const code = generate('"hello world";');

      expect(code.trim()).toBe('"hello world";');
    });
  });

  describe('Arithmetic Operations', () => {
    it('should generate addition', () => {
      const code = generate('2 + 3;');

      expect(code.trim()).toBe('2 + 3;');
    });

    it('should generate subtraction', () => {
      const code = generate('10 - 3;');

      expect(code.trim()).toBe('10 - 3;');
    });

    it('should generate multiplication', () => {
      const code = generate('4 * 5;');

      expect(code.trim()).toBe('4 * 5;');
    });

    it('should generate division', () => {
      const code = generate('20 / 4;');

      expect(code.trim()).toBe('20 / 4;');
    });

    it('should generate modulo', () => {
      const code = generate('10 % 3;');

      expect(code.trim()).toBe('10 % 3;');
    });

    it('should preserve operator precedence', () => {
      const code = generate('2 + 3 * 4;');

      expect(code.trim()).toBe('2 + 3 * 4;');
    });

    it('should preserve grouping', () => {
      const code = generate('(2 + 3) * 4;');

      expect(code.trim()).toBe('(2 + 3) * 4;');
    });
  });

  describe('Comparison and Logical Operations', () => {
    it('should generate comparisons', () => {
      expect(generate('5 < 10;').trim()).toBe('5 < 10;');
      expect(generate('5 <= 10;').trim()).toBe('5 <= 10;');
      expect(generate('5 > 10;').trim()).toBe('5 > 10;');
      expect(generate('5 >= 10;').trim()).toBe('5 >= 10;');
    });

    it('should generate equality', () => {
      expect(generate('5 == 5;').trim()).toBe('5 == 5;');
      expect(generate('5 != 3;').trim()).toBe('5 != 3;');
    });

    it('should generate logical operators', () => {
      expect(generate('true && false;').trim()).toBe('true && false;');
      expect(generate('true || false;').trim()).toBe('true || false;');
    });
  });

  describe('Unary Operations', () => {
    it('should generate negation', () => {
      const code = generate('-5;');

      expect(code.trim()).toBe('-5;');
    });

    it('should generate logical NOT', () => {
      const code = generate('!true;');

      expect(code.trim()).toBe('!true;');
    });
  });

  describe('Variable Declarations', () => {
    it('should generate let declarations', () => {
      const code = generate('let x = 5;');

      expect(code.trim()).toBe('let x = 5;');
    });

    it('should generate const declarations', () => {
      const code = generate('const PI = 3.14;');

      expect(code.trim()).toBe('const PI = 3.14;');
    });

    it('should generate declarations without initializer', () => {
      const code = generate('let x;');

      expect(code.trim()).toBe('let x;');
    });

    it('should generate multiple declarations', () => {
      const code = generate(`
        let x = 5;
        let y = 10;
      `);

      expect(code).toContain('let x = 5;');
      expect(code).toContain('let y = 10;');
    });
  });

  describe('Assignments', () => {
    it('should generate assignments', () => {
      const code = generate(`
        let x = 5;
        x = 10;
      `);

      expect(code).toContain('x = 10;');
    });

    it('should generate complex assignments', () => {
      const code = generate(`
        let x = 5;
        x = x + 10;
      `);

      expect(code).toContain('x = x + 10;');
    });
  });

  describe('Block Statements', () => {
    it('should generate empty blocks', () => {
      const code = generate('{}');

      expect(code.trim()).toBe('{\n}');
    });

    it('should generate blocks with statements', () => {
      const code = generate(`
        {
          let x = 5;
          x = x + 1;
        }
      `);

      expect(code).toContain('let x = 5;');
      expect(code).toContain('x = x + 1;');
    });

    it('should generate nested blocks', () => {
      const code = generate(`
        {
          let x = 5;
          {
            let y = 10;
          }
        }
      `);

      expect(code).toContain('let x = 5;');
      expect(code).toContain('let y = 10;');
    });
  });

  describe('If Statements', () => {
    it('should generate if without else', () => {
      const code = generate(`
        if (x > 5) {
          x = 0;
        }
      `);

      expect(code).toContain('if (x > 5)');
      expect(code).toContain('x = 0;');
    });

    it('should generate if with else', () => {
      const code = generate(`
        if (x > 5) {
          x = 0;
        } else {
          x = 10;
        }
      `);

      expect(code).toContain('if (x > 5)');
      expect(code).toContain('else');
      expect(code).toContain('x = 10;');
    });

    it('should generate if-else-if chains', () => {
      const code = generate(`
        if (x > 10) {
          x = 0;
        } else if (x > 5) {
          x = 5;
        } else {
          x = 10;
        }
      `);

      expect(code).toContain('if (x > 10)');
      expect(code).toContain('else if (x > 5)');
      expect(code).toContain('else');
    });
  });

  describe('While Loops', () => {
    it('should generate while loops', () => {
      const code = generate(`
        while (x > 0) {
          x = x - 1;
        }
      `);

      expect(code).toContain('while (x > 0)');
      expect(code).toContain('x = x - 1;');
    });

    it('should generate while with complex condition', () => {
      const code = generate(`
        while (x > 0 && y < 10) {
          x = x - 1;
        }
      `);

      expect(code).toContain('while (x > 0 && y < 10)');
    });
  });

  describe('For Loops', () => {
    it('should generate complete for loop', () => {
      const code = generate(`
        for (let i = 0; i < 10; i = i + 1) {
          x = x + i;
        }
      `);

      expect(code).toContain('for (let i = 0; i < 10; i = i + 1)');
      expect(code).toContain('x = x + i;');
    });

    it('should generate for loop without init', () => {
      const code = generate(`
        for (; i < 10; i = i + 1) {
          x = x + 1;
        }
      `);

      expect(code).toContain('for (; i < 10; i = i + 1)');
    });

    it('should generate for loop without condition', () => {
      const code = generate(`
        for (let i = 0;; i = i + 1) {
          if (i > 10) break;
        }
      `);

      expect(code).toContain('for (let i = 0; ; i = i + 1)');
    });

    it('should generate for loop without update', () => {
      const code = generate(`
        for (let i = 0; i < 10;) {
          i = i + 1;
        }
      `);

      expect(code).toContain('for (let i = 0; i < 10; )');
    });
  });

  describe('Break and Continue', () => {
    it('should generate break statements', () => {
      const code = generate(`
        while (true) {
          break;
        }
      `);

      expect(code).toContain('break;');
    });

    it('should generate continue statements', () => {
      const code = generate(`
        while (true) {
          continue;
        }
      `);

      expect(code).toContain('continue;');
    });
  });

  describe('Return Statements', () => {
    it('should generate return with value', () => {
      const code = generate('return 42;');

      expect(code.trim()).toBe('return 42;');
    });

    it('should generate return without value', () => {
      const code = generate('return;');

      expect(code.trim()).toBe('return;');
    });

    it('should generate return with expression', () => {
      const code = generate('return x + 1;');

      expect(code.trim()).toBe('return x + 1;');
    });
  });

  describe('Formatting Options', () => {
    it('should respect indentSize option', () => {
      const code = generate(
        `{
          let x = 5;
        }`,
        { indentSize: 4 }
      );

      expect(code).toContain('    let x = 5;');
    });

    it('should respect semicolons option', () => {
      const code = generate('let x = 5;', { semicolons: false });

      expect(code.trim()).toBe('let x = 5');
    });

    it('should add comments when requested', () => {
      const code = generate('let x = 5;', { comments: true });

      expect(code).toContain('// Generated by');
    });
  });

  describe('Complex Programs', () => {
    it('should generate fibonacci program', () => {
      const code = generate(`
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

      expect(code).toContain('let a = 0;');
      expect(code).toContain('let b = 1;');
      expect(code).toContain('while (i < 10)');
      expect(code).toContain('let temp = a + b;');
    });

    it('should generate factorial program', () => {
      const code = generate(`
        let n = 5;
        let result = 1;

        for (let i = 1; i <= n; i = i + 1) {
          result = result * i;
        }
      `);

      expect(code).toContain('let n = 5;');
      expect(code).toContain('for (let i = 1; i <= n; i = i + 1)');
      expect(code).toContain('result = result * i;');
    });

    it('should generate nested control flow', () => {
      const code = generate(`
        let x = 10;

        if (x > 5) {
          while (x > 0) {
            if (x == 7) {
              break;
            }
            x = x - 1;
          }
        }
      `);

      expect(code).toContain('if (x > 5)');
      expect(code).toContain('while (x > 0)');
      expect(code).toContain('if (x == 7)');
      expect(code).toContain('break;');
    });
  });

  describe('Indentation', () => {
    it('should properly indent nested structures', () => {
      const code = generate(`
        if (true) {
          let x = 5;
          if (x > 3) {
            x = x + 1;
          }
        }
      `);

      const lines = code.split('\n').map(l => l.replace(/\s+$/, ''));

      expect(lines.some(l => l === 'if (true) {')).toBe(true);
      expect(lines.some(l => l === '  let x = 5;')).toBe(true);
      expect(lines.some(l => l === '  if (x > 3) {')).toBe(true);
      expect(lines.some(l => l === '    x = x + 1;')).toBe(true);
    });
  });
});

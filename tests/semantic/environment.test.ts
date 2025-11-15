import { Environment, SymbolInfo } from '../../src/semantic/environment';

describe('Environment (Symbol Table)', () => {
  describe('Constructor', () => {
    it('should create environment without parent', () => {
      const env = new Environment();

      expect(env.isGlobal()).toBe(true);
      expect(env.getParent()).toBe(null);
    });

    it('should create environment with parent', () => {
      const parent = new Environment();
      const child = new Environment(parent);

      expect(child.isGlobal()).toBe(false);
      expect(child.getParent()).toBe(parent);
    });
  });

  describe('define()', () => {
    it('should define a variable', () => {
      const env = new Environment();
      const info: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      env.define('x', info);

      expect(env.exists('x')).toBe(true);
      expect(env.lookup('x')).toBe(info);
    });

    it('should throw error for duplicate declaration in same scope', () => {
      const env = new Environment();
      const info: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      env.define('x', info);

      expect(() => {
        env.define('x', info);
      }).toThrow("Variable 'x' already declared in this scope");
    });

    it('should allow same variable name in different scopes', () => {
      const parent = new Environment();
      const child = parent.createChild();

      const info: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      parent.define('x', info);

      // Child can define its own 'x' (shadowing)
      expect(() => {
        child.define('x', info);
      }).not.toThrow();
    });
  });

  describe('lookup()', () => {
    it('should find variable in current scope', () => {
      const env = new Environment();
      const info: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      env.define('x', info);

      expect(env.lookup('x')).toBe(info);
    });

    it('should find variable in parent scope', () => {
      const parent = new Environment();
      const child = parent.createChild();

      const info: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      parent.define('x', info);

      expect(child.lookup('x')).toBe(info);
    });

    it('should return undefined for non-existent variable', () => {
      const env = new Environment();

      expect(env.lookup('x')).toBe(undefined);
    });

    it('should find variable in grandparent scope', () => {
      const global = new Environment();
      const parent = global.createChild();
      const child = parent.createChild();

      const info: SymbolInfo = {
        kind: 'const',
        type: 'string',
        initialized: true,
        line: 1,
        column: 1
      };

      global.define('x', info);

      expect(child.lookup('x')).toBe(info);
    });

    it('should shadow parent variable', () => {
      const parent = new Environment();
      const child = parent.createChild();

      const parentInfo: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      const childInfo: SymbolInfo = {
        kind: 'let',
        type: 'string',
        initialized: true,
        line: 5,
        column: 10
      };

      parent.define('x', parentInfo);
      child.define('x', childInfo);

      expect(child.lookup('x')).toBe(childInfo);
      expect(parent.lookup('x')).toBe(parentInfo);
    });
  });

  describe('exists()', () => {
    it('should return true if variable exists', () => {
      const env = new Environment();
      const info: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      env.define('x', info);

      expect(env.exists('x')).toBe(true);
    });

    it('should return false if variable does not exist', () => {
      const env = new Environment();

      expect(env.exists('x')).toBe(false);
    });

    it('should return true if variable exists in parent', () => {
      const parent = new Environment();
      const child = parent.createChild();

      const info: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      parent.define('x', info);

      expect(child.exists('x')).toBe(true);
    });
  });

  describe('assign()', () => {
    it('should allow assignment to let variable', () => {
      const env = new Environment();
      const info: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      env.define('x', info);

      expect(() => {
        env.assign('x');
      }).not.toThrow();
    });

    it('should throw error for assignment to const variable', () => {
      const env = new Environment();
      const info: SymbolInfo = {
        kind: 'const',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      env.define('PI', info);

      expect(() => {
        env.assign('PI');
      }).toThrow("Cannot assign to const variable 'PI'");
    });

    it('should return undefined for non-existent variable', () => {
      const env = new Environment();

      const result = env.assign('x');

      expect(result).toBe(undefined);
    });

    it('should allow assignment to let in parent scope', () => {
      const parent = new Environment();
      const child = parent.createChild();

      const info: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      parent.define('x', info);

      expect(() => {
        child.assign('x');
      }).not.toThrow();
    });

    it('should throw error for const in parent scope', () => {
      const parent = new Environment();
      const child = parent.createChild();

      const info: SymbolInfo = {
        kind: 'const',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      parent.define('PI', info);

      expect(() => {
        child.assign('PI');
      }).toThrow("Cannot assign to const variable 'PI'");
    });
  });

  describe('createChild()', () => {
    it('should create child environment', () => {
      const parent = new Environment();
      const child = parent.createChild();

      expect(child.getParent()).toBe(parent);
      expect(child.isGlobal()).toBe(false);
    });

    it('should create nested children', () => {
      const global = new Environment();
      const level1 = global.createChild();
      const level2 = level1.createChild();

      expect(global.isGlobal()).toBe(true);
      expect(level1.isGlobal()).toBe(false);
      expect(level2.isGlobal()).toBe(false);
      expect(level2.getParent()).toBe(level1);
    });
  });

  describe('getSymbols()', () => {
    it('should return all symbols in current scope', () => {
      const env = new Environment();

      const info1: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      const info2: SymbolInfo = {
        kind: 'const',
        type: 'string',
        initialized: true,
        line: 2,
        column: 7
      };

      env.define('x', info1);
      env.define('y', info2);

      const symbols = env.getSymbols();

      expect(symbols.size).toBe(2);
      expect(symbols.get('x')).toBe(info1);
      expect(symbols.get('y')).toBe(info2);
    });

    it('should not include parent symbols', () => {
      const parent = new Environment();
      const child = parent.createChild();

      const info: SymbolInfo = {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      };

      parent.define('x', info);

      const childSymbols = child.getSymbols();

      expect(childSymbols.size).toBe(0);
    });
  });

  describe('Realistic Scope Scenarios', () => {
    it('should handle nested block scopes', () => {
      // Simulating:
      // let x = 5;           // global
      // {
      //   let y = 10;        // block 1
      //   {
      //     let z = 15;      // block 2
      //     // Can access x, y, z
      //   }
      //   // Can access x, y (but not z)
      // }
      // // Can access x (but not y or z)

      const global = new Environment();
      global.define('x', {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 1,
        column: 5
      });

      const block1 = global.createChild();
      block1.define('y', {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 3,
        column: 7
      });

      const block2 = block1.createChild();
      block2.define('z', {
        kind: 'let',
        type: 'number',
        initialized: true,
        line: 5,
        column: 9
      });

      // block2 can see all
      expect(block2.exists('x')).toBe(true);
      expect(block2.exists('y')).toBe(true);
      expect(block2.exists('z')).toBe(true);

      // block1 can see x, y but not z
      expect(block1.exists('x')).toBe(true);
      expect(block1.exists('y')).toBe(true);
      expect(block1.exists('z')).toBe(false);

      // global can only see x
      expect(global.exists('x')).toBe(true);
      expect(global.exists('y')).toBe(false);
      expect(global.exists('z')).toBe(false);
    });

    it('should handle variable shadowing correctly', () => {
      // Simulating:
      // let x = 'global';
      // {
      //   let x = 'block';  // shadows global x
      //   // x is 'block' here
      // }
      // // x is 'global' here

      const global = new Environment();
      global.define('x', {
        kind: 'let',
        type: 'string',
        initialized: true,
        line: 1,
        column: 5
      });

      const block = global.createChild();
      block.define('x', {
        kind: 'let',
        type: 'string',
        initialized: true,
        line: 3,
        column: 7
      });

      const globalX = global.lookup('x')!;
      const blockX = block.lookup('x')!;

      expect(globalX.line).toBe(1);
      expect(blockX.line).toBe(3);
      expect(globalX).not.toBe(blockX);
    });
  });
});

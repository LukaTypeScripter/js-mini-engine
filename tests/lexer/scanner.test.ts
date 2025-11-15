import { Scanner } from '../../src/lexer';

describe('Scanner', () => {
  describe('Constructor', () => {
    it('should create a Scanner instance', () => {
      const scanner = new Scanner('test');
      expect(scanner).toBeDefined();
      expect(scanner).toBeInstanceOf(Scanner);
    });
  });

  describe('isAtEnd()', () => {
    it('should return false when not at end', () => {
      const scanner = new Scanner('abc');
      expect(scanner.isAtEnd()).toBe(false);
    });

    it('should return true when at end of empty string', () => {
      const scanner = new Scanner('');
      expect(scanner.isAtEnd()).toBe(true);
    });

    it('should return true after consuming all characters', () => {
      const scanner = new Scanner('a');
      scanner.moveNextCharacter();
      expect(scanner.isAtEnd()).toBe(true);
    });
  });

  describe('peek()', () => {
    it('should return current character without advancing', () => {
      const scanner = new Scanner('abc');
      expect(scanner.peek()).toBe('a');
      expect(scanner.peek()).toBe('a');
    });

    it('should return null character when at end', () => {
      const scanner = new Scanner('');
      expect(scanner.peek()).toBe('\0');
    });
  });

  describe('peekNext()', () => {
    it('should return next character without advancing', () => {
      const scanner = new Scanner('abc');
      expect(scanner.peekNext()).toBe('b');
    });

    it('should return null character when next is beyond end', () => {
      const scanner = new Scanner('a');
      expect(scanner.peekNext()).toBe('\0');
    });

    it('should return null character when at end', () => {
      const scanner = new Scanner('');
      expect(scanner.peekNext()).toBe('\0');
    });
  });

  describe('moveNextCharacter()', () => {
    it('should return current character and advance', () => {
      const scanner = new Scanner('abc');
      expect(scanner.moveNextCharacter()).toBe('a');
      expect(scanner.peek()).toBe('b');
    });

    it('should advance through all characters', () => {
      const scanner = new Scanner('abc');
      expect(scanner.moveNextCharacter()).toBe('a');
      expect(scanner.moveNextCharacter()).toBe('b');
      expect(scanner.moveNextCharacter()).toBe('c');
      expect(scanner.isAtEnd()).toBe(true);
    });
  });

  describe('match()', () => {
    it('should return true and advance when character matches', () => {
      const scanner = new Scanner('abc');
      expect(scanner.match('a')).toBe(true);
      expect(scanner.peek()).toBe('b');
    });

    it('should return false and not advance when character does not match', () => {
      const scanner = new Scanner('abc');
      expect(scanner.match('b')).toBe(false);
      expect(scanner.peek()).toBe('a');
    });

    it('should return false when at end', () => {
      const scanner = new Scanner('');
      expect(scanner.match('a')).toBe(false);
    });

    it('should return true when its digit', () => {
      const scanner = new Scanner('12');
      scanner.isDigit(scanner.peek());
      expect(scanner.isDigit(scanner.peek())).toBe(true);
    });
  });

  describe('skipWhiteSpace()', () => {
    it('should skip spaces', () => {
      const scanner = new Scanner('   abc');
      scanner.skipWhiteSpace();
      expect(scanner.peek()).toBe('a');
    });

    it('should skip tabs', () => {
      const scanner = new Scanner('\t\tabc');
      scanner.skipWhiteSpace();
      expect(scanner.peek()).toBe('a');
    });

    it('should skip carriage returns', () => {
      const scanner = new Scanner('\r\rabc');
      scanner.skipWhiteSpace();
      expect(scanner.peek()).toBe('a');
    });

    it('should skip newlines and increment line counter', () => {
      const scanner = new Scanner('\n\nabc');
      scanner.skipWhiteSpace();
      expect(scanner.peek()).toBe('a');
    });

    it('should skip mixed whitespace', () => {
      const scanner = new Scanner('  \t\n\r  abc');
      scanner.skipWhiteSpace();
      expect(scanner.peek()).toBe('a');
    });

    it('should not skip non-whitespace characters', () => {
      const scanner = new Scanner('abc');
      scanner.skipWhiteSpace();
      expect(scanner.peek()).toBe('a');
    });

    it('should handle empty string', () => {
      const scanner = new Scanner('');
      scanner.skipWhiteSpace();
      expect(scanner.isAtEnd()).toBe(true);
    });
  });


  describe('scanNumber()', () => {
    it('should scan integer numbers', () => {
      const scanner = new Scanner('12344');
      expect(scanner.scanNumber()).toBe('12344');
    });

    it('should scan decimal numbers', () => {
      const scanner = new Scanner('123.45');
      expect(scanner.scanNumber()).toBe('123.45');
    });

    it('should scan only the number part', () => {
      const scanner = new Scanner('123abc');
      expect(scanner.scanNumber()).toBe('123');
      expect(scanner.peek()).toBe('a');
    });

    it('should handle decimal with no digits after dot', () => {
      const scanner = new Scanner('123.');
      expect(scanner.scanNumber()).toBe('123');
      expect(scanner.peek()).toBe('.');
    });
  })

  describe('scanIdentifier()', () => {
    it('should scan Alpha', () => {
      const scanner = new Scanner('abc');
      expect(scanner.scanIdentifier()).toBe('abc');
    })

    it('should scan underScore', () => {
      const scanner = new Scanner('abc_');
      expect(scanner.scanIdentifier()).toBe('abc_');
    })

    it('should scan digit and uppercase character', () => {
      const scanner = new Scanner('ABC_123');
      expect(scanner.scanIdentifier()).toBe('ABC_123');
    })
  })

  describe('scanString()', () => {
    it('should scan double-quoted string', () => {
      const scanner = new Scanner('"ABC_123"');
      expect(scanner.scanString()).toBe('ABC_123');
    });

    it('should scan single-quoted string', () => {
      const scanner = new Scanner("'hello world'");
      expect(scanner.scanString()).toBe('hello world');
    });

    it('should scan empty string', () => {
      const scanner = new Scanner('""');
      expect(scanner.scanString()).toBe('');
    });

    it('should throw error for unterminated string', () => {
      const scanner = new Scanner('"unterminated');
      expect(() => scanner.scanString()).toThrow('Unterminated string');
    });
  })
});

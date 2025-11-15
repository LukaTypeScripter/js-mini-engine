import { Scanner } from '../../src/lexer';
import {TokenType} from "../../src/core";

describe('scanTokens()', () => {
  describe('Numbers', () => {
    it('should tokenize a single number', () => {
      const scanner = new Scanner('123');
      const tokens = scanner.scanTokens();

      expect(tokens).toHaveLength(2);
      expect(tokens[0].type).toBe(TokenType.NUMBER);
      expect(tokens[0].value).toBe('123');
      expect(tokens[1].type).toBe(TokenType.EOF);
    });

    it('should tokenize decimal numbers', () => {
      const scanner = new Scanner('45.67');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.NUMBER);
      expect(tokens[0].value).toBe('45.67');
    });

    it('should tokenize multiple numbers', () => {
      const scanner = new Scanner('10 20 30');
      const tokens = scanner.scanTokens();

      expect(tokens).toHaveLength(4); // 3 numbers + EOF
      expect(tokens[0].value).toBe('10');
      expect(tokens[1].value).toBe('20');
      expect(tokens[2].value).toBe('30');
    });
  });

  describe('Identifiers', () => {
    it('should tokenize identifiers', () => {
      const scanner = new Scanner('myVar');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('myVar');
    });

    it('should tokenize identifiers with underscores', () => {
      const scanner = new Scanner('_private');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('_private');
    });

    it('should tokenize identifiers with numbers', () => {
      const scanner = new Scanner('var123');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[0].value).toBe('var123');
    });
  });

  describe('Keywords', () => {
    it('should recognize let keyword', () => {
      const scanner = new Scanner('let');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.LET);
      expect(tokens[0].value).toBe('let');
    });

    it('should recognize if keyword', () => {
      const scanner = new Scanner('if');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.IF);
    });

    it('should recognize function keyword', () => {
      const scanner = new Scanner('function');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.FUNCTION);
    });

    it('should recognize true/false keywords', () => {
      const scanner = new Scanner('true false');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.TRUE);
      expect(tokens[1].type).toBe(TokenType.FALSE);
    });
  });

  describe('Strings', () => {
    it('should tokenize double-quoted strings', () => {
      const scanner = new Scanner('"hello"');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.STRING);
      expect(tokens[0].value).toBe('hello');
    });

    it('should tokenize single-quoted strings', () => {
      const scanner = new Scanner("'world'");
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.STRING);
      expect(tokens[0].value).toBe('world');
    });

    it('should tokenize strings with spaces', () => {
      const scanner = new Scanner('"hello world"');
      const tokens = scanner.scanTokens();

      expect(tokens[0].value).toBe('hello world');
    });
  });

  describe('Operators', () => {
    it('should tokenize arithmetic operators', () => {
      const scanner = new Scanner('+ - * / %');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.PLUS);
      expect(tokens[1].type).toBe(TokenType.MINUS);
      expect(tokens[2].type).toBe(TokenType.STAR);
      expect(tokens[3].type).toBe(TokenType.SLASH);
      expect(tokens[4].type).toBe(TokenType.PERCENT);
    });

    it('should tokenize comparison operators', () => {
      const scanner = new Scanner('== != < <= > >=');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.EQUAL_EQUAL);
      expect(tokens[1].type).toBe(TokenType.BANG_EQUAL);
      expect(tokens[2].type).toBe(TokenType.LESS);
      expect(tokens[3].type).toBe(TokenType.LESS_EQUAL);
      expect(tokens[4].type).toBe(TokenType.GREATER);
      expect(tokens[5].type).toBe(TokenType.GREATER_EQUAL);
    });

    it('should tokenize logical operators', () => {
      const scanner = new Scanner('! && ||');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.BANG);
      expect(tokens[1].type).toBe(TokenType.AND);
      expect(tokens[2].type).toBe(TokenType.OR);
    });

    it('should tokenize assignment operator', () => {
      const scanner = new Scanner('=');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.EQUAL);
    });
  });

  describe('Punctuation', () => {
    it('should tokenize parentheses', () => {
      const scanner = new Scanner('( )');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.LPAREN);
      expect(tokens[1].type).toBe(TokenType.RPAREN);
    });
  });

  describe('Complex expressions', () => {
    it('should tokenize arithmetic expression', () => {
      const scanner = new Scanner('2 + 3 * 4');
      const tokens = scanner.scanTokens();

      expect(tokens).toHaveLength(6); // 2, +, 3, *, 4, EOF
      expect(tokens[0].type).toBe(TokenType.NUMBER);
      expect(tokens[0].value).toBe('2');
      expect(tokens[1].type).toBe(TokenType.PLUS);
      expect(tokens[2].type).toBe(TokenType.NUMBER);
      expect(tokens[2].value).toBe('3');
      expect(tokens[3].type).toBe(TokenType.STAR);
      expect(tokens[4].type).toBe(TokenType.NUMBER);
      expect(tokens[4].value).toBe('4');
      expect(tokens[5].type).toBe(TokenType.EOF);
    });

    it('should tokenize expression with parentheses', () => {
      const scanner = new Scanner('(2 + 3) * 4');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.LPAREN);
      expect(tokens[1].type).toBe(TokenType.NUMBER);
      expect(tokens[2].type).toBe(TokenType.PLUS);
      expect(tokens[3].type).toBe(TokenType.NUMBER);
      expect(tokens[4].type).toBe(TokenType.RPAREN);
      expect(tokens[5].type).toBe(TokenType.STAR);
      expect(tokens[6].type).toBe(TokenType.NUMBER);
    });

    it('should tokenize variable assignment', () => {
      const scanner = new Scanner('let x = 10');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.LET);
      expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].value).toBe('x');
      expect(tokens[2].type).toBe(TokenType.EQUAL);
      expect(tokens[3].type).toBe(TokenType.NUMBER);
      expect(tokens[3].value).toBe('10');
    });

    it('should tokenize comparison expression', () => {
      const scanner = new Scanner('x == 5');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
      expect(tokens[1].type).toBe(TokenType.EQUAL_EQUAL);
      expect(tokens[2].type).toBe(TokenType.NUMBER);
    });

    it('should tokenize string concatenation', () => {
      const scanner = new Scanner('"hello" + "world"');
      const tokens = scanner.scanTokens();

      expect(tokens[0].type).toBe(TokenType.STRING);
      expect(tokens[0].value).toBe('hello');
      expect(tokens[1].type).toBe(TokenType.PLUS);
      expect(tokens[2].type).toBe(TokenType.STRING);
      expect(tokens[2].value).toBe('world');
    });
  });

  describe('Whitespace handling', () => {
    it('should skip spaces', () => {
      const scanner = new Scanner('   123   ');
      const tokens = scanner.scanTokens();

      expect(tokens).toHaveLength(2); // NUMBER + EOF
      expect(tokens[0].type).toBe(TokenType.NUMBER);
    });

    it('should skip tabs and newlines', () => {
      const scanner = new Scanner('\t123\n456\r\n789');
      const tokens = scanner.scanTokens();

      expect(tokens).toHaveLength(4); // 3 numbers + EOF
      expect(tokens[0].value).toBe('123');
      expect(tokens[1].value).toBe('456');
      expect(tokens[2].value).toBe('789');
    });
  });

  describe('EOF token', () => {
    it('should always add EOF token at the end', () => {
      const scanner = new Scanner('123');
      const tokens = scanner.scanTokens();

      expect(tokens[tokens.length - 1].type).toBe(TokenType.EOF);
    });

    it('should add EOF token for empty input', () => {
      const scanner = new Scanner('');
      const tokens = scanner.scanTokens();

      expect(tokens).toHaveLength(1);
      expect(tokens[0].type).toBe(TokenType.EOF);
    });
  });

  describe('Line and column tracking', () => {
    it('should track line numbers', () => {
      const scanner = new Scanner('123\n456');
      const tokens = scanner.scanTokens();

      expect(tokens[0].line).toBe(0);
      expect(tokens[1].line).toBe(1);
    });

    it('should track column numbers', () => {
      const scanner = new Scanner('123 + 456');
      const tokens = scanner.scanTokens();

      expect(tokens[0].column).toBeGreaterThanOrEqual(0);
      expect(tokens[1].column).toBeGreaterThan(tokens[0].column);
    });
  });
});

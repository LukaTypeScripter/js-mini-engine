import { Parser } from '../../src/parser/parser';
import { Scanner } from '../../src/lexer';
import { TokenType } from '../../src/core';

describe('Parser Helper Methods', () => {
  function createParser(source: string): Parser {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    return new Parser(tokens);
  }

  describe('peek()', () => {
    it('should return current token without consuming', () => {
      const parser = createParser('123');

      const token1 = parser.peek();
      const token2 = parser.peek();

      expect(token1).toBe(token2);
      expect(token1.type).toBe(TokenType.NUMBER);
      expect(token1.value).toBe('123');
    });
  });

  describe('isAtEnd()', () => {
    it('should return false when not at end', () => {
      const parser = createParser('123');

      expect(parser.isAtEnd()).toBe(false);
    });

    it('should return true when at EOF', () => {
      const parser = createParser('');

      expect(parser.isAtEnd()).toBe(true);
    });
  });

  describe('advance()', () => {
    it('should consume token and move forward', () => {
      const parser = createParser('123 + 456');

      const token1 = parser.advance();
      expect(token1.type).toBe(TokenType.NUMBER);
      expect(token1.value).toBe('123');

      const token2 = parser.peek();
      expect(token2.type).toBe(TokenType.PLUS);
    });

    it('should not go past EOF', () => {
      const parser = createParser('');

      parser.advance();
      parser.advance();

      expect(parser.isAtEnd()).toBe(true);
    });
  });

  describe('previous()', () => {
    it('should return the last consumed token', () => {
      const parser = createParser('123 + 456');

      parser.advance();

      const prev = parser.previous();
      expect(prev.type).toBe(TokenType.NUMBER);
      expect(prev.value).toBe('123');
    });
  });

  describe('check()', () => {
    it('should return true if current token matches', () => {
      const parser = createParser('123');

      expect(parser.check(TokenType.NUMBER)).toBe(true);
      expect(parser.check(TokenType.PLUS)).toBe(false);
    });

    it('should not consume the token', () => {
      const parser = createParser('123');

      parser.check(TokenType.NUMBER);

      expect(parser.peek().type).toBe(TokenType.NUMBER);
    });
  });

  describe('match()', () => {
    it('should consume token if it matches', () => {
      const parser = createParser('123 + 456');

      const matched = parser.match(TokenType.NUMBER);

      expect(matched).toBe(true);
      expect(parser.peek().type).toBe(TokenType.PLUS);
    });

    it('should not consume if no match', () => {
      const parser = createParser('123');

      const matched = parser.match(TokenType.PLUS);

      expect(matched).toBe(false);
      expect(parser.peek().type).toBe(TokenType.NUMBER);
    });

    it('should match any of multiple types', () => {
      const parser = createParser('+');

      const matched = parser.match(TokenType.PLUS, TokenType.MINUS, TokenType.STAR);

      expect(matched).toBe(true);
    });
  });

  describe('consume()', () => {
    it('should consume token if it matches', () => {
      const parser = createParser('123');

      const token = parser.consume(TokenType.NUMBER, 'Expected number');

      expect(token.type).toBe(TokenType.NUMBER);
      expect(parser.isAtEnd()).toBe(true); // Moved to EOF
    });

    it('should throw error if token does not match', () => {
      const parser = createParser('123');

      expect(() => {
        parser.consume(TokenType.PLUS, 'Expected +');
      }).toThrow('Expected +');
    });
  });

  describe('error()', () => {
    it('should create error with location info', () => {
      const parser = createParser('123');
      const token = parser.peek();

      const error = parser.error(token, 'Test error');

      expect(error.message).toContain('Line');
      expect(error.message).toContain('Test error');
      expect(error.message).toContain('123');
    });
  });
});

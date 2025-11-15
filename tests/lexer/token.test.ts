import { Token, TokenType, lookupIdentifier, KEYWORDS } from '../../src/lexer/token';

describe('Token', () => {
  describe('Constructor', () => {
    it('should create a token with all properties', () => {
      const token = new Token(TokenType.NUMBER, '123', 1, 5);

      expect(token.type).toBe(TokenType.NUMBER);
      expect(token.value).toBe('123');
      expect(token.line).toBe(1);
      expect(token.column).toBe(5);
    });

    it('should use default line and column values', () => {
      const token = new Token(TokenType.PLUS, '+');

      expect(token.line).toBe(1);
      expect(token.column).toBe(0);
    });
  });

  describe('toString()', () => {
    it('should return formatted string representation', () => {
      const token = new Token(TokenType.STRING, 'hello', 2, 10);

      expect(token.toString()).toBe("Token(STRING, 'hello', 2:10)");
    });
  });

  describe('is()', () => {
    it('should return true when type matches', () => {
      const token = new Token(TokenType.IDENTIFIER, 'x');

      expect(token.is(TokenType.IDENTIFIER)).toBe(true);
    });

    it('should return false when type does not match', () => {
      const token = new Token(TokenType.IDENTIFIER, 'x');

      expect(token.is(TokenType.NUMBER)).toBe(false);
    });
  });

  describe('isOneOf()', () => {
    it('should return true when type matches one of the types', () => {
      const token = new Token(TokenType.PLUS, '+');

      expect(token.isOneOf(TokenType.PLUS, TokenType.MINUS, TokenType.STAR)).toBe(true);
    });

    it('should return false when type does not match any types', () => {
      const token = new Token(TokenType.NUMBER, '123');

      expect(token.isOneOf(TokenType.PLUS, TokenType.MINUS, TokenType.STAR)).toBe(false);
    });
  });
});

describe('lookupIdentifier', () => {
  it('should return keyword token type for reserved words', () => {
    expect(lookupIdentifier('let')).toBe(TokenType.LET);
    expect(lookupIdentifier('const')).toBe(TokenType.CONST);
    expect(lookupIdentifier('if')).toBe(TokenType.IF);
    expect(lookupIdentifier('else')).toBe(TokenType.ELSE);
    expect(lookupIdentifier('function')).toBe(TokenType.FUNCTION);
    expect(lookupIdentifier('return')).toBe(TokenType.RETURN);
    expect(lookupIdentifier('while')).toBe(TokenType.WHILE);
    expect(lookupIdentifier('for')).toBe(TokenType.FOR);
    expect(lookupIdentifier('true')).toBe(TokenType.TRUE);
    expect(lookupIdentifier('false')).toBe(TokenType.FALSE);
    expect(lookupIdentifier('null')).toBe(TokenType.NULL);
  });

  it('should return IDENTIFIER for non-keywords', () => {
    expect(lookupIdentifier('myVariable')).toBe(TokenType.IDENTIFIER);
    expect(lookupIdentifier('userName')).toBe(TokenType.IDENTIFIER);
    expect(lookupIdentifier('x')).toBe(TokenType.IDENTIFIER);
    expect(lookupIdentifier('_private')).toBe(TokenType.IDENTIFIER);
  });

  it('should be case-sensitive', () => {
    expect(lookupIdentifier('Let')).toBe(TokenType.IDENTIFIER);
    expect(lookupIdentifier('LET')).toBe(TokenType.IDENTIFIER);
    expect(lookupIdentifier('IF')).toBe(TokenType.IDENTIFIER);
  });
});

describe('KEYWORDS', () => {
  it('should contain all keywords', () => {
    expect(KEYWORDS.size).toBeGreaterThan(0);
    expect(KEYWORDS.has('let')).toBe(true);
    expect(KEYWORDS.has('const')).toBe(true);
    expect(KEYWORDS.has('function')).toBe(true);
    expect(KEYWORDS.has('true')).toBe(true);
    expect(KEYWORDS.has('false')).toBe(true);
    expect(KEYWORDS.has('null')).toBe(true);
  });
});

describe('TokenType', () => {
  it('should have all literal types', () => {
    expect(TokenType.NUMBER).toBe('NUMBER');
    expect(TokenType.STRING).toBe('STRING');
    expect(TokenType.IDENTIFIER).toBe('IDENTIFIER');
    expect(TokenType.TRUE).toBe('TRUE');
    expect(TokenType.FALSE).toBe('FALSE');
    expect(TokenType.NULL).toBe('NULL');
  });

  it('should have all operator types', () => {
    expect(TokenType.PLUS).toBe('PLUS');
    expect(TokenType.MINUS).toBe('MINUS');
    expect(TokenType.STAR).toBe('STAR');
    expect(TokenType.SLASH).toBe('SLASH');
    expect(TokenType.EQUAL).toBe('EQUAL');
    expect(TokenType.EQUAL_EQUAL).toBe('EQUAL_EQUAL');
  });

  it('should have all punctuation types', () => {
    expect(TokenType.LPAREN).toBe('LPAREN');
    expect(TokenType.RPAREN).toBe('RPAREN');
    expect(TokenType.LBRACE).toBe('LBRACE');
    expect(TokenType.RBRACE).toBe('RBRACE');
    expect(TokenType.SEMICOLON).toBe('SEMICOLON');
    expect(TokenType.COMMA).toBe('COMMA');
  });

  it('should have special types', () => {
    expect(TokenType.EOF).toBe('EOF');
    expect(TokenType.ILLEGAL).toBe('ILLEGAL');
  });
});

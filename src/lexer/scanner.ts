import {lookupIdentifier, TokenI, TokenType} from "../core";


export class Scanner {
     #source!:string;
     #current = 0;
     #line = 0
    #column = 0

    constructor(source: string) {
        this.#source = source;
    }

    peek() {
        if(this.isAtEnd()) return '\0';

        return this.#source[this.#current]
    }

    peekNext() {
        if(this.#current + 1 >= this.#source.length) return '\0';
        return this.#source[this.#current + 1]
    }

     moveNextCharacter() {
        const char = this.#source[this.#current];
        this.#current++;
        this.#column++;
        return char
    }


     isAtEnd() {
        return this.#current >= this.#source.length;
    }

    isDigit(char:string) {
         return char >= '0' && char <= '9';
    }

    match(expected: string) {
        if(this.isAtEnd() || this.#source[this.#current] !== expected) return false;

        this.#current++;
        return true;
    }

    skipWhiteSpace() {
        while(!this.isAtEnd()) {
            const char = this.peek();

            if(char === ' ' || char === '\t' || char === '\r') {
                this.moveNextCharacter()
            } else if(char === '\n') {
                this.#line++;
                this.#column = 0;
                this.moveNextCharacter()
            } else {
                break
            }
        }
    }

    scanNumber() {
        let result = '';

        while (!this.isAtEnd() && this.isDigit(this.peek())) {
            result += this.moveNextCharacter();
        }

        if(this.peek() === '.' && this.isDigit(this.peekNext())) {
            result += this.moveNextCharacter();

            while (!this.isAtEnd() && this.isDigit(this.peek())) {
                result += this.moveNextCharacter();
            }
        }

        return result;
    }

    scanIdentifier() {
         let result = '';

         if(this.isAlpha(this.peek())) {
             result += this.moveNextCharacter();
         }

         while(!this.isAtEnd() && this.isAlphaNumeric(this.peek())) {
             result += this.moveNextCharacter();
         }

         return result;
    }

    isAlpha(char:string) {
        return (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z') ||
            char === '_';
    }

    isAlphaNumeric(char:string) {
         return this.isAlpha(char) || this.isDigit(char)
    }

    scanString() {
         const quote = this.moveNextCharacter()
         let result = '';

         while (!this.isAtEnd() && this.peek() !== quote) {
             result += this.moveNextCharacter();
         }

         if(this.isAtEnd()) {
             throw new Error('Unterminated string');
         }
        this.moveNextCharacter();

         return result;
    }


    scanTokens(): TokenI[] {
        const tokenList: TokenI[] = [];
       while(!this.isAtEnd()) {
           this.skipWhiteSpace()

           if(this.isAtEnd()) break

           const char = this.peek()

           if(this.isDigit(char)) {
               const value = this.scanNumber();
               tokenList.push(this.createToken(TokenType.NUMBER, value))
           } else if(this.isAlpha(char)) {
               const identifier = this.scanIdentifier();
               const tokenType = lookupIdentifier(identifier);
               tokenList.push(this.createToken(tokenType, identifier))

           } else if(char === '"' || char === "'") {
               const string = this.scanString()
               tokenList.push(this.createToken(TokenType.STRING, string))
           }     else if(char === '(') {
               this.moveNextCharacter();
               tokenList.push(this.createToken(TokenType.LPAREN, '('));
           }
           else if(char === ')') {
               this.moveNextCharacter();
               tokenList.push(this.createToken(TokenType.RPAREN, ')'));
           }
           else {
               const token = this.scanOperator()
               tokenList.push(token)
           }
       }

        tokenList.push(this.createToken(TokenType.EOF, ''));

       return tokenList;
    }

    createToken(type: TokenType, value: string): TokenI {
        return { type, value, line: this.#line, column: this.#column };
    }


    scanOperator(): TokenI {
        const char = this.peek();

        switch (char) {
            case '+':
                this.moveNextCharacter();
                return this.createToken(TokenType.PLUS, '+');

            case '-':
                this.moveNextCharacter();
                return this.createToken(TokenType.MINUS, '-');

            case '*':
                this.moveNextCharacter();
                return this.createToken(TokenType.STAR, '*');

            case '/':
                this.moveNextCharacter();
                return this.createToken(TokenType.SLASH, '/');

            case '%':
                this.moveNextCharacter();
                return this.createToken(TokenType.PERCENT, '%');

            case '=':
                this.moveNextCharacter();
                if (this.peek() === '=') {
                    this.moveNextCharacter();
                    return this.createToken(TokenType.EQUAL_EQUAL, '==');
                }
                return this.createToken(TokenType.EQUAL, '=');

            case '!':
                this.moveNextCharacter();
                if (this.peek() === '=') {
                    this.moveNextCharacter();
                    return this.createToken(TokenType.BANG_EQUAL, '!=');
                }
                return this.createToken(TokenType.BANG, '!');

            case '<':
                this.moveNextCharacter();
                if (this.peek() === '=') {
                    this.moveNextCharacter();
                    return this.createToken(TokenType.LESS_EQUAL, '<=');
                }
                return this.createToken(TokenType.LESS, '<');

            case '>':
                this.moveNextCharacter();
                if (this.peek() === '=') {
                    this.moveNextCharacter();
                    return this.createToken(TokenType.GREATER_EQUAL, '>=');
                }
                return this.createToken(TokenType.GREATER, '>');

            case '&':
                this.moveNextCharacter();
                if (this.peek() === '&') {
                    this.moveNextCharacter();
                    return this.createToken(TokenType.AND, '&&');
                }
                throw new Error('Unexpected character: &');

            case '|':
                this.moveNextCharacter();
                if (this.peek() === '|') {
                    this.moveNextCharacter();
                    return this.createToken(TokenType.OR, '||');
                }
                throw new Error('Unexpected character: |');

            default:
                throw new Error(`Unknown operator: ${char}`);
        }
    }
}
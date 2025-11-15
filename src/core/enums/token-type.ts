export enum TokenType {
    // Literals
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    IDENTIFIER = 'IDENTIFIER',
    TRUE = 'TRUE',
    FALSE = 'FALSE',
    NULL = 'NULL',

    // Operators - Arithmetic
    PLUS = 'PLUS',          // +
    MINUS = 'MINUS',        // -
    STAR = 'STAR',          // *
    SLASH = 'SLASH',        // /
    PERCENT = 'PERCENT',    // %

    // Operators - Comparison
    EQUAL_EQUAL = 'EQUAL_EQUAL',      // ==
    BANG_EQUAL = 'BANG_EQUAL',        // !=
    LESS = 'LESS',                    // <
    LESS_EQUAL = 'LESS_EQUAL',        // <=
    GREATER = 'GREATER',              // >
    GREATER_EQUAL = 'GREATER_EQUAL',  // >=

    // Operators - Logical
    BANG = 'BANG',          // !
    AND = 'AND',            // &&
    OR = 'OR',              // ||

    // Operators - Assignment
    EQUAL = 'EQUAL',        // =

    // Punctuation
    LPAREN = 'LPAREN',      // (
    RPAREN = 'RPAREN',      // )
    LBRACE = 'LBRACE',      // {
    RBRACE = 'RBRACE',      // }
    LBRACKET = 'LBRACKET',  // [
    RBRACKET = 'RBRACKET',  // ]
    SEMICOLON = 'SEMICOLON', // ;
    COMMA = 'COMMA',        // ,
    DOT = 'DOT',            // .
    COLON = 'COLON',        // :

    // Keywords
    LET = 'LET',
    CONST = 'CONST',
    FUNCTION = 'FUNCTION',
    RETURN = 'RETURN',
    IF = 'IF',
    ELSE = 'ELSE',
    WHILE = 'WHILE',
    FOR = 'FOR',
    BREAK = 'BREAK',
    CONTINUE = 'CONTINUE',
    PRINT = 'PRINT',

    // Special
    EOF = 'EOF',
    ILLEGAL = 'ILLEGAL',
}
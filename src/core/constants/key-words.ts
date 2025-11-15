import {TokenType} from "../enums";


export const KEYWORDS: Map<string, TokenType> = new Map([
    ['let', TokenType.LET],
    ['const', TokenType.CONST],
    ['function', TokenType.FUNCTION],
    ['return', TokenType.RETURN],
    ['if', TokenType.IF],
    ['else', TokenType.ELSE],
    ['while', TokenType.WHILE],
    ['for', TokenType.FOR],
    ['break', TokenType.BREAK],
    ['continue', TokenType.CONTINUE],
    ['true', TokenType.TRUE],
    ['false', TokenType.FALSE],
    ['null', TokenType.NULL],
    ['print', TokenType.PRINT],
]);
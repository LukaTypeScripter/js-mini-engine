import {TokenType} from "../enums";

export interface TokenI {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}
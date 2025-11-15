import {TokenType} from "../enums";
import {KEYWORDS} from "../constants";

export function lookupIdentifier(identifier: string): TokenType {
    return KEYWORDS.get(identifier) || TokenType.IDENTIFIER;
}
#!/usr/bin/env node

import {Scanner} from "./lexer";
import {Parser} from "./parser/parser";

/**
 * Main entry point for the interpreter/compiler
 */

function main(): void {
  console.log('JS Mini Engine - Interpreter/Compiler');
  console.log('Version: 1.0.0');
  console.log('Ready to start development!');
}

function parse(source: string) {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  console.log(tokens)
  const parser = new Parser(tokens);
  return parser.parse();
}

const ast = parse('let x = 5;');


console.log(ast)

// Run if this is the main module
if (require.main === module) {
  main();
}

export { main };

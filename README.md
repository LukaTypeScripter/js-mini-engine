# JS Mini Engine

A TypeScript-based interpreter/compiler built from scratch for educational purposes.

## Project Overview

This project implements a complete interpreter/compiler with:
- **Lexer/Tokenizer** - Converts source code into tokens
- **Parser** (Coming soon) - Builds Abstract Syntax Tree
- **Interpreter/Compiler** (Coming soon) - Executes or compiles code

## Current Status

✅ **Phase 1: Lexical Analysis (Complete)**
- Full tokenizer implementation
- Support for numbers, strings, identifiers, operators, keywords
- Line and column tracking
- Comprehensive test coverage (79 tests passing)

## Features

### Supported Tokens

**Literals:**
- Numbers: `123`, `45.67`
- Strings: `"hello"`, `'world'`
- Identifiers: `myVar`, `_private`

**Keywords:**
- `let`, `const`, `function`, `return`
- `if`, `else`, `while`, `for`
- `true`, `false`, `null`

**Operators:**
- Arithmetic: `+`, `-`, `*`, `/`, `%`
- Comparison: `==`, `!=`, `<`, `<=`, `>`, `>=`
- Logical: `!`, `&&`, `||`
- Assignment: `=`

**Punctuation:**
- `(`, `)`, `{`, `}`, `[`, `]`
- `;`, `,`, `.`, `:`

## Installation

```bash
npm install
```

## Usage

```typescript
import { Scanner } from './src/lexer/scanner';

const source = 'let x = 10 + 5';
const scanner = new Scanner(source);
const tokens = scanner.scanTokens();

console.log(tokens);
```

## Scripts

```bash
npm run build        # Compile TypeScript
npm start            # Run compiled code
npm run dev          # Development mode with auto-reload
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Project Structure

```
js-mini-engine/
├── src/
│   ├── lexer/
│   │   ├── token.ts      # Token types and definitions
│   │   └── scanner.ts    # Tokenizer implementation
│   ├── parser/           # (Coming soon)
│   ├── ast/              # (Coming soon)
│   └── main.ts           # Entry point
├── tests/
│   └── lexer/
│       ├── token.test.ts
│       ├── scanner.test.ts
│       └── scanTokens.test.ts
└── examples/             # Example programs
```

## Development Roadmap

- [x] Lexer/Tokenizer
- [ ] Parser
- [ ] Abstract Syntax Tree (AST)
- [ ] Semantic Analysis
- [ ] Interpreter/Compiler

## Testing

The project has comprehensive test coverage:

```bash
npm test
```

**Test Statistics:**
- Total: 79 tests
- Scanner: 33 tests
- Tokens: 15 tests
- scanTokens: 29 tests
- Main: 2 tests

## Tech Stack

- **TypeScript** - Type-safe language implementation
- **Jest** - Testing framework
- **ts-node** - Development execution
- **nodemon** - Auto-reload during development

## License

ISC

## Contributing

This is an educational project for learning compiler/interpreter design.

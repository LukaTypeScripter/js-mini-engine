# JS Mini Engine

A TypeScript-based interpreter and code generator built from scratch for educational purposes.

## Project Overview

This project implements a complete interpreter and transpiler pipeline:
- **Lexer/Tokenizer** - Converts source code into tokens
- **Parser** - Builds Abstract Syntax Tree (AST)
- **Semantic Analyzer** - Validates types, scopes, and program semantics
- **Interpreter** - Executes programs directly
- **Code Generator** - Transpiles to JavaScript

## Current Status

✅ **All Core Phases Complete**
- Full lexical analysis with token tracking
- Recursive descent parser with operator precedence
- Semantic analysis with type checking and scope validation
- Tree-walking interpreter with control flow support
- JavaScript code generation with configurable formatting
- Comprehensive test coverage (362 tests passing)

## Features

### Language Support

**Data Types:**
- Numbers: `123`, `45.67`
- Strings: `"hello"`, `'world'`
- Booleans: `true`, `false`
- Null: `null`

**Variable Declarations:**
- `let` - mutable variables
- `const` - immutable variables (enforced by semantic analyzer)

**Operators:**
- Arithmetic: `+`, `-`, `*`, `/`, `%`
- Comparison: `==`, `!=`, `<`, `<=`, `>`, `>=`
- Logical: `!`, `&&`, `||` (with short-circuit evaluation)
- Assignment: `=`
- Unary: `-`, `!`

**Control Flow:**
- `if`/`else` statements
- `while` loops
- `for` loops
- `break` and `continue` statements
- `return` statements

**Scoping:**
- Block scoping with `{}`
- Variable shadowing support
- Scope validation in semantic analysis

## Installation

```bash
npm install
```

## Usage

### Running the Interpreter

```typescript
import { Scanner } from './src/lexer';
import { Parser } from './src/parser/parser';
import { SemanticAnalyzer } from './src/semantic';
import { Interpreter } from './src/interpreter';

const source = `
let x = 10;
let y = 20;
if (x < y) {
  x = x + 5;
}
`;

// Lexical analysis
const scanner = new Scanner(source);
const tokens = scanner.scanTokens();

// Parse to AST
const parser = new Parser(tokens);
const ast = parser.parse();

// Semantic analysis
const analyzer = new SemanticAnalyzer();
const errors = analyzer.analyze(ast);
if (errors.length > 0) {
  console.error('Semantic errors:', errors);
  process.exit(1);
}

// Interpret
const interpreter = new Interpreter();
interpreter.interpret(ast);
```

### Generating JavaScript Code

```typescript
import { Scanner } from './src/lexer';
import { Parser } from './src/parser/parser';
import { JavaScriptGenerator } from './src/codegen';

const source = 'let x = 10 + 5;';

const scanner = new Scanner(source);
const tokens = scanner.scanTokens();
const parser = new Parser(tokens);
const ast = parser.parse();

const generator = new JavaScriptGenerator();
const jsCode = generator.generate(ast);
console.log(jsCode);
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
│   ├── core/
│   │   ├── enums/           # Token type enumerations
│   │   ├── types/           # Type definitions
│   │   ├── constants/       # Keywords and constants
│   │   └── functions/       # Helper functions
│   ├── lexer/
│   │   ├── token.ts         # Token class and utilities
│   │   └── scanner.ts       # Lexical analyzer
│   ├── ast/
│   │   ├── nodes.ts         # AST node type definitions
│   │   └── builders.ts      # AST construction helpers
│   ├── parser/
│   │   └── parser.ts        # Recursive descent parser
│   ├── semantic/
│   │   ├── analyzer.ts      # Semantic analysis
│   │   ├── environment.ts   # Symbol table/scope management
│   │   └── types.ts         # Type definitions
│   ├── interpreter/
│   │   ├── interpreter.ts   # Tree-walking interpreter
│   │   ├── runtime-env.ts   # Runtime environment
│   │   ├── values.ts        # Runtime value types
│   │   └── control-flow.ts  # Control flow exceptions
│   ├── codegen/
│   │   └── javascript-generator.ts  # JS code generator
│   └── main.ts              # Entry point
└── tests/
    ├── lexer/               # Lexer tests (48 tests)
    ├── ast/                 # AST builder tests (49 tests)
    ├── parser/              # Parser tests (87 tests)
    ├── semantic/            # Semantic analysis tests (67 tests)
    ├── interpreter/         # Interpreter tests (67 tests)
    ├── codegen/             # Code generator tests (42 tests)
    └── main.test.ts         # Integration tests (2 tests)
```

## Architecture Highlights

### Parser Implementation
- **Recursive Descent Parser** with operator precedence climbing
- **Left-associative** operators for arithmetic and comparison
- **Right-associative** assignment operator
- Proper precedence handling: `()` > unary > `*/%` > `+-` > comparison > equality > `&&` > `||` > `=`

### Semantic Analysis
- **Symbol table** (Environment) with scope chain management
- **Type checking** for operators and expressions
- **Const enforcement** - prevents reassignment to const variables
- **Scope validation** - detects undeclared variables and duplicate declarations
- **Control flow validation** - ensures `break`/`continue` only in loops

### Interpreter
- **Tree-walking interpreter** that directly executes AST
- **Runtime type coercion** for string concatenation
- **Short-circuit evaluation** for logical operators
- **Control flow exceptions** for break/continue/return handling
- **Scoped environments** for proper variable lookup

### Code Generator
- Generates clean, readable JavaScript code
- Configurable formatting (indentation, semicolons, comments)
- Preserves program semantics and structure
- Supports all language features

## Development Roadmap

**Completed:**
- [x] Lexer/Tokenizer
- [x] Parser (Recursive Descent)
- [x] Abstract Syntax Tree (AST)
- [x] Semantic Analysis (Type checking, scope validation)
- [x] Interpreter (Tree-walking)
- [x] Code Generator (JavaScript transpiler)

**Future Enhancements:**
- [ ] Functions and function calls
- [ ] Arrays and array operations
- [ ] Objects and property access
- [ ] Advanced operators (`++`, `--`, `+=`, etc.)
- [ ] Type inference improvements
- [ ] REPL (Read-Eval-Print Loop)
- [ ] Source maps for generated code
- [ ] Bytecode compiler
- [ ] Virtual machine implementation
- [ ] Optimization passes

## Testing

The project has comprehensive test coverage across all components:

```bash
npm test
```

**Test Statistics:**
- **Total: 362 tests** (all passing)
- Lexer tests: 48 tests
  - Token utilities: 15 tests
  - Scanner methods: 33 tests
- AST builders: 49 tests
- Parser tests: 87 tests
  - Expression parsing: 40 tests
  - Statement parsing: 36 tests
  - Helper methods: 11 tests
- Semantic analysis: 67 tests
  - Analyzer: 43 tests
  - Environment/Symbol table: 24 tests
- Interpreter: 67 tests
- Code generator: 42 tests
- Integration: 2 tests

**Run specific test suites:**
```bash
npm test -- lexer           # Run lexer tests only
npm test -- parser          # Run parser tests only
npm test -- semantic        # Run semantic analysis tests
npm test -- interpreter     # Run interpreter tests
npm test -- codegen         # Run code generator tests
```

## Example Programs

The engine can interpret and transpile programs like:

**Fibonacci Sequence:**
```javascript
let a = 0;
let b = 1;
let i = 0;
while (i < 10) {
  let temp = a + b;
  a = b;
  b = temp;
  i = i + 1;
}
```

**Factorial Calculator:**
```javascript
let n = 5;
let result = 1;
let i = 1;
while (i <= n) {
  result = result * i;
  i = i + 1;
}
```

**Conditional Logic:**
```javascript
let x = 10;
let y = 20;

if (x < y) {
  let diff = y - x;
  if (diff > 5) {
    x = x + diff;
  }
} else {
  y = y + 1;
}
```

All examples include:
- Full semantic validation (type checking, scope rules, const enforcement)
- Direct interpretation
- JavaScript code generation

## Tech Stack

- **TypeScript** - Type-safe language implementation
- **Jest** - Testing framework
- **ts-node** - Development execution
- **nodemon** - Auto-reload during development

## License

ISC

## Contributing

This is an educational project for learning compiler/interpreter design.

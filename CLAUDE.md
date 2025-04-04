# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands
- `npm test` - Run all tests
- `npm test -- -t "test name"` - Run specific test
- `npm run lint` - Run ESLint on source files
- `npm run build` - Compile src to dist
- `npm run start` - Run the basic example
- `npm run docs` - Generate JSDoc documentation

## Code Style Guidelines
- **Imports**: Use CommonJS `require()` with destructuring
- **Formatting**: 2-space indentation, K&R style braces
- **Naming**: PascalCase for classes, camelCase for methods/variables
- **Documentation**: JSDoc comments for all classes/methods
- **Error Handling**: Return error objects with { valid, errors } pattern
- **Pattern**: Support method chaining with `return this`
- **Modules**: Maintain clear separation of concerns between files
- **Types**: Document types in JSDoc comments
- **Testing**: Jest is used for testing

When modifying files, maintain existing patterns and ensure all JSDoc documentation is updated appropriately.
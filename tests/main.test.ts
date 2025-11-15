import { main } from '../src/main';

describe('Main Module', () => {
  it('should export main function', () => {
    expect(main).toBeDefined();
    expect(typeof main).toBe('function');
  });

  it('should run without errors', () => {
    // Capture console output
    const consoleSpy = jest.spyOn(console, 'log');

    main();

    expect(consoleSpy).toHaveBeenCalledWith('JS Mini Engine - Interpreter/Compiler');
    expect(consoleSpy).toHaveBeenCalledWith('Version: 1.0.0');

    consoleSpy.mockRestore();
  });
});

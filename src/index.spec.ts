import { makeDebug } from '.';
import { readAllowedNamespaces } from './namespaces';

describe('makeDebug()', () => {
  beforeEach(() => {
    process.env.DEBUG = undefined;
    process.env.DEBUG_COLORS = undefined;
    process.argv = [];
  });

  it('should be a function', () => {
    expect(makeDebug).toBeInstanceOf(Function);
  });

  it('should return a function', () => {
    expect(makeDebug('foo')).toBeInstanceOf(Function);
  });

  it('should return a function with a namespace property', () => {
    expect(makeDebug('foo').namespace).toBe('foo');
  });

  it('should return a function with an enabled property', () => {
    process.env.DEBUG = undefined;
    expect(makeDebug('foo').enabled).toBe(false);
    process.env.DEBUG = '';
    expect(makeDebug('foo').enabled).toBe(false);
    process.env.DEBUG = '[foo]';
    expect(makeDebug('foo').enabled).toBe(true);
    process.env.DEBUG = '*';
    expect(makeDebug('foo').enabled).toBe(true);
    process.env.DEBUG = 'true';
    expect(makeDebug('foo').enabled).toBe(true);
    process.env.DEBUG = '1';
    expect(makeDebug('foo').enabled).toBe(true);
    process.env.DEBUG = 'false';
    expect(makeDebug('foo').enabled).toBe(false);
    process.env.DEBUG = '0';
    expect(makeDebug('foo').enabled).toBe(false);
  });

  it('should return a function with an options property', () => {
    expect(makeDebug('foo').options).toBeInstanceOf(Object);
  });

  it('should return a function with an options.color property', () => {
    expect(makeDebug('foo').options.color).toBe(true);
    expect(makeDebug('foo', { color: true }).options.color).toBe(true);
    expect(makeDebug('foo', { color: false }).options.color).toBe(false);
    process.env.DEBUG_COLORS = 'false';
    expect(makeDebug('foo').options.color).toBe(false);
    expect(makeDebug('foo', { color: true }).options.color).toBe(false);
    process.env.DEBUG_COLORS = 'true';
    expect(makeDebug('foo').options.color).toBe(true);
    expect(makeDebug('foo', { color: false }).options.color).toBe(true);
    process.env.DEBUG_COLORS = '0';
    expect(makeDebug('foo').options.color).toBe(false);
    expect(makeDebug('foo', { color: true }).options.color).toBe(false);
    process.env.DEBUG_COLORS = '1';
    expect(makeDebug('foo').options.color).toBe(true);
    expect(makeDebug('foo', { color: false }).options.color).toBe(true);
  });

  describe('returned function', () => {
    beforeEach(() => {
      process.env.DEBUG = '[foo]';
      process.env.DEBUG_COLORS = undefined;
    });

    it('should not log when enabled is false', () => {
      const debug = makeDebug('foo');
      debug.enabled = false;
      const spy = jest.spyOn(console, 'log');
      debug('bar');
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should log with the correct namespace with colors', () => {
      const debug = makeDebug('foo', { color: true });
      const spy = jest.spyOn(console, 'log');
      debug('bar');
      expect(spy.mock.calls[0][0]).toMatch('[ \x1b[90mfoo\x1b[0m ]');
      expect(spy.mock.calls[0][0]).toMatch('bar');
      spy.mockRestore();
    });

    it('should log with the correct namespace without colors', () => {
      const debug = makeDebug('foo', { color: false });
      const spy = jest.spyOn(console, 'log');
      debug('bar');
      expect(spy.mock.calls[0][0]).toMatch('[ foo ]');
      expect(spy.mock.calls[0][0]).toMatch('bar');
      spy.mockRestore();
    });
  });
});

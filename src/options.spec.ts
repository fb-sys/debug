import { DebugOptions, normalizeOptions } from './options';

describe('normalizeOptions()', () => {
  beforeEach(() => {
    process.env.DEBUG_COLORS = undefined;
  });

  it('should set color to true by default', () => {
    const options = normalizeOptions({});
    expect(options.color).toBe(true);
  });

  it('should set color to true if DEBUG_COLORS is "true"', () => {
    process.env.DEBUG_COLORS = 'true';
    const options = normalizeOptions({});
    expect(options.color).toBe(true);
  });

  it('should set color to false if DEBUG_COLORS is "false"', () => {
    process.env.DEBUG_COLORS = 'false';
    const options = normalizeOptions({});
    expect(options.color).toBe(false);
  });

  it('should override color if DEBUG_COLORS is "true"', () => {
    process.env.DEBUG_COLORS = 'true';
    const options = normalizeOptions({ color: false });
    expect(options.color).toBe(true);
  });

  it('should override color if DEBUG_COLORS is "1"', () => {
    process.env.DEBUG_COLORS = '1';
    const options = normalizeOptions({ color: false });
    expect(options.color).toBe(true);
  });

  it('should override color if DEBUG_COLORS is "false"', () => {
    process.env.DEBUG_COLORS = 'false';
    const options = normalizeOptions({ color: true });
    expect(options.color).toBe(false);
  });

  it('should override color if DEBUG_COLORS is "0"', () => {
    process.env.DEBUG_COLORS = '0';
    const options = normalizeOptions({ color: true });
    expect(options.color).toBe(false);
  });

  it('should not override color if DEBUG_COLORS is not set', () => {
    const options = normalizeOptions({ color: false });
    expect(options.color).toBe(false);
  });
});

export interface DebugOptions {
  color?: boolean;
}

export function normalizeOptions(options: DebugOptions): DebugOptions {
  if (typeof options.color !== 'boolean') options.color = true;

  const debugColors = process.env.DEBUG_COLORS;

  if (debugColors === 'true' || debugColors === '1') options.color = true;
  else if (debugColors === 'false' || debugColors === '0') options.color = false;

  return options;
}

import { formatWithOptions } from 'util';
import { DebugOptions, normalizeOptions } from './options';
import { readAllowedNamespaces, isAllowed } from './namespaces';

export { DebugOptions };

export type DebugFunction = ((...args: any[]) => void) & {
  namespace: string;
  enabled: boolean;
  options: DebugOptions;
};

/**
 * Creates a new debug function with the given namespace and options.
 * @param {string} namespace The debug namespace.
 * @param {DebugOptions=} options The debug options.
 * @returns {DebugFunction} The debug function.
 * @example
 * const debug = makeDebug('foo');
 * debug('bar');
 * // [foo] 2019-01-01T00:00:00.000Z: bar
 */
export function makeDebug(namespace: string, options?: DebugOptions): DebugFunction {
  const allowedNamespaces = readAllowedNamespaces();
  const enabled = isAllowed(allowedNamespaces, namespace);
  options = normalizeOptions(options || {});

  const debug: DebugFunction = function (...args: any[]) {
    if (!debug.enabled) return;

    const time = new Date();
    const formatted = formatWithOptions({ colors: debug.options.color }, ...args);

    if (debug.options.color) {
      console.log(`[ \x1b[90m${debug.namespace}\x1b[0m ]\t\t - \x1b[36m${time.toISOString()}\x1b[0m : ${formatted}`);
    } else {
      console.log(`[ ${debug.namespace} ]\t\t - ${time.toISOString()} : ${formatted}`);
    }
  };

  debug.namespace = namespace;
  debug.enabled = enabled;
  debug.options = options;

  return debug;
}

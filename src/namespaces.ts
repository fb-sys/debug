export function parseText(text: string): string[] {
  // Remove the leading and trailing spaces.
  text = text.trim();
  // check if namespaces has the correct format
  if (text[0] !== '[' || text[text.length - 1] !== ']') return [];
  // remove brackets and whitespaces
  text = text.slice(1, -1).replace(/\s/g, '');
  // split into array and remove empty namespaces
  return text.split(',').filter((namespace) => namespace.length > 0);
}

export function readFrom(text: string): string[] {
  // if text is empty or 'false' or '0' return empty array
  if (text === '') return [];
  if (text === 'false') return [];
  if (text === '0') return [];
  // if text is '*' or 'true' or '1' return ['*']
  if (text === '*') return ['*'];
  if (text === 'true') return ['*'];
  if (text === '1') return ['*'];
  // if text is a valid namespace list return it
  return parseText(text);
}

export function readFromEnv(): string[] {
  // read from environment variable
  const text = process.env.DEBUG || '';
  return readFrom(text);
}

export function readFromCli(): string[] {
  // read from command line arguments
  let text = process.argv.find((arg) => arg.startsWith('--debug')) || '';
  if (text === '--debug') return ['*'];
  text = text.replace('--debug=', '');
  return readFrom(text);
}

export function readAllowedNamespaces(): string[] {
  const envNamespaces = readFromEnv();
  const cliNamespaces = readFromCli();

  const namespaces = [...envNamespaces, ...cliNamespaces];

  if (namespaces.length === 0) return [];
  if (namespaces.includes('*')) return ['*'];

  // remove duplicates and return
  return [...new Set(namespaces)];
}

export function isAllowed(allowedNamespaces: string[], namespace: string): boolean {
  if (allowedNamespaces.includes('*')) return true;
  for (const allowedNamespace of allowedNamespaces) {
    if (allowedNamespace === namespace) return true;
    if (allowedNamespace.endsWith('*') && namespace.startsWith(allowedNamespace.slice(0, -1))) return true;
    if (allowedNamespace.includes('/{') && allowedNamespace.includes('}')) {
      const [scope, packages] = allowedNamespace.split('/');
      const allowedPackages = packages
        .replace('{', '')
        .replace('}', '')
        .split(':')
        .map((p) => `${scope}/${p}`);
      if (allowedPackages.includes(namespace)) return true;
    }
  }

  return false;
}

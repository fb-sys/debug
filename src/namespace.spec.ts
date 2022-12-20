import { parseText, readFrom, readFromEnv, readFromCli, readAllowedNamespaces, isAllowed } from './namespaces';

describe('parseNamespaces()', () => {
  it('should parse a string with leading or trailing spaces', () => {
    expect(parseText('[foo,bar] ')).toEqual(['foo', 'bar']);
    expect(parseText(' [foo,bar]')).toEqual(['foo', 'bar']);
    expect(parseText(' [foo,bar] ')).toEqual(['foo', 'bar']);
  });

  it('should return an empty array if the brackets are missing', () => {
    expect(parseText('foo,bar]')).toEqual([]);
    expect(parseText('[foo,bar')).toEqual([]);
    expect(parseText('foo,bar')).toEqual([]);
  });

  it('should parse a string with spaces between the brackets and the namespaces', () => {
    expect(parseText('[ foo,bar]')).toEqual(['foo', 'bar']);
    expect(parseText('[foo, bar]')).toEqual(['foo', 'bar']);
    expect(parseText('[foo,bar ]')).toEqual(['foo', 'bar']);
    expect(parseText('[ foo, bar]')).toEqual(['foo', 'bar']);
    expect(parseText('[ foo,bar ]')).toEqual(['foo', 'bar']);
    expect(parseText('[foo, bar ]')).toEqual(['foo', 'bar']);
    expect(parseText('[ foo, bar ]')).toEqual(['foo', 'bar']);
  });

  it('should parse a string with empty namespaces', () => {
    expect(parseText('[foo,,bar]')).toEqual(['foo', 'bar']);
    expect(parseText('[foo, ,bar]')).toEqual(['foo', 'bar']);
    expect(parseText('[,foo,bar,]')).toEqual(['foo', 'bar']);
    expect(parseText('[foo, ,bar, ,baz]')).toEqual(['foo', 'bar', 'baz']);
  });

  it('should parse a string into an array of namespaces', () => {
    expect(parseText('[foo,bar]')).toEqual(['foo', 'bar']);
    expect(parseText('[foo,bar,baz]')).toEqual(['foo', 'bar', 'baz']);
    expect(parseText('[foo,bar,baz,qux]')).toEqual(['foo', 'bar', 'baz', 'qux']);
  });
});

describe('readFrom()', () => {
  it('should return an empty array if the string is empty', () => {
    expect(readFrom('')).toEqual([]);
  });

  it('should return an empty array if the string is "false"', () => {
    expect(readFrom('false')).toEqual([]);
  });

  it('should return an empty array if the string is "0"', () => {
    expect(readFrom('0')).toEqual([]);
  });

  it('should return an array with a single "*" if the string is "*"', () => {
    expect(readFrom('*')).toEqual(['*']);
  });

  it('should return an array with a single "*" if the string is "true"', () => {
    expect(readFrom('true')).toEqual(['*']);
  });

  it('should return an array with a single "*" if the string is "1"', () => {
    expect(readFrom('1')).toEqual(['*']);
  });

  it('should parse the string into an array of namespaces', () => {
    expect(readFrom('[foo,bar]')).toEqual(['foo', 'bar']);
    expect(readFrom('[foo,bar,baz]')).toEqual(['foo', 'bar', 'baz']);
    expect(readFrom('[foo,bar,baz,qux]')).toEqual(['foo', 'bar', 'baz', 'qux']);
  });
});

describe('readFromEnv()', () => {
  it('should return an empty array if the environment variable is not set', () => {
    expect(readFromEnv()).toEqual([]);
  });

  it('should return an empty array if the environment variable is empty', () => {
    process.env.DEBUG = '';
    expect(readFromEnv()).toEqual([]);
  });

  it('should return an empty array if the environment variable is "false"', () => {
    process.env.DEBUG = 'false';
    expect(readFromEnv()).toEqual([]);
  });

  it('should return an empty array if the environment variable is "0"', () => {
    process.env.DEBUG = '0';
    expect(readFromEnv()).toEqual([]);
  });

  it('should return an array with a single "*" if the environment variable is "*"', () => {
    process.env.DEBUG = '*';
    expect(readFromEnv()).toEqual(['*']);
  });

  it('should return an array with a single "*" if the environment variable is "true"', () => {
    process.env.DEBUG = 'true';
    expect(readFromEnv()).toEqual(['*']);
  });

  it('should return an array with a single "*" if the environment variable is "1"', () => {
    process.env.DEBUG = '1';
    expect(readFromEnv()).toEqual(['*']);
  });

  it('should parse the environment variable into an array of namespaces', () => {
    process.env.DEBUG = '[foo,bar]';
    expect(readFromEnv()).toEqual(['foo', 'bar']);
    process.env.DEBUG = '[foo,bar,baz]';
    expect(readFromEnv()).toEqual(['foo', 'bar', 'baz']);
    process.env.DEBUG = '[foo,bar,baz,qux]';
    expect(readFromEnv()).toEqual(['foo', 'bar', 'baz', 'qux']);
  });
});

describe('readFromCli()', () => {
  beforeEach(() => {
    process.argv = [];
  });

  it('should return an empty array if the command line argument is not set', () => {
    expect(readFromCli()).toEqual([]);
  });

  it('should return an empty array if the command line argument is empty', () => {
    process.argv.push('');
    expect(readFromCli()).toEqual([]);
  });

  it('should return an array with a single "*" if the command line argument is only "--debug"', () => {
    process.argv.push('--debug');
    expect(readFromCli()).toEqual(['*']);
  });

  it('should return an empty array if the command line argument is "false"', () => {
    process.argv.push('--debug=false');
    expect(readFromCli()).toEqual([]);
  });

  it('should return an empty array if the command line argument is "0"', () => {
    process.argv.push('--debug=0');
    expect(readFromCli()).toEqual([]);
  });

  it('should return an array with a single "*" if the command line argument is "*"', () => {
    process.argv.push('--debug=*');
    expect(readFromCli()).toEqual(['*']);
  });

  it('should return an array with a single "*" if the command line argument is "true"', () => {
    process.argv.push('--debug=true');
    expect(readFromCli()).toEqual(['*']);
  });

  it('should return an array with a single "*" if the command line argument is "1"', () => {
    process.argv.push('--debug=1');
    expect(readFromCli()).toEqual(['*']);
  });

  it('should parse the command line argument "--debug" into an array of namespaces', () => {
    process.argv.push('--debug=[foo,bar,baz,qux]');
    expect(readFromCli()).toEqual(['foo', 'bar', 'baz', 'qux']);
  });
});

describe('readAllowedNamespaces()', () => {
  beforeEach(() => {
    process.env.DEBUG = undefined;
    process.argv = [];
  });

  it('should return an empty array if the environment variable and command line argument are not set', () => {
    expect(readAllowedNamespaces()).toEqual([]);
  });

  it('should return an empty array if the environment variable and command line argument are empty', () => {
    process.env.DEBUG = '';
    expect(readAllowedNamespaces()).toEqual([]);
    process.env.DEBUG = undefined;
    process.argv.push('');
    expect(readAllowedNamespaces()).toEqual([]);
  });

  it('should return an empty array if the environment variable or command line argument is "false"', () => {
    process.env.DEBUG = 'false';
    expect(readAllowedNamespaces()).toEqual([]);
    process.env.DEBUG = undefined;
    process.argv.push('--debug=false');
    expect(readAllowedNamespaces()).toEqual([]);
  });

  it('should return an empty array if the environment variable or command line argument is "0"', () => {
    process.env.DEBUG = '0';
    expect(readAllowedNamespaces()).toEqual([]);
    process.env.DEBUG = undefined;
    process.argv.push('--debug=0');
    expect(readAllowedNamespaces()).toEqual([]);
  });

  it('should return an array with a single "*" if the environment variable or command line argument includes "*"', () => {
    process.env.DEBUG = '[foo,bar,baz,qux,*]';
    expect(readAllowedNamespaces()).toEqual(['*']);
    process.env.DEBUG = undefined;
    process.argv.push('--debug=[foo,bar,baz,qux,*]');
    expect(readAllowedNamespaces()).toEqual(['*']);
  });

  it('should return an array with a single "*" if the environment variable or command line argument is "true"', () => {
    process.env.DEBUG = 'true';
    expect(readAllowedNamespaces()).toEqual(['*']);
    process.env.DEBUG = undefined;
    process.argv.push('--debug=true');
    expect(readAllowedNamespaces()).toEqual(['*']);
  });

  it('should return an array with a single "*" if the environment variable or command line argument is "1"', () => {
    process.env.DEBUG = '1';
    expect(readAllowedNamespaces()).toEqual(['*']);
    process.env.DEBUG = undefined;
    process.argv.push('--debug=1');
    expect(readAllowedNamespaces()).toEqual(['*']);
  });

  it('should parse the environment variable and command line argument into an array of namespaces', () => {
    process.env.DEBUG = '[foo,bar]';
    process.argv.push('--debug=[baz,qux]');
    expect(readAllowedNamespaces()).toEqual(['foo', 'bar', 'baz', 'qux']);
  });

  it('should not include duplicate namespaces', () => {
    process.env.DEBUG = '[foo,bar]';
    process.argv.push('--debug=[bar,baz]');
    expect(readAllowedNamespaces()).toEqual(['foo', 'bar', 'baz']);
  });
});

describe('isAllowed()', () => {
  it('should return true if the namespace is allowed', () => {
    expect(isAllowed(['foo', 'bar', 'baz'], 'foo')).toBe(true);
    expect(isAllowed(['foo', 'bar', 'baz'], 'bar')).toBe(true);
    expect(isAllowed(['foo', 'bar', 'baz'], 'baz')).toBe(true);
  });

  it('should return false if the namespace is not allowed', () => {
    expect(isAllowed(['foo', 'bar', 'baz'], 'qux')).toBe(false);
  });

  it('should return true if the namespace is allowed by a wildcard', () => {
    expect(isAllowed(['*'], 'qux')).toBe(true);
  });

  it('should return true if the namespace is allowed as a child of a wildcard', () => {
    expect(isAllowed(['foo:*'], 'foo:bar')).toBe(true);
    expect(isAllowed(['foo:*'], 'foo:baz')).toBe(true);
    expect(isAllowed(['foo:*'], 'foo:qux')).toBe(true);
  });

  it('should return false if the namespace is not allowed as a child of a wildcard', () => {
    expect(isAllowed(['foo:*'], 'bar:baz')).toBe(false);
    expect(isAllowed(['foo:*'], 'bar:qux')).toBe(false);
  });

  it('should identify the scoped package correctly', () => {
    expect(isAllowed(['@foo/{bar:baz}'], '@foo/bar')).toBe(true);
    expect(isAllowed(['@foo/{bar:baz}'], '@foo/baz')).toBe(true);
    expect(isAllowed(['@foo/{bar:baz}'], '@foo/qux')).toBe(false);
  });
});

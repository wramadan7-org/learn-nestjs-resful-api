import camelcaseKeys from 'camelcase-keys';

export function toCamelCase<T = any>(input: any): T {
  return camelcaseKeys(input, { deep: true }) as T;
}

export function toSnakeCase(input: any): any {
  if (Array.isArray(input)) {
    return input.map(toSnakeCase);
  }

  if (input !== null && typeof input === 'object') {
    return Object.keys(input).reduce((acc: any, key: string) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      acc[snakeKey] = toSnakeCase(input[key]);
      return acc;
    }, {});
  }

  return input;
}

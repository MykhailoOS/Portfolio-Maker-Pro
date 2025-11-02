// Utility functions for working with dot-notation paths in objects

export function getByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined;
    }
    result = result[key];
  }
  
  return result;
}

export function setByPath(obj: any, path: string, value: any): any {
  const keys = path.split('.');
  const lastKey = keys.pop();
  
  if (!lastKey) return obj;
  
  let current = obj;
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
}

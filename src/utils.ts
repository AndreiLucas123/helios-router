//
//

export const noop = () => {};

//
//

export function convertQueryToURLSearchParams(query: {
  [key: string]: any;
}): string {
  const sortedKeys = Object.keys(query).sort();

  const params = new URLSearchParams();

  // Loop through the sorted keys and add them to the URLSearchParams
  for (const key of sortedKeys) {
    const value = query[key];

    // If the value is an array, convert it to a comma-separated string
    if (typeof value === 'object' && value !== null) {
      params.append(key, JSON.stringify(value));
    }
  }

  return params.toString();
}

//
//

export function shallowObjectComparison(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  // Check if both parameters are objects
  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  // Get the keys of the two objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if each property of obj1 is present and equal to the corresponding property in obj2
  for (const key of keys1) {
    if (obj2[key] !== obj1[key]) {
      return false;
    }
  }

  return true;
}

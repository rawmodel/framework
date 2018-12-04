/**
 * Converts the provided data to primitive data type.
 */
export function normalize(data: any) {
  if (typeof data === 'undefined') {
    return data;
  }
  try {
    return JSON.parse(JSON.stringify(data));
  }
  catch (e) {
    return data;
  }
}

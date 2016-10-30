/*
* Returns a duplicated data object (useful to remove data bindings).
*/

export function cloneData (data) {
  return JSON.parse(JSON.stringify(data));
}

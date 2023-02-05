export function rmEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

export function rmItem(obj, key) {
  return Object.fromEntries(Object.entries(obj).filter(([k, _]) => k != key));
}

type AnyObject = { [key: string]: any };

export function removeEmptyFields(obj: AnyObject): AnyObject {
  return Object.entries(obj)
    .filter(([_, v]) => v != null && v !== '')
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmptyFields(v) : v }), {});
}

export const isObject = (item) => {
    return (typeof item === 'object' && !Array.isArray(item) && item !== null);
  }
  
  export const encodeQueryString = (params) => {
    return '?' + Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&')
    ;
  }
  
  export const deleteKey = (object, keyToDelete) => {
    return Object
      .keys(object)
      .filter(key => key !== keyToDelete)
      .map(key => ({[key]: object[key]}))
      .reduce((accumulator, current) => ({...accumulator, ...current}), {})
    ;
  }
  
  export const accessByKey = (object, key) => {
    // helper to access deeply nested objects using dot.seperated.keys
    return keyExists(object, key) ? key.split('.').reduce((root, next) => root[next], object) : null;
  }
  
  export const keyExists = (o, k) => {
    // helper to check if deeply nested key exists on an object (use dot.seperated.keys)
    // https://stackoverflow.com/questions/1098040/checking-if-a-key-exists-in-a-javascript-object
    return k.split(".").reduce((a, c) => a.hasOwnProperty(c) ? a[c] || 1 : false, Object.assign({}, o)) === false ? false : true;
  }
  
  export const isNonEmpty = (o) => Object.keys(o).length > 0;
  
  export const objToInlineStyle = (o) => Object.keys(o).reduce((style, k) => style + `${k}: ${o[k]};`, "");
  
  
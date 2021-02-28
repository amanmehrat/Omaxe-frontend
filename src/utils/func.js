export const wireEventValue = (setFn) => {
  return (e) => setFn(e.target.value);
};

// https://javascript.info/currying-partials#going-partial-without-context
export const partial = (func, ...argsBound) => {
  return ((...args) => {
    return func.call(this, ...argsBound, ...args)
  })
};

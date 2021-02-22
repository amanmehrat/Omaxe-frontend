export const wireEventValue = (setFn) => {
  return (e) => setFn(e.target.value);
};

// https://javascript.info/currying-partials#going-partial-without-context
export const partial = (func, ...argsBound) => {
  //console.log("func", func);
  //console.log("argsBound", argsBound);
  return ((...args) => {
    //console.log("args", args);
    //console.log("argsBound", argsBound);
    return func.call(this, ...argsBound, ...args)
  })
};

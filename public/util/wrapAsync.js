// function wrapAsync(fn) {
// insted of this we will directly export function method below 

module.exports = (fn)=>{ 
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
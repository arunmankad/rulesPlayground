const truthy = function(value) {
    console.log("TRUTHY.value=>", value)
    if(Array.isArray(value) && value.length === 0) {
      return false;
    }
    return !! value;
  };
const is_logic = function(logic) {
    return (
      typeof logic === "object" && // An object
      logic !== null && // but not null
      ! Array.isArray(logic) && // and not an array
      Object.keys(logic).length === 1 // with exactly one key
    );
  };

const get_operator = function(logic) {
    console.log("GET_OPERATOR =>", Object.keys(logic)[0]);
    return Object.keys(logic)[0];
  };


const apply = function(logic, data) {
    // Does this array contain logic? Only one way to find out.
    if(Array.isArray(logic)) {
      return logic.map(function(l) {
        console.log('APPLY + LOGIC.MAP =>', l);
        return apply(l, data);
      });
    }
    // You've recursed to a primitive, stop!
    if( ! is_logic(logic) ) {
        console.log("APPLY + IS_LOGIC =>", logic)
      return logic;
    }

    data = data || {};

    console.log("APPLY + DATA =>", data)

    var op = get_operator(logic);

    console.log("APPLY + OP =>", op)
    var values = logic[op];
    console.log("APPLY + values =>", Object.toString(values));
    var i;
    var current;
    var scopedLogic, scopedData, filtered, initial;

    // easy syntax for unary operators, like {"var" : "x"} instead of strict {"var" : ["x"]}
    if( ! Array.isArray(values)) {
      values = [values];
    }
    if(op === "if" || op == "?:") {
        for(i = 0; i < values.length - 1; i += 2) {
         console.log("APPLY + op === if || ?:  => i", i)
         console.log("APPLY + op === if || ?:  => values[i]", values[i])
         console.log("APPLY + op === if || ?:  => apply(values[i], data)", apply(values[i], data))
          if( truthy( apply(values[i], data) ) ) {
            return apply(values[i+1], data);
          }
        }
        if(values.length === i+1) return apply(values[i], data);
        return null;
    }
}

const result = apply({"if" : [
    {"<": [{"var":"temp"}, 0] }, "freezing",
    {"<": [{"var":"temp"}, 100] }, "liquid",
    "gas"
  ]}, {'temp': 55});
console.log("RESULT =>", result);

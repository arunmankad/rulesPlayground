;(function(root, factory) {
    if (typeof define === "function" && define.amd) {
      define(factory);
    } else if (typeof exports === "object") {
      module.exports = factory();
    } else {
      root.UstRules = factory();
    }
  }(this, function() {
    "use strict";  
    if ( ! Array.isArray) {
      Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
      };
    }
    function arrayUnique(array) {
      var a = [];
      for (var i=0, l=array.length; i<l; i++) {
        if (a.indexOf(array[i]) === -1) {
          a.push(array[i]);
        }
      }
      return a;
    }
    var UstRules = {};
    var operations = {
      "==": function(a, b) {
        return a == b;
      },
      "===": function(a, b) {
        return a === b;
      },
      "!=": function(a, b) {
        return a != b;
      },
      "!==": function(a, b) {
        return a !== b;
      },
      ">": function(a, b) {
        return a > b;
      },
      ">=": function(a, b) {
        return a >= b;
      },
      "<": function(a, b, c) {
        return (c === undefined) ? a < b : (a < b) && (b < c);
      },
      "<=": function(a, b, c) {
        return (c === undefined) ? a <= b : (a <= b) && (b <= c);
      },
      "!!": function(a) {
        return UstRules.truthy(a);
      },
      "!": function(a) {
        return !UstRules.truthy(a);
      },
      "%": function(a, b) {
        return a % b;
      },
      "log": function(a) {
        console.log(a); return a;
      },
      "in": function(a, b) {
        if(!b || typeof b.indexOf === "undefined") return false;
        return (b.indexOf(a) !== -1);
      },
      "cat": function() {
        return Array.prototype.join.call(arguments, "");
      },
      "substr":function(source, start, end) {
        if(end < 0){
          var temp = String(source).substr(start);
          return temp.substr(0, temp.length + end);
        }
        return String(source).substr(start, end);
      },
      "+": function() {
        return Array.prototype.reduce.call(arguments, function(a, b) {
          return parseFloat(a, 10) + parseFloat(b, 10);
        }, 0);
      },
      "*": function() {
        return Array.prototype.reduce.call(arguments, function(a, b) {
          return parseFloat(a, 10) * parseFloat(b, 10);
        });
      },
      "-": function(a, b) {
        if(b === undefined) {
          return -a;
        }else{
          return a - b;
        }
      },
      "/": function(a, b) {
        return a / b;
      },
      "min": function() {
        return Math.min.apply(this, arguments);
      },
      "max": function() {
        return Math.max.apply(this, arguments);
      },
      "merge": function() {
        return Array.prototype.reduce.call(arguments, function(a, b) {
          return a.concat(b);
        }, []);
      },
      "var": function(a, b) {
        // sample 1 => operations['var'].apply({{a: 1, b: 2}, ["a"]}) 
        // sample 2 => operations["var"].apply({a:1, b:2}, ["z", 26]);
        /* Sample 3 => operations["var"].apply({
                                                  champ: {
                                                    name: 'Fezzig',
                                                    height: 223
                                                  },
                                                  challenger: {
                                                    name: 'Dread Pirate Roberts',
                                                    height: 183
                                                  }
                                                }, ["champ.name"]));
        */
        // -------------------------------------------------------------

        /*  In sample1  scenario undefined
            In sample2 secenario not_found = b 
            In sample3 not_found = undefined 
        */
        var not_found = (b === undefined) ? null : b; 
        // context object set in apply method is the data object
        var data = this; // {a: 1, b: 2} etc
        // if logic is undefined, empty or null data will be returned as such
        if(typeof a === "undefined" || a==="" || a===null) {
          return data;
        }
        /*
          The first parameter is converted to string, split in to array based on .
          Comes handy when trying to accessing a nested value from an object.
          Sample 3 is an ideal use case
        */
        var sub_props = String(a).split("."); // convert array to string and then split into array based on .
        for(var i = 0; i < sub_props.length; i++) {
          /*
          data not null all scenarios mentioned above, 
          if data is null, either null or value of b 
          as the case may be will be returned 
          */
          if(data === null) { 
            return not_found;
          }
          /*
          The statement below holds good specifically in sample 3
          where sub_props will be an array, with value in each index 
          pointing to a nested object 
          In case of sample 3 sub_props = ["champ", "name"]
          Remember in JS sub_props[0] and sub_props["0"] returns the same value
           */
          data = data[sub_props[i]]; // sub_props[i] = a, data[a] =1  
          /*
            If at any level data is not found, not_found is returned, value of
            which is either b or null depending on one of the previous statements
          */
          if(data === undefined) { 
            return not_found;
          }
        }
        // returned value is 1 as per the sample 1 scenario listed above
        return data; 
      },
      "missing": function() {
        var missing = [];
        var keys = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        console.log("JS keys =>", keys);
        for(var i = 0; i < keys.length; i++) {
          var key = keys[i];
          console.log("JS key =>", key);
          var value = UstRules.apply({"var": key}, this);
          console.log("JS this in missing =>", this);
          console.log("JS value =>", value);
          if(value === null || value === "") {
            missing.push(key);
          }
        }
        console.log("FROM JS", missing)
        return missing;
      },
      "missing_some": function(need_count, options) {
        var are_missing = UstRules.apply({"missing": options}, this);
        if(options.length - are_missing.length >= need_count) {
          return [];
        }else{
          return are_missing;
        }
      },
      "method": function(obj, method, args) {
        return obj[method].apply(obj, args);
      },
    };
    /**
     * helps checks if the logic satisfies predefined criteria
     *  typeof is object 
     *  not null
     *  not an array
     *  logic object should only have one key, 
     */
    UstRules.is_logic = function(logic) {
      return (
        typeof logic === "object" && 
        logic !== null && 
        ! Array.isArray(logic) && 
        Object.keys(logic).length === 1 
      );
    };
    /**
     * if the value passed in is an array and length is zero false will be returned 
     *  undefined
        null
        NaN
        0
        "" <empty string>
        false
        Anything expect the above values will return true
     */
    UstRules.truthy = function(value) {
      if(Array.isArray(value) && value.length === 0) {
        return false;
      }
      return !! value;
    };
    /**
     * Helps gets the key aka op from the logic 
     */
    UstRules.get_operator = function(logic) {
      return Object.keys(logic)[0];
    };
    /**
     * Helps gets the valau from the logic 
     */
    UstRules.get_values = function(logic) {
      return logic[UstRules.get_operator(logic)];
    };
    // this is the starting point of entire execution
    UstRules.apply = function(logic, data) {
      // console.log('LOGIC is an array =>', Array.isArray(logic))
      /* 
        if logic is an array each of the items in the array
        is supplied to apply along with data 
      */
     console.log('LOGIC =>', logic)
     console.log('DATA =>', data)
      if(Array.isArray(logic)) {
        return logic.map(function(l) {
          return UstRules.apply(l, data);
        });
      }
      /*
        This if condition is to check if the logic meets all the 4 pre-defined
        criteria, namely 
        typeof is object 
        not null
        not an array
        logic object should only have one key,

        If the logic fails to comply with an of these criteria, logic would be
        returned as result           
      */
      if( ! UstRules.is_logic(logic) ) {
        return logic;
      }
      /*
        if data is null, an empty object is assigned as its value
      */
      data = data || {};
      // debugger;
      /*
        If logic statisfies all the 4 criteria, this step will extract the
        key from logic and will be stored in the variable op
      */
      var op = UstRules.get_operator(logic);
      /* 
        The value part of the logic is stored in the varibale values 
      */
      var values = logic[op];
      /*
        Next three statements declares few variables to be used later in the
        method
        i => looping through value arrays
        cuurent 
      */
      var i;
      var current;
      var scopedLogic, scopedData, filtered, initial;
      /*
        This if condition is for syntatic sugar
        {"var":"a"} will be treated like {"var":["a"]} 
       */
      if( ! Array.isArray(values)) {
        values = [values];
      }
      // when op is if or ?:
      if(op === "if" || op == "?:") {
        for(i = 0; i < values.length - 1; i += 2) {
          if( UstRules.truthy( UstRules.apply(values[i], data) ) ) {
            return UstRules.apply(values[i+1], data);
          }
        }
        if(values.length === i+1) return UstRules.apply(values[i], data);
        return null;
       
      }
      /* 
        when op is 'and' if any one of the logic inside values 
        return false then the value false will be returned, 
        else last value of current (would be true) will be returned
      */
      else if(op === "and") { 
        for(i=0; i < values.length; i+=1) {
          current = UstRules.apply(values[i], data);
          if( ! UstRules.truthy(current)) {
            
            return current;
          }
        }
        return current; 
      }
      /* 
        when op is 'or' if any one of the logic inside values 
        return true then the value true will be returned, 
        else last value of current will be returned
      */
      else if(op === "or") {
        for(i=0; i < values.length; i+=1) {
          current = UstRules.apply(values[i], data);
          if( UstRules.truthy(current) ) {
            return current;
          }
        }
        return current; 
      }else if(op === 'filter'){
        scopedData = UstRules.apply(values[0], data);
        scopedLogic = values[1];
  
        if ( ! Array.isArray(scopedData)) {
            return [];
        }
        return scopedData.filter(function(datum){
            return UstRules.truthy( UstRules.apply(scopedLogic, datum));
        });
    }else if(op === 'map'){
        scopedData = UstRules.apply(values[0], data);
        scopedLogic = values[1];
        if ( ! Array.isArray(scopedData)) {
            return [];
        }
        return scopedData.map(function(datum){
            return UstRules.apply(scopedLogic, datum);
        });
    }else if(op === 'reduce'){
        scopedData = UstRules.apply(values[0], data);
        scopedLogic = values[1];
        initial = typeof values[2] !== 'undefined' ? values[2] : null;
  
        if ( ! Array.isArray(scopedData)) {
            return initial;
        }
        return scopedData.reduce(
            function(accumulator, current){
                return UstRules.apply(
                    scopedLogic,
                    {'current':current, 'accumulator':accumulator}
                );
            },
            initial
        );
      }else if(op === "all") {
        scopedData = UstRules.apply(values[0], data);
        scopedLogic = values[1];
        if( ! scopedData.length) {
          return false;
        }
        for(i=0; i < scopedData.length; i+=1) {
          if( ! UstRules.truthy( UstRules.apply(scopedLogic, scopedData[i]) )) {
            return false; 
          }
        }
        return true; 
      }else if(op === "none") {
        filtered = UstRules.apply({'filter' : values}, data);
        return filtered.length === 0;
  
      }else if(op === "some") {
        filtered = UstRules.apply({'filter' : values}, data);
        return filtered.length > 0;
      }
      values = values.map(function(val) {
        return UstRules.apply(val, data);
      });
      if(typeof operations[op] === "function") {
        // console.log('TESTER');
        // console.log('data', data);
        // console.log('values', values);
        // console.log('operations[op]', operations[op]);
        // console.log('operations[op].apply', operations[op].apply(data, values));
        return operations[op].apply(data, values);
        
      }else if(op.indexOf(".") > 0) { 
        var sub_ops = String(op).split(".");
        var operation = operations;
        for(i = 0; i < sub_ops.length; i++) {
          operation = operation[sub_ops[i]];
          if(operation === undefined) {
            throw new Error("Unrecognized operation " + op +
            " (failed at " + sub_ops.slice(0, i+1).join(".") + ")");
          }
        }
  
        return operation.apply(data, values);
      }
  
      throw new Error("Unrecognized operation " + op );
    };
  
    UstRules.uses_data = function(logic) {
      var collection = [];
  
      if( UstRules.is_logic(logic) ) {
        var op = UstRules.get_operator(logic);
        var values = logic[op];
  
        if( ! Array.isArray(values)) {
          values = [values];
        }
  
        if(op === "var") {
          collection.push(values[0]);
        }else{
          values.map(function(val) {
            collection.push.apply(collection, UstRules.uses_data(val) );
          });
        }
      }
      return arrayUnique(collection);
    };
  
    UstRules.add_operation = function(name, code) {
      operations[name] = code;
    };
  
    UstRules.rm_operation = function(name) {
      delete operations[name];
    };
  
    UstRules.rule_like = function(rule, pattern) {
      if(pattern === rule) {
        return true;
      }
      if(pattern === "@") {
        return true;
      }
      if(pattern === "number") {
        return (typeof rule === "number");
      }
      if(pattern === "string") {
        return (typeof rule === "string");
      }
      if(pattern === "array") {
        return Array.isArray(rule) && ! UstRules.is_logic(rule);
      }
  
      if(UstRules.is_logic(pattern)) {
        if(UstRules.is_logic(rule)) {
          var pattern_op = UstRules.get_operator(pattern);
          var rule_op = UstRules.get_operator(rule);
  
          if(pattern_op === "@" || pattern_op === rule_op) {
            return UstRules.rule_like(
              UstRules.get_values(rule, false),
              UstRules.get_values(pattern, false)
            );
          }
        }
        return false; 
      }
  
      if(Array.isArray(pattern)) {
        if(Array.isArray(rule)) {
          if(pattern.length !== rule.length) {
            return false;
          }
          
          for(var i = 0; i < pattern.length; i += 1) {
            if( ! UstRules.rule_like(rule[i], pattern[i])) {
              return false;
            }
          }
          return true; 
        }else{
          return false; 
        }
      }
      return false;
    };
  
    return UstRules;
  }));
  
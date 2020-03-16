import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  private operations = {
    "==": (a, b)=>{
      return a == b;
    },
    "===": (a, b)=> {
      return a === b;
    },
    "!=": (a, b)=> {
      return a != b;
    },
    "!==": (a, b)=> {
      return a !== b;
    },
    ">": (a, b)=>{
      return a > b;
    },
    ">=": (a, b)=> {
      return a >= b;
    },
    "<": (a, b, c)=> {
      return (c === undefined) ? a < b : (a < b) && (b < c);
    },
    "<=": (a, b, c)=> {
      return (c === undefined) ? a <= b : (a <= b) && (b <= c);
    },
    "!!": (a)=> {
      return this.truthy(a);
    },
    "!": (a)=> {
      return !this.truthy(a);
    },
    "%": (a, b)=> {
      return a % b;
    },
    "log": (a)=> {
      console.log(a); return a;
    },
    "in": (a, b)=> {
      if(!b || typeof b.indexOf === "undefined") return false;
      return (b.indexOf(a) !== -1);
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
    // },
    // "missing": function(...args){
    //   let missing:Array<any> = [];
    //   let keys = (args[0] instanceof Array) ? args[0] : args;
    //   console.log("Services keys =>", keys);
    //   for(let i = 0; i < keys.length; i++) {
    //     let key = keys[i];
    //     console.log("Services key =>", key);
    //     let value = this.check({"var": key}, this);
    //     console.log('Services this in missing ', this);
    //     console.log('Services value ', value);
    //     if(value === null || value === "") {
    //       missing.push(key);
    //     }
    //   }
    //   return missing;
    // },
    // "missing_some": (need_count, options)=>{
    //   let are_missing = this.check({"missing": options}, this);
    //   if(options.length - are_missing.length >= need_count) {
    //     return [];
    //   }else{
    //     return are_missing;
    //   }
    },
    "+": (...args)=> {
      return Array.prototype.reduce.call(args, function(a, b) {
        return parseFloat(a) + parseFloat(b);
      }, 0);
    },
    "*": (...args)=>{
      return Array.prototype.reduce.call(args, function(a, b) {
        return parseFloat(a) * parseFloat(b);
      });
    },
    "-": (a, b)=>{
      if(b === undefined) {
        return -a;
      }else{
        return a - b;
      }
    },
    "/": (a, b)=>{
      return a / b;
    },
    "method": function(obj, method, args) {
      return obj[method].apply(obj, args);
    },
    "merge": (...args)=>{
      return Array.prototype.reduce.call(args, function(a, b) {
        return a.concat(b);
      }, []);
    }
  }
  constructor() { }
  truthy = (value)=>{
    if((value instanceof Array) && value.length === 0) {
      return false;
    }
    return !! value;
  }
  get_operator = (logic)=>{
    return Object.keys(logic)[0];
  }
  is_logic = (logic:any)=> {
    return (
      typeof logic === "object" && 
      logic !== null && 
      !(logic instanceof Array) && 
      Object.keys(logic).length === 1 
    );
  }
  check = (logic, data)=> {
    if(logic instanceof Array) {
      return logic.map((l) => {
        return this.check.apply(l, data);
      });
    }
    if(!(this.is_logic(logic))) {
      return logic;
    }
    data = data || {};
    let op = this.get_operator(logic);
    let values = logic[op];
    let i;
    let current;
    let scopedLogic, scopedData, filtered, initial;

    if( ! (values instanceof Array)) {
      values = [values];
    }

    if(op === "if" || op == "?:") {
      for(i = 0; i < values.length - 1; i += 2) {
        if( this.truthy( this.check(values[i], data) ) ) {
          return this.check(values[i+1], data);
        }
      }
      if(values.length === i+1) return this.check(values[i], data);
      return null;
     
    }
    else if(op === "and") { 
      for(i=0; i < values.length; i+=1) {
        current = this.check(values[i], data);
        if( ! this.truthy(current)) {
          
          return current;
        }
      }
      return current; 
    }
    else if(op === "or") {
      for(i=0; i < values.length; i+=1) {
        current = this.check(values[i], data);
        if( this.truthy(current) ) {
          return current;
        }
      }
      return current; 
    } else if (op === "missing"){
      let missing:Array<any> = [];
      let keys = (values[0] instanceof Array) ? values[0] : values;
      console.log("Services keys =>", keys);
      for(let i = 0; i < keys.length; i++) {
        let key = keys[i];
        console.log("Services key =>", key);
        let value = this.check({"var": key}, data);
        console.log('Services this in missing ', data);
        console.log('Services value ', value);
        if(value === null || value === "") {
          missing.push(key);
        }
      }
      return missing;
    } else if (op === "missing_some"){
      let are_missing = this.check({"missing": values[1]}, data);
      if(values[1].length - are_missing.length >= values[0]) {
        return [];
      }else{
        return are_missing;
      }
    }
    values = values.map((val)=>{
      return this.check(val, data);
    });
    if(typeof this.operations[op] === "function") {
      return this.operations[op].apply(data, values);
    }else if(op.indexOf(".") > 0) { 
      let sub_ops = String(op).split(".");
      let operation:any = this.operations;
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
  }
}

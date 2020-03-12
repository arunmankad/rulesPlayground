/*
The below snippet is meant to tear down the "var" function in rules!
*/

const cool = {
    "var": function(a, b) {
        console.log("a,", a);
        console.log("b,", b);
    var not_found = (b === undefined) ? null : b;
    var data = this;
    console.log("data", data);
    if(typeof a === "undefined" || a==="" || a===null) {
      return data;
    }
    var sub_props = String(a).split(".");
    console.log("sub_props =>", sub_props);
    for(var i = 0; i < sub_props.length; i++) {
      if(data === null) {
        return not_found;
      }
      // Descending into data
      data = data[sub_props[i]];
      console.log("data = data[sub_props[i]] =>", data);
      if(data === undefined) {
        return not_found;
      }
    }
    console.log("BEFORE return => ", data);
    return data;
  }
};
// use-case 1 **************
// cool["var"].apply({a: 1, b: 2}, ["a"]);
// use-case 2 **************
// cool["var"].apply({
//   champ: {
//     name: 'Fezzig',
//     height: 223
//   },
//   challenger: {
//     name: 'Dread Pirate Roberts',
//     height: 183
//   }
// }, ["champ.name"]);



// use-case 3 **************

cool["var"].apply(["Hello", "How", "are U"], [1]);

//  "var" function ended!
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
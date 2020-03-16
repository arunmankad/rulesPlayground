const check = (logic, data) => {
    console.log('LOGIC from ser =>', logic)
    if(Array.isArray(logic)) {
      return logic.map((l) => {
        console.log('HHHHHHHH from ser', l)
        return check.apply(l, data);
      });
    }
  }

  check([[1],[2]], {});
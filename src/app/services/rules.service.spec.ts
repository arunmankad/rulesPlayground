import { TestBed } from '@angular/core/testing';

import { RulesService } from './rules.service';

describe('RulesService', () => {
  let service: RulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('simple 1==1', ()=>{
    const logic = {"==": [1,1]};
    const data = {};
    expect(service.check(logic, data)).toBe(true);
  });
  it('compund  > && < , ( (3 > 1) && (1 < 3) )', ()=>{
    const logic = {"and" : [
      { ">" : [3,1] },
      { "<" : [1,3] }
    ] };
    const data = {};
    expect(service.check(logic, data)).toBe(true);
  });
  it('data driven, use "var" operator to get attributes of the data, should return 1  ', ()=>{
    const logic = { "var" : ["a"] };
    const data = { a : 1, b : 2 };
    expect(service.check(logic, data)).toBe(1);
  });
  it('var operator to access an array by numeric index:, index 1 should return banana', ()=>{
    const logic = {"var" : 1 };
    const data = [ "apple", "banana", "carrot" ];
    expect(service.check(logic, data)).toBe('banana');
  });
  it('complex rule', ()=>{
    const logic = { "and" : [
      {"<" : [ { "var" : "temp" }, 110 ]},
      {"==" : [ { "var" : "pie.filling" }, "apple" ] }
    ] };
    const data = { "temp" : 100, "pie" : { "filling" : "apple" } };
    expect(service.check(logic, data)).toBe(true);
  });
  it('Always, should return true', ()=>{
    const logic = true;
    const data = { "temp" : 100, "pie" : { "filling" : "apple" } };
    expect(service.check(logic, data)).toBe(true);
  });
  it('Never, should return false', ()=>{
    const logic = false;
    const data = { "temp" : 100, "pie" : { "filling" : "apple" } };
    expect(service.check(logic, data)).toBe(false);
  });
  it('If, should return yes', ()=>{
    const logic = {"if" : [ {"==": [1,1]}, "yes", "no" ]};
    const data = { "temp" : 100, "pie" : { "filling" : "apple" } };
    expect(service.check(logic, data)).toBe('yes');
  });
  it('If, should return yes', ()=>{
    const logic = {"if" : [
      {"<": [{"var":"temp"}, 0] }, "freezing",
      {"<": [{"var":"temp"}, 100] }, "liquid",
      "gas"
    ]};
    const data = { "temp" : 55};
    expect(service.check(logic, data)).toBe('liquid');
  });
});



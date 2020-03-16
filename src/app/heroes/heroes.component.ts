import { Component, OnInit } from '@angular/core';
import {RulesService} from '../services/rules.service';

import MyRules from '../../lib/USTRules';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  myLogic = "";
  myData = "";
  result:any;
  resultFromService:any;
  constructor(private rulesSevice: RulesService) {
    
   }
  
  ngOnInit(): void {
    let rules = { "and" : [
      {"<" : [ { "var" : "temp" }, 110 ]},
      {"==" : [ { "var" : "pie.filling" }, "apple" ] }
    ] };
    
    let data = { "temp" : 100, "pie" : { "filling" : "apple" } };
    // alert(OtisCreateRules.apply({ "var" : ["a"] }, // Rule
    // { a : 1, b : 2 } ));
    // alert((OtisCreateRules.apply(rules, data)).toString());
  }

  public open(event) {
    //  alert('Open ');
    let jsonConvertedData;
    let jsonConvertedLogic;
    // alert(this.rulesSevice.check());
    // const a = this.rulesSevice.check([[1],[2]], {})
    // console.log('aaaaa =>', a);
    if(!!this.myLogic){
      jsonConvertedLogic = JSON.parse(this.myLogic);
    }else{
      jsonConvertedLogic = [];
    }
    if(!!this.myData){
      jsonConvertedData = JSON.parse(this.myData) ;
    }else {
      jsonConvertedData = {}
    }
    console.log('jsonConvertedLogic', jsonConvertedLogic);
    console.log('jsonConvertedData', jsonConvertedData);
     this.result = MyRules.apply(jsonConvertedLogic, jsonConvertedData);
    this.resultFromService = this.rulesSevice.check(jsonConvertedLogic, jsonConvertedData);
  }

}

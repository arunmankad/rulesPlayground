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
  result:Boolean ;
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
    // alert('Open '+ this.myInput);
    let jsonConvertedData;
    let jsonConvertedLogic;
    alert(this.rulesSevice.check());
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
  }

}

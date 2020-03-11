import { Component, OnInit } from '@angular/core';
import MyRules from '../../lib/USTRules';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  myInput = "";
  result = "";
  constructor() {
    
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
    let jsonConvertedInput = JSON.parse(this.myInput);
    this.result = MyRules.apply(jsonConvertedInput);
  }

}

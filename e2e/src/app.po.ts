import { browser, by, element } from 'protractor';

export class AppPage {
  private testData = {
    logic: { "==" : [1, 1] } ,
    data: {}
  };
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getLogicLabel(): Promise<string> {
    return element(by.css('app-heroes label')).getText() as Promise<string>;
  }

  fillCredentials(data: any = this.testData) {
     element(by.css('[name="logicTextArea"]')).sendKeys(data.logic);
     element(by.css('[name="dataTextArea"]')).sendKeys(data.password);
     element(by.css('.button is-link')).click();
  }

  getResult(){
    return element(by.css('[name="resultServ"]'));
  }

}

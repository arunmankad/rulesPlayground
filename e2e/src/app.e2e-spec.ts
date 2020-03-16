import { AppPage } from './app.po';
import { browser, logging } from 'protractor';


describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display Logic label', () => {
    page.navigateTo();
    // browser.pause();
    expect(page.getLogicLabel()).toEqual('Logic:');
  });

  // it('when logic is [] and data is {} result would be []', () => {
  //   page.navigateTo();
  //   page.fillCredentials();
  //   browser.pause();
  //   console.log("%%%%%%%%%%%%%%", page.getResult())
  //   browser.pause();
  //    expect<any>(page.getResult()).toEqual(1);
  //   // expect(page.getResult()).to.eventually.contain('true');
    
  // });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

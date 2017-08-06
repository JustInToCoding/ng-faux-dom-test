import { NgFauxDomTestPage } from './app.po';

describe('ng-faux-dom-test App', () => {
  let page: NgFauxDomTestPage;

  beforeEach(() => {
    page = new NgFauxDomTestPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

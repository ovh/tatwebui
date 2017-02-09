import { TatwebuiPage } from './app.po';

describe('tatwebui App', function() {
  let page: TatwebuiPage;

  beforeEach(() => {
    page = new TatwebuiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

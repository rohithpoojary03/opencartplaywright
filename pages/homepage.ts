import {Page,expect,Locator} from '@playwright/test';

export class HomePage{

    //locators
    private readonly lnkMyAccount:Locator;
    private readonly lnkRegister:Locator;
    private readonly lnkLogin:Locator;
    private readonly txtSearchbox:Locator;
    private readonly btnSearch:Locator;
    private readonly page:Page;


    //constructor
    constructor(page:Page){
        this.page=page;
        this.lnkMyAccount=page.locator('span:has-text("My Account")');
        this.lnkRegister=page.locator('a:has-text("Register")');
        this.lnkLogin=page.locator('a:has-text("Login")');       
        this.txtSearchbox=page.locator('input[placeholder="search"]');
        this.btnSearch=page.locator('#search button[type="button"]');
    }
    //action methods
    //check if homepage exists
    async isHomePageExists()
    {
        let title=await this.page.title();
        if(title)
        {
            return true;
        }
        return false;

    }

    //click on My Account link
    async clickOnMyAccount(){
        try{
            await this.lnkMyAccount.click();
        }
        catch (error){
        console.error(`Expectation occured while clicking on 'My Account':${error}`);
        throw error;
    }

    }

    //click login link
    async clickLogin(){
        try{
            await this.lnkLogin.click();
        }        catch (error){
        console.error(`Expectation occured while clicking on 'Login':${error}`);
        throw error;
    }

    }
    // Enter product name in the search box
async enterProductName(pName: string) {
  try {
    await this.txtSearchbox.fill(pName);
  } catch (error) {
    console.log(`Exception occurred while entering product name: ${error}`);
    throw error;
  }
}

// Click the search button
async clickSearch() {
  try {
    await this.btnSearch.click();
  } catch (error) {
    console.log(`Exception occurred while clicking 'Search': ${error}`);
    throw error;
  }
}
}
  
const { test, expect } = require('@playwright/test');

const appUrl = "http://localhost:3000";
const loginAppUrl = "http://localhost:3000/login";
const registerAppUrl = "http://localhost:3000/register";
const allBooksUrl = "http://localhost:3000/catalog";

test('Verify All Books link is visible', async ({ page }) => {
    await page.goto(appUrl);
    const allBookText = "All Books";

    const allBookLink = page.locator("#site-header > nav > section > a");

    // Verify that all books text contain
    await expect(allBookLink).toContainText(allBookText);

    await allBookLink.click();
    // Verify that all books page url
    await expect(page).toHaveURL(allBooksUrl);
});

test('Navigation Bar for home page login button', async ({ page }) => {
    // Go to HOME page
    await page.goto(appUrl);

    const loginButton = page.locator("#guest > a:nth-child(1)");

    // Verify that login button contain this text
    await expect(loginButton).toContainText("Login");

    await loginButton.click();

    // Verify redirect to login page
    await expect(page).toHaveURL(loginAppUrl);

});

test('Navigation Bar for Logged-In Users', async ({ page }) => {
    // Go to HOME page
    await page.goto(loginAppUrl);

    const loginForm = page.locator("#login-form");
    const loginEmail = page.locator("#email");
    const loginPassword = page.locator("#password");
    const loginButtonSubmit = page.locator("#login-form > fieldset > input");

    // Verify that login button contain this text
    await expect(loginForm).toContainText("Login Form");

    await loginEmail.fill("peter@abv.bg");
    await loginPassword.fill("123456");
    await loginButtonSubmit.click();

    // Verify redirect to catalog/all books page after successful login
    await expect(page).toHaveURL(allBooksUrl);

    const logoutButton = page.locator("#logoutBtn");

    // Verify logoutButton is visible on the page
    const isLogoutButtonVisible = await logoutButton.isVisible();
    await expect(isLogoutButtonVisible).toBe(true);

});

test ('Verify User\'s email address is visible', async({page}) => {
    //open the application
    await page.goto("http://localhost:3000/login");
    
    //locate page toolbar
    await page.waitForSelector('nav.navbar');
    
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    const emailAddress = await page.getByText('peter@abv.bg');
    
    const isemailAddressVisible = await emailAddress.isVisible()

    expect(isemailAddressVisible).toBe(true)
})

test('Submit register form with valid fields', async ({ page }) => {
    await page.goto(registerAppUrl);
    const seconds = new Date().getTime() / 1000;
    await page.fill('input[name="email"]', 'new_user' + seconds + '@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.fill('input[name="confirm-pass"]', '123456');

    await page.click('input[type="submit"]');

    await page.$('a[href="catalog"]');
    expect(page.url()).toBe('http://localhost:3000/catalog')
})


test('Submit register form with empty fields', async ({ page }) => {
    await page.goto(registerAppUrl);
    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type().toContain('alert'));
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    })
    await page.$('a[href="register"]');
    expect(page.url()).toBe(registerAppUrl)
})

test('Submit register form with missing password', async ({ page }) => {
    await page.goto(registerAppUrl);

    const seconds = new Date().getTime() / 1000;
    await page.fill('input[name="email"]', 'new_user' + seconds + '@abv.bg');
    await page.fill('input[name="confirm-pass"]', '1234567');


    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type().toContain('alert'));
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    })
    await page.$('a[href="register"]');
    expect(page.url()).toBe(registerAppUrl)
})

test('Submit register form with missing confirm-password', async ({ page }) => {
    await page.goto(registerAppUrl);

    const seconds = new Date().getTime() / 1000;
    await page.fill('input[name="email"]', 'new_user' + seconds + '@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type().toContain('alert'));
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    })
    await page.$('a[href="register"]');
    expect(page.url()).toBe('http://localhost:3000/register')
})

test('Submit register form with missing email', async ({ page }) => {
    await page.goto("http://localhost:3000/register");

    const seconds = new Date().getTime() / 1000;
    await page.fill('input[name="password"]', '123456');
    await page.fill('input[name="confirm-pass"]', '1234567');

    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type().toContain('alert'));
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    })
    await page.$('a[href="register"]');
    expect(page.url()).toBe('http://localhost:3000/register')
})


test('Submit register form with non-matching passwords', async ({ page }) => {
    await page.goto("http://localhost:3000/register");
    const seconds = new Date().getTime() / 1000;
    await page.fill('input[name="email"]', 'new_user' + seconds + '@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.fill('input[name="confirm-pass"]', '1234567');

    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type().toContain('alert'));
        expect(dialog.message()).toContain('Passwords don\'t match!');
        await dialog.accept();
    })
    await page.$('a[href="register"]');
    expect(page.url()).toBe('http://localhost:3000/register')
})
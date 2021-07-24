import { expect } from "@playwright/test";
import { test } from "./index.lib";
import { signInWithGoogle } from "../index.utils";

test("Login with Google+Device", async ({
  page,
  browserName,
  openloginURL,
  user,
}) => {
  // Login with Google
  await page.goto(openloginURL);
  await page.click('button:has-text("Get Started")');
  await page.click('button:has-text("Continue with Google")');
  test.fixme(
    !(await signInWithGoogle({ page, browserName, email: user.email }))
  );

  // Should be signed in in <2 minutes
  await page.waitForURL(`${openloginURL}/wallet/home`, {
    timeout: 2 * 60 * 1000,
  });

  // Go to Account page
  await Promise.all([page.waitForNavigation(), page.click("text=Account")]);
  expect(await page.isVisible(`text=${user.email}`)).toBeTruthy();

  // Logout
  await Promise.all([page.waitForNavigation(), page.click("text=Logout")]);
  expect(page.url()).toBe(`${openloginURL}/`);
});
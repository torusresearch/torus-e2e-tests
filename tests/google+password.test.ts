import { expect } from "@playwright/test";
import { test } from "../base";
import { signInWithGoogle } from "../utils";

test("Login with Google+Password, Cancel share transfer(s), Delete device share(s), Logout", async ({
  page,
  browserName,
  profile,
}) => {
  if (!profile.google || !profile.openlogin) return;

  // Login with Google
  await page.goto("https://app.openlogin.com");
  await page.click('button:has-text("Get Started")');
  await page.click('button:has-text("Continue with Google")');
  await signInWithGoogle({ email: profile.google.email, page, browserName });

  // Enter password
  await page.waitForURL("https://app.openlogin.com/tkey-input#**");
  await page.fill(
    '[placeholder="Account password"]',
    profile.openlogin.password
  );
  await page.click('button:has-text("Confirm")');

  // Should be signed in in <2 minutes
  await page.waitForURL("https://app.openlogin.com/wallet/home", {
    timeout: 2 * 60 * 1000,
  });

  // Cancel all share transfer requests (if any)
  while (true) {
    await page.waitForTimeout(1000);
    if (await page.isVisible("text=New login detected"))
      await page.click('button:has-text("Cancel")');
    else break;
  }

  // Go to Account page
  await Promise.all([page.waitForNavigation(), page.click("text=Account")]);
  expect(await page.isVisible(`text=${profile.google.email}`)).toBeTruthy();

  // Delete all device shares
  while (
    await page.isVisible(
      // TODO: Select using aria-label
      '.info-box:has(:text("Desktop")):below(:text("Device(s)"))'
    )
  ) {
    await page.click(
      // TODO: Select using aria-label
      '.info-box:has(:text("Desktop")):below(:text("Device(s)")) >> :nth-match(button, 2)'
    );

    // Should have deleted successfully in <2 minutes
    await page.waitForSelector("text=successfully deleted", {
      timeout: 2 * 60 * 1000,
    });
    await page.click(
      // TODO: Select using aria-label
      '.system-bar-container:has(:text("successfully deleted")) >> button'
    );
  }

  // Logout
  await Promise.all([page.waitForNavigation(), page.click("text=Logout")]);
  expect(page.url()).toBe("https://app.openlogin.com/");
});

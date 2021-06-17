import { Page } from "@playwright/test";

export function useAutoCancelShareTransfer(page: Page): () => Promise<void> {
  let stopped = false;
  const promise = new Promise<void>(async (resolve) => {
    while (!stopped) {
      try {
        if (await page.isVisible("text=New login detected"))
          await page.click('button:has-text("Cancel")', { force: true });
      } catch {}
    }
    resolve();
  });

  return async () => {
    stopped = true;
    await promise;
  };
}

export async function signInWithGoogle({
  email,
  page,
  browserName,
}: {
  email: string;
  page: Page;
  browserName: "chromium" | "firefox" | "webkit";
}) {
  await page.waitForURL("https://accounts.google.com/**");
  await page.click(`text=${email}`);

  if (browserName === "chromium") {
    // On Chromium, Google sometimes re-ask for user's consent
    await page.waitForNavigation();
    if (
      page
        .url()
        .startsWith("https://accounts.google.com/signin/oauth/legacy/consent")
    )
      await page.click('button:has-text("Allow")');
  }

  if (browserName === "webkit")
    // Workaround wait for URL issue on Safari
    while (page.url().startsWith("https://accounts.google.com"))
      await page.waitForTimeout(100);
}

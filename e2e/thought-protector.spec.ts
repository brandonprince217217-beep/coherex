import { test, expect } from "@playwright/test";

const FIXTURE = {
  predicted_next_thought: "I am enough",
  why: "This thought counters self-doubt",
  pattern: "negative self-talk",
  protected_thought: "I am worthy and capable",
  reasoning: "Replacing doubt with affirmation builds resilience",
};

test.describe("Thought Protector smoke test", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/thought-protector", async (route) => {
      const request = route.request();
      const body = JSON.parse(request.postData() ?? "{}");
      expect(body.thought).toBeTruthy();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(FIXTURE),
      });
    });
  });

  test("fills thought, submits, and shows results", async ({ page }) => {
    await page.goto("/thought-protector");

    await page.getByLabel("Enter one thought…").fill("I am not good enough");
    await page.getByRole("button", { name: "Protect my thought" }).click();

    await expect(page.getByText(FIXTURE.predicted_next_thought)).toBeVisible();
    await expect(page.getByText(FIXTURE.pattern)).toBeVisible();
    await expect(page.getByText(FIXTURE.protected_thought)).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";
test("root redirects to /en", async ({ page }) => { await page.goto("/"); await expect(page).toHaveURL(/\/en$/); });
test("Bangla home renders Bangla headline", async ({ page }) => { await page.goto("/bn"); await expect(page.locator("html")).toHaveAttribute("lang", "bn"); await expect(page.getByRole("heading", { level: 1 })).toContainText("শিল্পকে"); });
test("tracking demo is labelled as demonstration", async ({ page }) => {
  await page.goto("/en/tracking"); await page.getByLabel("Tracking ID").fill("SHK-DEMO000000"); await page.getByRole("button", { name: "Track Shipment" }).click();
  await expect(page.getByText(/DEMONSTRATION DATA/)).toBeVisible(); });
test("admin requires sign-in", async ({ page }) => { await page.goto("/admin"); await expect(page).toHaveURL(/\/admin\/login/); });
test("network page loads map controls", async ({ page }) => { await page.goto("/en/network"); await expect(page.getByRole("button", { name: "Road" })).toBeVisible(); });

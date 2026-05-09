import { test, expect } from "@playwright/test";

test.describe("Coupon Code", () => {
  test("Apply button does not trigger any network request", async ({
    page,
  }) => {
    // Track network requests
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));

    // Navigate and add product to cart
    await page.goto("/default-channel");
    await page.getByRole("link", { name: "Plimsolls Sneakers $" }).click();
    await page.getByRole("button", { name: "Size 39" }).click();
    await page.getByRole("button", { name: "Ghost White" }).click();
    await page.getByRole("button", { name: "Add to bag" }).click();

    // Go to checkout
    await page.getByTestId("CartNavItem").click();
    await page.getByRole("link", { name: "Checkout" }).click();

    // Enter coupon and click Apply
    await page.getByRole("textbox", { name: "Discount code" }).fill("TESTCODE");

    const requestsBefore = requests.length;
    await page.getByRole("button", { name: "Apply" }).click();
    await page.waitForTimeout(2000);
    const requestsAfter = requests.length;

    // Assert no new network requests fired
    expect(requestsAfter).toBe(requestsBefore);
  });
});

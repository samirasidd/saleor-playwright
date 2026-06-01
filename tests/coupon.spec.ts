import { test, expect } from "@playwright/test";

// Reusable helper to get to the coupon input
async function navigateToCheckoutWithItem(page) {
  await page.goto("/default-channel");
  await page.getByRole("link", { name: "Plimsolls Sneakers $" }).click();
  await page.getByRole("button", { name: "Size 39" }).click();
  await page.getByRole("button", { name: "Ghost White" }).click();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.getByTestId("CartNavItem").click();
  await page.getByRole("link", { name: "Checkout" }).click();
}

test.describe("Coupon Code — Issue #1193", () => {
  test.skip("BUG #1193 — Apply button fired no GraphQL mutation [fixed in PR #1199]", async ({
    page,
  }) => {
    /**
     * This test documented the original bug:
     * The coupon Apply button triggered zero network requests.
     * Root cause: handleApplyPromo() was a stub with hardcoded
     * fake state, never wired to useCheckoutAddPromoCodeMutation.
     *
     * Bug reported: github.com/saleor/storefront/issues/1193
     * Fix merged:   github.com/saleor/storefront/pull/1199
     *
     * Test intentionally skipped — kept for historical record.
     * Verification of fix is in the test below.
     */

    const graphqlRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/graphql/")) {
        graphqlRequests.push(request.url());
      }
    });

    await navigateToCheckoutWithItem(page);
    await page.getByRole("textbox", { name: "Discount code" }).fill("TESTCODE");

    const requestsBefore = graphqlRequests.length;
    await page.getByRole("button", { name: "Apply" }).click();
    await page.waitForLoadState("networkidle");
    const requestsAfter = graphqlRequests.length;

    // When bug was present: no new requests fired
    expect(requestsAfter).toBe(requestsBefore);
  });

  test("FIX #1199 — Apply button triggers checkoutAddPromoCode mutation", async ({
    page,
  }) => {
    /**
     * Verifies the fix for Issue #1193.
     * Confirms that clicking Apply now fires the
     * checkoutAddPromoCode GraphQL mutation.
     */

    const promoMutationFired: boolean[] = [];

    page.on("request", (request) => {
      const isGraphQL = request.url().includes("/graphql/");
      const isPromoMutation = request
        .postData()
        ?.includes("checkoutAddPromoCode");

      if (isGraphQL && isPromoMutation) {
        promoMutationFired.push(true);
      }
    });

    await navigateToCheckoutWithItem(page);
    await page.getByRole("textbox", { name: "Discount code" }).fill("TESTCODE");
    await page.getByRole("button", { name: "Apply" }).click();
    await page.waitForLoadState("networkidle");

    // Mutation must have fired at least once
    expect(promoMutationFired.length).toBeGreaterThan(0);
  });
});

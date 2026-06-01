# Saleor Open Source QA

Playwright E2E test suite for [Saleor](https://saleor.io/) — an open-source 
e-commerce platform used by Lush and Breitling.

## What this is
A focused QA project combining manual exploratory testing with Playwright 
automation and CI/CD — targeting real bugs in a production codebase.

## Findings
| Bug | Severity | Status |
|-----|----------|--------|
| [Coupon Apply button fires no network request](https://github.com/saleor/storefront/issues/1193) | High | ✅ Fixed — PR #1199 |

## Test Coverage
- Checkout flow (guest)
- Coupon/discount code functionality
- Cart operations (add, update, remove)
- Search edge cases
- Security checks (auth, HTTPS, token exposure)
- Accessibility (Lighthouse, keyboard navigation)

## Stack
- Playwright (TypeScript)
- GitHub Actions CI/CD
- Chrome / Edge

## Run locally
​```
npm install,
npx playwright install chromium,
npx playwright test
​```

## CI/CD
Tests run automatically on every push via GitHub Actions.

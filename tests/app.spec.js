const { test, expect } = require('@playwright/test');

test('should display the diagram for the example expression', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://localhost:3000/');

  // Click the "Example" button
  await page.click('text=Example');

  // Check that the input field was updated
  const inputValue = await page.getByLabel('Enter Lambda Expression').inputValue();
  expect(inputValue).toBe('((λx.(λw.xw))(λa.(λf.f)))');

  // Click the "Generate Diagram" button
  await page.click('text=Generate Diagram');

  // Wait for the diagram to be visible
  const diagram = await page.waitForSelector('[data-testid="lambda-diagram"]');
  expect(diagram).not.toBeNull();

  // Check for the lambda abstractions in the diagram
  const diagramLocator = page.locator('[data-testid="lambda-diagram"]');
  await expect(diagramLocator.locator('text=λx')).toBeVisible();
  await expect(diagramLocator.locator('text=λw')).toBeVisible();
  await expect(diagramLocator.locator('text=λa')).toBeVisible();
  await expect(diagramLocator.locator('text=λf')).toBeVisible();
}); 
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should register a new user', async ({ page }) => {
    await page.goto('/register')
    
    await page.fill('[name="name"]', 'Test User')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.fill('[name="confirmPassword"]', 'password123')
    
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard after registration
    await expect(page).toHaveURL('/')
  })

  test('should login existing user', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[name="email"]', 'alice@example.com')
    await page.fill('[name="password"]', 'password123')
    
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard after login
    await expect(page).toHaveURL('/')
  })

  test('should show validation errors', async ({ page }) => {
    await page.goto('/register')
    
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible()
    await expect(page.locator('text=Invalid email address')).toBeVisible()
  })

  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })
})

test.describe('Pair Management', () => {
  test('should create and accept invite', async ({ browser }) => {
    // Create two browser contexts for two users
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()
    
    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // User 1 logs in and creates invite
    await page1.goto('/login')
    await page1.fill('[name="email"]', 'alice@example.com')
    await page1.fill('[name="password"]', 'password123')
    await page1.click('button[type="submit"]')
    
    // Create invite
    await page1.click('text=Create New Pair')
    await page1.click('text=Generate Invite')
    
    // Get invite code
    const inviteCode = await page1.inputValue('input[readonly]')
    
    // User 2 logs in and accepts invite
    await page2.goto('/login')
    await page2.fill('[name="email"]', 'bob@example.com')
    await page2.fill('[name="password"]', 'password123')
    await page2.click('button[type="submit"]')
    
    await page2.click('text=Join Existing Pair')
    await page2.fill('[name="invite-code"]', inviteCode)
    await page2.click('text=Join Pair')
    
    // Both users should now see the shared dashboard
    await expect(page1.locator('text=Alice & Bob')).toBeVisible()
    await expect(page2.locator('text=Alice & Bob')).toBeVisible()
    
    await context1.close()
    await context2.close()
  })
})

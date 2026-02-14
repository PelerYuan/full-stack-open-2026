const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')

        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Test User',
                username: 'testuser',
                password: 'password123'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('log in to application')).toBeVisible()

        const usernameInput = page.locator('input[name="Username"]')
        await expect(usernameInput).toBeVisible()

        const passwordInput = page.locator('input[name="Password"]')
        await expect(passwordInput).toBeVisible()

        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })

    test('succeeds with correct credentials', async ({ page }) => {
        await page.locator('input[name="Username"]').fill('testuser')
        await page.locator('input[name="Password"]').fill('password123')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.locator('input[name="Username"]').fill('testuser')
        await page.locator('input[name="Password"]').fill('wrongpassword')
        await page.getByRole('button', { name: 'login' }).click()

        const errorDiv = page.locator('.error')
        await expect(errorDiv).toBeVisible()
        await expect(errorDiv).toContainText('wrong username or password')

        await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.locator('input[name="Username"]').fill('testuser')
            await page.locator('input[name="Password"]').fill('password123')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()

            await page.locator('input[name="title"]').fill('Playwright is easy')
            await page.locator('input[name="author"]').fill('aaaaa')
            await page.locator('input[name="url"]').fill('http://test.org')

            await page.getByRole('button', { name: 'create' }).click()

            const blogElement = page.locator('.blog').filter({ hasText: 'Playwright is easy' })
            await expect(blogElement).toBeVisible()
            await expect(blogElement).toContainText('aaaaa')
        })

        describe('When a blog exists', () => {
            beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'create new blog' }).click()
                await page.locator('input[name="title"]').fill('1213')
                await page.locator('input[name="author"]').fill('aaaaa')
                await page.locator('input[name="url"]').fill('http://test.org')
                await page.getByRole('button', { name: 'create' }).click()

                await page.locator('.blog').filter({ hasText: '1213' }).waitFor()
            })

            test('it can be liked', async ({ page }) => {
                const blogElement = page.locator('.blog').filter({ hasText: '1213' })

                await blogElement.getByRole('button', { name: 'view' }).click()

                await expect(blogElement).toContainText('likes 0')

                await blogElement.getByRole('button', { name: 'like' }).click()

                await expect(blogElement).toContainText('likes 1')
            })

            test('user who added the blog can delete it', async ({ page }) => {
                await page.reload()

                const blogElement = page.locator('.blog').filter({ hasText: '1213' })

                await blogElement.getByRole('button', { name: 'view' }).click()

                page.on('dialog', dialog => dialog.accept())

                await blogElement.getByRole('button', { name: 'remove' }).click()

                await expect(blogElement).not.toBeVisible()
            })

            test('only the creator can see the delete button', async ({ page, request }) => {
                // 1. 创建另一个用户 (User B)
                // 我们直接用 request API 创建，这样速度最快
                await request.post('http://localhost:3003/api/users', {
                    data: {
                        username: 'otheruser',
                        name: 'Other User',
                        password: 'password123'
                    }
                })
                await page.getByRole('button', { name: 'logout' }).click()
                await page.locator('input[name="Username"]').fill('otheruser')
                await page.locator('input[name="Password"]').fill('password123')
                await page.getByRole('button', { name: 'login' }).click()

                const blogElement = page.locator('.blog').filter({ hasText: '1213' })
                await blogElement.getByRole('button', { name: 'view' }).click()
                await expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
            })
        })
        test('blogs are ordered according to likes', async ({ page }) => {
            const createBlog = async (title) => {
                await page.getByRole('button', { name: 'create new blog' }).click()
                await page.locator('input[name="title"]').fill(title)
                await page.locator('input[name="author"]').fill('Test Author')
                await page.locator('input[name="url"]').fill('http://example.com')
                await page.getByRole('button', { name: 'create' }).click()
                await page.locator('.blog').filter({ hasText: title }).waitFor()
            }

            await createBlog('Blog with 0 likes')
            await createBlog('Blog with 5 likes')
            await createBlog('Blog with 10 likes')

            const blog5 = page.locator('.blog').filter({ hasText: 'Blog with 5 likes' })
            await blog5.getByRole('button', { name: 'view' }).click()
            for (let i = 0; i < 5; i++) {
                await blog5.getByRole('button', { name: 'like' }).click()
                await blog5.getByText(`likes ${i + 1}`).waitFor()
            }

            const blog10 = page.locator('.blog').filter({ hasText: 'Blog with 10 likes' })
            await blog10.getByRole('button', { name: 'view' }).click()
            for (let i = 0; i < 6; i++) {
                await blog10.getByRole('button', { name: 'like' }).click()
                await blog10.getByText(`likes ${i + 1}`).waitFor()
            }
            
            const blogs = page.locator('.blog')
            await expect(blogs.first()).toContainText('Blog with 10 likes')
            await expect(blogs.nth(1)).toContainText('Blog with 5 likes')
            await expect(blogs.last()).toContainText('Blog with 0 likes')
        })
    })
})
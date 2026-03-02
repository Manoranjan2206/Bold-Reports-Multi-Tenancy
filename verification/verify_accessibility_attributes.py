from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        print("Navigating to http://localhost:5173")
        try:
            page.goto("http://localhost:5173", timeout=30000)
            page.wait_for_selector("aside", timeout=30000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            browser.close()
            return

        print("Checking for accessibility attributes...")

        # 1. Check Data Isolation Model
        model_label = page.locator("label[for='model-select']")
        model_select = page.locator("select#model-select")

        if model_label.count() > 0 and model_select.count() > 0:
            print("PASS: 'Data Isolation Model' label has 'for' attribute matching select 'id'.")
        else:
            print("FAIL: 'Data Isolation Model' attributes missing or incorrect.")

        # 2. Check Tenant
        tenant_label = page.locator("label[for='tenant-select']")
        tenant_select = page.locator("select#tenant-select")

        if tenant_label.count() > 0 and tenant_select.count() > 0:
             print("PASS: 'Tenant' label has 'for' attribute matching select 'id'.")
        else:
             print("FAIL: 'Tenant' attributes missing or incorrect.")

        # 3. Check User
        user_label = page.locator("label[for='user-select']")
        user_select = page.locator("select#user-select")

        if user_label.count() > 0 and user_select.count() > 0:
             print("PASS: 'User' label has 'for' attribute matching select 'id'.")
        else:
             print("FAIL: 'User' attributes missing or incorrect.")

        # Take a screenshot of the sidebar to visually confirm layout didn't break
        sidebar = page.locator("aside")
        if sidebar.is_visible():
            sidebar.screenshot(path="verification/sidebar_accessibility_check.png")
            print("Captured verification/sidebar_accessibility_check.png")

        browser.close()

if __name__ == "__main__":
    run()

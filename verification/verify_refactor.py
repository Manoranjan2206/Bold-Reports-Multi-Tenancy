import time
from playwright.sync_api import sync_playwright

def verify_tenant_config():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to app...")
        page.goto("http://localhost:5173")

        # Wait for the app to load
        page.wait_for_selector("h1:has-text('Sales Order Detail')")

        # 1. Verify Sidebar Tenant Dropdown
        print("Verifying Sidebar Tenant Dropdown...")
        tenant_select = page.locator("select").nth(1) # Assuming 2nd select is Tenant
        options = tenant_select.locator("option").all_inner_texts()
        print(f"Found tenant options: {options}")

        expected_tenants = ["Northwind Traders", "Adventure Works", "Contoso Ltd"]
        for tenant in expected_tenants:
            if tenant not in options:
                print(f"ERROR: Missing tenant {tenant}")
            else:
                print(f"SUCCESS: Found tenant {tenant}")

        # 2. Open Isolation Details Modal
        print("Opening Isolation Details Modal...")
        page.click("button[title='Data Isolation Details']")
        page.wait_for_selector("h2:has-text('Data Isolation Details')")

        # 3. Verify Visualization Tab (Default)
        print("Taking screenshot of Modal (Visualization Tab)...")
        page.screenshot(path="verification/modal_visualization_refactored.png")

        # 4. Switch to User Details Tab to verify derived data
        print("Switching to User Details Tab...")
        page.click("button:has-text('User Details')")
        time.sleep(1) # Allow transition

        print("Taking screenshot of Modal (User Details Tab)...")
        page.screenshot(path="verification/modal_user_details_refactored.png")

        # Verify tenant names in table
        table_text = page.locator("table").inner_text()
        if "Northwind Traders" in table_text and "Adventure Works" in table_text:
             print("SUCCESS: Tenant names visible in User Details table")
        else:
             print("ERROR: Tenant names NOT found in User Details table")

        browser.close()

if __name__ == "__main__":
    verify_tenant_config()

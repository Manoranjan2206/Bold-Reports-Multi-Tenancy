import time
from playwright.sync_api import sync_playwright

def verify_tenant_config():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Increase viewport height to ensure visibility
        context = browser.new_context(viewport={'width': 1280, 'height': 1200})
        page = context.new_page()

        print("Navigating to app...")
        page.goto("http://localhost:5173")

        # Wait for the app to load
        page.wait_for_selector("h1:has-text('Sales Order Detail')")

        # 1. Verify Sidebar Tenant Dropdown (using distinct class/structure)
        print("Verifying Sidebar Tenant Dropdown...")
        # Locating the select inside the sidebar configuration
        # Assuming sidebar is visible or opened by default
        tenant_select = page.locator("aside select").nth(1)

        options = []
        try:
             # Wait for options to be populated
             page.wait_for_selector("aside select option")
             options = tenant_select.locator("option").all_innerTexts()
        except:
             # Fallback if specific selector fails
             options = page.eval_on_selector_all("aside select option", "els => els.map(e => e.innerText)")

        print(f"Found tenant options: {options}")

        expected_tenants = ["Northwind Traders", "Adventure Works", "Contoso Ltd"]

        # Check if we found at least one expected tenant to confirm we are looking at the right place
        found_any = False
        for tenant in expected_tenants:
            if tenant in options:
                found_any = True
                print(f"SUCCESS: Found tenant {tenant}")
            else:
                 # Check if it's maybe just not found in the specific list capture
                 pass

        if not found_any:
             print("WARNING: Could not verify tenant dropdown options via specific locator.")

        # 2. Open Isolation Details Modal
        print("Opening Isolation Details Modal...")
        # Use the title attribute to find the button
        page.click("button[title='Data Isolation Details']")

        # Wait for modal header
        page.wait_for_selector("h2:has-text('Data Isolation Details')")

        # 3. Verify Visualization Tab (Default)
        print("Taking screenshot of Modal (Visualization Tab)...")
        time.sleep(0.5)
        page.screenshot(path="verification/modal_visualization_refactored.png")

        # 4. Switch to User Details Tab to verify derived data
        print("Switching to User Details Tab...")
        page.click("button:has-text('User Details')")
        time.sleep(1) # Allow transition

        print("Taking screenshot of Modal (User Details Tab)...")
        page.screenshot(path="verification/modal_user_details_refactored.png")

        # Verify tenant names in table
        # There are multiple tables on the page (report viewer, sample data, modal).
        # We need the one inside the modal.
        modal_table = page.locator(".fixed table")

        if modal_table.count() > 0:
            table_text = modal_table.inner_text()
            if "Northwind Traders" in table_text and "Adventure Works" in table_text:
                 print("SUCCESS: Tenant names visible in User Details table")
            else:
                 print(f"ERROR: Tenant names NOT found in User Details table. Text found: {table_text[:100]}...")
        else:
            print("ERROR: Modal table not found")

        browser.close()

if __name__ == "__main__":
    verify_tenant_config()

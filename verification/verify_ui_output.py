from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to simulate a desktop dashboard
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        print("Navigating to http://localhost:5173")

        try:
             page.goto("http://localhost:5173", timeout=10000)
             page.wait_for_selector("h1", timeout=10000)
        except Exception as e:
             print(f"Failed to load page: {e}")
             browser.close()
             return

        # 1. Screenshot Dashboard (Showing Header)
        print("Taking Dashboard Screenshot...")
        time.sleep(2) # Wait for initial render
        page.screenshot(path="verification/dashboard_header.png")
        print("Captured verification/dashboard_header.png")

        # 2. Verify Profile Dialog
        print("Clicking Profile Button...")
        # Profile button is the one with the initials (avatar)
        profile_btn = page.locator("button").filter(has_text="Profile")
        profile_btn.click()

        time.sleep(1)
        page.screenshot(path="verification/profile_dialog.png")
        print("Captured verification/profile_dialog.png")

        # Close profile dialog
        print("Closing Profile Dialog...")
        close_btn = page.locator("button span:has-text('close')").first
        if close_btn.is_visible():
             close_btn.click()
        else:
             page.keyboard.press("Escape")
        time.sleep(1)

        # 3. Open Modal and verify Access Pattern
        print("Opening Data Isolation Modal...")
        modal_btn = page.locator("button[title='Data Isolation Details']")
        modal_btn.click()

        print("Switching to Access Pattern tab...")
        access_tab = page.locator("button:has-text('Access Pattern')")
        access_tab.wait_for(state='visible')
        access_tab.click()

        time.sleep(1)
        page.screenshot(path="verification/modal_access_pattern_refined.png")
        print("Captured verification/modal_access_pattern_refined.png")

        browser.close()

if __name__ == "__main__":
    run()

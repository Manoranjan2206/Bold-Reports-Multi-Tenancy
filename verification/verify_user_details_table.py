from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to simulate a desktop dashboard
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser Error: {err}"))

        print("Navigating to http://localhost:5173")

        try:
             page.goto("http://localhost:5173", timeout=30000)
             page.wait_for_selector("h1", timeout=30000)
        except Exception as e:
             print(f"Failed to load page: {e}")
             page.screenshot(path="verification/failed_load.png")
             browser.close()
             return

        # Wait for initial render
        time.sleep(2)

        # Open Data Isolation Modal
        print("Opening Data Isolation Modal...")

        # Check if the button exists
        btn = page.locator("button[title='Data Isolation Details']").first
        if not btn.is_visible():
            print("Title selector not found, trying specific sidebar elements...")
            # Fallback
            page.locator("span.material-symbols-outlined:has-text('info')").first.click()
        else:
            btn.click()

        time.sleep(1)

        print("Switching to User Details tab...")
        user_details_tab = page.locator("button:has-text('User Details')")
        user_details_tab.wait_for(state='visible', timeout=5000)
        user_details_tab.click()

        time.sleep(1)

        # Screenshot the modal content
        print("Taking screenshot of User Details table...")
        # Try to locate the modal content more robustly
        modal_content = page.locator(".fixed.inset-0 > div").first
        if modal_content.count() > 0:
            modal_content.screenshot(path="verification/modal_user_details_table.png")
            print("Captured verification/modal_user_details_table.png")
        else:
            print("Modal content not found!")
            page.screenshot(path="verification/full_page_debug.png")

        browser.close()

if __name__ == "__main__":
    run()

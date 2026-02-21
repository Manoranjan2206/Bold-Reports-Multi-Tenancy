from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to http://localhost:5173")
        page.goto("http://localhost:5173")

        # Wait for app load
        page.wait_for_selector("h1", timeout=10000)

        # 1. Test Sidebar Toggle
        print("Testing Sidebar toggle...")
        sidebar = page.locator("aside")
        menu_button = page.locator("header button").first

        box = sidebar.bounding_box()
        if box['width'] > 200:
            print(f"Sidebar is initially OPEN (Width: {box['width']}) - Correct.")
        else:
            print(f"Sidebar is initially CLOSED (Width: {box['width']}) - Unexpected.")

        menu_button.click()
        time.sleep(1)
        box = sidebar.bounding_box()
        if box['width'] < 10:
             print(f"Sidebar is CLOSED after toggle (Width: {box['width']}) - Correct.")
        else:
             print(f"Sidebar is STILL OPEN after toggle (Width: {box['width']}) - Failed.")

        menu_button.click()
        time.sleep(1)

        # 2. Test Modal User Details Tab
        print("Testing Modal User Details...")
        page.locator("button[title='Data Isolation Details']").click()

        try:
            page.wait_for_selector("text=Data Isolation Details", timeout=5000)
            print("Modal opened.")
        except:
            print("Modal did not open.")
            page.screenshot(path="verification/modal_failed_open.png")
            return

        user_details_tab = page.locator("button", has_text="User Details")
        user_details_tab.click()

        time.sleep(1)

        # Relaxed check: check if the table header is visible, which shouldn't be obscured
        if page.is_visible("text=Assigned Attributes"):
            print("User Details table header is visible (Correct).")
        elif page.is_visible("text=Sophia Reynolds"):
            print("User Details content is visible (Correct).")
        else:
            print("User Details table NOT visible (Failed).")
            # Save screenshot for debug
            page.screenshot(path="verification/modal_user_details_debug.png")

        page.screenshot(path="verification/modal_user_details.png")

        browser.close()

if __name__ == "__main__":
    run()

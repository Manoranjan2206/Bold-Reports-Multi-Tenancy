import os
import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to http://localhost:5173")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(2000)

        page.screenshot(path="verification/dashboard_refactored.png")
        print("Dashboard screenshot saved.")

        print("Opening modal...")
        page.get_by_title("Data Isolation Details").click()
        page.wait_for_timeout(500)

        page.screenshot(path="verification/modal_visualization.png")
        print("Modal Visualization screenshot saved.")

        print("Switching to Access Pattern tab...")
        page.get_by_role("button", name="Access Pattern").click()
        page.wait_for_timeout(200)

        page.screenshot(path="verification/modal_access_pattern.png")
        print("Modal Access Pattern screenshot saved.")

        print("Closing modal...")
        # Use the bottom close button specifically
        page.get_by_role("button", name="Close", exact=True).last.click()
        page.wait_for_timeout(200)

        print("Toggling theme...")
        # Assuming the title is dynamic based on theme
        page.get_by_title("Switch to Dark Mode").click()
        page.wait_for_timeout(500)

        page.screenshot(path="verification/dashboard_dark.png")
        print("Dark Mode screenshot saved.")

        print("Opening modal in Dark Mode...")
        page.get_by_title("Data Isolation Details").click()
        page.wait_for_timeout(500)
        page.screenshot(path="verification/modal_dark.png")
        print("Dark Mode Modal screenshot saved.")

        browser.close()

if __name__ == "__main__":
    os.makedirs("verification", exist_ok=True)
    run()

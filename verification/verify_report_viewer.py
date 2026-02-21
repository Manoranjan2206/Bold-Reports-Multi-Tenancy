from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to http://localhost:5173")
        page.goto("http://localhost:5173")

        # Wait for the page to load
        page.wait_for_selector("h1", timeout=10000)

        # Check for the report viewer container
        print("Checking for Report Viewer container...")
        try:
            # The component id is passed as 'reportviewer-container', so Bold Reports usually creates a div with that ID
            # or it might be wrapped.
            page.wait_for_selector("#reportviewer-container", timeout=20000)
            print("Report Viewer container found.")
        except Exception as e:
            print(f"Report Viewer container NOT found: {e}")
            page.screenshot(path="verification/report_viewer_failed.png")
            browser.close()
            return

        # Take a screenshot
        time.sleep(5) # Give it some time to render the report/spinner
        page.screenshot(path="verification/dashboard_with_viewer.png")
        print("Dashboard with Viewer screenshot saved.")

        browser.close()

if __name__ == "__main__":
    run()

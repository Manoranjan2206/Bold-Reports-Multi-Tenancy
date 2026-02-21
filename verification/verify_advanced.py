from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to simulate a desktop dashboard
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        print("Navigating to http://localhost:5173 and waiting for token request...")

        try:
            # Expect the token request to happen on load
            with page.expect_response("**/api/token", timeout=10000) as response_info:
                page.goto("http://localhost:5173")

            print("Token request detected successfully.")
            response = response_info.value
            if response.status == 200:
                print("Token request succeeded (200 OK).")
            else:
                print(f"Token request failed with status {response.status}.")

        except Exception as e:
            print(f"Token verification failed: {e}")

        # Wait for app load
        page.wait_for_selector("h1", timeout=10000)

        # 1. Verify Layout (Advanced Look)
        print("Checking layout density...")
        # Check if the main container is using full width (no max-w-6xl)
        # We can check if the report viewer container is large
        viewer_container = page.locator("#reportviewer-container")

        # Wait for it to be visible/attached (might take longer if waiting for token)
        try:
            viewer_container.wait_for(state="attached", timeout=10000)
            box = viewer_container.bounding_box()
            if box and box['height'] > 500:
                 print(f"Viewer container height is ample ({box['height']}px) - Correct.")
            else:
                 print(f"Viewer container height is small ({box['height'] if box else 'None'}px) - Warning.")
        except Exception:
            print("Viewer container did not appear (possibly due to token failure or loading).")

        # 2. Verify New Query Link
        print("Checking New Query link...")
        new_query_btn = page.locator("a[href='https://support.boldreports.com/']")
        if new_query_btn.is_visible():
            print("New Query button with correct link found - Correct.")
        else:
            print("New Query button link NOT found - Failed.")

        # 3. Verify Manual Refresh Logic
        print("Checking Manual Refresh logic...")

        # Initial State: Northwind Traders
        # Change Tenant in Sidebar to "Adventure Works"
        sidebar_selects = page.locator("aside select")
        tenant_select = sidebar_selects.nth(1) # 2nd select is Tenant
        tenant_select.select_option(label="Adventure Works")

        time.sleep(1)

        # Check Dashboard Title/Context (should NOT change yet)
        context_span = page.locator("span.font-semibold:has-text('/')").first

        # Wait for it to be ready
        context_span.wait_for(timeout=5000)

        chip_text_before = context_span.inner_text()
        print(f"Context before refresh: {chip_text_before}")

        if "Northwind Traders" in chip_text_before:
             print("Dashboard did NOT update immediately (Correct).")
        else:
             print("Dashboard updated immediately (Failed).")

        # Click Refresh - Should trigger another token request
        print("Clicking Refresh Report...")
        refresh_btn = page.locator("button:has-text('Refresh Report')")

        try:
             with page.expect_response("**/api/token", timeout=10000) as response_info_refresh:
                  refresh_btn.click()
             print("Refresh token request detected.")
        except Exception as e:
             print(f"Refresh token request failed: {e}")
             refresh_btn.click() # Ensure click happened even if monitoring failed

        # Wait a bit for update
        time.sleep(2)

        chip_text_after = context_span.inner_text()
        print(f"Context after refresh: {chip_text_after}")

        if "Adventure Works" in chip_text_after:
             print("Dashboard updated after refresh click (Correct).")
        else:
             print("Dashboard did NOT update after refresh (Failed).")

        page.screenshot(path="verification/advanced_layout_refresh.png")

        browser.close()

if __name__ == "__main__":
    run()

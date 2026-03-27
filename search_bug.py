import asyncio
from playwright.async_api import async_playwright
import time
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("Navigating to http://localhost:8080/")
        await page.goto("http://localhost:8080/")
        
        # Wait for tiles to load
        await page.wait_for_selector('.zone-tile')
        
        # We need a NORMAL tile (no overdue class)
        tiles = await page.locator('.zone-tile:not(.overdue)').element_handles()
        
        if not tiles:
            print("No NORMAL tiles found. Printing all tiles:")
            all_tiles = await page.locator('.zone-tile').element_handles()
            for t in all_tiles:
                cls = await t.get_attribute('class')
                text = await t.inner_text()
                print(f"Tile class: {cls}, Text: {text}")
            await browser.close()
            return
            
        target_tile = tiles[0]
        t_text = await target_tile.inner_text()
        print(f"Targeting tile: {repr(t_text)}")
        
        # Evaluate state before
        state_txt_before = await page.evaluate("JSON.stringify(state.todayLog.periodic)")
        print(f"State before click: {state_txt_before}")
        
        # Do a native click
        box = await target_tile.bounding_box()
        # click in the center
        await page.mouse.click(box['x'] + box['width']/2, box['y'] + box['height']/2)
        print("Mouse clicked!")
        
        await page.wait_for_timeout(500)
        
        # Evaluate state after
        state_txt_after = await page.evaluate("JSON.stringify(state.todayLog.periodic)")
        print(f"State after click: {state_txt_after}")
        
        # Check current classes of ALL tiles
        print("DOM State after click:")
        all_tiles_after = await page.locator('.zone-tile').element_handles()
        for t in all_tiles_after:
            cls = await t.get_attribute('class')
            txt = await t.inner_text()
            print(f" - Tile: {repr(txt)}")
            print(f"   Class: {cls}")
            bg = await t.evaluate("el => el.style.background")
            print(f"   Background: {bg}")
        
        # Check progress text
        pct = await page.evaluate("document.getElementById('progressText') ? document.getElementById('progressText').innerText : 'none'")
        print(f"Progress Ring Text: {pct}")
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())

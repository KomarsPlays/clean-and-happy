import re

js_path = r"c:\Users\skopv\Documents\ANTYGRAVITY\SKOPVA SPACE\Work\clean-and-happy\main-app.js"
css_path = r"c:\Users\skopv\Documents\ANTYGRAVITY\SKOPVA SPACE\Work\clean-and-happy\main-style.css"

print("--- JS SEARCH ---")
with open(js_path, "r", encoding="utf-8") as f:
    js_lines = f.readlines()
for i, line in enumerate(js_lines):
    # Looking for task creation or click bindings
    if re.search(r'render.*task', line, re.I) or re.search(r'function toggle', line, re.I) or re.search(r'onclick.*toggle', line, re.I):
        print(f"JS L{i+1}: {line.strip()}")

print("\n--- CSS SEARCH ---")
with open(css_path, "r", encoding="utf-8") as f:
    css_lines = f.readlines()
for i, line in enumerate(css_lines):
    if re.search(r'\.theme-peach|\.theme-blueberry', line, re.I):
        # Look ahead 10 lines
        chunk = "".join(css_lines[i:i+15])
        if "star" in chunk.lower() or "cloud" in chunk.lower() or "scale" in chunk.lower():
            print(f"CSS L{i+1}: {line.strip()}")
            print(chunk)
            print("-" * 20)

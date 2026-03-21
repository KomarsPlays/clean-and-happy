import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

print("--- main-app.js ---")
with open("main-app.js", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "showUndoToast" in line or "applyTheme" in line or "setTheme" in line or "action-sheet" in line or "theme" in line.lower() or "overdue" in line.lower():
            if "theme" in line.lower() and len(line) > 100: continue # ignore long lines
            print(f"{i}: {line.strip()}")

print("--- main-style.css ---")
with open("main-style.css", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "action-sheet" in line.lower() or "section-title" in line.lower() or "✦" in line or "h2::after" in line.lower():
            if len(line) > 150: continue
            print(f"{i}: {line.strip()}")

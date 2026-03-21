import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
with open("main-app.js", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if 'на ' in line and 'дн' in line and '<button' in line:
            print(f"JS {i}: {line.strip()}")
            
with open("main-style.css", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if 'context' in line.lower() or 'sheet' in line.lower() or 'modal' in line.lower():
            if '{' in line: print(f"CSS {i}: {line.strip()}")

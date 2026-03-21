import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
with open("main-app.js", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if 'дней' in line.lower() or 'отложить' in line.lower() or 'menu' in line.lower() or 'sheet' in line.lower() or 'context' in line.lower() or 'bottom' in line.lower():
            if len(line.strip()) < 150: print(f"{i}: {line.strip()}")

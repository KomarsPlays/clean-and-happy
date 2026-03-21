import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
with open("main-style.css", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if 'extra-done' in line.lower() or 'overflow' in line.lower() or 'max-height' in line.lower():
            if len(line.strip()) < 150: print(f"{i}: {line.strip()}")

import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
with open("main-app.js", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if 'getPeriodicTasksForToday' in line:
            print(f"{i}: {line.strip()}")

import json

with open(r'C:\Users\shwet\.gemini\antigravity-ide\brain\6b875fb5-d17e-4f06-ab7f-52f3e3d56967\.system_generated\logs\transcript_full.jsonl', encoding='utf-8') as f, open('output4.txt', 'w', encoding='utf-8') as out:
    for line in f:
        if '"type":"USER_INPUT"' in line:
            data = json.loads(line)
            out.write(data.get('content', '') + '\n')

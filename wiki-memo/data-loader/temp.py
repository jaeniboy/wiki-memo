import json

with open('../src/wikimedia-commons-data-flat.json', encoding='utf-8') as f:
    d = json.load(f)


for item in d:
    item["subcategory"] = ""


with open('../src/wikimedia-commons-data-flat.json', 'w', encoding='utf8') as json_file:
    json.dump(d, json_file, ensure_ascii=False)
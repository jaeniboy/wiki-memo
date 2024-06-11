import json

with open('../src/wikimedia-commons-data-flat.json', encoding='utf-8') as f:
    d = json.load(f)


for item in d:
    # item["subcategory"] = ""
    item["category"] = [item["category"]]


with open('../src/wikimedia-commons-data-flat-2.json', 'w', encoding='utf8') as json_file:
    json.dump(d, json_file, ensure_ascii=False)
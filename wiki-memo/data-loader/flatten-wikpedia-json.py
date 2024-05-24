"""
Wandelt das verschachtelte JSON-Objekt in ein flaches 
Objekt um, indem Kategorie und Unterkategorie als Key-
Value-Pair hinzugefügt werden
"""

import json
import pprint

with open('../src/full-data-good-articles.json', encoding='utf-8') as f:
    d = json.load(f)

flat_obj = []

for cat in d:
    for subcat in cat["subcategories"]:
        for article in subcat["subcat_articles"]:

            print(str(article["id"]),article["title"])

            new_article = article
            new_article["link"] = "https://de.wikipedia.org" + article["link"]
            new_article["category"] = cat["category_title"]
            new_article["subcategory"] = subcat["subcat_title"]

            flat_obj.append(new_article)

            # print(article["title"])
            # print(subcat["subcat_title"])
            # print(cat["category_title"])

#pprint.pp(flat_obj)

with open('../src/wikipedia-data-flat.json', 'w', encoding='utf8') as json_file:
    json.dump(flat_obj, json_file, ensure_ascii=False)
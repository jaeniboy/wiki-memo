import requests
from bs4 import BeautifulSoup
import json

# URL der Wikipedia-Seite
url = "https://de.wikipedia.org/wiki/Wikipedia:Lesenswerte_Artikel"

# HTML-Inhalt der Seite herunterladen
response = requests.get(url)
html_content = response.content

# HTML-Inhalt mit BeautifulSoup analysieren
soup = BeautifulSoup(html_content, "html.parser")

# Seitentitel extrahieren
# title = soup.find("h1", {"class": "firstHeading"}).text.strip()
# print("Seitentitel:", title)

data = []

# Hauptkategorien finden
categories = soup.findAll("span", {"class": "mw-headline"})

for i, category in enumerate(categories):
    # print(category.text.strip())

    # Unterkategorien und zugeordnete Links finden
    cat_table = category.parent.parent.parent.parent.parent.findNext("table")
    subcats_p = cat_table.findAll("p")
    subcats = []

    for j, subcat_p in enumerate(subcats_p):
        subcat_obj = {}
        subcat_obj["id"] = j+1
        subcat_obj["subcat_title"] = subcat_p.find("b").text.strip()[:-1]
        subcat_link_tags = subcat_p.findAll("a")
        subcat_obj["subcat_articles"] = [{"id": k+1, "link":tag["href"],"title":tag.text.strip()} for k, tag in enumerate(subcat_link_tags)]

        subcats.append(subcat_obj)
        # print(subcat_obj)

    cat_obj = {
        "id": i+1,
        "category-title": category.text.strip(),
        "subcategories": subcats
    }

    data.append(cat_obj)

#print(json.dumps(data, indent=4))

with open('data.json', 'w', encoding='utf8') as json_file:
    json.dump(data, json_file, ensure_ascii=False)






# Ersten Absatz extrahieren
# first_paragraph = soup.find("div", {"class": "mw-parser-output"}).find("p").text.strip()
# print("Erster Absatz:", first_paragraph)
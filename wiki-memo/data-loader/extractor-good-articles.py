import requests
from bs4 import BeautifulSoup
import json

# URL der Wikipedia-Seite
url = "https://de.wikipedia.org/wiki/Wikipedia:Lesenswerte_Artikel"

# HTML-Inhalt der Seite herunterladen
response = requests.get(url)
html_content = response.content
soup = BeautifulSoup(html_content, "html.parser")

data = []

# Hauptkategorien finden
categories = soup.findAll("span", {"class": "mw-headline"})

subcat_increment = 1
article_increment = 1

for i, category in enumerate(categories):

    # Unterkategorien und zugeordnete Links finden
    cat_table = category.parent.parent.parent.parent.parent.findNext("table")
    subcats_p = cat_table.findAll("p")
    subcats = []

    for j, subcat_p in enumerate(subcats_p):
        subcat_obj = {}
        subcat_obj["id"] = subcat_increment
        subcat_obj["subcat_title"] = subcat_p.find("b").text.strip()[:-1]
        subcat_link_tags = subcat_p.findAll("a")
        subcat_obj["subcat_articles"] = [{"id": article_increment+k, "link":tag["href"],"title":tag.text.strip()} for k, tag in enumerate(subcat_link_tags) if tag.text.strip() != ""]
        subcats.append(subcat_obj)
        subcat_increment = subcat_increment + 1
        article_increment = article_increment + len(subcat_obj["subcat_articles"])

    cat_obj = {
        "id": i+1,
        "category-title": category.text.strip(),
        "subcategories": subcats
    }

    data.append(cat_obj)

with open('first-data-good-articles.json', 'w', encoding='utf8') as json_file:
    json.dump(data, json_file, ensure_ascii=False)
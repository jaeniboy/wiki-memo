import requests
import json
from bs4 import BeautifulSoup
from urllib.parse import unquote
from collections import Counter
import pprint

url = "https://de.wikipedia.org/wiki/Wikipedia:Exzellente_Artikel"
response = requests.get(url)
html = response.text
soup = BeautifulSoup(html, "html.parser")

first_table = soup.find("table")
more_tables = first_table.find_all("table")
categories = []
category_tables = []
article_objects = []
unwanted_categories = [
    "Sonstige",
    "Sonstige Einzelbauten",
    "Weitere Religionen",
    "Andere Sportartikel"
]

# seperate headlines from content tables
for table in more_tables[2:]:
    if table.find("h3") != None:
        h3 = table.find("h3").getText()
        categories.append(h3)
    else:
        category_tables.append(table)

object_id = 1
for index, category in enumerate(categories):
    # print("----")
    print(category)
    subcategories = category_tables[index].find_all("p")
    for subcategory in subcategories:
        subcat_name = subcategory.find("b").getText()[:-1].strip()
        subcat_links = ["https://de.wikipedia.org" + a["href"] for a in subcategory.find_all("a", href=True)]
        # print("--", subcat_name)
        for link in subcat_links:
            if "/Datei:" not in link:
                article_object = {"id": object_id, "link":link}
                if len(subcat_links) < 12 or subcat_name in unwanted_categories:
                    article_object["category"] = [category]
                else:
                    article_object["category"] = [category, subcat_name]
                article_objects.append(article_object)
                object_id += 1

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

chunks = list(chunks(article_objects, 20))
licenses = []
for i,chunk in enumerate(chunks):
    print(f"chunk {str(i)} of {str(len(chunks))}")
    # get articles data
    article_names = [unquote(o["link"].split("wiki/")[1]) for o in chunk]
    names_joined = "|".join(article_names)

    params = {
        "action": "query",
        "prop": "extracts|info|pageimages",
        "exintro": True,
        "explaintext": True,
        "inprop": "url",
        "pithumbsize": "500",
        "titles": names_joined,
        "format":"json"
    }

    result = requests.get("https://de.wikipedia.org/w/api.php",params)
    # print(result.url)
    data = result.json()
    pages = data["query"]["pages"]
    #print(data.values())
    for article in chunk:
        for page in pages: 
            try:
                if article["link"] == data["query"]["pages"][page]["fullurl"]:
                    page_data = data["query"]["pages"][page]
                    article["title"] = page_data["title"]
                    article["summary"] = page_data["extract"]
                    try:
                        article["pageimage"] = "File:" + page_data["pageimage"]
                    except:
                        article["pageimage"] = ""
            except:
                pass
        #print(json.dumps(article, indent=4, ensure_ascii=False))
    
    # images query
    pageimages = [obj["pageimage"] for obj in chunk]
    iq_titles = "|".join(pageimages)

    iq_params = {
        "action":"query",
        "prop":"globalusage|imageinfo",
        "gusite":"dewiki",
        "guprop":"url|namespace|pageid",
        "gunamespace":"0",
        "iiprop":"user|extmetadata|url",
        "iiurlwidth": "500",
        "titles": iq_titles,
        "format":"json"
    }

    iq_result = requests.get("https://www.mediawiki.org/w/api.php?", iq_params)
    # print(iq_result.url)
    iq_data = iq_result.json()
    iq_pages = iq_data["query"]["pages"]

    for article in chunk:
        for page in iq_pages:
            if article["pageimage"].replace("_"," ") == iq_pages[page]["title"]:
                #print("match")
                #print(article["pageimage"])
                try:
                    article["img_artist"] = iq_pages[page]["imageinfo"][0]["user"]
                    article["img_info_url"] = iq_pages[page]["imageinfo"][0]["descriptionurl"]
                    article["img_url"] = iq_pages[page]["imageinfo"][0]["thumburl"]
                    article["img_license"] = iq_pages[page]["imageinfo"][0]["extmetadata"]["LicenseShortName"]["value"]
                    try:
                        article["img_license_link"] = iq_pages[page]["imageinfo"][0]["extmetadata"]["LicenseUrl"]["value"]
                    except:
                        article["img_license_link"] = ""
                    licenses.append(iq_pages[page]["imageinfo"][0]["extmetadata"]["LicenseShortName"]["value"])
                except:
                    pass
        #print(json.dumps(article, indent=4, ensure_ascii=False))
    # print(pageimages)
    #print(iq_result.url)

#pprint.pprint(Counter(licenses))

# filter licenses: ODbL, GODL-India, PDM-owner
all_articles = []
for chunk in chunks:
    all_articles += chunk

# drop unwanted licenses and missing imgage urls
unwanted_licenses = ["ODbL","GODL-India","PDM-owner"]
all_articles = [a for a in all_articles if "img_url" in a]
all_articles = [a for a in all_articles if a["img_license"] not in unwanted_licenses]
#print(all_articles)

with open('../src/excellent-articles-flat.json', 'w', encoding='utf8') as json_file:
    json.dump(all_articles, json_file, ensure_ascii=False)

print("fertig")


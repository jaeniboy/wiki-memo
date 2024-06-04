import requests
import json

url = "https://de.wikipedia.org/w/api.php"

catnames = [
    "Kategorie:Gemälde_(19._Jahrhundert)",
    "Kategorie:Gemälde_(18._Jahrhundert)",
    "Kategorie:Gemälde_(17._Jahrhundert)",
    "Kategorie:Gemälde_(16._Jahrhundert)",
    "Kategorie:Gemälde_(15._Jahrhundert)"
]

params = {
    "action": "query",
    "cmtitle": "",
    "cmlimit": "500",
    "cmtype": "page",
    "cmnamespace": "0",
    "list": "categorymembers",
    "format": "json",
    "cmcontinue":""
}

pages = []

for catname in catnames:
    params["cmtitle"] = catname
    params["cmcontinue"] = ""
    while True:
        result = requests.get(url=url, params=params)
        data = result.json()
        new_pages = data["query"]["categorymembers"]
        for p in new_pages:
            p["category"] = catname.split("(")[1].replace("_"," ")[:-1]
        pages = pages + new_pages
        if "continue" not in data:
            break
        params["cmcontinue"] = data["continue"]["cmcontinue"]

print(len(pages))


# https://de.wikipedia.org/w/api.php?action=query&prop=extracts|info|pageimages&exintro&explaintext&inprop=url&pithumbsize=500&pageids=4603713|3696433|3070230

# split pages into chunks of 50 due to rate limit

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

chunks = list(chunks(pages, 50))
# print(chunks[0])
#page_ids = [str(page["pageid"]) for page in chunks[0]]
# print(page_ids)
params = {
    "action": "query",
    "prop": "extracts|info|pageimages",
    "exintro": True,
    "explaintext": True,
    "inprop": "url",
    "pithumbsize": "500",
    #"pageids": "|".join(page_ids),
    "format":"json"
}

objects = []

for index, chunk in enumerate(chunks):
    print("--- --- --- ---")
    print("loading chunk",str(index))
    page_ids = [str(page["pageid"]) for page in chunk]
    params["pageids"] = "|".join(page_ids)

    response = requests.get(url, params)
    print(response.url)
    print("")
    data = response.json()["query"]["pages"]

    for page in chunk:
        page_id = str(page["pageid"])
        if "pageimage" in data[page_id] and "extract" in data[page_id] and data[page_id]["title"][:5] != "Liste":
            o = {
                "id": page["pageid"],
                "title": page["title"],
                "category": page["category"],
                "subcategory": "",
                "summary": data[page_id]["extract"],
                "img_info_url": "https://commons.wikimedia.org/wiki/File:" + data[page_id]["pageimage"],
                "img_artist":"",
                "img_url": data[page_id]["thumbnail"]["source"],
                "img_license": "",
                "img_license_link": "",
                "link": data[page_id]["fullurl"]
            }
            objects.append(o)

print(json.dumps(objects, indent=4))

print("")
print("Length", len(objects))

with open('../src/wikipedia-paintings-flat.json', 'w', encoding='utf8') as json_file:
    json.dump(objects, json_file, ensure_ascii=False)
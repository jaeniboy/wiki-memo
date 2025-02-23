import json
import requests
from bs4 import BeautifulSoup as bs
from tqdm import tqdm

domain = "https://commons.wikimedia.org"

pages = [
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Arthropods/Arachnida"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Arthropods/Diptera"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Arthropods/Hymenoptera"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Arthropods/Lepidoptera"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Arthropods/Odonata"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Arthropods"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Fish"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Amphibians"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Reptiles"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Birds"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Birds/Accipitriformes"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Birds/Anseriformes"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Birds/Charadriiformes"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Birds/Passeriformes"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Birds/Pelecaniformes"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Mammals"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Mammals/Artiodactyla"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals/Mammals/Carnivora"],
    ["Tiere","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Animals"],
    ["Naturphänomene", "https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Natural_phenomena"],
    ["Astronomie","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Astronomy"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Agriculture"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Architecture/Exteriors"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Architecture/Bridges"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Architecture/Castles_and_fortifications"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Architecture/Cityscapes"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Industry"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Interiors"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Natural"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Architecture/Religious_buildings"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Interiors/Religious_buildings"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Interiors/Religious_buildings/Ceilings"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Satellite_images"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Architecture/Towers"],
    ["Orte","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Places/Architecture/Transport"],
    ["Pflanzen","https://commons.wikimedia.org/wiki/Commons:Featured_pictures/Plants"]
]

def get_commons_data(link, id, category):
    title = link.split("/")[-1]
    api_call="https://www.mediawiki.org/w/api.php?action=query&prop=globalusage|imageinfo&gusite=dewiki&guprop=url|namespace|pageid&gunamespace=0&iiprop=user|extmetadata|url&iiurlwidth=500&titles=" + title + "&format=json"
    json_text = requests.get(api_call).text
    data = json.loads(json_text)
    general = data["query"]["pages"]["-1"]
    # check if img is used in german wikipedia article
    if len(general["globalusage"]) > 0:
        obj = {"id": id, "img_info_url": link, "category": [category]}
        wp_page_id = general["globalusage"][0]["pageid"]
        imageinfo = general["imageinfo"][0]
        obj["img_artist"] = imageinfo["user"]
        img_url = imageinfo["thumburl"]
        obj["img_url"] = img_url
        obj["img_license"] = imageinfo["extmetadata"]["LicenseShortName"]["value"]
        try:
            obj["img_license_link"] = imageinfo["extmetadata"]["LicenseUrl"]["value"]
        except:
            obj["img_license_link"] = ""

        # wikipedia data call
        wp_api_call = "https://de.m.wikipedia.org/w/api.php?action=query&prop=extracts|info&inprop=url&exintro&explaintext&pageids=" + wp_page_id + "&format=json"
        wp_json_text = requests.get(wp_api_call).text
        wp_data = json.loads(wp_json_text)
        wp_general = wp_data["query"]["pages"].popitem()[1]
        obj["title"] = wp_general["title"]
        obj["summary"] = wp_general["extract"]
        obj["link"] = wp_general["fullurl"]
        # obj["subcategory"] = ""

        return obj

all_links = []

for page in pages:
    print("Scraping", page[1])
    html = requests.get(page[1]).content
    soup = bs(html, "html.parser")
    link_tags = soup.find_all("a", href=True)
    links = [[page[0], domain + tag["href"]] for tag in link_tags if "/wiki/File:" in tag["href"] and ".jpg" in tag["href"]]
    all_links = all_links + links


all_objects = []
obj_id = 1
for index, link in tqdm(enumerate(all_links[4350:4400])):
    #print("------------")
    #print(str(index),"of",str(len(all_links)),"Fetching data for", link[1])
    try:
        data_dict = get_commons_data(link[1], obj_id, link[0])
        all_objects.append(data_dict)
        obj_id += 1
    except:
        pass
    # if data_dict:

#print(json.dumps(all_objects, indent=4))

with open('../src/wikimedia-commons-data-flat-2.json', 'w', encoding='utf8') as json_file:
    json.dump(all_objects, json_file, ensure_ascii=False)


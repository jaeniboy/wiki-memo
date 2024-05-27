import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import json

# URL der Wikipedia-Seite
base_url = "https://sammlung.staedelmuseum.de/de/suche?flags=downloadable&p="
page_num = 1

# Start Selenium 
options = Options()
options.add_argument("--headless=new")
driver = webdriver.Chrome(options=options)

# get all links and thumbnails
data = []
while True:

    print("get content of page",str(page_num))

    driver.get(base_url + str(page_num))
    html_content = driver.page_source
    # print(html_content)
    soup = BeautifulSoup(html_content, "html.parser")

    # get all links
    search_results = soup.find("div",{"class": "dsSearchResults"})
    list_items = search_results.find_all("li")

    if len(list_items) == 0:
    #if page_num == 2:
        print("finished")
        break

    for item in list_items:
        try:
            link = item.find("a")["href"]
            img_url = "https://sammlung.staedelmuseum.de" + item.find("img")["data-srcset"].split(",")[-1].split(" ")[0]
            obj = {"link": link, "img_url": img_url}
            data.append(obj)
        except:
            pass
        # print(img_url)
        # print(img_url)
        # obj = {
        #     "link": link,
        #     "img_url": img_url
        # }
        # data.append(obj)

    page_num = page_num + 1

#print(data)

for i, obj in enumerate(data):

    print(obj["link"])
    response = requests.get(obj["link"])
    html_content = response.content
    soup = BeautifulSoup(html_content, "html.parser")

    obj["id"] = i
    try:
        obj["title"] = soup.find("span", {"class":"dsArtwork__titleCreatorName"}).getText() + " - " + soup.find("span",{"class":"dsArtwork__titleCaption"}).getText()
    except:
        obj["title"] = "No title"
    try:
        obj["summary"] = soup.find("dt", string="Material und Technik").parent.find("dd").getText()
    except:
        obj["summary"] = ""
    try:
        obj["category"] = soup.find("dt",string="Entstehungszeit").parent.find("a").getText()
    except:
        obj["category"] = ""
    try:
        obj["subcategory"] = soup.find("dt",string="Stilrichtung").parent.find("a").getText()
    except:
        obj["subcategory"] = ""

    print(json.dumps(obj, indent=4))

#print(data)

with open('../src/staedel-data-flat.json', 'w', encoding='utf8') as json_file:
    json.dump(data, json_file, ensure_ascii=False)

#print(data[0])

# for link, i in all_links.enumerate():

#     print("scraping id",str(i),":",link)

#     response = requests.get(link)
#     html_content = response.content
#     soup = BeautifulSoup(html_content, "html.parser")

#     obj = {
#         "id": i+1,
#         "link": link, 
#         "img_url": 
#     }
    # id
    # link
    # img_url
    # title
    # description
    # category
    # subcategory

#print(search_results)
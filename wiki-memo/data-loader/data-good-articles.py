import json
import requests

headers={"user-agent":"janseipel", "from":"janfseipel@gmail.com"}

def get_img_url(article_name):
    img_api_call = "https://de.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=500&format=json&titles="
    response = requests.get(img_api_call + article_name, headers=headers)
    js = json.loads(response.text)
    img_url = js["query"]["pages"].popitem()[1]["thumbnail"]["source"]
    return img_url

def get_article_summary(article_name):
    img_api_call = "https://de.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles="
    response = requests.get(img_api_call + article_name, headers=headers)
    js = json.loads(response.text)
    extract = js["query"]["pages"].popitem()[1]["extract"]
    return extract

def get_article_data(link):
    article_name = link.split("/")[2]
    try:
        img_url = get_img_url(article_name)
    except:
        img_url = ""
    try:
        article_summary = get_article_summary(article_name)
    except:
        article_summary = "No summary available"
    return article_summary, img_url

with open('first-data-good-articles.json', encoding='utf-8') as f:
    d = json.load(f)

articles = d[0]["subcategories"][0]["subcat_articles"]

for num_cat, category in enumerate(d):

    print(num_cat, "of", len(d), "-",category["category_title"])
    subcats = category["subcategories"]

    for num_subcat, subcat in enumerate(subcats):
        print("----",num_subcat, "of", len(subcats),"-",subcat["subcat_title"])
        articles = subcat["subcat_articles"]

        for article in articles:
            print("----","----",article["title"])
            try:
                article["summary"], article["img_url"] = get_article_data(article["link"])
            except:
                pass

with open('../src/full-data-good-articles_2.json', 'w', encoding='utf8') as json_file:
    json.dump(d, json_file, ensure_ascii=False)


    
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import undetected_chromedriver as uc
#from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

# Set up Selenium driver
#service = Service(ChromeDriverManager().install())
options = uc.ChromeOptions() 
#options.headless = True
options.add_argument("start-maximized")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)
driver = uc.Chrome()

# Base URL and pagination pattern
base_url = "https://rateyourmusic.com/charts/top/album/all-time/p"
page_num = 1

# List to store extracted data
data = []

#while True:
# Construct URL with page number
url = f"{base_url}/{page_num}"
driver.get(url)
time.sleep(100)

# Parse HTML with BeautifulSoup
soup = BeautifulSoup(driver.page_source, 'html.parser')

# Find all divs with the specified class
divs = soup.find_all('div', class_='page_charts_section_charts_item object_release')

# If no divs found, break the loop
# if not divs:
#     break

# Extract data from each div
for div in divs:
    # Extract relevant information from the div
    # (modify this part based on your specific requirements)
    title = div.find('a').text.strip()
    artist = div.find('span', class_='artist').text.strip()
    data.append({'title': title, 'artist': artist})

    # Move to the next page
    #page_num += 1

# Close the Selenium driver
#driver.quit()

# Print the extracted data
for item in data:
    print(item)


# container page_charts_section_charts_item 

# id            increment
# link          page_charts_section_charts_item_link 
# title         page_charts_section_charts_item_link  + artist
# summary       page_charts_section_charts_item_genre_descriptors
# img_url       img.src
# category      page_charts_section_charts_item_genres_primary (first item)
# subcategory   page_charts_section_charts_item_genres_secondary (first item)
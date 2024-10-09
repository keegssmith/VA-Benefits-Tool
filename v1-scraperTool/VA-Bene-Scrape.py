import requests
from bs4 import BeautifulSoup

# URL of the website
url = "https://dmv.colorado.gov/license-plates-military"

#User Disability Rating
userDisRating = 50
maleOrFemale = 'm'

# Make a request to the website
response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

# Find all paragraphs
disabled_women_veteran_section = soup.find_all('dt', string="Disabled Women Veteran")
disabled_veteran_section = soup.find_all('dt', string="Disabled Veteran")
who_qualifies_sections = soup.find_all('p')
flag1 = 'temp'
qualified = False

for section in who_qualifies_sections:
    if '50% or more Permanent Service-Connected Disabled.' in section.get_text() and maleOrFemale == 'm' and userDisRating >= 50:
        qualified = True
        flag1 = 'Disabled Veteran License Plate'
        break
    elif 'A Woman veteran of the United States Armed Forces who can demonstrate being 50%' in section.get_text() and maleOrFemale == 'f' and userDisRating >= 50:
        qualified = True
        flag1 = 'Disabled Women Veteran License Plate'
        break

if qualified:
    print(f"You Qualify for {flag1}")

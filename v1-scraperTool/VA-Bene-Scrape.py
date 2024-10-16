import requests
from bs4 import BeautifulSoup

# URL of the website
urlAuto = "https://dmv.colorado.gov/license-plates-military"
urlHome = "https://www.va.gov/housing-assistance/home-loans/eligibility/"

#User Disability Rating
userDisRating = 40
maleOrFemale = 'm'
daysOfService = 40

# Make a request to the website
response = requests.get(urlAuto)
response2 = requests.get(urlHome)

soupAuto = BeautifulSoup(response.content, "html.parser")
soupHome = BeautifulSoup(response2.content, "html.parser")


# Find all paragraphs
coElgibility = soupHome.find_all('p')
who_qualifies_sections = soupAuto.find_all('p')
flag1 = 'nothing.'
qualified = False

for section in who_qualifies_sections:
    if 'or more Permanent Service-Connected Disabled.' in section.get_text() and maleOrFemale == 'm' and userDisRating >= 50:
        qualified = True
        flag1 = 'Disabled Veteran License Plate'
        for section in coElgibility:
            if 'If you\'ve served for at least' and daysOfService >= 90:
                flag1 =  'Disabled Veteran License Plate and VA Home Loan COE Eligible.' 
                break
            else:
                break
    elif 'A Woman veteran of the United States Armed Forces who can demonstrate being' in section.get_text() and maleOrFemale == 'f' and userDisRating >= 50:
        qualified = True
        flag1 = 'Disabled Woman Veteran License Plate'
        for section in coElgibility:
            if 'If you\'ve served for at least' and daysOfService >= 90:
                flag1 =  'Disabled Veteran License Plate and VA Home Loan COE Eligible.' 
                break
            else:
                break
if qualified:
    print(f"You Qualify for {flag1}")

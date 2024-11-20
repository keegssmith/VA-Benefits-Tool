import requests
from bs4 import BeautifulSoup
import os

# URLs of the websites
url_auto = "https://dmv.colorado.gov/license-plates-military"
url_home = "https://www.va.gov/housing-assistance/home-loans/eligibility/"

# Eligibility criteria
eligibility_requirements = {
    "Disabled Veteran License Plate": {
        "criteria": ["Permanent Service-Connected Disabled"],
        "disability_rating": 50,
        "gender": "m"
    },
    "Disabled Woman Veteran License Plate": {
        "criteria": ["Woman veteran of the United States Armed Forces"],
        "disability_rating": 50,
        "gender": "f"
    },
    "VA Home Loan COE Eligible": {
        "criteria": ["If you've served for at least"],
        "days_of_service": 90
    }
}

# Functions to check eligibility
def check_license_plate_eligibility(sections, user_disability_rating, gender):
    for name, requirement in eligibility_requirements.items():
        if "criteria" in requirement:
            for criterion in requirement["criteria"]:
                for section in sections:
                    if criterion in section.get_text():
                        if user_disability_rating >= requirement.get("disability_rating", 0) and gender == requirement.get("gender"):
                            return name
    return None

def check_home_loan_eligibility(sections, days_of_service):
    for name, requirement in eligibility_requirements.items():
        if "days_of_service" in requirement:
            for criterion in requirement["criteria"]:
                for section in sections:
                    if criterion in section.get_text() and days_of_service >= requirement["days_of_service"]:
                        return name
    return None

response_auto = requests.get(url_auto)
response_home = requests.get(url_home)

# Parse content
soup_auto = BeautifulSoup(response_auto.content, "html.parser")
soup_home = BeautifulSoup(response_home.content, "html.parser")

# Find relevant sections
auto_sections = soup_auto.find_all('p')
home_sections = soup_home.find_all('p')

base_directory = 'Colorado'
for user_disability_rating in range(0, 110, 10):
    folder_path = os.path.join(base_directory, str(user_disability_rating))
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, f"{user_disability_rating}.txt")

    gender = 'm'
    days_of_service=90

    license_plate = check_license_plate_eligibility(auto_sections, user_disability_rating, gender)
    home_loan = check_home_loan_eligibility(home_sections, days_of_service)
    
    # Prepare message based on eligibility
    if license_plate and home_loan:
        message = f"{user_disability_rating}: You qualify for {license_plate}, VA Home Loan COE Eligible & for a Colorado EPIC Pass at Retirement Rate."
    elif license_plate:
        message = f"{user_disability_rating}: You qualify for {license_plate} & for a Colorado EPIC Pass at Retirement Rate."
    elif home_loan:
        message = f"{user_disability_rating}: You qualify for VA Home Loan COE Eligible."
    elif user_disability_rating >= 10:
         message = f"{user_disability_rating}: You qualify for Colorado EPIC Pass at Retirement Rate."
    else:
        message = f"{user_disability_rating}: You do not qualify for any listed benefits."
    
    # Write message to file
    with open(file_path, 'w') as f:
        f.write(message)


# VA-Benefits-Tool

## Project Overview

The **VA-Benefits-Tool** is a platform designed to simplify the process of determining veteran benefits based on state and disability ratings. It combines a web interface, a database-backed backend, and a scraping tool to consolidate relevant benefits information, making it easier for veterans to access the resources they qualify for.

---

## Features

1. **Dynamic Web Interface**: Allows users to select their state and disability rating to receive benefit information.
2. **Backend Automation**: Dynamically populates the database with state and disability-specific data from text files.
3. **Scraping Tool**: Gathers additional benefit data from relevant government websites.
4. **Validation Logic**: Ensures that users provide valid inputs for accurate results.



## Installation Instructions

### Prerequisites

-**Integrated Development Enviroment**
  -This was run using Visual Code 2024.

- **Operating System**: Tested on:
  - Ubuntu 20.04 LTS
  - Windows 10/11
  - macOS 11 (Big Sur) or newer

- **Python**: Version 3.7 or higher is required.

- **Hardware Recommendations**:
  - GPU: NVIDIA GPU with CUDA support (e.g., GTX 1060 or better) for faster NLP processing.
  - RAM: At least 8GB (16GB recommended).
  - Disk Space: 5GB free for model files and datasets.


### Steps to Install

1. **Clone the Repository**
   ```bash
   git clone https://github.com/febreezie/VA-Benefits-Tool
   cd VA-Benefits-Tool

2. **Required Python Libraries**
   Install the following libraries:
   ```bash
   pip install requests beautifulsoup4

3. **Run the Database**

  
   Install SQL Server 2022
      Follow the link for installation:
      https://go.microsoft.com/fwlink/p/?linkid=2215158&clcid=0x409&culture=en-us&country=us 

      After the "Installation has completed successfully!"
      Hit Close


   Install Microsoft SQL on VSCode

   Run either display.sql or updatedb.sql 

   Click on create connection profile at the top seach bar

   When asked for server name input the following:

   ```bash
   localhost
   ```

   Skip Database name by pressing Enter.

   When prompted for Authentication Type input the following:
   
  ```bash

   Select Integrated

   ```

   For profile name enter:

   ```bash

   benefitsdb

   ```
   Click on createtable.sql
   Run createtable.sql

   Click on updatedb.sql
       On line 27 enter in your local path to the States Directory
       ```bash
       
       Windows: 
       C:\Path\To\File\VA-Benefits-Tool\States\

       Mac: 
       

       ```








   
  
  









4. **Run the HTML file locally**
  Install the Live Server Extension (VS Code) by Ritwick Dey

  Right-click the main.html and select "Open with Live Server"

  
3. 

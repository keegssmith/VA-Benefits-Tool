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

3. 
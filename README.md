<div align="center">

# Eyotek Scraper API
**An unofficial Node.js API to scrape and extract data from the Eyotek School Management System.**

[![Latest Version](https://img.shields.io/github/v/release/ardkinci/eyotek-scrapper?display_name=tag&sort=semver&color=blue&label=version)](https://github.com/ardkinci/eyotek-scrapper/releases)
[![Release Downloads](https://img.shields.io/github/downloads/ardkinci/eyotek-scrapper/total?color=success&label=downloads)](https://github.com/ardkinci/eyotek-scrapper/releases)
[![Last Commit](https://img.shields.io/github/last-commit/ardkinci/eyotek-scrapper?color=orange&label=last%20commit)](https://github.com/ardkinci/eyotek-scrapper/commits/main)

</div>
<br>
Since Eyotek does not provide a public API, this project uses DOM scraping techniques via Puppeteer to fetch data (Schedules, Homework, Lunch Menus) from the system and serve it as structured JSON responses. It also supports exporting schedules directly to `.ics` format for calendar integration!

> [!CAUTION]
> **Disclaimer:** This is an **unofficial** project and is not affiliated with, maintained, authorized, endorsed, or sponsored by Eyotek or any of its affiliates. This tool was created for educational purposes. Web scraping may be against the Terms of Service of some platforms. Use it at your own risk.

## ✨ Features

- **DOM Scraping:** Extracts data directly from Eyotek's HTML structure.
- **RESTful API:** Serves the scraped data through dedicated endpoints.
- **Calendar Integration:** Export your weekly schedule directly as an `.ics` file.
- **Smart Authentication:** Supports both `auto` and `manual` login modes to bypass Cloudflare Turnstile protections.
- **API Key Protection**: Secure your API endpoints with a simple and effective API key authentication.
- **Lightweight & Fast**: Optimized for running on low-resource devices.


## 📦 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ardkinci/eyotek-scrapper.git
   cd eyotek-scrapper
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Rename the example configuration file:
   ```bash
   mv config.js.example config.js
   ```

## ⚙️ Configuration

Open your newly created `config.js` file and fill in your details. Here is what each field means:

| Configuration Key | Description | Example / Allowed Values |
| :--- | :--- | :--- |
| `PORT` | The port your API will run on. | `3001` |
| `USE_API_KEY` | Choose whether or not the API Auth system will be active. | `true` or `false` |
| `API_KEY` | If you have enabled API Auth, enter the API Key here, which should be in the `x-api-key` header. The more complex it is, the more secure it will be. | `FkZNpN08O0s0OEWZALNrRsXtIHsi2WKFEoHpANX3uVf` *(example)* |
| `LOGIN_MODE` | Determines how the scraper logs in. Use `manual` if you get stuck at Cloudflare Turnstile. | `auto` or `manual` |
| `USERNAME` | Your Eyotek username/student ID. | `1234` *(example)* |
| `PASSWORD` | Your Eyotek password. | `P@ssw0rd!` *(example)* |
| `eyotek_url` | The specific subdomain for your school's Eyotek portal. | `xyz.eyotek.com` *(example)* |
| `PUPPETEER_EXECUTABLE_PATH` | Path to your Chrome/Chromium executable. | `/usr/bin/chromium` |
| `COOKIES_PATH` | Where the session cookies will be saved. | `./cookies.json` |
| `EYOTEK_DATE_FORMAT` | The date format used by your school's Eyotek system. | `DD.MM.YYYY` |

## 🔑 First Run & Authentication

Eyotek uses Cloudflare Turnstile, which sometimes blocks automated logins. 

When you run the API for the **first time**, the system will detect that there are no saved cookies. A browser window will open.
- If `LOGIN_MODE` is set to `auto`, the script will try to log in automatically.
- If it gets blocked by Turnstile, or if you set `LOGIN_MODE` to `manual`, you can manually solve the captcha and log in.

Once logged in, the system will save your session to `cookies.json`. Subsequent requests will use these cookies headlessly without needing to log in again.

---

## 📡 API Endpoints

Once the server is running (default: `http://localhost:3001`), you can access the following endpoints:

### 1. Schedule
Fetches the weekly class schedule.

* **URL:** `GET /api/scrape/ders-programi`
* **JSON Response Example:**
  ```json
  {
    "success": true,
    "data": {
      "pazartesi": {
        "gunAdi": "Pazartesi",
        "dersler": {
          "1": {
            "saat": "09:10 09:50",
            "ders": "Math",
            "ogretmen": null,
            "sinif": null,
            "derslik": null
          }
        }
      }
    }
  }
  ```

> [!TIP]
> **Calendar Export:** You can fetch the schedule as an `.ics` file so you can easily import it into Google Calendar, Apple Calendar, or Outlook.
> **URL:** `GET /api/scrape/ders-programi/ics`

### 2. Homeworks
Fetches homework statistics and the full list of assignments.

* **URL:** `GET /api/scrape/odevler`
* **JSON Response Example:**
  ```json
  {
    "success": true,
    "data": {
      "istatistik":[
        { "Status": "Not Attended", "Count": 2 },
        { "Status": "Completed", "Count": 2 }
      ],
      "liste":[
        {
          "tur": "Homework",
          "ders": "Math",
          "konu": "Division",
          "aciklama": "Complete Test 5 from the book.",
          "verilisTarihi": "2026-04-30",
          "kontrolTarihi": "2026-05-04",
          "ogretmen": "John Doe",
          "durum": "Done"
        }
      ]
    }
  }
  ```

### 3. Lunch Menu
Fetches the lunch menu. By default, it fetches today's menu, but you can specify a date.

* **URL:** `GET /api/scrape/yemek`
* **Query Parameters:** `?date=YYYY-MM-DD` *(optional)*
* **Example Request:** `GET /api/scrape/yemek?date=2026-05-02`
* **JSON Response Example:**
  ```json
  {
    "success": true,
    "data":[
      {
        "yemek": "Soup",
        "ogun": "Lunch"
      },
      {
        "yemek": "Chips",
        "ogun": "Lunch"
      }
    ]
  }
  ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
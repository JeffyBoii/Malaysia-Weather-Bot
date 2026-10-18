<div align="center">

  <h1>🇲🇾 Malaysia Weather Discord Bot</h1>
  <p><b>Accurate weather reports and hourly forecasts for Malaysia, right inside your Discord server.</b></p>

  <p>
    <img src="https://img.shields.io/badge/runtime-Node.js-green?style=flat-square&logo=node.js" alt="Node.js">
    <img src="https://img.shields.io/badge/library-Discord.js_v14-blue?style=flat-square&logo=discord" alt="Discord.js">
    <img src="https://img.shields.io/badge/API-Open--Meteo-orange?style=flat-square" alt="Open-Meteo">
    <img src="https://img.shields.io/badge/hosting-Railway-purple?style=flat-square&logo=railway" alt="Railway">
    <img src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square" alt="License">
  </p>

</div>

---

## ⚡ What is Malaysia Weather Bot?

A reliable, real-time weather bot built specifically for Malaysia. It fetches live meteorological data from the Open-Meteo API[cite: 3], automatically calculates Malaysia's timezone offset (`UTC+8`), and renders clean, colorful Discord Rich Embeds for all 13 states and federal territories.

Running **24/7** in the cloud[cite: 3], ensuring uninterrupted uptime for your community[cite: 3].

---

## 🎯 Features

### Weather Reports
* **Current Weather (`!weather [location]`)**: Fetches real-time temperature, apparent ("feels like") temperature, weather condition descriptions, wind speeds, and relative humidity[cite: 3].
* **12-Hour Forecast (`!hourly [location]`)**: Displays a consecutive 12-hour breakdown showing hour-by-hour temperature shifts, condition indicators, and rain/precipitation probabilities[cite: 3].
* **Interactive Help Menu (`!help`)**: Provides a structured command guide with usage examples[cite: 2, 3].

### Region Coverage
* Supports **all 13 Malaysian states and federal territories** (including Kuala Lumpur, Selangor, Johor, Penang, Sabah, Sarawak, and more) with smart fallback handling.

---

## 🕹️ Commands

| Command | Description | Example |
| :--- | :--- | :--- |
| `!help` | Displays the interactive help panel[cite: 2, 3] | `!help` |
| `!weather` | Get current weather conditions[cite: 3] | `!weather sabah`[cite: 2] |
| `!hourly` | Get the consecutive 12-hour forecast[cite: 3] | `!hourly selangor`[cite: 2] |

---

## 🚀 Built With

* **Runtime**: Node.js[cite: 3]
* **Framework**: Discord.js v14[cite: 3]
* **Data Provider**: Open-Meteo REST API[cite: 3]
* **HTTP Communication**: Axios[cite: 3]
* **Deployment**: Railway (Cloud Infrastructure)[cite: 3]

---

## 🛠️ Local Installation & Setup

If you want to run or test this project locally on your machine:

1. **Clone the repository**
   ```bash
   git clone [https://github.com/JeffyBoii/Malaysia-Weather-Bot.git](https://github.com/JeffyBoii/Malaysia-Weather-Bot.git)

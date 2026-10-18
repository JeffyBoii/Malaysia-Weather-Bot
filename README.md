<div align="center">

  <h1>🇲🇾 Malaysia Weather Discord Bot</h1>
  <p><b>Accurate weather reports and hourly forecasts for Malaysia, right inside your Discord server.</b></p>

</div>

---

## ⚡ What is Malaysia Weather Bot?

A reliable, real-time weather bot built specifically for Malaysia. It fetches live meteorological data from the [Open-Meteo API](https://open-meteo.com/), automatically calculates Malaysia's timezone offset (`UTC+8`), and renders clean, colorful Discord Rich Embeds for all 13 states and federal territories.

Running **24/7** in the cloud, ensuring uninterrupted uptime for your community.

---

## 🎯 Features

### Weather Reports
- **Current Weather (`!weather [location]`)**: Fetches real-time temperature, apparent ("feels like") temperature, weather condition descriptions, wind speeds, and relative humidity.
- **12-Hour Forecast (`!hourly [location]`)**: Displays a consecutive 12-hour breakdown showing hour-by-hour temperature shifts, condition indicators, and rain/precipitation probabilities.
- **Interactive Help Menu (`!help`)**: Provides a structured command guide with usage examples.

### Region Coverage
- Supports **all 13 Malaysian states and federal territories** (including Kuala Lumpur, Selangor, Johor, Penang, Sabah, Sarawak, and more) with smart fallback handling.

---

## 🕹️ Commands

| Command | Description | Example |
| :--- | :--- | :--- |
| `!help` | Displays the interactive help panel | `!help` |
| `!weather` | Get current weather conditions | `!weather sabah` |
| `!hourly` | Get the consecutive 12-hour forecast | `!hourly selangor` |

---

## 🚀 Built With

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Discord.js v14](https://discord.js.org/)
- **Data Provider**: [Open-Meteo REST API](https://open-meteo.com/)
- **HTTP Communication**: [Axios](https://axios-http.com/)
- **Deployment**: [Railway](https://railway.app/) (Cloud Infrastructure)

---

## 🛠️ Local Installation & Setup

If you want to run or test this project locally on your machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/JeffyBoii/Malaysia-Weather-Bot.git
   cd Malaysia-Weather-Bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create your Discord bot**
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**.
   - Open the **Bot** tab, click **Reset Token**, and copy your token.
   - On the same tab, enable **Message Content Intent** under *Privileged Gateway Intents*. This is required because the bot uses `!` prefix commands.
   - Open **OAuth2 → URL Generator**, select the `bot` scope, tick **Send Messages**, **Embed Links**, and **Read Message History**, then open the generated URL to invite the bot to your server.

4. **Configure environment variables**

   Create a `.env` file in the project root:
   ```env
   DISCORD_TOKEN=your-bot-token-here
   ```
   > ⚠️ Never commit your `.env` file or share your token. Make sure `.env` is listed in `.gitignore`.

5. **Run the bot**
   ```bash
   node index.js
   ```
   Once the bot logs in, try `!help` in your server.

---

## ☁️ Deployment (Railway)

1. Push your project to GitHub.
2. Create a new project on [Railway](https://railway.app/) and choose **Deploy from GitHub repo**.
3. Add `DISCORD_TOKEN` under the project's **Variables** tab.
4. Railway installs dependencies and keeps the bot running 24/7.

---

## 📄 License

Distributed under the MIT License.

---

## 🙏 Credits

- Weather data by [Open-Meteo](https://open-meteo.com/).
- Built by [JeffyBoii](https://github.com/JeffyBoii).
- Developed with AI assistance from Google Gemini. All code was reviewed and tested by the author.

require('dotenv').config();
const path = require('path');
const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const MALAYSIA_LOCATIONS = {
    // Federal Territories
    "kuala lumpur": { lat: 3.1390, lon: 101.6869, name: "Kuala Lumpur" },
    "putrajaya": { lat: 2.9264, lon: 101.6964, name: "Putrajaya" },
    "labuan": { lat: 5.2831, lon: 115.2308, name: "Labuan" },

    // Peninsular Malaysia States
    "johor bahru": { lat: 1.4927, lon: 103.7414, name: "Johor (Johor Bahru)" },
    "kedah": { lat: 6.1180, lon: 100.3685, name: "Kedah (Alor Setar)" },
    "kelantan": { lat: 6.1254, lon: 102.2381, name: "Kelantan (Kota Bharu)" },
    "melaka": { lat: 2.1896, lon: 102.2501, name: "Melaka" },
    "negeri sembilan": { lat: 2.7258, lon: 101.9424, name: "Negeri Sembilan (Seremban)" },
    "pahang": { lat: 3.8126, lon: 103.3256, name: "Pahang (Kuantan)" },
    "perak": { lat: 4.5975, lon: 101.0901, name: "Perak (Ipoh)" },
    "perlis": { lat: 6.4444, lon: 100.1985, name: "Perlis (Kangar)" },
    "penang": { lat: 5.4164, lon: 100.3301, name: "Penang (Georgetown)" },
    "selangor": { lat: 3.0738, lon: 101.5183, name: "Selangor (Shah Alam)" },
    "terengganu": { lat: 3.3331, lon: 103.3256, name: "Terengganu (Kuala Terengganu)" },

    // East Malaysia States
    "sabah": { lat: 5.9804, lon: 116.0735, name: "Sabah (Kota Kinabalu)" },
    "sarawak": { lat: 1.5533, lon: 110.3592, name: "Sarawak (Kuching)" },

    // Extra popular shortcuts
    "langkawi": { lat: 6.3500, lon: 99.8000, name: "Langkawi" }
};

// Common nicknames -> keys in MALAYSIA_LOCATIONS
const LOCATION_ALIASES = {
    "kl": "kuala lumpur",
    "johor": "johor bahru",
    "jb": "johor bahru",
    "malacca": "melaka",
    "georgetown": "penang",
    "pulau pinang": "penang",
    "ns": "negeri sembilan",
    "kuching": "sarawak",
    "kota kinabalu": "sabah",
    "kk": "sabah",
    "ipoh": "perak",
    "shah alam": "selangor",
    "kuantan": "pahang"
};

// Returns a location object, defaults to KL when no query is given, or null if invalid
function resolveLocation(query) {
    if (query === '') return MALAYSIA_LOCATIONS['kuala lumpur'];
    const key = LOCATION_ALIASES[query] || query;
    return MALAYSIA_LOCATIONS[key] || null;
}

client.once('ready', () => {
    console.log(`✅ Logged in successfully as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const content = message.content.trim().toLowerCase();

    // 1. Help Command: !help
    if (content === '!help') {
        const embed = new EmbedBuilder()
            .setColor(0xFFAA00)
            .setTitle('🇲🇾 Malaysia Weather Bot - Help Menu')
            .setDescription('Here are the available commands you can use:')
            .addFields(
                { name: '!weather [location]', value: 'Get current weather conditions. (e.g., `!weather penang`, `!weather sabah`, `!weather johor bahru`)' },
                { name: '!hourly [location]', value: 'Get the 12-hour consecutive forecast. (e.g., `!hourly selangor`)' },
                { name: '!ethan', value: 'Sends the Ethan picture.' },
                { name: '!help', value: 'Displays this help menu.' }
            )
            .setTimestamp()
            .setFooter({ text: 'Malaysia Weather Bot' });

        return message.reply({ embeds: [embed] });
    }

    // 2. Ethan Command: !ethan (sends ethan.png from the same folder as index.js)
    if (content === '!ethan') {
        try {
            const image = new AttachmentBuilder(path.join(__dirname, 'ethan.png'));
            return message.reply({ files: [image] });
        } catch (error) {
            console.error(error);
            return message.reply('⚠️ Could not send the image.');
        }
    }

    // 3. Current Weather Command: !weather [location]
    if (content.startsWith('!weather')) {
        const query = content.replace('!weather', '').trim();
        const location = resolveLocation(query);

        if (!location) {
            return message.reply('❌ **Invalid location!** Please choose a valid state, territory, or city in Malaysia (e.g., `!weather selangor`, `!weather penang`).');
        }

        try {
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia/Kuala_Lumpur`;

            // Fetch weather and haze together; if the haze call fails, the weather report still sends
            const [weatherResult, airResult] = await Promise.allSettled([
                axios.get(weatherUrl),
                fetchAirQuality(location)
            ]);

            if (weatherResult.status === 'rejected') throw weatherResult.reason;

            const current = weatherResult.value.data.current;
            const conditionText = getWeatherDescription(current.weather_code);

            const fields = [
                { name: '🌡️ Temperature', value: `${current.temperature_2m}°C (Feels like ${current.apparent_temperature}°C)`, inline: false },
                { name: '☁️ Condition', value: conditionText, inline: true },
                { name: '💧 Humidity', value: `${current.relative_humidity_2m}%`, inline: true },
                { name: '💨 Wind Speed', value: `${current.wind_speed_10m} km/h`, inline: true }
            ];

            if (airResult.status === 'fulfilled' && airResult.value.us_aqi != null) {
                const air = airResult.value;
                const aq = getAqiInfo(air.us_aqi);
                fields.push({
                    name: '😷 Haze Index (approx.)',
                    value: `${aq.emoji} **${air.us_aqi}** - ${aq.label}`,
                    inline: false
                });
            }

            const embed = new EmbedBuilder()
                .setColor(0x00AEFF)
                .setTitle(`🇲🇾 Current Weather Report: ${location.name}`)
                .addFields(fields)
                .setTimestamp()
                .setFooter({ text: 'Data provided by Open-Meteo / Malaysia Region' });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('⚠️ Failed to fetch current weather data.');
        }
    }

    // 4. Hourly Weather Command: !hourly [location]
    if (content.startsWith('!hourly')) {
        const query = content.replace('!hourly', '').trim();
        const location = resolveLocation(query);

        if (!location) {
            return message.reply('❌ **Invalid location!** Please choose a valid state, territory, or city in Malaysia (e.g., `!hourly selangor`, `!hourly penang`).');
        }

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&timezone=Asia/Kuala_Lumpur`;
            const response = await axios.get(url);
            const hourly = response.data.hourly;

            // Fixed timezone calculation for Malaysia (UTC+8)
            const currentHourIndex = (new Date().getUTCHours() + 8) % 24;
            let fields = [];

            for (let i = currentHourIndex; i < currentHourIndex + 12; i++) {
                const timeString = formatHourLabel(hourly.time[i]);
                const temp = hourly.temperature_2m[i];
                const rainProb = hourly.precipitation_probability[i];
                const condition = getWeatherDescription(hourly.weather_code[i]);

                fields.push({
                    name: `⏰ ${timeString}`,
                    value: `**${temp}°C** | ${condition}\n💧 Rain: **${rainProb}%**`,
                    inline: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor(0x00FFA3)
                .setTitle(`⏰ 12-Hour Forecast: ${location.name}`)
                .setDescription(`Consecutive hourly breakdown for Malaysia.`)
                .addFields(fields)
                .setTimestamp()
                .setFooter({ text: 'Malaysia Hourly Weather Bot' });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('⚠️ Failed to fetch hourly forecast data.');
        }
    }
});

// Fetches current air quality (haze) data from Open-Meteo's Air Quality API
async function fetchAirQuality(location) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&current=us_aqi,pm10,pm2_5&timezone=Asia/Kuala_Lumpur`;
    const response = await axios.get(url);
    return response.data.current;
}

// Maps an AQI number to a label and emoji
function getAqiInfo(aqi) {
    if (aqi <= 50) return { label: 'Good', emoji: '🟢' };
    if (aqi <= 100) return { label: 'Moderate', emoji: '🟡' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', emoji: '🟠' };
    if (aqi <= 200) return { label: 'Unhealthy', emoji: '🔴' };
    if (aqi <= 300) return { label: 'Very Unhealthy', emoji: '🟣' };
    return { label: 'Hazardous', emoji: '🟤' };
}

function getWeatherDescription(code) {
    const codes = {
        0: '☀️ Clear Sky',
        1: '🌤️ Mainly Clear',
        2: '⛅ Partly Cloudy',
        3: '☁️ Overcast',
        45: '🌫️ Foggy',
        51: '💧 Light Drizzle',
        61: '🌧️ Light Rain',
        63: '🌧️ Moderate Rain',
        65: '⛈️ Heavy Showers',
        80: '🌦️ Rain Showers',
        95: '⚡ Thunderstorms'
    };
    return codes[code] || '🌤️ Fair / Humid';
}

function formatHourLabel(isoString) {
    if (!isoString) return 'Now';
    const date = new Date(isoString);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:00 ${ampm}`;
}

client.login(process.env.DISCORD_TOKEN);

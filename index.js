require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const MALAYSIA_LOCATIONS = {
    "kuala lumpur": { lat: 3.1390, lon: 101.6869, name: "Kuala Lumpur" },
    "johor bahru": { lat: 1.4927, lon: 103.7414, name: "Johor Bahru" },
    "penang": { lat: 5.4164, lon: 100.3301, name: "Penang (Georgetown)" },
    "melaka": { lat: 2.1896, lon: 102.2501, name: "Melaka" },
    "kota kinabalu": { lat: 5.9804, lon: 116.0735, name: "Kota Kinabalu" },
    "kuching": { lat: 1.5533, lon: 110.3592, name: "Kuching" },
    "ipoh": { lat: 4.5975, lon: 101.0901, name: "Ipoh" },
    "shah alam": { lat: 3.0738, lon: 101.5183, name: "Shah Alam" },
    "kuantan": { lat: 3.8126, lon: 103.3256, name: "Kuantan" },
    "langkawi": { lat: 6.3500, lon: 99.8000, name: "Langkawi" }
};

client.once('ready', () => {
    console.log(`✅ Logged in successfully as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const content = message.content.trim().toLowerCase();

    if (content.startsWith('!weather')) {
        const query = content.replace('!weather', '').trim() || 'kuala lumpur';
        const location = MALAYSIA_LOCATIONS[query] || { lat: 3.1390, lon: 101.6869, name: query.charAt(0).toUpperCase() + query.slice(1) };

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia/Kuala_Lumpur`;
            const response = await axios.get(url);
            const current = response.data.current;
            const conditionText = getWeatherDescription(current.weather_code);

            const embed = new EmbedBuilder()
                .setColor(0x00AEFF)
                .setTitle(`🇲🇾 Current Weather Report: ${location.name}`)
                .addFields(
                    { name: '🌡️ Temperature', value: `${current.temperature_2m}°C (Feels like ${current.apparent_temperature}°C)`, inline: false },
                    { name: '☁️ Condition', value: conditionText, inline: true },
                    { name: '💧 Humidity', value: `${current.relative_humidity_2m}%`, inline: true },
                    { name: '💨 Wind Speed', value: `${current.wind_speed_10m} km/h`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Data provided by Open-Meteo / Malaysia Region' });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('⚠️ Failed to fetch current weather data.');
        }
    }

    if (content.startsWith('!hourly')) {
        const query = content.replace('!hourly', '').trim() || 'kuala lumpur';
        const location = MALAYSIA_LOCATIONS[query] || { lat: 3.1390, lon: 101.6869, name: query.charAt(0).toUpperCase() + query.slice(1) };

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&timezone=Asia/Kuala_Lumpur`;
            const response = await axios.get(url);
            const hourly = response.data.hourly;

            const currentHourIndex = new Date().getHours();
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
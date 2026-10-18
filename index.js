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
                { name: '!help', value: 'Displays this help menu.' }
            )
            .setTimestamp()
            .setFooter({ text: 'Malaysia Weather Bot' });

        return message.reply({ embeds: [embed] });
    }

    // 2. Current Weather Command: !weather [location]
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

    // 3. Hourly Weather Command: !hourly [location]
    if (content.startsWith('!hourly')) {
        const query = content.replace('!hourly', '').trim() || 'kuala lumpur';
        const location = MALAYSIA_LOCATIONS[query] || { lat: 3.1390, lon: 101.6869, name: query.charAt(0).toUpperCase() + query.slice(1) };

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
const axios = require('axios');

exports.getWeatherByCity = async (city) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    console.log("🌦️ Appel API avec KEY =", apiKey); // <--- AJOUT ICI

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

    const response = await axios.get(url);
    return response.data;
};

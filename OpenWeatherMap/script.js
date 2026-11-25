//API URL and API Key
const apiKey = "9694b6f65a7df2e177968ea5b0331c6c";

 // API URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

async function getWeather() {

    const city = document.getElementById("city").value.trim();
    const result = document.getElementById("result");

    if (apiKey === "YOUR_OPENWEATHERMAP_API_KEY") {
        result.innerHTML = "<p class='error'>Please add a valid OpenWeatherMap API key in script.js!</p>";
        return;
    }

    // Check empty input    
    if (city === "") {
        result.innerHTML = "<p class='error'>Please enter a city name!</p>";
        return;
    }

   
//Fetch API Implementation and JSON Response Handling
//Displaying Weather Details
//Error Handling
    try {

        result.innerHTML = "Loading weather data...";

        // Fetch weather data
        const response = await fetch(url);

        // Check API response
        if (!response.ok) {
            throw new Error("City not found or data unavailable!");
        }

        // Convert response to JSON
        const data = await response.json();

        // Extract weather details
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const condition = data.weather[0].description;
        const cityName = data.name;

        // Display weather information
        result.innerHTML = `
            <h2>${cityName}</h2>
            <p>Temperature: ${temperature} °C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Weather: ${condition}</p>
        `;

    }
    catch (error) {

        result.innerHTML =
            `<p class="error">${error.message}</p>`;

    }
}

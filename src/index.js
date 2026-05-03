import "./styles.css";

const form = document.querySelector("form");
const city = document.querySelector(".city");
const minTemp = document.querySelector(".min-temp");
const maxTemp = document.querySelector(".max-temp");
const currentTemp = document.querySelector(".current-temp");
const minTempText = document.querySelector(".min-temp-text");
const maxTempText = document.querySelector(".max-temp-text");
const currentTempText = document.querySelector(".current-temp-text");
const weatherDescription = document.querySelector(".weather-description");
const errorText = document.querySelector(".error");

async function getWeatherData() {
    try {
    const location = document.getElementById("location").value;
    const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' 
                            + location +'?key=RXWCNU4JZKSAJYD3XQ6C94FCE')
    if(!response.ok) {
        throw new Error(`City not found or API error (Status: ${response.status})`);
    } else {
        const data = await response.json();
        return data;
    }
    } catch(error) {
        throw error;
    }
}

function initialRender() {
    showWeatherData();
}

async function showWeatherData() {
    const loadingText = document.querySelector(".loading");
    [errorText, city, minTemp, maxTemp, currentTemp
    , weatherDescription, minTempText, maxTempText, currentTempText,
    ].forEach(element => element.textContent = "");
    loadingText.textContent = "Fetching data....";

    try{
    const weatherInfo = await getWeatherData();
    
    loadingText.textContent = "";
    city.textContent = (weatherInfo.resolvedAddress).toUpperCase();
    minTempText.textContent = "Low";
    maxTempText.textContent = "High";
    currentTempText.textContent = "Current";
    function showTempInDifferentUnit(){
    const checkedUnit = document.querySelector('input[name=temperature]:checked').value;
    if(checkedUnit === "celsius") {
            minTemp.textContent = `${((weatherInfo.days[0].tempmin - 32) * 5 / 9).toFixed(1)} \u00B0C`;
            maxTemp.textContent = `${((weatherInfo.days[0].tempmax - 32) * 5 / 9).toFixed(1)} \u00B0C`;
            currentTemp.textContent = `${((weatherInfo.days[0].temp - 32) * 5 / 9).toFixed(1)} \u00B0C`;
        } else {
            minTemp.textContent = `${weatherInfo.days[0].tempmin} \u00B0F`;
            maxTemp.textContent = `${weatherInfo.days[0].tempmax} \u00B0F`;
            currentTemp.textContent = `${weatherInfo.days[0].temp} \u00B0F`;
        }
    }
    showTempInDifferentUnit();
    weatherDescription.textContent = weatherInfo.days[0].description;
    const changeTempUnit = document.querySelector(".temp-unit");
    changeTempUnit.addEventListener("change", function() {
        if(!(minTemp.textContent === "")) {
            showTempInDifferentUnit();
        }
    })
    } catch(error) {
        loadingText.textContent = "";
        errorText.textContent = `Error: ${error.message}`;
    }
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    showWeatherData();
});
initialRender();


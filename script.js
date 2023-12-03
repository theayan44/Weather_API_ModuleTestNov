const fetchContainer = document.querySelector(".fetch-container");
const weatherContainer = document.querySelector(".weather-container");
const gmap = document.getElementById("gmap");

function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetchContainer.style.display = "none";
            weatherContainer.style.display = "flex";
            showMap(latitude, longitude);
        }, (err) => {
            alert(err.message);
        });
    }
}

async function showMap(latitude, longitude) {
    const showLatitude = document.getElementById("latitude");
    const showLongitude = document.getElementById("longitude");
    showLatitude.innerText = `Lat: ${latitude}`;
    showLongitude.innerText = `Long: ${longitude}`;

    await gmap.setAttribute("src", `https://maps.google.com/maps?q=${latitude}, ${longitude}&z=15&output=embed`);
    setTimeout(() => {
        fetchWeather(latitude, longitude);
    }, 2000);
}

async function fetchWeather(latitude, longitude) {
    try {
        const apiKey = "93ce48880b403da84cee20e6db9371e3";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}`;
        const response = await fetch(`${url}&appid=${apiKey}`);
        const data = await response.json();

        const weatherDetails = document.querySelector(".weather-details");
        weatherDetails.innerHTML = `
                <span>Location: ${data.name}</span>
                <span>Wind Speed: ${(data.wind.speed * 3.6).toFixed(2)}kmph</span>
                <span>Humidity: ${data.main.humidity}</span>
                <span>Time Zone: GMT +${getTimeZone(data.timezone)}</span>
                <span>Pressure: ${data.main.pressure}hPa</span>
                <span>Wind Direction: ${getWindDirection(data.wind.deg)}</span>
                <span>UV Index: 500</span>
                <span>Feels like: ${(data.main.feels_like - 273.15).toFixed(2)}&deg;C</span>
            `;
    } catch (err) {
        alert("Sorry can't fetch the weathe");
    }
}

function getTimeZone(timezone) {
    const mainTime = timezone / 3600;
    const hr = Math.floor(mainTime);
    let min = parseInt(mainTime.toString().split(".")[1]) * 6;
    return `${hr}:${min}`;
}

function getWindDirection(deg) {
    const val = Math.floor((deg / 45) + 0.5);
    const arr = ["North", "North East", "East", "South East", "South", "South West", "West", "North West"];
    return arr[(val % 8)]
}
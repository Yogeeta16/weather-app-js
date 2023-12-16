window.onload = function (e) {
  getLocation();
};

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude: " + position.coords.latitude);
      console.log("Longitude: " + position.coords.longitude);
      showCurrentLocation(position.coords.latitude, position.coords.longitude);
    }, showError);
  } else {
    console.log("Geolocation is not available");
    fetchWeatherData("lucknow");
  }
}

function showCurrentLocation(lat, lon) {
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
  )
    .then((response) => response.json())
    .then((data) => {
      const city = data.city;
      fetchWeatherData(city);
    });
}

function fetchSearchCity(cityName) {
  if (cityName) {
    fetchWeatherData(cityName);
  }
}

function fetchWeatherData(cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=46d47581a51a79782741111953e700af`
  )
    .then((response) => {
      if (!response.ok) {
        let container = document.getElementById("weatherInfo");
        container.style.display = "none";
        let errorContainer = document.getElementById("weatherInfo-errorbox");
        errorContainer.style.display = "block";
        throw new Error(`City not found: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      updateWeather(data);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error.message);
    });
}

function updateWeather(data) {
  // console.log(data);
  // debugger;
  const lon = data.coord.lon;
  const lat = data.coord.lat;
  const wind = data.wind;
  const main = data.main;
  const name = data.name;

  // console.log("Longitude:", lon);
  // console.log("Latitude:", lat);
  // console.log("Wind Speed:", wind.speed, "km/h");
  // console.log("Humidity:", main.humidity, "%");
  // console.log("Temperature:", main.temp, "°C");
  // console.log("City:", name);

  let container = document.getElementById("weatherInfo");
  container.style.display = "block";
  let errorContainer = document.getElementById("weatherInfo-errorbox");
  errorContainer.style.display = "none";
  document.getElementById(
    "weather-icon"
  ).src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  document.getElementById("weather-degree").innerText = `${main.temp}°C`;
  document.getElementById("weather-humidity").innerText = `${main.humidity}%`;
  document.getElementById("weather-wind").innerText = `${wind.speed} km/h`;
  document.getElementById("weather-city").innerText = `${name}`;
}

const cityNameInput = document.getElementById("city-input");
cityNameInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    setTimeout(function () {
      fetchSearchCity(cityNameInput.value);
    }, 3000);
  }
});

function showError(error) {
  debugger;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      fetchWeatherData("lucknow");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      fetchWeatherData("lucknow");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}

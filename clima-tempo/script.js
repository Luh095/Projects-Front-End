const apiKey = "78e4ae264f39fc485c42ac0e91553d73"; // Coloque sua API key do OpenWeatherMap
const searchBtn = document.getElementById("search");
const cityInput = document.getElementById("city");
const weatherInfo = document.getElementById("weather-info");

// Busca por nome de cidade
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    alert("Por favor, digite o nome de uma cidade!");
    return;
  }
  getWeatherByCity(city);
});

// Busca automática por geolocalização
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        weatherInfo.innerHTML = `<p>Não foi possível obter sua localização. Busque manualmente uma cidade.</p>`;
      }
    );
  } else {
    weatherInfo.innerHTML = `<p>Geolocalização não suportada pelo seu navegador.</p>`;
  }
});

async function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;
  fetchWeather(url);
}

async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
  fetchWeather(url);
}

async function fetchWeather(url) {
  weatherInfo.innerHTML = `<p class="loading">Carregando dados do clima...</p>`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Cidade não encontrada!");

    const data = await response.json();
    showWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p>${error.message}</p>`;
  }
}

function showWeather(data) {
  const { name, main, weather } = data;
  weatherInfo.innerHTML = `
    <h2>${name}</h2>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
    <p class="temp">${Math.round(main.temp)}°C</p>
    <p>${weather[0].description}</p>
    <p>Umidade: ${main.humidity}%</p>
  `;
}

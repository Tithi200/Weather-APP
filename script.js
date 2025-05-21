const form = document.getElementById('weatherForm');
const locationInput = document.getElementById('locationInput');
const output = document.getElementById('output');
const geoButton = document.getElementById('geoButton');
const darkToggle = document.getElementById('toggleDark');

const apiKey = '0543e17b0c4c4bd3846121927252105'; // replace this with your WeatherAPI key

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const location = locationInput.value.trim();
  if (location) {
    fetchWeather(location);
  }
});

geoButton.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    output.textContent = "Geolocation is not supported.";
  }
});

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeather(`${lat},${lon}`);
}

function error() {
  output.textContent = "Unable to retrieve your location.";
}

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

async function fetchWeather(query) {
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Location not found.");
    const data = await response.json();
    const { location, current } = data;
    let html = `
      <h2>${location.name}, ${location.country}</h2>
      <p><strong>Now:</strong> ${current.temp_c}°C, ${current.condition.text}</p>
      <img src="${current.condition.icon}" alt="${current.condition.text}">
    `;
    output.innerHTML = html;
    output.classList.add('show');
  } catch (err) {
    output.textContent = `Error: ${err.message}`;
    output.classList.add('show');
  }
}
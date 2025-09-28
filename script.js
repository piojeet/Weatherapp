async function fetchWeather() {
  const city = document.getElementById('city').value;
  const result = document.getElementById('weather-result');
  const cityName = document.getElementById('city-name');
  const temperature = document.getElementById('temperature');
  const description = document.getElementById('description');
  const weatherIcon = document.getElementById('weather-icon');

  if (!city) {
    result.innerHTML = '<p>Please enter a city name.</p>';
    return;
  }

  try {
    const apiKey = 'YOUR_API_KEY'; // अपनी API key डालें
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    console.log('Fetching weather for city:', url); // डिबगिंग के लिए
    const response = await fetch(url);
    const data = await response.json();
    console.log('API Response:', data); // डिबगिंग के लिए

    if (data.cod !== 200) {
      result.innerHTML = `<p>${data.message || 'City not found!'}</p>`;
      return;
    }

    updateWeather(data);
  } catch (error) {
    console.error('Error fetching weather:', error); // डिबगिंग के लिए
    result.innerHTML = '<p>Error fetching weather data. Check console for details.</p>';
  }
}

async function fetchWeatherByLocation() {
  const result = document.getElementById('weather-result');
  if (!navigator.geolocation) {
    result.innerHTML = '<p>Geolocation is not supported by your browser.</p>';
    console.error('Geolocation not supported'); // डिबगिंग के लिए
    return;
  }

  result.innerHTML = '<p>Loading location...</p>'; // लोडिंग मैसेज
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      console.log('Location:', { latitude, longitude }); // डिबगिंग के लिए

      try {
        const apiKey = 'YOUR_API_KEY'; // अपनी API key डालें
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        console.log('Fetching weather for location:', url); // डिबगिंग के लिए
        const response = await fetch(url);
        const data = await response.json();
        console.log('API Response:', data); // डिबगिंग के लिए

        if (data.cod !== 200) {
          result.innerHTML = `<p>${data.message || 'Error fetching weather!'}</p>`;
          return;
        }

        updateWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error); // डिबगिंग के लिए
        result.innerHTML = '<p>Error fetching weather data. Check console for details.</p>';
      }
    },
    (error) => {
      console.error('Geolocation error:', error.message); // डिबगिंग के लिए
      result.innerHTML = '<p>Please allow location access or enter a city name.</p>';
    }
  );
}

function updateWeather(data) {
  const result = document.getElementById('weather-result');
  const cityName = document.getElementById('city-name');
  const temperature = document.getElementById('temperature');
  const description = document.getElementById('description');
  const weatherIcon = document.getElementById('weather-icon');

  cityName.textContent = data.name;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  description.textContent = data.weather[0].description;

  const weatherMain = data.weather[0].main.toLowerCase();
  document.body.className = weatherMain;

  let iconHTML = '';
  if (weatherMain.includes('clear')) {
    iconHTML = `
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" fill="#ffeb3b" class="sunny-icon">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite"/>
        </circle>
      </svg>`;
  } else if (weatherMain.includes('cloud')) {
    iconHTML = `
      <svg width="100" height="100" viewBox="0 0 100 100" class="cloudy-icon">
        <path d="M30 50a20 20 0 1 0 40 0 20 20 0 1 0-40 0z" fill="#b0bec5"/>
      </svg>`;
  } else if (weatherMain.includes('rain')) {
    iconHTML = `
      <svg width="100" height="100" viewBox="0 0 100 100">
        <path d="M30 40a20 20 0 1 0 40 0 20 20 0 1 0-40 0z" fill="#0288d1"/>
        <circle cx="40" cy="70" r="5" fill="#0288d1" class="rainy-icon"/>
        <circle cx="60" cy="70" r="5" fill="#0288d1" class="rainy-icon" style="animation-delay: 0.2s"/>
      </svg>`;
  }

  weatherIcon.innerHTML = iconHTML;
  result.classList.add('active');
}

const countrySelect = document.getElementById('countrySelect');
const loadingSpinner = document.getElementById('loadingSpinner');
const loadingContainer = document.querySelector('.loading-container');

countrySelect.addEventListener('change', async (e) => {
  const countryName = e.target.value;

  if (!countryName) {
    clearTable();
    return;
  }

  await loadCountryInfo(countryName);
});

function clearTable() {
  document.getElementById('name').textContent = '';
  document.getElementById('officialName').textContent = '';
  document.getElementById('capital').textContent = '';
  document.getElementById('language').textContent = '';
  document.getElementById('mapLink').innerHTML = '';
  document.getElementById('population').textContent = '';
  document.getElementById('flag').innerHTML = '';
  document.getElementById('coordinates').textContent = '';
  document.getElementById('rainfall').textContent = '';
  document.getElementById('temperature').textContent = '';
}

function showLoading() {
  loadingContainer.classList.add('loading');
  loadingSpinner.classList.add('show');
}

function hideLoading() {
  loadingContainer.classList.remove('loading');
  loadingSpinner.classList.remove('show');
}

async function loadCountryInfo(countryName) {
  clearTable();
  showLoading();

  try {
    const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const countryData = await countryResponse.json();
    const country = countryData[0];

    const name = country.name.common;
    const officialName = country.name.official;
    const capital = country.capital[0];
    const languages = Object.values(country.languages).join(', ');
    const mapLink = country.maps.googleMaps;
    const population = country.population.toLocaleString();
    const flagUrl = country.flags.png;
    const latitude = country.capitalInfo.latlng[0];
    const longitude = country.capitalInfo.latlng[1];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,rain&forecast_days=1`
    );
    const weatherData = await weatherResponse.json();

    const rainfallArray = weatherData.hourly.rain;
    const temperatureArray = weatherData.hourly.temperature_2m;

    const totalRainfall = rainfallArray.reduce((sum, val) => sum + val, 0);
    const avgTemperature = temperatureArray.reduce((sum, val) => sum + val, 0) / temperatureArray.length;

    await new Promise(resolve => setTimeout(resolve, 500));

    document.getElementById('name').textContent = name;
    document.getElementById('officialName').textContent = officialName;
    document.getElementById('capital').textContent = capital;
    document.getElementById('language').textContent = languages;
    document.getElementById('mapLink').innerHTML = `<a href="${mapLink}" target="_blank">View Map</a>`;
    document.getElementById('population').textContent = population;
    document.getElementById('flag').innerHTML = `<img src="${flagUrl}" alt="Flag" class="flag-img">`;
    document.getElementById('coordinates').textContent = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
    document.getElementById('rainfall').textContent = `${totalRainfall.toFixed(2)} mm`;
    document.getElementById('temperature').textContent = `${avgTemperature.toFixed(2)} °C`;

    hideLoading();
  } catch (error) {
    console.error('Error fetching data:', error);
    hideLoading();
    alert('Error loading country information. Please try again.');
  }
}

console.log("Small change from A branch");

const API_KEY = '39d3977b6499af87c8bcc87c35467842';
const CITY = 'Barranca,PE';

/* ================= UTILITIES ================= */

function formatTimeFromUnix(unix, timezoneOffset = 0) {
    const d = new Date((unix + timezoneOffset) * 1000);
    const hours = d.getHours();
    const mins = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const h12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${h12}:${mins}${ampm}`;
}

/* ================= WEATHER ================= */

async function loadWeather() {
    const currentWrapper = document.getElementById('weather-current');
    const currentLoading = document.getElementById('weather-current-loading');
    const forecastList = document.getElementById('forecast-list');
    const forecastLoading = document.getElementById('forecast-loading');

    try {
        const weatherResp = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&units=imperial&appid=${API_KEY}`
        );

        if (!weatherResp.ok) throw new Error('Current weather fetch failed');

        const weatherData = await weatherResp.json();

        const tempEl = document.getElementById('weather-temp');
        const descEl = document.getElementById('weather-desc');
        const iconEl = document.getElementById('weather-icon');
        const detailsHighLow = document.getElementById('weather-highlow');
        const detailsHumidity = document.getElementById('weather-humidity');
        const detailsSunrise = document.getElementById('weather-sunrise');
        const detailsSunset = document.getElementById('weather-sunset');

        tempEl.textContent = `${Math.round(weatherData.main.temp)}°F`;
        descEl.textContent = (weatherData.weather[0].description || '').replace(/\b\w/g, s => s.toUpperCase());

        iconEl.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"
                 alt="${weatherData.weather[0].description}"
                 width="64" height="64">
        `;

        detailsHighLow.textContent = `High: ${Math.round(weatherData.main.temp_max)}° | Low: ${Math.round(weatherData.main.temp_min)}°`;
        detailsHumidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
        detailsSunrise.textContent = `Sunrise: ${formatTimeFromUnix(weatherData.sys.sunrise, weatherData.timezone)}`;
        detailsSunset.textContent = `Sunset: ${formatTimeFromUnix(weatherData.sys.sunset, weatherData.timezone)}`;

        currentLoading.hidden = true;
        currentWrapper.hidden = false;

        /* ----- FORECAST ----- */
        const forecastResp = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(CITY)}&units=imperial&appid=${API_KEY}`
        );

        if (!forecastResp.ok) throw new Error('Forecast fetch failed');

        const forecastData = await forecastResp.json();
        const list = forecastData.list;
        const timezone = forecastData.city.timezone;

        const days = {};
        list.forEach(item => {
            const local = new Date((item.dt + timezone) * 1000);
            const dayKey = local.toISOString().slice(0, 10);

            if (!days[dayKey]) days[dayKey] = [];
            days[dayKey].push(item);
        });

        const dayKeys = Object.keys(days).sort();
        const todayKey = new Date(Date.now() + timezone * 1000).toISOString().slice(0, 10);

        const nextKeys = dayKeys.filter(k => k !== todayKey).slice(0, 3);

        forecastList.innerHTML = '';

        if (nextKeys.length === 0) {
            forecastList.innerHTML = `<li>No forecast data found.</li>`;
        } else {
            nextKeys.forEach(k => {
                const items = days[k];
                const temps = items.map(i => i.main.temp);
                const high = Math.round(Math.max(...temps));
                const low = Math.round(Math.min(...temps));

                const midday = items[Math.floor(items.length / 2)];
                const dateObj = new Date((midday.dt + timezone) * 1000);
                const weekday = dateObj.toLocaleDateString(undefined, { weekday: 'long' });

                const li = document.createElement('li');
                li.innerHTML = `<strong>${weekday}:</strong> ${high}°F / ${low}°F`;
                forecastList.appendChild(li);
            });
        }

        forecastLoading.hidden = true;
        forecastList.hidden = false;

    } catch (err) {
        console.error(err);
        currentLoading.textContent = 'Unable to load weather at this time.';
        forecastLoading.textContent = 'Unable to load forecast at this time.';
    }
}

/* ================= SPOTLIGHTS ================= */

async function loadSpotlights() {
    const spotlightsContainer = document.getElementById('spotlights');
    if (!spotlightsContainer) return;

    try {
        const resp = await fetch('data/members.json');
        if (!resp.ok) throw new Error('Members JSON not found');

        const data = await resp.json();
        const members = data.members;

        const pool = members.filter(m => {
            const level = (m.membership || '').toLowerCase();
            return level === 'gold' || level === 'silver';
        });

        const shuffled = pool.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        spotlightsContainer.innerHTML = '';

        selected.forEach(member => {
            const level = (member.membership || 'Bronze').toLowerCase();
            const classLevel = level === 'gold' ? 'member-gold' : 'member-silver';
            const imgSrc = member.image ? `images/${member.image}` : 'images/logo-placeholder.png';

            const card = document.createElement('div');
            card.className = `member-card ${classLevel}`;

            card.innerHTML = `
                <img class="member-logo" src="${imgSrc}" alt="${member.name} logo">
                <div class="member-info">
                    <h4>${member.name}</h4>
                    <p class="member-contact">${member.address || ''}</p>
                    <p class="member-contact">Phone: <a>${member.phone || 'N/A'}</a></p>
                    <p class="member-contact">Website: 
                        <a href="${member.website || '#'}" target="_blank" rel="noopener">
                            ${member.website || 'N/A'}
                        </a>
                    </p>
                    <div class="membership-badge">${member.membership || 'Member'}</div>
                </div>
            `;

            spotlightsContainer.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        spotlightsContainer.innerHTML = `<p>Could not load member spotlights.</p>`;
    }
}

/* ================= INIT ================= */

document.addEventListener('DOMContentLoaded', () => {
    loadWeather();
    loadSpotlights();

    const menuButton = document.getElementById('menuButton');
    const navMenu = document.getElementById('navMenu');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }
});
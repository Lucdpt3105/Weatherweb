// Use proxy endpoints (server will hide API keys)
let url = '/api/weather';
let unsplashAccessKey = null; // key moved to server
let city = document.querySelector('.name');
let form = document.querySelector("form");
let temperature = document.querySelector('.temperature');
let description = document.querySelector('.description');
let valueSearch = document.getElementById('name');
let clouds = document.getElementById('clouds');
let humidity = document.getElementById('humidity');
let pressure = document.getElementById('pressure');
let main = document.querySelector('main');
form.addEventListener("submit", (e) => {
    e.preventDefault();  
    if(valueSearch.value != ''){
        searchWeather();
    }
});
const searchWeather = () => {
    fetch(url+'?q='+ encodeURIComponent(valueSearch.value))
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.cod == 200){
                city.querySelector('figcaption').innerHTML = data.name;
                city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
                temperature.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
                temperature.querySelector('span').innerText = data.main.temp;
                description.innerText = data.weather[0].description;

                clouds.innerText = data.clouds.all;
                humidity.innerText = data.main.humidity;
                pressure.innerText = data.main.pressure;
                
                // Thêm background image của thành phố
                updateCityBackground(data.name);
                // Lấy lat/lon: fetch 7-day forecast (One Call API)
                if (data.coord?.lat && data.coord?.lon) {
                    fetchWeeklyForecast(data.coord.lat, data.coord.lon);
                }
            }else{
                main.classList.add('error');
                setTimeout(() => {
                    main.classList.remove('error');
                }, 1000);
            }
            valueSearch.value = '';
        })
}
// Fetch 7-day forecast using One Call API and render into #weeklyForecast
const fetchWeeklyForecast = (lat, lon) => {
    // Use proxy endpoint for One Call
    const oneCallUrl = `/api/onecall?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    fetch(oneCallUrl)
        .then(res => res.json())
        .then(forecast => {
            renderWeeklyForecast(forecast.daily || []);
        })
        .catch(err => {
            console.log('Lỗi khi lấy forecast:', err);
        });
}

const renderWeeklyForecast = (daily) => {
    const container = document.getElementById('weeklyForecast');
    container.innerHTML = '';
    // Show up to 7 days
    const daysToShow = daily.slice(0, 7);
    const weekdayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    daysToShow.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = weekdayNames[date.getDay()];
        const icon = day.weather?.[0]?.icon ?? '01d';
        const desc = day.weather?.[0]?.description ?? '';
        const min = Math.round(day.temp.min);
        const max = Math.round(day.temp.max);

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
            <div class="forecast-temp">${max}° / <span style="opacity:0.8">${min}°</span></div>
            <div style="font-size:0.85em; opacity:0.9; margin-top:6px; text-transform:capitalize">${desc}</div>
        `;

        container.appendChild(card);
    });
}

// Hàm để cập nhật background image
const updateCityBackground = (cityName) => {
    // Sử dụng Unsplash API với access key để lấy ảnh chất lượng cao
    const unsplashApiUrl = `/api/unsplash?query=${encodeURIComponent(cityName + ' city')}`;
    fetch(unsplashApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const imageUrl = data.results[0].urls.regular;
                document.body.style.backgroundImage = `url('${imageUrl}')`;
            } else {
                // Fallback nếu không tìm thấy ảnh
                const fallbackUrl = `https://source.unsplash.com/1920x1080/${cityName}%20city`;
                document.body.style.backgroundImage = `url('${fallbackUrl}')`;
            }
        })
        .catch(error => {
            console.log('Lỗi khi lấy ảnh từ Unsplash:', error);
            // Fallback nếu có lỗi
            const fallbackUrl = `https://source.unsplash.com/1920x1080/${cityName}%20city`;
            document.body.style.backgroundImage = `url('${fallbackUrl}')`;
        });
}

// Danh sách các thành phố gợi ý
const suggestedCities = [
    'Tokyo', 'Paris', 'London', 'New York', 'Sydney', 'Dubai',
    'Singapore', 'Bangkok', 'Seoul', 'Amsterdam', 'Barcelona', 'Rome', 'Beijing', 'Moscow', 'Berlin', 'Madrid', 
    'Los Angeles', 'Toronto', 'Istanbul', 'Cairo', 'Buenos Aires', 'Rio de Janeiro', 'Cape Town', 'Mumbai', 
    'Kuala Lumpur', 'Hong Kong', 'Lagos', 'Sao Paulo', 'Vienna', 'Prague', 'Budapest', 'Athens', 'Copenhagen',
    'Stockholm', 'Oslo', 'Helsinki', 'Dublin', 'Brussels', 'Lisbon', 'Warsaw', 'Budapest', 'Bucharest', 'Sofia',
    'Zagreb', 'Belgrade', 'Sarajevo', 'Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Nha Trang', 'Can Tho', 'Vinh', 'Hai Phong', 'Hue'
];

// Hàm tạo gợi ý thành phố
const createCitySuggestions = () => {
    const container = document.getElementById('citySuggestions');
    
    // Lấy ngẫu nhiên 6 thành phố
    const randomCities = [...suggestedCities].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    container.innerHTML = '';
    
    randomCities.forEach(city => {
        const cityCard = document.createElement('div');
        cityCard.className = 'city-card';
        cityCard.innerHTML = `<h4>${city}</h4>`;
        
        cityCard.addEventListener('click', () => {
            valueSearch.value = city;
            searchWeather();
        });
        
        container.appendChild(cityCard);
    });
}
// search Default
const initApp = () => {
    valueSearch.value = 'Washington';
    searchWeather();
    createCitySuggestions(); // Tạo gợi ý thành phố khi khởi tạo
}
initApp();
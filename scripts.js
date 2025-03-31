
window.onload = function () {
    function categorizeEmergencies() {
        let redCount = 5;
        let yellowCount = 2;
        let greenCount = 4;
        let blackCount = 2;

        $('#emergency-table tbody tr').each(function() {
            const status = $(this).find('td:nth-child(5)').text(); 
            if (status === 'Red') {
                redCount++;
            } else if (status === 'Yellow') {
                yellowCount++;
            } else if (status === 'Green') {
                greenCount++;
            } else if(status === 'Black') {
                blackCount++;
            }
        });

        updateChart(redCount, yellowCount, greenCount, blackCount);
    }


    var emergencyChart;
    function updateChart(redCount, yellowCount, greenCount, blackCount) {
        const ctx = document.getElementById('emergencyChart').getContext('2d');
        if (emergencyChart) {
            emergencyChart.destroy(); 
        }
        emergencyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red Emergencies', 'Yellow Emergencies', 'Green Emergencies', 'Black Emergencies'],
                datasets: [{
                    label: 'Number of Emergencies',
                    data: [redCount, yellowCount, greenCount, blackCount],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)', 
                        'rgba(255, 206, 86, 0.6)', 
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(0, 0, 0, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(0, 0, 0, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function categorizeRescues() {
        let MobileApp = 0;
        let PhoneCall = 0;

        MobileApp = 10;
        PhoneCall = 5;

        updateRescueChart(MobileApp, PhoneCall);
    }

    var rescueChart;
    function updateRescueChart(MobileApp, PhoneCall) {
        const ctx = document.getElementById('rescueChart').getContext('2d');
        if (rescueChart) {
            rescueChart.destroy(); 
        }
        rescueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['MobileApp', 'PhoneCall'],
                datasets: [{
                    label: 'Number of Rescues via Radar Mobile App',
                    data: [MobileApp, PhoneCall],
                    backgroundColor: [
                        'rgba(28, 12, 91, 0.6)',  
                        'rgba(255, 99, 132, 0.6)'  
                    ],
                    borderColor: [
                        'rgba(28, 12, 91, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function displayincident() {
        const ctx3 = document.getElementById('incidentChart').getContext('2d');
        window.incidentChart = new Chart(ctx3, {
            type: 'pie',
            data: {
                labels: ['Addition Hills', 'San Jose', 'New Zaniga', 'Malamig', 'Others'],
                datasets: [{
                    data: [79.45, 7.31, 7.06, 4.91, 1.26],
                    backgroundColor: ['rgba(28, 12, 91, 0.6)', '#36a2eb', '#ffce56', '#4bc0c0', '#1C0C5B'],
                    borderColor: ['#ffffff'],
                    borderWidth: 1
                }]
            },
            options: { responsive: true }
        });
    }

    function displaymonthly() {
        const ctx4 = document.getElementById('monthlyIncidentChart').getContext('2d');
        window.monthlyIncidentChart = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May'],
                datasets: [{
                    label: 'Incident Reports',
                    data: [320, 260, 200, 350, 150],
                    backgroundColor: ['rgba(28, 12, 91, 0.6)'],
                    borderColor: ['rgba(28, 12, 91, 1)'],
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    }

    displayincident();
    displaymonthly();
    categorizeEmergencies();
    categorizeRescues();
    
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("#emergency-table tbody tr").forEach(row => {
            const statusCell = row.cells[4];
            const statusText = statusCell.textContent.trim().toLowerCase();

            let color = "";
            if (statusText === "1") { 
                color = "red"; 
            } else if (statusText === "2") { 
                color = "yellow"; 
            } else if (statusText === "3") { 
                color = "green"; 
            } else if (statusText === "0") { 
                color = "black"; 
            }

            statusCell.innerHTML = `<span class="status-square" style="background-color: ${color};"></span>`;
        });
    });

    $(document).ready(function() {
        $('#emergency-table').DataTable();
        $('#notification-table').DataTable();
       
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            $('body').addClass('dark-mode');
            $('#toggle-dark-mode i').removeClass('fa-adjust').addClass('fa-sun');
        }
       
        $('#toggle-dark-mode').click(function() {
            $('body').toggleClass('dark-mode');
            if ($('body').hasClass('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                $('#toggle-dark-mode i').removeClass('fa-adjust').addClass('fa-sun');
            } else {
                localStorage.setItem('darkMode', 'disabled');
                $('#toggle-dark-mode i').removeClass('fa-sun').addClass('fa-adjust');
            }
        });

        $('#burger-menu').click(function() {
            $('#dropdown-menu').toggleClass('active');
        });

        $(document).click(function(event) {
            if (!$(event.target).closest('#burger-menu, #dropdown-menu').length) {
                $('#dropdown-menu').removeClass('active');
            }
        });
    });

    let map;
    let marker;

    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 14.5995, lng: 120.9842 },
            zoom: 12,
        });
    }

    function getWeather() {
    const apiKey = 'YOUR-API-KEY';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

let id = '9505fd1df737e20152fbd78cdb289b6a';
        let url = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + id;
        let form = document.getElementById("weatherForm");
        let cityInput = document.getElementById("cityInput");
        let cityName = document.getElementById("cityName");
        let countryFlag = document.getElementById("countryFlag");
        let weatherDescription = document.getElementById("weatherDescription");
        let weatherIcon = document.getElementById("weatherIcon");
        let temperature = document.getElementById("temperature");
        let clouds = document.getElementById("clouds");
        let humidity = document.getElementById("humidity");
        let pressure = document.getElementById("pressure");
        
        form.addEventListener("submit", (e) => {
            e.preventDefault();  
            if(cityInput.value !== ''){
                fetchWeather(cityInput.value);
            }
        });
        
        function fetchWeather(city) {
            fetch(url + '&q=' + city)
                .then(response => response.json())
                .then(data => {
                    if(data.cod == 200){
                        cityName.innerText = data.name;
                        countryFlag.src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
                        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
                        temperature.innerText = data.main.temp;
                        weatherDescription.innerText = data.weather[0].description;
                        clouds.innerText = data.clouds.all;
                        humidity.innerText = data.main.humidity;
                        pressure.innerText = data.main.pressure;
                    } else {
                        alert("City not found");
                    }
                    cityInput.value = '';
                })
        }
        
        fetchWeather("Mandaluyong");

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}

    function geocodeLocation() {
        const location = document.getElementById("locationInput").value;
        if (!location) {
            alert("Please enter a location.");
            return;
        }

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location }, (results, status) => {
            if (status === "OK") {
                const position = results[0].geometry.location;

                map.setCenter(position);
                map.setZoom(15);

                if (marker) {
                    marker.setMap(null);
                }

                marker = new google.maps.Marker({
                    position: position,
                    map: map
                });

            } else {
                alert("Location not found: " + status);
            }
        });

        $('#emergency-table tbody').on('click', 'tr', function() {
            const locationName = $(this).find('td:nth-child(2)').text();
            const foundLocation = locations.find(location => location.name.toLowerCase() === locationName.toLowerCase());
            if (foundLocation) {
                map.setCenter({ lat: foundLocation.lat, lng: foundLocation.lng });
                new google.maps.Marker({
                    position: { lat: foundLocation.lat, lng: foundLocation.lng },
                    map: map,
                    title: foundLocation.name
                });
            }
        });
    }
}


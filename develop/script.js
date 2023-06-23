document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "767baab1ba615005b7b57e268ed513fe";
  const humidityEl = document.querySelector("span#humidity");
  const windEl = document.querySelector("span#wind");
  const uvIndexEl = document.querySelector("span#uv-index");
  const cityListEl = document.querySelector("div.cityList");
  const cityEl = document.querySelector("h2#city");
  const dateEl = document.querySelector("h3#date");
  const weatherIconEl = document.querySelector("img#weather-icon");
  const temperatureEl = document.querySelector("span#temperature");
  const cityInput = document.querySelector("#city-input");
  let pastCities = [];

  function compare(a, b) {
    const cityA = a.city.toUpperCase();
    const cityB = b.city.toUpperCase();
    return cityA.localeCompare(cityB);
  }

  function loadCities() {
    const savedCities = JSON.parse(localStorage.getItem("pastCities"));
    if (savedCities) {
      pastCities = savedCities;
    }
  }

  function storeCities() {
    localStorage.setItem("pastCities", JSON.stringify(pastCities));
  }

  function buildURLFromInputs(city) {
    if (city) {
      return `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;
    }
  }

  function buildURLFromId(id) {
    return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
  }

  function displayCities(pastCities) {
    cityListEl.innerHTML = "";
    pastCities.splice(5);
    let sortedCities = [...pastCities];
    sortedCities.sort(compare);
    sortedCities.forEach(function(location) {
      let cityDiv = document.createElement("div");
      cityDiv.classList.add("col-12", "city");
      let cityBtn = document.createElement("button");
      cityBtn.classList.add("btn", "btn-light", "city-btn");
      cityBtn.textContent = location.city;
      cityDiv.appendChild(cityBtn);
      cityListEl.appendChild(cityDiv);
    });
  }

  function setUVIndexColor(uvi) {
    if (uvi < 3) {
      return "green";
    } else if (uvi < 6) {
      return "yellow";
    } else if (uvi < 8) {
      return "orange";
    } else if (uvi < 11) {
      return "red";
    } else {
      return "purple";
    }
  }

  function searchWeather(queryURL) {
    fetch(queryURL)
      .then(response => response.json())
      .then(response => {
        let city = response.name;
        let id = response.id;

        if (pastCities[0]) {
          pastCities = pastCities.filter(savedCity => id !== savedCity.id);
        }

        pastCities.unshift({ city, id });
        storeCities();
        displayCities(pastCities);

        cityEl.textContent = response.name;
        let formattedDate = moment.unix(response.dt).format("L");
        dateEl.textContent = formattedDate;
        let weatherIcon = response.weather[0].icon;
        weatherIconEl.src = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
        weatherIconEl.alt = response.weather[0].description;
        temperatureEl.innerHTML = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(1);
        humidityEl.textContent = response.main.humidity;
        windEl.textContent = (response.wind.speed * 2.237).toFixed(1);

        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let queryURLAll = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        fetch(queryURLAll)
          .then(response => response.json())
          .then(response => {
            let uvIndex = response.current.uvi;
            let uvColor = setUVIndexColor(uvIndex);
            uvIndexEl.textContent = response.current.uvi;
            uvIndexEl.style.backgroundColor = uvColor;
            uvIndexEl.style.color = uvColor === "yellow" ? "black" : "white";
            let fiveDay = response.daily;

            for (let i = 0; i <= 5; i++) {
              let currDay = fiveDay[i];
              let dayTitleEl = document.querySelector(`div.day-${i} .card-title`);
              let dayImgEl = document.querySelector(`div.day-${i} .fiveDay-img`);
              let dayTempEl = document.querySelector(`div.day-${i} .fiveDay-temp`);
              let dayHumidEl = document.querySelector(`div.day-${i} .fiveDay-humid`);

              dayTitleEl.textContent = moment.unix(currDay.dt).format("L");
              dayImgEl.src = `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`;
              dayImgEl.alt = currDay.weather[0].description;
              dayTempEl.textContent = ((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1);
              dayHumidEl.textContent = currDay.humidity;
            }
          });
      });
  }

  function displayLastSearchedCity() {
    if (pastCities[0]) {
      let queryURL = buildURLFromId(pastCities[0].id);
      searchWeather(queryURL);
    } else {
      let queryURL = buildURLFromInputs("Salt Lake City");
      searchWeather(queryURL);
    }
  }

  document.getElementById("search-btn").addEventListener("click", event => {
    event.preventDefault();
    let city = cityInput.value.trim();
    city = city.replace(" ", "%20");
    cityInput.value = "";

    if (city) {
      let queryURL = buildURLFromInputs(city);
      searchWeather(queryURL);
    }
  });

  document.addEventListener("click", event => {
    if (event.target.classList.contains("city-btn")) {
      let clickedCity = event.target.textContent;
      let foundCity = pastCities.find(savedCity => clickedCity === savedCity.city);

      let queryURL = buildURLFromId(foundCity.id);
      searchWeather(queryURL);
    }
  });

  loadCities();
  displayCities(pastCities);
  displayLastSearchedCity();
});

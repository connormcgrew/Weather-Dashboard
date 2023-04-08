$(document).ready(function () {
  const apiKey = "767baab1ba615005b7b57e268ed513fe";

  const date = $("h3#date");
  const city = $("h2#city");
  const cityList = $("div.cityList");
  const uvIndex = $("span#uv-index");
  const temp = $("span#temperature");
  const weatherImgEl = $("weather-icon");
  const humidity = $("span#humidity");
  const wind = $("span#wind");

  const cityInput = $("input#city-input");

  let previousCities = [];

  function compare(a, b) {
    const cityA = a.toUpperCase();
    const cityB = b.toUpperCase();

    let comparison = 0;
    if (cityA > cityB) {
      comparison = 1;
    } else if (cityA < cityB) {
      comparison = -1;
    }
    return comparison;
  }

  function loadCities() {
    const savedCity = JSON.parse(localStorage.getItem("previousCities"));
  }

  function savedCity() {
    localStorage.setItem("previousCities", JSON.stringify(previousCities));
  }

  function previousCities() {
    if (savedCity !== null) {
      previousCities = savedCity;
    }
  }

  function getURLFromInputs(city) {
    if (city) {
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    }
  }

  function getURLFromId(id) {
    return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
  }

  function displayCities(previousCities) {
    cityList.empty();
    previousCities.splice(5);
    let sortedCities = [...previousCities];
    sortedCities.sort(compare);
    sortedCities.forEach(function (location) {
      let cityDiv = $("<div>").addClass("col-12 city");
      let cityBtn = $("<button>")
        .addClass("btn btn-light city-btn")
        .text(location.city);
      cityDiv.append(cityBtn);
      cityList.append(cityDiv);
    });
  }


function setUVIndexColor(uvi) {
  if (uvi < 3) {
    return "green";
  } else if (uvi >= 3 && uvi < 6) {
    return "yellow";
  } else if (uvi >= 6 && uvi < 8) {
    return "orange";
  } else if (uvi >= 8 && uvi < 11) {
    return "red";
  } else return "purple";
}

function searchWeather(queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    let city = response.name;
    let id = response.id;

    if (previousCities[0]) {
      previousCities = $grep(previousCities, function (savedCity) {
        return id !== savedCity.id;
      });
    }

    previousCities.unshift({ city, id });
    savedCity();
    displayCities(previousCities);
  })
}

city.text(response.name);
let formateTextDate = moment.unix(response.dt).format("L");
date.text(formateTextDate);
let weatherImg = response.weather[0].icon;
weatherImgEl.attr("src", `http://openweathermap.org/img/w/${weatherImg}.png`).attr("alt", response.weather[0].description);
temp.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1));
humidity.text(response.main.humidity);
wind.text((response.wind.speed * 2.237).toFixed(1));


let lat = response.coord.lat;
let lon = response.coord.lon;
let QueryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
$.ajax({
  url: QueryURLAll,
  method: "GET",
}).then(function (response) {
  let uvi = response.current.uvi;
  let uviColor = setUVIndexColor(uvi);
  uvIndex.text(response.current.uvi);
  uvIndex.attr("style", `background-color: ${uviColor}; color: ${uviColor === "yellow" ? "black" : "white"}`);
  let fiveDay = response.daily;

  for (let i = 0; i <= 5; i++) {
    let currDay = fiveDay[i];
    $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format('L'));
    $(`div.day-${i} .fiveDay-img`).attr(
        'src',
        `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
    ).attr('alt', currDay.weather[0].description);
    $(`div.day-${i} .fiveDay-temp`).text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
    $(`div.day-${i} .fiveDay-humid`).text(currDay.humidity);
  }
});
});

function displayLastSearchedCity() {
  if (lastCity) {
    let queryURL = getURLFromId(savedCity[0].id);
    searchWeather(queryURL);
  } else {
    let queryURL = getURLFromInputs("Salt Lake City");
    searchWeather(queryURL);
  }
}

$('#search-btn').on('click', function (event) {
  event.preventDefault();
  let city = cityInput.val();
  city = city.replace(' ', '%20');

  cityInput.val('');

  if (city) {
    let queryURL = getURLFromInputs(city);
    searchWeather(queryURL);
  }
  
});

$(document).on('click', 'button.city-btn', function (event) {
  let clickedCity = $(this).text();
  let foundCity = $grep(previousCities, function (savedCity) {
    return clickedCity === savedCity.city;
  })
  let queryURL = getURLFromId(foundCity[0].id);
  searchWeather(queryURL);

});

loadCities();
displayCities(previousCities);
displayLastSearchedCity();
$(document).ready(function () {
  const apiKey = "767baab1ba615005b7b57e268ed513fe";

  const date = $("h3#date");
  const city = $("h2#city");
  const cityList = $("div.cityList");
  const uvIndex = $("span#uv-index");
  const temp = $("span#temperature");
  const weatherImg = $("weather-icon");
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
        return savedCity.id !== id;
      });
    }

    previousCities.unshift({ city, id });
    savedCity();
    displayCities(previousCities);
  })
}


});

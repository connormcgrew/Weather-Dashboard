let searchBtn = document.getElementById("#searchBtn");
let citySearch = document.getElementById("#citySearch");
let cityList = document.getElementById("#cityList");
let currentCity = document.getElementById("#currentCity");
let currentTime = document.getElementById("#currentTime"); 
let currentDate = document.getElementById("#currentDate");
let weatherImg = document.getElementById("#weatherImg");
let forcastContainer = document.getElementById("#forcastContainer");
let tempDisplay = document.getElementById("#tempDisplay");
let windSpeed = document.getElementById("#windSpeed");
let humidityDisplay = document.getElementById("#humidityDisplay");
let uvIndexDisplay = document.getElementById("#uvIndexDisplay");








// $(document).ready(function() {
// const apiKey = '767baab1ba615005b7b57e268ed513fe';

// const date = $('h3#date');
// const city = $('h2#city');
// const cityList = $('div.cityList');
// const uvIndex = $('span#uv-index');
// const temp = $('span#temperature');
// const weatherImg = $('weather-icon');
// const humidity = $('span#humidity');
// const wind = $('span#wind');

// const cityInput = $('input#city-input');

// let previousCities =[];

// function compare(a,b) {
//   const cityA = a.toUpperCase();
//   const cityB = b.toUpperCase();

//   let comparison = 0;
//   if (cityA > cityB) {
//     comparison = 1;
//   } else if (cityA < cityB) {
//     comparison = -1;
//   }
//   return comparison;
// }

// function loadCities() {
//     const storedCities = JSON.parse(localStorage.getItem('previousCities'));
// }

// function previousCities() {
//     if (storedCities !== null) {
//         previousCities = storedCities;
//     }
// }

// function buildURLFromId(id) {
//     return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
// }

// });


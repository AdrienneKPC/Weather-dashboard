const BASE_URL = "http://api.openweathermap.org/data/2.5/forecast?q=";
const API_KEY = "&appid=2109f92e69cf64b7217771b95cfff1bc";

$(document).ready(function () {
  $("#button").on("click", function () {
    var searchedCity = $("#searched-city").val();

    //clear input box when needed
    $("#searched-city").val("");

    //pass searched city into search weather
    searchWeather(searchedCity);
  });
  //PULL OUT LOCAL STORAGE VALUES AS ROWS
  //// history in local storage
});
function searchWeather(cityString) {
  console.log(BASE_URL + cityString + API_KEY);
  var myRequest = $.ajax({
    url: BASE_URL + cityString + API_KEY,
    method: "GET",
    datatype: "json",
  });
  myRequest.done(function (response) {
    let fiveDayForecast = response.list;
    console.log(response);
    //Store in localStorage
    localStorage.setItem(cityString, JSON.stringify(response.list));

    // fiveDayForecast.forEach((e) => {
    //   let timeStamp = e.dt;
    //   let date = new Date(timeStamp * 1000);
    //   console.log(date);
    // });
    renderToday(cityString, response.list);
  });
}
// Of selected city
/*
- name
- everything else in the object
*/
function renderToday(cityString, list) {
  /* cant find uv index
    index 0-4 (Today) we'll use index 1
    index 5-9 (Tommorrow) we'll use index 6
    index 10-14 (2 days later) index 11
    index 15-19 (3 days layer) index 15
    index 20 - 24 (4 days later) index 21
    index 25-29 (5 days later) index 26
    */
  let today = new Date();
  console.log(today);
  let cityTodayObj = {
    imageURL:
      "http://openweathermap.org/img/wn/" + list[1].weather[0].icon + "@2x.png",
    name: cityString,
    temp: kelvinToFaranheit(list[1].main.temp),
    humidity: list[1].main.humidity,
    wind: list[1].wind.speed,
    date: today,
    fiveDayForecast: [],
  };
  var counter = 1;

  for (i = 8; i < list.length; i += 8) {
      console.log(list[i])
    cityTodayObj.fiveDayForecast.push({
      //name
      imageURL:
        "http://openweathermap.org/img/wn/" +
        list[i].weather[0].icon +
        "@2x.png",
      temp: kelvinToFaranheit(list[i].main.temp),
      humidity: list[i].main.humidity,
      wind: list[i].wind.speed,
      date: new Date(list[i].dt *1000)
    });
    counter++;
  }
  console.log(cityTodayObj);

  var todayContainer = $(".today-container");
  var htmlStringToday = `
    <div class="row">
       <h1 class="display-4"> ${
         cityTodayObj.name
       } (${getFormattedDate(cityTodayObj.date)})</h1>
       <img src= "${cityTodayObj.imageURL}" />
    </div>
    <div class="row">
    <p>Temperature: ${cityTodayObj.temp}</p>
    </div>
    <div class="row">
    <p>Humidity: ${cityTodayObj.humidity}</p>
    </div>
    <div class="row">
    <p>Wind: ${cityTodayObj.wind}</p>
    </div>
    <div class="row">
    <p>UV-Index: N/A </p>
    </div>
    `;
  let htmlStringForecast = "<h1>5-Day forecast</h1>";

  todayContainer.html(htmlStringToday);
  for (var i = 0; i < cityTodayObj.fiveDayForecast.length; i++) {
    const cur = cityTodayObj.fiveDayForecast[i];
    htmlStringForecast += `
        <div class="card">
          <h4> ${getFormattedDate(cur.date)} </h4>
          <img class="card-img-top" src="${cur.imageURL}" />
          <div class="card-body">
          <p class="card-text"> Temperature: ${cur.temp}</p>
          <p class="card-text"> Humidity: ${cur.humidity}</p>
          </div>
        </div>
        `;
  }

  var forecastContainer = $(".forecast-container");
  forecastContainer.html(htmlStringForecast);
}
/* F= KELVIN * 9/5 - 459.67*/
function kelvinToFaranheit(kelvinDeg) {
  return Math.floor(kelvinDeg * (9 / 5) - 459.67);
}

function getFormattedDate(dateObj){
    return `${dateObj.getMonth()}/ ${dateObj.getDate()}/ ${dateObj.getFullYear()}`
}

function makeHistoryRows(){
    var container = document.getElementsByClassName("history-rows")[0];
    let htmlString = ``;
    for( var i = 0; i< localStorage.length; i++){
        var curKey = localStorage.key(i);
        if(localStorage.getItem(curKey)){
            htmlString+=   `<div class="row ">
            <h3> ${curKey}</h3>
            </div>`
        }
    }
    container.innerHTML+= htmlString;
}
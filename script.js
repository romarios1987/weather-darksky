Date.prototype.getUnixTime = function() {
  return (this.getTime() / 1000) | 0;
};
var today = new Date();
var prevTime = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
var initializeLoc = function initializeLoc() {
  $.ajax({
    type: 'GET',
    url: 'https://ipinfo.io/json/',
    success: getLocation,
  });
};

function getLocation(res) {
  var region = res.region;
  var country = res.country;
  var location = region + ',' + country;
  var latLong = res.loc;
  setLocation(location, latLong);
  if (today) document.querySelector('.nextday').classList.add('disabled');

  var prew = document.getElementById('prew').addEventListener('click', function() {
    document.querySelector('.nextday').classList.remove('disabled');
    darkSkyCall(latLong, prevTime);
  });
  var next = document.getElementById('next').addEventListener('click', function() {
    document.querySelector('.nextday').classList.add('disabled');
    darkSkyCall(latLong, today);
  });
  darkSkyCall(latLong, today);
}

initializeLoc();

var setLocation = function setLocation(location, latLong) {
  return $('#location').text(location);
};

var darkSkyCall = function darkSkyCall(latLong, currDate) {
  var currDate = currDate.getUnixTime();
  var weatherUrl =
    'https://api.darksky.net/forecast/40e45d1879074e6e344b5d3d7164baf3/' + latLong + ',' + currDate;

  $.ajax({
    url: weatherUrl,
    dataType: 'jsonp',
    success: getWeather,
  });
};

var setIcon = function setIcon(icon) {
  var skycons = new Skycons({ color: 'white' });
  skycons.add('icon1', icon);
  skycons.play();
};

var getWeather = function getWeather(res) {
  var timestamp = res.currently.time;
  var date = new Date(timestamp * 1000);
  var currentDate =
    ('0' + date.getDate()).slice(-2) +
    '/' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '/' +
    date.getFullYear();
  var summary = res.currently.summary;
  var hourlySummary = res.hourly.summary;
  var icon = res.currently.icon;
  var temperatureF = Math.round(res.currently.temperature);
  var apparentTemperatureF = Math.round(res.currently.apparentTemperature);

  //console.log(icon);
  if (res.currently.icon === 'cloudy') {
    document.body.style.backgroundImage = "url('img/cloudy.jpg')";
  } else if (res.currently.icon === 'clear-day') {
    document.body.style.backgroundImage = "url('img/clear_day.jpg')";
  } else if (res.currently.icon === 'partly-cloudy-day') {
    document.body.style.backgroundImage = "url('img/partly_cloudy_day.jpg')";
  } else if (res.currently.icon === 'clear-night') {
    document.body.style.backgroundImage = "url('img/clear-night.jpg')";
  } else if (res.currently.icon === 'rain') {
    document.body.style.backgroundImage = "url('img/rain.jpg')";
  } else if (res.currently.icon === 'cloudy-night') {
    document.body.style.backgroundImage = "url('img/cloudy_night.jpg')";
  } else if (res.currently.icon === 'snow') {
    document.body.style.backgroundImage = "url('img/snow.jpg')";
  } else {
    document.body.style.backgroundImage = "url('img/wolfs.jpg')";
  }

  setWeather(currentDate, summary, hourlySummary, temperatureF, apparentTemperatureF);
  setIcon(icon);
};

var setWeather = function setWeather(
  currentDate,
  summary,
  hourlySummary,
  temperatureF,
  apparentTemperatureF
) {
  var celciusConv = function celciusConv(fTemp) {
    return (fTemp - 32) * 0.5556;
  };

  var temperatureC = Math.round(celciusConv(temperatureF));
  var apparentTemperatureC = Math.round(celciusConv(apparentTemperatureF));
  $('#real-temp').text(temperatureC + '°C');
  $('#currDate').text(currentDate);
  $('#feels-temp').text(apparentTemperatureC + '°C');
  $('#weather-type').text(summary);
  $('#weather-summ').text(hourlySummary);

  var celcius = false;
  $('#cToF').on('click', function() {
    if (celcius == false) {
      $('#real-temp').text(temperatureF + '°F');
      $('#feels-temp').text(apparentTemperatureF + '°F');
      celcius = true;
    } else if (celcius == true) {
      $('#real-temp').text(temperatureC + '°C');
      $('#feels-temp').text(apparentTemperatureC + '°C');
      celcius = false;
    }
  });
};

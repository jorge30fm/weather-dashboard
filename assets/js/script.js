// var openWeatherOneCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&units=imperial&appid=53ccd26c1fadfaadacd4cc215cca25ea'

// var geoCoding = 'https://openweathermap.org/api/geocoding-api'

//api.openweathermap.org/data/2.5/weather?q=charlotte,us&APPID=53ccd26c1fadfaadacd4cc215cca25ea

var cityName = '';


var searchBar = $("#searchbar");
var searchBtn = $('#search-btn');
var place = $("#city-name");
var tempNow = $("#temp0");
var windNow = $("#wind0");
var humidNow = $("#humidity0");
var uvIndex =$("#UV0")

function fetchData() {
        var openWeatherData = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName +',us&appid=53ccd26c1fadfaadacd4cc215cca25ea';
        fetch(openWeatherData)
        .then(function(response) {
                return response.json();
        })
        .then (function(data) {
                place.text(data.name);

                var OneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon +'&units=imperial&appid=53ccd26c1fadfaadacd4cc215cca25ea';

                fetch(OneCallUrl)
                .then (function(response) {
                        return response.json();
                })
                .then (function(data) {
                        console.log(data)
                        tempNow.text(data.current.temp);
                        uvIndex.text(data.current.uvi);
                        windNow.text(data.current.wind_speed);
                        for(i = 0; i < 6; i++) {
                                var temperature = $("#temp" + i);
                                temperature.text(data.daily[i].temp.day);
                                var winds =$("#wind"+ i);
                                winds.text(data.daily[i].wind_speed);
                                var hum =$("#humidity" + i);
                                hum.text(data.daily[i].humidity);

                                var iconEl = $("#icon"+ i);
                                var iconCode = data.daily[i].weather[0].icon;
                                var iconUrl ="http://openweathermap.org/img/w/" + iconCode + ".png";
                                iconEl.html("<img src='" + iconUrl + "'>");
                        }
                })

        })


};


var displayData = function(weatherData) {
        console.log("success")

}
searchBtn.click(function() {
        cityName = searchBar.val().trim();
        cityName = cityName.toLowerCase();
        if (cityName){
                fetchData()
        };
});
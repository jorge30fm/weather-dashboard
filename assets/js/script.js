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
var uvIndex =$("#UV0");
var searchedCities = [];
var searchHistoryList =$("#searchHistory");

var displaySearchHistory = function() {

        if (localStorage.getItem("SearchHistory") != null) {
                searchHistoryList.html('')
                var searchTitle = $("<h3 class='title'>Search History</h3>");
                searchHistoryList.append(searchTitle);
                searchedCities = JSON.parse(localStorage.getItem("SearchHistory"))
                for(i = 0; i < searchedCities.length; i ++) {
                        var city = searchedCities[i];
                        var searchItem = $("<button class='col-12 mar-t searchHistorybtn'>" + city + "</button>"
                        )
                        searchItem.attr("id", city)
                        searchHistoryList.append(searchItem)
                }
        }
}

displaySearchHistory();
var fetchAndDisplayData = function() {

        //get latitude and longitude from api
        var openWeatherData = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName +',us&appid=53ccd26c1fadfaadacd4cc215cca25ea';
        fetch(openWeatherData)
        .then(function(response) {
                return response.json();
        })
        .then (function(data) {
                place.text(data.name);
                //use lat and lon to get weather data for selected city
                var OneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon +'&units=imperial&appid=53ccd26c1fadfaadacd4cc215cca25ea';

                fetch(OneCallUrl)
                .then (function(response) {
                        return response.json();
                })
                .then (function(data) {
                        //display weather data on page
                        var city = data.name + ' - ';
                        var weatherEl = $(".display-weather"); //set display to block so that it shows when button is pressed
                        weatherEl.attr("id", "display-on");
                        tempNow.text(data.current.temp);
                        uvIndex.text(data.current.uvi);
                        if (data.current.uvi < 3) {
                                $("#UV0").css("background-color", "green");
                        }
                        else if (data.current.uvi < 6) {
                                $("#UV0").css("background-color", "yellow");
                        } else if (data.current.uvi < 8) {
                                $("#UV0").css("background-color", "orange");
                        } else if (data.current.uvi < 11) {
                                $("#UV0").css("background-color", "red");
                        } else if (data.current.uvi > 10) {
                                $("#UV0").css("background-color", "purple");
                        }
                        windNow.text(data.current.wind_speed); //add data for next 5 days
                        for(i = 0; i < 6; i++) {
                                var date = moment();
                                var dateEl = $('#date'+ i);
                                dateEl.text(date.add(i, 'days').format('L'))
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
                        displaySearchHistory();
                })

        })
        .catch(function(error){
                alert("City Not Found")
        })


};

//on click, display weather data of selected city
searchBtn.click(function() {
        cityName = searchBar.val().trim();
        cityName = cityName.toLowerCase();
        saveCity()
        if (cityName){
                fetchAndDisplayData()
        };
});

//get city name from search bar
//if name already in local storage, then do nothing
//if not in local storage, save
//create a button with the city name
//when button clicked, display city data
var saveCity = function() {
        if (localStorage.getItem("SearchHistory")==null) {
                // var cityInArray =(searchedCities.indexOf(cityName))
                // if (cityInArray === -1) {
                        searchedCities.push(cityName)
                        localStorage.setItem("SearchHistory", JSON.stringify(searchedCities));
        } else {
                searchedCities = JSON.parse(localStorage.getItem("SearchHistory"))
                var cityInArray = (searchedCities.indexOf(cityName))
                        if (cityInArray === -1) {
                                searchedCities.push(cityName)
                                localStorage.setItem("SearchHistory", JSON.stringify(searchedCities));
                        }

        }

}
//when saved cities button is clicked, display their data
searchHistoryList.on('click', 'button', function(event){
       cityName = $(event.target).attr('id'); //get id of button selected, id is name of the city
       console.log(cityName)
       fetchAndDisplayData()
})



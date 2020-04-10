import React from 'react';
import ReactAnimatedWeather from 'react-animated-weather';


const defaults = {
    icon: 'CLEAR_DAY',
    color: 'black',
    size: 50,
    animate: true
};

function Weather({ zipcode }) {

    let [weatherData, setWeatherData] = React.useState({ temp: '', icon: ''});
    let [error, setError] = React.useState(false);
    let [zipCode] = React.useState(zipcode);
    let [weatherFetched, setWeatherFetched] = React.useState(false);

    function fetchWeather() {
        if (!weatherFetched) {
            let zip = parseInt(zipCode);
            let url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&APPID=b1630a5c4e2d490b0aaacab53d1be8f3`;
            fetch(url)
                .then((response) => {
                    return response.json()
                })
                .then((responsejson) => {
                    let liveWeatherData = {
                        temp: Math.ceil(responsejson.main.temp),
                        conditions: responsejson.weather[0].icon
                    };
    
                    setWeatherData(liveWeatherData)
                    setWeatherFetched(true);
                })
                .catch((error) => {
                    setError(true);
                });
        } 
    }

    function getWeatherIcon() {
        switch (weatherData.conditions) {
            case '01d':
            case '01n':
                return 'CLEAR_DAY'
            case '02d':
            case '02n':
                return 'PARTLY_CLOUDY_DAY'
            case '03d':
            case '03n':
            case '04d':
            case '04n':
                return 'CLOUDY'
            case '09d':
            case '09n':
                return 'PARTLY_CLOUDY_DAY'
            case '10d':
            case '10n':
                return 'RAIN'
            case '11d':
            case '11n':
                return 'RAIN'
            case '13d':
            case '13n':
                return 'SNOW'
            case '50d':
            case '50n':
                return 'FOG'
            default:
                return 'CLEAR_DAY'
        }
    }

    const fontStyleTemp = {
        fontSize: '20px',
        position: 'relative',
        bottom: '14px',
        left: '9px'
    }

    return (
        <div>
            {
                zipCode.length > 1 ?
                    <div>
                        {fetchWeather()}
                        {
                            weatherData.temp && !error ? 
                            <div> 
                              <ReactAnimatedWeather
                                    icon={getWeatherIcon()}
                                    color={defaults.color}
                                    size={defaults.size}
                                    animate={defaults.animate}
                                />
                                <span style={fontStyleTemp}>{weatherData.temp}&#176;</span>
                            </div>
                            :
                            <div></div>
                        }
                    </div>
                    :
                    <div></div>
            }

        </div>
    )
}

export default Weather;
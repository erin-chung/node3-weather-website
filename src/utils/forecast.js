const request = require('request')

const forecast = (latitude, longitude, callback) => {

    const url = 'http://api.weatherstack.com/current?access_key=4748ae411a0e06cbe417e0ef09ac8a0b&query='+latitude+','+longitude
    
    request({url, json: true}, (error, {body})=>{

        if(error){
            callback('Unable to connect to weather service', undefined);
        } else if (body.error){
            callback('Unable to find location', undefined)
        } else {
            const forecastData = body.current.weather_descriptions + ". It is currently " + body.current.temperature + " degrees out. There is a " + body.current.precip + "% chance of rain. The humidity is " + body.current.humidity + "% and the UV index is " + body.current.uv_index + "."
            const approximateLocation = body.location.name + ", " + body.location.country
            callback(undefined, {forecastData, approximateLocation});
        }
    })

}

module.exports = forecast
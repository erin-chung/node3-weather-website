const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup hanldebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: "Weather",
        name: "Erin Chung"
    })
})
app.get('/about', (req,res) => {
    res.render('about', {
        title: "About me",
        name: "Erin Chung"
    })
})
app.get('/help', (req,res) => {
    res.render('help', {
        title: "Help",
        name: "Erin Chung",
        helpText: "This is some helpful text."
    })
})
app.get('/weather', (req, res) => {
    if(!req.query.address && !(req.query.latitude && req.query.longitude)){
        return res.send({
            error: 'You must provide a location.'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {

        if(!req.query.address){
            latitude = req.query.latitude
            longitude = req.query.longitude
            location = req.query.location
        } 

        forecast(latitude, longitude, (error, {forecastData, approximateLocation}) => {
            if(error) return res.send({error:error})
            
            if(!location) location = approximateLocation

            res.send({
                forecast: forecastData,
                location: location
            })
        })
    })
})

app.get('/products', (req,res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res)=>{
    res.render('404', {
        title: "404",
        error: "Help article not found.",
        name: "Erin Chung"
    })
})

app.get('*', (req, res)=>{
    res.render('404', {
        title: "404",
        error: "Page not found.",
        name: "Erin Chung"
    })
})
app.listen(port, () => {
    console.log('Server is up on port ' + port);
})
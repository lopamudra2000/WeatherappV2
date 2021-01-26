const path = require('path')
const express = require('express')
const hbs=require('hbs')
const geocode = require('./utils/geocode')
const forecast=require('./utils/forecast')

const app = express()

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath=path.join(__dirname, '../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')

//Set up handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//setup static directoy to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index',{
        title:"Weather",
        Name:"Lopa"
    })
})
app.get('/about', (req, res) => {
    res.render('about',{
        title:"about",
        Name:"Lopa"
    })
})
app.get('/help', (req, res) => {
    res.render('help',{
       message:"I am here to help you out.",
       title:"help",
       Name:"lopa"
    })
})
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})
app.get('/help/*',(req,res)=>{
    res.render('404',{
        title:"404:help page not found",
        error:'Help page not found',
        Name:"lopa"
    })

})

app.get('*',(req,res)=>{
    res.render('404',{
        title:"404",
        error:'404:not found',
        Name:"lopa"
    })

})
app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
const { response } = require('express');
require("dotenv").config();
const express = require('express')
const https = require('https');
const bodyParser = require("body-parser");

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/index.html");
});
app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname+"/styles.css");
});

app.post("/", (req,res) => {
    
    const query = req.body.cityName;
    
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+process.env.apiKey+"&units="+unit
    https.get(url, function(response){
        console.log(response.statusCode);
        response.on('data', (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL="http://openweathermap.org/img/wn/"+icon+"@2x.png"
            res.write("<p>The Weather is currently "+desc+"</p>");
            res.write("<h1>The Temperature in "+query+" is "+temp+" degree Celcius</h1>");
            res.write("<img src="+imageURL+">");
            res.send();
        });
    });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
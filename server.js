const express = require('express');
const app = express()

const cities = [
  {"name": "Budapest",
  "country": "Hungary",
  "continent": "Europe"},
  {"name": "Tokyo",
  "country": "Japan",
  "continent": "Asia"},
]

app.use(express.static('client'));
app.use(express.json());

app.get('/cities', function(req, resp){
    resp.send(cities)
  })

app.get('/city/:name', function(req, resp){ //url search aka useless for now
    let cityName = req.params.name;
    let found = false;
    for (let city of cities) {
        if (city.name.toLowerCase() == cityName.toLowerCase()){
            resp.send(city);
            found = true;
            break;
        }
    }
    if(!found){
        resp.send("No such city");
    }
});

app.get('/citysearch', function(req, resp){
    let input = req.query.input;
    let results = [];
  
    if(input){ 
      for (let city of cities) {
          if (city.continent.toLowerCase() == input.toLowerCase() || city.country.toLowerCase() == input.toLowerCase() || city.name.toLowerCase() == input.toLowerCase()){
              results.push(city);
          }
      }
    }
    if(results.length == 0){
        resp.send("No city found");
    }
    else{
        resp.send(results);
    }
        
  });

app.post('/addcity', function(req, resp){
    const name = req.body.name;
    const country = req.body.country;
    const continent = req.body.continent;
    const newCity = {name, country, continent};
    cities.push(newCity); 
});


app.listen(8090)
console.log('Server running at http://127.0.0.1:8090/');
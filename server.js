const express = require('express');
const res = require('express/lib/response');
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

app.get('/cities', function(req, resp){
    resp.send(cities)
  })

app.get('/city/:name', function(req, resp){
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
  let continent = req.query.continent;
  let results = [];
  for (let city of cities) {
      if (city.continent.toLowerCase() == continent.toLowerCase()){
          results.push(city);
      }
  }
  resp.send(results);
});


app.listen(8090)
console.log('Server running at http://127.0.0.1:8090/');
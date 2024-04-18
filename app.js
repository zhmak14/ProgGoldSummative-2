const express = require('express');
const app = express();
const fs = require('fs');
const cities = require("./citiesfile.json");
const multer = require('multer');
const activities = require("./activitiesfile.json");

//This piece of code configures multer and is referenced in README.txt, 
//written with the help of npmjs.com (official multer page) and Stack Overflow thread (link in README)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const uploadImg = multer({storage: storage});
//This piece of code configures multer and is referenced in README.txt, 
//written with the help of npmjs.com (official multer page) and Stack Overflow (link in README)


app.use(express.static('client'));
app.use(express.json());
app.use('/images', express.static('images'));

app.get('/cities', function(req, resp) {
    resp.send(cities);
  });

  

app.get('/city/:name', function(req, resp) {
    let cityName = req.params.name;
    let found = false;
    for (let city of cities) {
        if (city.name.toLowerCase() == cityName.toLowerCase()) {
            resp.send(city);
            found = true;
            break;
        }
    }
    if(!found){
        resp.send("No such city");
    }
});

app.get('/citysearch', function(req, resp) {
    let input = req.query.input;
    let results = [];
  
    if(input){ 
      for (let city of cities) {
          if (city.continent.toLowerCase() == input.toLowerCase() || city.country.toLowerCase() == input.toLowerCase() || city.name.toLowerCase() == input.toLowerCase()){
              results.push(city);
          }
      }
    }
    if (results.length == 0) {
        resp.json({message: "Sorry, nothing found"});
    }
    else {
        resp.send(results);
    }
        
  });

app.post('/addcity', uploadImg.single('image'),function(req, resp) {
    const name = req.body.name;
    const country = req.body.country;
    const continent = req.body.continent;
    const picture = `images/${req.file.filename}`;
    const newCity = {name, country, continent, picture};
    cities.push(newCity);
    console.log(JSON.stringify(cities));
    fs.writeFile('./citiesfile.json', JSON.stringify(cities), (error) => {
        if (error) {
            console.error("File not written", error);
            resp.status(400).send("City not added");
        } else {
            resp.status(200).send("City added");
        }
    });
});

app.get('/activities', function(req, resp) {
    let activityCity = req.query.city.toLowerCase();
    let activityResults = [];
    for (let activity of activities) {
        if (activityCity.toLocaleLowerCase() == activity.city.toLocaleLowerCase()) {
            activityResults.push(activity);
        }
    }
    resp.json(activityResults); 
});

module.exports = app;
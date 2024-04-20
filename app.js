const express = require('express');
const app = express();
const fs = require('fs');
const cities = require('./citiesfile.json');
const multer = require('multer');
const activities = require('./activitiesfile.json');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const uploadImg = multer({ storage });

app.use(express.static('client'));
app.use(express.json());
app.use('/images', express.static('images'));

app.get('/cities', function (req, resp) {
    resp.send(cities);
  });

app.get('/city/:name', function (req, resp) {
    const cityName = req.params.name;
    let found = false;
    for (const city of cities) {
        if (city.name.toLowerCase() === cityName.toLowerCase()) {
            resp.send(city);
            found = true;
            break;
        }
    }
    if (!found) {
        resp.send('No such city');
    }
});

app.get('/citysearch', function (req, resp) {
    const input = req.query.input;
    const results = [];

    if (input) {
      for (const city of cities) {
          if (city.continent.toLowerCase() === input.toLowerCase() || city.country.toLowerCase() === input.toLowerCase() || city.name.toLowerCase() === input.toLowerCase()) {
              results.push(city);
          }
      }
    }
    if (results.length === 0) {
        resp.json({ message: 'Sorry, nothing found' });
    } else {
        resp.send(results);
    }
  });

app.post('/addcity', uploadImg.single('image'), function (req, resp) {
    const name = req.body.name;
    const country = req.body.country;
    const continent = req.body.continent;
    const picture = `images/${req.file.filename}`;
    const newCity = { name, country, continent, picture };
    cities.push(newCity);
    console.log(JSON.stringify(cities));
    fs.writeFile('./citiesfile.json', JSON.stringify(cities, null, 2), (error) => {
        if (error) {
            resp.status(400).send('City not added');
        } else {
            resp.status(200).send('City added');
        }
    });
});

app.get('/activities', function (req, resp) {
    const activityCity = req.query.city.toLowerCase();
    const activityResults = [];
    for (const activity of activities) {
        if (activityCity.toLocaleLowerCase() === activity.city.toLocaleLowerCase()) {
            activityResults.push(activity);
        }
    }
    resp.json(activityResults);
});

app.post('/addactivity', uploadImg.none(), (req, resp) => {
    const name = req.body.name;
    const type = req.body.type;
    const kids = req.body.kids;
    const city = req.body.city;
    const newActivity = { name, type, kids, city };
    activities.push(newActivity);
    fs.writeFile('./activitiesfile.json', JSON.stringify(activities, null, 2), (error) => {
        if (error) {
            console.error('Failed to save new activity', error);
            resp.status(400).send('Failed to add activity');
        } else {
            resp.status(200).send('Activity added');
        }
    });
});

module.exports = app;

const request = require('supertest');
const app = require('./app');


describe('Test the cities service', () => {
    test('GET /cities succeeds', () => {
        return request(app)
	    .get('/cities')
	    .expect(200);
    });

    test('GET /cities returns JSON ', () => {
        return request(app)
	    .get('/cities')
	    .expect('Content-type', /json/);
    });

    test('GET /citysearch succeeds', () => {
        return request(app)
	    .get('/citysearch')
	    .expect(200);
    });

    test('GET /citysearch returns JSON ', () => {
        return request(app)
	    .get('/citysearch')
	    .expect('Content-type', /json/);
    });


 //unfortunately could not figure out how to make this one work because of the image upload
    test('POST /addcity succeeds', () => {   
        const params = {"name":"name","country":"country","continent":"continent","picture":"image.jpg"};
        return request(app)
        .post('/addcity')
        .send(params)
	    .expect(200);
    });
});

describe('Test the activities service', () => {
    test('GET /activities for Tokyo as example succeeds', () => {
        return request(app)
	    .get('/activities?city=tokyo')
	    .expect(200);
    });

    test('GET /activities returns JSON For Tokyo as example', () => {
        return request(app)
	    .get('/activities?city=tokyo')
	    .expect('Content-type', /json/);
    });

    test('POST /addactivity succeeds', () => {
        const params = {"name":"name","type":"type","kids":"answer","city":"city"};
        return request(app)
        .post('/addactivity')
        .send(params)
	    .expect(200);
    });
});
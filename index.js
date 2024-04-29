const express = require('express');
const Express = express;
const { config } = require('dotenv');

config();

// ============================ import from route =======================================
const routeAdmin = require('./src/Route/AdminRoute');
const routeSite = require('./src/Route/SiteRoute');
const routeMark = require('./src/Route/MarkRoute');
// ============================ END import from route =======================================

const app = new Express();

app.use(Express.json());

app.get('/v1.0.0/testing', (req, res) => {
  res.send('hello world');
});

app.use('/v1.0.0/admin', routeAdmin);

app.use('/v1.0.0/site', routeSite);

app.use('/v1.0.0/mark', routeMark);

app.listen(process.env.APP_PORT, () => {
  console.log(`server is running on port ${process.env.APP_PORT}`);
});

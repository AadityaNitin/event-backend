// require('dotenv').config()
// require('dotenv').config({ path: "./.env" });
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { getSecret } = require('./secrets');
const usersRoute = require('./routes/users');
const eventsRoute = require('./routes/events');
const guestRoute = require("./routes/guests")
var cors = require('cors')
mongoose.Promise = global.Promise;
mongoose.connect(getSecret('dbUri')).then(
  () => {
    console.log('Connected to mongoDB');
  },
  (err) => console.log('Error connecting to mongoDB', err)
);

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 204,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/users', usersRoute);
app.use('/api/events', eventsRoute);
app.use("/api/guest", guestRoute)


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app };

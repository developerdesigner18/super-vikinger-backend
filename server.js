const express = require("express");
const mongooes = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
var corsOptions = {
  origin: "http://localhost:8080",
};
// set port, listen for requests
const PORT = process.env.PORT || 8080;

const uri =
  "mongodb+srv://JenishChopda:Jenish2501@cryptorpg.play5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

try {
  mongooes.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () =>
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
      })
  );
  // Make the appropriate DB calls
  // listDatabases(client);
} catch (e) {
  console.error(e);
}

const dbConnection = mongooes.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));

app.use(cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
// simple route

app.use(express.urlencoded({ extended: false }));

app.use(express.static("temp"));

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// -------------------setStorage for multer----------------

// ---------------require Routes
require("./routes/index.js")(app);

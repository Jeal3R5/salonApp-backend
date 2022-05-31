///////////////////////////////////////
//DEPENDENCIES
///////////////////////////////////////
//GET .ENV VARIABLES
require("dotenv").config();
//PULL PORT FROM .ENV, GIVE DEFAULT VALUE OF 3001
const { PORT = 3001, DATABASE_URL } = process.env;
//IMPORT EXPRESS
const express = require("express");
//IMPORT MONGOOSE
const mongoose = require("mongoose");
//IMPORT CORS
const cors = require("cors");
//IMPORT MORGAN
const morgan = require("morgan");
//CREATE APPLICATION OBJECT
const app = express();

///////////////////////////////////////
//DATABASE CONNECTION
///////////////////////////////////////
//ESTABLISH CONNECTION
mongoose.connect(DATABASE_URL);

//CONNECT EVENTS
mongoose.connection
  .on("open", () => console.log("MongoDB Connected"))
  .on("close", () => console.log("MongoDB Disconnected"))
  .on("error", (error) => console.log(error));

///////////////////////////////////////
//MODELS
///////////////////////////////////////
//This info can be moved to its own component, do that please and don't forget to require it
const StylistSchema = new mongoose.Schema({
  name: String,
  experience: String,
  level: String,
  specialty: String,
  schedule: String,
});

const Stylist = mongoose.model("Stylist", StylistSchema);

///////////////////////////////////////////////////////
//MIDDLEWARE
///////////////////////////////////////////////////////
app.use(cors()); //to prevent cors errors
app.use(morgan("dev")); //logging
app.use(express.json()); //parse json bodies

//CREATE A TEST ROUTE
app.get("/", (req, res) => {
  res.send("hello world");
});

///////////////////////////////////////
//ROUTES
///////////////////////////////////////

//INDEX ROUTE
app.get("/stylists", async (req, res) => {
  try {
    //send all staff
    res.json(await Stylist.find({}));
  } catch (error) {
    //SEND ERROR
    res.status(400).json(error);
  }
});

//DELETE ROUTE
app.delete("/stylists/:id", async (req, res) => {
  try {
    //send all people
    res.json(await Stylist.findByIdAndDelete(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//UPDATE ROUTE
app.put("/stylists/:id", async (req, res) => {
  try {
    //send all staff
    res.json(
      await Stylist.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//CREATE ROUTE
app.post("/stylists", async (req, res) => {
  try {
    //send all staff
    res.json(await Stylist.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//SHOW ROUTE
app.get("/stylists/:id", async (req, res) => {
  try {
    res.json(await Stylist.findById(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

//LISTENER
app.listen(PORT, () => {
  console.log(`They're listening in on port ${PORT}`);
});


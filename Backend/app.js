const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const Task = require("./models/task");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const MONGODB_URI =
  "mongodb+srv://internship:internship@cluster0.6jfepzz.mongodb.net";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/addData", async (req, res) => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const responseData = response.data;

    console.log("API Response:", responseData);
    // Check if responseData is an array
    // if (!Array.isArray(responseData)) {
    //   throw new Error("Response data is not an array");
    // }

    // Extract data for the top ten symbols
    const extractedData = [];
    let count = 0; // Initialize a count variable

    for (const symbol in responseData) {
      if (responseData.hasOwnProperty(symbol)) {
        const item = responseData[symbol];
        extractedData.push({
          name: item.name,
          last: item.last,
          buy: item.buy,
          sell: item.sell,
          volume: item.volume,
          base: item.base_unit,
        });
        count++; // Increment the count

        if (count >= 10) {
          // Stop processing after the top ten items
          break;
        }
      }
    }

    console.log("Extracted Data:", extractedData);

    // Save the extracted data to the "task" collection in MongoDB
    await Task.insertMany(extractedData);

    res.json({ message: "Data saved successfully", data: extractedData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/getData", async (req, res) => {
  try {
    const doc = await Task.find();
    res.json(doc);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

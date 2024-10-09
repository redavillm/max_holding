const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const stockRoutes = require("./routes/stockRoutes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);

MongoClient.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to MongoDB");

    app.use("/api/stock", stockRoutes(client.db("hrTest")));

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server app listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

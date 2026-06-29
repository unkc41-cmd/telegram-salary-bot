const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK BOT IS RUNNING");
});

app.post("/webhook", (req, res) => {
  console.log("update received");
  res.send("ok");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
app.listen(process.env.PORT || 3000);

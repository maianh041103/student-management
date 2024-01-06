const express = require('express');
const app = express();

const port = 3000;

app.use("/", (req, res) => {
  res.send("OK");
})

app.listen(port, () => {
  console.log("App listen on port : " + port);
})
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const config = require('./config');

app.use(cors());
app.use(fileUpload());
app.use(express.static('./server'));

app.post('/upload/image', function (req, res) {
  const {image} = req.files;
  image.mv(path.resolve(`./server/static/media/${image.name}`));

  res.send(`${config.homeUrl}:${config.port}/static/media/${image.name}`);
});


app.listen(config.port, function () {
  console.log(`Server listening on port ${config.port}`);
});

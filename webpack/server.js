var express = require('express');
var app = express();

app.use(express.static('dist'));

app.listen(9001, function () {
  console.log('Server listening!');
  console.log("TEU_API",process.env.TEU_API);
});

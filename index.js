var express = require("express"); //Express Web Server
var bodyParser = require("body-parser"); //connects bodyParsing middleware
var formidable = require("formidable");
var path = require("path"); //used for file path
var app = express();
var cors = require("cors");
const formidableMiddleware = require("express-formidable");
const { readFileSync } = require("fs");
const PassportValidation = require("passport-validation");
// app.use(express.static(path.join(__dirname, 'public')));

/* ========================================================== 
 bodyParser() required to allow Express to see the uploaded files
============================================================ */
app.use(formidableMiddleware());
app.use(cors());

app.post("/passport-validation", async (req, res) => {
  req.fields; // contains non-file fields
  req.files; // contains files
  if (
    !req.fields.data ||
    !Object.keys(req.files).length ||
    !req.files["passport-image"]
  ) {
    res.status(200).json({ error: "no image found" });
    return;
  }

  const params = JSON.parse(req.fields.data);
  console.log(params, req.files);
  console.log(req.files["passport-image"].path);

  //get an image
  const base64Image = readFileSync(req.files["passport-image"].path);

  const passportValidation = new PassportValidation({
    image: base64Image,
    passportNumber: params.passportNumber,
    dob: params.dob,
  });
  const result = await passportValidation.process();
  console.log("result", result);
  res.status(200).json({ result: result });
});
var server = app.listen(3030, function () {
  console.log("Listening on port %d", server.address().port);
});

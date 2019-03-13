var express = require('express');
var router = express.Router();
const CryptoJS = require('crypto-js')
var base64 = require('base-64');
const fs = require('fs')
const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'))


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("q1")
});

router.get('/:q', function(req, res, next) {
  var decrypt = CryptoJS.AES.decrypt(base64.decode(req.params.q), process.env.SECRET).toString(CryptoJS.enc.Utf8)
  var selector = decrypt.split("/")[1]
  res.render(selector, {title: questions[selector]['name']})
})

module.exports = router;

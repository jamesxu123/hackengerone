var express = require('express')
var router = express.Router()
const CryptoJS = require('crypto-js')
var base64 = require('base-64')
const fs = require('fs')
const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'))
const axios = require('axios')


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render("splash")
})

router.get('/begin', function (req, res, next) {

    let reportData = {
        "timestamp": Date.now() / 1000,
        "namespace": "hackenger1",
        "question": "q1",
        "state": "loaded"
    }

    axios.post(process.env.STATSENGINE + "/reportInternal", {
        info: reportData,
        key: process.env.STATSKEY
    }, {
        headers: {
            'content-type': 'application/json'
        }
    })

    res.render('q1', {
        title: questions['q1']['name'],
        code: base64.encode(CryptoJS.AES.encrypt("MH6HHOneWinner" + Math.floor(new Date() / 1000), process.env.SECRET))
    })
})

router.get('/:q', function (req, res, next) {
    var decrypt = CryptoJS.AES.decrypt(base64.decode(req.params.q), process.env.SECRET).toString(CryptoJS.enc.Utf8)
    var selector = decrypt.split("/")[1]

    let reportData = {
        "timestamp": Date.now() / 1000,
        "namespace": "hackenger1",
        "question": selector,
        "state": "loaded"
    }

    axios.post(process.env.STATSENGINE + "/reportInternal", {
        info: reportData,
        key: process.env.STATSKEY
    }, {
        headers: {
            'content-type': 'application/json'
        }
    })

    res.render(selector, {
        title: questions[selector]['name'],
        code: base64.encode(CryptoJS.AES.encrypt("MH6HHOneWinner" + Math.floor(new Date() / 1000), process.env.SECRET))
    })
})

module.exports = router

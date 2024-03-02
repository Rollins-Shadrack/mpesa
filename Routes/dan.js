const router = require('express').Router()

const { AccessToken, stkPush } = require("../Controllers/mpesaDanController");

router.get('/', AccessToken)

router.post('/',AccessToken, stkPush)

module.exports = router
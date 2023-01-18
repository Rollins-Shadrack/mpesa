const express = require('express')
const router = express.Router();
const mpesaController = require('../Controllers/mpesaController')
router.get('/',mpesaController.mpesaPassword)
router.get('/stkpush',(req,res)=>{
    res.send('stkpsh')
})
router.post('/stkpush',mpesaController.token,mpesaController.stkPush)
 router.get('/register',mpesaController.RegisterUrl)
 
module.exports = router
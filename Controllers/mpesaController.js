require('dotenv').config()
const passkey = process.env.PASSKEY
const shortcode = process.env.SHORTCODE
const consumerkey = process.env.CONSUMERKEY
const consumerSecret = process.env.CONSUMERSECRET
const datetime = require('node-datetime')
const axios = require('axios')

const newPassword = () => {
    const dt = datetime.create()
    const formatted = dt.format('YmdHMS')

    const passString = shortcode + passkey + formatted;
    const base63EncodedPass = Buffer.from(passString).toString('base64')

    return base63EncodedPass;
}



//console.log(formatted)
let mpesaPassword = (req, res) => {
    res.send(newPassword())


}

let token = (req, res, next) => {
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    const auth = "Basic " + Buffer.from(consumerkey + ':' + consumerSecret).toString('base64');
    const headers = {
        "Authorization": auth
    }
    axios.get(url, {
        headers: headers
    }).then((response) => {
        // console.log(response.data);
        let data = response.data
        let access_token = data.access_token
        req.token = access_token
        next()
    }).catch((error) => { console.log(error.message) })


}
//Registering URL
let RegisterUrl = (req, res) => {
    const token = req.token;
    
let unirest = require('unirest');
 req = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl')
.headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+ token
})
.send(JSON.stringify({
    "ShortCode": 600977,
    "ResponseType": "Completed",
    "ConfirmationURL": "http://127.0.0.1.3000/confirmation",
    "ValidationURL": "http://127.0.0.1.3000/validation",
  }))
.end(res => {
    if ((error)=>{console.log(error);}) 
    console.log(res.raw_body);
});
}

//Lipa na Mpesa Online Payment
let stkPush = (req, res) => {
    const token = req.token
    // console.log(token)
    const dt = datetime.create()
    const formatted = dt.format('YmdHMS')

    let datenow = new Date();
    const passString = shortcode + passkey + formatted;
    const password = Buffer.from(passString).toString('base64')
    req.Expass = password
    req.time = formatted

    axios({
        method: 'post',
        url: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        data: JSON.stringify({
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": formatted,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": 1,
            "PartyA": 254715976015,
            "PartyB": shortcode,
            "PhoneNumber": 254715976015,
            "CallBackURL": "http://8bfe-2c0f-fe38-2402-9657-69b4-fd6b-6751-d13b.ngrok.io",
            "AccountReference": "Rolltech",
            "TransactionDesc": "lipa na Mpesa"
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then((response) => {
        console.log(response.data)
        req.CheckoutRequestID = response.data.CheckoutRequestID

    }).catch((error) => { console.log(error.message) })



}


module.exports = {
    mpesaPassword: mpesaPassword,
    token: token,
    stkPush: stkPush,
    RegisterUrl: RegisterUrl
}
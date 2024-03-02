const asyncHandler = require("express-async-handler");
const consumerkey = process.env.CONSUMERKEY;
const consumerSecret = process.env.CONSUMERSECRET;
const axios = require("axios");
const datetime = require("node-datetime");
const shortcode = process.env.SHORTCODE;
const passkey = process.env.PASSKEY;


const AccessToken = asyncHandler(async (req, res, next) => {
 const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
 const auth = "Basic " + Buffer.from(consumerkey + ":" + consumerSecret).toString("base64");
 const headers = {
   Authorization: auth,
 };
 axios
   .get(url, {
     headers: headers,
   })
   .then((response) => {
    // console.log(response.data);
     let data = response.data;
     let access_token = data.access_token;
       req.token = access_token;
       res.status(200).json(response.data)
     next();
   })
   .catch((error) => {
     console.log(error.message);
   });
});




const stkPush = asyncHandler(async (req, res, next) => {
    const token = req.token;
    const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    const dt = datetime.create();
    const formatted = dt.format("YmdHMS");

    const passString = shortcode + passkey + formatted;
    const password = Buffer.from(passString).toString("base64");
    

  axios({
    method: "post",
    url: "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    data: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: formatted,
      TransactionType: "CustomerPayBillOnline",
      Amount: 1,
      PartyA: 254746179246,
      PartyB: shortcode,
      PhoneNumber: 254746179246,
      CallBackURL: "http://8bfe-2c0f-fe38-2402-9657-69b4-fd6b-6751-d13b.ngrok.io",
      AccountReference: "Rolltech",
      TransactionDesc: "lipa na Mpesa",
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      console.log(response.data);
      req.CheckoutRequestID = response.data.CheckoutRequestID;
    })
    .catch((error) => {
      console.log(error.message);
    });
})
module.exports = {
    AccessToken,
    stkPush
};

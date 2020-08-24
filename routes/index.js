var express = require('express');
var router = express.Router();

var myApiKey = process.env.API_KEY;

const stripe = require('stripe')(myApiKey);

var dataBike = [
  {name:"BIKE 007", url:"/images/bike-1.jpg", price:777},
  {name:"CITY 500", url:"/images/bike-2.jpg", price:499},
  {name:"SPEED 20", url:"/images/bike-3.jpg", price:859},
  {name:"XTREM 800", url:"/images/bike-4.jpg", price:900},
  {name:"ELECTRIC 2020", url:"/images/bike-5.jpg", price:1500},
  {name:"XTREM 500", url:"/images/bike-6.jpg", price:1250},
]


/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.dataCardBike == undefined){
    req.session.dataCardBike = []
  }
  
  res.render('index', {dataBike:dataBike});
});

router.get('/shop', async function(req, res, next) {

  var alreadyExist = false;

  for(var i = 0; i< req.session.dataCardBike.length; i++){
    if(req.session.dataCardBike[i].name == req.query.bikeNameFromFront){
      req.session.dataCardBike[i].quantity = Number(req.session.dataCardBike[i].quantity) + 1;
      alreadyExist = true;
    }
  }

  if(alreadyExist == false){
    req.session.dataCardBike.push({
      name: req.query.bikeNameFromFront,
      url: req.query.bikeImageFromFront,
      price: req.query.bikePriceFromFront,
      quantity: 1
    })
  }

  var stripeCard = [];

  for(var i=0; i<req.session.dataCardBike.length; i++) {
      stripeCard.push({
        name: req.session.dataCardBike[i].name,
        amount: req.session.dataCardBike[i].price *100,
        currency: 'eur',
        quantity: req.session.dataCardBike[i].quantity
      })
  }

  var sessionStripeID;

  if(stripeCard.length>0) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeCard,
      success_url: 'http://192.168.1.62:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://192.168.1.62:3000/',
    });

    sessionStripeID = session.id

  }


  res.render('shop', {dataCardBike:req.session.dataCardBike, sessionStripeID});
});

router.get('/delete-shop', async function(req, res, next){
  
  req.session.dataCardBike.splice(req.query.position,1)

  var stripeCard = [];

  for(var i=0; i<req.session.dataCardBike.length; i++) {
      stripeCard.push({
        name: req.session.dataCardBike[i].name,
        amount: req.session.dataCardBike[i].price *100,
        currency: 'eur',
        quantity: req.session.dataCardBike[i].quantity
      })
  }

  var sessionStripeID;

  if(stripeCard.length>0) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeCard,
      success_url: 'http://192.168.1.62:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://192.168.1.62:3000/',
    });

    sessionStripeID = session.id

  }


  res.render('shop',{dataCardBike:req.session.dataCardBike, sessionStripeID})
})

router.post('/update-shop', async function(req, res, next){
  
  var position = req.body.position;
  var newQuantity = req.body.quantity;

  req.session.dataCardBike[position].quantity = newQuantity;

  var stripeCard = [];

  for(var i=0; i<req.session.dataCardBike.length; i++) {
      stripeCard.push({
        name: req.session.dataCardBike[i].name,
        amount: req.session.dataCardBike[i].price *100,
        currency: 'eur',
        quantity: req.session.dataCardBike[i].quantity
      })
  }

  var sessionStripeID;

  if(stripeCard.length>0) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeCard,
      success_url: 'http://192.168.1.62:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://192.168.1.62:3000/',
    });

    sessionStripeID = session.id

  }

  res.render('shop',{dataCardBike:req.session.dataCardBike, sessionStripeID})
})

router.get('/success', function(req, res, next){
  res.render('confirm');
})



module.exports = router;

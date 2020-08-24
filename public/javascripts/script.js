var stripe = Stripe('pk_test_jyrQKUOTPWy0zttB6U3cXLnj00a3bktwet');

document.getElementById("checkout").addEventListener("click", function(){
    stripe.redirectToCheckout({
        sessionId: sessionStripeID
      }).then(function (result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      });
})
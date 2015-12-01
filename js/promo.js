// Code to handle promo codes and pricing

// Initially hide the promotional price and promoMessage
$("#promoPrice").hide();
$("#promoMessage").hide();
function handleInvalid(msg) {
  $("#promoMessage").html("Not a valid code.");
};


$("#promoSubmit").on("click", function(e) {
  e.preventDefault();
  var request = $.ajax({
    crossDomain: true,
    method: "GET",
    url: "http://aws.local-box.org/promo",
    dataType: "json",
    data: {code: $("#promoCode").val()}
  });

  request.done(function(json) {
    if (json.valid) {
      $("#promoMessage").html("Code accepted");
      $("#promoMessage").show();
      $("#price").text(json.price);
      $("#price").css("text-decoration", "line-through");
      $("#promoPrice").show();
    } else {
      handleInvalid();
    }
  });
  request.fail(handleInvalid);
});

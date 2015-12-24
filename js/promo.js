// Code to handle promo codes and pricing

// Cross-origin-request stuff
// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest() {
  // All HTML5 Rocks properties support CORS.
  var url = 'http://invisible.college';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}


// Initially hide the promotional price and promoMessage
$("#promoPrice").hide();
$("#promoMessage").hide();
function handleInvalid(msg) {
  $("#promoMessage").html("Not a valid code.");
};


$("#promoSubmit").on("click", function(e) {
  e.preventDefault();

  var url = 'https://aws.local-box.org/promo';
  var xhr = createCORSRequest('GET', url);
  xhr.send();

  var request = $.ajax({
    crossDomain: true,
    method: "GET",
    url: "",
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

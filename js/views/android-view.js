// Submission / Profile View
// ----------
define(['js/models'], function(models) {

    addStripeButton = function() {
        this.stripe_button = $('<script></script>').
            attr('id', 'stripe-button').
            attr('src', 'https://checkout.stripe.com/checkout.js').
            attr('class', 'stripe-button').
            attr('data-key', 'pk_live_rigI562smH2C3dHSDdn257qv').
            attr('data-amount', '50000').
            attr('data-name', 'Invisible College Android Class 1').
            attr('data-description', '8 sessions ($500.00)').
            attr('data-image', '/128x128.png').
            attr('data-locale', 'auto');

        // Create the stripe button
        $("form#stripe").append(this.stripe_button);
        var email_url = aws_ip+'/email';
        $("form#signup").attr("action", email_url);
        var pay_url = aws_ip+'/stripe';
        $("form#stripe").attr("action", pay_url);
    };


    var AndroidView = Parse.View.extend({

        el: "#main-content",

        events: {
        },
        // Cache the template function for a single item.
        template: _.template($('#class-template').html()),

        initialize: function(code) {
            // Presumably, here is where we could translate
            // between codes and prices
            this.code = code;

            this.render();
            console.log("Android Code " + this.code);
        },

        render: function() {

            $(this.el).html(this.template({
                code: this.code
            }));

            $.get( "html/android-mentors.html",
                function( data ) {
                    $("div.section-mentors").html(data);
                });

            $.get( "html/android-syllabus.html",
                function( data ) {
                    $("div.section-syllabus").html(data);
                });

            $.get( "html/android-desc.html",
                function( data ) {
                    $("div.section-desc").html(data);
                });

            $.get( "html/android-header.html",
                function( data ) {
                    $("div.section-header").html(data);
                    // We can only call this after the form div has been loaded
                    addStripeButton();
                });


            /* Parse stuff, for later
            var sessionsQuery = new Parse.Query(models.AndroidSession);

            submissionsQuery.find({
              success: function(results) {
                console.log("Successfully retrieved " + results.length + " submissions.");
                // Do something with the returned Parse.Object values
                $.each(results, function(i,d) {
                    var view = new SubmissionItemView(d.id);
                    $("#submission-list").append(view.render().el)
                })
              },
              error: function(error) {
                alert("Error: " + error.code + " " + error.message);
              }
            });
            */
            console.log("Rendering Android view");
            return this;
        },
    });

    return AndroidView;

});

// Submission / Profile View
// ----------
define(['js/models'], function(models) {

    var WebView = Parse.View.extend({

        el: "#main-content",

        events: {
        },
        // Cache the template function for a single item.
        template: _.template($('#class-template').html()),

        initialize: function(code) {
            // Presumably, here is where we could translate
            // between codes and prices
            this.code = code;
            this.stripe_button = $('<script></script>').
                attr('id', 'stripe-button').
                attr('src', 'https://checkout.stripe.com/checkout.js').
                attr('class', 'stripe-button').
                attr('data-key', 'pk_live_rigI562smH2C3dHSDdn257qv').
                attr('data-amount', '50000').
                attr('data-name', 'Invisible College Web Class 1').
                attr('data-description', '6 weeks ($2000.00)').
                attr('data-image', '/128x128.png').
                attr('data-locale', 'auto');

            //this.render();
            console.log("Web Code " + this.code);
        },

        render: function() {
            $(this.el).html(this.template({
                code: this.code
            }));
            // Create the stripe button
            $("form#stripe").append(this.stripe_button);
            var email_url = aws_ip+'/email';
            $("form#signup").attr("action", email_url);
            var pay_url = aws_ip+'/stripe';
            $("form#stripe").attr("action", pay_url);

            $.get( "html/web-mentors.html",
                function( data ) {
                    $("div.section-mentors").html(data);
                });

            $.get( "html/web-syllabus.html",
                function( data ) {
                    $("div.section-syllabus").html(data);
                });

            $.get( "html/web-desc.html",
                function( data ) {
                    $("div.section-desc").html(data);
                });

            $.get( "html/web-header.html",
                function( data ) {
                    $("div.section-header").html(data);
                });

            console.log("Rendering Web view");
            return this;
        },
    });

    return WebView;

});

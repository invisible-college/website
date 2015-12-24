// Submission / Profile View
// ----------
define(['js/models'], function(models) {

    var AndroidView = Parse.View.extend({

        el: "#main-content",

        events: {
        },
        // Cache the template function for a single item.
        template: _.template($('#android-template').html()),

        initialize: function(code) {
            // Presumably, here is where we could translate
            // between codes and prices
            this.code = code;
            this.stripe_button = $('<script></script>').
                attr('id', 'stripe-button').
                attr('src', 'https://checkout.stripe.com/checkout.js" class="stripe-button"').
                attr('data-key', 'pk_live_rigI562smH2C3dHSDdn257qv').
                attr('data-amount', '25000').
                attr('data-name', 'Invisible College Android Class 1').
                attr('data-description', '8 sessions ($250.00)').
                attr('data-image', '/128x128.png').
                attr('data-locale', 'auto');

            this.render();
            console.log("Android Code " + this.code);
        },

        render: function() {
            $(this.el).html(this.template({
                code: this.code
            }));
            $("form#stripe-form").append(this.stripe_button);
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

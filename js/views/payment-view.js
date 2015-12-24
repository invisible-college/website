// Payment View
// ----------
define(['js/models'], function(models) {

    var PaymentView = Parse.View.extend({

        el: "#main-content",

        events: {
        },
        // Cache the template function for a single item.
        template: _.template($('#payment-template').html()),

        initialize: function(name, email, amount) {
            this.name = name;
            this.email = email;
            this.amount = amount;
            this.render();
            console.log("Privacy init");
        },

        render: function() {
            $(this.el).html(this.template({
                // parameters get mapped here
                name: this.name,
                email: this.email,
                amount: this.amount
            }));

            console.log("Rendering Payment view");
            return this;
        },
    });

    return PaymentView;

});

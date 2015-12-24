// Submission / Profile View
// ----------
define(['js/models'], function(models) {

    var EmailView = Parse.View.extend({

        el: "#main-content",

        events: {
        },
        // Cache the template function for a single item.
        template: _.template($('#email-template').html()),

        initialize: function(name, email) {
            this.name = name;
            this.email = email;
            this.render();
            console.log("Privacy init");
        },

        render: function() {
            $(this.el).html(this.template({
                // parameters get mapped here
                name: this.name,
                email: this.email
            }));

            console.log("Rendering Email view");
            return this;
        },
    });

    return EmailView;

});

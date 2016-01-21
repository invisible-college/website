// Submission / Profile View
// ----------
define(['js/models'], function(models) {

    var ClassesView = Parse.View.extend({

        el: "#main-content",

        events: {
        },
        // Cache the template function for a single item.
        template: _.template($('#classes-template').html()),

        initialize: function(code) {
            // Presumably, here is where we could translate
            // between codes and prices
            this.code = code;

            this.render();
            console.log("Classes view " + this.code);
        },

        render: function() {
            $(this.el).html(this.template({
                code: this.code
            }));

            console.log("Rendering Classes view");
            return this;
        },
    });

    return ClassesView;

});

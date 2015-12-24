// Submission / Profile View
// ----------
define(['js/models'], function(models) {

    var PrivacyView = Parse.View.extend({

        el: "#main-content",

        events: {
        },
        // Cache the template function for a single item.
        template: _.template($('#privacy-template').html()),

        initialize: function() {
            // Presumably, here is where we could translate
            // between codes and prices
            this.render();
            console.log("Privacy init");
        },

        render: function() {
            $(this.el).html(this.template({
                // parameters get mapped here
                // id: this.id
            }));

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
            console.log("Rendering Privacy view");
            return this;
        },
    });

    return PrivacyView;

});

// Submission / Profile View
// ----------
define(['js/models'], function(models) {

    var ProjectsView = Parse.View.extend({

        el: "#content",

        events: {
        },
        // Cache the template function for a single item.
        template: _.template($('#projects-template').html()),

        initialize: function(id) {
            // Presumably, here is where we could translate
            // between codes and prices
            this.id = id;
            this.render();
            console.log("Projects ID " + this.id);
        },

        render: function() {
            $(this.el).html(this.template({
                id: this.id
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
            console.log("Rendering Projects view");
            return this;
        },
    });

    return ProjectsView;

});

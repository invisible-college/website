// Submission / Profile View
// ----------
define(['js/models'], function(models) {

    var SubmissionItemView = Parse.View.extend({

        events: {
        },
        // Cache the template function for a single item.
        template: _.template($('#submission-item-template').html()),

        initialize: function(objectId) {
            this.objectId = objectId;
        },

        render: function() {
            $(this.el).html(this.template({
                objectId: this.objectId
            }));
            return this;
        },
    });

    var SubmissionProfileView = Parse.View.extend({

        el: "#content",

        events: {
        },
        // Cache the template function for a single item.
        template: _.template($('#submissions-profile-template').html()),

        initialize: function(userId) {
            this.userId = userId;
            this.render();
            console.log("User ID" + this.userId);
        },

        render: function() {
            $(this.el).html(this.template({
                userId: this.userId
            }));
            var submissionsQuery = new Parse.Query(models.RaceSubmission);

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

            console.log("Rendering submissions profile view");
            return this;
        },
    });

    return SubmissionProfileView;

});

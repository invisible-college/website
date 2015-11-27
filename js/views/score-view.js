// Score Board View : shows you your score, global leaders, and what your friends are upto
// ----------
define(function() {

    var UserItem = Parse.View.extend({

        // Cache the template function for a single item.
        template: _.template($('#competitor-item-template').html()),

        initialize: function(user) {
            _.bindAll(this, 'render');
            this.user = user;
        },

        render: function() {
            self = this;
            $(self.el).html(self.template(self.user.toJSON()));
            return this;
        }
    });

    var ScoreView = Parse.View.extend({

        el: "#content",
        // Cache the template function for a single item.
        template: _.template($('#scoreboard-template').html()),

        // The DOM events specific to an item.
        // events: {
        //     "click .friend": "showFriend"
        // },

        initialize: function() {
            self = this;
            _.bindAll(this, 'render');
            //load users score
            Parse.Cloud.run('leaderBoard', {}).then(function(response) {
                console.log("the response: " +JSON.stringify(response));
                self.model = response;
                self.render();
            });
        },

        showFriends: function() {

        },

        // Re-render the contents of the  item.
        render: function() {
            self = this;
            $(this.el).html(this.template());
            this.delegateEvents();
            // console.log("the response before printing: " +this.model[0].toJSON().username);
            // for (var i=0;  i< self.model.length; i++) {
                
            // };
            $.each(self.model, function(i, user) {
                var view = new UserItem(user);
                $("#competitor-list").append(view.render().el);
            });
        }
    });

    return ScoreView;
});
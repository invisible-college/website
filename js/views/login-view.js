// Log in / Log out Views
// --------------------
define(function() {

        var LogInView = Parse.View.extend({
            events: {
                "submit form.login-form": "logIn",
                "submit form.signup-form": "signUp",
                "click .facebook-login" : "facebookLogin",
            },

            el: "#content",

            initialize: function() {
                _.bindAll(this, "logIn", "signUp");
                this.render();
            },

            logIn: function(e) {
                var self = this;
                var username = this.$("#login-username").val();
                var password = this.$("#login-password").val();

                Parse.User.logIn(username, password, {
                    success: function(user) {
                        Parse.history.navigate("races", {trigger: true});
                        self.undelegateEvents();
                        delete self;
                    },

                    error: function(user, error) {
                        self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
                        self.$(".login-form button").removeAttr("disabled");
                    }
                });

                this.$(".login-form button").attr("disabled", "disabled");

                return false;
            },

            signUp: function(e) {
                var self = this;
                var username = this.$("#signup-username").val();
                var password = this.$("#signup-password").val();

                Parse.User.signUp(username, password, {
                    ACL: new Parse.ACL()
                }, {
                    success: function(user) {
                        Parse.history.navigate("races", {trigger: true});
                        self.undelegateEvents();
                        delete self;
                    },

                    error: function(user, error) {
                        self.$(".signup-form .error").html(_.escape(error.message)).show();
                        self.$(".signup-form button").removeAttr("disabled");
                    }
                });

                this.$(".signup-form button").attr("disabled", "disabled");

                return false;
            },

            facebookLogin: function(){
                Parse.FacebookUtils.logIn(null, {
                  success: function(user) {
                    if (!user.existed()) {
                      // alert("User signed up and logged in through Facebook! -- username: ");
                    } else {
                      // alert("User logged in through Facebook! -- username: ");
                    }
                    //should only do this the first time
                    FB.api('/me', {fields: ['last_name', 'first_name']}, function(response) {
                      var user = Parse.User.current();
                      var new_name = response.last_name+'.'+response.first_name;
                      user.set('username', new_name);
                      user.save();
                      Parse.history.navigate("races", {trigger: true});
                    });
                  },
                  error: function(user, error) {
                    alert("User cancelled the Facebook login or did not fully authorize. Let's try this again.");
                  }
                }, {scope: 'user_friends'});
            },

            render: function() {
                console.log("About to be rendering the login stuff");
                this.$el.html(_.template($("#login-template").html()));
                this.delegateEvents();
            }
        });

        //public method declarations
        return LogInView;
});


/**

-- how to check if the user is logged into facebook before trying to authenticate with thier FB

FB.getLoginStatus(function(response) {
  // Check login status on load, and if the user is
  // already logged in, go directly to the welcome message.
  if (response.status == 'connected') {
    onLogin(response);
  } else {
    // Otherwise, show Login dialog first.
    FB.login(function(response) {
      onLogin(response);
    }, {scope: 'user_friends, email'});
  }
});

-- how to get list of all friends to invite to this app/game
FB.api('/me/invitable_friends', function(response) {
  console.log(response);
});

FB.api('/me/friends', function(response) {
  console.log(response);
});
**/
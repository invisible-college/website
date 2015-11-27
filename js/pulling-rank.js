$(function() {

    require.config({
      shim: {
        'facebook' : {
          exports: 'FB'
        }
      },
      paths: {
        'facebook': 'https://connect.facebook.net/en_US/sdk'
      }
    })

    Parse.$ = jQuery;
    Parse.initialize(
        'w54gl3ul3atvmDdwi4gLR33aaY0wej3Zr4NOWYmu',
        'SiL8P4yMyxRE6iJTU6CX9BJnglgCwayNHxu0V9Gf');

    window.fbAsyncInit = function() {
        Parse.FacebookUtils.init({ // this line replaces FB.init({
            appId: '823730041056796', // Facebook App ID
            cookie: true, // enable cookies to allow Parse to access the session
            xfbml: true, // initialize Facebook social plugins on the page
            version: 'v2.3' // point to the latest Facebook Graph API version
        });

        // Run code after the Facebook SDK is loaded.
    };

    // Main App View
    // --------------------
    var dependencyList = [
        'js/models',
        'js/views/race-list-view',
        'js/views/login-view',
        'js/views/vote-view',
        'js/views/score-view',
        'js/views/submissions-view',
        'facebook'
        ];
    require(dependencyList, function(models,
        RaceListView, LogInView, VoteView, ScoreView, SubmissionProfileView) {

        var AppView = Parse.View.extend({
            // Instead of generating a new element, bind to the existing skeleton of
            // the App already present in the HTML.
            el: $("#pulling-rank"),

            initialize: function() {
                this.render();
            },

            render: function() {
                if (Parse.User.current()) {
                    // console.log("The user is already logged in!");
                    new RaceListView;
                } else {
                    new LogInView();
                }
            }
        });

        // Router
        // --------------------
        var AppRouter = Parse.Router.extend({
            routes: {
                "vote/:id": "voteForRace",
                "races": "viewRaces",
                "login": "logIn",
                "my-score": "myScore",
                "submissions": "submissions"
                    // Backbone will try to match the route above first
            },

            voteForRace: function(id) {
                new VoteView(id);
            },

            submissions: function() {
                new SubmissionProfileView();
            },

            viewRaces: function() {
                new RaceListView();
            },

            logIn: function(){
                new LogInView();
            },

            myScore: function(){
                new ScoreView();
            },

        });

        // Instantiate the router
        new AppRouter();
        Parse.history.start();
        new AppView();

    });

});

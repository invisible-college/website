$(function() {

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
        'js/views/projects-view',
        'js/views/android-view',
        'js/views/web-view',
        'js/views/classes-view',
        'js/views/email-view',
        'js/views/payment-view',
        'js/views/privacy-view',
        ];
    require(dependencyList, function(models,
        ProjectsView, AndroidView, WebView, ClassesView,
        EmailView, PaymentView, PrivacyView) {

        // Main App View
        // --------------------
        var AppView = Parse.View.extend({
            // Instead of generating a new element, bind to the existing skeleton of
            // the App already present in the HTML.
            el: $("#main-container"),

            initialize: function() {
                this.render();
            },

            render: function() {
                // Initially we always just list all current projects
                //new ProjectsView();
            }
        });

        // Router
        // --------------------

        var AppRouter = Parse.Router.extend({
            routes: {
                "projects": "projects",
                "projects/:id": "projects",
                "learn": "learn",
                "android": "android",
                "android/": "android",
                "android/:code": "android",
                "web": "web",
                "web/": "web",
                "web/:code": "web",
                "email": "email",
                "payment": "payment",
                "privacy": "privacy",
                "": "projects",
                    // Backbone will try to match the route above first
            },

            projects: function(id) {
                new ProjectsView(id);
                localSave({
                    "key": "view",
                    "view": "projects"
                });
            },

            /* Handle prices and promotional codes here */
            web: function(code) {
                localSave({
                    "key": "view",
                    "view": "web"
                });
                localSave({
                    "key": "/web/code",
                    "view": "code"
                });
                console.log("Web code: " + code);
                new WebView(code);
            },

            /* Handle prices and promotional codes here */
            android: function(code) {
                localSave({
                    "key": "view",
                    "view": "android"
                });
                localSave({
                    "key": "/android/code",
                    "view": "code"
                });
                console.log("Android code: " + code);
                new AndroidView(code);
            },

            learn: function() {
                localSave({
                    "key":"view",
                    "view":"learn"
                });
                console.log("Classes constructor");
                new ClassesView();
            },

            email: function() {
                localSave({
                    "key":"view",
                    "view":"email"
                });
                new EmailView();
            },

            payment: function(){
                localSave({
                    "key": "view",
                    "view": "payment"
                });
                new PaymentView();
            },

            privacy: function(){
                localSave({
                    "key": "view",
                    "view": "privacy"
                });
                new PrivacyView();
            },

        });

        // Instantiate the router
        new AppRouter();
        Parse.history.start();
        new AppView();

    });

});

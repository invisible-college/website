 // Race List Views
 // --------------------
 define(['js/models', 'js/views/race-item-view'], function(models, RaceItemView) {
  
        var RaceListView = Parse.View.extend({

         el: "#content",

         statsTemplate: _.template($('#stats-template').html()),

         // Delegated events for creating new items, and clearing completed ones.
         events: {
             "click .log-out": "logOut"
         },

         // At initialization we bind to the relevant events on the `Todos`
         // collection, when items are added or changed. Kick things off by
         // loading any preexisting todos that might be saved to Parse.
         initialize: function() {
             var self = this;

             _.bindAll(this, 'render', 'logOut', 'addOne', 'addAll');

             // Main todo management template
             this.$el.html(_.template($("#race-list-template").html()));

             // Create our collection of Races
             this.races = new models.Races();

             // Setup the query for the collection to look for all races
             this.races.query = new Parse.Query(models.Race);
             // this.races.query.equalTo("user", Parse.User.current());

             this.races.bind('add', this.addOne);
             this.races.bind('reset', this.addAll);
             this.races.bind('all', this.render);

             this.races.fetch();
             // console.log("Look at all these Races!! -> ");
             // console.log(this.races);

         },

         // Re-rendering the App just means refreshing the statistics -- the rest
         // of the app doesn't change.
         render: function() {

             this.$('#race-stats').html(this.statsTemplate({
                 total: this.races.length
             }));

             this.delegateEvents();
         },

         // Add a single todo item to the list by creating a view for it, and
         // appending its element to the `<ul>`.
         addOne: function(race) {
             var view = new RaceItemView({
                 model: race
             });
             // console.log("Adding the items: " + race.toJSON().objectId);
             this.$("#race-list").append(view.render().el);
         },

         // Add all items in the Todos collection at once.
         addAll: function(collection) {
             // this.$("#race-list").html("");
             this.races.each(this.addOne, this);
         },

         // Logs out the user and shows the login view
         logOut: function(e) {
             Parse.User.logOut();
             Parse.history.navigate("login", {trigger: true});
             this.undelegateEvents();
             delete this;
         },

     });

     //public method declarations
     return RaceListView;
     
 });
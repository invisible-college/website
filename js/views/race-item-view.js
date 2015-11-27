 // Race Item Views
 // --------------------
 define(function() {

     var RaceItemView = Parse.View.extend({
         //... is a list tag.
         tagName: "a",

         // Cache the template function for a single item.
         template: _.template($('#race-template').html()),

         // The DOM events specific to an item.
         events: {
             "click .race": "selectRace"
         },

         initialize: function() {
             _.bindAll(this, 'render', 'selectRace');
         },

         // Re-render the contents of the todo item.
         render: function() {
             $(this.el).html(this.template(this.model.toJSON()));
             return this;
         },

         selectRace: function() {
             console.log("I got clicked on: " + this.model.toJSON().raceName);
             var url = "vote/"+this.model.id;
             Parse.history.navigate(url, {trigger: true});
         },

     });

    //public method declarations
     return RaceItemView;
 });
// PullingRank Model
// ----------
define(function() {

    // Our basic Todo model has `content`, `order`, and `done` attributes.
    var Race = Parse.Object.extend("Race");

    var RaceSubmission = Parse.Object.extend("RaceSubmission");

    var Politician = Parse.Object.extend("Politician");

    // Collections
    // --------------------

    var Races = Parse.Collection.extend({

        // Reference to this collection's model.
        model: Race

    });

    // publicly availible values
    return {
        Race : Race,
        RaceSubmission : RaceSubmission,
        Politician : Politician,
        Races : Races
    }

});
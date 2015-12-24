// PullingRank Model
// ----------
define(function() {

    // Our basic Todo model has `content`, `order`, and `done` attributes.
    var Class = Parse.Object.extend("Class");

    var Project = Parse.Object.extend("Project");

    var Projects = Parse.Object.extend("Projects");

    var ClassSession = Parse.Object.extend("ClassSession");

    // Collections
    // --------------------

    var AndroidClassSessions = Parse.Collection.extend({

        // Reference to this collection's model.
        model: ClassSession

    });

    // publicly availible values
    return {
        Class : Class,
        Project : Project,
        ClassSession : ClassSession,
        AndroidClassSessions : AndroidClassSessions
    }

});

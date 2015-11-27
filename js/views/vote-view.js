// Voting View
// ----------
define(['js/models'], function(models) {

    var PoliticianSelectView = Parse.View.extend({

        events: {
            "click .vote-for": "vote",
        },
        // Cache the template function for a single item.
        template: _.template($('#vote-item-template').html()),

        initialize: function(politician, rowId, raceSubmission) {
            this.rowId = rowId;
            this.candidate = politician;
            this.model = raceSubmission;
        },

        render: function() {
            $(this.el).html(this.template({
                rowId: this.rowId,
                candidate: this.candidate.toJSON()
            }));
            return this;
        },

        vote: function() {
            self = this;
            // console.log("vote called : " + JSON.stringify(this.model.toJSON()));
            var results = {};
            if (self.model.has('results')) {
                results = self.model.get('results');
            }
            results[this.rowId] = self.candidate.id;
            self.model.set("results", results);
            var candidateId = '.candidate-' + self.candidate.id;
            var rowNumber = '.row-' + self.rowId;
            // hide the other candidates from this row
            $(rowNumber).each(function(i) {
                if (!($(this).is(candidateId))) {
                    $(this).hide();
                }
            });
            // hide this candidate from the other rows
            $(candidateId).each(function(i) {
                if (!($(this).is(rowNumber))) {
                    $(this).hide();
                }
            });
        }
    });

    var VoteView = Parse.View.extend({
        events: {
            "click .submit-vote": "submitVote",
            "click .clear-vote": "clearVote"
        },

        el: "#content",

        template: _.template($('#vote-template').html()),

        // candidate_template = _.template($('#vote-item-template').html()),

        initialize: function(raceId) {
            self = this;
            _.bindAll(this, "render", "clearVote", "submitVote");
            this.raceId = raceId;
            this.model = new models.RaceSubmission();
            this.model.set("user", Parse.User.current());

            var politicianQuery = new Parse.Query(models.Politician);
            // get the race details
            var queryRace = new Parse.Query(models.Race);
            queryRace.get(raceId).then(function(race) {
                self.currentRace = race;
                self.model.set("race", race);
                // get the politicians for this race
                politicianQuery.containedIn("objectId", self.currentRace.get("politicians"));
                politicianQuery.find({
                    success: function(politicians) {
                        self.politicians = politicians;
                        console.log("Successfully retrieved " + politicians.length + " categories.");

                        self.render();

                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            });
        },

        submitVote: function() {

            console.log("submitted my choice! --> " + JSON.stringify(this.model.toJSON()));
            this.model.save().then(function() {
                Materialize.toast('Your vote has been cast!', 4000);
            }, function(error) {
                Materialize.toast('There was a problem submitting, try again shortly.', 4000);
            });

            Parse.history.navigate("my-score", {
                trigger: true
            });
            this.undelegateEvents();
            delete this;
        },

        clearVote: function() {
            this.model.unset("results");
            $(".vote-for").show();
        },

        addCandidate: function(candidate, toRow) {
            var view = new PoliticianSelectView(candidate, toRow, this.model);
            // console.log("Adding the candidate : " + candidate.toJSON().objectId + "to row :" + toRow);
            this.$("#row-" + toRow).append(view.render().el);
        },

        render: function() {
            console.log("Rendering vote view");
            self = this;
            $(this.el).html(this.template({
                model: this.model.toJSON(),
                race: this.currentRace.toJSON()
            }));
            this.delegateEvents();

            function addRow(rowNumber) {
                $("#voteScroll").append('<div class="row" id="row-' + rowNumber + '"></div>');
                rowNumberDisplay = '<div class="col s2 m1 l1 pull-left" id="rowNumber-' + rowNumber + '"><h2>' + rowNumber + '</h2></div>';
                $("#row-" + rowNumber).append(rowNumberDisplay);
            }
            // for each politician, make a possible entry
            for (var row = 1; row <= self.politicians.length; row++) {
                //each entry, user can choose each possible politician
                addRow(row);
                $.each(self.politicians, function(i, politician) {
                    self.addCandidate(politician, row);
                });
            };


        }
    });

    //public method declarations
    return VoteView;
});

// Course tonkenizer + Query processing
// Zack Thompson
// Arthur Wuterich

Scheduler.Courses = {


    // Main interface for accessing the query processing. This is used withing the application
    // through Meteor's call() syntax.
    coursesForString: function(str) {
        var tokens = this.QueryTokenizer.tokensForString(str);
        var query = this.QueryBuilder.queryForTokens(tokens);
        var result = this.QuerySearcher.resultsForQuery(query);
        return result;
    }


};

// Converts raw query data into tokens of the following form:
// { "type":type, "value":value }
// Token types are defined in the QueryToken object
Scheduler.Courses.QueryTokenizer = {

    // Returns an array of token objects for the provided string.
    // The search tokens are broken up by spaces as a natural delimiter
    tokensForString: function(str) {

        var wordArray = str.trim().split(/\s+/);
        var tokens = [];

        while (!_.isEmpty(wordArray)) {

            var token = this.nextToken(wordArray);

            if (token !== undefined) {
                tokens.push(token);
            }

        }

        return tokens;
    },

    // Returns the next discovered token based on an array of strings. Each string
    // will be considered individually, initially, for identification and will continually
    // pull elements from the wordArray until there is no match. Then the last matched element
    // will be returned.
    nextToken: function(wordArray) {

        var words = [];
        var lastToken;

        var foundToken = false;

        while (!_.isEmpty(wordArray)) {

            words.push(_.first(wordArray));
            var curToken = Scheduler.Courses.QueryToken.TypeChecker.stringMatchesTypes(words.join(" "));
            words.pop();

            if (curToken === undefined && foundToken) break;
            else if (curToken === undefined) {
                wordArray.shift();
            }
            else {
                foundToken = true;
                words.push(wordArray.shift());
                lastToken = curToken;
            }
        }

        return lastToken !== undefined ? { type: lastToken, value: words.join(" ")} : undefined;
    }

};

Scheduler.Courses.QueryBuilder = {


    // Takes in an array of processed tokens and builds a mongo search query
    // The format of the tokens is described in the QueryTokenizer
    queryForTokens: function(tokens) {

        // Group the tokens based on their type for the query processing
        // to allow like tokens to be searched on an OR relationship
        // while non-like tokens will be searched on an AND relationship
        var groupedTokens =_.groupBy(tokens, 'type');
        _.each(groupedTokens, function(tokenGroup, type, obj) {
            obj[type] = _.pluck(tokenGroup, 'value');
        });


        var queryObject = {};

        // Maps each token group to a mongo query structure
        // queryValuesForValuesWithType will return a $in mongo
        // structure if there are more than one value present
        _.each(groupedTokens, function(values, type) {
            var queryKey = Scheduler.Courses.QueryToken.KeyMapper.queryKeyForType(type);
            var queryValues = Scheduler.Courses.QueryToken.ValueMapper.queryValuesForValuesWithType(values, type);

            if (queryKey !== undefined && queryValues !== undefined) {
                queryObject[queryKey] = queryValues;
            }
        });

        return queryObject;
    }


};

Scheduler.Courses.QuerySearcher = {

    // Access point for the searcher and the Meteor mongo helper object
    resultsForQuery: function(query) {
        if (_.isEmpty(query)) return [];
        else return CoursesModel.find( query ).fetch();
    }


};

Scheduler.Courses.QueryToken = {

    Type: {
        SUBJECT:    0,
        PROFESSOR:  1,
        TITLE:      2,
        DEPARTMENT: 3,
        TIME:       4,
        DAY:        5,
        GE:         6,
        NUMBER:     7,
        UNITS:      8
    },


    TypeChecker: {


        // Returns the type value for a provided string
        stringMatchesTypes: function(str) {
            var outerThis = this;

            // Apply the types of each token
            return _.chain(Scheduler.Courses.QueryToken.Type)
                .values()
                .sortBy('valueOf')
                .find( function(type) { return outerThis.stringIsType(str, type); } )
                .value();
        },


        stringIsType: function(str, type) {
            switch (type) {
                case Scheduler.Courses.QueryToken.Type.DIVISION:
                    return this.isDivision(str);

                case Scheduler.Courses.QueryToken.Type.PROFESSOR:
                    return this.isProfessor(str);

                case Scheduler.Courses.QueryToken.Type.TITLE:
                    return this.isTitle(str);
                case Scheduler.Courses.QueryToken.Type.DEPARTMENT:
                    return false;
                case Scheduler.Courses.QueryToken.Type.TIME:
                    return false;
                case Scheduler.Courses.QueryToken.Type.DAY:
                    return false;
                case Scheduler.Courses.QueryToken.Type.GE:
                    return this.isGE(str);
                case Scheduler.Courses.QueryToken.Type.NUMBER:
                    return this.isSubjectWithNumber(str);
                case Scheduler.Courses.QueryToken.Type.SUBJECT:
                    return this.isSubject(str);
                case Scheduler.Courses.QueryToken.Type.UNITS:
                    return this.isUnits(str);
                default:
                    console.log("Unrecognized QueryToken.Type in stringIsType(): " + type);
                    return false;
            }
        },

        isProfessor: function(str) {
            var regx = RegExp('^' + str, 'i');
            return (str.length > 2) && (CoursesModel.find( { "classes.sections.professors": regx }, { "_id": 1 } ).fetch().length > 0);
        },


        isTitle: function(str) {
            var regx = RegExp(str, 'i');
            return (str.length > 2) && (CoursesModel.find( { "title": regx }, { "_id": 1 } ).fetch().length > 0);
        },

        isDivision: function(str) {
          return /^[L|U]D$/i.test( str )
        },

        isSubject: function(str) {
            return (str.length > 1) && (CoursesModel.find( { "subject": str.toUpperCase() }, {"_id": 1} ).fetch().length > 0);
        },

        isUnits: function(str) {
            return /^[1-6]\s?(?:units?)?$/i.test(str);
        },

        isGE: function(str) {
            return /^ge\s?[a-e]?[1-5]?$/i.test(str);
        },

        isSubjectWithNumber: function(str) {
            return /^[a-z]{0,4}\s?[0-9]{3}[a-z]*$/i.test(str);
        }
    },

    KeyMapper: {

        // Returns the course object key that should be searched for the given type
        queryKeyForType: function(type) {
            switch (Number(type)) {
                case Scheduler.Courses.QueryToken.Type.PROFESSOR:
                    return "classes.sections.professors";
                case Scheduler.Courses.QueryToken.Type.TITLE:
                    return "title";
                case Scheduler.Courses.QueryToken.Type.TIME:
                    return "classes.sections.times.start_time";
                case Scheduler.Courses.QueryToken.Type.DAY:
                    return "classes.sections.times.days";
                case Scheduler.Courses.QueryToken.Type.GE:
                    return "ge_code";
                case Scheduler.Courses.QueryToken.Type.SUBJECT:
                    return "subject";
                case Scheduler.Courses.QueryToken.Type.UNITS:
                    return "units";
                case Scheduler.Courses.QueryToken.Type.NUMBER:
                    return "subject_with_number";
                case Scheduler.Courses.QueryToken.Type.DIVISION:
                    return "subject_number";
                default:
                    console.log("Unrecognized QueryToken.Type in queryKeyForType(): " + type);
                    return undefined;
            }
        }


    },

    ValueMapper: {


        // Will process a token-value and a token-type to the respective mongo
        // structure. Each type has a defined conversion mapping below.
        queryValuesForValuesWithType: function(values, type) {

            var valueMapFunction;

            switch (Number(type)) {
                case Scheduler.Courses.QueryToken.Type.PROFESSOR:
                    valueMapFunction = this.professorValueMap;
                    break;
                case Scheduler.Courses.QueryToken.Type.TITLE:
                    valueMapFunction = this.titleValueMap;
                    break;
                case Scheduler.Courses.QueryToken.Type.TIME:
                    valueMapFunction = this.timeValueMap;
                    break;
                case Scheduler.Courses.QueryToken.Type.DAY:
                    valueMapFunction = this.dayValueMap;
                    break;
                case Scheduler.Courses.QueryToken.Type.GE:
                    valueMapFunction = this.geValueMap;
                    break;
                case Scheduler.Courses.QueryToken.Type.SUBJECT:
                    valueMapFunction = this.subjectValueMap;
                    break;
                case Scheduler.Courses.QueryToken.Type.UNITS:
                    valueMapFunction = this.unitsValueMap;
                    break;
                case Scheduler.Courses.QueryToken.Type.NUMBER:
                    valueMapFunction = this.numberValueMap;
                    break;
                case Scheduler.Courses.QueryToken.Type.DIVISION:
                    valueMapFunction = this.divisionValueMap;
                    break;

                default:
                    console.log("Unrecognized QueryToken.Type in queryValuesForValuesWithType(): " + type);
                    return undefined;
            }

            var mappedValues = _.map(values, valueMapFunction);

            return mappedValues.length == 1 ? _.first(mappedValues) : { $in: mappedValues };
        },

        unitsValueMap: function(str) {
            return RegExp( str.match(/[1-6]/)[0] );
        },

        geValueMap: function(str) {
            return RegExp(str.replace(' ', ''), 'i');
        },

        titleValueMap: function(str) {
            return RegExp(str, 'i');
        },

        subjectValueMap: function(str) {
            return str.toUpperCase();
        },

        timeValueMap: function(str) {
            var regexResults = str.toUpperCase().match(/(\d\d?):?(\d?\d?)\s?([AP])/);

            var hour = regexResults[1];
            hour = hour.length === 2 ? hour : "0" + hour;

            var minute = regexResults[2];
            minute = minute.length === 2 ? minute : "00";

            var meridian = regexResults[3];
            meridian = meridian.length === 2 ? meridian : meridian + "M";

            return hour + ":" + minute + " " + meridian;
        },

        dayValueMap: function(str) {
            var code = str.search(/th/i) === -1 ? str.slice(0,1) : str.slice(0,2);
            // what is this doing?
            return RegExp( code + "((?!" + code + ").)*", 'i');
        },

        professorValueMap: function(str) {
            return RegExp('^' + str, 'i');
        },

        numberValueMap: function(str) {
            return RegExp( str.toUpperCase().replace(' ', '') );
        },

        divisionValueMap: function(str) {
            // If the string is lower division then search for classes less than 300
            // else search for classes 300 or greater
            return /LD/i.test(str) ? { "$lt" : 300 } : { "$gte" : 300 };
        },
    }


};





// EOF
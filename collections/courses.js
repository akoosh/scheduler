// Course tonkenizer + Query processing
// Zack Thompson

Scheduler.Courses = {


    coursesForString: function(str) {
        var tokens = this.QueryTokenizer.tokensForString(str);
        var query = this.QueryBuilder.queryForTokens(tokens);
        var result = this.QuerySearcher.resultsForQuery(query);
        return result;
    }


};

Scheduler.Courses.QueryTokenizer = {

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


    queryForTokens: function(tokens) {

        var groupedTokens = _.groupBy(tokens, 'type');

        _.each(groupedTokens, function(tokenGroup, type, obj) {
            obj[type] = _.pluck(tokenGroup, 'value');
        });


        var queryObject = {};

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
                default:
                    console.log("Unrecognized QueryToken.Type in queryKeyForType(): " + type);
                    return undefined;
            }
        }


    },

    ValueMapper: {


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
            return RegExp('[A-Z]{2,4}' + str.toUpperCase().replace(' ', '') );
        }
    }


};





// EOF

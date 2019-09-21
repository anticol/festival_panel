/**
 * Created by mormegil19 on 30.4.17.
 */


var place = {
    'A': 'SÁL A', // 28
    'B': 'SÁL B', // 17
    'C': 'SÁL C', // 16
    'G': 'GALERIE ROTUNDY', // 0
    'H': 'HERŇA', // 0
    'R': 'ROTUNDA', // 16
    'chill': 'RELAX', // 0
    'ddr': 'DDR', // 0
    'ddr2': 'DDR2', // 0
    'M' : 'MORAVA', // 12
    'Br' : 'BRNO', // 1
    'v' : 'VENKU', // 0
    's' : 'STAN BOJOVNÍKŮ', // 10
    'A1s' : 'A1 PÓDIUM', // 23
    'A1b' : 'A1 BALKÓN' // 3
};

var type = {
    'F' : 'screening',
    'S' : 'screening',
    'W' : 'workshop',
    'P' : 'lecture',
    'C' : 'contest',
    'H' : 'workshop',
    'B' : 'lecture',
    'D' : 'screening',
    'V' : 'screening',
    ' ' : 'break'
};


var days = {
    '19. 5.' : 'Pátek',
    '20. 5.' : 'Sobota',
    '21. 5.' : 'Nedele'
};


var program = [];
var reloadInterval = 60000;


var downloader = {
    dataUrl: 'program.xml',

    downloadContent: function() {
        console.log("program.downloadContent()");
        var http = new XMLHttpRequest();

        http.withCredentials = true;

        http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                downloader.onGetProgramResponse(this.responseXML);
            }
        };

        http.open('GET', this.dataUrl, true);
        http.send(null);
    },


    listenAdminButtonClickRefresh: function () {
        database.ref('settings/shouldRefresh').on('value', function(snap) {
            if (snap.val()) {
                // should refresh now = shouldRefresh: true
                // refresh data
                downloader.downloadContent();

                updateShouldRefresh(false);
                // toto zmeni ten shouldRefresh bool spat na false.
                // Asi to budes callovat az v callbacku ked sa loadne xml alebo co...
            }
        });
    },


    onGetProgramResponse: function(programXml) {
        // parse data from api
        parser.parse(programXml);

        // build html code
        programScene.createProgramItemContainer();

        // set first update
        setTimeout(programScene.updateProgramItemContainer, reloadInterval);
        programScene.fillRecommended();
    }

};


var parser = {

    parse: function (programXml) {
        this.xmlToJson(programXml);
        this.divideProgramItemsWithMultipleTimes();
        utils.splitProgramByTime();
    },


    xmlToJson: function(programXml) {
        var akce = programXml.getElementsByTagName("akce"),
            json = [];

        for (var i = 0; i < akce.length; i++)
            json.push(this.nodeToObject(akce[i]));

        program = json;
    },


    nodeToObject: function(node) {
        var resultObject = {},
            tmpObject = {},
            childNode;

        for (var i = 0; i < node.childNodes.length; i++) {
            childNode =  node.childNodes[i];

            if (childNode.nodeName != "#text") {
                tmpObject = this.nodeToObject(childNode);

                if (childNode.nodeName == 'time') {
                    if (resultObject.time == undefined) {
                        resultObject.time = [ tmpObject[childNode.nodeName] || tmpObject ];
                    } else {
                        resultObject.time.push(tmpObject[childNode.nodeName] || tmpObject);
                    }
                } else {
                    resultObject[childNode.nodeName] = tmpObject[childNode.nodeName] || tmpObject;
                }
            } else if (childNode.textContent.trim() != "") {
                resultObject[node.nodeName] = childNode.textContent;
            }
        }

        return resultObject;
    },


    divideProgramItemsWithMultipleTimes: function () {
        var newProgram = [],
            newProgramItem;

        for (var i = 0; i < program.length; i++) {
            if (program[i].time)
                for (var j = 0; j < program[i].time.length; j++) {
                    newProgramItem = JSON.parse(JSON.stringify(program[i]));
                    newProgramItem.time = program[i].time[j];
                    newProgram.push(newProgramItem);
                }
        }

        program = newProgram;
    }

};


var utils = {

    splitProgramByTime: function() {
        console.log("program.splitProgramByTime()");
        var programItem,
            now = [],
            later = [],
            dateNow = new Date(Date.now()),
            startTime, endTime, durations = {};

        
        for (var i = 0; i < program.length; i++) {
            programItem = program[i];

            if (programItem.zobrazovat == "true" && programItem.time != undefined) {
                startTime = this.timeObjectToDate(programItem.time.start);
                endTime = this.timeObjectToDate(programItem.time.konec);
                programItem.duration = this.getProgramItemDuration(startTime, endTime);

                durations[programItem.duration] = (durations[programItem.duration] + 1) || 1;

                if (startTime <= dateNow && dateNow < endTime) {
                    now.push(programItem);
                } else if (startTime > dateNow) {
                    later.push(programItem);
                }
            }
        }

        program = {
            now: now,
            later: later
        };
    },


    timeObjectToDate: function(timeObject) {
        var date = timeObject.datum.split('. '),
            time = timeObject.cas.split(':');

        return new Date(2017, parseInt(date[1]), parseInt(date[0]), parseInt(time[0]), parseInt(time[1]));
    },


    getProgramItemDuration: function (startTime, endTime) {
        var duration;

        if (Math.abs(endTime.getMinutes() - startTime.getMinutes()) == 30) {
            duration = 0.5;
        } else {
            duration = 0;
        }

        duration = endTime.getHours() - startTime.getHours() + duration;

        if (duration < 0)
            duration = 24 + duration;

        return duration;
    },


    sortByPriority: function() {
        program.now.sort(function (first, second) {
            return second.priorita - first.priorita;
        });

        program.later.sort(function (first, second) {
            return second.priorita - first.priorita;
        });

        return program;
    },


    createCustomDiv: function (elemClass, text) {
        var newInfoDiv = document.createElement("div"),
            classes = elemClass.split(' ');

        for (var i = 0; i < classes.length; i++)
            newInfoDiv.classList.add(classes[i]);

        newInfoDiv.textContent = text;
        return newInfoDiv;

    },


    getNextProgramItem: function (nowItem) {
        var nextItem,
            nextItems = [],
            dateNow = new Date(Date.now()),
            nextStartTime, nowEndTime;

        for (var i = 0; i < program.later.length; i++) {
            nextItem = program.later[i];

            nextStartTime = this.timeObjectToDate(nextItem.time.start).getDate();
            nowEndTime = this.timeObjectToDate(nowItem.time.konec).getDate();

            if (nextStartTime == nowEndTime && nextItem.time.sal == nowItem.time.sal)
                nextItems.push(nextItem);
        }

        nextItems.sort(function (fisrt, second) {
            var time1 = utils.timeObjectToDate(fisrt.time.start).getHours(),
                time2 = utils.timeObjectToDate(second.time.start).getHours();
            return time1 - time2;
        });
        
        return nextItems[0] || new ProgramBreak({title: ' ', place: nowItem.time.sal, startTime: '', endTime:''});
    },


    getRandomProgramItem: function () {
        //  soutěž, divadlo, beseda
        var max = program.later.length;
        var rand = Math.floor(Math.random() * max);
        var result = program.later[rand];

        if (result.typ != 'F' && result.typ != 'S' && result.typ != 'W' &&
            result.typ != 'P' && result.typ != 'C' && result.typ != 'B' && result.typ != 'D') {

            result = this.getRandomProgramItem();
        }

        return result;
    },


    removeAllChildElements: function (parentElement) {
        while (parentElement.firstChild)
            parentElement.removeChild(parentElement.firstChild);
    }
};


var programScene = {
    domain: 'https://animefest.cz',

    createProgramItemContainer: function () {
        var item, dataNow, dataNext,
            main = document.getElementById('program'),
            optional = document.createElement('div'),
            mainPlaces = ['A', 'B', 'C', 'R', 'M'],
            mainPlaceIndex;

        optional.setAttribute('id', 'optional');

        for (var i = 0; i < program.now.length; i++) {
            dataNow = program.now[i];
            dataNext = utils.getNextProgramItem(dataNow);

            item = new ProgramItemContainer(dataNow, dataNext);

            item.appendPlace();
            item.appendSingleProgramItem(item.now);
            item.appendSingleProgramItem(item.next);

            mainPlaceIndex = mainPlaces.indexOf(item.placeAbbr);
            if (mainPlaceIndex != -1) {
                delete mainPlaces[mainPlaceIndex];
                item.self.classList.add('main');
                main.appendChild(item.self);
            } else if (optional.childElementCount < 4) {
                optional.appendChild(item.self);
            }
        }

        this.createProgramBreaks(main, mainPlaces);

        main.appendChild(optional);
    },


    createProgramBreaks: function (main, mainPlaces) {
        if (mainPlaces.length > 0)
            for (i = 0; i < mainPlaces.length; i++) {
                if (mainPlaces[i] == undefined) continue;

                item = new ProgramItemContainer(
                    new ProgramBreak({place: mainPlaces[i], startTime: '', endTime: ''}),
                    utils.getNextProgramItem({time: {sal: mainPlaces[i], konec: {datum: '30. 4.', cas: '11:30'}}})
                );

                item.appendPlace();
                item.appendSingleProgramItem(item.now);
                item.appendSingleProgramItem(item.next);

                item.self.classList.add('main');
                main.appendChild(item.self);
            }
    },


    fillRecommended: function() {
        var recommended = document.getElementsByClassName("recomended_program_info");

        for (var i = 0; i < recommended.length; i++) {
            var programItemPlace = recommended[i].getElementsByClassName("recomended_place")[0];
            var time = recommended[i].getElementsByClassName("recomended_time")[0];
            var name = recommended[i].getElementsByClassName("recomended_name")[0];
            var author = recommended[i].getElementsByClassName("recomended_author")[0];
            var randomProgramItem = utils.getRandomProgramItem();

            programItemPlace.textContent = place[randomProgramItem.time.sal];
            time.textContent = days[randomProgramItem.time.start.datum] + " " +
                randomProgramItem.time.start.cas + " - " + randomProgramItem.time.konec.cas;
            name.textContent = randomProgramItem.nazev || "";
            author.textContent = randomProgramItem.prednasejici || "";
        }
    },


    updateProgramItemContainer: function () {
        console.log("program.updateProgramItemContainer()");
        var programElem = document.getElementById('program');

        program = program.now.concat(program.later);

        utils.splitProgramByTime();
        utils.removeAllChildElements(programElem);
        programScene.createProgramItemContainer();

        programScene.fillRecommended();

        setTimeout(programScene.updateProgramItemContainer, reloadInterval);
    }
};


function ProgramItemContainer(dataNow, dataNext) {
    this.self = utils.createCustomDiv('program_item clearfix', '');
    this.place = utils.createCustomDiv('place', place[dataNow.time.sal]);
    this.placeAbbr = dataNow.time.sal;

    this.now = {
        self: utils.createCustomDiv(type[dataNow.typ] + ' now', ''),
            time: {
            self: utils.createCustomDiv('time_now', ''),
                start: utils.createCustomDiv('start_time_now', dataNow.time.start.cas),
                end: utils.createCustomDiv('end_time_now', dataNow.time.konec.cas)
        },
        title: utils.createCustomDiv('title_now', dataNow.nazev)
    };

    this.next = {
        self: utils.createCustomDiv(type[dataNext.typ] + ' next', ''),
            time: {
            self: utils.createCustomDiv('time_next', ''),
                start: utils.createCustomDiv('start_time_next', dataNext.time.start.cas),
                end: utils.createCustomDiv('end_time_next', dataNext.time.konec.cas)
        },
        title: utils.createCustomDiv('title_next', dataNext.nazev)
    };

    this.appendPlace = function () {
        this.self.appendChild(this.place);
    };

    this.appendSingleProgramItem = function (item) {
        item.time.self.appendChild(item.time.start);
        item.time.self.appendChild(item.time.end);
        item.self.appendChild(item.time.self);
        item.self.appendChild(item.title);

        this.self.appendChild(item.self);
    };

}


function ProgramBreak(data) {
    this.typ = ' ';
    this.nazev = data.title || 'Pauza';

    this.time = {
        sal: data.place,
        start: {
            cas: data.startTime
        },
        konec: {
            cas: data.endTime
        }
    };


}


/**
 * Created by xhorov on 4/20/2017.
 */

/**
 * Runs and scrolls ticker
 * @param settings - speed of scrolling
 */
jQuery.fn.liScroll = function (settings) {

    settings = jQuery.extend({
        travelocity: CONFIG.tickerSpeed
    }, settings);
    return this.each(function () {
        $strip = jQuery(this);
        $strip.addClass("newsticker");
        var stripWidth = 1;
        $strip.find("li").each(function (i) {
            stripWidth += jQuery(this, i).outerWidth(true);
        });
        var $mask = $strip.wrap("<div class='mask'></div>");
        var $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");
        var containerWidth = $strip.parent().parent().width();	//a.k.a. 'mask' width
        $strip.width(stripWidth);
        var totalTravel = stripWidth + containerWidth;
        var defTiming = totalTravel / settings.travelocity;

        function scrollnews(spazio, tempo) {

            $strip.animate({left: '-=' + spazio}, tempo, "linear", function () {
                $strip.css("left", containerWidth);
                scrollnews(totalTravel, defTiming);
            });

        }
        scrollnews(totalTravel, defTiming);
        $strip.hover(function () {
                return false;
            },
            function () {
                return false;
                var offset = jQuery(this).offset();
                var residualSpace = offset.left + stripWidth;
                console.log(residualSpace);
                residualSpace = 0;
                var residualTime = residualSpace / settings.travelocity;
                scrollnews(residualSpace, residualTime);
            });
    });
};


loadedMessages = [];
messages = [];

/**
 * Checks for new messages in firbase, updates content of messages
 */
loadedMessages = getSynchronizedArray(database.ref('settings/messages'), function () {
}, function () {
}, function (snap) {
    updateMessagesInProgram(loadedMessages);
    Ticker.quit();
    messages = [];
    if (loadedMessages.length == 0) {
        return;
    }
    for (var i = 0; i < loadedMessages.length; i++) {
        if (i != 0) messages += "<li> ***** </li>";
        if (loadedMessages[i].message.length > 50) {
            messages += parseLongMessage(loadedMessages[i].message);
        }
        else {
            messages += "<li>&nbsp; " + loadedMessages[i].message + " &nbsp;</li>";
        }
    }
    Ticker.run();
});

/**
 * Parses long messages (restriction of ticker)
 * @param longMessage - string with long message
 * @returns {string} - parsed message in html
 */
function parseLongMessage(longMessage) {
    var restOfMessage = longMessage;
    var parsedMessage = '';
    var messages = '';
    while (restOfMessage.length) {

        parsedMessage = restOfMessage.slice(0, 40);
        restOfMessage = restOfMessage.slice(40);
        messages += "<li>";
        if (parsedMessage[0] == ' ') messages += '&nbsp;' + parsedMessage.slice(1);
        else messages += parsedMessage;
        if (parsedMessage[39] == ' ') {
            messages += '&nbsp;';
        }
        messages += "</li>";
    }

    return messages;
}

/**
 * Updates list of messages in scene program
 * @param messages - array of messages
 */
function updateMessagesInProgram(messages) {
    var elMessagesList = document.getElementById('messages_list');
    elMessagesList.innerHTML = '';
    var messagesLength = messages.length > 3 ? 3 : messages.length;
    if (messagesLength == 0) {
        var content = '<li><span class="message_item">Žádne aktuality</span></li>';
        elMessagesList.innerHTML = content;
        return;
    }

    for (var i = 0; i < messagesLength; i++) {
        var elLi = document.createElement('li');
        var elSpan = document.createElement('span');
        elSpan.classList = 'message_item';
        elSpan.textContent = messages[i].message;
        elLi.appendChild(elSpan);
        elMessagesList.appendChild(elLi);
    }
}

/**
 * Scrolling message feed
 * @type {{run: Ticker.run, quit: Ticker.quit, toggle: Ticker.toggle}}
 */
var Ticker = {

    /**
     * Turns on the ticker with loaded messages
     */
    run: function () {
        var elMessage = $("#message")[0];
        elMessage.style.display = 'block';
        elMessage.innerHTML = '<ul id = "ticker01">' +
            messages +
            '</ul>';

        $(function () {
            $("ul#ticker01").liScroll();
        });

    },


    /**
     * Turns off the ticker
     */
    quit: function () {
        CONFIG.stopTicker = true;
        $("#message")[0].style.display = 'none';
    },


    /**
     * Toggles between ticker(turn on, turn off)
     */
    toggle: function () {
        var elMessage = $("#message")[0];
        if (elMessage.style.display == 'none') {
            this.run();
        }
        else {
            this.quitTicker();
        }

    }
};
/**
 * Created by david on 4/20/2017.
 */

$(document).ready(function(){
    $('.modal').modal();
    $('.chips-placeholder').material_chip({
        placeholder: 'Enter a tag',
        secondaryPlaceholder: '+Tag',
    });
    $('#addMessageModal').keypress(function(e) {
        if (e.keyCode == 13) {
            addNewMessage();
        }
    });

    $('#addUrlModal').keypress(function(e) {
        if (e.keyCode == 13) {
            addNewUrl();
        }
    });
});

// Refresh button
var refreshButtonID = "refreshButton";
var refreshButton = document.getElementById(refreshButtonID)

function updateRefreshButtonAppearance(snap) {
    if (snap.val()) {
        refreshButton.className += " disabled";
    } else {
        refreshButton.classList.remove("disabled");
    }
}

function refreshButtonClicked() {
    updateShouldRefresh(true);
}

database.ref('settings/shouldRefresh').on('value', updateRefreshButtonAppearance);
refreshButton.onclick = refreshButtonClicked;

// Messages
function presentAddMessageModal() {
    $('#addMessageModal').modal('open');
    $('#addMessageInput').focus();

}

var messagesArray = [];

function deleteMessage(node) {
    var index = $(node.parentNode.parentNode.parentNode).index();
    messagesArray.$remove(messagesArray[index].$id, function(index) {
        var ul = document.getElementById("messagesList");
        ul.removeChild($('#messagesList li')[index]);
    });
}

function addNewMessage() {
    var input = $('#addMessageInput');
    var msg = input.val();
    if (msg) {
        input.val('');
        messagesArray.$add({ message: msg }, function(index) {
            addMessageToList(messagesArray[index]);
        });
        $('#addMessageModal').modal('close');
    } else {
        Materialize.toast('New message cannot be empty.', 4000);
    }
}

function addMessageToList(msgObj) {
    var iTag = '<i class="material-icons red-text lighten-1">delete</i>';
    var aTag = '<a href="#!" onclick="deleteMessage(this)" class="secondary-content valign-wrapper"">'+ iTag +'</a>';
    var deletionDiv = '<div class="col s2 m1">'+ aTag +'</div>';
    var messageDiv = '<div class="col s10 m11 truncate">' + msgObj.message + '</div>';
    var divs = '<div class="valign-wrapper">'+messageDiv+deletionDiv+'</div>';
    document.getElementById("messagesList").innerHTML += ('<li class="collection-item">'+divs+'</li>');
}

messagesArray = getSynchronizedArray(database.ref('settings/messages'), function() {
    messagesArray.forEach(function(elem) {
        addMessageToList(elem);
    });
}, function() {}, function() {});

// Tags
var tagsArray = [];

function setTagsBar() {
    $('#tagsBar').material_chip({
        data: tagsArray,
        placeholder: 'Enter a tag',
        secondaryPlaceholder: '+Tag',
    });
}

$('.chips').on('chip.add', function(e, chip){
    setTagsBar();
    var noWhiteSpaceTag = chip.tag.replace(/\s/g,'');
    tagsArray.$add({ tag: noWhiteSpaceTag }, function(index) {
        setTagsBar();
    });
});

$('.chips').on('chip.delete', function(e, chip){
    setTagsBar();
    tagsArray.$remove(chip.$id, function(index) {
        setTagsBar();
    });
});

tagsArray = getSynchronizedArray(database.ref('settings/hashtags'), function(snap) {
    setTagsBar();
}, function() {}, function() {});

// Urls
function presentAddUrlModal() {
    $('#addUrlModal').modal('open');
    $('#addUrlInput').focus();
}

var urlsArray = [];

function deleteUrl(node) {
    var index = $(node.parentNode.parentNode.parentNode).index();
    urlsArray.$remove(urlsArray[index].$id, function(index) {
        var ul = document.getElementById("urlsList");
        ul.removeChild($('#urlsList li')[index]);
    });
}

function addNewUrl() {
    var input = $('#addUrlInput');
    var url = input.val();
    //var expression = '(http|ftp|https)://[\w-]+(\.[\w-]+)*([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?';
    //var regex = new RegExp(expression);
    if (!url) {
        Materialize.toast('New url cannot be empty.', 4000);
    //} else if (!url.match(regex)) {
    //    Materialize.toast('New url has wrong format.', 4000);
    } else {
        input.val('');
        urlsArray.$add({ url: url }, function(index) {
            addUrlToList(urlsArray[index]);
        });
        $('#addUrlModal').modal('close');
    }
}


function addUrlToList(urlObj) {
    var iTag = '<i class="material-icons red-text lighten-1">delete</i>';
    var aTag = '<a href="#!" onclick="deleteUrl(this)" class="secondary-content valign-wrapper">'+ iTag +'</a>';
    var deletionDiv = '<div class="col s2 m1">'+ aTag +'</div>';
    var urlDiv = '<div class="col s7 m9 l11 truncate">' + urlObj.url + '</div>';
    var urlImage = '<img src="'+ urlObj.url+'" class="circle" width="45" height="45"/>';
    var imageDiv = '<div class="col s3 m2 l1 valign-wrapper">'+ urlImage +'</div>';
    var divs = '<div class="valign-wrapper">'+imageDiv+urlDiv+deletionDiv+'</div>';
    document.getElementById("urlsList").innerHTML += ('<li class="collection-item">'+divs+'</li>');
}

urlsArray = getSynchronizedArray(database.ref('settings/urls'), function() {
    urlsArray.forEach(function(elem) {
        addUrlToList(elem);
    })
}, function() {}, function() {});

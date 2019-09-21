/**
 * Created by dvdblk on 03/05/17.
 */
var firebaseConfig = {
    apiKey: "AIzaSyAPHI-csJ0LJeMJE1xmreVMWr9qS5Gxd-8",
    authDomain: "anime-fest.firebaseapp.com",
    databaseURL: "https://anime-fest.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
firebase.auth().signInAnonymously().catch(function(error) {});

var database = firebase.database();

//
function updateShouldRefresh(value) {
    database.ref("settings").update({ "shouldRefresh": value });
}


// Array
function getSynchronizedArray(firebaseRef, onInit, onAdd, onPeriodic) {
    var list = [];
    syncChanges(list, firebaseRef, onInit, onAdd, onPeriodic);
    wrapLocalCrudOps(list, firebaseRef);
    return list;
}

function syncChanges(list, ref, onInit, onAdd, onPeriodic) {
    ref.once('value', function(snap) {
        onInit(snap);
    });

    ref.on('value', function(snap) {
        onPeriodic(snap);
    });

    ref.on('child_added', function _add(snap, prevChild) {
        var data = snap.val();
        data.$id = snap.key; // assumes data is always an object
        var pos = positionAfter(list, prevChild);
        list.splice(pos, 0, data);
        onAdd(pos);
    });

    ref.on('child_removed', function _remove(snap) {
        var i = positionFor(list, snap.key);
        if( i > -1 ) {
            list.splice(i, 1);
        }
    });

    ref.on('child_changed', function _change(snap) {
        var i = positionFor(list, snap.key);
        if( i > -1 ) {
            list[i] = snap.val();
            list[i].$id = snap.key; // assumes data is always an object
        }
    });

    ref.on('child_moved', function _move(snap, prevChild) {
        var curPos = positionFor(list, snap.key);
        if( curPos > -1 ) {
            var data = list.splice(curPos, 1)[0];
            var newPos = positionAfter(list, prevChild);
            list.splice(newPos, 0, data);
        }
    });
}

// similar to indexOf, but uses id to find element
function positionFor(list, key) {
    for(var i = 0, len = list.length; i < len; i++) {
        if( list[i].$id === key ) {
            return i;
        }
    }
    return -1;
}

// using the Firebase API's prevChild behavior, we
// place each element in the list after it's prev
// sibling or, if prevChild is null, at the beginning
function positionAfter(list, prevChild) {
    if( prevChild === null ) {
        return 0;
    }
    else {
        var i = positionFor(list, prevChild);
        if( i === -1 ) {
            return list.length;
        }
        else {
            return i+1;
        }
    }
}

function wrapLocalCrudOps(list, firebaseRef) {
    // we can hack directly on the array to provide some convenience methods
    list.$add = function(data, completion) {
        return firebaseRef.push(data, function(error) {
            if (error != 'null') {
                // always adding at the end
                completion(list.length-1);
            }
        })
    };

    list.$remove = function(key, completion) {
        var index = positionFor(list, key);
        firebaseRef.child(key).remove(function() {
            completion(index);
        });
    };

    list.$set = function(key, newData) {
        // make sure we don't accidentally push our $id prop
        if( newData.hasOwnProperty('$id') ) { delete newData.$id; }
        firebaseRef.child(key).set(newData);
    };

    list.$indexOf = function(key) {
        return positionFor(list, key); // positionFor in examples above
    }
}

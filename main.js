var mainApp = {};

(function() {
var firebase = app_firebase;
var uid = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in.
        uid = user.id;
        } else {
            uid = null;
            window.location.replace("main.html");
        }
    });

    function logOut() {
        firebase.auth().signOut();
    }
    mainApp.logOut = logOut;
})()
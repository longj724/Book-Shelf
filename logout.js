var mainApp = {};

// Logout Users
(function() {
    var firebase = appFirebase;
    var db = appDatabase;
    var uid = null;
    var user, name, email, emailVerified, idToken;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            user = firebase.auth().currentUser;
            name = user.displayName;
            email = user.email;
            emailVerified = user.emailVerified;
            idToken = user.uid;

            console.log(name);
            console.log(email);
            console.log(emailVerified);
            console.log(idToken);

            const usersRef = db.collection('users').doc(idToken);

            usersRef.get().then(function(doc) {
                if (doc.exists) {
                    console.log("User already in the database");
                } else {
                    db.collection("users").doc(idToken).set({
                        name: name,
                        email: email,
                    })
                }
            });
        } else {
            window.location.replace("main.html");
        }
    });

    function logOut() {
        firebase.auth().signOut();
    }

    mainApp.logOut = logOut;
})()
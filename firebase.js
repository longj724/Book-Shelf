var app_firebase = {};
(function() {
    var firebaseConfig = {
        apiKey: "AIzaSyCG15yEtWdjwp5xtpwsyXuwUkwiP2miYGA",
        authDomain: "books-15585.firebaseapp.com",
        databaseURL: "https://books-15585.firebaseio.com",
        projectId: "books-15585",
        storageBucket: "",
        messagingSenderId: "858173025853",
        appId: "1:858173025853:web:12499861bd3b2bb0"
    };
    
    firebase.initializeApp(firebaseConfig);

    app_firebase = firebase;
})()
var modal = document.getElementById('myModal');
var btn = document.getElementById('add-book');
var span = document.getElementsByClassName('close')[0];

// When the user clicks on the button, open the modal 
var photoTaken = false;
function toggleModal() {
  modal.style.display = 'block';
  var modalContent = document.querySelector('.modal-content');
}

// When the user clicks on <span> (x), close the modal
function closeModal() {
    modal.style.display = 'none';
}
  
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
  
btn.addEventListener('click', toggleModal);
span.addEventListener('click', closeModal);

// Adding books to the database
var db = appDatabase;

function checkValidity() {
    var form = document.getElementById('add-book-form').elements;

    for (let i = 0; i < form.length - 1; i++) {
        if (form[i].value === '') {
            return false;
        }
    }
    return true;
}

function addBook() {
    if (!checkValidity()) { return false };

    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    var status = document.getElementsByName('status');
    var selectedStatus;

    for (var i = 0, length = status.length; i < length; i++) {
        if (status[i].checked) {
            selectedStatus = status[i].value;
            break;
        }
    }

    function Book(title, author, read) {
        this.title = title;
        this.author = author;
        this.read = function() {
            if (read === 'Has Read') {
                return true;
            }
            return false;
        }
    }

    var book = new Book(title, author, selectedStatus);

    db.collection('users').doc(userData['id']).collection('books').add({
        title: book.title,
        author: book.author,
        status: book.read()
    });
}

function confirmBookAdded() {
    if (!checkValidity()) { return false };

    var modalDiv = document.querySelector('.modal-content');
    var bookAdded = document.createElement('h3');
    bookAdded.innerHTML = 'Your book has been added';
    modalDiv.appendChild(bookAdded);
}

var bookForm = document.getElementById('add-book-form');
var addBookBtn = document.querySelector('.add-book-btn');

addBookBtn.addEventListener('click', addBook);
addBookBtn.addEventListener('click', confirmBookAdded);

// Displaying Books
function renderBooks(doc) {
    console.log(doc.data().title);
}

var ud = userData;
console.log(ud);
(function() {
    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (ud['id']) {
                resolve(ud['id']);
            } else {
                reject('Error in retrieving the users books');
            }
        }, 10000)
    })

    myPromise.then((resolve) => {
        return resolve;
    })
    .catch((err) => {
        console.log(err);
    })
    .then((result) => {
        var books = db.collection('users').doc(result).collection('books');
        books.get().then((snapshot) => {
            snapshot.docs.forEach((doc) => {
            renderBooks(doc);
            })
        })
    })
})()
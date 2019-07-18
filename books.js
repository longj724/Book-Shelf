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
    let container = document.getElementById('container');
    let item = document.createElement('div');
    let info = document.createElement('div');

    let title  = document.createElement('p');
    let author = document.createElement('p');
    let status = document.createElement('p');
    let cover = document.createElement('img');

    title.classList.add('title');
    author.classList.add('author');
    status.classList.add('author');
    cover.src = 'assets/book-img.jpg';
    cover.setAttribute('id', 'cover');

    title.innerHTML = 'Title: ' + doc.data().title;
    author.innerHTML = 'Author: ' + doc.data().author;
    if (doc.data().status === true) {
        status.innerHTML = 'Status: Read';
    } else {
        status.innerHTML = 'Status: Want to Read';
    }

    info.appendChild(title);
    info.appendChild(author);
    info.appendChild(status);

    item.classList.add('item');
    item.appendChild(cover);
    item.appendChild(info);
    container.appendChild(item);
}

var ud = userData;
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
        db.collection('users').doc(result).collection('books')
            .get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    renderBooks(doc);
                })
            })
    })
    console.log('finished');
})()
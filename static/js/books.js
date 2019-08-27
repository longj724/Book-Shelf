var modal = document.getElementById('myModal');
var btn = document.getElementById('add-book');
var span = document.getElementsByClassName('close')[0];

// When the user clicks on the button, open the modal 
var photoTaken = false;
function toggleModal() {
    modal.style.display = 'block';
    document.getElementById('title').value= "";
    document.getElementById('author').value = "";
    var container = document.querySelector('.container');
    var bookAdded = document.getElementById('#add-book-confirm')
    if (bookAdded) { container.removeChild(bookAdded); }
}

function clearSearchFilter() {
    let filterList = document.getElementById('potential-titles');
    let filterListNodes = document.getElementById('potential-titles').childNodes;
    while (filterListNodes.length != 0) {
        filterList.removeChild(filterListNodes[0]);
    }
}

// When the user clicks on <span> (x), close the modal
function closeModal() {
    modal.style.display = 'none';
    clearSearchFilter();
}
  
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        clearSearchFilter();
    }
}
  
btn.addEventListener('click', toggleModal);
span.addEventListener('click', closeModal);

// Adding books to the database
var db = appDatabase;

// Check validity of the form
function checkValidity() {
    var form = document.getElementById('add-book-form').elements;

    for (let i = 0; i < form.length - 1; i++) {
        if (form[i].value === '') {
            return false;
        }
    }
    return true;
}

// Adding a new book
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
    bookAdded.setAttribute('id', 'add-book-confirm')
    modalDiv.appendChild(bookAdded);
}

var bookForm = document.getElementById('add-book-form');
var addBookBtn = document.querySelector('.add-book-btn');

addBookBtn.addEventListener('click', addBook);
// addBookBtn.addEventListener('click', confirmBookAdded);

// Displaying Books
function renderBooks(doc, userId) {
    var container;
    if (doc.data().status) {
        container = document.getElementById('container-read');
    } else {
        container = document.getElementById('container-want-read')
    }

    // Creating and Retrieving attributes
    let loadSymbol = document.getElementById('loading')
    let item = document.createElement('div');
    let info = document.createElement('div');
    let removeBtn = document.createElement('button');
    let title  = document.createElement('p');
    let author = document.createElement('p');
    let cover = document.createElement('img');

    title.classList.add('title');
    author.classList.add('author');
    cover.classList.add('cover');
    cover.setAttribute('id', doc.id + 1);
    removeBtn.setAttribute('id', 'remove-btn');

    title.innerHTML = doc.data().title;
    author.innerHTML = 'Author: ' + doc.data().author;
    removeBtn.innerHTML = 'Remove Book';

    loadSymbol.setAttribute('style', 'display: none;')

    info.appendChild(title);
    info.appendChild(author);

    // Appending elements to the container
    item.classList.add('item');
    item.setAttribute('data-id', doc.id);
    item.appendChild(cover);
    item.appendChild(info);
    item.appendChild(removeBtn);
    item.addEventListener('click', () => {
        location.href='book-info/' + doc.data().title;
    })
    container.appendChild(item);

    // Add book cover
    getBookCover(doc.data().title, doc.id + 1)

    // Deleting data
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let parentDiv = e.target.parentElement;
        console.log(parentDiv);
        let id = parentDiv.getAttribute('data-id');
        db.collection('users').doc(userId).collection('books').doc(id).delete();
    })
}

var ud = userData;
(function() {
    let getUserId = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (ud['id']) {
                resolve(ud['id']);
            } else {
                reject('Error in retrieving the users books');
            }
        }, 10000)
    })

    getUserId.then((resolve) => {
        return resolve;
    })
    .catch((err) => {
        console.log(err);
    })
    .then((result) => {
        db.collection('users').doc(result).collection('books')
            .onSnapshot(snapshot => {
                let changes = snapshot.docChanges();
                changes.forEach(change => {
                    if (change.type === 'added') {
                        renderBooks(change.doc, result);
                    } else if (change.type === 'removed') {
                        let deletedBook = document.querySelector('[data-id=' + change.doc.id + ']');
                        let container = deletedBook.parentElement;
                        container.removeChild(deletedBook);
                    }
                })
            })
    })
})()

// Getting the book cover
function getBookCover(title, imageId) {
    let image = document.getElementById(imageId)
    fetch('https://www.googleapis.com/books/v1/volumes?q=' + title + '&key=' + apiKey.key)
    .then((response) => {
        return response.json()
    }).then((response) => {
        image.src = response.items[0].volumeInfo.imageLinks.thumbnail
    }).catch((error) => {
        image.src = '../images/book-img.jpg'
    })
}

// Fills in search boxes once title is selected
function fillInSearchBox(title, author) {
    let titleSearchBox = document.getElementById('title');
    title = title.replace(/-/g, ' ');
    titleSearchBox.value = title;

    let authorSearchBox = document.getElementById('author');
    author = author.replace(/ /g, ' ');
    authorSearchBox.value = author;

    clearSearchFilter();
}

// Searching for books
var titleInput = document.getElementById('title')
function filterBookSearch() {
    let filter = titleInput.value;
    let filterList = document.getElementById('potential-titles');
    fetch('https://www.googleapis.com/books/v1/volumes?q=' + filter + '&key=' + apiKey.key)
    .then((response) => {
        return response.json();
    }).then((response) => {
        clearSearchFilter();
        for (let i = 0; i < 5; i++) {
            let title = response.items[i].volumeInfo.title;
            let author = response.items[i].volumeInfo.authors[0];
            let titleElement = document.createElement('li');
            let titleLink = document.createElement('a');
            titleLink.setAttribute('title', title);
            titleLink.innerHTML = title + " - " + author;
            title = JSON.stringify(title.replace(/ /g, '-'));
            author = JSON.stringify(author.replace(/ /g, '-'));
            titleLink.setAttribute('onclick', `fillInSearchBox(${title}, ${author})`);
            titleElement.appendChild(titleLink);
            filterList.appendChild(titleElement);
        }
    })
}

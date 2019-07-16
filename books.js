var modal = document.getElementById("myModal");
var btn = document.getElementById("add-book");
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
var photoTaken = false;
function toggleModal() {
  modal.style.display = "block";
  var modalContent = document.querySelector('.modal-content');
}

// When the user clicks on <span> (x), close the modal
function closeModal() {
    modal.style.display = "none";
}
  
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
  
btn.addEventListener('click', toggleModal);
span.addEventListener('click', closeModal);

// Adding books to the database
var db = appDatabase;

function addBook() {
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
            if (read == 'Has Read') {
                return true;
            }
            return false;
        }
    }

    var book = new Book(title, author, selectedStatus);

    var testing = db.collection('users').doc(userData['id']);

    testing.set({
        works3: true
    }, { merge: true })

    db.collection('users').doc(userData['id']).collection('books').add({
        title: book.title,
        author: book.author,
        status: book.read()
    });

    console.log("this works");
}

function doSomething() {
    var modalDiv = document.querySelector(".modal-content");
    var bookAdded = document.createElement('h3');
    bookAdded.innerHTML = "Your book has been added";
    modalDiv.appendChild(bookAdded);
    return false;
}
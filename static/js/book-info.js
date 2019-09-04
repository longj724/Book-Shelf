function getBookCover(title) {
    let image = document.createElement('img');
    fetch('https://www.googleapis.com/books/v1/volumes?q=' + title + '&key=' + apiKey.key)
    .then((response) => {
        return response.json()
    }).then((response) => {
        image.src = response.items[0].volumeInfo.imageLinks.thumbnail
    }).catch((error) => {
        image.src = '../images/book-img.jpg'
    })
    return image;
}

// Getting page url
let url = window.location.href;
url = url.replace('http://localhost:3000/book-info/','');
url = url.replace(/%/g, ' ');
url = url.replace(/20/g, ' ');
let image = getBookCover(url);
let bookContainer = document.getElementById('book-container');
bookContainer.appendChild(image);

let homeButton = document.getElementById('home');
homeButton.addEventListener('click', () => {
    window.location.href = '/books'
})
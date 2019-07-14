(function() {
    var db = appDatabase;
    
})();

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
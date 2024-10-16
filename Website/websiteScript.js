
//This returns false if certain options are not clicked
function validateForm() {
    var state = document.getElementById('state').value;
    var rating = document.getElementById('disability-rating').value;
    var errorMessage = document.getElementById('error-message');

    if (state === "Choose" || rating === "None") {
        errorMessage.textContent = "You need to choose valid options for both state and disability rating.";
        return false;
    } else {
        errorMessage.textContent = "";
        return true;
    }
}//Validate Form
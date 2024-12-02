async function validateForm() {
    const state = document.getElementById('state').value;
    const rating = document.getElementById('disability-rating').value;
    const errorMessage = document.getElementById('error-message');
    const outputDiv = document.getElementById('output'); // Add this to display the result

    // Validate that valid options are selected
    if (state === "None" || rating === "None") {
        errorMessage.textContent = "You need to choose valid options for both state and disability rating.";
        outputDiv.textContent = ""; // Clear any previous output
        return false;
    }

    errorMessage.textContent = ""; // Clear error message if validation passes

    try {
        // Fetch data from the server
        const response = await fetch(`/api/getBenefits?state=${state}&rating=${rating}`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Display the data on the page
        if (data && data.benefits) {
            outputDiv.textContent = `For state ${state} and disability rating ${rating}%, the benefits are: ${data.benefits}`;
        } else {
            outputDiv.textContent = "No data available for the selected state and disability rating.";
        }
    } catch (error) {
        console.error(error);
        outputDiv.textContent = "An error occurred while fetching data. Please try again.";
    }

    return false; // Prevent the form from submitting
}

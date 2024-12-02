// Add event listener to form
document.getElementById("benefits-form").addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const state = document.getElementById("state").value;
    const rating = document.getElementById("disability-rating").value;
    const errorMessage = document.getElementById("error-message");
    const outputDiv = document.getElementById("benefits");

    // Validate user input
    if (state === "None" || rating === "None") {
        errorMessage.textContent = "Please select valid options for both state and disability rating.";
        return;
    }

    // Clear any previous error messages
    errorMessage.textContent = "";

    try {
        // Fetch data from the backend API
        const response = await fetch(`/api/getBenefits?state=${state}&rating=${rating}`);

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Display benefits or fallback message
        if (data && data.benefits) {
            outputDiv.textContent = data.benefits;
        } else {
            outputDiv.textContent = "No data available for the selected state and disability rating.";
        }

        // Hide form and show results
        document.getElementById("form-section").classList.add("hidden");
        document.getElementById("results-section").classList.remove("hidden");
    } catch (error) {
        console.error("Error fetching data:", error);
        errorMessage.textContent = "An error occurred while fetching the data. Please try again.";
    }
}

function goBack() {
    // Show form and hide results
    document.getElementById("form-section").classList.remove("hidden");
    document.getElementById("results-section").classList.add("hidden");
}

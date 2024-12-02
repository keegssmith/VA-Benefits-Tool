
// Import necessary modules for backend functionality
const express = require("express");
const fs = require("fs");
const sql = require("mssql");
const path = require("path");

const app = express();

// Database configuration (No username/password for local development)
const dbConfig = {
    server: "", // Use your local database server
    database: "yourDatabaseName", // Replace with your database name
    options: {
        encrypt: false, // No encryption needed for local dev
        trustServerCertificate: true, // For self-signed certificates
    },
};

// API to handle benefit requests
app.get("/api/getBenefits", async (req, res) => {
    const { state, rating } = req.query;

    if (!state || !rating) {
        return res.status(400).json({ error: "State and rating are required." });
    }

    try {
        // Read the SQL file
        const queryTemplate = fs.readFileSync(path.join(__dirname, "../database/website_handle.sql"), "utf-8");

        // Replace placeholders in SQL file
        const query = queryTemplate
            .replace(/@state/g, `'${state}'`) // Replace @state with the state value
            .replace(/@rating/g, `${rating}`); // Replace @rating with the rating value

        // Connect to the database
        const pool = await sql.connect(dbConfig);

        // Execute the query
        const result = await pool.request().query(query);

        if (result.recordset.length === 0) {
            return res.json({ benefits: "No data available for the selected state and rating." });
        }

        // Send the result to the frontend
        res.json(result.recordset[0]);
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).json({ error: "Database query failed." });
    }
});

// Serve the frontend
app.use(express.static(path.join(__dirname)));

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

// Frontend logic for form handling
if (typeof window !== "undefined") {
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
}

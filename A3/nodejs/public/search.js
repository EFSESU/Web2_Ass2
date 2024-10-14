// Listen for the DOM content to be loaded before executing the script
document.addEventListener('DOMContentLoaded', async () => {
  // Get the search form element by its ID
  const searchForm = document.getElementById('searchForm');
  // Get the container element where search results will be displayed by its ID
  const searchResultsContainer = document.getElementById('searchResults');

  // Add an event listener to handle the form submission
  searchForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Get the form data using the FormData interface
    const formData = new FormData(searchForm);
    // Extract the organizer, city, and category from the form data
    const organizer = formData.get('organizer');
    const city = formData.get('city');
    const categoryId = formData.get('category');

    // Construct the query parameters for the API request
    const queryParams = new URLSearchParams({ organizer, city, CATEGORY_ID: categoryId }).toString();
    try {
      // Make a fetch request to the API with the query parameters
      const response = await fetch(`/api/search?${queryParams}`);
      // Parse the JSON response body
      const results = await response.json();

      // Check if the results are null, indicating no fundraisers were found
      if (results == null) {
        // Create a paragraph element to display the error message
        const errorElement = document.createElement('p');
        errorElement.textContent = 'No fundraisers found.';
        errorElement.style.color = 'red';
        // Clear the search results container and append the error message
        searchResultsContainer.innerHTML = '';
        searchResultsContainer.appendChild(errorElement);
      } else {
        // Clear the search results container
        searchResultsContainer.innerHTML = '';
        // Iterate over the results and create a div for each fundraiser
        results.forEach(fundraiser => {
          const fundraiserElement = document.createElement('div');
          // Set the HTML content for the fundraiser element
          fundraiserElement.innerHTML = `
            <p><strong>ID:</strong> ${fundraiser.FUNDRAISE_ID}</p>
            <p><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
            <p><strong>Description:</strong> ${fundraiser.CAPTION}</p>
            <p><strong>Target Funding:</strong> $${fundraiser.TARGET_FUNDING}</p>
            <p><strong>Current Funding:</strong> $${fundraiser.CURRENT_FUNDING}</p>
            <p><strong>City:</strong> ${fundraiser.CITY}</p>
            <p><strong>Active:</strong> ${fundraiser.ACTIVE ? 'Yes' : 'No'}</p>
            <p><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>
            <a href="/Fundraiser?id=${fundraiser.FUNDRAISE_ID}">Details</a>
          `;
          // Append the fundraiser element to the search results container
          searchResultsContainer.appendChild(fundraiserElement);
        });
      }
    } catch (error) {
      // Log any errors that occur during the search to the console
      console.error('Error searching fundraisers:', error);
    }
  });
});

// Function to clear the search form and the search results
function clearForm() {
  document.getElementById('searchForm').reset();
  document.getElementById('searchResults').innerHTML = '';
}

// Function to redirect to the home page
function HomeForm() {
  window.location.href = "index.html";
}
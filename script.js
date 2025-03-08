window.onload = function() {
    document.getElementById('announcement').classList.add('show');
};

function closeAnnouncement() {
    document.getElementById('announcement').classList.remove('show');
}

document.getElementById('landing').addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

const cors = require('cors');
app.use(cors());

async function searchDatabase() {
    let query = document.getElementById('searchBox').value.trim();
    if (query.length < 2) return;  // Prevent very short searches

    try {
        let response = await fetch(`https://lgbtqplusproject.org/search?query=${encodeURIComponent(query)}`);
        let results = await response.json();

        // Log the results to verify if data is returned
        console.log("Search Results:", results);

        let resultsContainer = document.getElementById('searchResultsContainer');
        resultsContainer.innerHTML = ""; // Clear previous results

        if (Array.isArray(results) && results.length > 0) {
            results.forEach(item => {
                let resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.innerHTML = `<h3>${item.name || 'No Name Found'}</h3>
                                        <p>${item.contribution || 'No Contribution Found'}</p>`;
                resultsContainer.appendChild(resultItem);
            });

            // Show the search results box after results are added
            document.getElementById('searchResultsBox').classList.add('show');
        } else {
            resultsContainer.innerHTML = "<p>No results found</p>";
            document.getElementById('searchResultsBox').classList.add('show');
        }
    } catch (error) {
        console.error("Search error:", error);
    }
}
function closeSearchBox() {
    document.getElementById('searchResultsBox').classList.remove('show');  // Hide the pop-up
}

window.onload = function() {
    document.getElementById('announcement').classList.add('show');
};

document.getElementById('landing').addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
}); // <-- Closed the missing bracket here

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        document.getElementById("announcement").classList.add("show");
    }, 1000); // Delay before fade-in
});

function closeAnnouncement() {
    const box = document.getElementById("announcement");
    box.style.opacity = "0";
    setTimeout(() => {
        box.style.visibility = "hidden";
    }, 1500); // Matches fade-out time
}
    
async function searchDatabase() {
    let query = document.getElementById('searchBox').value.trim();
    if (query.length < 2) return;  // Prevent very short searches

    try {
        if (query && query.trim().length > 0) {
            let response = await fetch(`https://lgbtqplusproject.onrender.com/search?query=${encodeURIComponent(query)}`);
            let results = await response.json(); // Ensure this is inside the if block

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
        }
    } catch (error) {
        console.error("Search error:", error);
    }
}

document.getElementById('searchButton').addEventListener('click', searchDatabase);

function closeSearchBox() {
    document.getElementById('searchResultsBox').classList.remove('show');  // Hide the pop-up
}

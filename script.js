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


async function searchDatabase() {
    let query = document.getElementById('searchBox').value.trim();
    if (query.length < 2) return;  // Avoid searching for very short inputs

    try {
        let response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(query)}`);
        let results = await response.json();

        let resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = "";

        if (Array.isArray(results) && results.length > 0) {
            results.forEach(item => {
                // Check if title and description exist in the result
                console.log(item);  // Log each item to ensure it contains the expected properties

                let resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.innerHTML = `<h3>${item.name || 'No Name found'}</h3><p>${item.contribution || 'No Contriubtion Found'}</p>`;
                resultsContainer.appendChild(resultItem);
            });
        } else {
            resultsContainer.innerHTML = "<p>No results found</p>";
        }
    } catch (error) {
        console.error("Search error:", error);
    }
}

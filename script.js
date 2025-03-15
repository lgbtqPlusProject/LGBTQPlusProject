// Window onLoad
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        document.getElementById("announcement").classList.add("show");
    }, 1000);
});

// Landing Scroll
document.getElementById('landing').addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

// Navbar Scroll Handling
const navbar = document.getElementById('navbar');
const contentSection = document.getElementById('content');
const aboutSection = document.getElementById('about');

function toggleNavbar() {
    const scrollPosition = window.scrollY;
    const contentTop = contentSection.offsetTop;
    const contentHeight = contentSection.offsetHeight;
    const aboutTop = aboutSection.offsetTop;
    const aboutHeight = aboutSection.offsetHeight;

    if (
        (scrollPosition >= contentTop && scrollPosition <= contentTop + contentHeight) ||
        (scrollPosition >= aboutTop && scrollPosition <= aboutTop + aboutHeight)
    ) {
        navbar.style.display = 'block';
        contentSection.classList.add('navbar-visible');
    } else {
        navbar.style.display = 'none';
        contentSection.classList.remove('navbar-visible');
    }
}

if (navbar && contentSection && aboutSection) {
    window.addEventListener('scroll', toggleNavbar);
    toggleNavbar();  // Call on page load
}

// Announcement Handling
function closeAnnouncement() {
    const box = document.getElementById("announcement");
    box.style.opacity = "0";
    setTimeout(() => {
        box.style.visibility = "hidden";
    }, 1500);
}

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function () {
    const contactFormContent = document.getElementById('contactFormContent');
    const successMessage = document.getElementById('successMessage');

    contactFormContent.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(contactFormContent);

        fetch(contactFormContent.action, {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" }
        })
        .then(response => {
            if (response.ok) {
                contactFormContent.style.display = 'none';
                successMessage.style.display = 'block';
            } else {
                alert("⚠️ Oops! There was a problem sending your message.");
            }
        })
        .catch(error => alert("⚠️ Oops! There was a problem."));
    });
});

// Search Archive Handling
async function searchArchive(query) {
    const apiUrl = `https://archive.org/advancedsearch.php?q=title:${encodeURIComponent(query)}&fl[]=title&fl[]=creator&rows=5&start=0&output=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const resultDiv = document.getElementById('result');
        const resultPopup = document.getElementById('resultPopup');
        const closePopupBtn = document.getElementById('closePopup');
        const items = data.response.docs;

        // Show the result popup
        resultPopup.style.display = 'block';

        let resultHTML = items.length > 0 ? '<ul>' : '<p>No results found.</p>';
        items.forEach(item => {
            const creators = Array.isArray(item.creator) ? item.creator.join(', ') : (item.creator || 'N/A');
            resultHTML += `
                <li>
                    <strong>Title:</strong> <a href="https://archive.org/search.php?query=${encodeURIComponent(item.title)}" target="_blank">${item.title}</a><br>
                    <strong>Creator:</strong> ${creators}
                </li>
            `;
        });
        resultHTML += '</ul>';
        resultDiv.innerHTML = resultHTML;

        // Close the popup on close button click
        closePopupBtn.addEventListener('click', function () {
            resultPopup.style.display = 'none';
        });
    } catch (error) {
        console.error('Error fetching the API:', error);
        document.getElementById('result').innerHTML = '<p>There was an error fetching the results.</p>';
    }
}

// Trigger search on search button click
document.getElementById('searchBtn').addEventListener('click', function () {
    const query = document.getElementById('searchInput').value.trim();

    if (query === '') return;

    // Log the search query in your database
    fetch('https://lgbtqplusproject.onrender.com/logSearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Send data as JSON
        },
        body: JSON.stringify({ query: query })  // Ensure the query is correctly stringified as JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Search logged successfully') {
            console.log('Search logged successfully.');
        } else {
            console.error('Failed to log search:', data.error);
        }
    })
    .catch(error => {
        console.error('Error logging search:', error);
    });

    // Proceed with the search
    searchArchive(query);
});

// Close search popup function
function closeSearchPopup() {
    document.getElementById('resultPopup').style.display = 'none';
}

// Function to search logs
function searchLogs() {
    const searchQuery = document.getElementById('logSearchQuery').value;

    console.log("Searching logs for: ", searchQuery); // Debug log

    fetch(`https://lgbtqplusproject.onrender.com/logsearch?query=${searchQuery}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const logsContainer = document.querySelector("#logTable tbody");
            logsContainer.innerHTML = ""; // Clear previous logs

            if (data.logs.length === 0) {
                const noResultsRow = document.createElement("tr");
                noResultsRow.innerHTML = "<td colspan='2'>No results found</td>";
                logsContainer.appendChild(noResultsRow);
            }

            data.logs.forEach(log => {
                const logRow = document.createElement("tr");
                logRow.innerHTML = `
                    <td>${log.query}</td>
                    <td>${log.search_time}</td>
                `;
                logsContainer.appendChild(logRow);
            });
        })
        .catch(error => {
            console.error('Error fetching logs:', error);
            alert('⚠️ Error fetching logs. Please try again later.');
        });
}

// Function to search the historicalFigures table in the database
async function searchDatabase(query) {
    if (!query || query.length < 2) {
        return; // Don't search if the query is undefined or too short
    }

    const url = `https://lgbtqplusproject.onrender.com/search?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, {
            method: 'GET', // Ensure you're sending a GET request
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || 'Error fetching results');
            return;
        }

        const data = await response.json();

        // Display results in a popup or any other method you prefer
        const resultDiv = document.getElementById('result');
        const resultPopup = document.getElementById('resultPopup');
        const closePopupBtn = document.getElementById('closePopup');
        resultPopup.style.display = 'block';

        if (data.length > 0) {
            let resultHTML = '<ul>';
            data.forEach(item => {
                resultHTML += `
                    <li>
                        <strong>Name:</strong> ${item.name}<br>
                        <strong>Contribution:</strong> ${item.contribution}<br>
                        <strong>Country:</strong> ${item.country}
                    </li>
                `;
            });
            resultHTML += '</ul>';
            resultDiv.innerHTML = resultHTML;
        } else {
            resultDiv.innerHTML = '<p>No results found in the database.</p>';
        }

        // Close popup logic
        closePopupBtn.addEventListener('click', function () {
            resultPopup.style.display = 'none';
        });

    } catch (error) {
        console.error('Error fetching database search results:', error);
        alert('⚠️ Error fetching data from the database. Please try again later.');
    }
}

// Event listener for the search button
document.getElementById('searchBtnDatabase').addEventListener('click', function () {
    const query = document.getElementById('searchBox').value.trim();

    if (query === '') return;  // Prevents empty search

    searchDatabase(query);
});

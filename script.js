// Window onLoad
window.onload = function() {
    document.getElementById('announcement').classList.add('show');
};

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

window.addEventListener('scroll', toggleNavbar);
toggleNavbar();  // Call on page load

// Announcement Handling
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        document.getElementById("announcement").classList.add("show");
    }, 1000);
});

function closeAnnouncement() {
    const box = document.getElementById("announcement");
    box.style.opacity = "0";
    setTimeout(() => {
        box.style.visibility = "hidden";
    }, 1500);
}

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.getElementById('contactBtn');
    const contactForm = document.getElementById('contactForm');
    const contactFormContent = document.getElementById('contactFormContent');
    const successMessage = document.getElementById('successMessage');

    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            contactForm.style.display = 'flex';
            successMessage.style.display = 'none';
            contactFormContent.style.display = 'block';
            contactFormContent.reset();
        });
    }

    window.closeForm = function() {
        contactForm.style.display = 'none';
        successMessage.style.display = 'none';
        contactFormContent.style.display = 'block';
        contactFormContent.reset();
    };

    contactFormContent.addEventListener('submit', function(event) {
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

    if (items.length > 0) {
      let resultHTML = '<ul>';
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
    } else {
      resultDiv.innerHTML = '<p>No results found.</p>';
    }

    // Close the popup when clicking the close button
    closePopupBtn.addEventListener('click', function () {
      resultPopup.style.display = 'none'; // Hide the result popup
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
    fetch('https://lgbtqplusproject.org/path/to/logSearch.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `query=${encodeURIComponent(query)}`
    }).then(response => {
        console.log('Search logged successfully.');
    }).catch(error => {
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

    fetch(`https://lgbtqplusproject.org/searchLogs?query=${searchQuery}`)
        .then(response => response.json())
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
                    <td>${log.timestamp}</td>
                `;
                logsContainer.appendChild(logRow);
            });
        })
        .catch(error => console.error('Error fetching logs:', error));
}

async function searchDatabase() {
    let query = document.getElementById('searchBox').value.trim();
    if (query.length < 2) return;

    try {
        let response = await fetch(`https://archive.org/advancedsearch.php?q=title:${encodeURIComponent(query)}&fl[]=title&fl[]=creator&rows=5&start=0&output=json`);
        let data = await response.json();

        // Log the search query in the database
        fetch('https://lgbtqplusproject.org/logSearch.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `query=${encodeURIComponent(query)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Search query logged successfully.');
            } else {
                console.error('Error logging search query:', data.message);
            }
        })
        .catch(error => console.error('Error logging search query:', error));

        // Process the search results and display them in the popup
        const resultDiv = document.getElementById('result');
        const resultPopup = document.getElementById('resultPopup');
        const closePopupBtn = document.getElementById('closePopup');
        const items = data.response.docs;

        resultPopup.style.display = 'block';

        if (items.length > 0) {
            let resultHTML = '<ul>';
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
        } else {
            resultDiv.innerHTML = '<p>No results found.</p>';
        }

        closePopupBtn.addEventListener('click', function () {
            resultPopup.style.display = 'none';
        });
    } catch (error) {
        console.error('Error fetching the API:', error);
        document.getElementById('result').innerHTML = '<p>There was an error fetching the results.</p>';
    }
}

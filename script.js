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

// Search Database Handling
async function searchDatabase() {
    let query = document.getElementById('searchBox').value.trim();
    if (query.length < 2) return;

    try {
        let response = await fetch(`https://lgbtqplusproject.onrender.com/search?query=${encodeURIComponent(query)}`);
        let results = await response.json();
        console.log("Search Results:", results);

        let resultsContainer = document.getElementById('searchResultsContainer');
        resultsContainer.innerHTML = "";

        if (results.length > 0) {
            results.forEach(figure => {
                let item = document.createElement("div");
                item.innerHTML = `
                    <h3>${figure.name}</h3>
                    <p><strong>Born:</strong> ${figure.birth_year}</p>
                    <p><strong>Death:</strong> ${figure.death_year}</p>
                    <p><strong>Country:</strong> ${figure.country}</p>
                    <p><strong>Contribution:</strong> ${figure.contribution}</p>
                `;
                resultsContainer.appendChild(item);
            });
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

// TimeMachine API Handling
async function fetchSnapshot() {
    const url = document.getElementById('urlInput').value;
    const date = document.getElementById('dateInput').value;

    if (!url) {
        alert('Please enter a URL.');
        return;
    }

    const apiUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}&timestamp=${date}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.archived_snapshots?.closest?.url) {
            const snapshotUrl = data.archived_snapshots.closest.url;
            document.getElementById('result').innerHTML = `<iframe src="${snapshotUrl}"></iframe>`;
            saveSnapshot(url, date, snapshotUrl);
        } else {
            document.getElementById('result').innerHTML = 'No snapshot available for this URL and date.';
        }
    } catch (error) {
        console.error('Error fetching snapshot:', error);
        alert('An error occurred while fetching the snapshot. Please try again.');
    }
}

function saveSnapshot(url, date, snapshotUrl) {
    const data = {
        url: url,
        date: date,
        snapshotUrl: snapshotUrl
    };

    fetch('/save-snapshot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.success) {
            alert('Snapshot saved successfully!');
        } else {
            alert('Error saving snapshot');
        }
    })
    .catch(error => {
        console.error('Error saving snapshot:', error);
        alert('Error saving snapshot');
    });
}

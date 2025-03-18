document.addEventListener('DOMContentLoaded', function () {

    // Show Announcement
    setTimeout(() => {
        const announcement = document.getElementById("announcement");
        if (announcement) announcement.classList.add("show");
    }, 1000);

    // Landing Scroll
    const landing = document.getElementById('landing');
    if (landing) {
        landing.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Navbar Scroll Handling
    const navbar = document.getElementById('navbar');
    const contentSection = document.getElementById('content');
    const aboutSection = document.getElementById('about');
    const imlSection = document.getElementById('iml-feature');
    const lesSection = document.getElementById('lesbian-legacy');

    function toggleNavbar() {
        const scrollPosition = window.scrollY;

        if (
            (scrollPosition >= contentSection.offsetTop) ||
            (scrollPosition >= aboutSection.offsetTop) ||
            (scrollPosition >= imlSection.offsetTop) ||
            (scrollPosition >= lesSection.offsetTop)
        ) {
            navbar.style.display = 'block';
        } else {
            navbar.style.display = 'none';
        }
    }

    if (navbar && contentSection && aboutSection && imlSection && lesSection) {
        window.addEventListener('scroll', toggleNavbar);
        toggleNavbar();
    }

    // Contact Form Handling
    const contactBtn = document.getElementById('contactBtn');
    const contactPopup = document.getElementById('contactPopup');
    const contactFormContent = document.getElementById('contactFormContent');
    const successMessage = document.getElementById('successMessage');
    const closeButton = document.querySelector('.close-btn1');

    function openPopup() {
        contactPopup.style.display = 'flex';
        setTimeout(() => {
            contactPopup.style.opacity = '1';
        }, 10);
    }

    function closePopup() {
        contactPopup.style.opacity = '0';
        setTimeout(() => {
            contactPopup.style.display = 'none';
            if (contactFormContent) contactFormContent.reset();
        }, 400);
    }

    if (contactBtn) {
        contactBtn.addEventListener('click', function (event) {
            event.preventDefault();
            openPopup();
            if (successMessage) successMessage.style.display = 'none';
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
    }

    if (contactFormContent) {
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
                    successMessage.style.display = 'block';
                    setTimeout(closePopup, 2000);
                } else {
                    alert("⚠️ Oops! There was a problem sending your message.");
                }
            })
            .catch(error => alert("⚠️ Oops! There was a problem."));
        });
    }
    
    
    console.log("Search button listeners are working.");  // Add this at the top of your script.js file

    // Search Archive Handling
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            console.log("Archive Search Button Clicked");
            const query = document.getElementById('searchInput').value.trim();
            if (query) searchArchive(query);  // Make sure this function is defined somewhere!
        });
    }

    // Search Database Handling
    const searchBtnDatabase = document.getElementById('searchBtnDatabase');
    if (searchBtnDatabase) {
        searchBtnDatabase.addEventListener('click', function () {
            console.log("Database Search Button Clicked");
            const query = document.getElementById('searchBox').value.trim();
            if (query) searchDatabase(query);  // Make sure this function is defined somewhere!
        });
    }

    // Trigger IML section reveal
    const imlFeature = document.getElementById('iml-feature');
    if (imlFeature) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    imlFeature.classList.add('show');
                }
            });
        }, { threshold: 0.1 });
        observer.observe(imlFeature);
    }
});

// Database Search Function
async function searchDatabase(query) {
    if (!query || query.length < 2) {
        alert('Please enter a valid search query.');
        return;
    }

    const url = `https://lgbtqplusproject.onrender.com/search?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || 'Error fetching results');
            return;
        }

        const data = await response.json();
        const resultDiv = document.getElementById('searchResultsContainer');

        if (data.length > 0) {
            let resultHTML = '<ul>';
            data.forEach(item => {
                resultHTML += `<li><strong>Name:</strong> ${item.name} - <strong>Contribution:</strong> ${item.contribution} - <strong>Country:</strong> ${item.country}</li>`;
            });
            resultHTML += '</ul>';
            resultDiv.innerHTML = resultHTML;
        } else {
            resultDiv.innerHTML = '<p>No results found in the database.</p>';
        }

        document.getElementById('searchResultsBox').style.display = 'block';
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        alert('⚠️ Error fetching data from the database. Please try again later.');
    }
}


// Close Search Results Box
function closeSearchBox() {
    const searchResultsBox = document.getElementById('searchResultsBox');
    if (searchResultsBox) {
        searchResultsBox.style.display = 'none';
    }
}

// Close Archive Search Popup
function closeSearchPopup() {
    const resultPopup = document.getElementById('resultPopup');
    if (resultPopup) {
        resultPopup.style.display = 'none';
    }
}


// Archive Search Function
async function searchArchive(query) {
    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    const apiUrl = `https://archive.org/advancedsearch.php?q=title:${encodeURIComponent(query)}&fl[]=title&fl[]=creator&rows=5&output=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const items = data.response.docs;

        const resultDiv = document.getElementById('result');
        let resultHTML = items.length > 0 ? '<ul>' : '<p>No results found.</p>';

        items.forEach(item => {
            const creators = Array.isArray(item.creator) ? item.creator.join(', ') : (item.creator || 'N/A');
            const encodedTitle = encodeURIComponent(item.title);

            resultHTML += `
                <li>
                    <strong>Title:</strong> 
                    <a href="https://archive.org/search.php?query=${encodedTitle}" target="_blank">${item.title}</a><br>
                    <strong>Creator:</strong> ${creators}
                </li>
            `;
        });

        resultHTML += '</ul>';
        resultDiv.innerHTML = resultHTML;

        // Show the popup
        const resultPopup = document.getElementById('resultPopup');
        if (resultPopup) {
            resultPopup.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching data from Archive.org:', error);
        alert('⚠️ Error fetching data. Please try again later.');
    }
}

function closeAnnouncement() {
    document.getElementById('announcement').style.display = 'none';
}

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

    const apiUrl = `https://archive.org/advancedsearch.php?q=title:${encodeURIComponent(query)}&fl[]=title&fl[]=creator&rows=50&start=0&output=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Log the full response to inspect the structure
        console.log('API Response:', data);

        const items = data.response.docs;

        if (items.length === 0) {
            alert('No results found.');
            return;
        }

        // Select a random subset of results (e.g., 5 random results)
        const randomResults = getRandomItems(items, 5);

        const resultDiv = document.getElementById('result');
        let resultHTML = randomResults.length > 0 ? '<ul>' : '<p>No random results found.</p>';

        randomResults.forEach(item => {
            // Log the item to see what we have
            console.log('Item:', item);

            const creators = Array.isArray(item.creator) ? item.creator.join(', ') : (item.creator || 'N/A');
            const encodedTitle = encodeURIComponent(item.title);

            resultHTML += `
                <li>
                    <strong>Title:</strong> 
                    <a href="https://archive.org/search.php?query=${encodedTitle}" target="_blank">${item.title}</a><br>
                    <strong>Creator:</strong> ${creators}
                </li>
            `;

            // Log the search result to the database
            logSearch(query, item.title, creators);
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


// Function to get random items from an array
function getRandomItems(arr, num) {
    const shuffled = arr.slice(0); // Copy the array to avoid mutating the original
    let i = arr.length, temp, randomIndex;

    while (i !== 0) {
        randomIndex = Math.floor(Math.random() * i);
        i -= 1;
        temp = shuffled[i];
        shuffled[i] = shuffled[randomIndex];
        shuffled[randomIndex] = temp;
    }

    return shuffled.slice(0, num); // Return the first `num` random items
}


//log archive search query
function logSearch(query, title, creator) {
    console.log(`Attempting to log search for: ${query}`);
    console.log(`Title: ${title}, Creator: ${creator}`);  // Log the parameters being sent

    // Check if the data exists before sending
    if (!title || !creator) {
        console.error('Missing title or creator, cannot log search.');
        return; // Exit early if title or creator is missing
    }

    fetch('https://php.lgbtqplusproject.org/logsearch.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchQuery: query, title: title, creator: creator })  // Send title and creator along with searchQuery
    })
    .then(response => {
        console.log('Response received:', response); // Log the full response to see if it’s valid
        if (response.ok) {
            return response.json();
        } else {
            console.error('Server responded with an error:', response);
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .then(data => {
        console.log('Data received:', data); // Log the parsed JSON data
        if (data.success) {
            console.log('✅ Search logged successfully:', data.message);
        } else {
            console.error('❌ Failed to log search:', data.message);
        }
    })
    .catch(error => console.error('❌ Error logging search:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    const testimonyForm = document.getElementById('testimonyForm'); // Ensure this is your form ID
    
    if (testimonyForm) {
        testimonyForm.addEventListener('submit', function (event) {
            event.preventDefault();  // Prevent default form submission
            
            // Prepare form data
            const formData = new FormData(testimonyForm);
            const data = {};
            
            // Populate the data object with form data
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Send the form data using Fetch API
            fetch('https://php.lgbtqplusproject.org/logsearch.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // We are sending JSON data
                },
                body: JSON.stringify(data)  // Convert form data to JSON
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Your testimony has been submitted successfully!');
                    testimonyForm.reset();  // Reset the form
                } else {
                    alert('There was an issue submitting your story: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error submitting your testimony.');
            });
        });
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const elementsToShow = document.querySelectorAll('.form-text-box, .form-box');

    function revealOnScroll() {
        elementsToShow.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                element.classList.add('show-on-scroll');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger animation if elements are already in view
});

//close announcement
function closeAnnouncement() {
    document.getElementById('announcement').style.display = 'none';
}

document.querySelector(".sidebar-toggle").addEventListener("click", function() {
  document.querySelector(".sidebar").classList.toggle("open");
});



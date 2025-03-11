window.onload = function() {
    document.getElementById('announcement').classList.add('show');
};

document.getElementById('landing').addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});


// Select the navbar and sections
const navbar = document.getElementById('navbar');
const contentSection = document.getElementById('content');
const aboutSection = document.getElementById('about');

// Function to toggle navbar visibility based on scroll position
function toggleNavbar() {
  const scrollPosition = window.scrollY;

  // Get the offsetTop and height of the content and about sections
  const contentTop = contentSection.offsetTop;
  const contentHeight = contentSection.offsetHeight;
  const aboutTop = aboutSection.offsetTop;
  const aboutHeight = aboutSection.offsetHeight;

  // Show navbar if within the content or about sections
  if (
    (scrollPosition >= contentTop && scrollPosition <= contentTop + contentHeight) ||
    (scrollPosition >= aboutTop && scrollPosition <= aboutTop + aboutHeight)
  ) {
    navbar.style.display = 'block'; // Show navbar
    contentSection.classList.add('navbar-visible'); // Push content down
  } else {
    navbar.style.display = 'none'; // Hide navbar
    contentSection.classList.remove('navbar-visible'); // Reset margin
  }
}

// Add event listener to trigger on scroll
window.addEventListener('scroll', toggleNavbar);

// Call the function initially to handle page load case
toggleNavbar();

// Add event listener to trigger on scroll
window.addEventListener('scroll', toggleNavbar);

// Call the function initially to handle page load case
toggleNavbar();

// Add event listener to trigger on scroll
window.addEventListener('scroll', toggleNavbar);

// Call the function initially to handle page load case
toggleNavbar();

// Create an IntersectionObserver instance
const observer = new IntersectionObserver(handleIntersection, observerOptions);

// Observe the content and about sections
observer.observe(document.getElementById('content'));
observer.observe(document.getElementById('about'));



//Announcement
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



document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.getElementById('contactBtn');
    const contactForm = document.getElementById('contactForm');
    const contactFormContent = document.getElementById('contactFormContent');
    const successMessage = document.getElementById('successMessage');

    // Open the contact form
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            contactForm.style.display = 'flex';
            successMessage.style.display = 'none'; // Hide success message if open
            contactFormContent.style.display = 'block'; // Show form again
            contactFormContent.reset(); // Reset form fields
        });
    }

    // Close the contact form and reset everything
    window.closeForm = function() {
        contactForm.style.display = 'none';
        successMessage.style.display = 'none'; // Hide the success message
        contactFormContent.style.display = 'block'; // Make sure the form is visible again
        contactFormContent.reset(); // Clear form fields for a fresh start
    };

    // Handle Form Submission with AJAX (To Prevent Page Reload)
    contactFormContent.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop default form submission

        const formData = new FormData(contactFormContent);
        
        fetch(contactFormContent.action, {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" }
        })
        .then(response => {
            if (response.ok) {
                // Hide the form and show the success message
                contactFormContent.style.display = 'none';
                successMessage.style.display = 'block';
            } else {
                alert("⚠️ Oops! There was a problem sending your message.");
            }
        })
        .catch(error => alert("⚠️ Oops! There was a problem."));
    });
});


document.addEventListener("DOMContentLoaded", function () {
    // Get the search button by its onclick event
    let searchButton = document.querySelector("button[onclick='searchDatabase()']");

    if (searchButton) {
        searchButton.addEventListener("click", searchDatabase);
    } else {
        console.error("Search button not found.");
    }
});


// Function that will be triggered when the button is clicked
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

            // Function to display results
            function displayResults(data) {
                let resultsContainer = document.getElementById("searchResultsContainer");
                resultsContainer.innerHTML = ""; // Clear previous results

                data.forEach(figure => {
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

                // Show the search results box after results are added
                document.getElementById('searchResultsBox').classList.add('show');
            }

            if (results.length > 0) {
                displayResults(results);
            } else {
                resultsContainer.innerHTML = "<p>No results found</p>";
                document.getElementById('searchResultsBox').classList.add('show');
            }
        }
    } catch (error) {
        console.error("Search error:", error);
    }
}

// Attach the searchDatabase function to the button click
document.getElementById('searchButton').addEventListener('click', searchDatabase);

function closeSearchBox() {
    document.getElementById('searchResultsBox').classList.remove('show');  // Hide the pop-up
}

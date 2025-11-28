// js/interactive.js
document.addEventListener('DOMContentLoaded', function() {
    // Package Filtering
    initPackageFilters();
    
    // Weather Widget
    initWeatherWidget();
    
    // Emergency Services
    initEmergencyServices();
    
    // Local Experiences
    initExperienceBookings();
});

// Package Filtering System
function initPackageFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const packageCards = document.querySelectorAll('.package-card');
    const resultsCount = document.getElementById('resultsCount');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            let visibleCount = 0;

            packageCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            resultsCount.textContent = `${visibleCount} packages found`;
        });
    });
}

// Weather Widget
function initWeatherWidget() {
    const weatherWidget = document.querySelector('.weather-widget');
    
    // Simulate weather data (will be replaced with API call later)
    const weatherData = {
        temp: 28,
        description: 'Mostly Cloudy',
        icon: '⛅',
        location: 'Varanasi'
    };

    function updateWeatherWidget() {
        const weatherIcon = weatherWidget.querySelector('.weather-icon');
        const weatherTemp = weatherWidget.querySelector('.weather-temp');
        const weatherDesc = weatherWidget.querySelector('.weather-desc');
        
        weatherIcon.textContent = weatherData.icon;
        weatherTemp.textContent = `${weatherData.temp}°C`;
        weatherDesc.textContent = weatherData.description;
    }

    updateWeatherWidget();

    // Update weather every 30 minutes
    setInterval(() => {
        // This will be replaced with actual API call
        console.log('Updating weather data...');
    }, 30 * 60 * 1000);
}

// Emergency Services
function initEmergencyServices() {
    // Emergency call functionality
    window.callEmergency = function(number) {
        if (confirm(`Call ${number}?`)) {
            window.location.href = `tel:${number}`;
        }
    };
}

// Local Experience Bookings
function initExperienceBookings() {
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const price = this.querySelector('.exp-price').textContent;
            
            // Open booking modal for experience
            openExperienceBooking(title, price);
        });
    });
}

function openExperienceBooking(title, price) {
    // Create a simple booking modal
    const modal = document.createElement('div');
    modal.className = 'experience-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Book ${title}</h3>
            <p>Price: ${price}</p>
            <button onclick="closeExperienceModal()">Close</button>
            <button onclick="proceedToBooking('${title}')">Book Now</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeExperienceModal() {
    const modal = document.querySelector('.experience-modal');
    if (modal) {
        modal.remove();
    }
}

function proceedToBooking(experience) {
    closeExperienceModal();
    // Redirect to booking page or open booking form
    alert(`Booking ${experience} - This will open booking form`);
}

// Add data-category attributes to existing package cards
function initializePackageCategories() {
    const packages = [
        { selector: '.package-card:nth-child(1)', categories: ['spiritual', 'budget'] },
        { selector: '.package-card:nth-child(2)', categories: ['spiritual', 'cultural', 'premium'] },
        { selector: '.package-card:nth-child(3)', categories: ['cultural', 'budget'] },
        { selector: '.package-card:nth-child(4)', categories: ['spiritual', 'family'] }
    ];

    packages.forEach(pkg => {
        const card = document.querySelector(pkg.selector);
        if (card) {
            card.setAttribute('data-category', pkg.categories.join(' '));
        }
    });
}

// Initialize when page loads
initializePackageCategories();
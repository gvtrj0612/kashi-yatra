// Image Slider Functionality
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.currentSlide = 0;
        this.slideInterval = null;
        
        this.init();
    }
    
    init() {
        console.log('Slider initialized with', this.slides.length, 'slides');
        
        // Start auto-sliding
        this.startSlider();
        
        // Add click events to dots
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
                this.resetInterval();
            });
        });
        
        // Pause on hover
        const slider = document.querySelector('.hero-background');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.stopSlider());
            slider.addEventListener('mouseleave', () => this.startSlider());
        }
    }
    
    goToSlide(n) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Set new slide
        this.currentSlide = n;
        
        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(next);
    }
    
    startSlider() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // Change slide every 4 seconds
    }
    
    stopSlider() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
    
    resetInterval() {
        this.stopSlider();
        this.startSlider();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing slider...');
    new HeroSlider();
});

// Customize Trip Modal Functions
function openCustomizeForm() {
    document.getElementById('customizeModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeCustomizeForm() {
    document.getElementById('customizeModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

function closeSuccessMessage() {
    document.getElementById('successMessage').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('customizeForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would normally send the data to your server
            // For now, we'll just show success message
            
            // Close the form
            closeCustomizeForm();
            
            // Show success message
            document.getElementById('successMessage').style.display = 'block';
            
            // Reset form
            form.reset();
            
            console.log('Custom trip request submitted!');
            // In real implementation, you would send this data to your backend
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('customizeModal');
        if (e.target === modal) {
            closeCustomizeForm();
        }
        
        const successMsg = document.getElementById('successMessage');
        if (e.target === successMsg) {
            closeSuccessMessage();
        }
    });
    
    // Your existing slider code
    new HeroSlider();
});
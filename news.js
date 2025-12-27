// News Page JavaScript

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const newsCards = document.querySelectorAll('.news-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.dataset.category;
        
        // Filter news cards
        newsCards.forEach(card => {
            if (category === 'all') {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                if (card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// Smooth scroll for topic tags
document.querySelectorAll('.topic-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        const topic = tag.textContent.trim().replace('#', '').trim().toLowerCase();
        
        // Filter news by topic
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        newsCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(topic)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Click on news card to expand/show more (optional feature)
newsCards.forEach(card => {
    card.addEventListener('click', () => {
        // You can add modal or navigation to full article here
        console.log('News card clicked:', card.querySelector('h3').textContent);
        
        // Example: Add a pulse animation on click
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'pulse 0.5s ease';
        }, 10);
    });
});

// Add loading animation when page loads
window.addEventListener('load', () => {
    document.querySelector('.news-header').style.animation = 'fadeInDown 0.6s ease';
    document.querySelector('.news-filter').style.animation = 'fadeIn 0.8s ease';
    document.querySelector('.news-grid').style.animation = 'fadeInUp 1s ease';
});

// Lazy loading for images (performance optimization)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.news-image img').forEach(img => {
        imageObserver.observe(img);
    });
}

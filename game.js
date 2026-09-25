// Navigation System (Tab Switching)
function showTab(tabId, element) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // Show the selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Update active state in bottom navbar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    if(element) {
        element.classList.add('active');
    } else {
        // If triggered from top buttons (like Airdrop)
        const targetNav = document.getElementById(nav-${tabId});
        if(targetNav) targetNav.classList.add('active');
    }
}

// Tap Tap and Score System
let score = parseInt(localStorage.getItem('chubby_score')) || 0;
document.getElementById('score').innerText = score;

const tapZone = document.getElementById('tap-zone');
tapZone.addEventListener('click', (e) => {
    score += 1; // Increase coin per tap
    document.getElementById('score').innerText = score;
    localStorage.setItem('chubby_score', score); // Save balance locally
    
    // Trigger floating text effect (+1)
    createTapEffect(e);
});

// Floating +1 Text Effect
function createTapEffect(e) {
    const text = document.createElement('div');
    text.innerText = '+1';
    text.style.position = 'absolute';
    text.style.left = ${e.clientX - 10}px;
    text.style.top = ${e.clientY - 20}px;
    text.style.color = '#0066ff';
    text.style.fontWeight = 'bold';
    text.style.fontSize = '26px';
    text.style.pointerEvents = 'none';
    text.style.zIndex = '9999';
    text.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
    document.body.appendChild(text);
    
    setTimeout(() => {
        text.style.transform = 'translateY(-60px) scale(1.2)';
        text.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        text.remove();
    }, 400);
}

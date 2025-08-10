class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.trail = document.querySelector('.cursor-trail');
        this.isActive = false;
        this.trails = [];
        this.maxTrails = 10;
        
        this.init();
    }
    
    init() {
        // Check if device supports hover (not touch device)
        if (window.matchMedia('(hover: hover)').matches) {
            this.bindEvents();
            this.createTrails();
            this.animate();
        } else {
            // Hide cursor on touch devices
            this.cursor.style.display = 'none';
            this.trail.style.display = 'none';
        }
    }
    
    createTrails() {
        for (let i = 0; i < this.maxTrails; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.opacity = (this.maxTrails - i) / this.maxTrails * 0.2;
            trail.style.transform = 'scale(' + (1 - i * 0.1) + ')';
            document.body.appendChild(trail);
            this.trails.push({
                element: trail,
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0
            });
        }
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.updateCursor(e.clientX, e.clientY);
        });
        
        document.addEventListener('mouseenter', () => {
            this.isActive = true;
            this.cursor.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.isActive = false;
            this.cursor.style.opacity = '0';
        });
        
        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .game-card, .nav-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2)';
                this.cursor.style.backgroundColor = '#9d00ff';
                this.cursor.style.boxShadow = '0 0 30px #9d00ff';
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.backgroundColor = '#00ffff';
                this.cursor.style.boxShadow = '0 0 20px #00ffff';
            });
        });
        
        // Click effect
        document.addEventListener('mousedown', () => {
            this.cursor.style.transform = 'scale(0.8)';
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.style.transform = 'scale(1)';
        });
    }
    
    updateCursor(x, y) {
        if (!this.isActive) return;
        
        this.cursor.style.left = x + 'px';
        this.cursor.style.top = y + 'px';
        
        // Update trails
        this.trails.forEach((trail, index) => {
            if (index === 0) {
                trail.targetX = x;
                trail.targetY = y;
            } else {
                trail.targetX = this.trails[index - 1].x;
                trail.targetY = this.trails[index - 1].y;
            }
        });
    }
    
    animate() {
        this.trails.forEach(trail => {
            // Smooth trail movement
            trail.x += (trail.targetX - trail.x) * 0.1;
            trail.y += (trail.targetY - trail.y) * 0.1;
            
            trail.element.style.left = trail.x + 'px';
            trail.element.style.top = trail.y + 'px';
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
});

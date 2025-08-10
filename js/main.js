class AlphaGames {
    constructor() {
        this.livePlayersCount = 125432;
        this.leaderboardData = [];
        this.scrollOffset = 0;
        
        this.init();
    }
    
    init() {
        this.setupScrollEffects();
        this.setupTextAnimations();
        this.setupImageAnimations();
        this.setupLiveCounter();
        this.setupLeaderboard();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
    }
    
    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            this.scrollOffset = window.pageYOffset;
            this.updateParallax();
            this.updateNavbar();
        });
    }
    
    updateParallax() {
        const parallaxElements = document.querySelectorAll('.floating-image');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 1;
            const yPos = -(this.scrollOffset * speed * 0.1);
            element.style.transform = `translateY(${yPos}px) rotate(${Math.sin(this.scrollOffset * 0.01) * 5}deg)`;
        });
    }
    
    updateNavbar() {
        const navbar = document.querySelector('.custom-navbar');
        if (this.scrollOffset > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }
    
    setupTextAnimations() {
        // Scatter text effect
        const scatterTexts = document.querySelectorAll('.scatter-text');
        
        scatterTexts.forEach(text => {
            text.addEventListener('mouseenter', () => this.scatterText(text));
            text.addEventListener('mouseleave', () => this.reassembleText(text));
        });
    }
    
    scatterText(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = 'char';
            span.style.display = 'inline-block';
            span.style.position = 'relative';
            span.style.transition = 'all 0.8s ease';
            
            // Set random scatter positions
            const randomX = (Math.random() - 0.5) * 200;
            const randomY = (Math.random() - 0.5) * 200;
            const randomRotation = (Math.random() - 0.5) * 360;
            
            span.style.setProperty('--random-x', randomX + 'px');
            span.style.setProperty('--random-y', randomY + 'px');
            span.style.setProperty('--random-rotation', randomRotation + 'deg');
            
            element.appendChild(span);
            
            setTimeout(() => {
                span.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
                span.style.opacity = '0.3';
            }, index * 50);
        });
        
        element.classList.add('scattered');
    }
    
    reassembleText(element) {
        const chars = element.querySelectorAll('.char');
        
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.style.transform = 'translate(0, 0) rotate(0deg)';
                char.style.opacity = '1';
            }, index * 30);
        });
        
        element.classList.remove('scattered');
        element.classList.add('reassemble');
        
        setTimeout(() => {
            element.classList.remove('reassemble');
        }, chars.length * 30 + 500);
    }
    
    setupImageAnimations() {
        const floatingImages = document.querySelectorAll('.floating-image');
        
        floatingImages.forEach(image => {
            image.addEventListener('mouseenter', (e) => {
                this.scatterImage(e.currentTarget);
            });
            
            image.addEventListener('mouseleave', (e) => {
                this.returnImage(e.currentTarget);
            });
        });
        
        // Mouse move parallax for images
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;
            
            floatingImages.forEach((image, index) => {
                const speed = (index + 1) * 10;
                const x = mouseX * speed;
                const y = mouseY * speed;
                
                image.style.transform += ` translate(${x}px, ${y}px)`;
            });
        });
    }
    
    scatterImage(image) {
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        const randomRotation = (Math.random() - 0.5) * 30;
        
        image.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg) scale(1.1)`;
        image.style.transition = 'all 0.3s ease';
    }
    
    returnImage(image) {
        image.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
        image.style.transition = 'all 0.5s ease';
    }
    
    setupLiveCounter() {
        const counter = document.getElementById('live-players');
        let currentCount = 0;
        const targetCount = this.livePlayersCount;
        const increment = targetCount / 100;
        
        const countAnimation = () => {
            if (currentCount < targetCount) {
                currentCount += increment + Math.random() * 50;
                counter.textContent = Math.floor(currentCount).toLocaleString();
                requestAnimationFrame(countAnimation);
            } else {
                counter.textContent = targetCount.toLocaleString();
                this.startLiveCounterUpdates();
            }
        };
        
        // Start counting animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countAnimation();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    }
    
    startLiveCounterUpdates() {
        const counter = document.getElementById('live-players');
        
        setInterval(() => {
            const change = Math.floor(Math.random() * 200) - 100; // -100 to +100
            this.livePlayersCount = Math.max(100000, this.livePlayersCount + change);
            counter.textContent = this.livePlayersCount.toLocaleString();
            
            // Add flash effect
            counter.style.color = '#ffdd00';
            counter.style.textShadow = '0 0 20px #ffdd00';
            
            setTimeout(() => {
                counter.style.color = '';
                counter.style.textShadow = '';
            }, 200);
        }, 3000);
    }
    
    setupLeaderboard() {
        this.generateLeaderboardData();
        this.renderLeaderboard();
        this.startLeaderboardAnimation();
    }
    
    generateLeaderboardData() {
        const names = [
            'CyberNinja', 'NeonGamer', 'AlphaWolf', 'PixelMaster', 'CodeReaper',
            'GlitchKing', 'VoidWalker', 'NightRider', 'StormBreaker', 'ShadowHunter',
            'TechSavage', 'DigitalGhost', 'ElectroShock', 'LaserBeam', 'HoloByte',
            'DataStream', 'CyberPunk', 'MatrixHero', 'QuantumLeap', 'BinaryBeast',
            'CodeMancer', 'PixelPhantom', 'TechTitan', 'DigitalDemon', 'CyberStorm'
        ];
        
        for (let i = 0; i < 25; i++) {
            this.leaderboardData.push({
                rank: i + 1,
                player: names[i],
                score: Math.floor(Math.random() * 1000000) + 500000,
                level: Math.floor(Math.random() * 100) + 50
            });
        }
        
        // Sort by score
        this.leaderboardData.sort((a, b) => b.score - a.score);
        
        // Update ranks
        this.leaderboardData.forEach((player, index) => {
            player.rank = index + 1;
        });
    }
    
    renderLeaderboard() {
        const container = document.getElementById('leaderboard-scroll');
        container.innerHTML = '';
        
        this.leaderboardData.forEach(player => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            item.innerHTML = `
                <div class="leaderboard-rank">#${player.rank}</div>
                <div class="leaderboard-player">${player.player}</div>
                <div class="leaderboard-score">${player.score.toLocaleString()}</div>
                <div class="leaderboard-level">${player.level}</div>
            `;
            
            container.appendChild(item);
        });
    }
    
    startLeaderboardAnimation() {
        const container = document.getElementById('leaderboard-scroll');
        let scrollTop = 0;
        
        setInterval(() => {
            scrollTop += 1;
            if (scrollTop >= container.scrollHeight - container.clientHeight) {
                scrollTop = 0;
            }
            container.scrollTop = scrollTop;
        }, 50);
        
        // Update scores periodically
        setInterval(() => {
            this.leaderboardData.forEach(player => {
                player.score += Math.floor(Math.random() * 1000);
            });
            
            this.leaderboardData.sort((a, b) => b.score - a.score);
            this.leaderboardData.forEach((player, index) => {
                player.rank = index + 1;
            });
            
            this.renderLeaderboard();
        }, 10000);
    }
    
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add entrance animations
                    entry.target.classList.add('fade-in-up');
                    
                    // Add stagger delay for cards
                    if (entry.target.classList.contains('game-card')) {
                        const cards = document.querySelectorAll('.game-card');
                        const index = Array.from(cards).indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);
        
        // Observe game cards
        document.querySelectorAll('.game-card').forEach(card => {
            observer.observe(card);
        });
        
        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
}

// Initialize the main application
document.addEventListener('DOMContentLoaded', () => {
    new AlphaGames();
    
    // Add loading screen removal
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    }
});

// Performance optimization
window.addEventListener('load', () => {
    // Preload images
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        const imageLoader = new Image();
        imageLoader.src = img.src;
    });
    
    // Add performance monitoring
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate particle system if needed
    const event = new Event('resize');
    window.dispatchEvent(event);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or overlays
        const activeOverlays = document.querySelectorAll('.active');
        activeOverlays.forEach(overlay => {
            overlay.classList.remove('active');
        });
    }
    
    if (e.key === 'Tab') {
        // Ensure proper focus visibility
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

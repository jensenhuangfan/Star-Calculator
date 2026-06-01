/* =============================================================================
   Stardust Web Calculator - Core Interactive Engine & Physics
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // Canvas Backdrop & Particle Physics Configuration
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('space-canvas');
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Resizing window handler
    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
        generateStars();
    });

    // Tracking Mouse coordinates for Gravity Repulsion Physics
    let mouse = { x: -1000, y: -1000, active: false };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Collections
    let stars = [];
    let shootingStars = [];
    let clickParticles = [];

    // Helper functions
    const randomRange = (min, max) => Math.random() * (max - min) + min;

    // Populates stellar canvas with dynamic stardust
    const generateStars = () => {
        stars = [];
        const starCount = Math.floor((width * height) / 3800); // Scaled by resolution
        for (let i = 0; i < Math.min(starCount, 350); i++) {
            const isDust = Math.random() < 0.45;
            let star = {
                x: randomRange(0, width),
                y: randomRange(0, height),
                baseSize: isDust ? randomRange(0.2, 0.9) : randomRange(1.0, 2.6),
                speedY: isDust ? randomRange(0.4, 1.4) : randomRange(0.05, 0.35),
                speedX: isDust ? randomRange(-0.3, 0.3) : randomRange(-0.08, 0.08),
                twinkleSpeed: isDust ? randomRange(0.08, 0.25) : randomRange(0.02, 0.08),
                angle: randomRange(0, Math.PI * 2),
                color: isDust 
                    ? ['#B2EBF2', '#80DEEA', '#E0F7FA', '#FFFFFF'][Math.floor(Math.random() * 4)]
                    : ['#FFFFFF', '#FFF9C4', '#E1BEE7', '#F8BBD0'][Math.floor(Math.random() * 4)]
            };
            stars.push(star);
        }
    };

    // Spawn a high-speed shooting star
    const triggerShootingStar = () => {
        if (Math.random() < 0.012) {
            shootingStars.push({
                x: randomRange(50, width - 50),
                y: -30,
                speedX: randomRange(-4, 4),
                speedY: randomRange(9, 16),
                size: randomRange(1.8, 3.2),
                life: randomRange(25, 45),
                maxLife: 45
            });
        }
    };

    // Spawns highly responsive sparkling particles at any coordinates
    const spawnClickParticles = (x, y, btnColor) => {
        const count = randomRange(10, 16);
        for (let i = 0; i < count; i++) {
            const angle = randomRange(0, Math.PI * 2);
            const speed = randomRange(1.5, 4.8);
            clickParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - randomRange(0.5, 1.8), // Slight upward drift
                size: randomRange(1.5, 3.5),
                color: btnColor || '#B388FF',
                alpha: 1.0,
                decay: randomRange(0.015, 0.035),
                gravity: 0.06
            });
        }
    };

    // Rendering loops
    const drawBackdrop = () => {
        // High fidelity Space Gradient (deep blue to dark violet-black)
        let gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#04030a');
        gradient.addColorStop(0.5, '#070518');
        gradient.addColorStop(1, '#110926');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    };

    const updatePhysics = () => {
        // 1. Render & move regular stardust
        stars.forEach((star) => {
            star.y += star.speedY;
            star.x += star.speedX;
            star.angle += star.twinkleSpeed;

            // Twinkle math
            let size = star.baseSize + Math.sin(star.angle) * 0.75;
            if (size < 0.1) size = 0.1;

            // Gravitational Mouse Repulsion Physics
            if (mouse.active) {
                const dx = star.x - mouse.x;
                const dy = star.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                const repelDistance = 80;

                if (dist < repelDistance) {
                    const force = (repelDistance - dist) / repelDistance;
                    star.x += (dx / dist) * force * 3.8;
                    star.y += (dy / dist) * force * 3.8;
                }
            }

            // Screen Wrap bounds check
            if (star.y > height + 10) {
                star.y = -10;
                star.x = randomRange(0, width);
            } else if (star.y < -10) {
                star.y = height + 10;
                star.x = randomRange(0, width);
            }

            if (star.x > width + 10) {
                star.x = -10;
            } else if (star.x < -10) {
                star.x = width + 10;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.shadowBlur = size > 1.8 ? 6 : 0;
            ctx.shadowColor = star.color;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow
        });

        // 2. Render & move shooting stars
        triggerShootingStar();
        shootingStars.forEach((ss, idx) => {
            ss.x += ss.speedX;
            ss.y += ss.speedY;
            ss.life--;

            if (ss.life <= 0 || ss.y > height + 50) {
                shootingStars.splice(idx, 1);
                return;
            }

            ctx.beginPath();
            let tailGradient = ctx.createLinearGradient(
                ss.x, ss.y, 
                ss.x - ss.speedX * 3.5, ss.y - ss.speedY * 3.5
            );
            tailGradient.addColorStop(0, '#ffffff');
            tailGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.strokeStyle = tailGradient;
            ctx.lineWidth = ss.size;
            ctx.lineCap = 'round';
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(ss.x - ss.speedX * 3.5, ss.y - ss.speedY * 3.5);
            ctx.stroke();
        });

        // 3. Render & move click feedback sparkles
        clickParticles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                clickParticles.splice(idx, 1);
                return;
            }

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.restore();
        });
    };

    const animateLoop = () => {
        drawBackdrop();
        updatePhysics();
        requestAnimationFrame(animateLoop);
    };

    // Initialize Canvas Objects
    generateStars();
    animateLoop();

    // -------------------------------------------------------------------------
    // Calculator Mechanics & Interaction
    // -------------------------------------------------------------------------
    const exprDiv = document.getElementById('display-expr');
    const resultDiv = document.getElementById('display-result');

    let expression = '';
    let hasEvaluated = false;

    // Responsive result font size auto-adjustment
    const adjustDisplayFont = (text) => {
        if (text.length > 14) {
            resultDiv.style.fontSize = '1.65rem';
        } else if (text.length > 9) {
            resultDiv.style.fontSize = '2.25rem';
        } else {
            resultDiv.style.fontSize = '2.85rem';
        }
    };

    const updateDisplay = (exprText, resultText) => {
        exprDiv.textContent = exprText;
        resultDiv.textContent = resultText || '0';
        adjustDisplayFont(resultText || '0');
    };

    const handleInput = (val) => {
        if (val === 'C') {
            expression = '';
            hasEvaluated = false;
            updateDisplay('', '0');
        } else if (val === '⌫') {
            if (hasEvaluated) {
                expression = '';
                hasEvaluated = false;
            } else {
                expression = expression.slice(0, -1);
            }
            updateDisplay('', expression);
        } else if (val === '=') {
            if (!expression) return;
            try {
                // Formatting mod calculations cleanly
                let safeExpr = expression.replace(/%/g, '/100');
                let result = eval(safeExpr);
                
                // Truncating recurring floating decimal points
                if (result !== undefined) {
                    let resultStr = String(result);
                    if (resultStr.includes('.')) {
                        result = parseFloat(result.toFixed(8));
                    }
                    updateDisplay(expression + ' =', String(result));
                    expression = String(result);
                    hasEvaluated = true;
                }
            } catch (err) {
                updateDisplay(expression, 'Error');
                expression = '';
                hasEvaluated = false;
            }
        } else {
            if (hasEvaluated) {
                // If user clicks a number after evaluating, reset screen
                if (!isNaN(val) || val === '.') {
                    expression = '';
                }
                hasEvaluated = false;
            }

            // Prevent multiple math operators in sequence
            const lastChar = expression.slice(-1);
            const operators = ['+', '-', '*', '/', '%', '.'];
            if (operators.includes(val) && operators.includes(lastChar)) {
                expression = expression.slice(0, -1) + val;
            } else {
                expression += val;
            }

            updateDisplay('', expression);
        }
    };

    // 1. Mouse Click handlers
    document.querySelectorAll('.btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const val = btn.textContent;
            handleInput(val);

            // Fetch style variables to match particle color with button class
            let particleColor = '#B388FF'; // Default purple sparkle
            if (btn.classList.contains('btn-operator')) particleColor = '#00E5FF'; // Cyan
            if (btn.classList.contains('btn-danger')) particleColor = '#FF5252'; // Red
            if (btn.classList.contains('btn-warning')) particleColor = '#FF8A65'; // Orange
            if (btn.classList.contains('btn-equals')) particleColor = '#FFD740'; // Yellow

            // Get exact mouse trigger point inside the viewport to center particle bursts
            const rect = btn.getBoundingClientRect();
            const clickX = e.clientX || rect.left + rect.width / 2;
            const clickY = e.clientY || rect.top + rect.height / 2;

            spawnClickParticles(clickX, clickY, particleColor);
        });
    });

    // 2. Physical Keyboard Listener
    document.addEventListener('keydown', (e) => {
        let key = e.key;

        // Key mapping definitions
        if (key === 'Enter') key = '=';
        if (key === 'Escape') key = 'C';
        if (key === 'Backspace') key = '⌫';
        
        const validKeys = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            '+', '-', '*', '/', '%', '.', '=', 'C', '⌫'
        ];

        if (validKeys.includes(key)) {
            e.preventDefault();
            handleInput(key);

            // Locate corresponding button element to trigger physical click animations
            let btnId = '';
            if (key === '=') btnId = 'btn-equals';
            else if (key === 'C') btnId = 'btn-clear';
            else if (key === '⌫') btnId = 'btn-backspace';
            else if (key === '+') btnId = 'btn-add';
            else if (key === '-') btnId = 'btn-subtract';
            else if (key === '*') btnId = 'btn-multiply';
            else if (key === '/') btnId = 'btn-divide';
            else if (key === '%') btnId = 'btn-mod';
            else if (key === '.') btnId = 'btn-decimal';
            else btnId = `btn-${key}`;

            const targetBtn = document.getElementById(btnId);
            if (targetBtn) {
                targetBtn.click();
                // Custom tactile scaling simulation
                targetBtn.style.transform = 'scale(0.92)';
                setTimeout(() => {
                    targetBtn.style.transform = '';
                }, 100);
            }
        }
    });
});

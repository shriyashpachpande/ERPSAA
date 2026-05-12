import React, { useEffect, useRef } from 'react';

const SidebarConstellationBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let stars = [];
        const starCount = 200; // Slightly more stars
        const connectionDistance = 100; // Slightly longer connections for more "constellation" feel

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                initStars();
            }
        };

        const initStars = () => {
            stars = [];
            for (let i = 0; i < starCount; i++) {
                const isAnchor = Math.random() > 0.85;
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: isAnchor ? (Math.random() * 2.2 + 1.5) : (Math.random() * 1.2 + 0.4),
                    isAnchor,
                    originalOpacity: isAnchor ? (Math.random() * 0.6 + 0.4) : (Math.random() * 0.4 + 0.1),
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.025 + Math.random() * 0.035, // Increased by ~10% more
                    vx: (Math.random() - 0.5) * 0.4, // Increased by ~10% more
                    vy: (Math.random() - 0.5) * 0.4, // Increased by ~10% more
                });
            }
        };

        const drawStar = (x, y, size, opacity, isAnchor) => {
            ctx.save();
            ctx.translate(x, y);
            
            // Draw a subtle cross/sparkle for the star look
            ctx.beginPath();
            const glowSize = isAnchor ? size * 2 : size * 1.5;
            
            // Vertical line
            ctx.moveTo(0, -glowSize);
            ctx.lineTo(0, glowSize);
            // Horizontal line
            ctx.moveTo(-glowSize, 0);
            ctx.lineTo(glowSize, 0);
            
            ctx.strokeStyle = isAnchor ? `rgba(186, 230, 253, ${opacity * 0.8})` : `rgba(148, 163, 184, ${opacity * 0.9})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Center glow
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = isAnchor ? `rgba(224, 242, 254, ${opacity})` : `rgba(148, 163, 184, ${opacity})`;
            if (isAnchor) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
            }
            ctx.fill();
            
            ctx.restore();
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Rich deep navy gradient
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, '#0a101f');
            grad.addColorStop(0.5, '#0f172a'); 
            grad.addColorStop(1, '#1e293b'); 
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw stars
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.x += s.vx;
                s.y += s.vy;
                s.pulse += s.pulseSpeed;

                if (s.x < 0) s.x = canvas.width;
                if (s.x > canvas.width) s.x = 0;
                if (s.y < 0) s.y = canvas.height;
                if (s.y > canvas.height) s.y = 0;

                const opacity = s.originalOpacity * (0.5 + Math.sin(s.pulse) * 0.5);
                
                drawStar(s.x, s.y, s.size, opacity, s.isAnchor);

                // Connections
                for (let j = i + 1; j < stars.length; j++) {
                    const s2 = stars[j];
                    const dx = s.x - s2.x;
                    const dy = s.y - s2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        // More visible lines as requested
                        const lineBaseOpacity = (s.isAnchor || s2.isAnchor) ? 0.25 : 0.15;
                        const lineOpacity = (1 - (dist / connectionDistance)) * lineBaseOpacity;
                        
                        ctx.beginPath();
                        ctx.moveTo(s.x, s.y);
                        ctx.lineTo(s2.x, s2.y);
                        ctx.strokeStyle = `rgba(148, 163, 184, ${lineOpacity})`;
                        ctx.lineWidth = (s.isAnchor && s2.isAnchor) ? 0.8 : 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const observer = new ResizeObserver(() => resize());
        if (canvas.parentElement) observer.observe(canvas.parentElement);
        
        resize();
        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default SidebarConstellationBackground;

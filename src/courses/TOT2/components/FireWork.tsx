// src/components/ConfettiAnimation.js
import React, { useEffect, useRef } from "react";

const ConfettiAnimation = ({ duration = 10000, onComplete }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create confetti pieces that match the image
    const confettiPieces = [];
    
    // Colors from the image: colorful confetti on sky blue background
    const colors = [
      "#FF5252", // red
      "#FFEB3B", // yellow
      "#4CAF50", // green
      "#FF9800", // orange
      "#E91E63", // pink
      "#2196F3"  // blue
    ];
    
    // Function to create new batch of confetti
    const createConfettiBatch = () => {
      // Create rectangles like in the image - now bigger
      for (let i = 0; i < 30; i++) { // Creating fewer per batch but will add more batches
        confettiPieces.push({
          x: Math.random() * width,
          y: Math.random() * height - height, // Start above the screen
          width: Math.random() * 15 + 10, // Larger confetti
          height: Math.random() * 10 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 3 + 2, // Faster fall speed
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 2 - 1,
          type: 'rectangle'
        });
      }
      
      // Create curly ribbons like in the image - now bigger
      for (let i = 0; i < 8; i++) {
        confettiPieces.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          size: Math.random() * 60 + 40,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 2 + 1.5, // Faster fall speed
          type: 'ribbon',
          amplitude: Math.random() * 15 + 15,
          frequency: Math.random() * 0.1 + 0.05,
          phase: Math.random() * Math.PI * 2,
          lineWidth: Math.random() * 2 + 3
        });
      }
    };
    
    // Initial batch of confetti
    createConfettiBatch();
    
    // Add more confetti periodically for continuous effect
    const refreshIntervals = [];
    
    // Add new confetti every 2 seconds to maintain density
    const refreshInterval = setInterval(() => {
      createConfettiBatch();
      
      // Limit total number of pieces to prevent performance issues
      if (confettiPieces.length > 200) {
        // Remove older pieces
        confettiPieces.splice(0, 20);
      }
    }, 2000);
    
    refreshIntervals.push(refreshInterval);
    
    // Animation loop
    let animationFrameId;
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      confettiPieces.forEach(piece => {
        ctx.save();
        
        if (piece.type === 'rectangle') {
          ctx.translate(piece.x, piece.y);
          ctx.rotate((piece.rotation * Math.PI) / 180);
          ctx.fillStyle = piece.color;
          ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
          
          // Update position
          piece.x += piece.speedX;
          piece.y += piece.speedY;
          piece.rotation += piece.rotationSpeed;
          
          // Reset if off-screen (don't reset for longer duration, just let it go)
          if (piece.y > height + 20) {
            // Instead of resetting, we'll just let it go off-screen
            // New pieces will be added with the interval
          }
        } 
        else if (piece.type === 'ribbon') {
          ctx.strokeStyle = piece.color;
          ctx.lineWidth = piece.lineWidth;
          ctx.beginPath();
          
          // Draw curly ribbon
          for (let i = 0; i < piece.size; i++) {
            const x = piece.x + i * 2;
            const y = piece.y + Math.sin(i * piece.frequency + piece.phase) * piece.amplitude;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          
          ctx.stroke();
          
          // Update position
          piece.y += piece.speedY;
          piece.x += piece.speedX;
          piece.phase += 0.05;
          
          // Don't reset position for longer duration
        }
        
        ctx.restore();
      });
      
      // Remove confetti that's gone far off-screen
      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        if (confettiPieces[i].y > height * 1.5) {
          confettiPieces.splice(i, 1);
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup after duration
    const timer = setTimeout(() => {
      // Stop adding new confetti
      refreshIntervals.forEach(interval => clearInterval(interval));
      
      // Let existing confetti finish falling for a natural fadeout
      setTimeout(() => {
        cancelAnimationFrame(animationFrameId);
        if (onComplete) onComplete();
      }, 2000);
      
    }, duration);
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
      refreshIntervals.forEach(interval => clearInterval(interval));
      window.removeEventListener('resize', handleResize);
    };
  }, [duration, onComplete]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 999
      }}
    />
  );
};

export default ConfettiAnimation;
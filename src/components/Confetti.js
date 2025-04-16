import React, { useEffect, useRef } from 'react';
import '../styles/Confetti.css';

const Confetti = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = [
      '#8BC34A', // Green
      '#4CAF50', // Darker Green
      '#CDDC39', // Lime
      '#FFEB3B', // Yellow
      '#FFC107', // Amber
      '#C0CA33', // Lime Green
      '#7CB342', // Light Green
      '#F9FBE7', // Light Yellow
    ];
    
    class ConfettiPiece {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.size = Math.random() * 10 + 5;
        this.weight = Math.random() * 1 + 1;
        this.directionX = Math.random() * 2 - 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.shape = Math.random() > 0.5 ? 'circle' : 'rectangle';
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
      }
      
      update() {
        this.y += this.weight;
        this.x += this.directionX;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height) {
          this.y = Math.random() * -canvas.height;
          this.x = Math.random() * canvas.width;
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        
        if (this.shape === 'circle') {
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation * Math.PI / 180);
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          ctx.restore();
        }
      }
    }
    
    function init() {
      for (let i = 0; i < 100; i++) {
        confettiPieces.push(new ConfettiPiece());
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < confettiPieces.length; i++) {
        confettiPieces[i].update();
        confettiPieces[i].draw();
      }
      
      requestAnimationFrame(animate);
    }
    
    init();
    animate();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animate);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="confetti-canvas"></canvas>;
};

export default Confetti;
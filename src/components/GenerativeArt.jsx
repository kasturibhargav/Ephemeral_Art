import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const GenerativeArt = ({ weatherData }) => {
  const sketchRef = useRef(null);
  const p5InstanceRef = useRef(null);

  useEffect(() => {
    // Clear any previous sketch if it exists
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    const sketch = (p) => {
      let particles = [];
      const numParticles = 300;
      
      p.setup = () => {
        // Create canvas that matches the container size
        const container = sketchRef.current;
        p.createCanvas(container.offsetWidth, container.offsetHeight);
        p.angleMode(p.DEGREES);
        
        // Initialize particles
        for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle());
        }
        
        // Dark background with some transparency for trails
        p.background(10, 10, 15);
      };

      p.draw = () => {
        // Create trail effect
        p.fill(10, 10, 15, 20); // semi-transparent background
        p.rect(0, 0, p.width, p.height);

        const { temperature, windSpeed, windDirection, humidity } = weatherData;

        // Map data to visual parameters
        // Temperature (-10 to 40) maps to Hue (cool to warm)
        const hueValue = p.map(temperature, -10, 40, 240, 0); 
        
        // Wind speed (0 to 50) maps to particle velocity multiplier
        const speedMult = p.map(windSpeed, 0, 50, 0.5, 5);
        
        // Humidity (0 to 100) maps to particle size or opacity
        const pSize = p.map(humidity, 0, 100, 1, 8);

        p.colorMode(p.HSB, 360, 100, 100, 100);

        particles.forEach(particle => {
          particle.update(speedMult, windDirection);
          particle.display(hueValue, pSize);
          particle.checkEdges();
        });
        
        p.colorMode(p.RGB, 255); // Reset to RGB for background clearing
      };

      p.windowResized = () => {
        if (sketchRef.current) {
          p.resizeCanvas(sketchRef.current.offsetWidth, sketchRef.current.offsetHeight);
          p.background(10, 10, 15);
        }
      };

      class Particle {
        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
          this.maxSpeed = p.random(1, 3);
          this.noiseOffset = p.random(1000);
        }

        update(speedMult, baseDirection) {
          // Calculate angle based on wind direction + some perlin noise for organic flow
          let noiseVal = p.noise(this.pos.x * 0.01, this.pos.y * 0.01, this.noiseOffset);
          let angleOffset = p.map(noiseVal, 0, 1, -45, 45);
          
          let force = p5.Vector.fromAngle(p.radians(baseDirection + angleOffset));
          force.mult(0.1); // Acceleration rate
          
          this.acc.add(force);
          this.vel.add(this.acc);
          
          // Limit speed and apply wind multiplier
          this.vel.limit(this.maxSpeed * speedMult);
          this.pos.add(this.vel);
          this.acc.mult(0); // Reset acceleration
          this.noiseOffset += 0.01;
        }

        display(baseHue, size) {
          // Add some variation to hue based on position
          let h = (baseHue + p.map(this.pos.x, 0, p.width, -20, 20) + 360) % 360;
          
          p.noStroke();
          p.fill(h, 80, 90, 70); // Saturation 80, Brightness 90, Alpha 70
          p.circle(this.pos.x, this.pos.y, size);
        }

        checkEdges() {
          if (this.pos.x > p.width) this.pos.x = 0;
          if (this.pos.x < 0) this.pos.x = p.width;
          if (this.pos.y > p.height) this.pos.y = 0;
          if (this.pos.y < 0) this.pos.y = p.height;
        }
      }
    };

    if (sketchRef.current) {
      p5InstanceRef.current = new p5(sketch, sketchRef.current);
    }

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, [weatherData]);

  return <div ref={sketchRef} style={{ width: '100%', height: '100%' }} />;
};

export default GenerativeArt;

// mapEffects.js - Utilities for enhancing map visuals and animations

/**
 * Generates a time-based map style configuration
 * @param {string} timeOfDay - 'day', 'evening', or 'night'
 * @returns {Object} Map style configuration
 */
export const getTimeBasedMapStyle = (timeOfDay) => {
  const baseStyle = {
    version: 8,
    name: 'Mapemon Custom Style',
    sources: {},
    layers: [],
  };

  // Base configurations for different times of day
  const timeStyles = {
    day: {
      water: '#a0ceff',
      land: '#e8f1e8',
      buildings: '#d4d5d8',
      roads: '#ffffff',
      text: '#4d4d4d',
      ambientLight: 0.4,
      directionalLight: 0.7,
    },
    evening: {
      water: '#7797c4',
      land: '#dfe3e0',
      buildings: '#c2c3c8',
      roads: '#f5f5f5',
      text: '#3a3a3a',
      ambientLight: 0.3,
      directionalLight: 0.6,
    },
    night: {
      water: '#234872',
      land: '#292e33',
      buildings: '#3b3b3b',
      roads: '#3c3c3c',
      text: '#bababa',
      ambientLight: 0.1,
      directionalLight: 0.3,
    }
  };

  // Use the appropriate time-based style or default to day
  const style = timeStyles[timeOfDay] || timeStyles.day;

  // Apply the style to the base configuration
  // Note: This is a simplified version - in real implementation
  // this would be applied to actual mapbox style layers
  return {
    ...baseStyle,
    style,
  };
};

/**
 * Creates a particle effect for the map
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Type of particle ('click', 'hover', 'pulse')
 * @param {HTMLElement} container - Container to append particles to
 * @returns {Object} Particle element and cleanup function
 */
export const createMapParticle = (x, y, type = 'click', container) => {
  if (!container) return { cleanup: () => {} };

  const particle = document.createElement('div');
  particle.className = `map-particle map-particle-${type}`;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  container.appendChild(particle);
  
  // Remove particle after animation completes
  const timeout = setTimeout(() => {
    if (container.contains(particle)) {
      container.removeChild(particle);
    }
  }, type === 'pulse' ? 2000 : 1000);
  
  return {
    element: particle,
    cleanup: () => {
      clearTimeout(timeout);
      if (container.contains(particle)) {
        container.removeChild(particle);
      }
    }
  };
};

/**
 * Creates multiple particles for a ripple effect
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {HTMLElement} container - Container to append particles to
 * @param {number} count - Number of particles to create
 * @returns {Array} Array of particle objects with cleanup functions
 */
export const createRippleEffect = (x, y, container, count = 8) => {
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    // Add slight randomness to position
    const offsetX = x + (Math.random() * 20 - 10);
    const offsetY = y + (Math.random() * 20 - 10);
    
    // Create particle with delay based on index
    setTimeout(() => {
      if (container) {
        const particle = createMapParticle(offsetX, offsetY, 'pulse', container);
        particles.push(particle);
      }
    }, i * 50);
  }
  
  return {
    particles,
    cleanup: () => {
      particles.forEach(p => p.cleanup && p.cleanup());
    }
  };
};

/**
 * Determines the current time of day
 * @returns {string} 'day', 'evening', or 'night'
 */
export const getCurrentTimeOfDay = () => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 17) {
    return 'day';
  } else if (hour >= 17 && hour < 20) {
    return 'evening';
  } else {
    return 'night';
  }
};

/**
 * Creates glow effect around markers
 * @param {HTMLElement} marker - The marker element
 * @param {string} color - Color of the glow
 * @param {number} intensity - Intensity of the glow (0-1)
 */
export const addMarkerGlow = (marker, color = '#4285F4', intensity = 0.7) => {
  if (!marker) return;
  
  // Calculate the intensity-adjusted values
  const shadowSize = Math.round(10 * intensity);
  const shadowOpacity = Math.min(0.8, intensity);
  
  // Apply the glow effect
  marker.style.boxShadow = `0 0 ${shadowSize}px ${Math.round(shadowSize/2)}px rgba(${hexToRgb(color)}, ${shadowOpacity})`;
  marker.style.transition = 'box-shadow 0.3s ease-in-out';
};

/**
 * Helper to convert hex color to RGB
 * @param {string} hex - Hex color code
 * @returns {string} RGB values as "r,g,b"
 */
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

/**
 * Creates a water ripple effect on the map
 * @param {MapInstance} map - The map instance
 * @param {Array} coordinates - [lng, lat] coordinates
 */
export const createWaterRipple = (map, coordinates) => {
  if (!map || !coordinates) return { cleanup: () => {} };
  
  // Convert coordinates to pixel coordinates
  const point = map.project(coordinates);
  
  // Create ripple container if it doesn't exist
  let rippleContainer = document.querySelector('.map-ripple-container');
  if (!rippleContainer) {
    rippleContainer = document.createElement('div');
    rippleContainer.className = 'map-ripple-container';
    document.querySelector('.mapboxgl-canvas-container').appendChild(rippleContainer);
  }
  
  // Create ripple effect
  const ripple = document.createElement('div');
  ripple.className = 'map-water-ripple';
  ripple.style.left = `${point.x}px`;
  ripple.style.top = `${point.y}px`;
  
  rippleContainer.appendChild(ripple);
  
  // Remove ripple after animation completes
  const timeout = setTimeout(() => {
    if (rippleContainer.contains(ripple)) {
      rippleContainer.removeChild(ripple);
    }
  }, 2000);
  
  return {
    element: ripple,
    cleanup: () => {
      clearTimeout(timeout);
      if (rippleContainer && rippleContainer.contains(ripple)) {
        rippleContainer.removeChild(ripple);
      }
    }
  };
};

/**
 * Creates an ambient particle system for the map background
 * @param {HTMLElement} container - Container to append particles to
 * @param {number} count - Number of particles to create
 * @param {string} timeOfDay - 'day', 'evening', or 'night'
 * @returns {Object} Control object with start and stop methods
 */
export const createAmbientParticles = (container, count = 20, timeOfDay = 'day') => {
  if (!container) return { start: () => {}, stop: () => {} };
  
  let particles = [];
  let animationFrame = null;
  let active = false;
  
  // Colors based on time of day
  const colors = {
    day: ['rgba(255,255,255,0.4)', 'rgba(173,216,230,0.3)'],
    evening: ['rgba(255,223,186,0.3)', 'rgba(255,190,146,0.2)'],
    night: ['rgba(100,149,237,0.2)', 'rgba(25,25,112,0.15)']
  };
  
  const particleColors = colors[timeOfDay] || colors.day;
  
  const createParticle = () => {
    const particle = document.createElement('div');
    particle.className = 'map-ambient-particle';
    
    // Random position, size, and opacity
    const x = Math.random() * container.offsetWidth;
    const y = Math.random() * container.offsetHeight;
    const size = Math.random() * 3 + 1;
    const opacity = Math.random() * 0.5 + 0.1;
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    
    // Apply styles
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity;
    particle.style.backgroundColor = color;
    
    // Add to container and array
    container.appendChild(particle);
    
    return {
      element: particle,
      x,
      y,
      vx: Math.random() * 0.2 - 0.1,
      vy: Math.random() * 0.2 - 0.1,
      size,
      color
    };
  };
  
  const updateParticles = () => {
    if (!active) return;
    
    particles.forEach(p => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Boundary check
      if (p.x < 0 || p.x > container.offsetWidth || 
          p.y < 0 || p.y > container.offsetHeight) {
        // Reset position to opposite side
        if (p.x < 0) p.x = container.offsetWidth;
        if (p.x > container.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = container.offsetHeight;
        if (p.y > container.offsetHeight) p.y = 0;
      }
      
      // Update DOM element
      p.element.style.left = `${p.x}px`;
      p.element.style.top = `${p.y}px`;
    });
    
    animationFrame = requestAnimationFrame(updateParticles);
  };
  
  // Public methods for the particle system
  return {
    start: () => {
      if (active) return;
      active = true;
      
      // Create particles
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
      
      // Start animation
      updateParticles();
    },
    
    stop: () => {
      active = false;
      
      // Cancel animation
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      // Remove particles
      particles.forEach(p => {
        if (container.contains(p.element)) {
          container.removeChild(p.element);
        }
      });
      
      particles = [];
    },
    
    updateTimeOfDay: (newTimeOfDay) => {
      // Update colors for existing particles
      const newColors = colors[newTimeOfDay] || colors.day;
      
      particles.forEach(p => {
        p.color = newColors[Math.floor(Math.random() * newColors.length)];
        p.element.style.backgroundColor = p.color;
      });
    }
  };
};


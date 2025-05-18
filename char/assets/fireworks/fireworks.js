import { shineMist } from '../mist/mist.js';
import { shineMoon } from '../moon/moon.js';
import { shineSky } from '../shine/shine.js';
import { shineStars } from '../stars/stars.js';

const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const particles = [];
const bases = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y, dx, dy, color, size, forces) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.size = size;
    this.opacity = 1;
    this.forces = forces;

    this.gravity = 0.4; // pixels per second squared
    this.friction = 0.99; // per second decay factor
    this.fadeRate = 0.005; // opacity decay per second
    this.sizeShrinkRate = 0.995; // per second
  }

  update(deltaTime) {
    if (this.forces == true) {
      this.dy += this.gravity * deltaTime;

      this.dx *= this.friction;
      this.dy *= this.friction;

      if (this.dy > 20) {
        this.dy = 20;
      } else if (this.dy < -20) {
        this.dy = -20;
      }

      if (this.dx > 20) {
        this.dx = 20;
      } else if (this.dx < -20) {
        this.dx = -20;
      }
    }

    this.x += this.dx * deltaTime * 60;
    this.y += this.dy * deltaTime * 60;

    this.size *= Math.pow(this.sizeShrinkRate, deltaTime * 60);
    this.opacity -= this.fadeRate * deltaTime;
    this.opacity = Math.max(this.opacity, 0);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
  }
}

function createExplosion(x, y) {
  const particleCount = 128;
  const angleIncrement = (Math.PI * 2) / particleCount;
  const colorBase = (x / window.innerWidth / 2 + y / window.innerHeight / 2) * 96;

  for (let i = 0; i < particleCount; i++) {
    const angle = i * angleIncrement;
    const speed = Math.random() * 1 + 3;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    const size = Math.random() * 2 + 4;
    const color = `rgb(${colorBase + 32},30,${-colorBase + 128})`;

    particles.push(new Particle(x, y, dx, dy, color, size, true));
  }
}

let lastTimestamp = 0;

function animate(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'lighter';

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.update(deltaTime);
    particle.draw();
    if (particle.opacity <= 0 || particle.size <= 0.1) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

let skyClear = false;

function clearSky() {
  if (skyClear == false) {
    shineMoon();
    shineSky();
    shineMist();
    shineStars();
    canvas.classList.add('trailer');
  } else {
    skyClear = true;
  }
}

function throwUp(x, y, duration) {
  const startY = window.innerHeight;
  const dy = -(startY - y) / (duration * 60);

  const particle = new Particle(x, startY, 0, dy, 'white', 4, false);
  particles.push(particle);

  setTimeout(() => {
    const index = particles.indexOf(particle);
    if (index !== -1) {
      particles.splice(index, 1);
      clearSky();
      createExplosion(particle.x, particle.y);
    }
  }, duration * 1000);
}

export function launchFireworks() {
  const amount = 8;
  const delayBetween = Math.ceil(Math.random() * 5 + 5);
  let fireworkIndex = 0;

  const id = setInterval(() => {
    if (fireworkIndex === amount) {
      clearInterval(id);
    } else {
      fireworkIndex++;
      const x = (Math.random() * 0.7 + 0.15) * canvas.width;
      const y = (Math.random() * 0.7 + 0.15) * canvas.height;
      const launchDuration = Math.random() + 2.0;
      throwUp(x, y, launchDuration);
    }
  }, delayBetween);

  requestAnimationFrame(animate);
}

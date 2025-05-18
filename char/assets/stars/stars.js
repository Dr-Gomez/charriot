const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
const starCount = 256;
const stars = [];

function resizeCanvas() {
  const oldWidth = canvas.width;
  const oldHeight = canvas.height;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (oldWidth !== canvas.width || oldHeight !== canvas.height) {
    for (let star of stars) {
      star.x = (star.x / oldWidth) * canvas.width;
      star.y = (star.y / oldHeight) * canvas.height;
    }
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < starCount; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1 + 0.5,
    speed: Math.random() * 0.005 + 0.003,
    color: `#f${Math.ceil(Math.random() * 4 + 5)}99f${Math.ceil(Math.random() * 4 + 5)}`,
    innerRadius: Math.random() * 2 + 5,
    rotation: Math.random() * Math.PI * 2,
  });
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const star of stars) {
    star.y += star.speed;

    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.fill();
  }

  requestAnimationFrame(animateStars);
}

function gradualShow() {
  const canvas = document.getElementById('stars');
  canvas.classList.add('show');
  setTimeout(() => {
    canvas.classList.add('shown');
    canvas.classList.remove('show');
  }, 1000);
}

export function shineStars() {
  gradualShow();
  animateStars();
}

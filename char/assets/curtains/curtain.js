import { launchFireworks } from '../fireworks/fireworks.js';

export const readyCurtains = () => {
  window.addEventListener('load', setCurtains);
};

const setCurtains = () => {
  document.addEventListener('mousedown', openCurtains);
};

const openCurtains = () => {
  window.removeEventListener('load', setCurtains);
  document.removeEventListener('mousedown', openCurtains);

  setTimeout(function () {
    document.body.classList.add('curtain-open');
    setTimeout(function () {
      launchFireworks();
      document.getElementById('left-curtain').remove();
      document.getElementById('right-curtain').remove();
    }, 1500);
  }, 200);
};

const code = document.getElementById('code');

let keyState = { shift: false, ctrl: false, alt: false, meta: false };
let cursorPos = { row: 0, column: 0 };

function captureKeys(event) {}

code.addEventListener('mousedown', () => {
  document.addEventListener('keydown', captureKeys);
});

document.addEventListener('mousedown', () => {
  document.removeEventListener('keydown', captureKeys);
});

window.onload = () => {
  const canvas = document.getElementById('mandelbrotCanvas');
  const ctx = canvas.getContext('2d');

  let WIDTH = 500;
  let HEIGHT = 500;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const MAX_ITERATIONS = 200;
  const BOUND_THRESHOLD = 4;

  let MIN_X = -2;
  let MAX_X = 2;
  let MIN_Y = -2;
  let MAX_Y = 2;

  function mandelbrot(c) {
    let z = { real: 0, imag: 0 };
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const zRealSq = z.real * z.real;
      const zImagSq = z.imag * z.imag;
      if (zRealSq + zImagSq > BOUND_THRESHOLD) {
        return i; // Unbounded: escaped
      }
      const newReal = zRealSq - zImagSq + c.real;
      const newImag = 2 * z.real * z.imag + c.imag;
      z.real = newReal;
      z.imag = newImag;
    }
    return -1; // Bounded
  }

  function drawMandelbrot() {
    for (let x = 0; x < WIDTH; x++) {
      const real = MIN_X + (x / WIDTH) * (MAX_X - MIN_X);

      for (let y = 0; y < HEIGHT; y++) {  
        const imag = MIN_Y + (y / HEIGHT) * (MAX_Y - MIN_Y);
        const c = { real, imag };
        const iterations = mandelbrot(c);
        if (iterations === -1) {
          ctx.fillStyle = 'lightblue'; // Bounded
        } else {
          ctx.fillStyle = 'darkblue'; // Unbounded
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  drawMandelbrot();

  // click to zoom in the mandelbrot
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const realClick = MIN_X + (clickX / WIDTH) * (MAX_X - MIN_X);
    const imagClick = MIN_Y + (clickY / HEIGHT) * (MAX_Y - MIN_Y);

    const zoomFactor = 0.5; // Zoom in by a factor of 2 (1/0.5)

    const newWidth = (MAX_X - MIN_X) * zoomFactor;
    const newHeight = (MAX_Y - MIN_Y) * zoomFactor;

    MIN_X = realClick - newWidth / 2;
    MAX_X = realClick + newWidth / 2;
    MIN_Y = imagClick - newHeight / 2;
    MAX_Y = imagClick + newHeight / 2;

    drawMandelbrot();
  });
};

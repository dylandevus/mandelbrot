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
        return i;
      }
      const newReal = zRealSq - zImagSq + c.real;
      const newImag = 2 * z.real * z.imag + c.imag;
      z.real = newReal;
      z.imag = newImag;
    }
    return -1;
  }

  function drawMandelbrot() {
    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < HEIGHT; y++) {
        const real = MIN_X + (x / WIDTH) * (MAX_X - MIN_X);
        const imag = MIN_Y + (y / HEIGHT) * (MAX_Y - MIN_Y);
        const c = { real, imag };
        const iterations = mandelbrot(c);
        if (iterations === -1) {
          ctx.fillStyle = 'lightblue';
        } else {
          ctx.fillStyle = 'darkblue';
        }
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  drawMandelbrot();
};

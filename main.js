window.onload = () => {
  const canvas = document.getElementById("mandelbrotCanvas");
  const ctx = canvas.getContext("2d");

  let WIDTH = 500;
  let HEIGHT = 500;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const MAX_ITERATIONS = 200;
  const BOUND_THRESHOLD = 4;
  const SMALLEST_THRESHOLD = 1e-10;

  let isZooming = false;
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

  function getColor(iterations) {
    if (iterations === -1) {
      return "lightblue"; // Bounded (Inside the Mandelbrot set)
    } else {
      // return 'darkblue'; // Unbounded
      const hue = 200 + (iterations / MAX_ITERATIONS) * 160; // Adjust hue range for blue glow
      const saturation = 100; // Full saturation
      const lightness = 50 + (iterations / MAX_ITERATIONS) * 30; // vary lightness
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
  }

  function drawMandelbrot() {
    for (let x = 0; x < WIDTH; x++) {
      const real = MIN_X + (x / WIDTH) * (MAX_X - MIN_X);

      for (let y = 0; y < HEIGHT; y++) {
        const imag = MIN_Y + (y / HEIGHT) * (MAX_Y - MIN_Y);
        const c = { real, imag };
        const iterations = mandelbrot(c);
        ctx.fillStyle = getColor(iterations);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  function gradualZoomClickHandler(event) {
    if (isZooming) {
      return;
    }
    isZooming = true;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const realClick = MIN_X + (clickX / WIDTH) * (MAX_X - MIN_X);
    const imagClick = MIN_Y + (clickY / HEIGHT) * (MAX_Y - MIN_Y);

    const zoomFactor = 0.9;
    const zoomSteps = 10;
    let currentStep = 0;

    let startMinX = MIN_X;
    let startMaxX = MAX_X;
    let startMinY = MIN_Y;
    let startMaxY = MAX_Y;

    function gradualZoom() {
      const newWidth = (MAX_X - MIN_X) * zoomFactor;
      const newHeight = (MAX_Y - MIN_Y) * zoomFactor;

      const newMinX = realClick - newWidth / 2;
      const newMaxX = realClick + newWidth / 2;
      const newMinY = imagClick - newHeight / 2;
      const newMaxY = imagClick + newHeight / 2;

      if (
        Math.abs(newMaxX - newMinX) < SMALLEST_THRESHOLD ||
        Math.abs(newMaxY - newMinY) < SMALLEST_THRESHOLD ||
        currentStep >= zoomSteps
      ) {
        isZooming = false;
        return;
      }

      let progress = currentStep / zoomSteps; // 0 to 1
      MIN_X = startMinX + (newMinX - startMinX) * progress;
      MAX_X = startMaxX + (newMaxX - startMaxX) * progress;
      MIN_Y = startMinY + (newMinY - startMinY) * progress;
      MAX_Y = startMaxY + (newMaxY - startMaxY) * progress;

      drawMandelbrot();
      currentStep++;
      requestAnimationFrame(gradualZoom);
    }

    gradualZoom();
  }

  drawMandelbrot();

  // click to zoom in the mandelbrot
  canvas.addEventListener("click", (event) => {
    const zoomMode = document.querySelector(
      'input[name="zoomMode"]:checked'
    ).value;

    if (zoomMode === "instant") {
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
    } else {
      gradualZoomClickHandler(event);
    }

    drawMandelbrot();
  });
};

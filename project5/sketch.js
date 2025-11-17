let img;
let slider;         // Aperture radius
let blurSlider;     // Blur width
let zoomSlider;     // Zoom (was color offset)
let pg;             // Graphics layer
let pixelFont;

function preload() {
  img = loadImage("TITAN_Introduction.png");
  pixelFont = loadFont("PixelFont.ttf");
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("canvas-container");
  img.resize(600, 600);
  pg = createGraphics(600, 600);

  slider = createSlider(50, 300, 150);
  slider.position(10, height + 10);
  slider.style("width", "180px");
  slider.style("display", "inline-block");
  slider.style("margin-right", "10px");

  blurSlider = createSlider(0, 150, 50);
  blurSlider.position(200, height + 10);
  blurSlider.style("width", "180px");
  blurSlider.style("display", "inline-block");
  blurSlider.style("margin-right", "10px");

  zoomSlider = createSlider(1, 4, 2, 0.1); 
  zoomSlider.position(390, height + 10);
  zoomSlider.style("width", "180px");
  zoomSlider.style("display", "inline-block");
}

function draw() {
  image(img, 0, 0);

  pg.clear();
  pg.background(0);

  let ctx = pg.drawingContext;
  let radius = slider.value();
  let blurWidth = blurSlider.value();
  let zoom = zoomSlider.value();

  let innerRadius = max(0, radius - blurWidth);
  let outerRadius = radius;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  let eraseGradient = ctx.createRadialGradient(mouseX, mouseY, innerRadius, mouseX, mouseY, outerRadius);
  eraseGradient.addColorStop(0, 'rgba(0,0,0,1)');
  eraseGradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = eraseGradient;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, outerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  let zoomSize = radius * 2;
  let sx = constrain(mouseX - radius / zoom, 0, img.width - zoomSize / zoom);
  let sy = constrain(mouseY - radius / zoom, 0, img.height - zoomSize / zoom);

  pg.image(
    img,
    mouseX - radius,
    mouseY - radius,
    zoomSize,
    zoomSize,
    sx,
    sy,
    zoomSize / zoom,
    zoomSize / zoom
  );

  image(pg, 0, 0);

  fill(255);
  textSize(14);
  textFont(pixelFont);
  textAlign(LEFT, CENTER);
  text(`Aperture radius: ${radius}px`, 10, height - 30);
  text(`Blurred edges: ${blurWidth}px`, 200, height - 30);
  text(`Zoom: ${zoom.toFixed(1)}x`, 390, height - 30);
}

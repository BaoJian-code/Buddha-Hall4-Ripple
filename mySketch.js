let song, img, t = 0;
let r = 0;

const block_size = 25;
const block_core = 1;
const block_move_distance = 10;
const block_move_range = 70;
const block_scale = 0.02;
const ripple_speed = 0.24;

let mouse_speed;
let fps, avgFps = 0;
let prevFrame = 0;
let prevTime = 0;
let fpsInterval = 1000;

let blocks;
let ripples = [];

let counter = 0;
let min = 0;

function preload() {
	song = loadSound('buddha bgm.mp3');
	img = loadImage('ripple.png');
}

function setup() {
        //start website sound
	getAudioContext().suspend();
	userStartAudio();
	//
	// timer

	function timeIt() {
		if (counter == 59) {
			min++;
			counter = 0;
		}
		counter++;
	}

	setInterval(timeIt, 1000);
	//

	colorMode(HSB, 255)
	createCanvas(windowWidth, windowHeight);
	song.loop();
	imageMode(CENTER);
	amplitude = new p5.Amplitude();
	noStroke();
	fill(233, 230);
	rectMode(CENTER);
	noSmooth();

	let left_padding = Math.round(width % block_size) / 2;
	let top_padding = Math.round(height % block_size) / 2;

	blocks = Array.from({
			length: Math.floor(height / block_size)
		}, (v, y) =>
		Array.from({
				length: Math.floor(width / block_size)
			}, (v, x) =>
			new Block(left_padding + block_size * (x + 0.5), top_padding + block_size * (y + 0.5), y * Math.floor(width / block_size) + x)
		)
	);
}

function draw() {


	background(5);
        fill(0);
	rect(10, height - 40, 200, 40);
	fill(255);
	textSize(20);
	text('Be Focused ' + nf(min, 2) + ':' + nf(counter, 2), 10, height - 2)

	if (keyIsDown(32)) {
		if (random() < pow(fps / 60, 3)) {
			ripples.push(new Ripple(random(width), random(height), 0.4));
		}
	} else {
		if (random() < pow(fps / 60, 3) / 16) {
			ripples.push(new Ripple(random(width), random(height), 0.1));
		}
	}

	fps = frameRate();

	if (millis() - prevTime > fpsInterval) {
		avgFps = (frameCount - prevFrame) / fpsInterval * 1000;
		prevFrame = frameCount;
		prevTime = millis();
	}

	mouse_speed = dist(mouseX, mouseY, pmouseX, pmouseY);

	//background(100, 140);

	rectMode(CENTER);

	ripples.forEach((ripple, i) => {
		ripple.updateRadius();
		ripple.checkKill();
	});


	noStroke();
	
	blocks.forEach((line, i) =>
		line.forEach((block, j) => {
			block.calcDiff(ripples);
			block.render();
		})
	);
	

	
	//insert image
	image(img, windowWidth / 2+4, windowHeight / 2 +450, 1068, 1600);

	//get amplitude
	let vol = amplitude.getLevel();
	let r = map(vol, 0, 1, 20, 300)

	//draw red dot
	for (let i = 0; i < 100; i++) {
		let alpha = 255 * (i / 100);
		fill(255, 255, 255, alpha / 15);
		r = r + 1/20;
		circle(windowWidth / 2 + 12, windowHeight / 2 - 84, r);
	}
}

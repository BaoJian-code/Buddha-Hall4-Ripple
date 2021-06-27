
//function mousePressed() {
//    ripples.push(new Ripple(mouseX, mouseY, 1));
//}

function mouseMoved() {
	if (random() < pow(fps / 60, 3) * mouse_speed / 30) {
		ripples.push(new Ripple(mouseX, mouseY, 0.15 * mouse_speed / 40));
	}
}

function mouseDragged() {
	if (random() < pow(fps / 60, 3) * mouse_speed / 20) {
		ripples.push(new Ripple(mouseX, mouseY, 0.6 * mouse_speed / 40));
	}
}

function keyPressed() {
	if (keyCode === 73) {
		show_info = !show_info;
	} else if (keyCode === 82) {
		show_ripples = !show_ripples;
	}
}


class Block {
	constructor(x, y, id) {
		this.pos = createVector(x, y);
		this.id = id;
	}

	render() {
		fill(125, cubicInOut(this.amp, 60, 240, 15));
		ellipse(this.pos.x + this.diff.x, this.pos.y + this.diff.y, (block_core + this.amp * block_scale) * 5, block_core + this.amp * block_scale * 0.5);
		ellipse(this.pos.x + this.diff.x, this.pos.y + this.diff.y, block_core + this.amp * block_scale * 0.5, (block_core + this.amp * block_scale) * 5);
	}

	/**
	 * @param {Ripple[]} ripples
	 */
	calcDiff(ripples) {
		this.diff = createVector(0, 0);
		this.amp = 0;

		ripples.forEach((ripple, i) => {
			if (!ripple.dists[this.id]) {
				ripple.dists[this.id] = dist(this.pos.x, this.pos.y, ripple.pos.x, ripple.pos.y);
			};
			let distance = ripple.dists[this.id] - ripple.currRadius;
			if (distance < 0 && distance > -block_move_range * 2) {
				if (!ripple.angles[this.id]) {
					ripple.angles[this.id] = p5.Vector.sub(this.pos, ripple.pos).heading();
				};
				const angle = ripple.angles[this.id];
				const localAmp = cubicInOut(-abs(block_move_range + distance) + block_move_range, 0, block_move_distance, block_move_range) * ripple.scale;
				this.amp += localAmp;
				const movement = p5.Vector.fromAngle(angle).mult(localAmp);
				this.diff.add(movement);
			}
		});
	}

}

class Ripple {
	constructor(x, y, scale) {
		this.pos = createVector(x, y);
		this.initTime = millis();
		this.currRadius = 0;
		this.endRadius = max(dist(this.pos.x, this.pos.y, 0, 0), dist(this.pos.x, this.pos.y, 0, height), dist(this.pos.x, this.pos.y, width, 0), dist(this.pos.x, this.pos.y, height, width)) + block_move_range;
		this.scale = scale;

		this.dists = [];
		this.angles = [];
	}

	checkKill() {
		if (this.currRadius > this.endRadius) {
			ripples.splice(ripples.indexOf(this), 1);
		}
	}

	updateRadius() {
		this.currRadius = (millis() - this.initTime) * ripple_speed;
		//this.currRadius = 200;
	}

	draw() {
		stroke(255, cubicInOut(this.scale, 30, 120, 1));
		noFill();
		ellipse(this.pos.x, this.pos.y, this.currRadius * 2, this.currRadius * 2);
	}
}

function cubicInOut(t, b, c, d) {
	if (t <= 0) return b;
	else if (t >= d) return b + c;
	else {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t * t + b;
		t -= 2;
		return c / 2 * (t * t * t + 2) + b;
	}
}
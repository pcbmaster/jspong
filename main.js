var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");

var PADDLE_WIDTH = 10;
var PADDLE_HEIGHT = 100;
var BALL_SIZE = 10;
var GOAL_PADDING = 25;

class Paddle {
    constructor(x, y) {
	this.topLeftX = x;
	this.topLeftY = y;
	this.bottomRightX = x + PADDLE_WIDTH;
	this.bottomRightY = y + PADDLE_HEIGHT;
    }

    movePaddleUp(pix) {
	if(this.topLeftY - pix > 0) {
	    this.topLeftY -= pix;
	}
    }

    movePaddleDown(pix) {
	if(this.bottomRightY + pix < canvas.height) {
	    this.topLeftY -= pix;
	}
    }

    draw() {
	ctx.fillStyle = "white";
	ctx.fillRect(this.topLeftX, this.topLeftY, PADDLE_WIDTH, PADDLE_HEIGHT);
    }
}

class ProjectileVector {
    constructor(angle, velocity) {
	this.angle = angle;
	this.velocity = velocity;
    }

    calculateMovement(currentX, currentY) {
	if(this.angle == 0 || this.angle == 90 || this.angle == 180 || this.angle == 270) {
	    switch(this.angle) {
	    case 0:
		return [currentX + this.velocity, currentY];
	    case 90:
		return [currentX, currentY + this.velocity];
	    case 180:
		return [currentX - this.velocity, currentY];
	    case 270:
		return [currentX, currentY - this.velocity];
	    }
	}
	if(this.angle > 0 && this.angle < 90) {
	    return [currentX + (Math.cos(this.angle) * this.velocity), currentY + (Math.sin(this.angle) * this.velocity)];
	}
	if(this.angle > 90 && this.angle < 180) {
	    return [currentX - (Math.cos(this.angle%90) * this.velocity), currentY + (Math.sin(this.angle%90) * this.velocity)];
	}
	if(this.angle > 180 && this.angle < 270) {
	    return [currentX - (Math.cos(this.angle%90) * this.velocity), currentY - (Math.sin(this.angle%90) * this.velocity)];
	}
	if(this.angle > 270 && this.angle < 360) {
	    return [currentX + (Math.cos(this.angle%90) * this.velocity), currentY - (Math.sin(this.angle%90) * this.velocity)];
	}
	return [-1]; //somehow we screwed up bad, this should NEVER be returned!
    }

    deflect(collision) { //collision values: 0 - top barrier, 1 - bottom barrier, 2 - left paddle, 3 - right paddle
	switch(collision){
	case 0:
	    this.angle = 360 - this.angle;
	    break;
	case 1:
	    this.angle = 360 - this.angle;
	    break;
	case 2:
	    this.angle = 180 - this.angle;
	    break;
	case 3:
	    this.angle = 180 - this.angle;
	    break;
	}
    }
}

class Ball {
    constructor(x, y, angle, velocity) {
	this.topLeftX = x;
	this.topLeftY = y;
	this.bottomRightX = x + BALL_SIZE;
	this.bottomRightY = y + BALL_SIZE;
	this.centerX = this.bottomRightX - (BALL_SIZE/2);
	this.centerY = this.bottomRightY - (BALL_SIZE/2);
	this.vector = new ProjectileVector(angle, velocity);
    }

    move() {
	var newPos = this.vector.calculateMovement(this.centerX, this.centerY);
	this.centerX = newPos[0];
	this.centerY = newPos[1];
	this.bottomRightX = this.centerX + (BALL_SIZE/2);
	this.bottomRightY = this.centerY + (BALL_SIZE/2);
	this.topLeftX = this.centerX - (BALL_SIZE/2);
	this.topLeftY = this.centerY - (BALL_SIZE/2);
    }
    
    draw() {
	checkCollision();
	ctx.fillStyle = "white";
	ctx.fillRect(this.topLeftX, this.topLeftY, BALL_SIZE, BALL_SIZE);
    }
}

function checkCollision() {

}

function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "grey";
    ctx.fillRect((canvas.width/2)-5, 10, 10, canvas.height-20);
}

// these objects have to be defined here, classes aren't hoisted
var playerPaddle = new Paddle(GOAL_PADDING, (canvas.height/2)-(PADDLE_HEIGHT/2));
var computerPaddle = new Paddle(canvas.width - GOAL_PADDING*2, (canvas.height/2)-(PADDLE_HEIGHT/2));
var pongBall = new Ball(canvas.width/2, canvas.height/2, 15, 5);
var tick = 0;
function frameTick(tick){
    pongBall.move();
    clearCanvas();
    playerPaddle.draw();
    computerPaddle.draw();
    pongBall.draw();
    requestAnimationFrame(frameTick());
}
    
//frameTick();
requestAnimationFrame(frameTick());

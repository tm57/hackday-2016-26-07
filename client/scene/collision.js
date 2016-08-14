const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
function Collision() {
	this.winner = false;
	this.ballDirection = false;
	this.down = false;

};

Collision.prototype.GameBallOnWall = function (BallPosition) {
	var extremeX = 70;

	if (BallPosition.x > 0 && BallPosition.x >= extremeX) {
		this.winner = 'left';
	}

	if (BallPosition.x < 0 && BallPosition.x <= -extremeX) {
		this.winner = 'right';
	}

	return this;
};

Collision.prototype.GameBallHitByPlayer = function (Ball, Player1, Player2) {
	if (Ball.position.x >= 70 && Ball.position.y <= Player1.topY && Ball.position.y >= Player1.bottomY) {

		this.ballDirection = LEFT;
		console.log('Right Player1 Hit');
	}

	if (Ball.position.x <= -70 && Ball.position.y <= Player2.topY && Ball.position.y >= Player2.bottomY) {

		this.ballDirection = RIGHT;
		console.log('Left Player1 Hit');
	}
	return this.ballDirection;
};

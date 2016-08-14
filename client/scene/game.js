var Pong = function (data, socket) {

	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.setClearColor(0X000000);

	this.data = data;
	this.socket = socket;
	this.isLeft = false;
	this.keyboard = new THREEx.KeyboardState();
	this.clock = new THREE.Clock();
	this.scene = new THREE.Scene();

	var delta = this.clock.getDelta(); // seconds.
	var moveDistance = 99000 * delta; // 200 pixels per second

	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
	this.camera.position.set(0, 0, 100);
	this.camera.lookAt(new THREE.Vector3(0, 0, 0));
	var self = this;
	this.socket.on('move', function (data) {
		self.moveOpponent(data);
	});

	this.setCurrentPlayer = function (data, username) {
		this.currentPlayer = username == data.leftPlayer ? data.leftPlayer : data.rightPlayer;
		this.otherPlayer = this.currentPlayer != data.leftPlayer ? data.leftPlayer : data.rightPlayer;
	};
	/**
	 *
	 * @param data
	 */
	this.setCurrentPlayerTextSettings = function (data) {
		//Render Name
		var Text2D = THREE_Text.Text2D;
		var textAlign = THREE_Text.textAlign;

		var Point = {x: 40, y: 40, z: 0};

		if (data.boardPosition === 'left') {
			Point = {x: -60, y: 40, z: 0};
			this.isLeft = true;
			console.log('Current Player Left---->', this.isLeft);

		}
		var text = new Text2D(data.currentPlayerUsername, {
			align: textAlign.left,
			font: '72px Arial',
			fillStyle: '#ffffff',
			antialias: true
		});
		text.material.alphaTest = 0.1;
		text.position.set(Point.x, Point.y, Point.z);// -60 40 0 | 40, 40, 0
		text.scale.set(0.09, 0.09, 0.09);//
		this.scene.add(text);

	};
	this.setOpponentPlayerTextSettings = function (data) {
		//Render Name
		var Text2D = THREE_Text.Text2D;
		var textAlign = THREE_Text.textAlign;

		var Point = {x: -60, y: 40, z: 0};
		if (data.boardPosition === 'left') {
			Point = {x: 40, y: 40, z: 0};
			this.isLeft = true;

		}
		var text = new Text2D(data.opponentName, {
			align: textAlign.left,
			font: '72px Arial',
			fillStyle: '#ffffff',
			antialias: true
		});
		text.material.alphaTest = 0.1;
		text.position.set(Point.x, Point.y, Point.z);// -60 40 0 | 40, 40, 0
		text.scale.set(0.09, 0.09, 0.09);//
		this.scene.add(text);

	};

	// Move current client, let's say you :)
	this.movePlayer = function () {

		if (this.keyboard.pressed("up")) {
			var posUp = 'up';
			var position = 0;
			if (this.data.boardPosition === 'left') {
				position = this.leftPlayer.position.y += moveDistance;
			} else {
				position = this.rightPlayer.position.y += moveDistance;
			}

			this.socket.emit('move', {polarity: posUp, position: position});
			// console.log('Position Up', posUp);

		}
		if (this.keyboard.pressed("down")) {
			var posDown = 'down';
			position = 0;
			if (this.data.boardPosition === 'left') {
				position = this.leftPlayer.position.y -= moveDistance;
			} else {
				position = this.rightPlayer.position.y -= moveDistance;
			}
			this.socket.emit('move', {polarity: posDown, position: position});
			// console.log('Position Down', posDown);
		}
	};

	//Observe opponent, them :P
	this.moveOpponent = function (vector) {

		console.log(vector);
		if (this.data.boardPosition === 'left') {
			if (vector.polarity == 'up') {
				this.rightPlayer.position.y = vector.position;
			}
			if (vector.polarity == 'down') {
				this.rightPlayer.position.y = vector.position;
			}
		} else {
			if (vector.polarity == 'up') {
				this.leftPlayer.position.y = vector.position;
			}
			if (vector.polarity == 'down') {
				this.leftPlayer.position.y = vector.position;
			}
		}
	};

	//This looks ugly, just believe it will prepare our awesome game console, yes console!
	var geometry = new THREE.Geometry();
	var leftWallGeometry = new THREE.Geometry();
	var RightWallGeometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, -40, 0));
	geometry.vertices.push(new THREE.Vector3(0, 40, 0));
	leftWallGeometry.vertices.push(new THREE.Vector3(70, -40, 0));
	leftWallGeometry.vertices.push(new THREE.Vector3(70, 40, 0));
	RightWallGeometry.vertices.push(new THREE.Vector3(-70, -40, 0));
	RightWallGeometry.vertices.push(new THREE.Vector3(-70, 40, 0));
	var material = new THREE.LineBasicMaterial({
		color: 0x6699FF
	});

	var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
		color: 0xffffff
	}));

	this.leftWall = new THREE.Line(leftWallGeometry, material);
	this.rightWall = new THREE.Line(RightWallGeometry, material);

	geometry = new THREE.CircleGeometry(5, 32);
	material = new THREE.MeshBasicMaterial({color: 0xffff00});
	this.Ball = new THREE.Mesh(geometry, material);


	geometry = new THREE.BoxGeometry(1, 40, 1);
	material = new THREE.MeshBasicMaterial({color: 0xff0000});
	this.leftPlayer = new THREE.Mesh(geometry, material);
	this.leftPlayer.position.x = -70;

	material = new THREE.MeshBasicMaterial({color: 0x00ff00});
	this.rightPlayer = new THREE.Mesh(geometry, material);
	this.rightPlayer.position.x = 70;


	this.scene.add(line);
	this.scene.add(this.leftWall);
	this.scene.add(this.rightWall);
	this.scene.add(this.Ball);
	this.scene.add(this.leftPlayer);
	this.scene.add(this.rightPlayer);

	this.renderScene = function () {
		document.body.appendChild(this.renderer.domElement);

		this.render();
	};

	this.render = function () {
		requestAnimationFrame(this.render.bind(this));

		var direction = Collision.prototype.GameBallHitByPlayer(this.Ball, this.leftPlayer, this.rightPlayer);
		if (direction == 'LEFT') {
			GlobalX = -0.4;
		}
		if (direction == 'RIGHT') {
			GlobalX = -0.4;
		}

		this.Ball.translateX(GlobalX);
		this.Ball.translateY(GlobalY);

		if (this.Ball.position.y > 40) {
			GlobalY = -0.4;
		}
		else if (this.Ball.position.y < -40) {
			GlobalY = 0.4;
		}
		else if (this.Ball.position.x > 70) {
			GlobalX = -0.4;
		}
		else if (this.Ball.position.x < -70) {
			GlobalX = 0.4;
		}
		this.movePlayer();
		this.renderer.render(this.scene, this.camera);
	};
};

(function(){

var canvas, gl, program;
canvas = document.getElementById('canvas');

var resolution;

var boxes = [];
var BOX_COUNT = 200000;
var boxesPoints = new Float32Array(BOX_COUNT*2); // each box takes two spots

var current = Date.now();
var previous;
var delta;

load_environment();
load_boxes();

animate();

console.log('Started..');

function load_boxes(){
    for (var x=0; x<BOX_COUNT; x++)
    {
        var newBox = new box();
        boxes.push(newBox);
    }
}

function load_environment(){
    // create a webgl context
	gl = canvas.getContext('webgl');
	if (!gl){
		alert('No WebGL support!');
	}

    //this function is called during resizes
    window.onresize = function(){
        canvas.width = window.innerWidth;
        canvas.height = canvas.width * .562;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolution, canvas.width, canvas.height);
    }
    window.onresize();

    program = gl.createProgram();

    // set up the vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, document.getElementById('vertex-shader').innerHTML);
    gl.compileShader(vertexShader);
    gl.attachShader(program, vertexShader);

    // set up the frag shaderz
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, 
    document.getElementById('fragment-shader').innerHTML);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program); //makes it active

    var positionAttrib = gl.getAttribLocation(program, 'a_position');

    // set how gpu interprets vertex points
    gl.enableVertexAttribArray(positionAttrib); 
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    // 8 is stride
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 8, 0); // '2' is 2D

    gl.useProgram(program); //saves on performance: do here instead of before draw

    // set the resolution
    resolution = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolution, canvas.width, canvas.height);
}


function box(){
    this.pos = [canvas.width / 4, canvas.height / 4];
    this.height = 10;
    this.width = 10;
    this.speed = 15.0;
    this.friction = 0.92;
    this.acceleration = [Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0];
    this.velocity = [(Math.random() * 2.0 - 1.0) * 25, (Math.random() * 2.0 - 1.0) * 25];
    //this.color = [Math.random()/2, 0.56, 0.76, 0.8];
    this.color = [0,0,0,1];

    this.move = function(){
        this.velocity[0] -= this.acceleration[0] / 5;
        this.velocity[0] *= this.friction;
        this.pos[0] += this.velocity[0] * this.speed * delta;
        // if ( (this.pos[0]+this.width > canvas.width / 2) || (this.pos[0] < 0) ){
        //     this.velocity[0] *= -1;
        // }
        this.velocity[1] -= this.acceleration[1] / 5;
        this.velocity[1] *= this.friction;
        this.pos[1] += this.velocity[1] * this.speed * delta;
        // if ( (this.pos[1]+this.height > canvas.height / 2) || (this.pos[1] < 0) ){
        //     this.velocity[1] *= -1;
        // }
    }
}


function animate(){

    previous = current;
    current = Date.now();
    delta = (current - previous) / 1000;

    var box;
    boxI = 0;
    for (var b=0; b<boxes.length; b++) //boxes.length
    {
        box = boxes[b];

        boxesPoints[boxI] = box.pos[0];
        boxesPoints[boxI+1] = box.pos[1];
        boxI += 2;

        box.move();
    }
    gl.uniform4f(gl.getUniformLocation(program, "u_color"),
            box.color[0], box.color[1], 
            box.color[2], box.color[3]);
    gl.bufferData(gl.ARRAY_BUFFER, boxesPoints, gl.STATIC_DRAW); 
    gl.drawArrays(gl.POINTS, 0, boxes.length); //# total points

    window.requestAnimationFrame(animate);
}


})();
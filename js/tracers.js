(function(){

var canvas, gl, program;
canvas = document.getElementById('canvas');

var resolution;
var pointSize;

var Settings = function() {
    this.pointSize = 1.0 ;
    this.emitterCount = 30;
    this.particleCount = 10000;
    this.particleRefresh = 1000;
};
var settings = new Settings();

var changed = function(newValue) {
    load_scene();
    load_emitters();
    load_boxes();
}

var gui = new dat.GUI();
gui.add(settings, 'pointSize', 1, 15).onChange(changed);

// connect to dom
gui.domElement.id = 'gui';

// Emitter
var emitters = [];

// Boxes
var boxes = [];
var NUM_OF_PARTICLES_PER_GROUP;
var itemPoints;

var mouseX = 0;
var mouseY = 0;
var canvasrect;

load_scene();
load_boxes();
load_emitters();

var current = Date.now();
var previous;
var delta = 0;

animate();

var count;
var mouseDown = false;

// Add mousemovement event
document.addEventListener( "mousedown", onMouseDown, false );
document.addEventListener( "mouseup", onMouseUp, false );
document.addEventListener( "mousemove", onMouseMove, false );

function onMouseDown(e){
    mouseDown = true;
}

function onMouseUp(e){
    mouseDown = false;
}

function onMouseMove(e) {
    //ontouchstart for iphone!!

    canvasrect = canvas.getBoundingClientRect();

    mouseX = (e.pageX - canvasrect.left) / 2;
    mouseY = canvas.height / 2 - (e.pageY-canvasrect.top)/(canvasrect.bottom-canvasrect.top)*canvas.height / 2
}

function load_boxes(){

    boxes = []; // empty it

    for (var x=0; x<settings.particleCount; x++)
    {
        boxes.push(new Box());
    }
}

function load_emitters(){

    emitters = []; // empty

    for (var x=0; x<settings.emitterCount; x++)
    {
        emitters.push(new Emitter());
    }
}

function load_scene(){

    // create a webgl context
	gl = canvas.getContext('webgl');
	if (!gl){
		alert('No WebGL support!');
	}

    //this function is called during resizes
    window.onresize = function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.getBoundingClientRect().top;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolution, canvas.width, canvas.height);
    }
    // call at the start
    window.onresize();

    count = 0;
    NUM_OF_PARTICLES_PER_GROUP = settings.particleCount / settings.particleRefresh;
    itemPoints = new Float32Array((settings.particleCount + settings.emitterCount)*2); // each box takes two spots

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
    glPointSize = gl.getAttribLocation(program, 'pointSize');

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

function Vector(inputX, inputY){

    this.x = inputX;
    this.y = inputY;

    this.subtract = function(vector){
        return new Vector(vector.x - this.x, vector.y - this.y);
    }

    // Add abs of both then square 
    this.length = function(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    this.normalize = function(){
        var l = this.length();
        if (l != 0) {
            this.x /= l;
            this.y /= l;
        }

        return this;
    }

    return this;
}

function Emitter(){

    this.reset = function(){
        this.onFirstUpdate = true;

        this.speed = 10;
        this.friction = 0.996;
        this.velocity = [(Math.random() * 2.0 - 1.0) * 20, (Math.random() * 2.0 - 1.0) * 20];
        this.pos = [canvas.width/4, canvas.height/4];

        this.color = [0,0,0,1];
    }

    this.emitParticles = function(){
    
        var boxStart = NUM_OF_PARTICLES_PER_GROUP * count;
        var boxEnd = boxStart + NUM_OF_PARTICLES_PER_GROUP;
        count ++;
        if (count >= settings.particleRefresh) {
            count = 0;
        }
        for (var b=boxStart; b<boxEnd; b++) {
            box = boxes[b];
            box.reset();
            box.pos[0] = this.pos[0];
            box.pos[1] = this.pos[1];
        }
    }

    this.pull = function(pos) {

        var mouseVec = new Vector(pos[0], pos[1]);

        var direction = new Vector(this.pos[0], this.pos[1]).subtract(mouseVec).normalize();

        this.velocity[0] += direction.x;
        this.velocity[1] += direction.y;
    }

    this.move = function(){

        // get direction
        if (mouseDown) {
            this.pull([mouseX, mouseY]);
        }

        // // Apply speed
        // this.speed[0] += (this.velocity.x * this.movementSpeed);
        // this.speed[1] += (this.velocity.y * this.movementSpeed);

        // Apply friction
        this.velocity[0] *= this.friction;
        this.velocity[1] *= this.friction;

        // Adjust position
        this.pos[0] += this.velocity[0] * this.speed * delta;
        this.pos[1] += this.velocity[1] * this.speed * delta;

        // Boundaries
        if (this.pos[0] >= canvas.width / 2 || this.pos[0] <= 0) {
            this.velocity[0] *= -1;
        }
        if (this.pos[1] >= canvas.height / 2 || this.pos[1] <= 0) {
            this.velocity[1] *= -1;
        }

        this.emitParticles();
    }

    this.reset();
}

function Box()
{
    this.reset = function(){
        this.pos = [10000, 10000]; // clear the heck
        this.speed = 25.0;
        this.velocity = [(Math.random() * 2.0 - 1.0) / 30, (Math.random() * 2.0 - 1.0) / 30];
        this.acceleration = [(Math.random() * 2.0 - 1.0) / 30, (Math.random() * 2.0 - 1.0) / 30];
        this.color = [1,1,1,1];
    }

    this.updateColor = function(){
        this.color[0] = this.color[0] + 0.00;
        this.color[1] = this.color[1] + 0.00;
        this.color[2] = this.color[2] + 0.00;
    }

    this.move = function(){
        this.velocity[0] -= this.acceleration[0];
        this.pos[0] += this.velocity[0] * this.speed * delta;

        this.velocity[1] -= this.acceleration[1];
        this.pos[1] += this.velocity[1] * this.speed * delta;
    }

    this.reset();
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

        itemPoints[boxI] = box.pos[0];
        itemPoints[boxI+1] = box.pos[1];
        boxI += 2;

        box.move();
        box.updateColor();
    }

    var emitter;
    for (var e=0; e<emitters.length; e++) //boxes.length
    {
        emitter = emitters[e];

        itemPoints[boxI] = emitter.pos[0];
        itemPoints[boxI+1] = emitter.pos[1];
        boxI += 2;

        emitter.move();
    }

    // Set color
    gl.uniform4f(gl.getUniformLocation(program, "u_color"),
            box.color[0], box.color[1], 
            box.color[2], box.color[3]);

    // Draw the points
    gl.bufferData(gl.ARRAY_BUFFER, itemPoints, gl.STATIC_DRAW); 
    gl.drawArrays(gl.POINTS, 0, boxes.length + emitters.length); //# total points

    pointSize = gl.getUniformLocation(program, "u_pointSize");
    gl.uniform1f(pointSize, settings.pointSize);

    window.requestAnimationFrame(animate);
}

})();
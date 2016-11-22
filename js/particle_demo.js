
(function(){

var canvas, gl, program;
canvas = document.getElementById('canvas');

var resolution;

// Emitter
var emitters = [];
var EMITTER_COUNT = 4000;

// particles
var particles = [];
var particle_COUNT = 1;
var particle_GROUPS_COUNT = 1;
var NUM_OF_particles_PER_GROUP = particle_COUNT / particle_GROUPS_COUNT;

var itemPoints = new Float32Array((particle_COUNT + EMITTER_COUNT)*2); // each particle takes two spots

var mouseX = 0;
var mouseY = 0;
var canvasrect;

load_scene();
load_particles();
load_emitters();

var current = Date.now();
var previous;
var delta = 0;

animate();

console.log('Started..');

var count = 0;
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

function load_particles(){
    for (var x=0; x<particle_COUNT; x++)
    {
        particles.push(new particle());
    }
}

function load_emitters(){
    for (var x=0; x<EMITTER_COUNT; x++)
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
    
        var particleStart = NUM_OF_particles_PER_GROUP * count;
        var particleEnd = particleStart + NUM_OF_particles_PER_GROUP;
        count ++;
        if (count >= particle_GROUPS_COUNT) {
            count = 0;
        }
        for (var b=particleStart; b<particleEnd; b++) {
            particle = particles[b];
            particle.reset();
            particle.pos[0] = this.pos[0];
            particle.pos[1] = this.pos[1];
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

function particle()
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

    var particle;
    particleI = 0;
    for (var b=0; b<particles.length; b++) //particles.length
    {
        particle = particles[b];

        itemPoints[particleI] = particle.pos[0];
        itemPoints[particleI+1] = particle.pos[1];
        particleI += 2;

        particle.move();
        particle.updateColor();
    }

    var emitter;
    for (var e=0; e<emitters.length; e++) //particles.length
    {
        emitter = emitters[e];

        itemPoints[particleI] = emitter.pos[0];
        itemPoints[particleI+1] = emitter.pos[1];
        particleI += 2;

        emitter.move();
    }

    // Set color
    gl.uniform4f(gl.getUniformLocation(program, "u_color"),
            particle.color[0], particle.color[1], 
            particle.color[2], particle.color[3]);

    // Draw the points
    gl.bufferData(gl.ARRAY_BUFFER, itemPoints, gl.STATIC_DRAW); 
    gl.drawArrays(gl.POINTS, 0, particles.length + emitters.length); //# total points

    window.requestAnimationFrame(animate);
}

})();

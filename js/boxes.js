(function(){

var canvas, gl, program;

var s_width = 1000;
var s_height = 1000;


var boxes = [];
for (var x=0; x<500; x++)
{
    var newBox = new box();
    boxes.push(newBox);
}


console.log('Started..');

main();

function main(){
    // create a webgl context
	canvas = document.getElementById('canvas');
	gl = canvas.getContext('webgl');

	if (!gl){
		alert('No WebGL support!');
	}

    //this function is called during resizes
    window.onresize = function(){
        canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth - 200;
        //canvas.width;
        canvas.height = window.innerHeight / 2;
        gl.viewport(0, 0, canvas.width, canvas.height);

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

    gl.enableVertexAttribArray(positionAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0); 

    gl.useProgram(program); //saves on performance: do here instead of before draw

    // Set a random color.

        // set the resolution
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);


    animate();

}

function box(){
    canvas = document.getElementById('canvas');
    this.pos = [(canvas.width / 2) + 50, canvas.height / 2];
    this.height = 10;
    this.width = 10;
    this.speed = 2.0;
    this.velocity = [Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0];
    this.color = [Math.random(), Math.random(), Math.random(), 0.7];

    this.points = new Float32Array([this.pos[0], this.pos[1],
                                    this.pos[0], this.pos[1]+this.height,
                                    this.pos[0]+this.width, this.pos[1]+this.height,
                                    this.pos[0]+this.width, this.pos[1]])

    this.updatePoints = function(){
        this.points[0] = this.pos[0];
        this.points[1] = this.pos[1];

        this.points[2] = this.pos[0];
        this.points[3] = this.pos[1]+this.height;

        this.points[4] = this.pos[0]+this.width;
        this.points[5] = this.pos[1]+this.height;

        this.points[6] = this.pos[0]+this.width;
        this.points[7] = this.pos[1];
    }

    this.move = function(){
        this.pos[0] += this.velocity[0] * this.speed;
        if ( (this.pos[0]+this.width > canvas.width / 2) || (this.pos[0] < 0) ){
            this.velocity[0] *= -1;
        }
        this.pos[1] += this.velocity[1] * this.speed;
        if ( (this.pos[1]+this.height > canvas.height / 2) || (this.pos[1] < 0) ){
            this.velocity[1] *= -1;
        }
        this.updatePoints();
    }
}

function animate(){

    for (var b=0; b<boxes.length; b++)
    {
        var box = boxes[b];

        gl.bufferData(gl.ARRAY_BUFFER, box.points, gl.STATIC_DRAW); //can't pass it a js array, we gotta change it.

        var colorLocation = gl.getUniformLocation(program, "u_color");
        gl.uniform4f(colorLocation, box.color[0], box.color[1], 
                                    box.color[2], box.color[3]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4) //4 total arrays

        box.move();
    }

    window.requestAnimationFrame(animate);
}


})();
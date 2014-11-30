(function(){

var canvas, gl, program;


var boxes = [];
for (var x=0; x<2000; x++)
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

    canvas.width = 800;
    canvas.height = 450;
    gl.viewport(0, 0, canvas.width, canvas.height);




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
    this.pos = [200,110];
    this.height = 10;
    this.width = 10;
    this.speed = 0.9;
    this.velocity = [Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0];
    this.color = [Math.random(), Math.random(), Math.random(), 1];

    this.getPoints = function(){
        var points = [this.pos[0], this.pos[1],
                        this.pos[0], this.pos[1]+this.height,
                        this.pos[0]+this.width, this.pos[1]+this.height,
                        this.pos[0]+this.width, this.pos[1]]
        return points;
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
    }
}

function animate(){

    for (var b=0; b<boxes.length; b++)
    {
        var box = boxes[b];
        var p = box.getPoints();

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( //converts it to a c array
            [p[0], p[1],
             p[2], p[3],
             p[4], p[5],
             p[6], p[7]]), gl.STATIC_DRAW); //can't pass it a js array, we gotta change it.

        var colorLocation = gl.getUniformLocation(program, "u_color");
        gl.uniform4f(colorLocation, box.color[0], box.color[1], 
                                    box.color[2], box.color[3]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4) //4 total arrays

        box.move();
    }

    window.requestAnimationFrame(animate);
}


})();
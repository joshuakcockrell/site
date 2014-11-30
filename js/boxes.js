(function(){

var canvas, gl, program;

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

    program = initProgram();
    animate();

}

function initProgram(){
	var program = makeProgram('vertex-shader', 'fragment-shader');

    var positionAttrib = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( //converts it to a c array
        [100, 100,
         100, 200,
         200, 200,
         200, 100]), gl.STATIC_DRAW); //can't pass it a js array, we gotta change it.

    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0); 

    gl.useProgram(program); //saves on performance: do here instead of before draw

    var colorLocation = gl.getUniformLocation(program, "u_color");
    // Set a random color.
    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

    function draw(){
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4) //4 total arrays

        // set the resolution
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    }

	return{
        draw: function(){
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4) //4 total arrays

            // set the resolution
            var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        }
	}
}

function animate(){
    program.draw();
    window.requestAnimationFrame(animate);
}

function makeProgram(vertexShaderID, fragmentShaderID){
    function checkShader(shader){
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.log(gl.getShaderInfoLog(shader));
        }
    }

	var program = gl.createProgram();

    // set up the vertex shader
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, document.getElementById(vertexShaderID).innerHTML);
    gl.compileShader(vertexShader);
    checkShader(vertexShader);
    gl.attachShader(program, vertexShader);

    // set up the frag shaderz
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, 
        document.getElementById(fragmentShaderID).innerHTML);
    gl.compileShader(fragmentShader);
    checkShader(fragmentShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program); //makes it active
    return program;
}




})();
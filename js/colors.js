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

    //this function is called during resizes
	window.onresize = function(){
        canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight - canvas.getBoundingClientRect().top;

		gl.viewport(0, 0, canvas.width, canvas.height);

	}
	window.onresize();
    program = initProgram();
    animate();
}

function initProgram(){
	var program = makeProgram('vertex-shader', 'fragment-shader');

    var positionAttrib = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( //converts it to a c array
        [0, 0,
         0, 1,
         1, 1,
         1, 0]), gl.STATIC_DRAW); //can't pass it a js array, we gotta change it.

    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0); //2 per component

    gl.useProgram(program); //saves on performance: do here instead of before draw


    var startTime = Date.now();
    var uniformTime = gl.getUniformLocation(program, 'u_time');


	return{
        draw: function(){
            gl.uniform1f(uniformTime, (Date.now() - startTime) / 1000);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4) //4 total arrays
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

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, document.getElementById(vertexShaderID).innerHTML);
    gl.compileShader(vertexShader);
    checkShader(vertexShader);
    gl.attachShader(program, vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, document.getElementById(fragmentShaderID).innerHTML);
    gl.compileShader(fragmentShader);
    checkShader(fragmentShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program); //makes it active
    return program;
}




})();
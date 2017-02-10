/**
 * Created by Eternity on 2016/12/29.
 */
var vertexShaderText= [
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    '',
    'void main()',
    '{',
    'fragColor = vertColor;',
    'gl_Position = mProj * mView * mWorld * vec4 (vertPosition, 1.0);',
    '}'
].join('\n');
var fragmentShaderText= [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    'gl_FragColor = vec4 (fragColor, 1);',
    '}'
].join('\n');

var initDemo= function () {
    //console.log("this is working");
    var canvas =document.getElementById("webgl");
    var gl =canvas.getContext("webgl");
    if(!gl)
    {
        console.log("WebGl not Supported, using experimental-webGl")
        gl =canvas.getContext("experimental-webgl");
    }
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    gl.clearColor(0.75,0.85,0.8,1.0);//setUp Color
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);//绘制背景颜色
    //console.log(gl.COLOR_BUFFER_BIT,gl.DEPTH_BUFFER_BIT,gl.STENCIL_BUFFER_BIT)
    var vertexShader =gl.createShader(gl.VERTEX_SHADER);//顶点着色器创建
    var fragmentShader =gl.createShader(gl.FRAGMENT_SHADER);//碎片着色器创建

    gl.shaderSource(vertexShader,vertexShaderText);//赋值顶点着色器
    gl.shaderSource(fragmentShader,fragmentShaderText);//赋值碎片着色器

    gl.compileShader(vertexShader);//编译上面的两个OPenGL函数
    if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){//WebGl 调错方法
        console.log("ERROR conmpiling Vertex Shader",gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);//编译上面的两个OPenGL函数
    if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
        console.log("ERROR conmpiling Fragment Shader",gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program =gl.createProgram();//创建一个控制显卡的程序
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);//链接
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
        console.error("ERROR Linking Program",gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)){
        console.error('ERROR validating program',gl.getProgramInfoLog(program));
        return;
    }

    //create Buffer
    //
    var triangleVertics =[//在CPU上创建一个三角形顶点数组，存在内存中
        //x,y,z       R  G   B
        0.1, 0.6,0.0,  0.0, 0.5, 0.9,
        -0.4,-0.4,0.0, 1.0, 0.0, 0.2,
        0.6,-0.4,0.0,  0.7, 1.0, 0.9
    ];
    var triangleVerticsBufferObject =gl.createBuffer();//创建bufferObject
    gl.bindBuffer(gl.ARRAY_BUFFER,triangleVerticsBufferObject);
    //binder Buffer,Buffer的种类为ARRAY_BUFFER
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertics),gl.STATIC_DRAW);
    //transfer buffer from CUP to GPU

    var positionAttributeLocation = gl.getAttribLocation(program, "vertPosition");
    var colorAttributeLocation = gl.getAttribLocation(program, "vertColor");
    gl.vertexAttribPointer(
        positionAttributeLocation,//Attrubute Location
        3,//Number of Elements per Attribute  ->vec3
        gl.FLOAT,//type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,// size of an individual vertex //一个顶点的字节大小
        0//offset from beginning of a single vertex to this attibute
        // 数组开始的offset，指的是从数组第几位开始读写
    );


    
    gl.vertexAttribPointer(
        colorAttributeLocation,//Attrubute Location
        3,//Number of Elements per Attribute  ->vec3
        gl.FLOAT,//type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,// size of an individual vertex //一个顶点的参数的字节大小
        3 * Float32Array.BYTES_PER_ELEMENT//offset from beginning of a single vertex to this attibute
        // 数组开始的offset，指的是从数组第几位开始读写
    );

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);


    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program,'mWorld');
    var matViewUniformLoacation = gl.getUniformLocation(program,'mView');
    var matPorjUniformLocation = gl.getUniformLocation(program,'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix,[0,0,-3],[0,0,0],[0,1,0]);
    mat4.perspective(projMatrix,glMatrix.toRadian(45),canvas.width/canvas.height,0.1,1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLoacation,gl.FALSE,viewMatrix);
    gl.uniformMatrix4fv(matPorjUniformLocation,gl.FALSE,projMatrix);
    var identity = mat4.create();

    var angle =0;
    var loop=function () {
        angle = performance.now()/1000/6*2*Math.PI;

        mat4.rotate(worldMatrix,identity,angle,[0,1,0]);



        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.clearColor(0.75,0.85,0.8,1.0);//setUp Color
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);//绘制背景颜色

        gl.drawArrays(gl.TRIANGLES,0,3);
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

}

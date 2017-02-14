/**
 * Created by Eternity on 2016/12/29.
 */
var vertexShaderText = [
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
    'gl_PointSize = 10.0;',
    '}'
].join('\n');
var fragmentShaderText = [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    'gl_FragColor = vec4 (fragColor, 1);',
    '}'
].join('\n');

var initGl = function () {
    var canvas = document.getElementById("webgl");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        console.log("WebGl not Supported, using experimental-webGl")
        gl = canvas.getContext("experimental-webgl");
    }
    //上面是获取webGl的context



    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;


    //绘制背景颜色1111
    gl.clearColor(0.75, 0.85, 0.8, 1.0);//setUp Color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);


    //console.log(gl.COLOR_BUFFER_BIT,gl.DEPTH_BUFFER_BIT,gl.STENCIL_BUFFER_BIT)
    // 创建shader shader 一般就是vertex 和 fragment
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);//顶点着色器创建
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);//碎片着色器创建
    //shader的赋值，
    gl.shaderSource(vertexShader, vertexShaderText);//赋值顶点着色器
    gl.shaderSource(fragmentShader, fragmentShaderText);//赋值碎片着色器

    //编译
    gl.compileShader(vertexShader);//编译上面的两个OPenGL函数
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {//WebGl 调错方法
        console.log("ERROR conmpiling Vertex Shader", gl.getShaderInfoLog(vertexShader));
    }
    gl.compileShader(fragmentShader);//编译上面的两个OPenGL函数
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log("ERROR conmpiling Fragment Shader", gl.getShaderInfoLog(fragmentShader));
    }

    //创建一个控制显卡的程序 创建显卡程序
    var program = gl.createProgram();

    //attach shader 也就是将program 和shader 之间建立联系
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //链接 program
    gl.linkProgram(program);//链接
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR Linking Program", gl.getProgramInfoLog(program));
    }
    //验证 program
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program', gl.getProgramInfoLog(program));
    }
    //验证通过 使用program
    gl.useProgram(program);
    return {
        gl: gl,
        program: program,
        canvas: canvas
    }
};


var initDemo = function () {
    //console.log("this is working");
    var webglInit = initGl();
    var gl = webglInit.gl;
    var program = webglInit.program;
    var canvas = webglInit.canvas;

    //create Buffer
    //
    var boxVertices =
        [ // X, Y, Z           R, G, B
            // Top
            -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
            -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
            1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
            1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

            // Left
            -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
            -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
            -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
            -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

            // Right
            1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
            1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
            1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
            1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

            // Front
            1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
            1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
            -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

            // Back
            1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
            1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
            -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
            -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

            // Bottom
            -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
            -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
            1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
            1.0, -1.0, -1.0,    0.5, 0.5, 1.0
        ];
    var buffer = gl.createBuffer();//创建bufferObject
    // webGl buffer 的东西在这

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    //gl.ARRAY_BUFFER
    //binder Buffer,Buffer的种类为ARRAY_BUFFER 或 ELEMENT_ARRAY_BUFFER
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
    //transfer buffer from CUP to GPU


    var boxIndices =
        [
            // Top
            0, 1, 2,
            0, 2, 3,

            // Left
            5, 4, 6,
            6, 4, 7,

            // Right
            8, 9, 10,
            8, 10, 11,

            // Front
            13, 12, 14,
            15, 14, 12,

            // Back
            16, 17, 18,
            16, 18, 19,

            // Bottom
            21, 20, 22,
            22, 20, 23
        ];
    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);


    var positionAttributeLocation = gl.getAttribLocation(program, "vertPosition");
    var colorAttributeLocation = gl.getAttribLocation(program, "vertColor");

    gl.vertexAttribPointer(
        positionAttributeLocation,//Attrubute Location
        3,//Number of Elements per Attribute  ->vec3
        gl.FLOAT,//type of elements
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,// size of an individual vertex //一个顶点的字节大小
        0//offset from beginning of a single vertex to this attibute
        // 数组开始的offset，指的是从数组第几位开始读写
    );


    gl.vertexAttribPointer(
        colorAttributeLocation,//Attrubute Location
        3,//Number of Elements per Attribute  ->vec3
        gl.FLOAT,//type of elements
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,// size of an individual vertex //一个顶点的参数的字节大小
        3 * Float32Array.BYTES_PER_ELEMENT//offset from beginning of a single vertex to this attibute
        // 数组开始的offset，指的是从数组第几位开始读写
    );
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');//从program中读出 Uniform在program中的地址
    var matViewUniformLoacation = gl.getUniformLocation(program, 'mView'); //返回一个 webGlUniform的对象，对象用于 gl.uniformMatrix4fv 或者gl.uniformVec3
    var matPorjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLoacation, false, viewMatrix);
    gl.uniformMatrix4fv(matPorjUniformLocation, false, projMatrix);

    var identity = mat4.create();

    var angle = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(worldMatrix, identity, angle, [0, 1, 1]);
       // gl.viewport(0,0,canvas.width/2,canvas.height*2);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.clearColor(0.75, 0.85, 0.8, 1.0);//setUp Color
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//绘制背景颜色

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT,0);
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

}

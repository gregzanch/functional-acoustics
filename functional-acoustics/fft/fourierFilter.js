var canvasImageName = "//www.ejectamenta.com/uploads/images/lena-colour.png";
var original_Image, image_Transform;
var canvas_Transform, ctx_Transform, canvas_Real, ctx_Real, canvas_Display_Transform, ctx_Display_Transform, canvas_Display_Real, ctx_Display_Real, canvas_Drawing, ctx_Drawing;
var reader = new FileReader();
var gStartPoint = {
        "x": -1,
        "y": -1
    },
    g_OffsetX, g_OffsetY, g_FFTImageArray;
var toolType = "circle",
    gStrokeSize = -1,
    gEndAngle = 360,
    gStartAngle = 0,
    gInverse = false,
    gStrokeColour = "#000";
var drawingObject_Transform_Array = [],
    drawingObject_Real_Array = [];
var drawingObject_Transform = {
    "type": -1,
    "x1": -1,
    "y1": -1,
    "x2": -1,
    "y2": -1,
    "width": -1
};
var drawingObject_Real = {
    "type": -1,
    "x1": -1,
    "y1": -1,
    "x2": -1,
    "y2": -1,
    "width": -1
};
var MouseDown = false;
var worker = null;
var isWorkerSupported = false;
var debug = true;
var bStart = true;

$(document).ready(function () {
    $("#iFFT_Button").click(function () {
        DOIFFT();
    });

    $("#FFT_Button").click(function () {
        DOFFT();
    });

    $("#colorpicker").spectrum({
        color: "#000",
        change: function (color) {
            gStrokeColour = color.toHexString();
        }
    });

    // must create offline canvas_real at image size and canvas Transform at image size, then have display canvases that get offline canvas data copied to them and displayed
    canvas_Real = document.createElement('canvas'),
        ctx_Real = canvas_Real.getContext('2d');

    canvas_Transform = document.createElement('canvas'),
        ctx_Transform = canvas_Transform.getContext('2d');

    // canvas for fourier space image       
    canvas_Display_Transform = document.getElementById('canvasTransform');
    ctx_Display_Transform = canvas_Display_Transform.getContext("2d");

    // canvas for real space image
    canvas_Display_Real = document.getElementById('canvasReal');
    ctx_Display_Real = canvas_Display_Real.getContext("2d");

    // Temporary canvas for drawing on
    canvas_Drawing = document.createElement('canvas'),
        ctx_Drawing = canvas_Drawing.getContext('2d');

    SetupMouseEvents();

    // Make sure you have enough room on your new canvas

    imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

    ctx_Transform.lineWidth = gStrokeSize = parseInt($('#sliderTool').attr("value"));
    gStartAngle = parseInt($('#startAngle').attr("value"));
    gEndAngle = parseInt($('#endAngle').attr("value"));

    $("#sizeSliderLabel").html('Line Width <span style="color:red">' + gStrokeSize + "px</span>");
    $("#arcStartLabel").html('Arc Start Angle <span style="color:red">' + gStartAngle + "&deg;</span>");
    $("#arcEndLabel").html('Arc End Angle <span style="color:red">' + gEndAngle + "&deg;</span>");

    original_Image = new Image;
    original_Image.src = canvasImageName;

    setupWorker();

    //document.getElementById('OriginalImage').src = canvasImageName;

    $("#loading").html("loading");

    original_Image.onload = function () {
        // set transform and temp canvas to width/height of image
        canvas_Transform.width = canvas_Real.width = canvas_Drawing.width = canvas_Display_Transform.width = canvas_Display_Real.width = this.width;
        canvas_Transform.height = canvas_Real.height = canvas_Drawing.height = canvas_Display_Transform.height = canvas_Display_Real.height = this.height;

        // draw image on real canvas
        ctx_Real.drawImage(this, 0, 0);
        ctx_Display_Real.drawImage(this, 0, 0);

        var imageData = ctx_Real.getImageData(0, 0, canvas_Real.width, canvas_Real.height);

        CanvasSizeChanged();

        $("#loading").html("performing FFT");

        // get FFT of image
        setTimeout(function (im) {
            processImage()
        }, 0);
    };

    window.onresize = CanvasSizeChanged;
});

function DOFFT() {
    // get FFT of image
    setTimeout(function (im) {
        processImage()
    }, 0);
}

function DOIFFT() {


    // ensure only transform drawing used in masking
    drawObjects(drawingObject_Transform_Array, drawingObject_Transform, canvas_Display_Transform, ctx_Display_Transform, canvas_Transform, ctx_Transform, false);

    if (isWorkerSupported) {
        var w = canvas_Drawing.width;
        var h = canvas_Drawing.height;

        // get pixels of ctx_Drawing
        var drawingData = ctx_Drawing.getImageData(0, 0, canvas_Drawing.width, canvas_Drawing.height);
        var transformData = ctx_Transform.getImageData(0, 0, canvas_Transform.width, canvas_Transform.height);

        worker.postMessage({
            'cmd': 'iFFT',
            "drawingImage": {
                'data': drawingData
            },
            "transformImage": {
                'data': transformData
            }
        });
    } else {
        setTimeout(function () {
            performIFFT()
        }, 0);
    }
}

function setupWorker() {
    // set up worker
    if (typeof (Worker) !== "undefined") {
        worker = new Worker('../js-libs/FourierWorker.js');

        if (worker != null) {
            // gets data back from worker
            worker.addEventListener('message', function (e) {
                switch (e.data.cmd) {
                    case 'putFFT':
                        ctx_Transform.putImageData(e.data.image.data, 0, 0);

                        //DrawCentered(ctx_Real, e.data.image.width, e.data.image.height, canvas_Temp);

                        // draw drawing objects
                        DrawEverything(false, false);

                        break;
                    case 'putIFFT':

                        scaleColourImage(e.data.image.data, w, h);

                        ctx_Real.putImageData(e.data.image.data, 0, 0);

                        size = canvas_Display_Real.parentNode.parentNode.clientWidth;

                        drawImageToSize(canvas_Display_Real, ctx_Display_Real, canvas_Real, ctx_Real, (size / 2 - size / 10));

                        // draw drawing objects
                        DrawEverything(false, false);

                        $("#loading").html("");

                        break;
                    case 'log':
                        if (debug) {
                            console.log(e.data.msg);
                        }
                        break;
                    default:
                        if (debug) {
                            console.log("unhandled message " + JSON.stringify(e));
                        }
                }
            }, false);

            isWorkerSupported = false;
        }
    } else {
        isWorkerSupported = false;
    }

    if (isWorkerSupported)
        if (debug) {
            console.log("using web workers");
        } else if (debug) {
        console.log("not using web workers")
    }
}

function scaleColourImage(im, w, h) {
    var maxVal = minVal = im[0];

    for (i = 0; i < w; i++) {
        for (j = 0; j < h; j++) {
            k = i * 4 + j * (w * 4);

            val = im[k] + im[k + 1] + im[k + 2];
            minVal = Math.min(minVal, Math.min(im[k + 2], Math.min(im[k + 1], im[k])));
            maxVal = Math.max(maxVal, Math.max(im[k + 2], Math.max(im[k + 1], im[k])));
        }
    }

    for (i = 0; i < w; i++) {
        for (j = 0; j < h; j++) {
            k = i * 4 + j * (w * 4);

            im[k] = 255 * (im[k] - minVal) / (maxVal - minVal)
            im[k + 1] = 255 * (im[k + 1] - minVal) / (maxVal - minVal)
            im[k + 2] = 255 * (im[k + 2] - minVal) / (maxVal - minVal)
        }
    }
}

function getCursorPosition(e, obj) {
    // canvas client rect takes into account scrolling as relative to client 
    var rect = obj.getBoundingClientRect();

    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    x *= obj.width / rect.width;
    y *= obj.height / rect.height;

    x = Math.min(obj.width, Math.max(0, x));
    y = Math.min(obj.height, Math.max(0, y));

    return {
        "x": x,
        "y": y
    }
}

function SetupMouseEvents() {
    canvas_Display_Transform.addEventListener('mousemove', onMouseMove.bind(canvas_Display_Transform, false), false);
    canvas_Display_Transform.addEventListener('mouseup', onMouseUp.bind(canvas_Display_Transform, false), false);
    canvas_Display_Transform.addEventListener('mousedown', onMouseDown.bind(canvas_Display_Transform, false), false);
    canvas_Display_Transform.addEventListener('mouseout', onMouseOut.bind(canvas_Display_Transform, false), false);

    //document.addEventListener('keydown', onKeyDown,true);

    var touchable = 'createTouch' in document;

    if (touchable) {
        canvas_Display_Transform.addEventListener('touchstart', onMouseDown.bind(canvas_Display_Transform, false), false);
        canvas_Display_Transform.addEventListener('touchmove', onMouseMove.bind(canvas_Display_Transform, false), false);
        canvas_Display_Transform.addEventListener('touchend', onMouseUp.bind(canvas_Display_Transform, false), false);
        canvas_Display_Transform.addEventListener('touchout', onMouseOut.bind(canvas_Display_Transform, false), false);
    }

    canvas_Display_Real.addEventListener('mousemove', onMouseMove.bind(canvas_Display_Real, true), false);
    canvas_Display_Real.addEventListener('mouseup', onMouseUp.bind(canvas_Display_Real, true), false);
    canvas_Display_Real.addEventListener('mousedown', onMouseDown.bind(canvas_Display_Real, true), false);
    canvas_Display_Real.addEventListener('mouseout', onMouseOut.bind(canvas_Display_Real, true), false);
    //document.addEventListener('keydown', onKeyDown,true);

    var touchable = 'createTouch' in document;

    if (touchable) {
        canvas_Display_Real.addEventListener('touchstart', onMouseDown.bind(canvas_Display_Real, true), false);
        canvas_Display_Real.addEventListener('touchmove', onMouseMove.bind(canvas_Display_Real, true), false);
        canvas_Display_Real.addEventListener('touchend', onMouseUp.bind(canvas_Display_Real, true), false);
        canvas_Display_Real.addEventListener('touchout', onMouseOut.bind(canvas_Display_Real, true), false);
    }
}

function onMouseDown(isReal, e) {
    e.preventDefault();

    var currentPoint = getCursorPosition(e.touches ? e.touches[0] : e, this);

    if (currentPoint.x > 0 && currentPoint.y > 0 && currentPoint.x < this.width && currentPoint.y < this.height) {
        MouseDown = true;

        if (isReal) {
            drawingObject_Real = {
                "type": toolType,
                "x1": currentPoint.x,
                "y1": currentPoint.y,
                "x2": -1,
                "y2": -1,
                "width": gStrokeSize,
                "colour": gStrokeColour,
                "inverse": gInverse,
                "startangle": gStartAngle,
                "endangle": gEndAngle
            };
        } else {
            drawingObject_Transform = {
                "type": toolType,
                "x1": currentPoint.x,
                "y1": currentPoint.y,
                "x2": -1,
                "y2": -1,
                "width": gStrokeSize,
                "colour": gStrokeColour,
                "inverse": gInverse,
                "startangle": gStartAngle,
                "endangle": gEndAngle
            };
        }

    }
}

function onMouseMove(isReal, e) {
    e.preventDefault();

    var currentPoint = getCursorPosition(e.touches ? e.touches[0] : e, this);

    if (MouseDown) {
        if (isReal) {
            drawingObject_Real.x2 = currentPoint.x;
            drawingObject_Real.y2 = currentPoint.y;
        } else {
            drawingObject_Transform.x2 = currentPoint.x;
            drawingObject_Transform.y2 = currentPoint.y;
        }

        DrawEverything(false, true);
    }
}

function onMouseUp(isReal, e) {
    e.preventDefault();

    var currentPoint = getCursorPosition(e.touches ? e.touches[0] : e, this);

    if (isReal) {
        drawingObject_Real.x2 = currentPoint.x;
        drawingObject_Real.y2 = currentPoint.y;

        drawingObject_Real_Array.unshift(drawingObject_Real);
    } else {
        drawingObject_Transform.x2 = currentPoint.x;
        drawingObject_Transform.y2 = currentPoint.y;

        drawingObject_Transform_Array.unshift(drawingObject_Transform);
    }

    DrawEverything(false, false);

    if (isReal)
        drawingObject_Real = {
            "type": toolType,
            "x1": -1,
            "y1": -1,
            "x2": -1,
            "y2": -1,
            "width": gStrokeSize,
            "colour": gStrokeColour,
            "inverse": gInverse,
            "startangle": gStartAngle,
            "endangle": gEndAngle
        };
    else
        drawingObject_Transform = {
            "type": toolType,
            "x1": -1,
            "y1": -1,
            "x2": -1,
            "y2": -1,
            "width": gStrokeSize,
            "colour": gStrokeColour,
            "inverse": gInverse,
            "startangle": gStartAngle,
            "endangle": gEndAngle
        };

    MouseDown = false;
}

function onMouseOut(isReal, e) {
    if (MouseDown) {
        e.preventDefault();

        if (isReal)
            drawingObject_Real_Array.unshift(drawingObject_Real);
        else
            drawingObject_Transform_Array.unshift(drawingObject_Transform);

        DrawEverything(false, false);

        if (isReal)
            drawingObject_Real = {
                "type": toolType,
                "x1": -1,
                "y1": -1,
                "x2": -1,
                "y2": -1,
                "width": gStrokeSize,
                "colour": gStrokeColour,
                "inverse": gInverse,
                "startangle": gStartAngle,
                "endangle": gEndAngle
            };
        else
            drawingObject_Transform = {
                "type": toolType,
                "x1": -1,
                "y1": -1,
                "x2": -1,
                "y2": -1,
                "width": gStrokeSize,
                "colour": gStrokeColour,
                "inverse": gInverse,
                "startangle": gStartAngle,
                "endangle": gEndAngle
            };
    }
    MouseDown = false;
}

function DrawEverything(resize, moving) {
    if (resize && canvas_Real.width)
        drawImageToSizes();

    drawObjects(drawingObject_Transform_Array, drawingObject_Transform, canvas_Display_Transform, ctx_Display_Transform, canvas_Transform, ctx_Transform, moving);
    drawObjects(drawingObject_Real_Array, drawingObject_Real, canvas_Display_Real, ctx_Display_Real, canvas_Real, ctx_Real, moving);
}

function drawObjects(drawingArray, currentDrawingObject, canD, ctxD, canR, ctxR, move) {
    if (ctxD) {
        ctx_Drawing.clearRect(0, 0, canvas_Drawing.width, canvas_Drawing.height);

        // draw backup image to canvas
        drawImageToSize(canD, ctxD, canR, ctxR, canD.width);

        for (i = drawingArray.length - 1; i >= 0; i--)
            drawObject(drawingArray[i], ctx_Drawing);

        if (move)
            drawObject(currentDrawingObject, ctx_Drawing);

        // draw real drawing objects
        ctxD.drawImage(canvas_Drawing, 0, 0);
    }
}

function resetDrawing() {
    var drawingObject_Transform = {
        "type": -1,
        "x1": -1,
        "y1": -1,
        "x2": -1,
        "y2": -1,
        "width": -1
    };
    var drawingObject_Real = {
        "type": -1,
        "x1": -1,
        "y1": -1,
        "x2": -1,
        "y2": -1,
        "width": -1
    };

    drawingObject_Transform_Array = [],
        drawingObject_Real_Array = [];
}

function deleteObjects() {
    resetDrawing()

    // draw drawing objects
    DrawEverything(false, false);

}

function fillBlack() {
    drawingObject_Transform_Array.length = 0;
    drawingObject_Transform_Array.push({
        "type": "rectangle",
        "x1": 0,
        "y1": 0,
        "x2": canvas_Drawing.width,
        "y2": canvas_Drawing.height,
        "width": gStrokeSize,
        "colour": gStrokeColour,
        "inverse": false,
        "startangle": -1,
        "endangle": -1
    });

    DrawEverything(false, false);
}

function drawObject(object, ctx_Drawing) {
    ctx_Drawing.save()
    ctx_Drawing.lineWidth = object.width;

    ctx_Drawing.fillStyle = object.colour;
    ctx_Drawing.strokeStyle = object.colour;

    if (object.inverse) {
        ctx_Drawing.fillStyle = "rgba(0,0,0,1)";
        ctx_Drawing.strokeStyle = "rgba(0,0,0,1)";

        ctx_Drawing.globalCompositeOperation = 'destination-out';
    }
    switch (object.type) {
        case "circle":
            var dx = object.x1 - object.x2;
            var dy = object.y1 - object.y2;

            ctx_Drawing.beginPath();
            ctx_Drawing.moveTo(object.x1, object.y1);
            //ctx_Transform.lineTo(object.x2,object.y2);
            ctx_Drawing.arc(object.x1, object.y1, Math.sqrt(dx * dx + dy * dy), object.startangle * Math.PI / 180, object.endangle * Math.PI / 180);
            ctx_Drawing.lineTo(object.x1, object.y1);
            ctx_Drawing.fill();
            break;
        case "line":
            ctx_Drawing.beginPath();
            ctx_Drawing.moveTo(object.x1, object.y1);
            ctx_Drawing.lineTo(object.x2, object.y2);
            ctx_Drawing.stroke();
            break;
        case "rectangle":
            ctx_Drawing.fillRect(object.x1, object.y1, object.x2 - object.x1, object.y2 - object.y1);
            break;
    }
    ctx_Drawing.restore();
}

function CanvasSizeChanged() {
    drawImageToSizes();

    //DrawEverything(false, true); 
    var can = document.getElementById('puzzle-canvas');

    if (can) {
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        can.style.marginLeft = ((w - can.offsetWidth) / 2).toString() + "px";
        can.style.marginTop = ((h - can.offsetHeight) / 2).toString() + "px";
        //can.style.height = h+"px";
    }
}

function drawImageToSizes() {
    var size;
    if (canvas_Transform) {
        size = canvas_Display_Real.parentNode.parentNode.clientWidth;

        size = (size / 2 - size / 10);

        drawImageToSize(canvas_Display_Real, ctx_Display_Real, canvas_Real, ctx_Real, size);

        drawImageToSize(canvas_Display_Transform, ctx_Display_Transform, canvas_Transform, ctx_Transform, size);

        var ratio = canvas_Real.height / canvas_Real.width

        canvas_Drawing.width = size;
        canvas_Drawing.height = size * ratio;

        DrawEverything(false, false);
    }
}

function drawImageToSize(can_display, ctx_display, can, ctx, w) {
    var ratio = can.height / can.width

    can_display.width = w;
    can_display.height = w * ratio;

    ctx_display.drawImage(can, 0, 0, can.width, can.height, 0, 0, can_display.width, can_display.height);
}

function handleImage(e) {
    $("#loading").html("loading");
    reader.onload = function (e) {
        // set canvas image as loaded image

        original_Image.src = e.target.result;

        //document.getElementById('OriginalImage').src = e.target.result;
        $("#loading").html("");
    }

    if (e.target.files[0] != undefined)
        reader.readAsDataURL(e.target.files[0]);
}
/*
function DrawCentered(drawingContext, width, height, rcan)
{
	var scale, scaledHeight, scaledWidth, offsetx, offsety, aspectRatio = rcan.width/rcan.height;

	// see which is the image's biggest dimension
	if(rcan.width>rcan.height)
	{
		scale = width/rcan.width;
		scaledHeight = scale*rcan.height;
		
		offsetx = 0;
		offsety = (height-scaledHeight)/2.0
		scaledWidth = width;
	}
	else
	{
		scale = height/rcan.height;
		scaledWidth = scale*rcan.width;
		
		offsety = 0;
		offsetx = (width-scaledWidth)/2.0
		scaledHeight = height;
	}
	
	drawingContext.fillRect(0,0,width,height);
	
	drawingContext.drawImage(rcan, offsetx,offsety, scaledWidth, scaledHeight);  
}
*/
function isImageGreyscale(img, w, h) {
    for (i = 0; i < w; i++)
        for (j = 0; j < h; j++) {
            ind4 = i * 4 + j * (w * 4);

            if (img.data[ind4] + img.data[(ind4 + 1)] + img.data[(ind4 + 2)] != img.data[(ind4 + 2)] * 3)
                return false;
        }
    return true;
}

function processImage() {
    var imageData = ctx_Real.getImageData(0, 0, canvas_Real.width, canvas_Real.height);

    drawObjects(drawingObject_Real_Array, drawingObject_Real, canvas_Display_Real, ctx_Display_Real, canvas_Real, ctx_Real, false);

    if (isWorkerSupported) {
        var drawingData = ctx_Drawing.getImageData(0, 0, canvas_Drawing.width, canvas_Drawing.height);

        worker.postMessage({
            'cmd': 'FFT',
            "realImage": {
                'data': imageData
            },
            drawingImage: {
                'data': drawingData
            }
        });

        $("#loading").html("");
    } else {
        // creates a complex image from real image
        getComplexImages(imageData, imageData.width, imageData.height);

        // do fft on each colour chanel
        for (k = 0; k < 3; k++)
            performFFT(g_FFTImageArray[k], imageData.width, imageData.height, true);

        // get abs shifted image and draw to canvas
        getAbsImage(g_FFTImageArray, imageData.width, imageData.height);

        DrawEverything(false, false);

        $("#loading").html("");
    }
}

function nextPOW2(val) {
    return Math.pow(2, Math.ceil(Math.log(val) / Math.log(2)));
}

function getComplexImages(imdata, w, h) {
    var i, j, val, w2 = canvas_Drawing.width,
        h2 = canvas_Drawing.height,
        ind, ind2, ind4;

    // get pixels of ctx_Drawing - however the drawing is not necessarily from the transform image
    var drawingData = ctx_Drawing.getImageData(0, 0, w2, h2);

    // load up images
    if (imdata < 0)
        return false;

    g_FFTImageArray = [];

    for (k = 0; k < 3; k++) {
        g_FFTImageArray[k] = [];

        for (i = 0; i < w; i++) {
            for (j = 0; j < h; j++) {
                ind = i + j * w;
                ind4 = i * 4 + j * (w * 4);

                indi = Math.floor(i * (w2 / w));
                indj = Math.floor(j * (h2 / h));

                ind2 = indi * 4 + indj * (w2 * 4);

                if (drawingData.data[(ind2 + 3)] > 0)
                    g_FFTImageArray[k][ind] = {
                        "real": drawingData.data[(ind2 + k)],
                        "imag": 0
                    };
                else
                    g_FFTImageArray[k][ind] = {
                        "real": imdata.data[ind4 + k],
                        "imag": 0
                    };
            }
        }
    }
}

//*Math.pow(-1, i+j)
function getAbsImage(fft_im, w, h) {
    var maxVal = minVal = Math.log(Math.sqrt(fft_im[0][0].real * fft_im[0][0].real + fft_im[0][0].imag * fft_im[0][0].imag));

    image_Transform = ctx_Transform.getImageData(0, 0, w, h);

    for (i = 0; i < w * h * 4; i++)
        image_Transform.data[i] = 0;

    for (k = 0; k < 3; k++) {
        // shift fft
        _fft = fftshift(fft_im[k], w, h);

        // prepare display fft
        for (i = 0; i < w * h; i++) {
            absVal = Math.log(Math.sqrt(_fft[i].real * _fft[i].real + _fft[i].imag * _fft[i].imag));

            maxVal = Math.max(maxVal, absVal);
            minVal = Math.min(minVal, absVal);
        }

        for (i = 0; i < w; i++) {
            for (j = 0; j < h; j++) {
                ind = (i + j * w);
                ind4 = i * 4 + j * (w * 4);

                cval = _fft[ind];

                real = cval.real;
                imag = cval.imag;

                val = Math.log(Math.sqrt(real * real + imag * imag));

                absVal = (255.0 * (val - minVal)) / (maxVal - minVal);

                image_Transform.data[ind4 + k] = absVal;

                image_Transform.data[(ind4 + 3)] = 255;
            }
        }
    }

    ctx_Transform.putImageData(image_Transform, 0, 0);

    //ctx_Transform.drawImage(canvas_Temp, 0, 0);

    //DrawCentered(ctx_Transform, w, h, canvas_Real);
}

// button handler
function performIFFT() {
    // size of canvas               size of image
    var w = canvas_Transform.width,
        h = canvas_Transform.height,
        w2 = canvas_Drawing.width,
        h2 = canvas_Drawing.height,
        real, imag, ind, ind2, ind4;

    // get pixels of ctx_Drawing - however the drawing is not necessarily from the transform image
    var drawingData = ctx_Drawing.getImageData(0, 0, w2, h2);

    // get background image to store results of ifft
    var realData = ctx_Real.getImageData(0, 0, w, h);

    //scaling
    var minVal, maxVal;

    var mask = [];

    for (i = 0; i < w2; i++) {
        for (j = 0; j < h2; j++) {
            //index for RGBA 
            ind4 = i * 4 + j * (w2 * 4);

            // get alpha channel
            mask[i + j * w2] = (255 - drawingData.data[(ind4 + 3)]) / 255;
            //console.log(drawingData.data[(ind4+3)]+" ");
        }
    }

    // shift mask rearrange so that 
    mask = ifftshift(mask, w2, h2);

    for (k = 0; k < 3; k++) {
        // make a clone copy of fft to inverse transform
        var iFFTImage = JSON.parse(JSON.stringify(g_FFTImageArray[k]))

        for (i = 0; i < w; i++)
            for (j = 0; j < h; j++) {
                indi = Math.floor(i * (w2 / w));
                indj = Math.floor(j * (h2 / h));

                iFFTImage[i + j * w].real *= mask[indi + indj * w2];
                iFFTImage[i + j * w].imag *= mask[indi + indj * w2];
            }

        // ifft //////////////////////////////////////
        performFFT(iFFTImage, w, h, false);
        //////////////////////////////////////////////

        //console.log("before ="+JSON.stringify(g_FFTImageArray[k][0]) +" after="+ JSON.stringify(iFFTImage[0]));

        val = Math.sqrt(iFFTImage[0].real * iFFTImage[0].real + iFFTImage[0].imag * iFFTImage[0].imag);

        minVal = val,
            maxVal = val;

        // copy back to image
        for (i = 0; i < w; i++) {
            for (j = 0; j < h; j++) {
                ind = (i + j * w);

                real = iFFTImage[ind].real;
                imag = iFFTImage[ind].imag;

                val = Math.sqrt(real * real + imag * imag);

                ind4 = i * 4 + j * (w * 4);

                realData.data[ind4 + k] = val / (w * h);

                if (k == 0)
                    // just do once
                    realData.data[ind4 + 3] = 255;
            }
        }
    }

    scaleColourImage(realData.data, w, h);

    // save inverse image
    ctx_Real.putImageData(realData, 0, 0);

    // reset image data
    //processImage();

    size = canvas_Display_Real.parentNode.parentNode.clientWidth;

    drawImageToSize(canvas_Display_Real, ctx_Display_Real, canvas_Real, ctx_Real, (size / 2 - size / 10));

    // draw drawing objects
    DrawEverything(false, false);

    $("#loading").html("");
}

// event handler settings controls

function updateRadio(val) {
    toolType = val;
}

function updateSlider(val) {
    ctx_Transform.lineWidth = val;
    gStrokeSize = val;
    $("#sizeSliderLabel").html('Line Width <span style="color:red">' + val + "px</span>");
}

function updateInverse(val) {
    gInverse = gInverse ? false : true;
}

function updateStartAngle(val) {
    gStartAngle = val;
    $("#arcStartLabel").html('Arc Start Angle <span style="color:red">' + val + "&deg;</span>");
}

function updateEndAngle(val) {
    gEndAngle = val;
    $("#arcEndLabel").html('Arc End Angle <span style="color:red">' + val + "&deg;</span>");
}

// colour code ///////////////////////////////////////////////////////////////
function MIN3(a, b, c) {
    return (c < (a < b ? a : b) ? c : (a < b ? a : b));
}

function MAX3(a, b, c) {
    return (c > (a > b ? a : b) ? c : (a > b ? a : b));
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function RGB2HSV(r, g, b) {
    r /= 255,
        g /= 255,
        b /= 255;

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0;
        // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return {
        "h": h,
        "s": s,
        "v": v
    };
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function HSV2RGB(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            r = v,
                g = t,
                b = p;
            break;
        case 1:
            r = q,
                g = v,
                b = p;
            break;
        case 2:
            r = p,
                g = v,
                b = t;
            break;
        case 3:
            r = p,
                g = q,
                b = v;
            break;
        case 4:
            r = t,
                g = p,
                b = v;
            break;
        case 5:
            r = v,
                g = p,
                b = q;
            break;
    }

    return {
        "r": (r * 255),
        "g": (g * 255),
        "b": (b * 255)
    };
}

/*
function getRGBImage()
{
	var w=canvas_Real.width, h=canvas_Real.height;
	
	var i, j, val, ind4;
	
	// load up images

	if(gImageData<0)
		return false;

	g_HSVImage = new Array(w*h*4);

	for(i=0;i<w;i++)
	{
		for(j=0; j<h; j++)
		{ 
			ind4 = (i+j*w)*4;
			ind = i+j*w;
			
			val = HSV2RGB(g_HSVImage[ind].h, g_HSVImage[ind].s, g_HSVImage[ind].v);

			gImageData.data[ind4] = val.r;
			gImageData.data[(ind4+1)]= val.g;
			gImageData.data[(ind4+2)] = val.b;
		}	
	}

	return true;
}
*/

// fourier transform code ////////////////////////////////////////////////////////////////////////////////////////////

function fftshift(input, xdim, ydim) {
    return circshift(input, xdim, ydim, parseInt(xdim / 2), parseInt(ydim / 2));
}

function ifftshift(input, xdim, ydim) {
    return circshift(input, xdim, ydim, Math.ceil(xdim / 2), Math.ceil(ydim / 2));
}

function circshift(input, xdim, ydim, xshift, yshift) {
    var out = new Array(xdim * ydim);

    for (var i = 0; i < xdim; i++) {
        ii = (i + xshift) % xdim;
        for (var j = 0; j < ydim; j++) {
            jj = (j + yshift) % ydim;
            out[ii * ydim + jj] = input[i * ydim + j];
        }
    }

    return out;
}

//////////////////////////////////////////////////////////////////////////////

function FFT(x, m, dir) {
    var i, i1, i2, j, k, l, l1, l2, n;
    var t, t1, u, c;

    /*Calculate the number of points */
    n = 1;

    for (i = 0; i < m; i++)
        n <<= 1;

    /* Do the bit reversal */
    i2 = n >> 1;
    j = 0;

    for (i = 0; i < n - 1; i++) {
        if (i < j) {
            t = x[j];
            x[i] = x[j];
            x[j] = x[i];
        }
        k = i2;

        while (k <= j) {
            j -= k;
            k >>= 1;
        }
        j += k;
    }

    /* Compute the FFT */
    c = {
        "real": -1.0,
        "imag": 0.0
    };

    l2 = 1;
    for (l = 0; l < m; l++) {
        l1 = l2;
        l2 <<= 1;

        u = {
            "real": 1.0,
            "imag": 0.0
        };

        for (j = 0; j < l1; j++) {
            for (i = j; i < n; i += l2) {
                i1 = i + l1;
                t1 = u * x[i1];
                x[i1] = x[i] - t1;
                x[i] += t1;
            }

            u = u * c;
        }

        c.imag = Math.sqrt((1.0 - c.real) / 2.0);

        if (dir == 1)
            c.imag = -c.imag;

        c.real = Math.sqrt((1.0 + c.real) / 2.0);
    }

    /* Scaling for forward transform */
    if (dir == 1) {
        for (i = 0; i < n; i++)
            x[i] /= n;
    }
    return;
}

//////////////////////////////////////////////////////////////////////////////

function performFFT(c, nx, ny, forward) {
    var i, j;
    var m, twopm;
    var real, imag;

    if (c < 0)
        return false;

    /* Transform the rows */
    real = new Array(nx);
    imag = new Array(nx);

    for (j = 0; j < ny; j++) {
        for (i = 0; i < nx; i++) {
            real[i] = c[i + j * nx].real;
            imag[i] = c[i + j * nx].imag;
        }

        if (forward)
            transform(real, imag);
        else
            inverseTransform(real, imag);

        for (i = 0; i < nx; i++) {
            c[i + j * nx].real = real[i];
            c[i + j * nx].imag = imag[i];
        }
    }

    /* Transform the columns */
    real = new Array(ny);
    imag = new Array(ny);

    for (i = 0; i < nx; i++) {
        for (j = 0; j < ny; j++) {
            real[j] = c[i + j * nx].real;
            imag[j] = c[i + j * nx].imag;
        }

        if (forward)
            transform(real, imag);
        else
            inverseTransform(real, imag);

        for (j = 0; j < ny; j++) {
            c[i + j * nx].real = real[j];
            c[i + j * nx].imag = imag[j];
        }
    }

    return true;
}

/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This is a wrapper function.
 */
function transform(real, imag) {
    if (real.length != imag.length)
        throw "Mismatched lengths";

    var n = real.length;
    if (n == 0)
        return;
    else if ((n & (n - 1)) == 0)
        // Is power of 2
        transformRadix2(real, imag);
    else
        // More complicated algorithm for aribtrary sizes
        transformBluestein(real, imag);
}

/* 
 * Computes the inverse discrete Fourier transform (IDFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This is a wrapper function. This transform does not perform scaling, so the inverse is not a true inverse.
 */
function inverseTransform(real, imag) {
    transform(imag, real, -1);
}

/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector's length must be a power of 2. Uses the Cooley-Tukey decimation-in-time radix-2 algorithm.
 */
function transformRadix2(real, imag) {
    // Initialization
    if (real.length != imag.length)
        throw "Mismatched lengths";
    var n = real.length;
    if (n == 1)
        // Trivial transform
        return;
    var levels = -1;
    for (var i = 0; i < 32; i++) {
        if (1 << i == n)
            levels = i;
        // Equal to log2(n)
    }
    if (levels == -1)
        throw "Length is not a power of 2";
    var cosTable = new Array(n / 2);
    var sinTable = new Array(n / 2);
    for (var i = 0; i < n / 2; i++) {
        cosTable[i] = Math.cos(2 * Math.PI * i / n);
        sinTable[i] = Math.sin(2 * Math.PI * i / n);
    }

    // Bit-reversed addressing permutation
    for (var i = 0; i < n; i++) {
        var j = reverseBits(i, levels);
        if (j > i) {
            var temp = real[i];
            real[i] = real[j];
            real[j] = temp;
            temp = imag[i];
            imag[i] = imag[j];
            imag[j] = temp;
        }
    }

    // Cooley-Tukey decimation-in-time radix-2 FFT
    for (var size = 2; size <= n; size *= 2) {
        var halfsize = size / 2;
        var tablestep = n / size;
        for (var i = 0; i < n; i += size) {
            for (var j = i, k = 0; j < i + halfsize; j++,
                k += tablestep) {
                var tpre = real[j + halfsize] * cosTable[k] + imag[j + halfsize] * sinTable[k];
                var tpim = -real[j + halfsize] * sinTable[k] + imag[j + halfsize] * cosTable[k];
                real[j + halfsize] = real[j] - tpre;
                imag[j + halfsize] = imag[j] - tpim;
                real[j] += tpre;
                imag[j] += tpim;
            }
        }
    }

    // Returns the integer whose value is the reverse of the lowest 'bits' bits of the integer 'x'.
    function reverseBits(x, bits) {
        var y = 0;
        for (var i = 0; i < bits; i++) {
            y = (y << 1) | (x & 1);
            x >>>= 1;
        }
        return y;
    }
}

/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This requires the convolution function, which in turn requires the radix-2 FFT function.
 * Uses Bluestein's chirp z-transform algorithm.
 */
function transformBluestein(real, imag) {
    // Find a power-of-2 convolution length m such that m >= n * 2 + 1
    var n = real.length;
    var m = 1;
    while (m < n * 2 + 1)
        m *= 2;

    // Trignometric tables
    var cosTable = new Array(n);
    var sinTable = new Array(n);
    for (var i = 0; i < n; i++) {
        var j = i * i % (n * 2);
        // This is more accurate than j = i * i
        cosTable[i] = Math.cos(Math.PI * j / n);
        sinTable[i] = Math.sin(Math.PI * j / n);
    }

    // Temporary vectors and preprocessing
    var areal = new Array(m);
    var aimag = new Array(m);
    for (var i = 0; i < n; i++) {
        areal[i] = real[i] * cosTable[i] + imag[i] * sinTable[i];
        aimag[i] = -real[i] * sinTable[i] + imag[i] * cosTable[i];
    }
    for (var i = n; i < m; i++)
        areal[i] = aimag[i] = 0;
    var breal = new Array(m);
    var bimag = new Array(m);
    breal[0] = cosTable[0];
    bimag[0] = sinTable[0];
    for (var i = 1; i < n; i++) {
        breal[i] = breal[m - i] = cosTable[i];
        bimag[i] = bimag[m - i] = sinTable[i];
    }
    for (var i = n; i <= m - n; i++)
        breal[i] = bimag[i] = 0;

    // Convolution
    var creal = new Array(m);
    var cimag = new Array(m);
    convolveComplex(areal, aimag, breal, bimag, creal, cimag);

    // Postprocessing
    for (var i = 0; i < n; i++) {
        real[i] = creal[i] * cosTable[i] + cimag[i] * sinTable[i];
        imag[i] = -creal[i] * sinTable[i] + cimag[i] * cosTable[i];
    }
}

/* 
 * Computes the circular convolution of the given real vectors. Each vector's length must be the same.
 */
function convolveReal(x, y, out) {
    if (x.length != y.length || x.length != out.length)
        throw "Mismatched lengths";
    var zeros = new Array(x.length);
    for (var i = 0; i < zeros.length; i++)
        zeros[i] = 0;
    convolveComplex(x, zeros, y, zeros.slice(0), out, zeros.slice(0));
}

/* 
 * Computes the circular convolution of the given complex vectors. Each vector's length must be the same.
 */
function convolveComplex(xreal, ximag, yreal, yimag, outreal, outimag) {
    if (xreal.length != ximag.length || xreal.length != yreal.length || yreal.length != yimag.length || xreal.length != outreal.length || outreal.length != outimag.length)
        throw "Mismatched lengths";

    var n = xreal.length;
    xreal = xreal.slice(0);
    ximag = ximag.slice(0);
    yreal = yreal.slice(0);
    yimag = yimag.slice(0);

    transform(xreal, ximag);
    transform(yreal, yimag);
    for (var i = 0; i < n; i++) {
        var temp = xreal[i] * yreal[i] - ximag[i] * yimag[i];
        ximag[i] = ximag[i] * yreal[i] + xreal[i] * yimag[i];
        xreal[i] = temp;
    }
    inverseTransform(xreal, ximag);
    for (var i = 0; i < n; i++) {
        // Scaling (because this FFT implementation omits it)
        outreal[i] = xreal[i] / n;
        outimag[i] = ximag[i] / n;
    }
}

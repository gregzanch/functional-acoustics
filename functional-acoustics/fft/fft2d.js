var gStartPoint = {
        "x": -1,
        "y": -1
    },
    g_OffsetX, g_OffsetY, g_FFTImageArray, g_FFTImageArray;

self.addEventListener('message', function (e) {
    switch (e.data.cmd) {
        case 'FFT':

            var dim = e.data.drawingImage;
            var im = e.data.realImage;

            //self.postMessage({'cmd':'log', 'msg':"worker FFT"});

            processImage(im.data, dim.data);

            //self.postMessage({'cmd': 'started'});
            break;

        case 'iFFT':
            var im = e.data.drawingImage;
            var tim = e.data.transformImage;

            performIFFT(im.data, tim.data)

            break;
        case 'finish':
            console.log("close");
            self.close();
            // Terminates the worker.
            break;
        default:
            self.postMessage('Unknown command: ' + e.cmd);
    };
}, false);

function processImage(im, dim) {
    getComplexImages(im, dim);

    // do fft on each colour chanel
    for (k = 0; k < 3; k++)
        performFFT(g_FFTImageArray[k], im.width, im.height, true);

    // get abs shifted image and draw to canvas
    getAbsImage(g_FFTImageArray, im);
}

function nextPOW2(val) {
    return Math.pow(2, Math.ceil(Math.log(val) / Math.log(2)));
}

function getComplexImages(imdata, drawingData) {
    var i, j, val, w = imdata.width,
        h = imdata.height,
        w2 = drawingData.width,
        h2 = drawingData.height,
        ind, ind2, ind4;

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

                // get data from drawing if performed
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

// button handler
function performIFFT(im, tim) {
    // size of canvas               size of image
    var real, imag, ind, ind2, ind4;
    var w2 = im.width,
        h2 = im.height,
        w = tim.width,
        h = tim.height;

    //scaling
    var minVal, maxVal;

    var mask = [];

    for (i = 0; i < w2; i++) {
        for (j = 0; j < h2; j++) {
            //index for RGBA 
            ind4 = i * 4 + j * (w2 * 4);

            // get alpha channel
            mask[i + j * w2] = (255 - im.data[(ind4 + 3)]) / 255;
            //console.log(drawingData.data[(ind4+3)]+" ");
        }
    }

    // shift mask rearrange so that 
    mask = ifftshift(mask, w2, h2);

    for (k = 0; k < 3; k++) {
        iFFTImage = [];

        // make a clone copy of fft to inverse transform
        for (i = 0; i < w; i++)
            for (j = 0; j < h; j++) {
                ind4 = i * 4 + j * (w * 4);

                tim.data[ind4 + k] = 0;

                indi = Math.floor(i * (w2 / w));
                indj = Math.floor(j * (h2 / h));

                iFFTImage[i + j * w] = {
                    'real': g_FFTImageArray[k][i + j * w].real * mask[indi + indj * w2],
                    'imag': g_FFTImageArray[k][i + j * w].imag * mask[indi + indj * w2]
                };
            }

        // ifft //////////////////////////////////////
        performFFT(iFFTImage, w, h, false);
        //////////////////////////////////////////////

        val = Math.sqrt(iFFTImage[0].real * iFFTImage[0].real + iFFTImage[0].imag * iFFTImage[0].imag);

        // copy back to image
        for (i = 0; i < w; i++) {
            for (j = 0; j < h; j++) {
                ind = (i + j * w);

                real = iFFTImage[ind].real;
                imag = iFFTImage[ind].imag;

                val = Math.sqrt(real * real + imag * imag);

                ind4 = i * 4 + j * (w * 4);

                tim.data[ind4 + k] = val / (w * h);

                if (k == 0)
                    // just do once
                    tim.data[ind4 + 3] = 255;
            }
        }
    }

    self.postMessage({
        'cmd': 'putIFFT',
        "image": {
            "data": tim,
            "width": w,
            "height": h
        }
    });
}

function getAbsImage(fft_im, im) {
    var w = im.width,
        h = im.height;
    var maxVal = minVal = Math.log(Math.sqrt(g_FFTImageArray[0][0].real * g_FFTImageArray[0][0].real + g_FFTImageArray[0][0].imag * g_FFTImageArray[0][0].imag));

    for (i = 0; i < w * h * 4; i++)
        im.data[i] = 0;

    for (k = 0; k < 3; k++) {
        _fft = fftshift(g_FFTImageArray[k], w, h);

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

                im.data[ind4 + k] = absVal;

                im.data[(ind4 + 3)] = 255;
            }
        }
    }

    self.postMessage({
        'cmd': 'putFFT',
        "image": {
            "data": im,
            "width": w,
            "height": h
        }
    });
}

// event handler settings controls

function updateRadio(val) {
    toolType = val;
}

function updateSlider(val) {
    ctx.lineWidth = val;
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
/*
// button handler
function performIFFT(im, w2, h2, tim, w, h, col)
{
	// size of canvas               size of image
	var real, imag, ind, ind2, ind4;

	//scaling
	var minVal,maxVal;

	var mask = new Array(w*h);

	for(i=0;i<w2;i++)
	{
		for(j=0; j<h2; j++)
		{ 
			ind = i+j*w2;
			ind4 = (parseInt(i*w/w2)+parseInt(j*h/h2)*w2)*4;

			if(im.data[(ind4+3)] == 255)
			{
				mask[ind] = 1;
			}
			else
				mask[ind] = 0;
		}
	}
	
	for(k=0;k<(col?3:1);k++)
	{
		for(i=0;i<w2*h2; i++)
		{ 	
			//scaling
			if(mask[i]>0)
			{
				g_FFTImageArray[k][i].real=0;
				g_FFTImageArray[k][i].imag=0;
			}
		}

		// ifft shift 
		g_FFTImageArray[k] = ifftshift(g_FFTImageArray[k], w2, h2);

		// ifft //////////////////////////////////////
		performFFT(g_FFTImageArray[k], w2, h2, 0);
		//////////////////////////////////////////////

		minVal = 255, maxVal=0;

		for(i=0;i<w2*h2;i++)
		{
			real = g_FFTImageArray[k][i].real/(w2*h2);
			imag = g_FFTImageArray[k][i].imag/(w2*h2);

			val = Math.sqrt(real*real+imag*imag);

			maxVal = Math.max(val, maxVal);
			minVal = Math.min(val, minVal);
		}
	
		// copy back to image
		for(i=0;i<w2;i++)
		{
			for(j=0; j<h2; j++)
			{ 
				ind = (i+j*w2);
				ind4 = (i+j*w2)*4;

				real = g_FFTImageArray[k][ind].real/(w2*h2);
				imag = g_FFTImageArray[k][ind].imag/(w2*h2);

				val = Math.sqrt(real*real+imag*imag);

				val = 255* (val-minVal)/(maxVal-minVal);

				im.data[ind4+k] = val;

				if(!col)
				{
					im.data[ind4+1] = val;
					im.data[ind4+2] = val;
				}
				im.data[(ind4+3)] = 255;
			}	
		}
	}
	
	self.postMessage({'cmd': 'putIFFT', "image":{"data":im, "width": w, "height":h, "isColour":col}});
}
*/

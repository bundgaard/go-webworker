// mandelbrot computation and send back answer for each row...
function scale(m, rmin, rmax, tmin, tmax) {
    return ((m - rmin) / (rmax - rmin)) * (tmax - tmin) + tmin;
}

function calculate(x0, y0, maxIteration) {
    let x = 0.0;
    let y = 0.0;
    let xx = 0,
        yy = 0,
        xy = 0;

    let iteration = maxIteration

    while (iteration-- && xx + yy <= 4) {
        xy = x * y;
        xx = x * x;
        yy = y * y;
        x = xx - yy + x0;
        y = xy + xy + y0;
    }
    return maxIteration - iteration;
}


function mandelbrot(xmin, xmax, ymin, ymax, width, height, iterations) {
    let buffer = new Uint8Array(width * height * 4)
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {

            let x0 = xmin + (xmax - xmin) * x / (width - 1);
            let y0 = ymin + (ymax - ymin) * y / (height - 1);
            let iteration = calculate(x0, y0, iterations);
            let pos = (width * y + x) * 4;

            if (iteration > iterations) {
                buffer[pos] = 0;
                buffer[pos + 1] = 0;
                buffer[pos + 2] = 0;
            } else {
                let c = 3 * Math.log(iteration) / Math.log(iterations - 1.0);
                if (c < 1) {
                    buffer[pos] = parseInt(104 * c);
                    buffer[pos + 1] = 100
                    buffer[pos + 2] = 190
                    //  buffer[pos + 1] = 128;
                    //  buffer[pos + 2] = 64;
                } else if (c < 2) {
                    buffer[pos] = 104;
                    buffer[pos + 1] = parseInt(100 * (c - 1));
                    /*   buffer[pos + 2] = 190 */
                } else {
                    buffer[pos] = 104;
                    buffer[pos + 1] = 100;
                    buffer[pos + 2] = parseInt(190 * (c - 2));
                }
            }
            buffer[pos + 3] = 255;
        }
    }
    return buffer;
}

onmessage = (evt) => {
    let data = evt.data;
    switch (data.type) {
        case "mandelbrot":
            let then = performance.now();
            let result = new Uint8Array(mandelbrot(data.xmin, data.xmax, data.ymin, data.ymax, data.width, data.height, data.iterations));
            let elapsed = performance.now() - then;
            console.log(elapsed);
            postMessage({ buffer: result.buffer, status: "done", type: "mandelbrot" }, [result.buffer])
            break;
        default:
            console.log("dont understand message");
    }
};
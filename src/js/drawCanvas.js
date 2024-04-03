const waveTablesTypes = ['sine', 'triangle', 'sawtooth', 'square'];

//------------#draw #canvas #ENV ----------------------------
const drawLine = (ctx, x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
const drawCircle = (ctx, x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }

//canvas env
function drawENV() {
    canvas = document.getElementById('ENV-canvas');
    ctx = canvas.getContext('2d');
    env = envs[app.selectedENV];
    let margin = 5; //5%

    //smaller canvas
    let canvasX = [canvas.width * (margin * 0.005), canvas.width * (1 - margin * 0.005)]
    let canvasY = [canvas.height * (margin * 0.01), canvas.height * (1 - margin * 0.01),]

    ctx.fillStyle = '#2c2d2f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(
        canvasX[0], canvasY[0],
        canvasX[1] - canvasX[0], canvasY[1] - canvasY[0]
    );

    // Set grid spacing and line color
    const gridLines = { height: 5, width: 3 };
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#535559';
    i = 0.8;
    for (let y = canvasY[0] + ((canvasY[1] - canvasY[0]) / gridLines.height); y < canvasY[1]; y += (canvasY[1] - canvasY[0]) / gridLines.height) {
        ctx.font = "14px Anta"; ctx.fillStyle = "#535559"
        ctx.fillText(i.toFixed(1), canvasX[0] + 5, y - 7);
        i -= 0.2;
        drawLine(ctx, canvasX[0], y, canvasX[1], y); //horizontal grid lines
    }
    i = 0;
    for (let x = canvasX[0]; x < canvasX[1]; x += (canvasX[1] - canvasX[0]) / gridLines.width) {
        ctx.font = "14px Anta"; ctx.fillStyle = "#535559"
        ctx.fillText(i, x + 5, canvasY[1] - 7);
        i++;
        drawLine(ctx, x, canvasY[0], x, canvasY[1]); //vertical grid lines
    }

    //draw env
    ctx.strokeStyle = 'rgb(0, 96, 223)';
    ctx.lineWidth = 3;
    attackPos = {
        x1: canvasX[0],
        y1: canvasY[1],
        x2: (env.attack / gridLines.width) * (canvasX[1] - canvasX[0]) + canvasX[0],
        y2: canvasY[0],
    }
    decayPos = {
        x1: attackPos.x2,
        y1: attackPos.y2,
        x2: (env.decay / gridLines.width) * (canvasX[1] - canvasX[0]) + attackPos.x2,
        y2: canvasY[0] + (canvasY[1] - canvasY[0]) * (1 - env.sustain),
    }
    releasePos = {
        x1: decayPos.x2,
        y1: decayPos.y2,
        x2: (env.release / gridLines.width) * (canvasX[1] - canvasX[0]) + decayPos.x2,
        y2: canvasY[1],
    }
    drawLine(ctx, attackPos.x1, attackPos.y1, attackPos.x2, attackPos.y2);
    drawLine(ctx, decayPos.x1, decayPos.y1, decayPos.x2, decayPos.y2);
    drawLine(ctx, releasePos.x1, releasePos.y1, releasePos.x2, releasePos.y2);
    r = 3;
    ctx.fillStyle = "white";
    drawCircle(ctx, attackPos.x1, attackPos.y1, r);
    drawCircle(ctx, decayPos.x1, decayPos.y1, r);
    drawCircle(ctx, releasePos.x1, releasePos.y1, r);
    drawCircle(ctx, releasePos.x2, releasePos.y2, r);

    //white outline
    ctx.strokeStyle = 'white'; ctx.lineWidth = 2;
    drawLine(ctx, canvasX[0], canvasY[0], canvasX[0], canvasY[1]);
    drawLine(ctx, canvasX[0], canvasY[1], canvasX[1], canvasY[1]);
}

drawENV();
app.setENVknobRotation();

//---------------------canvas osc #draw #canvas #OSC-------------------
async function drawWaveform(oscBody, blendType = "none") {
    oscillator = oscBody.oscillator;
    canvas = oscBody.canvas;
    ctx = canvas.getContext('2d');
    waveform = oscBody.waveform;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set grid spacing and line color
    const gridLines = { height: 4, width: 4 };
    const gridColor = '#535559';

    ctx.lineWidth = 1;
    ctx.strokeStyle = gridColor;

    for (let y = 0; y <= canvas.height; y += canvas.height / gridLines.height) {
        drawLine(ctx, 0, y, canvas.width, y); //horizontal grid lines
    }
    for (let x = 0; x <= canvas.width; x += canvas.width / gridLines.width) {
        drawLine(ctx, x, 0, x, canvas.height); //vertical grid lines
    }

    // Draw bold X axis
    ctx.lineWidth = 2;
    drawLine(ctx, 0, canvas.height / 2, canvas.width, canvas.height / 2);

    ctx.strokeStyle = 'rgb(0, 96, 223)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    for (let i = 0; i < waveform.length; i++) {
        const x = (i / waveform.length) * canvas.width;
        const y = ((waveform[i] + 1) / 2) * canvas.height;
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    //-------------------------draw unison bars------------------------------
    if (blendType != "none") {
        let [unison, detune, blend] = [null, null, null];
        if (blendType == "A") {
            unison = app.knobs[10].value.cur;
            detune = app.knobs[11].value.cur;
            blend = app.knobs[12].value.cur;
        }
        else if (blendType == "B") {
            unison = app.knobs[0].value.cur;
            detune = app.knobs[1].value.cur;
            blend = app.knobs[2].value.cur;
        }


        let mid1 = Math.round((unison - 1) / 2);
        let mid2 = mid1;
        if (unison % 2 == 0) {
            mid1 = Math.round(unison / 2);
            mid2 = Math.round(unison / 2 - 1);
        }

        for (let i = 0; i < unison; i++) {
            let x = canvas.width / 2;
            if (unison != 1) {
                x = i * (detune * 2 / (unison - 1)) - detune;
                x = x * canvas.width / (98) + canvas.width / 2;
            }

            let y = canvas.height * (1 - blend);
            ctx.strokeStyle = 'white';

            if (mid1 == i || mid2 == i) {
                y = canvas.height * blend;
                ctx.strokeStyle = 'red';
            }

            drawLine(ctx, x, y, x, canvas.height);
        }
    }

}

function drawMeter(level) {
    canvas = document.getElementById("canvas-meter");
    ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const minDb = -60; // Minimum dB value to visualize
    const maxDb = 10;   // Maximum dB value to visualize

    if (level > minDb) {
        const dbRange = maxDb - minDb;
        const dbHeight = (level - minDb) / dbRange * canvas.height;

        ctx.fillStyle = '#0000cc';
        ctx.fillRect(0, canvas.height - dbHeight, canvas.width, dbHeight);
    }


    // Set grid spacing and line color
    const gridLines = { height: 14, width: 2 };
    const gridColor = '#535559';

    ctx.lineWidth = 3;
    ctx.strokeStyle = gridColor;

    i = 10;
    for (let y = 0; y <= canvas.height; y += canvas.height / gridLines.height) {
        ctx.font = "25px Anta"; ctx.fillStyle = "#535559"
        ctx.fillText(i, 5, y - 7);
        i -= 5;
        if (i == -5) {
            ctx.strokeStyle = 'white';
            drawLine(ctx, 0, y, canvas.width, y); //horizontal grid lines
            ctx.strokeStyle = gridColor;
        }
        else {
            drawLine(ctx, 0, y, canvas.width, y); //horizontal grid lines
        }
    }
    for (let x = 0; x <= canvas.width; x += canvas.width / gridLines.width) {
        drawLine(ctx, x, 0, x, canvas.height); //vertical grid lines
    }

}


function logarithmicArraySize(size, length) {
    const result = [];
    for (let i = 0; i < size; i++) {
        const logIndex = Math.pow(10, (i / size) * Math.log10(length));
        result.push(Math.floor(logIndex));
    }
    return result;
}
const fftLength = 1024;
const numBands = 64;
const bandIndexes = logarithmicArraySize(numBands, fftLength);
console.log(bandIndexes);


function drawFFT(fft) {
    canvas = document.getElementById("canvas-spectrum");
    ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = 'white';
    // Get the frequency data from the analyser
    const frequencyData = fft.getValue();
    console.log(frequencyData);

    const minDb = -100; // Minimum dB value to visualize
    const maxDb = 10;   // Maximum dB value to visualize

    const barWidth = canvas.width / numBands;
    for (let i = 0; i < numBands; i++) {

        if (frequencyData[bandIndexes[i]] > minDb) {
            const dbRange = maxDb - minDb;
            const dbHeight = (frequencyData[bandIndexes[i]] - minDb) / dbRange * canvas.height;
            const x = i * barWidth;
            ctx.fillStyle = '#0000cc';
            ctx.fillRect(x, canvas.height - dbHeight, barWidth, dbHeight);
        }
    }


    // // Set grid spacing and line color
    // const gridLines = { height: 14, width: 2 };
    // const gridColor = '#535559';

    // ctx.lineWidth = 3;
    // ctx.strokeStyle = gridColor;

    // i = 10;
    // for (let y = 0; y <= canvas.height; y += canvas.height / gridLines.height) {
    //     ctx.font = "25px Anta"; ctx.fillStyle = "#535559"
    //     ctx.fillText(i, 5, y - 7);
    //     i -= 5;
    //     if (i == -5) {
    //         ctx.strokeStyle = 'white';
    //         drawLine(ctx, 0, y, canvas.width, y); //horizontal grid lines
    //         ctx.strokeStyle = gridColor;
    //     }
    //     else {
    //         drawLine(ctx, 0, y, canvas.width, y); //horizontal grid lines
    //     }
    // }
    // for (let x = 0; x <= canvas.width; x += canvas.width / gridLines.width) {
    //     drawLine(ctx, x, 0, x, canvas.height); //vertical grid lines
    // }

}

//-----------#disable all --------- if one wavetable is selected----------
const selectWavetable = async (oscBody, selectedImg, hasCanvas = true) => {
    const selectionBody = oscBody.body;
    const images = selectionBody.querySelectorAll('img');

    images.forEach(img => {
        img.style.margin = '1px';
        img.src = `src/images/${img.alt}-wave-off.png`;
        img.setAttribute('data-onoff', false);
    });

    selectedImg.style.margin = '0px';
    selectedImg.src = `src/images/${selectedImg.alt}-wave.png`;
    selectedImg.setAttribute('data-onoff', true);

    oscBody.oscillator.type = selectedImg.alt;

    if (hasCanvas) {
        oscBody.waveform = await oscBody.oscillator.asArray(256);
        await drawWaveform(oscBody);
    }
};

//------------#create------------ wavetables in selection Body
const addWavetablesSelection = async (oscBody, hasCanvas = true, hor = false) => {
    let first = true;
    waveTablesTypes.forEach(name => {
        const img = document.createElement('img');
        if (hor) {
            img.classList.add('presets-hor');
        }
        else {
            img.classList.add('wavetable-selection-presets');
        }
        img.src = `src/images/${name}-off.png`;
        img.alt = name;
        img.setAttribute('data-onoff', false);
        img.addEventListener("click", () => { selectWavetable(oscBody, img); });
        oscBody.body.appendChild(img);
        if (first === true) { first = img; }
    });
    await selectWavetable(oscBody, first, hasCanvas);
};

const visualizeFilter = (oscBody) => {
    filter = oscBody.filter;
    canvas = document.getElementById('FILTER-canvas');
    ctx = canvas.getContext('2d');

    const minFrequency = 15;
    const maxFrequency = 25000;

    const divideFreq = 50;
    const frequencies = new Float32Array(divideFreq);

    // Convert linear scale to logarithmic scale
    for (let i = 0; i < divideFreq; i++) {
        const frequency = minFrequency * Math.pow(maxFrequency / minFrequency, i / divideFreq);
        frequencies[i] = frequency;
    }


    const magnitudes = filter.getFrequencyResponse(frequencies);

    //background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#535559';
    ctx.lineWidth = 2;
    drawLine(ctx, 0, canvas.height / 2, canvas.width, canvas.height / 2);

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (let i = 0; i < frequencies.length; i++) {
        const x = (Math.log10(frequencies[i] / minFrequency) / Math.log10(maxFrequency / minFrequency)) * canvas.width;
        const y = canvas.height - (magnitudes[i] * canvas.height / 2); // Adjust scale
        ctx.lineTo(x, y);
    }
    ctx.stroke();
};

//add wave tables asynchornously
(async () => {
    try {
        await addWavetablesSelection(oscA);
        await addWavetablesSelection(oscB);
        await addWavetablesSelection(oscSUB, false, true);
        await visualizeFilter(oscFILTER);
        await drawMeter(-60);
    } catch (error) {
        console.error('Adding OSC wavetable failed', error);
    }
})();
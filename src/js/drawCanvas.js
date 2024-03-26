const waveTablesTypes = ['sine', 'triangle', 'sawtooth', 'square'];

//------------#draw #canvas #ENV ----------------------------
const drawLine = (ctx, x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
const drawCircle = (ctx, x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }

//canvas env
function drawENV() {
    canvas = document.getElementById('ENV-canvas');
    ctx = canvas.getContext('2d');
    env = envs[app.curENV];
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
                x = x * canvas.width / (100) + canvas.width / 2;
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

//-----------#disable all --------- if one wavetable is selected----------
const selectWavetable = async (oscBody, selectedImg, hasCanvas) => {
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
        if(hor){
            img.classList.add('presets-hor');
        }
        else{
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


//add wave tables asynchornously
(async () => {
    try {
        await addWavetablesSelection(oscA);
        await addWavetablesSelection(oscB);
        await addWavetablesSelection(oscSUB, false, true);
    } catch (error) {
        console.error('Adding OSC wavetable failed', error);
    }
})();
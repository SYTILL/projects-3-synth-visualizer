const keyboard = new AudioKeys({ rows: 1 });

keyboard.down(async (key) => { await Tone.start(); await playSynth(key); });
keyboard.up(async (key) => { await stopSynth(key); });

//piano pressed visual + sound
const playSynth = (key) => {
    const clickedKey = document.querySelector(`[data-key="${String.fromCharCode(key.keyCode).toLowerCase()}"]`);
    clickedKey.classList.add("active");
    startOSC(key);
};

const stopSynth = (key) => {
    const clickedKey = document.querySelector(`[data-key="${String.fromCharCode(key.keyCode).toLowerCase()}"]`);
    clickedKey.classList.remove("active");
    stopOSC(key);
};

//---------------piano visual-------------------
const keysCheckbox = document.querySelector(".keys-checkbox input");
const pianoKeys = document.querySelectorAll(".piano-keys .key");
let allKeys = [];

//[Show-Keys] checkbox function
const showHideKeys = () => { pianoKeys.forEach(key => key.classList.toggle("hide")); }
keysCheckbox.addEventListener("click", showHideKeys);

//piano pressed effect - click
pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key);
    key.addEventListener("mousedown", () => { keyboard._addKey({ keyCode: key.dataset.key.toUpperCase().charCodeAt(0) }); });
    key.addEventListener("mouseup", () => { keyboard._removeKey({ keyCode: key.dataset.key.toUpperCase().charCodeAt(0) }); });
});
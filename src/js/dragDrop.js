//--------------#drag & drop----------------------------
selectBoxes = document.querySelectorAll(".ENV-select-box");

let selectedDragItem = null;
let i = 1;
selectBoxes.forEach(box => {
    box.setAttribute('data-envnum', i++);

    const img = new Image();
    img.src = "src/images/drag-image.png";

    box.addEventListener("dragstart", function (e) {
        e.dataTransfer.setDragImage(img, 25, 10);
        selectedDragItem = Number(box.dataset.envnum);
    }, false);
});


const cards = document.querySelectorAll(".card");
const lists = document.querySelectorAll(".list");

let draggedCard = null;

// CARD EVENTS
for (const card of cards) {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
}

// LIST EVENTS
for (const list of lists) {
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop", dragDrop);
}

function dragStart() {

    // Prevent dragging cards from Done
    if (this.parentElement.id === "list3") {
        return;
    }

    draggedCard = this;

    setTimeout(() => {
        this.style.display = "none";
    }, 0);
}

function dragEnd() {
    this.style.display = "block";
    draggedCard = null;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add("over");
}

function dragLeave() {
    this.classList.remove("over");
}

function dragDrop() {

    if (draggedCard) {
        this.appendChild(draggedCard);
    }

    this.classList.remove("over");
}
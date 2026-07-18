const cards = document.querySelectorAll(".card");
const lists = document.querySelectorAll(".list");

let draggedCard = null;
let ghostElement = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

// =====================================
// MOUSE DRAG EVENT
// =====================================

for (const card of cards) {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
}

for (const list of lists) {
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop", dragDrop);
}

function dragStart() {
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

// =====================================
// TOUCH EVENTS
// =====================================

for (const card of cards) {
    card.addEventListener("touchstart", touchStart, { passive: false });
    card.addEventListener("touchmove", touchMove, { passive: false });
    card.addEventListener("touchend", touchEnd);
}

function touchStart(e) {
    // Prevent dragging cards from Done (list3)
    if (this.parentElement.id === "list3") {
        return;
    }

    e.preventDefault(); 

    draggedCard = this;
    const touch = e.touches[0];
    const rect = this.getBoundingClientRect();

    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;

    ghostElement = this.cloneNode(true);
    ghostElement.style.position = "fixed";
    ghostElement.style.width = rect.width + "px";
    ghostElement.style.height = rect.height + "px";
    ghostElement.style.opacity = "0.85";
    ghostElement.style.zIndex = "9999";
    ghostElement.style.pointerEvents = "none";
    ghostElement.style.left = (touch.clientX - touchOffsetX) + "px";
    ghostElement.style.top = (touch.clientY - touchOffsetY) + "px";
    ghostElement.style.transform = "rotate(3deg) scale(1.02)";
    ghostElement.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
    ghostElement.style.borderRadius = "8px";

    document.body.appendChild(ghostElement);

    this.style.opacity = "0.3";
}

function touchMove(e) {
    if (!ghostElement) return;

    e.preventDefault(); 

    const touch = e.touches[0];
    ghostElement.style.left = (touch.clientX - touchOffsetX) + "px";
    ghostElement.style.top = (touch.clientY - touchOffsetY) + "px";

    for (const list of lists) {
        const rect = list.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            list.classList.add("over");
        } else {
            list.classList.remove("over");
        }
    }
}

function touchEnd(e) {
    if (!ghostElement) return;

    const touch = e.changedTouches[0];

    let droppedList = null;
    for (const list of lists) {
        const rect = list.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            droppedList = list;
        }
        list.classList.remove("over");
    }

    if (droppedList && draggedCard) {
        droppedList.appendChild(draggedCard);
    }

    ghostElement.remove();
    ghostElement = null;

    if (draggedCard) {
        draggedCard.style.opacity = "1";
        draggedCard.style.display = "block";
    }

    draggedCard = null;
}
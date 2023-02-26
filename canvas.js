let canvas, ctx, fromXY, toXY, rect;

function draw() {
    clear();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromXY.x - rect.left, fromXY.y - rect.top);
    ctx.lineTo(toXY.x - rect.left, toXY.y - rect.top);
    ctx.stroke();
    ctx.closePath();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function reset() {
    fromXY = {};
    toXY = {};
}

function moveHandler(e) {
    if (typeof fromXY.x !== "undefined") {
        toXY.x = e.clientX - rect.left;
        toXY.y = e.clientY - rect.top;
        draw();
    }
}

function upHandler(e) {
    // Canvas origin is top left so we take negative.
    var dx = -(toXY.x - fromXY.x);
    var dy = -(toXY.y - fromXY.y);

    // Insert text at cursor placement. 
    var textarea = document.getElementById('textarea');
    insertTextAtCursor(textarea, "{" + dx + "," + dy + "}");
    textarea.focus();
    clear();
    reset();
}

function clickHandler(e) {
    if (typeof fromXY.x === "undefined") {
        fromXY.x = e.clientX - rect.left;
        fromXY.y = e.clientY - rect.top;
    } else {
        reset();
    }
}

window.onload = function () {
    canvas = document.getElementById("canvas");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx = canvas.getContext("2d");
    rect = canvas.getBoundingClientRect();
    reset();

    canvas.onmousedown = clickHandler;
    canvas.onmousemove = moveHandler;
    canvas.onmouseup = upHandler;

    const img = document.querySelector('#img');
    document.querySelector('#file').addEventListener('input', event => {
        if (event.target.files.length === 0) {
            alert('No file provided');
            return
        }
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
            img.src = reader.result;

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx = canvas.getContext("2d");
            rect = canvas.getBoundingClientRect();
            reset();
        })
        reader.readAsDataURL(event.target.files[0])
    });

    let transcribe = document.getElementById("transcribe"),
        slider = document.getElementById("slider");

    // on mouse down (drag start)
    slider.onmousedown = function dragMouseDown(e) {
        // get position of mouse
        let dragX = e.clientY;
        // register a mouse move listener if mouse is down
        document.onmousemove = function onMouseMove(e) {
            // e.clientY will be the position of the mouse as it has moved a bit now
            // offsetHeight is the height of the block-1
            transcribe.style.height = transcribe.offsetHeight - e.clientY + dragX + "px";
            // update variable - till this pos, mouse movement has been handled
            dragX = e.clientY;
            console.log(transcribe.offsetHeight + " " + e.clientY);
        }
        // remove mouse-move listener on mouse-up (drag is finished now)
        document.onmouseup = () => document.onmousemove = document.onmouseup = null;
    }

}

function leftAlign() {
    document.getElementById('textarea').style.textAlign = "left";
}

function rightAlign() {
    document.getElementById('textarea').style.textAlign = "right";
}
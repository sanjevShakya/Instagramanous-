var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var imgWidth = 200;
var imgHeight = 300;
var size = {
    width: imgWidth,
    height: imgHeight
};
var rotation = 0;
var deg2Rad = Math.PI / 180;
var count1 = 0;
var count2 = 0;

var img = new Image();
img.onload = function () {
    imgWidth = img.width;
    imgHeight = img.height;
    size = {
        width: imgWidth,
        height: imgHeight
    };
    draw();
}
img.src = "https://dl.dropboxusercontent.com/u/139992952/stackoverflow/Rotate.png";

function draw() {
    canvas.width = size.width;
    canvas.height = size.height;

    // calculate the centerpoint of the canvas
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var info = document.getElementById("info");
    info.innerHTML = "canvas size: " + (count1++) + ": " + cx + " / " + cy;

    // draw the rect in the center of the newly sized canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(216,216,150,1.0)";
    ctx.translate(cx, cy);
    ctx.rotate(rotation * deg2Rad);
    ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2);
}

document.getElementById("rotate").addEventListener("click", rotateClicked, false);

function rotateClicked(e) {
    rotation += 45;
    draw();
}

document.getElementById("resize").addEventListener("click", resizeClicked, false);

function resizeClicked(e) {
    rotation += 45;
    newSize(imgWidth, imgHeight, rotation);
    draw();
}

function newSize(w, h, a) {
    var rads = a * Math.PI / 180;
    var c = Math.cos(rads);
    var s = Math.sin(rads);
    if (s < 0) {
        s = -s;
    }
    if (c < 0) {
        c = -c;
    }
    size.width = h * s + w * c;
    size.height = h * c + w * s;
}
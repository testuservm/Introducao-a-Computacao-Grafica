var svgPoints = document.getElementById("points");
var svgAxis = document.getElementById("axis");
var svgPointer = document.getElementById("pointer")
var svgPolygon = document.getElementById("polygon")
let button = document.getElementById("reload");

var positions = function (points) {
    let pos = [];
    for (let count = 0; count < points; count++) {
        pos.push([Math.floor(Math.random() * 350 + 80), Math.floor(Math.random() * 350 + 80)]);
    }
    return pos;
}

var drawPoints = async function(pos, color) {
    for (let count = 0; count < pos.length; count++){
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        newElement.innerHTML = '<circle r="3" fill="'+ color + '" >';
        let x = pos[count][0];
        let y = pos[count][1];
        newElement.setAttribute("transform", "translate(" + x + " " + y +")");
        await new Promise(r => setTimeout(r, 100));
        svgPoints.appendChild(newElement);
  }
}

var axis = function(positions, show=false) {
    let sumx = 0;
    let sumy = 0;
    for (let count = 0; count < positions.length; count++) {
        sumx += positions[count][0];
        sumy += positions[count][1];
    }
    let x = Math.floor(sumx / positions.length);
    let y = Math.floor(sumy / positions.length);
    if (show) {
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
    newElement.innerHTML = '<line x1="5" x2="505" y1="' + y + '" y2="' + y + '" stroke="red" /><line x1="' + x + '" x2="' + x +' " y1="5" y2="505" stroke="red" />';
    //await new Promise(r => setTimeout(r, 500 * positions.length));
    svgAxis.appendChild(newElement);
    }
    return [x, y];
}

var angle = function(x, y) {
    let radian = Math.atan2(y, x);
    if (radian < 0) {
        radian = 2 * Math.PI + radian;
    }
    return radian;
}

var pointer = async function(positions, vel=1) {
    let dots = [];
    let cx = axis(positions)[0];
    let cy = axis(positions)[1];
    let poli = "";
    for (let count = 0; count < positions.length; count++) {
        dots.push([angle(positions[count][0] - cx, positions[count][1] - cy), [positions[count][0], positions[count][1]]]);
    }
    dots = dots.sort().reverse();
    dots.push(dots[0]);
    for (let count = 0; count < dots.length; count++) {
        poli += dots[count][1][0] + " " + dots[count][1][1]
        if (count !== dots.length - 1){poli += " "};
        svgPointer.innerHTML = "";
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        newElement.innerHTML = '<line x1="' + cx + '" x2="'+dots[count][1][0]+'" y1="' + cy + '" y2="' + dots[count][1][1] + '" stroke="blue" />';
        svgPointer.appendChild(newElement);
        polygon(poli);
        if (count == dots.length - 1) {
            await new Promise(r => setTimeout(r, 1000));
            polygon(poli, true);
            svgAxis.innerHTML = "";
            svgPointer.innerHTML = "";
        }
        await new Promise(r => setTimeout(r, 1000 / vel));
    }
}

var polygon = function(point, fill=false) {
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgPolygon.innerHTML = '<polyline points="' + point + '" stroke="green"></polyline>'
    if (fill) {
        svgPolygon.innerHTML = '<polyline points="' + point + '" stroke="green" fill="green"></polyline>'
        button.disabled = false;
    }
}

var reload = function() {
    points = document.getElementById("npoints").value;
    speed = document.getElementById("speed").value;
    document.getElementById("polygon").innerHTML = "";
    document.getElementById("axis").innerHTML = "";
    document.getElementById("points").innerHTML = "";
    document.getElementById("pointer").innerHTML = "";
    flow(points, speed);
}

var flow = async function (p=5, vel=1) {
    button.disabled = true;
    let pos = positions(p);
    drawPoints(pos, "black");
    await new Promise(r => setTimeout(r, p * 120 + 1000));
    axis(pos, true);
    await new Promise(r => setTimeout(r, 1000));
    pointer(pos, vel);
}

button.addEventListener('click', reload);
flow();

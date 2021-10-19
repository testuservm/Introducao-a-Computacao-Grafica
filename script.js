let div = document.getElementById("svgs");
var level = 1;
var varButtom = false;


// -------------------------- Classes -------------------------- //
class Cenario {
    constructor(image, pos, dim) {
        this.pos = pos;
        this.image = image;
        this.dim = dim;
    };
    draw() {
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        newElement.innerHTML = '<image href="' + this.image + '">';
        newElement.setAttribute("transform", "translate(" + this.pos[0] + " " + this.pos[1] + ")");
        svg.appendChild(newElement);
    };
};

class Player {
    constructor(pos, angle=0, size=[30, 30], limits=[[]]) {
        this.id = "player";
        this.x = pos[0];
        this.y = pos[1];
        this.image = "images/player.svg";
        this.drawed = false;
        this.speed = 3;
        this.angle = angle;
        this.limits = limits;
        this.size = size;
    };

    draw() {
        if (this.drawed) this.remove();
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        newElement.innerHTML = '<image href="' + this.image + '">"';
        newElement.setAttribute("transform", "translate(" + this.x + " " + this.y + ") " + 
        "rotate(" + this.angle + ")");
        newElement.setAttribute("id", this.id);
        svg.appendChild(newElement);
        this.drawed = true;
    };
    remove() {
        if (!this.drawed) return;
        let obj = document.getElementById(this.id);
        svg.removeChild(obj);
        this.drawed = false;
        return;
    }
};


class Box {
    constructor(id, pos, size=[45, 45], limits=[[]]) {
        this.id = id;
        this.x = pos[0];
        this.y = pos[1];
        this.image = "images/box.svg";
        this.size = size;
        this.drawed = false;
        this.limits = limits;
    }
    draw() {
        if (this.drawed) return;
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        newElement.innerHTML = '<image href="' + this.image + '">"';
        newElement.setAttribute("transform", "translate(" + this.x + " " + this.y + ")");
        newElement.setAttribute("id", this.id);
        svg.appendChild(newElement);
        this.drawed = true;
        return;

    };
    remove() {
        if (!this.drawed) return;
        let obj = document.getElementById(this.id);
        svg.removeChild(obj);
        this.drawed = false;
        return;
    }
};

class Goal {
    constructor(id, pos) {
        this.id = id;
        this.x = pos[0];
        this.y = pos[1];
        this.image = "images/goal.svg";
    }
    draw() {
        let newElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        newElement.innerHTML = '<image href="' + this.image + '">"';
        newElement.setAttribute("transform", "translate(" + this.x + " " + this.y + ")");
        svg.appendChild(newElement);

    };
}
// -------------------------- // -------------------------- //


// -------------------------- Keyboard keys watch -------------------------- //    
let keys = {
    up: false,
    down: false,
    left: false,
    right: false
}

$("body").keydown(function (event) {
    let char = event.keyCode;
    if (char == 37) {
        keys["left"] = true;
    }
    if (char == 38) {
        keys["up"] = true;
    }
    if (char == 39) {
        keys["right"] = true;
    }
    if (char == 40) {
        keys["down"] = true;
    }
})
$("body").keyup(function (event) {
    let char = event.keyCode;
    if (char == 37) {
        keys["left"] = false;
    }
    if (char == 38) {
        keys["up"] = false;
    }
    if (char == 39) {
        keys["right"] = false;
    }
    if (char == 40) {
        keys["down"] = false;
    }
})
// -------------------------- // -------------------------- //    



// -------------------------- Collisions -------------------------- //   
Player.prototype.watchCollision = function () {
    if (keys["right"]) {
        for (let i = 0; i < this.limits.length; i++) {
            if (this.x > this.limits[i][0] && this.x < this.limits[i][2] &&
            (this.y > this.limits[i][1] && this.y < this.limits[i][3] || 
            this.y + this.size[1] > this.limits[i][1] && this.y + this.size[1] < this.limits[i][3])) {
                this.x -= this.speed;
            }
        }
    } else if (keys["left"]) {
        for (let i = 0; i < this.limits.length; i++) {
            if (this.x > this.limits[i][0] && this.x < this.limits[i][2] &&
            (this.y > this.limits[i][1] && this.y < this.limits[i][3] || 
            this.y - this.size[1] > this.limits[i][1] && this.y - this.size[1] < this.limits[i][3])) {
                this.x += this.speed;
            }
        }
    } else if (keys["up"]) {
        for (let i = 0; i < this.limits.length; i++) {
            if (this.y > this.limits[i][1] && this.y < this.limits[i][3] &&
            (this.x > this.limits[i][0] && this.x < this.limits[i][2] || 
            this.x + this.size[0] > this.limits[i][0] && this.x + this.size[0] < this.limits[i][2])) {
                this.y += this.speed ;
            }
        }
    } else if (keys["down"]) {
        for (let i = 0; i < this.limits.length; i++) {
            if (this.y > this.limits[i][1] && this.y < this.limits[i][3] &&
            (this.x > this.limits[i][0] && this.x < this.limits[i][2] || 
            this.x - this.size[0] > this.limits[i][0] && this.x - this.size[0] < this.limits[i][2])) {
                this.y -= this.speed;
            }
        }
    } 
}

Box.prototype.watchCollision = function (varPlayer, vel) {
    if (keys["right"]) {
        for (let i = 0; i < this.limits.length; i++) {
            if (this.x + this.size[0] > this.limits[i][0] && this.x < this.limits[i][2] &&
            (this.y > this.limits[i][1] && this.y < this.limits[i][3] || 
            this.y + this.size[1] > this.limits[i][1] && this.y + this.size[1] < this.limits[i][3])) {
                this.x -= vel;
                varPlayer.x -= varPlayer.speed - vel + 1;
            }
        }

    } else if (keys["left"]) {
        for (let i = 0; i < this.limits.length; i++) {
            if (this.x < this.limits[i][2] && this.x > this.limits[i][0] &&
            (this.y > this.limits[i][1] && this.y < this.limits[i][3] || 
            this.y + this.size[1] > this.limits[i][1] && this.y + this.size[1] < this.limits[i][3])) {
                this.x += vel;
                varPlayer.x += varPlayer.speed - vel + 1;
            }
        }
    } else if (keys["up"]) {
        for (let i = 0; i < this.limits.length; i++) {
            if (this.y > this.limits[i][1] && this.y < this.limits[i][3] &&
            (this.x > this.limits[i][0] && this.x < this.limits[i][2] || 
            this.x + this.size[0] > this.limits[i][0] && this.x + this.size[0] < this.limits[i][2])) {
                this.y += vel;
                varPlayer.y += varPlayer.speed - vel + 1;
            }
        }
    } else if (keys["down"]) {
        for (let i = 0; i < this.limits.length; i++) {
            if (this.y +this.size[1] > this.limits[i][1] && this.y + this.size[1] < this.limits[i][3] &&
            (this.x > this.limits[i][0] && this.x < this.limits[i][2] || 
            this.x + this.size[0] > this.limits[i][0] && this.x + this.size[0] < this.limits[i][2])) {
                this.y -=  vel;
                varPlayer.y -= varPlayer.speed - vel + 1;
            }
        }
    }

}
// -------------------------- // -------------------------- //    



// -------------------------- Moviments -------------------------- //    
Box.prototype.movement = function (varPlayer, boxes=[], vel=1) {
    if (keys["right"]) {
        if (varPlayer.x > this.x && varPlayer.x < this.x + 10 && (varPlayer.y > this.y && varPlayer.y < this.y + this.size[1] ||
        varPlayer.y + varPlayer.size[0] > this.y && varPlayer.y + varPlayer.size[0] < this.y + this.size[1])) {
            this.x += vel;
            varPlayer.x -= varPlayer.speed - vel;
            for (let box in boxes) {
                if (this.x + this.size[0] >= boxes[box].x && this.x <= boxes[box].x + 10 && (this.y >= boxes[box].y && this.y <= boxes[box].y + boxes[box].size[1] || this.y + this.size[1] >= boxes[box].y && this.y + this.size[1] <= boxes[box].y + boxes[box].size[1])) {
                    this.x -= vel;
                    varPlayer.x -= varPlayer.speed - vel + 1;
                }

            }
            this.remove();
            this.draw();
        }
    } else if (keys["left"]) {
        if (varPlayer.x < this.x + this.size[0] && varPlayer.x > this.x - 10 && (varPlayer.y > this.y && varPlayer.y < this.y + this.size[1] ||
        varPlayer.y - varPlayer.size[0] > this.y && varPlayer.y - varPlayer.size[0] < this.y + this.size[1])) {
            this.x -= vel;
            varPlayer.x += varPlayer.speed - vel;
            for (let box in boxes) {
                if (this.x <= boxes[box].x + boxes[box].size[0] && this.x >= boxes[box].x + 10 && (this.y >= boxes[box].y && this.y <= boxes[box].y + boxes[box].size[1] || this.y + this.size[1] >= boxes[box].y && this.y + this.size[1] <= boxes[box].y + boxes[box].size[1])) {
                    this.x += vel;
                    varPlayer.x += varPlayer.speed - vel + 1;
                }
            }
            this.remove();
            this.draw();
        }

    } else if (keys["up"]) {
        if (varPlayer.y < this.y + this.size[1] && varPlayer.y > this.y + 10 && (varPlayer.x > this.x && varPlayer.x < this.x + this.size[0] ||
        varPlayer.x + varPlayer.size[0] > this.x && varPlayer.x - varPlayer.size[0] < this.x)) {
            this.y -= vel;
            varPlayer.y += varPlayer.speed - vel;
            for (let box in boxes) {
                if (this.y <= boxes[box].y + boxes[box].size[1] && this.y >= boxes[box].y + 10 && (this.x >= boxes[box].x && this.x <= boxes[box].x + boxes[box].size[0] || this.x + this.size[0] >= boxes[box].x && this.x + this.size[0] <= boxes[box].x + boxes[box].size[0])) {
                    this.y += vel;
                    varPlayer.y += varPlayer.speed - vel + 1;
                }
            }
            this.remove();
            this.draw();
        }
    } else if (keys["down"]) {
        if (varPlayer.y > this.y && varPlayer.y < this.y + 10 && (varPlayer.x > this.x && varPlayer.x < this.x + this.size[0] ||
        varPlayer.x - varPlayer.size[0] > this.x && varPlayer.x - varPlayer.size[0] < this.x + this.size[0])) {
            this.y += vel;
            varPlayer.y -= varPlayer.speed - vel;
            for (let box in boxes) {
                if (this.y + this.size[1] >= boxes[box].y && this.y + this.size[1] <= boxes[box].y + 10 &&(this.x >= boxes[box].x && this.x <= boxes[box].x + boxes[box].size[0] || this.x + this.size[0] >= boxes[box].x && this.x + this.size[0] <= boxes[box].x + boxes[box].size[0])) {
                    this.y -= vel;
                    varPlayer.y -= varPlayer.speed - vel + 1;
                }
            }
            this.remove();
            this.draw();
        }
    } 
}

Player.prototype.movement = function () {
    if (keys["right"]) {
        if (this.angle == 0) this.x += this.size[1];
        if (this.angle == 180) this.y -= this.size[0];
        if (this.angle == 270) {
            this.x += this.size[1];
            this.y -= this.size[0];
        }
        this.angle = 90;
        this.x += this.speed;
        this.remove();
        this.draw();
        
    } else if (keys["left"]) {
        if (this.angle == 0) this.y += this.size[0];
        if (this.angle == 180) this.x -= this.size[1];
        if (this.angle == 90) {
            this.x -= this.size[1];
            this.y += this.size[0];
        }
        this.angle = 270;
        this.x -= this.speed;
        this.remove();
        this.draw();
    } else if (keys["up"]) {
        if (this.angle == 90) this.x -= this.size[0];
        if (this.angle == 180) {
            this.x -= this.size[0];
            this.y -= this.size[1];
        }
        if (this.angle == 270) this.y -= this.size[1];
        this.angle = 0;
        this.y -= this.speed;
        this.remove();
        this.draw();
    } else if (keys["down"]) {
        if (this.angle == 0) {
            this.x += this.size[0];
            this.y += this.size[1];
        }
        if (this.angle == 90) this.y += this.size[1];
        if (this.angle == 270) this.x += this.size[0];
        this.y += this.speed;
        this.angle = 180;
        this.remove();
        this.draw();
    }
}
// -------------------------- // -------------------------- //    



// -------------------------- General functions -------------------------- //    
Goal.prototype.isAbove = function (boxes=[]) {
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].x < this.x + 7 && boxes[i].x > this.x - 7 && boxes[i].y < this.y + 7 && boxes[i].y > this.y - 7) {
            return true;
        } 
    }
    return false;
}

let isAbove = function (goals, boxes) {
    let counter = 0;
    for (let i = 0; i < goals.length; i++) {
        if (goals[i].isAbove(boxes)) counter++;
    }
    if (counter == goals.length) {
        return true;
    } else {
        return false;
    }
}

let createSvg = function (dim) {
    $("#svgs").append('<svg id="main-svg" width="' + dim[0] + '" height="' + dim[1] + '" viewBox="0 0 ' + dim[0] + ' ' + dim[1] + ' "fill="none" ' + 'xmlns="http://www.w3.org/2000/svg"></svg>');
    window.svg = document.getElementById("main-svg");
}

let changeLevel = function () {
    div.innerHTML = "";
}

let finishMessage = function () {
    alert("Parabéns, você ganhou!")
}

let returnButtom = function () {
    $("#backicon").click(function () {
        window.varButtom = true;
    });
}
// -------------------------- // -------------------------- //    



// -------------------------- Levels -------------------------- //  
// Level 1  
let level1 = function () {
    let limits = [[10, 0, 310, 10], [0, 11, 11, 310], [11, 311, 310, 320], [310, 10, 320, 310], [10, 10, 110, 160], [10, 210, 161, 310], [160, 10, 310, 110], [210, 161, 311, 310]]

    let cen = new Cenario("images/cenario1.svg", [0, 0], [320, 320]);

    let goal1 = new Goal("goal1", [111, 11]);
    let goal2 = new Goal("goal2", [261, 111]);
    let goal3 = new Goal("goal3", [161, 261]);
    let goal4 = new Goal("goal4", [10, 162]);

    let box1 = new Box("box1", [113, 113], [45, 45], limits)
    let box2 = new Box("box2", [213, 113], [45, 45], limits);
    let box3 = new Box("box3", [163, 213], [45, 45], limits);
    let box4 = new Box("box4", [113, 163], [45, 45], limits)

    let player = new Player([171, 172], 0, [30, 30], limits);

    createSvg(cen.dim);

    cen.draw();

    goal1.draw();
    goal2.draw();
    goal3.draw();
    goal4.draw();

    box1.draw();
    box2.draw();
    box3.draw();
    box4.draw();

    player.draw();
    
    let loop = function () {
        player.draw();
        player.movement();
        player.watchCollision();
    
        box1.movement(player, [box2, box3, box4], 2);
        box2.movement(player, [box1, box3, box4], 2);
        box3.movement(player, [box1, box2, box4], 2);
        box4.movement(player, [box1, box2, box3], 2)
    
        box1.watchCollision(player, 2);
        box2.watchCollision(player, 2);
        box3.watchCollision(player, 2);
        box4.watchCollision(player, 2)
    
        let finish = isAbove([goal1, goal2, goal3, goal4], [box1, box2, box3, box4]);
    
        if (!finish && !varButtom) {
            requestAnimationFrame(loop);
        } else {
            if (!window.varButtom) window.level += 1;
            changeLevel();
            flow();
        }
    };
    loop();
}


// Level 2
let level2 = function () {
    let limits = [[10, 0, 310, 10], [0, 11, 11, 310], [11, 311, 310, 320], [310, 10, 320, 310], [10, 11, 60, 310], [59, 10, 110, 60], [59, 110, 111, 210], [211, 9, 261, 160], [260, 10, 310, 310]];

    let cen = new Cenario("images/cenario2.svg", [0, 0], [320, 320]);

    let goal1 = new Goal("goal1", [60, 211]);
    let goal2 = new Goal("goal2", [60, 261]);
    let goal3 = new Goal("goal3", [111, 261]);
    let goal4 = new Goal("goal4", [161, 261]);
    let goal5 = new Goal("goal4", [211, 261]);

    let box1 = new Box("box1", [113, 63], [45, 45], limits)
    let box2 = new Box("box2", [113, 113], [45, 45], limits);
    let box3 = new Box("box3", [163, 163], [45, 45], limits);
    let box4 = new Box("box4", [113, 213], [45, 45], limits)
    let box5 = new Box("box5", [163, 263], [45, 45], limits)


    let player = new Player([100, 71], 90, [30, 30], limits);

    createSvg(cen.dim);

    cen.draw();

    goal1.draw();
    goal2.draw();
    goal3.draw();
    goal4.draw();
    goal5.draw();

    box1.draw();
    box2.draw();
    box3.draw();
    box4.draw();
    box5.draw();

    player.draw();
    
    let loop = function () {
        player.draw();
        player.movement();
        player.watchCollision();
    
        box1.movement(player, [box2, box3, box4, box5], 2);
        box2.movement(player, [box1, box3, box4, box5], 2);
        box3.movement(player, [box1, box2, box4, box5], 2);
        box4.movement(player, [box1, box2, box3, box5], 2)
        box5.movement(player, [box1, box2, box3, box4], 2);
    
        box1.watchCollision(player, 2);
        box2.watchCollision(player, 2);
        box3.watchCollision(player, 2);
        box4.watchCollision(player, 2);
        box5.watchCollision(player, 2);
    
        let finish = isAbove([goal1, goal2, goal3, goal4, goal5], [box1, box2, box3, box4, box5]);
    
        if (!finish && !varButtom) {
            requestAnimationFrame(loop);
        } else {
            if (!window.varButtom) window.level += 1;
            changeLevel();
            flow();
        }
    };
    loop();
}



// Level 3
let level3 = function () {
    let limits = [[161, 161, 211, 260], [11, 260, 211, 310], [61, 62, 110, 109], [60, 161, 109, 209], [162, 12, 210, 109], [10, 0, 310, 8], [0, 0, 11, 319], [11, 310, 311, 319], [310, 0, 320, 319]]

    let cen = new Cenario("images/cenario3.svg", [0, 0], [320, 320]);

    let goal1 = new Goal("goal1", [261, 61]);
    let goal2 = new Goal("goal2", [261, 111]);
    let goal3 = new Goal("goal3", [261, 161]);

    let box1 = new Box("box1", [213, 63], [45, 45], limits)
    let box2 = new Box("box2", [213, 113], [45, 45], limits);
    let box3 = new Box("box3", [213, 163], [45, 45], limits);

    let player = new Player([221, 272], 0, [30, 30], limits);

    createSvg(cen.dim);

    cen.draw();

    goal1.draw();
    goal2.draw();
    goal3.draw();

    box1.draw();
    box2.draw();
    box3.draw();

    player.draw();
    
    let loop = function () {
        player.draw();
        player.movement();
        player.watchCollision();
    
        box1.movement(player, [box3, box2], 2);
        box2.movement(player, [box1, box3], 2);
        box3.movement(player, [box1, box2], 2);
    
        box1.watchCollision(player, 2);
        box2.watchCollision(player, 2);
        box3.watchCollision(player, 2);
    
        let finish = isAbove([goal1, goal2, goal3], [box1, box2, box3]);
    
        if (!finish && !varButtom) {
            requestAnimationFrame(loop);
        } else {
            if (!varButtom) {
                window.level += 1;
            } else {
                changeLevel();
            }
            flow();
        }
    };
    loop();
}

// -------------------------- // -------------------------- //    



// -------------------------- Main function -------------------------- //    
let flow = function () {
    window.varButtom = false;
    if (level == 1) {
        level1();
    } else if (level == 2) {
        level2();
    } else if (level == 3) {
        level3();
    } else {
        finishMessage();
    }
}
// -------------------------- // -------------------------- //    

flow();
returnButtom();

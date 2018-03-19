/*

Adapted from the Processing code found at https://processing.org/examples/bouncybubbles.html
and based on Keith Peter's Solution in Foundation Actionscript Animation: Making Things Move!
*/

var numSquigs = 20;
var spring = 0.05;
var gravity = 0.8;
var friction = -0.8;
var squigs =[];
var mic;

function setup() {

  img = loadImage("squig.png");

  // Create an Audio input
  mic = new p5.AudioIn();
  mic.start();

  createCanvas(windowWidth, windowHeight);
    for (var i = 0; i < numSquigs; i++) {

        squigs[i] = new Squig(random(width), random(height), random(30, 200), i, squigs);

    }
    noStroke();
    fill(255);
    // noLoop();
}

function draw() {
    background(108,255,150);

    for (var i = 0; i < squigs.length; i++) {
        squigs[i].collide();
        squigs[i].move();
        squigs[i].display();
    }


}


function Squig(xin, yin, din, idin, oin) {


    this.x = xin;
    this.y = yin;
    this.diameter = din;
    this.id = idin;
    this.others = oin;

    this.vx = 0;
    this.vy = 0;

    this.collide = function() {
        for (var i = this.id + 1; i < numSquigs; i++) {
            var dx = this.others[i].x - this.x;
            var dy = this.others[i].y - this.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var minDist = this.others[i].diameter / 2 + this.diameter / 2;

            if (distance < minDist) {
                var angle = atan2(dy, dx);
                var targetX = this.x + cos(angle) * minDist;
                var targetY = this.y + sin(angle) * minDist;
                var ax = (targetX - this.others[i].x) * spring;
                var ay = (targetY - this.others[i].y) * spring;
                this.vx -= ax;
                this.vy -= ay;
                this.others[i].vx += ax;
                this.others[i].vy += ay;
            }
        }
    }

    this.move = function() {

      var vol = mic.getLevel();
      print (vol/1.5);

      spring = vol/1.5;

        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x + this.diameter / 2 > width) {
            this.x = width - this.diameter / 2;
            this.vx *= friction;
        } else if (this.x - this.diameter / 2 < 0) {
            this.x = this.diameter / 2;
            this.vx *= friction;
        }
        if (this.y + this.diameter / 2 > height) {
            this.y = height - this.diameter / 2;
            this.vy *= friction;
        } else if (this.y - this.diameter / 2 < 0) {
            this.y = this.diameter / 2;
            this.vy *= friction;
        }

    }

    this.display = function() {

        image(img, this.x, this.y, this.diameter, this.diameter);
        push();
        translate(this.x,this.y)
        rotate( atan(this.vy/this.vx) );
        image(img, 0, 0, this.diameter, this.diameter);
        pop();

    }
}

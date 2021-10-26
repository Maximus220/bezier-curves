var dots = [];
var held = -1;
var radius = 10;

lerps = 0;
dotLerps = [];

var roc = 0.001; //Rate Of Change
var displayLerps = true;
var displayCurvatureCircles = false;
var displayVel = false;

function setup(){
    window.canvas = createCanvas(1000, 500).position(windowWidth/2-canvas.width/2, 20);
    window.canvas.parent('mainDiv');
    dots.push(createVector(50,50));
    dots.push(createVector(50,450));
    dots.push(createVector(950,450));
    dots.push(createVector(950,50));
    //angleMode(DEGREES)

    let canvasPlace = document.getElementById('mainDiv');
    var gui = new guify({
        title: 'Bezier Curves',
        theme: 'dark',
        align: 'right',
        width: 300,
        barMode: 'offset', // none, overlay, above, offset
        //panelMode: 'inner',
        opacity: 0.85,
        root: canvasPlace,
    });
    gui.Register({
        type: 'range',
        label: 'Rate of change',
        min: 0, max: 0.01, step: 0.0001,
        object: this, property: "roc"
    });
    gui.Register({
        type: 'checkbox',
        label: 'Display lerps',
        object: this,
        property: 'displayLerps'
    })
    gui.Register({
        type: 'checkbox',
        label: 'Display curvature circle',
        object: this,
        property: 'displayCurvatureCircles'
    })
    gui.Register({
        type: 'checkbox',
        label: 'Display velocity',
        object: this,
        property: 'displayVel'
    })
}

function draw(){
    background(100);

    //Final curve drawing
    let prevPoint = dots[0].copy();
    for(let i=0;i<=1;i+=0.01){
        push();
        stroke(15);
        strokeWeight(5);
        liV(prevPoint, mbezier(i));
        prevPoint = mbezier(i);
        //console.log(prevPoint);
        pop();
    }

    if(displayCurvatureCircles || displayLerps || displayVel){
        lerps<1 ? lerps+=roc : lerps=0;

        //Lerps computation
        dotLerps=[
            p5.Vector.lerp(dots[0],dots[1], lerps), 
            p5.Vector.lerp(dots[2],dots[3], lerps), 
            p5.Vector.lerp(dots[1],dots[2], lerps)
        ];
        dotLerps.push(p5.Vector.lerp(dotLerps[0],dotLerps[2], lerps));
        dotLerps.push(p5.Vector.lerp(dotLerps[2],dotLerps[1], lerps));
        dotLerps.push(p5.Vector.lerp(dotLerps[3],dotLerps[4], lerps));
    }

    if(displayCurvatureCircles){
        let curv = curvature(lerps);
        let circleCenter = dotLerps[5].copy().add(velocity(lerps).rotate(1/2*PI).setMag(1/curv));
        stroke(255, 204, 0);
        strokeWeight(2);
        liV(dotLerps[5], circleCenter);

        push();
        noFill();
        stroke(100, 150, 100);
        strokeWeight(5);
        elV(circleCenter, 1/curv * 2);
        pop();
    }

    if(displayVel){
        push();
        stroke(155, 255, 100);
        strokeWeight(5);
        liV(dotLerps[5], dotLerps[5].copy().add(velocity(lerps)));
        liV(dotLerps[5], dotLerps[5].copy().add(velocity(lerps).rotate(1/2*PI)));
        pop();
    }

    if(displayLerps){
        //Lerp lines
        stroke(255, 204, 0);
        strokeWeight(2);
        liV(dots[0],dots[1]);
        liV(dots[2],dots[3]);
        liV(dots[1],dots[2]);

        //Lerps of lerp
        stroke(255, 0, 241);
        liV(dotLerps[0],dotLerps[2]);
        liV(dotLerps[1],dotLerps[2]);
        stroke(50, 0, 241);
        liV(dotLerps[3],dotLerps[4]);

        //Lerp dots
        noStroke();
        fill('red')
        dotLerps.forEach((dot)=>{
            elV(dot, radius);
        });
    }

    noStroke();
    fill('black');
    dots.forEach((dot)=>{
        elV(dot, radius);
    });

}

function mbezier(t){
    return dots[0].copy().mult(-1*t**3+3*t**2-3*t+1).add(dots[1].copy().mult(3*t**3-6*t**2+3*t)).add(dots[2].copy().mult(-3*t**3+3*t**2)).add(dots[3].copy().mult(t**3));
}

function velocity(t){ //Derivative
    return dots[0].copy().mult(-3*t**2+6*t-3).add(dots[1].copy().mult(9*t**2-12*t+3)).add(dots[2].copy().mult(-9*t**2+6*t)).add(dots[3].copy().mult(3*t**2));
}

function acceleration(t){ //Derivative of the derivative
    return dots[0].copy().mult(-6*t+6).add(dots[1].copy().mult(18*t-12)).add(dots[2].copy().mult(-18*t+6)).add(dots[3].copy().mult(6*t));
}

function curvature(t){
    return velocity(t).mag() != 0 ? det(velocity(t), acceleration(t)) / velocity(t).mag()**3 : null;
}


//Commands
function mouseOnScreen(){return (mouseX>=0 && mouseX<=canvas.width && mouseY >=0 && mouseY<=canvas.height);}

function mousePressed(){
    if(mouseOnScreen()){
        dots.forEach((dot, i)=>{
            if(mouseX >= dot.x-radius && mouseX <= dot.x+radius && mouseY >= dot.y-radius && mouseY <= dot.y+radius){
                held = i;
            }
        });
    }
}

function mouseDragged(){
    if(mouseOnScreen()) dots[held] = createVector(mouseX, mouseY);
  }

function mouseReleased(){
    if(mouseOnScreen()) held = -1;
}
var dots = [];
var held = -1;
var radius = 10;

lerps = 0;
dotLerps = [];

function setup(){
    window.canvas = createCanvas(1000, 500).position(windowWidth/2-canvas.width/2, 20);
    dots.push(createVector(50,50));
    dots.push(createVector(50,450));
    dots.push(createVector(950,450));
    dots.push(createVector(950,50));
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

    //Lerps computation
    lerps<1 ? lerps+=0.001 : lerps=0;
    dotLerps=[
        p5.Vector.lerp(dots[0],dots[1], lerps), 
        p5.Vector.lerp(dots[2],dots[3], lerps), 
        p5.Vector.lerp(dots[1],dots[2], lerps)
    ];
    dotLerps.push(p5.Vector.lerp(dotLerps[0],dotLerps[2], lerps));
    dotLerps.push(p5.Vector.lerp(dotLerps[2],dotLerps[1], lerps));
    dotLerps.push(p5.Vector.lerp(dotLerps[3],dotLerps[4], lerps));

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

    noStroke();
    fill('black');
    dots.forEach((dot)=>{
        elV(dot, radius);
    });

}

function mbezier(t, tt){
    if (tt) console.log(dots[0].copy().mult(-1*t**3+3*t**2-3*t+1));
    return dots[0].copy().mult(-1*t**3+3*t**2-3*t+1).add(dots[1].copy().mult(3*t**3-6*t**2+3*t)).add(dots[2].copy().mult(-3*t**3+3*t**2)).add(dots[3].copy().mult(t**3));
}

//Commands
function mouseOnScreen(){return (mouseX>=0 && mouseX<=window.width && mouseY >=0 && mouseY<=window.height);}

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
    dots[held] = createVector(mouseX, mouseY);
  }

function mouseReleased(){
    if(mouseOnScreen()) held = -1;
}
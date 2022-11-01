var LegoScene = {}
App.scenes.lego = LegoScene

var selected
var array = []
var arrayFood =[]

class LegoButton {
  constructor(_x,_y,width,height,t) {
      this.x = _x
      this.y = _y
      this.w = width
      this.h = height
      this.color = [255,255,255]
      this.text = t
      this.r = 16
  }

  clicked() {
      //
  }

  draw() {
      push()
      var l = windowWidth/2 + this.x - this.w/2
      var t = windowHeight/2 + this.y - this.h/2
      var r = windowWidth/2 + this.x + this.w/2
      var b = windowHeight/2 + this.y + this.h/2
      this.hovered = (mouseX >= l && mouseX <= r && mouseY >= t && mouseY <= b)
      if (mouseIsPressed && !this.lastClick && this.hovered) {
          this.clicked()
      }
      this.lastClick = mouseIsPressed
      if (!this.hovered) {
          fill(...this.color)
      } else {
          cursor(HAND)
          var c = []
          for (var i = 0; i < 3; i++) {
              c[i] = this.color[i] * .9
          }
          fill(...c)
      }
      noStroke()
      translate(this.x, this.y)
      rect(-this.w/2, -this.h/2, this.w, this.h, this.r)
      textAlign(CENTER, CENTER)
      textFont("Segoe UI Symbol")
      textSize(22)
      fill(255)
      text(this.text, 0, 0)

      pop()
  }
}

var x
var y

LegoScene.menu = () => {
  LegoScene.state = "menu"
  LegoScene.score = 0
  LegoScene.level = 0
  array = []
  arrayFood =[]
  mousePressed = () => {}
  mouseReleased = () => {}
}

LegoScene.nextLevel = () => {
  LegoScene.level += 1
  LegoScene.state = "level"
}

dist = (a,b,c,d) => {
  return Math.sqrt(Math.pow(a - c, 2) + Math.pow(b - d, 2))
}

LegoScene.setup = () => 
{
  LegoScene.stack = new Stack() 
  LegoScene.states = {}

  var startButton = new LegoButton(-256, 200, 128, 48, "Start")
  startButton.color = [100, 255, 100]
  startButton.clicked = () => {
    LegoScene.nextLevel()
    mousePressed = () =>
    {
      for(var i= 0; i<array.length; i++)
      {
        var v=array [i]
        //x pos is v[0] y is v[1]

        if(dist(v[0],v[1],mouseX - (windowWidth/2 - 400),mouseY - (windowHeight/2 - 300))<50)
        {
          selected =v;
          
        }
      
      }
      for(var i= 0; i<arrayFood.length; i++)
      {
        var f=arrayFood[i]
        //x pos is v[0] y is v[1]

        if(dist(f[0],f[1],mouseX - (windowWidth/2 - 400),mouseY - (windowHeight/2 - 300))<50)
        {
          selected =f;
          
        }
      
      }
    }

    mouseReleased = () =>
    {
      if(selected != null && dist(selected[0],selected[1], 400,300)< 150){
        
        if(selected.length ==3)
        {
          var index = arrayFood.indexOf(selected)
          arrayFood.splice(index,1);
          
          spawnLego()
          spawnLego()
          spawnLego()
        
      //=Food


        }
        
      else{
        var index = array.indexOf(selected)
        array.splice(index,1);
        LegoScene.score++
        levelInc()
        sound1.play();

      }

      }
      if(selected != null && dist(selected[0],selected[1],650, 450)< 100){
        
        if(selected.length ==3)
        {
          var index = arrayFood.indexOf(selected)
          arrayFood.splice(index,1);
          
        
        }
      }
      selected = null;
    }
  }
  var backButton = new LegoButton(-256+160, 200, 128, 48, "Menu")
  backButton.color = [255, 100, 100]
  backButton.clicked = () => App.load_scene("menu")
  LegoScene.states.menu = () => {
      startButton.draw()
      backButton.draw()

      fill(0)
      textFont("Franklin Gothic Medium")
      textSize(64)
      textAlign(CENTER, CENTER)
      text("Lego Mania", 0, -100)

      fill(0)
      textFont("Segoe UI Symbol")
      textSize(24)
      textAlign(CENTER, TOP)
      text("Clean up the legos- but be sure not to put food in the pile!", 0, -100 + 40)
  }
  
  LegoScene.states.level = () => {
  push()
  translate(-400, -300)
  time += deltaTime/1000;

  if((time - lastSpawn) >= 1.2+(1.2)*Math.pow(.95, LegoScene.level-1)) {
    lastSpawn = time
    spawnLego()
    if (Math.random() < .1) {
    spawnFood()
    }
  }

  background(220)
  {
 // imageMode(CENTER)
 let drawImg =  image(img4, -100,0, img4.width/3,  img4.height/3)
  //imgAlign(CENTER)
  }
  strokeWeight(4);
  stroke(51)
  fill('red');
  circle(400,300,250);
fill('white');
  circle(400,300,200);
  fill('red');
  circle(400,300,150);
   fill('white');
  circle(400,300,100);
  fill('red');
  circle(400,300,50);

let drawImg = image(img6, 650,450, img6.width / 2, img6.height /2)

  
  for(var i= 0; i<array.length; i++){
    var v=array [i]
    if(v[3]==1)
    {
      
       let drawImg = image(img1, v[0]-img1.width/16 ,v[1]-img1.height/16, img1.width / 8, img1.height / 8);
       
    }
    if(v[3]==0)
    {
       let drawImg = image(img2, v[0]-img2.width/16 ,v[1]-img2.height/16, img2.width / 8, img2.height / 8);
    
    }
     if(v[3]==2)
    {
       let drawImg = image(img3, v[0]-img3.width/16 ,v[1]-img3.height/16, img3.width / 8, img3.height / 8);
    
    }
  }

  for(var i=0; i<arrayFood.length; i++)
  {
    var f=arrayFood[i]
    let drawImg = image(img5, f[0]-img5.width/16 ,f[1]-img5.height/16, img5.width / 8, img5.height / 8)


  }
  if(selected)
  {
    selected[0]= mouseX - (windowWidth/2 - 400);
    selected[1]= mouseY - (windowHeight/2 - 300);
  }
 

  if(array.length + arrayFood.length >= 20)
  {
    LegoScene.menu();
}

///////GAME DISPLAY//////////////////////
   fill(255)
   //noStroke()
    textFont("Segoe UI Symbol")
    textAlign(LEFT, TOP)
    textSize(24)
    text("LEVEL", 16, 16 + 20)
    var w = textWidth("LEVEL") + 8
    textSize(48)
    text(LegoScene.level, 16 + w, 16)
    
   // noStroke()
    textAlign(LEFT, TOP)
    textSize(24)
    text("SCORE", 16, 16 + 20 + 48)
    var w = textWidth("SCORE") + 8
    textSize(48)
    text(LegoScene.score, 16 + w, 16 + 48)
    
    
  pop()
//////////////////////////////////////////////////
  }

  LegoScene.stack.add(() => {
      translate(windowWidth/2, windowHeight/2)
      background(200)
      fill(255);
      noStroke();
      rect(-400,-300,800,600);
  })
  LegoScene.stack.add(() => {
    LegoScene.states[LegoScene.state]()
  })
  LegoScene.menu()

}

LegoScene.draw = () => 
{ 
  LegoScene.stack.run()
}



var xPos;
var yPos;
var colorRandom;
var time =0;
var lastSpawn =0;







function spawnLego() {
 xPos = Math.floor(Math.random(0)*800)
 yPos =  Math.floor(Math.random(0)*600)
 while (dist(xPos, yPos, 400, 300) < 150) {
  xPos = Math.floor(Math.random(0)*800)
  yPos =  Math.floor(Math.random(0)*600)
 }
 colorRandom=  Math.floor(Math.random(0)*3)
 array.push([xPos, yPos, true, colorRandom])
  //array =[[xPos, yPos, true, colorRandom]]
}
function spawnFood()
{
   xPos = Math.floor(Math.random(0)*800)
 yPos =  Math.floor(Math.random(0)*600)
 while (dist(xPos, yPos, 400, 300) < 150) {
  xPos = Math.floor(Math.random(0)*800)
  yPos =  Math.floor(Math.random(0)*600)
 }
 arrayFood.push([xPos, yPos,true ])

}

function levelInc()
{
  if(LegoScene.score%10==0 && LegoScene.score != 0)
  {
    LegoScene.level++;
  }

}
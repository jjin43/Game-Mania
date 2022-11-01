var TypeScene = {}
App.scenes.typing = TypeScene

class TypeButton {
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

var difficulties = [[],[],[],[],[]]

TypeScene.generateWord = () => {
  var diff = Math.floor((TypeScene.level - 1) / 5)
  diff = Math.max(0, Math.min(diff, difficulties.length - 1))
  var list = difficulties[diff]
  return list[Math.floor(Math.random() * list.length)]
}

class Meteor {
  constructor() {
    this.word = TypeScene.generateWord();
    this.speed = TypeScene.meteorSpeed;
    this.typed = 0;
    this.x = 50 + 700 * Math.random();
    this.y = -75;
    this.finishTime = 0
    TypeScene.meteors.push(this)
  }

  type(letter) {
    if (this.isRight(letter)) {
      this.typed += 1
      if (this.typed == this.word.length) {
        var ind = TypeScene.meteors.indexOf(this)
        TypeScene.meteors.splice(ind, 1)
        TypeScene.score += 1
        TypeScene.sound.play()
        if (TypeScene.score % 5 == 0) {
          TypeScene.nextLevel();
        }
        TypeScene.selected = null
        TypeScene.alreadyTyped.push(this)
      } else {
        TypeScene.destroy.play()
      }
    }
  }

  backspace() {
    if (this.typed > 0) {
      this.typed -= 1
      if (this.typed == 0) {
        TypeScene.selected = null
      }
    }
  }

  isRight(letter) {
    return letter.toUpperCase() == this.word.substring(this.typed, this.typed + 1).toUpperCase()
  }

  draw() {
    textFont("Segoe UI Symbol")
    textSize(16)
    textAlign(LEFT, CENTER)
    var ts = textWidth(this.word)

    fill(255, 0, 0)
    this.y += this.speed * deltaTime/1000
    circle(this.x, this.y, ts + 16)

    fill(0)
    if (TypeScene.selected == this) {
      fill(255)
    }
    text(this.word, this.x - ts/2, this.y)
    
    fill(0,255,0)
    text(this.word.substring(0, this.typed), this.x - ts/2, this.y)

    if (this.y > 600 + 75) {
      var ind = TypeScene.meteors.indexOf(this)
      TypeScene.meteors.splice(ind, 1)
      TypeScene.lives -= 1
      return true
    }
  }

  drawTyped() {
    textFont("Segoe UI Symbol")
    textSize(16)
    textAlign(LEFT, CENTER)
    var ts = textWidth(this.word)

    this.finishTime += deltaTime/1000
    if (this.finishTime > 0.5) {
      var ind = TypeScene.alreadyTyped.indexOf(this)
      TypeScene.alreadyTyped.splice(ind, 1)
      return true
    }
    this.speed += 250 * deltaTime/1000
    this.y += this.speed * deltaTime/1000
    var a = (0.5 - this.finishTime) / 0.5 * 255
    fill(0, 255, 0, a)
    circle(this.x, this.y, ts + 16)

  }
}

var x
var y

TypeScene.menu = () => {
  TypeScene.state = "menu"
  TypeScene.score = 0
  TypeScene.level = 0
  TypeScene.lives = 5
  TypeScene.nextLife = 25
  TypeScene.meteors = []
}

TypeScene.nextLevel = () => {
  TypeScene.levelSound.play()
  TypeScene.level += 1
  TypeScene.meteorSpeed = 25 + (5 * TypeScene.level / 5)
  TypeScene.state = "level"
  TypeScene.fallTime = 2 + 3 * Math.pow(0.95, TypeScene.level - 1)
  TypeScene.meteorTime = TypeScene.fallTime
  new Meteor()
}

var wordsList = []

preload = () => {
  wordsList = loadStrings('words.txt')
  MazeScene.sound = new p5.SoundFile("sounds/coin.wav")
  MazeScene.hurt = new p5.SoundFile("sounds/hitHurt.wav")
  MazeScene.levelSound = new p5.SoundFile("sounds/powerUp.wav")
  TypeScene.destroy = new p5.SoundFile("sounds/hitHurt.wav")
  TypeScene.levelSound = new p5.SoundFile("sounds/powerUp.wav")
}

TypeScene.init = () => {
  for (var i = 0; i < wordsList.length; i++) {
    var v = wordsList[i]
    var diff = v.length - 3
    if (difficulties[diff]) {
      difficulties[diff].push(v);
    }
  }
}

TypeScene.setup = () => 
{
  if (!TypeScene.initialized) {
    TypeScene.init()
    TypeScene.initialized = true
  }
  TypeScene.stack = new Stack() 
  TypeScene.states = {}
  TypeScene.meteors = []
  TypeScene.alreadyTyped = []
  TypeScene.stars = []
  TypeScene.sound = new p5.SoundFile("sounds/coin.wav")
  for (var i = 0; i < 50; i++) {
    TypeScene.stars.push([
      800 * Math.random(),
      600 * Math.random(),
       + 5 * Math.random()
    ])
  }

  TypeScene.meteorTime = 5

  var startButton = new TypeButton(-256, 200, 128, 48, "Start")
  startButton.color = [100, 255, 100]
  startButton.clicked = () => {
    TypeScene.nextLevel()
  }
  var backButton = new TypeButton(-256+160, 200, 128, 48, "Menu")
  backButton.color = [255, 100, 100]
  backButton.clicked = () => App.load_scene("menu")
  TypeScene.states.menu = () => {
      startButton.draw()
      backButton.draw()

      fill(0)
      textFont("Franklin Gothic Medium")
      textSize(64)
      textAlign(CENTER, CENTER)
      text("Type Mania", 0, -100)

      fill(0)
      textFont("Segoe UI Symbol")
      textSize(24)
      textAlign(CENTER, TOP)
      text("Type the words before the meteor hits the bottom!", 0, -100 + 40)
  }
  
  TypeScene.states.level = () => {
    push()
    translate(-400, -300)

    fill(0)
    rect(0, 0, 800, 600)

    fill(255)
    for (var i = 0; i < TypeScene.stars.length; i++) {
      var v = TypeScene.stars[i]
      var a = i
      var x = v[0]
      var y = v[1]
      var r = v[2]
      x += r * Math.sin(millis()/1000 + a)
      y += r * Math.cos(millis()/1000 + a)
      circle(x, y, r)
    }

    fill(255)
    textFont("Segoe UI Symbol")
    textAlign(LEFT, TOP)
    textSize(24)
    text("LEVEL", 16, 16 + 20)
    var w = textWidth("LEVEL") + 8
    textSize(48)
    text(TypeScene.level, 16 + w, 16)
    
    textAlign(LEFT, TOP)
    textSize(24)
    text("SCORE", 16, 16 + 20 + 48)
    var w = textWidth("SCORE") + 8
    textSize(48)
    text(TypeScene.score, 16 + w, 16 + 48)
    
    textAlign(LEFT, TOP)
    textSize(24)
    text("LIVES", 16, 16 + 20 + 48 * 2)
    var w = textWidth("LIVES") + 8
    textSize(48)
    text(TypeScene.lives, 16 + w, 16 + 48 * 2)

    fill(100);
    rect(100,520,600,70);
    if (TypeScene.selected != null) {
      var meteorText = TypeScene.selected.word.substring(0, TypeScene.selected.typed)
      textFont("Segoe UI Symbol")
      textSize(50);
      textAlign(LEFT, CENTER)
      var w = textWidth(TypeScene.selected.word)/2
      fill(150)
      text(TypeScene.selected.word, 400 - w, 555);
      fill(255)
      text(meteorText, 400 - w, 555);
    }

    TypeScene.meteorTime -= deltaTime / 1000;
    if (TypeScene.meteorTime < 0) {
      new Meteor();
      TypeScene.meteorTime = TypeScene.fallTime;
    }

    if (TypeScene.lives <= 0) {
      TypeScene.menu()
    }
    
    var removed = 0
    for (i = 0; i < TypeScene.meteors.length; i++) {
      if (TypeScene.meteors[i - removed].draw()) {
        removed += 1
      }
    }

    var removed = 0
    for (i = 0; i < TypeScene.alreadyTyped.length; i++) {
      if (TypeScene.alreadyTyped[i - removed].drawTyped()) {
        removed += 1
      }
    }
  
    pop()
  }
-
  TypeScene.stack.add(() => {
      translate(windowWidth/2, windowHeight/2)
      background(200)
      fill(255);
      noStroke();
      rect(-400,-300,800,600);
  })
  TypeScene.stack.add(() => {
    TypeScene.states[TypeScene.state]()
    fill(200);
    noStroke();
    rect(-400, -300 - 200, 800, 200)
    rect(-400, 300, 800, 200)
  })
  TypeScene.menu()

  keyPressed = () => {
    if (TypeScene.state == "level" && TypeScene.selected != null) {
      if (keyCode == BACKSPACE) {
        TypeScene.selected.backspace()
      }
    }
  }
  keyTyped = () => {
    if (TypeScene.state == "level") {
      if (TypeScene.selected == null) {
        for (var i = 0; i < TypeScene.meteors.length; i++) {
          var v = TypeScene.meteors[i]
          if (v.word.substring(0,1).toUpperCase() == key.toUpperCase()) {
            TypeScene.selected = v
            v.type(key)
            return
          }
        }
      } else {
        TypeScene.selected.type(key)
      }
    }
  }

}

TypeScene.draw = () => 
{ 
  TypeScene.stack.run()
}
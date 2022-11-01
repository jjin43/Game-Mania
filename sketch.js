var App = {}
App.events = {}
App.scenes = {}
App.scene = null

App.load_scene = (scene) => {
  App.scene = App.scenes[scene]
  App.scene.setup()
}

class Stack {
  constructor() {
    this.list = []
  }
  run() {
    for (var i = 0; i < this.list.length; i++) {
      this.list[i]()
    }
  }
  add(func) {
    this.list.push(func)
  }
}

class Event {
  constructor() {
    this.list = []
  }
  add(func) {
    this.list.append(func)
  }
  fire(...args) {
    for (var i = 0; i < this.list.length; i++) {
      this.list[i](...args)
    }
  }
}

function setup() {
  createCanvas(windowWidth - 1, windowHeight - 1);
  var keys = Object.keys(App.scenes)
  App.load_scene("menu")
  
  img1 = loadImage('images/lego_PNG9.png');
  img2 = loadImage('images/bluelego.png')
 // changeColor
  img3 = loadImage('images/greenlego.png')
  sound1=loadSound('assets/ding.wav')
  img4 = loadImage('images/legobackground.jpg')
  img5 = loadImage('images/Food-Free-Download-PNG.png')
  //image(img4, 300,400, img4.width / 8, img4.height / 8))
  img6 = loadImage('images/Trash-Can-PNG-Pic.png')
}

function draw() {
  cursor(CROSS)
  push()
  resizeCanvas(windowWidth - 1, windowHeight - 1)
  background(255)
  if (App.scene) {
    App.scene.draw()
  }
  pop()
}

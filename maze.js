var MazeScene = {}
App.scenes.maze = MazeScene

class MazeButton {
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

MazeScene.menu = () => {
    MazeScene.state = "menu"
    MazeScene.score = 0
    MazeScene.level = 0
    MazeScene.lives = 5
    MazeScene.nextLife = 25
}

MazeScene.nextLevel = () => {
    MazeScene.levelSound.play()
    MazeScene.lava = 0
    MazeScene.lavaCooldown = -3000
    MazeScene.level += 1
    MazeScene.state = "level"
    var stages = MazeScene.stages
    MazeScene.stage = stages[Math.floor(Math.random() * stages.length)]
    MazeScene.stage[1] = []
    for (i = 0; i < MazeScene.stage[2].length; i++) {
      var newCoin = [...MazeScene.stage[2][i]]
      if (MazeScene.level % 2 == 1) {
        newCoin[0] = -newCoin[0]
        newCoin[1] = -newCoin[1]
      }
      MazeScene.stage[1].push(newCoin)
    }
}

var tri = (a) => {
  a = (a % 1) * 2
  if (a < 1) {
    return a - .5
  }
  return 2 - a - .5
}

MazeScene.setup = () => {
    MazeScene.stack = new Stack()
    MazeScene.events = {}
    MazeScene.states = {}
    MazeScene.stages = [
        [() => {
            noFill()
            stroke(200)
            strokeWeight(Math.max(32, 130 - 2 * MazeScene.level))
            line(-256, 200, 256, -200)
        }, [], [
            [-128, 100, 16, 1],
            [0, 0, 16, 1],
            [128, -100, 16, 1]
        ]],
        [() => {
            noFill()
            stroke(200)
            strokeWeight(Math.max(48, 129 - 1 * MazeScene.level))
            rect(-256, -200, 512, 400, 32)
        }, [], [
            [0, -200, 16, 1],
            [-256, 0, 16, 1],
            [0, 200, 16, 1],
            [256, 0, 16, 1]
        ]],
        [() => {
            noFill()
            stroke(200)
            strokeWeight(Math.max(32, 130 - 1.5 * MazeScene.level))
            line(-256, 200, -256 + 512/3, -200)
            line(-256 + 2 * 512/3, 200, -256 + 512/3, -200)
            line(-256 + 2 * 512/3, 200, 256, -200)
        }, [], [
            [-256 + 2 * 512/3, 200, 16, 1],
            [-256 + 512/3, -200, 16, 1]
        ]],
        [() => {
          noFill()
          stroke(200)
          strokeWeight(Math.max(64, 128 - 1.5 * MazeScene.level))
          push()
          var speed = .5 * (1 + MazeScene.level/50)
          rotate(millis()/1000 * speed)
          line(-128,100,128,-100)
          pop()
          line(-256, 200, -128, 100)
          line(256, -200, 128, -100)
        }, [], [
          [-128, 100, 16, 1],
          [128, -100, 16, 1],
          [-100, -128, 24, 3],
          [100, 128, 24, 3]
        ]],
        [() => {
          noFill()
          stroke(200)
          strokeWeight(Math.max(64, 128 - 1.5 * MazeScene.level))
          push()
          var speed = .5 * (1 + MazeScene.level/50)
          var t = millis()/1000 * speed
          var s = [-256, 200]
          var e = [256, -200]
          var p = (a) => {
            var np = [s[0] + (e[0] - s[0]) * a, s[1] + (e[1] - s[1]) * a]
            np[1] += Math.sin((t / 4 + a) * 4 * Math.PI) * 50 * Math.sin(a * Math.PI)
            return np
          }
          for (var a = 0; a < 1; a += .01) {
            var n = a + .01
            var sp = p(a)
            var ep = p(n)
            line(...sp, ...ep)
          }
        }, [], [
          [-128, 100, 16, 1],
          [0, 0, 16, 1],
          [128, -100, 16, 1],
        ]],
        [() => {
          noFill()
          stroke(200)
          strokeWeight(Math.max(64, 128 - 1.5 * MazeScene.level))
          push()
          var speed = .5 * (1 + MazeScene.level/50)
          var t = millis()/1000 * speed
          var s = [-256, 200]
          var e = [256, -200]
          var p = (a) => {
            var np = [s[0] + (e[0] - s[0]) * a, s[1] + (e[1] - s[1]) * a]
            np[1] += tri((t / 4 + a) * 2) * 100 * Math.sin(a * Math.PI)
            return np
          }
          for (var a = 0; a < 1; a += .01) {
            var n = a + .01
            var sp = p(a)
            var ep = p(n)
            line(...sp, ...ep)
          }
        }, [], [
          [-128, 100, 16, 1],
          [0, 0, 16, 1],
          [128, -100, 16, 1],
        ]],
        [() => {
          noFill()
          stroke(200)
          strokeWeight(Math.max(64, 128 - 1.5 * MazeScene.level))
          push()
          var speed = .5 * (1 + MazeScene.level/50)
          var t = millis()/1000 * speed
          var s = [-256, 200]
          var e = [256, -200]
          var p = (a) => {
            var np = [s[0] + (e[0] - s[0]) * a, s[1] + (e[1] - s[1]) * a]
            np[1] += Math.sin(t * 2 * speed * Math.PI) * Math.sin(a * Math.PI) * 100
            return np
          }
          for (var a = 0; a < 1; a += .01) {
            var n = a + .01
            var sp = p(a)
            var ep = p(n)
            line(...sp, ...ep)
          }
        }, [], [
          [-128, 100, 16, 1],
          [0, 0, 16, 1],
          [128, -100, 16, 1],
        ]],
    ]
    MazeScene.state = "menu"

    MazeScene.stack.add(() => {
        translate(windowWidth/2, windowHeight/2)
        if (MazeScene.state == "level") {
            background(255, 100, 100)
        } else {
            background(200)
            fill(255);
            noStroke();
            rect(-400,-300,800,600);
        }
    })
    MazeScene.stack.add(() => {
        MazeScene.states[MazeScene.state]()
    })

    var startButton = new MazeButton(-256, 200, 128, 48, "Start")
    startButton.color = [100, 255, 100]
    startButton.clicked = () => MazeScene.nextLevel()
    var backButton = new MazeButton(-256+160, 200, 128, 48, "Menu")
    backButton.color = [255, 100, 100]
    backButton.clicked = () => App.load_scene("menu")
    MazeScene.states.menu = () => {
        startButton.draw()
        backButton.draw()

        fill(0)
        textFont("Franklin Gothic Medium")
        textSize(64)
        textAlign(CENTER, CENTER)
        text("Maze Mania", 0, -100)

        fill(0)
        textFont("Segoe UI Symbol")
        textSize(24)
        textAlign(CENTER, TOP)
        text("Get to the other side, and don't touch the lava!", 0, -100 + 40)
    }
    MazeScene.states.level = () => {
        noStroke()
        if (MazeScene.level % 2 == 0) {
            fill(100, 255, 100)
        } else {
            fill(200)
        }
        circle(-256,200, 128)
        if (MazeScene.level % 2 == 1) {
            fill(100, 255, 100)
        } else {
            fill(200)
        }
        circle(256,-200, 128)

        push()
        if (MazeScene.level % 2 == 1) {
          rotate(Math.pi)
        }
        MazeScene.stage[0]()
        pop()
        MazeScene.lava += deltaTime
        MazeScene.drawLava()

        if (MazeScene.lava < MazeScene.lavaCooldown + 3000) {
            cursor(MOVE)
        }

        var c = get(mouseX, mouseY)
        if (c[0] > 200 && c[1] < 200 && c[2] < 200 && MazeScene.lava >= MazeScene.lavaCooldown + 3000) {
            MazeScene.lives--
            MazeScene.hurt.play()
            MazeScene.lavaCooldown = MazeScene.lava
            if (MazeScene.lives == 0) {
                MazeScene.menu()
            }
        }
        
        if (MazeScene.level % 2 == 0) {
            fill(100, 255, 100)
            strokeWeight(2)
            stroke(0)
        } else {
            fill(200)
            noStroke()
        }
        circle(-256,200, 128)
        if (MazeScene.level % 2 == 1) {
            fill(100, 255, 100)
            strokeWeight(2)
            stroke(0)
        } else {
            fill(200)
            noStroke()
        }
        circle(256,-200, 128)

        var p = [-256, 200]
        if (MazeScene.level % 2 == 1) {
            p = [256, -200]
        }
        p = [p[0] + windowWidth/2, p[1] + windowHeight/2]
        var d = dist(mouseX, mouseY, p[0], p[1])
        if (d <= 64 - 8) {
            MazeScene.nextLevel()
        }

        MazeScene.drawLava()

        fill(100, 255, 100)
        strokeWeight(2)
        stroke(0)
        if (MazeScene.level % 2 == 0) {
            circle(-256,200, 128)
        } else {
            circle(256,-200, 128)
        }

        MazeScene.drawCoins()

        pop()

        fill(255)
        textFont("Segoe UI Symbol")
        textSize(48)
        textAlign(RIGHT, BOTTOM)
        text(MazeScene.level, windowWidth/2 - 16, windowHeight/2 - 16)
        var w = textWidth(MazeScene.level)
        textSize(24)
        text("LEVEL", windowWidth/2 - 16 - w - 4, windowHeight/2 - 16 - 6)
        
        textFont("Segoe UI Symbol")
        textSize(36)
        textAlign(RIGHT, BOTTOM)
        text(MazeScene.lives, windowWidth/2 - 20, windowHeight/2 - 16 - 48)
        var w = textWidth(MazeScene.lives)
        textSize(18)
        text("LIVES", windowWidth/2 - 20 - w - 4, windowHeight/2 - 16 - 48 - 4)
        
        textFont("Segoe UI Symbol")
        textSize(36)
        textAlign(RIGHT, BOTTOM)
        text(MazeScene.score, windowWidth/2 - 20, windowHeight/2 - 16 - 48 - 36)
        var w = textWidth(MazeScene.score)
        textSize(18)
        text("SCORE", windowWidth/2 - 20 - w - 4, windowHeight/2 - 16 - 48 - 36 - 4)

        push()
        translate(windowWidth/2, windowHeight/2)
    }

    MazeScene.menu()

    keyPressed = () => { //overwrites keyPressed so that other scenes can capture it when they need it
  
    }
}

MazeScene.drawCoins = () => {
    fill(255, 255, 0)
    stroke(0)
    strokeWeight(2)
    var removed = 0
    for (i = 0; i < MazeScene.stage[1].length; i++) {
        var v = MazeScene.stage[1][i - removed]
        if (dist(mouseX - windowWidth/2, mouseY - windowHeight/2, v[0], v[1]) <= 16) {
            MazeScene.score += MazeScene.stage[1][i - removed][3]
            MazeScene.stage[1].splice(i - removed, 1)
            MazeScene.sound.play()
            removed++
        }
    }
    if (MazeScene.score >= MazeScene.nextLife) {
        MazeScene.lives++
        MazeScene.nextLife += 25
    }
    for (i = 0; i < MazeScene.stage[1].length; i++) {
        circle(MazeScene.stage[1][i][0], MazeScene.stage[1][i][1], MazeScene.stage[1][i][2])
    }
    noStroke()
}

MazeScene.drawLava = () => {
    var c = MazeScene.level % 2
    var p = [400 - 800 * c, -300 + 600 * c]

    var o = c * 2 - 1
    var s = 10 + MazeScene.level
    var t = Math.max(MazeScene.lava/1000 - 3, 0)
    var x = 4  * s * t
    var y = -3 * s * t

    fill(255, 100, 100)
    noStroke()
    triangle(
        p[0] + x * o, p[1],
        p[0], p[1],
        p[0], p[1] + y * o
    )
}

MazeScene.draw = () => {
    MazeScene.stack.run()
}
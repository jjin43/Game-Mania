var MenuScene = {}
App.scenes.menu = MenuScene

class MenuButton {
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

        if (this.hovered) {
            fill(255)
            rect(-this.w/2, this.h/2 + 16, this.w, 32 + this.lines * 18)
            triangle(-16, this.h/2 + 16,
                0, this.h/2 + 16 - 24,
                16, this.h/2 + 16)
            fill(0)
            textSize(16)
            textAlign(LEFT, TOP)
            text(this.desc, -this.w/2 + 16, this.h/2 + 16 + 16, this.w - 32)
        }

        pop()
    }
}

MenuScene.setup = () => {
    MenuScene.stack = new Stack()
    MenuScene.events = {}
    MenuScene.objects = []

    MenuScene.stack.add(() => {
        translate(windowWidth/2, windowHeight/2)
        background(150)
        fill(200)
        noStroke()
        rect(-300,-200,600,400)
    })
    MenuScene.stack.add(() => {
        for (var i = 0; i < MenuScene.objects.length; i++) {
            MenuScene.objects[i].draw()
        }

        fill(255)
        textFont("Franklin Gothic Medium")
        textSize(64)
        textAlign(CENTER, CENTER)
        text("Game Mania!", 0, -100)
    })

    var button1 = new MenuButton(-176, 32, 160, 48, "Lego Mania")
    button1.desc = "Drag the legos to the target to get points!"
    button1.color = [255, 50, 50] // Red
    button1.lines = 3
    MenuScene.objects.push(button1)
    button1.clicked = () => {
        App.load_scene("lego")
    }
    var button2 = new MenuButton(0, 32, 160, 48, "Maze Mania")
    button2.desc = "Make sure your mouse doesn't fall out of this shrinking maze!"
    button2.color = [80, 160, 255] // Blue
    button2.lines = 4
    MenuScene.objects.push(button2)
    button2.clicked = () => {
        App.load_scene("maze")
    }
    var button3 = new MenuButton(176, 32, 160, 48, "Type Mania")
    button3.desc = "Type words to destroy the asteroids!"
    button3.color = [0, 255, 150] // Green
    button3.lines = 3
    MenuScene.objects.push(button3)
    button3.clicked = () => {
        App.load_scene("typing")
    }

    keyPressed = () => { //overwrites keyPressed so that other scenes can capture it when they need it
  
    }
}

MenuScene.draw = () => {
    MenuScene.stack.run()
}
import {
        init,
        initKeys,
        keyPressed,
        Scene,
        Sprite,
        GameLoop,
        collides,
        clamp,
       } from "kontra";

let { canvas } = init();

initKeys();

const gravity = 0.05;

let sprite = Sprite({
    x: 100, // starting x,y position of the sprite
    y: 80,
    color: "red", // fill color of the sprite rectangle
    width: 200, // width and height of the sprite rectangle
    height: 40,
    isOnGround: false,
    ddy: gravity,
    update: function () {
        this.advance();
        
        this.dx = clamp(-5, 5, this.dx);
        this.dy = clamp(-5, 5, this.dy);
    }
});


let background = Sprite({
    x: 0,
    y: 550,
    color: "blue",
    width: 300,
    height: 20,
})

let background2 = Sprite({
    x: -50,
    y: 650,
    color: "blue",
    width: 50,
    height:10,
});

let scene = Scene({
    id: 'game',
    children: [sprite, background, background2],
    checkHeroGround: children => {
        let hero = children[0]

        let prevFrameHero = { ...hero };
        
        hero.advance();

        for(let i = 1 ; i < children.length ; i++) {
            if (collides(hero, children[i])) {
                let collider = children[i];
                if (prevFrameHero.position.x + prevFrameHero._w > collider.x &&
                    prevFrameHero.position.x < collider.x + collider.width) {
                    if (prevFrameHero.position.y > collider.y) {
                        hero = Object.assign(hero, prevFrameHero);
                        hero.dy = clamp(0, 5, hero.dy);
                        hero.y = collider.y + collider.height;
                    } else {
                        hero = Object.assign(hero, prevFrameHero);
                        hero.isOnGround = true;
                        hero.dy = clamp(-5, 0, hero.dy);
                        hero.y = collider.y - hero.height;
                    }
                } else if (prevFrameHero.position.x + prevFrameHero._w <= collider.x) {
                    let xa = prevFrameHero.position.x + prevFrameHero._w;
                    let xb = hero.x + hero.width;
                    let ya = prevFrameHero.position.y + prevFrameHero._h;
                    let yb = hero.y + hero.height;

                    let a = (yb - ya) / (xb - xa);
                    let b = ya - a * xa;
                    let yCollision = a * collider.x + b;

                    if (yCollision < collider.y) {
                        console.log("Corner up");
                        hero = Object.assign(hero, prevFrameHero);
                        hero.isOnGround = true;
                        hero.dy = 0;
                        hero.y = collider.y - hero.height;
                    } else {
                        console.log("Corner down");
                        hero = Object.assign(hero, prevFrameHero);
                        hero.dx = 0;
                        hero.x = collider.x - hero.width;
                    }
                } else {
                    let xa = hero.x;
                    let xb = prevFrameHero.position.x;
                    let ya = hero.y + hero.height;
                    let yb = prevFrameHero.position.y + prevFrameHero._h;

                    let a = (yb - ya) / (xb - xa);
                    let b = ya - a * xa;
                    let yCollision = a * collider.x + b;

                    if (yCollision < collider.y) {
                        console.log("Corner up");
                        hero = Object.assign(hero, prevFrameHero);
                        hero.isOnGround = true;
                        hero.dy = 0;
                        hero.y = collider.y - hero.height;
                    } else {
                        console.log("Corner down");
                        hero = Object.assign(hero, prevFrameHero);
                        hero.dx = 0;
                        hero.x = collider.x + collider.width;
                    }
                }
                return
            }
        }
        hero = Object.assign(hero, prevFrameHero);
        hero.isOnGround = false;
        hero.ddy = gravity;
    }
});

let loop = GameLoop({
    // create the main game loop
    update: function () {
        // update the game state
        sprite.update();
        scene.lookAt(sprite);
        if (keyPressed('a')) {
            sprite.dx = -2;
        } else if (keyPressed('d')) {
            sprite.dx = 2;
        } else {
            sprite.dx = 0;
        }
        if (keyPressed('w') && sprite.isOnGround) {
            sprite.dy = -20;
        }
        scene.checkHeroGround(scene.children)
        // wrap the sprites position when it reaches
        // the edge of the screen
        if (sprite.x > canvas.width) {
        sprite.x = -sprite.width;
        }
    },
    render: function () {
        // render the game state
        scene.render();
    },
});

console.log("Hello");
loop.start(); // start the game

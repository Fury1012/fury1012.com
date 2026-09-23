//https://www.youtube.com/watch?v=7JtLHJbm0kA yummy yumyum  // i should also figure how to embed godot games into the site...
window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1000;
    canvas.height = 450;
    
    class InputHandler {
        constructor() {
            this.keys = [];
            window.addEventListener("keydown", e => {
                if ((   e.key === "ArrowDown" ||
                        e.key === "ArrowUp" ||
                        e.key === "ArrowLeft" ||
                        e.key === "ArrowRight" ||
                        e.key === "z")
                        && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                    //console.log(this.keys);
                }
            });
            window.addEventListener("keyup", e => {
                if (e.key === "ArrowDown" ||
                    e.key === "ArrowUp" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight" ||
                    e.key === "z") {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    //console.log(this.keys);
                }
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 192;
            this.height = 192;
            this.x = 0;
            this.y = this.gameHeight / 2;
            this.image = document.getElementById("player_spr");
            this.scaleX = 1; // i miss you vector2s 😔
            this.scaleY = 1;
            this.frameX = 0;
            this.maxFrameX = 3;
            this.frameY = 0;
            this.maxFrameY = 14;
            this.speed = 0;
            this.vy = 0;
            this.gravity = 0.10;
        }
        draw(context) {
            //so i have no idea how this works but it's 1am so idc rn
            context.save();
            context.scale(this.scaleX, this.scaleY);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x * this.scaleX, this.y * this.scaleY, this.width * this.scaleX, this.height * this.scaleY);
            context.restore();
        }
        update(input) {
            if (this.frameX >= this.maxFrameX) this.frameX = 0;
            else this.frameX++;

            if (input.keys.indexOf("ArrowRight") > -1) this.speed = 1.5;
            else if (input.keys.indexOf("ArrowLeft") > -1) this.speed = -1.5;
            else { this.speed = 0; }
            
            if (input.keys.indexOf("z") > -1 && this.onGround()) this.vy -= 6;
            
            
            //horizontal movement
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

            //vertical movement
            this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.gravity;
                this.frameX = 3
                this.frameY = 6;
            } else {
                this.vy = 0;
                this.frameX = 0;
                this.frameY = 0;
                //this.y = this.gameHeight - this.height;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
        }
        onGround() {
            return this.y >= this.gameHeight - this.height;
        }
        updateDirection(input) {
            if (input.keys.indexOf("ArrowRight") > -1) {
                this.scaleX = 1;
            }
            else if (input.keys.indexOf("ArrowLeft") > -1) {
                this.scaleX = -1;
            }
        }
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);


    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.draw(ctx);
        player.update(input);
        player.updateDirection(input);
        requestAnimationFrame(animate);
        //console.log(player.scaleX);
    }
    animate();
});
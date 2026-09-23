//https://www.youtube.com/watch?v=7JtLHJbm0kA yummy yumyum  // i should also figure how to embed godot games into the site...
window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas1");
    const disclaimer = document.getElementById("disclaimer");
    const ctx = canvas.getContext("2d");
    canvas.width = 1000;
    canvas.height = 450;
    disclaimer.height = 1000;
    var isActive = true;
    
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

    const userOs = document.querySelector(".os");

    //https://dev.to/webs95/detect-macos-ios-windows-android-and-linux-os-with-js-f7n
    let os = "unknow";

    function getOS() {
        const userAgent = window.navigator.userAgent;
        const platform =
            window.navigator?.userAgentData?.platform || window.navigator.platform;
        const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
        const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
        const iosPlatforms = ["iPhone", "iPad", "iPod"];

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = "Mac OS";
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = "iOS";
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = "Windows";
        } else if (/Android/.test(userAgent)) {
            os = "Android";
        } else if (/Linux/.test(platform)) {
            os = "Linux";
        }

        return os;
    }

    getOS();

    if (!os === "Windows" || !os === "Mac OS" || !os === "Linux") {
        isActive = false;
        canvas.style.display = "none";
        return;
    }


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

    // Source - https://stackoverflow.com/a/8916697
    // Posted by Zeta, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-09-23, License - CC BY-SA 4.0

    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);


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
            this.velocityY = 0;
            this.gravity = 0.10;
            this.jumpSound = new Audio("assets/sounds/jump.ogg");
            this.jumpSound.mozPreservesPitch = false; // prob wont work
            this.jumpSound.preservesPitch = false; 
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

            if (input.keys.indexOf("ArrowRight") > -1 && !(input.keys.indexOf("ArrowLeft") > -1)) this.speed = 1.5;
            else if (input.keys.indexOf("ArrowLeft") > -1 && !(input.keys.indexOf("ArrowRight") > -1)) this.speed = -1.5;
            else { this.speed = 0; }
            
            if (input.keys.indexOf("z") > -1 && this.onGround()) {
                var min = 0.95;
                var max = 1.05;
                this.jumpSound.playbackRate = clamp((Math.random() * (max - min) + min), min, max);
                //console.log(this.jumpSound.playbackRate);
                this.jumpSound.play();
                this.velocityY -= 6;
            } else if (!(input.keys.indexOf("z") > -1) && !this.onGround() && this.velocityY < 0) this.velocityY *= 0.95;
            
            
            //horizontal movement
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

            //vertical movement
            this.y += this.velocityY;
            if (!this.onGround()) {
                this.velocityY += this.gravity;
                if (this.velocityY < 0) {
                this.frameX = 3;
                this.frameY = 6;
                } else if (this.velocityY > 0) {
                this.frameX = 3;
                this.frameY = 8;
                }
            } else {
                this.velocityY = 0;
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
            if (input.keys.indexOf("ArrowRight") > -1 && !(input.keys.indexOf("ArrowLeft") > -1)) {
                this.scaleX = 1;
            }
            else if (input.keys.indexOf("ArrowLeft") > -1 && !(input.keys.indexOf("ArrowRight") > -1)) {
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
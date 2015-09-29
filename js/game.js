var app = app || {};

(function () {
    "use strict";

    function GameApp() {
        // The game object containing all the parameters:
        var game = {
            enemyX: 12, //Number of columns for the enemies' matrix
            enemyY: 3, //Number of rows for the the enemies' matrix
            enemies: [], //Array of enemy object
            bullets: [], //Array of player's bullet
            bulletsToDestroy: [], //Array of player's bullet to destroy
            enemyBullets: [], //Array of enemy ship's bullets
            enemyBulletsToDestroy: [], //Array of enemy ship's bullets to destroy
            player: null, //The unique instance of the player in the game
            enemyShip: null, //The unique instance of the enemy's ship in the game
            animationId: null, //The animationId object
            keys: {}, //Array containing true or false variables at the keyCode position
            keyLeft: 37, //keyCode of the left arrow key = move left
            keyRight: 39, //keyCode of the right arrow key = move right
            keySpace: 32, //keyCode of the space key = shoot
            stageRight: window.innerWidth - 50, //The right limit of the stage 
            stageBottom: window.innerHeight - 50, //The bottom limit of the stage
            count: 0, //The level counting
            levels: 1, //The number of levels in the game, it produce many times the enemy matrix
            score: 0, //The score of the game = the number of enemy killed
            lifeLevel: 3, //The player life level = the number of enemy ship's bullets that player can take without dying
            shots: 0, //The number of call to the keyCode space button = Used to create multiple divs in stead of a continuos line
            enemyShipDamage: 0, //The enemy ship's damage level
            startEnemyDefense: null, //Variable used to store the Interval of the enemy's defense
            startEnemyFire: null //Variable used to to store the Interval of the enemy's fire     
        };

        //Calculating the space between the screen's side and the enemie's matrix
        var spareSpace = (window.innerWidth - game.enemyX * 80)/2;

        //function used to set-up the game match:
        var initGame = function () {
            initKeyboardEvents(); //setting-up the keyboard events
            game.player = new app.Player(); // Create a new instance for the Player
            game.player.createPlayer((game.stageRight - 50) / 2, game.stageBottom - 50); //It calls the createPlayer function in the player object
            createEnemies(); // creating the enemies matrix
            createEnemyShip(); //creating the enemy ship
            game.startEnemyDefense = setInterval(function () {
                moveEnemies();
            }, 3000); //it moves the enemies matrix every 3000 ms
            game.startEnemyFire = setInterval(function () {
                createEnemyBullet();
            }, 1500); // it shots an enemyBullet every 1500 ms
            setGamesMessages(); //Calling the setGamesMessages function
            render(); //It calls the render function
        };

        //Setting up the messages for the game
        var setGamesMessages = function () {
            var score = document.getElementById("score");
            var level = document.getElementById("level");
            var damage = document.getElementById("enemyDamage");
            var lifeLevel = document.getElementById("life-level");
            var message = document.getElementById("message");
            var instruction = document.getElementById("instruction");
            score.innerHTML = "Score: " + game.score;
            damage.innerHTML = "Enemy's Damage: " + game.enemyShipDamage + "%";
            lifeLevel.innerHTML = "Health: " + game.lifeLevel;
            message.innerHTML = "Game Started";
            level.innerHTML = "Level: " + game.count;
            instruction.innerHTML = "Press the arrows to move, Press space to shoot, Refresh the page to play again";
        };

        //Function used to create the instance of the EnemyShip
        var createEnemyShip = function () {
            game.enemyShip = new app.EnemyShip();
            game.enemyShip.createEnemyShip(game.stageRight, 0); //The enemy's ship is created on the top-right position of the screen
        };

        //It creates the enemies' matrix
        var createEnemies = function () {
            for (var i = 0; i < game.enemyY; i++) {
                for (var j = 0; j < game.enemyX; j++) {
                    var enemy = new app.Enemy();
                    var x = spareSpace + j * 50 + j * 30;
                    var y = 100 + i * 50 + i * 30;
                    enemy.createEnemy(x, y);
                    game.enemies.push(enemy);
                }
            }
        };

        //Adding the keyboard events into the document
        var initKeyboardEvents = function () {
            //if some key is down it stores the true value in the keys array at the keyCode position
            document.body.addEventListener("keydown", function (e) {
                game.keys[e.keyCode] = true;
            });
            //if some key is up it deletes the value in the keys array at the keyCode position
            document.body.addEventListener("keyup", function (e) {
                delete game.keys[e.keyCode];
            });
        };
        
        //Detecting collisions between the game's elements
        var collisionTest = function () {
            var enemyCollided = null; // variable used store the enemy collided
            var bulletCollided = null; // variable used to store the player's bullet collided with an enemy
            var enemyBulletCollided = null; // variable used to store the enemy ship's bullet collided
            var bulletShipCollided = null; // variable used to store the player's bullet collided with the enemy ship
            var enemyShipCoordinates = game.enemyShip.getCoordinates(); //used to store the enemy ship coordinates
            var playerCoordinates = game.player.getCoordinates(); // used to store the player coordinates

            //Detecting collisions between enemies and player's bullets
            game.bullets.forEach(function (bullet, i, arr) {
                var bulletCoordinates = bullet.getCoordinates();
                game.enemies.forEach(function (enemy, i, arr) {
                    var enemyCoordinates = enemy.getCoordinates();
                    if (bulletCoordinates.left < enemyCoordinates.right &&
                            bulletCoordinates.right > enemyCoordinates.left &&
                            bulletCoordinates.top < enemyCoordinates.bottom &&
                            bulletCoordinates.bottom > enemyCoordinates.top)
                    {
                        enemyCollided = enemy;
                        game.score += 1;
                        console.log("Score: " + game.score);
                        var score = document.getElementById("score");
                        score.innerHTML = "Score: " + game.score;
                        bulletCollided = bullet;
                    }
                });
                //Detecting collisions between the enemy's ship and player's bullets
                if (bulletCoordinates.left < enemyShipCoordinates.right &&
                        bulletCoordinates.right > enemyShipCoordinates.left &&
                        bulletCoordinates.top < enemyShipCoordinates.bottom &&
                        bulletCoordinates.bottom > enemyShipCoordinates.top)
                {
                    if (game.enemies.length === 0 && game.count === game.levels)
                    {
                        bulletShipCollided = bullet;
                        game.enemyShipDamage = game.enemyShipDamage + 10;
                        var damage = document.getElementById("enemyDamage");
                        damage.innerHTML = "Enemy's Damage: " + game.enemyShipDamage + "%";
                    }
                }
            });
            //Detecting collisions between the player and enemyShip's bullets
            game.enemyBullets.forEach(function (enemyBullet, i, arr) {
                var enemyBulletCoordinates = enemyBullet.getCoordinates();
                if (enemyBulletCoordinates.left < playerCoordinates.right &&
                        enemyBulletCoordinates.right > playerCoordinates.left &&
                        enemyBulletCoordinates.top < playerCoordinates.bottom &&
                        enemyBulletCoordinates.bottom > playerCoordinates.top)
                {
                    enemyBulletCollided = enemyBullet;
                    game.lifeLevel -= 1;
                    var lifeLevel = document.getElementById("life-level");
                    lifeLevel.innerHTML = "Health: " + game.lifeLevel;
                }
            });
            //Returning the objects collided
            return {
                enemy: enemyCollided,
                bullet: bulletCollided,
                enemyBullet: enemyBulletCollided,
                bulletShipCollided: bulletShipCollided
            };
        };
        
        //It creates a bullet where the player is positioned
        var createBullet = function () {
            var playerCoordinates = game.player.getCoordinates();
            var x = playerCoordinates.right - 50,
                    y = playerCoordinates.top;
            var bullet = new app.Bullet();
            bullet.createBullet(x, y, 50);
            game.bullets.push(bullet);
        };
        
        //It removes the bullets ready to be destroyed from the bulletsToDestroy array
        var destroyBullets = function () {
            game.bulletsToDestroy.forEach(function (bullet, i, arr) {
                bullet.destroy();
                game.bullets.splice(game.bullets.indexOf(bullet), 1);
            });
            game.bulletsToDestroy = [];
        };
        
        //It creates an enemy's bullet where the enemy's ship is positioned
        var createEnemyBullet = function () {
            var enemyShipCoordinates = game.enemyShip.getCoordinates();
            var x = enemyShipCoordinates.right - 50,
                    y = enemyShipCoordinates.bottom;
            var enemyBullet = new app.EnemyBullet();
            enemyBullet.createEnemyBullet(x, y, game.stageBottom);
            game.enemyBullets.push(enemyBullet);
        };
        
        //It destroy the enemy's bullet ready to be destroyed
        var destroyEnemyBullets = function () {
            game.enemyBulletsToDestroy.forEach(function (enemyBullet, i, arr) {
                enemyBullet.destroy();
                game.enemyBullets.splice(game.enemyBullets.indexOf(enemyBullet), 1);
            });
            game.enemyBulletsToDestroy = [];
        };
        
        //It moves the enemies' matrix and detects when they collide with the player
        var moveEnemies = function () {
            game.enemies.forEach(function (enemy, i, arr) {
                enemy.moveDown();
                var enemyCoordinates = enemy.getCoordinates();
                var playerCoordinates = game.player.getCoordinates();
                if (enemyCoordinates.bottom >= playerCoordinates.top) {
                    var message = document.getElementById("message");
                    message.innerHTML = "You Lose!!! ";
                    game.lifeLevel = -1;
                    var lifeLevel = document.getElementById("life-level");
                    lifeLevel.innerHTML = "Health: " + game.lifeLevel;
                }
            });
        };

        //It creates the game's animation and controls the game's events
        var render = function () {

            //Player's actions control
            if (game.keys[game.keyRight]) {
                game.player.moveRight();
            }
            if (game.keys[game.keyLeft]) {
                game.player.moveLeft();
            }
            if (game.keys[game.keySpace]) {
                //used to divide the bullets
                if (game.shots % 14 === 0) {
                    createBullet();
                }
                game.shots += 3;
            }

            //Detecting the objects collided
            var collided = collisionTest();

            //Destroying the enemy collided
            if (collided.enemy) {
                game.enemies.splice(game.enemies.indexOf(collided.enemy), 1);
                collided.enemy.destroy();
            }

            //Destroying the bullet collided with an enemy
            if (collided.bullet) {
                var bulletCoordinates = collided.bullet.getCoordinates();
                if (bulletCoordinates.top > 30) {
                    collided.bullet.destroyMe = true;
                    game.bulletsToDestroy.push(collided.bullet);
                }
            }

            //Destroying the bullet collided with the enemy's ship
            if (collided.bulletShipCollided) {
                var bulletCoordinates = collided.bulletShipCollided.getCoordinates();
                if (bulletCoordinates.top > 30) {
                    collided.bulletShipCollided.destroyMe = true;
                    game.bulletsToDestroy.push(collided.bulletShipCollided);
                }
            }

            //Making the player's bullets move
            game.bullets.forEach(function (bullet, i, arr) {
                bullet.moveUp();
                if (bullet.readyForDestroy()) {
                    game.bulletsToDestroy.push(bullet);
                }
            });
            destroyBullets();
            
            //Destroying the enemy's ship bullets collided
            if (collided.enemyBullet) {
                collided.enemyBullet.destroyMe = true;
                game.enemyBulletsToDestroy.push(collided.enemyBullet);
            }
            
            //Making the enemy's ship bullets move
            game.enemyBullets.forEach(function (enemyBullet, i, arr) {
                enemyBullet.moveDown();
                if (enemyBullet.readyForDestroy()) {
                    game.enemyBulletsToDestroy.push(enemyBullet);
                }
            });
            destroyEnemyBullets();

            //It assigns a new values for the animationId
            game.animationId = requestAnimationFrame(render);

            //It creates more enemie's matrixes depending of the game.levels value
            if (game.enemies.length === 0 && game.count < game.levels) {
                createEnemies();
                game.count = game.count + 1;
                var level = document.getElementById("level");
                level.innerHTML = "Level: " + game.count;
            }

            //Detecting the conditions for the victory                     
            if (game.enemies.length === 0 && game.count === game.levels && game.lifeLevel >= 0 && game.enemyShipDamage === 100) {
                //It cleans the battle field after the match, removing player's bullets
                game.bullets.forEach(function (bullet, i, arr) {
                    bullet.destroyMe = true;
                    game.bulletsToDestroy.push(bullet);
                });
                destroyBullets();

                //It cleans the battle field after the match, removing enemy's bullets
                game.enemyBullets.forEach(function (bullet, i, arr) {
                    bullet.destroyMe = true;
                    game.enemyBulletsToDestroy.push(bullet);
                });
                destroyEnemyBullets();

                //Displaying the message for the victory
                var message = document.getElementById("message");
                message.innerHTML = "You Win!!! ";
                //Displaying Yoda 
                var element = document.createElement("div");
                element.className = "yoda";
                document.body.appendChild(element);
                element.style.left = (game.stageRight - 75) / 2 + "px";
                element.style.top = (game.stageBottom - 100) / 2 + "px";

                //Making the enemy's ship explode
                game.enemyShip.explode();
                
                //Stopping the animations
                cancelAnimationFrame(game.animationId);
                clearInterval(game.startEnemyDefense);
                clearInterval(game.startEnemyFire);
            }
            //Detecting the contitions for the defeat
            if (game.lifeLevel < 0) {
                var message = document.getElementById("message");
                message.innerHTML = "You Lose!!! ";

                //Stopping the animations
                clearInterval(game.startEnemyDefense);
                clearInterval(game.startEnemyFire);
                cancelAnimationFrame(game.animationId);
            }

            //Moving the enemy's ship 
            var enemyShipCoordinates = game.enemyShip.getCoordinates();
            if (100 > enemyShipCoordinates.left) {
                game.enemyShip.setDirection(false, true);
            }
            if (enemyShipCoordinates.right > game.stageRight - 50) {
                game.enemyShip.setDirection(true, false);
            }
            game.enemyShip.move();

        }; //end of render function

        initGame();

    } //end of GameApp function

    new GameApp();

}());
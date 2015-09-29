var app = app || {};

(function () {
    "use strict";

    function EnemyBullet() {

        var enemyBullet = {
            element: null, //The DOM element 
            width: 5,
            height: 5,
            speed: 5,
            stageBottom: null, //The limit of the screen after which the bullet is destroyed
            destroyMe: false  //It indicates when it is ready to be destroyed
        };

        //It creates a div with class bullet on the screen at position (x,y) 
        //and it sets his screen's limit to stageBottom
        var createEnemyBullet = function (x, y, stageBottom) {
            var element = document.createElement("div");
            element.className = "enemyBullet";
            element.style.left = x + "px";
            element.style.top = y + "px";
            document.body.appendChild(element);
            enemyBullet.element = element;
            enemyBullet.stageBottom = stageBottom;
        };
        
        //It returns an object containing the bullet's coordinates
        var getCoordinates = function () {
            return{
                top: enemyBullet.element.offsetTop,
                right: enemyBullet.element.offsetLeft + enemyBullet.width,
                bottom: enemyBullet.element.offsetTop + enemyBullet.height,
                left: enemyBullet.element.offsetLeft
            };
        };
        
        //It removes the DOM element from the bullet
        var destroy = function () {
            if (enemyBullet.element !== null) {
                enemyBullet.element.remove();
            }
        };

         //Returns true if the bullet is ready to be destroyed, false if is not
        var readyForDestroy = function () {
            return enemyBullet.destroyMe;
        };
        
        //It increases the style.top value and detect if the bullet is ready to be destroyed
        var moveDown = function () {
            enemyBullet.element.style.top = enemyBullet.element.offsetTop + enemyBullet.speed + "px";
            if (enemyBullet.element.offsetTop > enemyBullet.stageBottom) {
                enemyBullet.destroyMe = true;
            }
        };
        
        //Revealing moduel for the EnemyBullet class
        return {
            createEnemyBullet: createEnemyBullet,
            getCoordinates: getCoordinates,
            moveDown: moveDown,
            destroy: destroy,
            readyForDestroy: readyForDestroy
        };

    }// end of EnemyBullet class

    app.EnemyBullet = EnemyBullet;


}());
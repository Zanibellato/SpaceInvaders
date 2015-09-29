var app = app || {};

(function () {
    "use strict";

    function EnemyShip() {

        var enemyShip = {
            speed: 10,
            width: 100,
            height: 100,
            left: true, //If true it will move to the left
            right: false, //If true it will move to the right
            element: null //The DOM element
        };
        //It creates a div with class enemy-ship on the screen, at the position (x,y)
        var createEnemyShip = function (x, y) {
            var element = document.createElement("div");
            element.className = "enemy-ship";
            document.body.appendChild(element);
            element.style.left = x + "px";
            element.style.top = y + "px";
            enemyShip.element = element;
        };
        
        //It returns an object containing the enemyShip's coordinates
        var getCoordinates = function () {
            return{
                top: enemyShip.element.offsetTop,
                right: enemyShip.element.offsetLeft + enemyShip.width,
                bottom: enemyShip.element.offsetTop + enemyShip.height,
                left: enemyShip.element.offsetLeft
            };
        };
        
        //It sets the directions values
        var setDirection = function (left, right) {
            enemyShip.left = left;
            enemyShip.right = right;
        };
        
        //It moves the enemyShip the "true" direction
        var move = function () {
            if (enemyShip.right) {
                enemyShip.element.style.left = enemyShip.element.offsetLeft + enemyShip.speed + "px";
            }
            if (enemyShip.left) {
                enemyShip.element.style.left = enemyShip.element.offsetLeft - enemyShip.speed + "px";
            }
        };
        
        //it changes the enemyShip class when the player win
        var explode = function () {
            enemyShip.element.className = "explosion";
        };

        //Revealing module for the EnemyShip class
        return {
            createEnemyShip: createEnemyShip,
            move: move,
            setDirection: setDirection,
            getCoordinates: getCoordinates,
            explode: explode
        };

    }//End of class EnemyShip

    app.EnemyShip = EnemyShip;

}());
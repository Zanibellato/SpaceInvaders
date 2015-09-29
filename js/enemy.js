var app = app || {};

(function () {
    "use strict";

    function Enemy() {

        var enemy = {
            element: null, //The DOM element
            width: 50, 
            height: 50
        };
        
        //It creates a div with class enemy on the screen at position (x,y)
        var createEnemy = function (x, y) {
            var element = document.createElement("div");
            element.className = "enemy";
            element.style.left = x + "px";
            element.style.top = y + "px";
            document.body.appendChild(element);
            enemy.element = element;
        };
        
        //It returns an object containing the enemy's coordinates
        var getCoordinates = function () {
            return{
                top: enemy.element.offsetTop,
                right: enemy.element.offsetLeft + enemy.width,
                bottom: enemy.element.offsetTop + enemy.height,
                left: enemy.element.offsetLeft
            };
        };
        
        //It removes the enemy div from the body
        var destroy = function () {
            document.body.removeChild(enemy.element);
        };
        
        //It increases the style.top value of the div element
        var moveDown = function () {
            enemy.element.style.top = enemy.element.offsetTop + enemy.height + "px";
        };
        
        //Revealing module for the class Enemy
        return {
            createEnemy: createEnemy,
            getCoordinates: getCoordinates,
            destroy: destroy,
            moveDown: moveDown
        };

    } //End of the class Enemy

    app.Enemy = Enemy;


}());
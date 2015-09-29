var app = app || {};

(function () {
    "use strict";

    function Player() {

        var player = {
            speed: 3,
            width: 100,
            height: 100,
            element: null //The DOM element 
        };
        
        //It creates a div with class player on the screen, at position (x,y)
        var createPlayer = function (x, y) {
            var element = document.createElement("div");
            element.className = "player";
            document.body.appendChild(element);
            element.style.left = x + "px";
            element.style.top = y + "px";
            player.element = element;
        };
        
        //It returns an object containing the player's coordinates
        var getCoordinates = function () {
            return{
                top: player.element.offsetTop,
                right: player.element.offsetLeft + player.width,
                bottom: player.element.offsetTop + player.height,
                left: player.element.offsetLeft
            };
        };
        
        //It increases the style.left value of the div element
        var moveRight = function () {
            player.element.style.left = player.element.offsetLeft + player.speed + "px";
        };
        
        //It decreases the style.left value of the div element
        var moveLeft = function () {
            player.element.style.left = player.element.offsetLeft - player.speed + "px";
        };
        
        //Revealing module of the class Player
        return {
            createPlayer: createPlayer,
            moveRight: moveRight,
            moveLeft: moveLeft,
            getCoordinates: getCoordinates
        };

    } //End of the class Player

    app.Player = Player;

}());
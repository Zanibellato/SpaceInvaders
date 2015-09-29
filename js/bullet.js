var app = app || {};

(function () {
    "use strict";

    function Bullet() {

        var bullet = {
            element: null, //The DOM element 
            width: 5, 
            height: 5,
            speed: 5,
            stageTop: null, //The limit of the screen after which the bullet is destroyed
            destroyMe: false //It indicates when it is ready to be destroyed
        };
        
        //It creates a div with class bullet on the screen at position (x,y) 
        //and it sets his screen's limit to stageTop
        var createBullet = function (x, y, stageTop) {
            var element = document.createElement("div");
            element.className = "bullet";
            element.style.left = x + "px";
            element.style.top = y + "px";
            document.body.appendChild(element);
            bullet.element = element;
            bullet.stageTop = stageTop;
        };
        
        //It returns an object containing the bullet's coordinates
        var getCoordinates = function () {
            return{
                top: bullet.element.offsetTop,
                right: bullet.element.offsetLeft + bullet.width,
                bottom: bullet.element.offsetTop + bullet.height,
                left: bullet.element.offsetLeft
            };
        };
        
        //It removes the DOM element from the bullet
        var destroy = function () {
            if (bullet.element !== null) {
                bullet.element.remove();
            }
        };
        
        //Returns true if the bullet is ready to be destroyed, false if is not
        var readyForDestroy = function () {
            return bullet.destroyMe;
        };
        
        //It decreases the style.top value and detect if the bullet is ready to be destroyed
        var moveUp = function () {
            bullet.element.style.top = bullet.element.offsetTop - bullet.speed + "px";
            if (bullet.element.offsetTop < bullet.stageTop) {
                bullet.destroyMe = true;
            }
        };
        
        //Revealing module for the class Bullet
        return {
            createBullet: createBullet,
            getCoordinates: getCoordinates,
            moveUp: moveUp,
            destroy: destroy,
            readyForDestroy: readyForDestroy
        };

    }//End of class Bullet

    app.Bullet = Bullet;


}());
class Player{
    constructor(id, name, weapon, picture, position = "", direction = ""){
        this.id = id;
        this.name = name;
        this.health = 100;
        this.score = 0;
        this.weapon = weapon;
        this.picture = picture;
        this.enemy = null;
        this.position = position;
        this.direction = direction;
        this.ui = this.getUi();
    }


    move(){
        $( ".active-player" ).animate({ "left": "-=50px" }, "slow" );
    }

    attack(){
        this.enemy.health -= this.weapon.demage;
    }

    defend(){

    }

    getUi(){
        let image = document.createElement('img');
        image.src = this.picture;
        image.width = 50;
        image.style.cssText = "\
                                transform: rotate(" + this.direction.lastValue + "deg);\
                                -ms-transform: rotate(" + this.direction.lastValue + "deg);\
                                -moz-transform: rotate(" + this.direction.lastValue + "deg);\
                                -webkit-transform: rotate(" + this.direction.lastValue + "deg);\
                                -o-transform: rotate(" + this.direction.lastValue + "deg);\
                                -webkit-transition: -webkit-transform 1s linear 0.2s;\
                                -moz-transition: -moz-transform 1s linear 0.2s;\
                                transition: transform 1s linear 0.2s;";
        this.ui = image;
        return image;
    }

}

export default Player;
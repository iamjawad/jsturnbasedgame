import Util from './util'
class Weapon{
    constructor(name, damage = 10, picture = ""){
        this.name = name;
        this.damage = damage;
        this.picture = picture;
        this.ui = this.getUI();
        this.defend = false;
        this.attacking = false;    
    }

    getUI(){
        let wrapper = document.createElement('span');
        let image = document.createElement('img');
        let label = document.createElement('span');

        label.innerHTML = this.name + " - X" + this.damage;
        label.classList.add("weapon-label");
        image.src = this.picture;
        image.width = 50;
        image.draggable = false;

        wrapper.appendChild(image);
        wrapper.appendChild(label);
        return wrapper;
    }
    

    fire(player = "", opposite = "", board = ""){

        if (this.attacking == true){
            return false;
        }

        this.attacking = true;
        let activePlayer = $('.active-player span img');
        let direction = $('.active-player').attr("direction");
        let changeInDirection = "";
        let target = $('.locked-target');
        const targetObj = board.getElement(target.attr('id'));

        if(targetObj != "" && targetObj.content.constructor.name != "Player"){
            return false;
        }

        switch (direction) {
            case "top":
                changeInDirection = {top: target.offset().top + 30};
                break;
            
            case "bottom":
                changeInDirection = {top: target.offset().top + 30};
                break;
            
            case "left":
                changeInDirection = {left: target.offset().left + 55};
                break;
            
            case "right":
                changeInDirection = {left: target.offset().left + 55};
                break;
            
            
        
            default:
                break;
        }
        
        let wrapper = $(document.createElement('span'));
        wrapper.css({
            position: "absolute",
            width: "10px",
            height: "10px",
            top: activePlayer.offset().top + 12,
            left: activePlayer.offset().left + 12,
            borderRadius: "50%",
            border: "5px solid #005600",
            boxShadow: "inset 0 52px 60px #119b00",
        });
        $('body').append(wrapper);
        wrapper.animate(
            changeInDirection, 
            {
                easing:"swing",
                duration:2000,
                complete: () => {
                    wrapper.remove();
                    let img = $(document.createElement('img'));
                    img.css({
                        position: "absolute",
                        width: "95px",
                        top: target.offset().top,
                        left: target.offset().left + 6,
                    });
                    
                    $('body').append(img);
                    img.attr("src","img/fire3.gif" + "?id=" + Math.random());

                    let vibrationCSS = '\
                    @keyframes vibration-ani{\
                        0% {transform: rotate(' + (player.direction.lastValue -9) + 'deg)}\
                        45% {transform: rotate(' + (player.direction.lastValue) + 'deg)}\
                        85% {transform: rotate(' + (player.direction.lastValue -9) + 'deg)}\
                        100% {transform: rotate(' + (player.direction.lastValue) + 'deg)}\
                    }';


                    if(board.enemyInRange() == true){
                        board.dynamicCSS['.vibration-ani'] = vibrationCSS;
                        board.updateDynamicCSS();
                        target.find('img').addClass("vibration");
                    }

                    let timeout = setTimeout(() => {
                        board.updateUIElement();
                        img.remove();
                        target.find('img').removeClass("vibration");
                       
                        // Update health
                        if(opposite.mapId == target.attr("id") && board.enemyInRange() == true){
                            if(opposite.defending == true){
                                opposite.health -= (this.damage / 2);
                                opposite.defending = false;
                            } else{
                                opposite.health -= this.damage;
                            }
                        }

                        opposite.updateHealth();

                        if(opposite.health <= 0){
                            opposite.health = 0;
                            opposite.updateHealth();
                            board.gameEnded = true;
                            board.updateUIElement();
                            Util.showInfo("Game Over", player.name + " won the game!", false);
                            $('#gameboard').addClass('not-avaiable');
                            return;
                        }

                        this.attacking = false;
                        board.nextTurn();
                        setTimeout(() => {
                            board.updateUIElement();
                        }, 1);
                        
                        clearTimeout(timeout);
                    }, 1500);


                }
            }
        );
    }

}

export default Weapon;
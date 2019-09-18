import Player from './player';
import Weapon from './weapon';
import Obstacle from './obstacle';
import Util from './util';
import { type } from 'os';

class Board {
    constructor() {
        this.map = this.generateMapStructure();
        this.ui = "";
        this.weapons = [];
        this.generateWeapons();
        let defaultWeapon = this.weapons[0];
        this.playerOne = new Player(1,"p1", new Weapon('Ordo',10 ,'img/ordo.png'), 'img/player1.png',"",{top:180, bottom:0, left:90, right:-90, lastValue: 0, dirStr:"bottom"});
        this.playerTwo = new Player(2,"p2", new Weapon('Ordo',10 ,'img/ordo.png'), 'img/player2.png',"",{top:0, bottom:180, left:-90, right:90, lastValue: 0, dirStr:"top"});
        this.activePlayer = "";
        this.gameEnded = false;
        this.dynamicCSS = {".vibration-ani": "{}"};
        this.init();
    }

    getDynamicCSS(){
        let allCSS = "<style>";

        for (const [selector, css] of Object.entries(this.dynamicCSS)) {
            const trimedCSS = css.trim();
            if(trimedCSS.startsWith("@key")){
                allCSS += trimedCSS;
            } else {
                allCSS += selector + trimedCSS;
            }
        }
        return allCSS + "</style>";
    }

    updateDynamicCSS(){
        $('head > style').remove();
        $('html > head').append(this.getDynamicCSS());
    }

    generateMapStructure() {
        var arr = [];
        var aChar = 'A'.charCodeAt();
        for (var i = 0; i < 9; i++) {
            arr[i] = [];
            for (var k = 0; k < 9; k++) {
                arr[i][k] = {
                    id: String.fromCharCode(aChar + i) + k,
                    isBlank: true,
                    validMove: false,
                    content: "",
                    typeName: ""
                };
            }
        }

        return arr;
    }

    init(){
        let playerOneLocation = [Math.floor((Math.random() * 3) + 0), Math.floor((Math.random() * 7) + 0)];
        let playerTwoLocation = [Math.floor(Math.random() * (7-4+1))+4, Math.floor((Math.random() * 7) + 0)];
        let randomPlayer = Math.floor(Math.random() * (1-0+1))+0;
        this.activePlayer = randomPlayer ? this.playerOne : this.playerTwo;
        this.playerOne.position = [playerOneLocation[0],playerOneLocation[1]];
        this.playerTwo.position = [playerTwoLocation[0],playerTwoLocation[1]];
        this.placeElement(false, this.map[playerOneLocation[0]][playerOneLocation[1]], this.playerOne);
        this.placeElement(false, this.map[playerTwoLocation[0]][playerTwoLocation[1]], this.playerTwo);       
    }

    enemyFromRange(position){
        const enemy = this.getOppositePlayer();

        if(this.map[position[0]-1][position[1]].content == enemy){
            return "top";
        } else if(this.map[position[0]+1][position[1]].content == enemy){
            return "bottom";
        } else if(this.map[position[0]][position[1]-1].content == enemy){
            return "left";
        } else if(this.map[position[0]][position[1]+1].content == enemy){
            return "right";
        } else {
            return false;
        }
    }

    enemyInRange(position = ""){
        const enemy = this.getOppositePlayer();
        const player = this.activePlayer;
        const playerPosition = position == "" ? player.position : position;
        const direction = player.direction.dirStr;
        let inRange = false;
        console.log("I go position: " + position);
        switch (direction) {
            case "top":
                if(this.map[playerPosition[0]-1][playerPosition[1]].content == enemy){
                    inRange = true;
                }
                break;
            
            case "bottom":
                if(this.map[playerPosition[0]+1][playerPosition[1]].content == enemy){
                    inRange = true;
                }
                break;
            
            case "left":
                if(this.map[playerPosition[0]][playerPosition[1]-1].content == enemy){
                    inRange = true;
                }
                break;
            
            case "right":
                if(this.map[playerPosition[0]][playerPosition[1]+1].content == enemy){
                    inRange = true;
                }
                break;
            
            default:
                inRange = false;
                break;
        }
        return inRange;
    }

    generateWeapons(){
        let estes = new Weapon('Estes Mini', 15, 'img/EstesMini.png');
        let fab = new Weapon('FAB-500', 20, 'img/FAB-500.png');
        let sion = new Weapon('Sion', 25, 'img/sion.png');
        let mOne = new Weapon('M1002', 30, 'img/M1002.png');

        this.weapons.push(estes,fab,sion,mOne);
    }

    initUI(){
        this.showSplash();
        let table = document.createElement('table');
        let map = this.map;
        
    
        // Placing Obstacles on map
        let obstacles = this.generateObstacles(10);
        for (const obstacle of obstacles) {
            let randomLocation = Util.randomMapPosition();

            do {
                randomLocation = Util.randomMapPosition();
            } while (this.map[randomLocation[0]][randomLocation[1]].content != "");

            obstacle.ui = "";
            this.placeElement(false ,this.map[randomLocation[0]][randomLocation[1]], obstacle);
            this.map[randomLocation[0]][randomLocation[1]].validMove = false;
        }

        this.validateMoves(this.activePlayer.position);

        // Placing Weapons
        for (const weapon of this.weapons) {
            let randomLocation = Util.randomMapPosition();

            do {
                randomLocation = Util.randomMapPosition();
            } while (this.map[randomLocation[0]][randomLocation[1]].content != "");

            this.placeElement(false ,this.map[randomLocation[0]][randomLocation[1]], weapon);
        }

        let targetPosition = this.getTargetPosition();
        
        for (const row of map) {
            let tableRow = document.createElement('tr');
        
            row.forEach(value => {
                let cell = document.createElement('td');
                let span = document.createElement('span');
                let typeName = value.content.constructor.name;
                
                if(typeof(value.content) == "object" && value.content.ui != ""){
                    span.appendChild(value.content.ui);
                }

                if(typeName == "Player"){
                    cell.setAttribute("direction", value.content == this.playerOne ? this.playerOne.direction.dirStr : this.playerTwo.direction.dirStr);
                }

                if(typeName == "Player" && this.activePlayer == value.content){
                    cell.classList.add("active-player");
                }

                if(typeName == "Obstacle"){
                    span.classList.add("obstacle");
                }

                if(value.validMove == true && value.content == ""){
                    cell.classList.add("valid-move");
                }

                if(value.id == map[targetPosition[1]][targetPosition[0]].id){
                    cell.classList.add("locked-target");
                }
                // cell.innerHTML = span.outerHTML;
                cell.setAttribute("validMove",value.validMove);
                cell.setAttribute("id",value.id);
                cell.setAttribute("isBlank", value.isBlank);
                cell.setAttribute("content", value.content);
                cell.setAttribute("draggable", false);
                if((typeName == "Player" && value.content == this.activePlayer) || value.validMove == true){
                    span.setAttribute("ondragover", "dragover(event)");
                    span.setAttribute("ondragenter", "dragenter(event)");
                    span.setAttribute("ondragend", "dragend(event)");
                    span.setAttribute("ondragleave", "dragleave(event)");
                    span.setAttribute("ondragstart", "dragstart(event)");
                    span.setAttribute("ondrop", "drop(event)");
                    span.setAttribute("draggable","true");
                }
                
                cell.appendChild(span);
                tableRow.appendChild(cell);
            });
        
            table.appendChild(tableRow);
        }
        
        this.ui = table;
        let self = this;

        

        setTimeout(() => {
            this.playerOne.updateHealth();
            this.playerTwo.updateHealth();
        }, 1);

        // Fire on double click
        $(function() {
            $('#gameboard table').on('dblclick', 'tr', function(e) {
                e.preventDefault();
                const oppositePlayer = self.getOppositePlayer();
                self.activePlayer.weapon.fire(self.activePlayer, oppositePlayer, self);
            });
        });

        // Defend on right click
        $(function() {
            $('#gameboard table').on('contextmenu', 'tr', function(e) {
                e.preventDefault();
                const targetId = $(e.target).parent().attr("id");

                if(targetId == self.activePlayer.mapId){
                    self.activePlayer.defending = true;
                    Util.showInfo("Defending", self.activePlayer.name + " is defending the attack!", true);
                    console.log("Defending");
                } else{
                    console.log("JUst changed turn");
                }
                
                self.nextTurn();
                self.updateUIElement();
            });
        });


        
        return table;
    }

    updateUIElement(){

        let table = document.createElement('table');
        let map = this.map;
        this.validateMoves(this.activePlayer.position);
        this.adjustRotation(false);
        let targetPosition = this.getTargetPosition();

        for (const row of map) {
            let tableRow = document.createElement('tr');
        
            row.forEach(value => {
                let cell = document.createElement('td');
                let span = document.createElement('span');
                let typeName = value.content.constructor.name;

                if(typeof(value.content) == "object" && value.content.ui != ""){
                    if(typeName == "Player"){
                        span.appendChild(value.content.getUi());
                    } else {
                        span.appendChild(value.content.ui);
                    }
                }

                if(typeName == "Obstacle"){
                    span.classList.add("obstacle");
                }

                if(typeName == "Player"){
                    cell.setAttribute("direction", value.content == this.playerOne ? this.playerOne.direction.dirStr : this.playerTwo.direction.dirStr);
                }

                if(typeName == "Player" && this.activePlayer == value.content){
                    cell.classList.add("active-player");
                }

                if(value.validMove == true && value.content == ""){
                    cell.classList.add("valid-move");
                }

                if(value.id == map[targetPosition[1]][targetPosition[0]].id){
                    cell.classList.add("locked-target");
                    
                    console.log(targetPosition);
                }

                cell.setAttribute("validMove",value.validMove);

                cell.setAttribute("id",value.id);
                cell.setAttribute("isBlank", value.isBlank);
                cell.setAttribute("content", value.content);
                cell.setAttribute("draggable", false);
                if((typeName == "Player" && value.content == this.activePlayer) || value.validMove == true && this.gameEnded == false){
                    span.setAttribute("ondragover", "dragover(event)");
                    span.setAttribute("ondragenter", "dragenter(event)");
                    span.setAttribute("ondragend", "dragend(event)");
                    span.setAttribute("ondragleave", "dragleave(event)");
                    span.setAttribute("ondragstart", "dragstart(event)");
                    span.setAttribute("ondrop", "drop(event)");
                    span.setAttribute("draggable","true");
                }
                cell.appendChild(span);
                tableRow.appendChild(cell);
            });
        
            table.appendChild(tableRow);
        }

        $('#gameboard').html(table.outerHTML);

        
        this.ui = table;
        
        this.ui = table;

        setTimeout(() => {
            this.adjustRotation();
        }, 1);
        let self = this;

        $(function() {
            $('#gameboard table').on('dblclick', 'tr', function(e) {
                e.preventDefault();
                const oppositePlayer = self.getOppositePlayer();
                self.activePlayer.weapon.fire(self.activePlayer, oppositePlayer, self);
            });
        });

        // Defend on right click
        $(function() {
            $('#gameboard table').on('contextmenu', 'tr', function(e) {
                e.preventDefault();
                const targetId = $(e.target).parent().attr("id");

                if(targetId == self.activePlayer.mapId){
                    self.activePlayer.defending = true;
                    Util.showInfo("Defending", self.activePlayer.name + " is defending the attack!", true);
                    console.log("Defending");
                } else{
                    console.log("JUst changed turn");
                }
                
                self.nextTurn();
                self.updateUIElement();
                
            });
        });

        this.playerOne.healthTrackerUI.ui = "";
        this.playerTwo.healthTrackerUI.ui = "";
        setTimeout(() => {
            this.playerOne.updateHealth();
            this.playerTwo.updateHealth();
        }, 1);
    }

    // Prepairing to depricate
    getTargetPosition(){
        let map = this.map;
        let activePlayerPosition = this.activePlayer.position;
        let row = activePlayerPosition[0];
        let column = activePlayerPosition[1];
        let activePlayerDirection = this.activePlayer.direction.dirStr;

        // --|--
        switch (activePlayerDirection) {
            case "top":
                for (let index = row - 1 ; index >= 0; index--) {
                    const element = map[index][column];

                    if(element.content != ""){
                        return [column, index];
                    }
                    
                }
                return [column,0];
                break;

            case "bottom":
                for (let index = row + 1; index < map.length; index++) {
                    const element = map[index][column];

                    if(element.content != ""){
                        return [column, index];
                    }
                    
                }
                return [column,map.length - 1];
                break;

            case "left":
                for (let index = column - 1; index >= 0; index--) {
                    const element = map[row][index];

                    if(element.content != ""){
                        return [index, row];
                    }
                    
                }
                return [0,row];
                break;

            case "right":
                for (let index = column + 1; index < map[0].length; index++) {
                    const element = map[row][index];

                    if(element.content != ""){
                        return [index, row];
                    }
                    
                }
                return [map[0].length - 1,row];
                break;

            default:
                break;
        }
    }

    getOppositePlayer(){
        if(JSON.stringify(this.activePlayer) == JSON.stringify(this.playerOne)){
            return this.playerTwo;
        }

        return this.playerOne;
    }

    getDirectionToEnemy(fromPosition = ""){
        const player = this.activePlayer;
        const position = fromPosition == "" ? player.position : fromPosition;

        const enemy = this.getOppositePlayer();
        const enemyPosition = enemy.position;

        if(position[0] > enemyPosition[0] && position[1] == enemyPosition[1]){
            return "top";
        } else if(position[0] < enemyPosition[0] && position[1] == enemyPosition[1]){
            return "bottom";
        } else if(position[1] > enemyPosition[1] && position[0] == enemyPosition[0]){
            return "left";
        } else if(position[1] < enemyPosition[1] && position[0] == enemyPosition[0]){
            return "right";
        } else {
            return false;
        }

        
        
    }

    updatePlayerDirection(target){
        let direction = "";
        let map = this.map;
        let playerPosition = this.activePlayer.position;
        let position = target.address;

        let targetRow = position[0];
        let targetColumn = position[1];
        const row = playerPosition[0];
        const column = playerPosition[1];
        console.log(target);
        if(targetColumn < column){
            this.activePlayer.direction.dirStr = "left";
            this.activePlayer.direction.lastValue = this.activePlayer.direction.left;
        } else if(targetColumn > column) {
            this.activePlayer.direction.dirStr = "right";
            this.activePlayer.direction.lastValue = this.activePlayer.direction.right;
        } else if(targetRow < row){
            this.activePlayer.direction.dirStr = "top";
            this.activePlayer.direction.lastValue = this.activePlayer.direction.top;
        } else if(targetRow > row){
            this.activePlayer.direction.dirStr = "bottom";
            this.activePlayer.direction.lastValue = this.activePlayer.direction.bottom;
        } else {
            return false;
        }
        // console.log("Target Position: " + targetPosition);
        // console.log("Enemy in range? " + this.enemyInRange(targetPosition));
        // const enemyDirection = this.enemyFromRange(targetPosition);
        // if(enemyDirection != false){
        //     console.log("Enemy in range yesssss");
        //     const enemy = this.getOppositePlayer();
        //     const enemyCol = enemy.position[0];
        //     const enemyRow = enemy.position[1];
        //     let postChange = "";

            // if(enemyRow < targetRow){
            //     postChange = "left";
            //     this.activePlayer.direction.lastValue = this.activePlayer.direction.left;
            // } else if(enemyRow > targetRow) {
            //     postChange = "right";
            //     this.activePlayer.direction.lastValue = this.activePlayer.direction.right;
            // } else if(enemyCol < targetColumn){
            //     postChange = "top";
            //     this.activePlayer.direction.lastValue = this.activePlayer.direction.top;
            // } else {
            //     postChange = "bottom";
            //     this.activePlayer.direction.lastValue = this.activePlayer.direction.bottom;
            // }
            // console.log("dsfsdfsdf: " + enemyDirection);
            // return enemyDirection;
        // }

    }

    rotatePlayer(degrees){
        
        let css = {
            'transform': 'rotate(' + degrees + 'deg)',
            '-ms-transform': 'rotate(' + degrees + 'deg)',
            '-moz-transform': 'rotate(' + degrees + 'deg)',
            '-webkit-transform': 'rotate(' + degrees + 'deg)',
            '-o-transform': 'rotate(' + degrees + 'deg)',
            '-webkit-transition': '-webkit-transform 1s linear 0.2s',
            '-moz-transition': '-moz-transform 1s linear 0.2s',
            'transition': 'transform 1s linear 0.2s'
        }

        $('.active-player span img').css(css);

        return css;

    }

    adjustRotation(rotateUI = true){
        const enemyDirection = this.getDirectionToEnemy();
        const player = this.activePlayer;

        if(enemyDirection != false){
            player.direction.lastValue = player.direction[enemyDirection];
            player.direction.dirStr = enemyDirection;
            
            if(rotateUI == true){
                this.rotatePlayer(player.direction[enemyDirection]);
                $('.active-player').attr('direction',player.direction.dirStr);
            }
        }
        
        

    }

    animateMovement(sourceElement,targetElement){
        let source = $('#' + sourceElement.id + ' span');
        let targetElm = $('#' + targetElement.id + ' span');
        const direction = this.activePlayer.direction;
        const player = this.activePlayer;
        const enemyDirection = this.getDirectionToEnemy(targetElement.address);

        this.updatePlayerDirection(targetElement);
        this.rotatePlayer(direction[direction.dirStr]);

        // switch (direction.dirStr) {
        //     case "top":
        //         this.rotatePlayer(direction.top);
        //         console.log("top");
        //         break;
        
        //     case "bottom":
        //         this.rotatePlayer(direction.bottom);
        //         console.log("bottom");
        //         break;
        
        //     case "left":
        //         this.rotatePlayer(direction.left);
        //         console.log("left");
        //         break;
        
        //     case "right":
        //         this.rotatePlayer(direction.right);
        //         console.log("right");
        //         break;
        
        //     default:
        //         console.log("no output");
        //         break;
        // }        

        

        let animation = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(source.animate(
                    {
                        top: targetElm.offset().top - source.parent().offset().top,
                        left: targetElm.offset().left - source.parent().offset().left
                    },
                    {
                        easing: "swing",
                        duration: 2000,
                        complete: () => {
                            this.playerOne.getUi();
                            this.playerTwo.getUi();
                            console.log("Enemy:dir:" + enemyDirection);
                            console.log("Enemy:dirstring:" + JSON.stringify(enemyDirection));
                            if(enemyDirection != false){
                                player.direction.lastValue = player.direction[enemyDirection];
                                player.direction.dirStr = enemyDirection;
                                this.rotatePlayer(player.direction[enemyDirection]);

                                setTimeout(() => {
                                    this.nextTurn();
                                    this.updateUIElement();
                                }, 1500);
                            } else {
                                this.nextTurn();
                                this.updateUIElement();
                            }

                            
                            // this.nextTurn();
                            // this.updateUIElement();
                            
                            console.log("Enemy in range: " + this.enemyInRange());
                            // this.activePlayer.weapon.fire();
                        }
                    }));
            }, 1000);
        });
        // this.rotatePlayer(this.activePlayer.direction[this.getDirectionToEnemy()]);

        

    }

    nextTurn(){
        this.playerOne.move();
        if(this.activePlayer == this.playerOne){
            this.activePlayer = this.playerTwo;
        } else {
            this.activePlayer = this.playerOne;
        }
        this.validateMoves(this.activePlayer.position);
    }

    validateMoves(location){
        let map = this.map;
        let miniMap = [];
        let center = this.map[location[0]][location[1]];
        let area = "";

        this.map.forEach(element => {
            element.forEach(subElement => {
                subElement.validMove = false;
            });
        });

        // Setting Horizental Moves
        
        // Left # 1
        area = this.elementExisit([location[0],location[1] -1]) ? map[location[0]][location[1]-1] : false;        
        area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;

        // Left # 2 - Checking if obstacle detected at first
        if(area != false && area.validMove == true){
            area = this.elementExisit([location[0],location[1] -2]) ? map[location[0]][location[1]-2] : false;
            area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
        }

        // Left # 3
        if(area != false && area.validMove == true){
            area = this.elementExisit([location[0],location[1] -3]) ? map[location[0]][location[1]-3] : false;
            area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
        }

        // Right # 1
        area = this.elementExisit([location[0],location[1] +1]) ? map[location[0]][location[1]+1] : false;
        area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;

        // Right # 2
        if(area.validMove == true){
            area = this.elementExisit([location[0],location[1] +2]) ? map[location[0]][location[1]+2] : false;
            area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
        }

        // Right # 3
        if(area.validMove == true){
            area = this.elementExisit([location[0],location[1] +3]) ? map[location[0]][location[1]+3] : false;
            area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
        }



        // Setting Vertical Moves
        // Top # 1
        area = this.elementExisit([location[0]-1,location[1]]) ? map[location[0]-1][location[1]] : false;
        area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;

        // Top # 2 - Checking if obstacle detected at first
        if(area.validMove == true){
        area = this.elementExisit([location[0]-2,location[1]]) ? map[location[0]-2][location[1]] : false;
        area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
        }

        // Top # 3 
        if(area.validMove == true){
        area = this.elementExisit([location[0]-3,location[1]]) ? map[location[0]-3][location[1]] : false;
        area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
        }



        // Bottom # 1 
        area = this.elementExisit([location[0]+1,location[1]]) ? map[location[0]+1][location[1]] : false;
        area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;

        // console.log(JSON.parse(JSON.stringify(area)));
        // Bottom # 2
        if(area.validMove == true){
            area = this.elementExisit([location[0]+2,location[1]]) ? map[location[0]+2][location[1]] : false;
            area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
        }
        
        // Bottom # 3
        if(area.validMove == true){
            area = this.elementExisit([location[0]+3,location[1]]) ? map[location[0]+3][location[1]] : false;
            area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
        }
        

    }

    elementExisit(element){
        if(typeof this.map[element[0]] != "undefined" && typeof this.map[element[0]][element[1]] != "undefined"){
            return true;
        }
        return false;
    }

    getElement(id){
        let found = false;

        for (let index = 0; index < this.map.length; index++) {

            for (let cell = 0; cell < this.map[index].length; cell++) {
                const element = this.map[index][cell];
                if (element.id == id) {
                    element.address = [index,cell];
                    found = element;
                    break;
                }
            }

            if (found != false) {
                break;
            }

        }

        return found;
    }

    generateObstacles(obstacleCount){
        let obstacles = [];

        for (let index = 0; index < obstacleCount; index++) {
            let obst = new Obstacle("solid", 'img/obs2.png');
            obstacles.push(obst);
        }

        return obstacles;
    }

    showSplash(){
        const wrapper = document.createElement('div');
        wrapper.classList.add("splash");
        const img = document.createElement('img');
        img.src = "img/splash.png";
        wrapper.appendChild(img);
        document.body.appendChild(wrapper);

        $(wrapper).click(function(){
            $( this ).animate({
                opacity: "toggle"
              }, {
                duration: 3000,
                specialEasing: {
                  width: "linear",
                  height: "easeOutBounce"
                },
                complete: function() {
                  $( this ).remove();
                }
              });
        });
    }

    placeContent(location,content){
        this.map[location[0]][location[1]].content = content;
    }

    placeElement(sourceElement = false, targetElement, content = false, traces = false){

        let found = false;

        for (let index = 0; index < this.map.length; index++) {

            for (let cell = 0; cell < this.map[index].length; cell++) {
                const element = this.map[index][cell];
                if (element.id == targetElement.id) {
                    const oldContent = this.map[index][cell].content;
                    this.map[index][cell].content =  content ? content : sourceElement.content;
                    this.map[index][cell].address = [index, cell];
                    if(element.content != undefined && element.content.constructor.name == "Player"){
                        const oldPosition = this.map[index][cell].content.position;
                        const newPosition = [index, cell];
                      
                        this.map[index][cell].content.position = [index, cell];
                        this.map[index][cell].content.mapId = targetElement.id;

                    }

                    if(sourceElement.id != targetElement.id){
                        sourceElement != false? sourceElement.content = "" : false;
                    }
                    found = true;
                    break;
                }
            }

            if (found != false) {
                break;
            }

        }

        return found;

    }

    pickWeapon(oldPosition, newPosition){
        console.log(oldPosition);

        const changedElement = newPosition.filter(element => !oldPosition.includes(element));
        const changedIndexPosition = newPosition.indexOf(changedElement[0]);

        let scanRange = [oldPosition, newPosition];

        console.log("Scan Range " + scanRange);
        
        const detectedObjects = this.objectsInRange(scanRange);

        let randomPosition = [];
        do {
            randomPosition = Util.randomMapPosition();
        } while (this.map[randomPosition[0]][randomPosition[1]].content != "");

        for (let index = 0; index < detectedObjects.length; index++) {
            const element = detectedObjects[index];

            if(element.object.constructor.name == "Weapon" && JSON.stringify(newPosition) == JSON.stringify(element.position)){
                console.log("Weapon Detected");
                const oldWeapon = this.activePlayer.weapon;
                this.activePlayer.weapon = element.object;
                this.placeElement(false, this.map[randomPosition[0]][randomPosition[1]], oldWeapon);
                this.map[element.position[0]][element.position[1]].content = "";
                break;
            }
            
        }
    }

    objectsInRange(range){
        let collectedObjects = [];
        let oldRange = range[0];
        let newRange = range[1];
        const changedElement = newRange.filter(element => !oldRange.includes(element));
        const changedIndex = newRange.indexOf(changedElement[0]);
        let temp = [];
        
        if(newRange[0] < oldRange[0] || newRange[1] < oldRange[1]){
            temp = [newRange[0],newRange[1]];
            newRange = [oldRange[0],oldRange[1]];
            oldRange = temp;
        }

        for (let row = oldRange[0]; row <= newRange[0]; row++) {
            const column = this.map[row];

            for (let col = oldRange[1]; col <= newRange[1]; col++) {
                const iRow = this.map[row][col];

                if(iRow != undefined && typeof iRow.content == "object"){
                    collectedObjects.push({object: iRow.content, position: [row, col]});
                }
            }
        }

        return collectedObjects;
    }

    findCell(id) {

        let found = false;

        for (let index = 0; index < this.map.length; index++) {

            for (let cell = 0; cell < this.map[index].length; cell++) {
                const element = this.map[index][cell];
                if (element.id == id) {
                    found = element;
                    break;
                }
            }

            if (found != false) {
                break;
            }

        }

        return found;

    }

    

    reflectUI(){
        
    }
}

export default Board;
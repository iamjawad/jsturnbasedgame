import Player from './player';
import Weapon from './weapon';
import Obstacle from './obstacle';
import Util from './util';

class Board {
    constructor() {
        this.map = this.generateMapStructure();
        this.ui = "";
        this.weapons = [];
        this.generateWeapons();
        let defaultWeapon = this.weapons[0];
        this.playerOne = new Player(1,"p1", defaultWeapon, 'img/player1.png',"",{top:180, bottom:0, left:90, right:-90, lastValue: 0, dirStr:"bottom"});
        // this.playerOne.direction = {top:180, bottom:0, left:90, right:-90, lastValue: 0};
        this.playerTwo = new Player(2,"p2", defaultWeapon, 'img/player2.png',"",{top:0, bottom:180, left:-90, right:90, lastValue: 0, dirStr:"top"});
        // this.playerTwo.direction = {top:0, bottom:180, left:-90, right:90, lastValue: 0};
        this.activePlayer = "";

        this.init();
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

    initEnvironment(){

    }

    getPlayerMoves(){

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
        console.log(this.weapons);
        
    }

    generateWeapons(){
        let ordo = new Weapon('Ordo',10 ,'img/ordo.png');
        let estes = new Weapon('Estes Mini', 15, 'img/EstesMini.png');
        let fab = new Weapon('FAB-500', 20, 'img/FAB-500.png');
        let sion = new Weapon('Sion', 25, 'img/sion.png');
        let mOne = new Weapon('M1002', 30, 'img/M1002.png');

        this.weapons.push(ordo,estes,fab,sion,mOne);
    }

    initUI(){
        let table = document.createElement('table');
        let map = this.map;
        this.validateMoves(this.activePlayer.position);
    
        // Placing Obstacles on map
        let obstacles = this.generateObstacles(10);
        for (const obstacle of obstacles) {
            let randomLocation = Util.randomMapPosition();

            do {
                randomLocation = Util.randomMapPosition();
            } while (this.map[randomLocation[0]][randomLocation[1]].content != "");

            obstacle.ui = "";
            this.placeElement(false ,this.map[randomLocation[0]][randomLocation[1]], obstacle);
            this.map[randomLocation[0]][randomLocation[1]].content = obstacle;
            this.map[randomLocation[0]][randomLocation[1]].validMove = false;


        }

        // Placing Weapons
        for (const weapon of this.weapons) {
            let randomLocation = Util.randomMapPosition();

            do {
                randomLocation = Util.randomMapPosition();
            } while (this.map[randomLocation[0]][randomLocation[1]].content != "");

            this.placeElement(false ,this.map[randomLocation[0]][randomLocation[1]], weapon);
            // this.map[randomLocation[0]][randomLocation[1]].content = obstacle;
            this.map[randomLocation[0]][randomLocation[1]].validMove = false;
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

                if(typeName == "Player" && this.activePlayer == value.content){
                    cell.classList.add("active-player");
                    cell.setAttribute("direction", this.activePlayer.direction.dirStr);

                }

                if(typeName == "Obstacle"){
                    span.classList.add("obstacle");
                }

                if(value.validMove == true && value.content == ""){
                    cell.classList.add("valid-move");
                }

                if(value.id == map[targetPosition[1]][targetPosition[0]].id){
                    cell.classList.add("locked-target");
                    console.log(targetPosition);
                }
                // cell.innerHTML = span.outerHTML;
                cell.setAttribute("validMove",value.validMove);
                cell.setAttribute("id",value.id);
                cell.setAttribute("isBlank", value.isBlank);
                cell.setAttribute("content", value.content);
                if(typeName == "Player" || value.validMove == true){
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
        $(function() {
            $('#gameboard table').on('contextmenu', 'tr', function(e) {
                e.preventDefault();
                self.activePlayer.weapon.fire();
                self.activePlayer.score += 10;
                let oppositePlayer = self.getOppositePlayer();
                oppositePlayer.health -= 10;
                console.log(self.getOppositePlayer().health);
                console.log(self.activePlayer.score); 
            });
        });
        
        return table;
    }

    updateUIElement(){
        let table = document.createElement('table');
        let map = this.map;
        this.validateMoves(this.activePlayer.position);
    
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

                if(typeName == "Obstacle"){
                    span.classList.add("obstacle");
                }

                if(typeName == "Player" && this.activePlayer == value.content){
                    cell.classList.add("active-player");
                    cell.setAttribute("direction", this.activePlayer.direction.dirStr);
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
                if(typeName == "Player" || value.validMove == true){
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

        // let gameContainer = document.getElementById('gameboard');
        // document.body.outerHTML = table.outerHTML;
        $('#gameboard').html(table.outerHTML);

        
        this.ui = table;

        this.ui = table;
        let self = this;
        $(function() {
            $('#gameboard table').on('contextmenu', 'tr', function(e) {
                e.preventDefault();
                self.activePlayer.weapon.fire();
            });
        });
    }

    getTargetPosition(){
        let map = this.map;
        let activePlayerPosition = this.activePlayer.position;
        let row = activePlayerPosition[0];
        let column = activePlayerPosition[1];
        let activePlayerDirection = this.activePlayer.direction.dirStr;

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
        if(this.activePlayer == this.playerOne){
            return this.activePlayer;
        }

        return this.playerTwo;
    }

    updatePlayerDirection(){
        let direction = "";
        let map = this.map;
        let playerPosition = this.activePlayer.position;
        let column = playerPosition[0];
        let row = playerPosition[1];
        for (let index = 0; index < map[column].length; index++) {
            const element = map[index][row];
            // console.log(element);
            if(this.activePlayer != element.content && element.content.constructor.name == "Player"){
                if(column > index){
                    this.activePlayer.direction.lastValue = this.activePlayer.direction.top;
                    this.activePlayer.direction.dirStr = "top";
                    let timeout = setTimeout(() => {
                        this.rotatePlayer(this.activePlayer.direction.top);
                        clearTimeout(timeout);
                    }, 1);
                } else {
                    this.activePlayer.direction.lastValue = this.activePlayer.direction.bottom;
                    this.activePlayer.direction.dirStr = "bottom";
                    let timeout = setTimeout(() => {
                        this.rotatePlayer(this.activePlayer.direction.bottom);
                        clearTimeout(timeout);
                    }, 1);
                }
                return;

            }
        }

        for (let index = 0; index < map[column].length; index++) {
            const element = map[column][index];
            
            if(this.activePlayer != element.content && element.content.constructor.name == "Player"){
                if(row > index){
                    let timeout = setTimeout(() => {
                        this.rotatePlayer(this.activePlayer.direction.left);
                        clearTimeout(timeout);
                    }, 1);
                    this.activePlayer.direction.dirStr = "left";
                    this.activePlayer.direction.lastValue = this.activePlayer.direction.left;
                } else {
                    let timeout = setTimeout(() => {
                        this.rotatePlayer(this.activePlayer.direction.right);
                        clearTimeout(timeout);
                    }, 1);
                    this.activePlayer.direction.dirStr = "right";
                    this.activePlayer.direction.lastValue = this.activePlayer.direction.right;
                }
                return;

            }
        }

        

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

    animateMovement(sourceElement,targetElement){
        let source = $('#' + sourceElement.id + ' span');
        let targetElm = $('#' + targetElement.id + ' span');

        source.animate(
            { 
                top: targetElm.offset().top - source.parent().offset().top, 
                left: targetElm.offset().left - source.parent().offset().left
            }, 
            {
                easing:"swing",
                duration:3000,
                complete: () => {
                    this.playerOne.getUi();
                    this.playerTwo.getUi();
                    this.updatePlayerDirection();
                    this.updateUIElement();
                    // this.activePlayer.weapon.fire();
                }
            });
        

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
        
        
        area = this.elementExisit([location[0],location[1] -1]) ? map[location[0]][location[1]-1] : false;

        // console.log(JSON.parse(JSON.stringify(area)));

        area != false && area.content != "obstacle" ? area.validMove = true : false;
        
        // Checking if obstacle detected at first
        if(area != false && area.content.constructor.name != "Obstacle"){
            area = this.elementExisit([location[0],location[1] -2]) ? map[location[0]][location[1]-2] : false;
            area != false && area.content != "obstacle" ? area.validMove = true : false;
        }

        area = this.elementExisit([location[0],location[1] +1]) ? map[location[0]][location[1]+1] : false;
        area != false && area.content != "obstacle" ? area.validMove = true : false;

        // Checking if obstacle detected at first
        if(area != false && area.content.constructor.name != "Obstacle"){
        area = this.elementExisit([location[0],location[1] +2]) ? map[location[0]][location[1]+2] : false;
        area != false && area.content != "obstacle" ? area.validMove = true : false;
        }

        // Setting Vertical Moves
        area = this.elementExisit([location[0]-1,location[1]]) ? map[location[0]-1][location[1]] : false;
        area != false && area.content != "obstacle" ? area.validMove = true : false;

        // Checking if obstacle detected at first
        if(area != false && area.content.constructor.name != "Obstacle"){
        area = this.elementExisit([location[0]-2,location[1]]) ? map[location[0]-2][location[1]] : false;
        area != false && area.content != "obstacle" ? area.validMove = true : false;
        }

        area = this.elementExisit([location[0]+1,location[1]]) ? map[location[0]+1][location[1]] : false;
        area != false && area.content != "obstacle" ? area.validMove = true : false;

        // Checking if obstacle detected at first
        if(area != false && area.content.constructor.name != "Obstacle"){
        area = this.elementExisit([location[0]+2,location[1]]) ? map[location[0]+2][location[1]] : false;
        area != false && area.content != "obstacle" ? area.validMove = true : false;
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

    // placeElement(sourceElement, targetElement){

    //     let found = false;

    //     for (let index = 0; index < this.map.length; index++) {

    //         for (let cell = 0; cell < this.map[index].length; cell++) {
    //             const element = this.map[index][cell];
    //             if (element.id == targetElement.id) {
    //                 this.map[index][cell] = sourceElement;
    //                 found = true;
    //                 break;
    //             }
    //         }

    //         if (found != false) {
    //             break;
    //         }

    //     }

    //     return found;

    // }

    placeContent(location,content){
        this.map[location[0]][location[1]].content = content;
    }

    placeElement(sourceElement = false, targetElement, content = false, traces = false){

        let found = false;

        for (let index = 0; index < this.map.length; index++) {

            for (let cell = 0; cell < this.map[index].length; cell++) {
                const element = this.map[index][cell];
                if (element.id == targetElement.id) {
                    this.map[index][cell].content =  content ? content : sourceElement.content;
                    if(element.content != undefined && element.content.constructor.name == "Player"){
                        this.map[index][cell].content.position = [index, cell];
                    }
                    // if(element.content != undefined && element.content.constructor.name == "Obstacle"){
                    //     this.map[index][cell].typeName = "Obstacle";
                    //     console.log(element.content.constructor.name);
                    // }
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
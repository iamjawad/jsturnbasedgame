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
        this.playerOne = new Player(1,"p1", new Weapon('Ordo',10 ,'img/ordo.png'), 'img/player1.png',"",{top:180, bottom:0, left:90, right:-90, lastValue: 0, dirStr:"bottom"});
        // this.playerOne.direction = {top:180, bottom:0, left:90, right:-90, lastValue: 0};
        this.playerTwo = new Player(2,"p2", new Weapon('Ordo',10 ,'img/ordo.png'), 'img/player2.png',"",{top:0, bottom:180, left:-90, right:90, lastValue: 0, dirStr:"top"});
        // this.playerTwo.direction = {top:0, bottom:180, left:-90, right:90, lastValue: 0};
        this.activePlayer = "";
        this.gameEnded = false;
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
        // let ordo = new Weapon('Ordo',10 ,'img/ordo.png');
        let estes = new Weapon('Estes Mini', 15, 'img/EstesMini.png');
        let fab = new Weapon('FAB-500', 20, 'img/FAB-500.png');
        let sion = new Weapon('Sion', 25, 'img/sion.png');
        let mOne = new Weapon('M1002', 30, 'img/M1002.png');

        this.weapons.push(estes,fab,sion,mOne);
    }

    initUI(){
        // this.showSplash();
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
            this.map[randomLocation[0]][randomLocation[1]].content = obstacle;
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
            // this.map[randomLocation[0]][randomLocation[1]].content = obstacle;
            // this.map[randomLocation[0]][randomLocation[1]].validMove = false;
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

      

        console.log("Updating.......");
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

        // let gameContainer = document.getElementById('gameboard');
        // document.body.outerHTML = table.outerHTML;
        $('#gameboard').html(table.outerHTML);

        
        this.ui = table;

        this.ui = table;
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
        if(JSON.stringify(this.activePlayer) == JSON.stringify(this.playerOne)){
            return this.playerTwo;
        }

        return this.playerOne;
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
                    const oldContent = this.map[index][cell].content;
                    this.map[index][cell].content =  content ? content : sourceElement.content;
                    // Problem - Content Replaced Before
                    if(element.content != undefined && element.content.constructor.name == "Player"){
                        const oldPosition = this.map[index][cell].content.position;
                        const newPosition = [index, cell];
                        // this.pickWeapon(oldPosition, newPosition);
                      
                        this.map[index][cell].content.position = [index, cell];
                        this.map[index][cell].content.mapId = targetElement.id;
                        // setTimeout(() => {
                        //     this.pickWeapon(oldPosition, newPosition);
                        // }, 1);

                        // console.log(JSON.parse(JSON.stringify(sourceElement)));
                        // console.log(sourceElement);
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

    pickWeapon(oldPosition, newPosition){
        console.log(oldPosition);

        const changedElement = newPosition.filter(element => !oldPosition.includes(element));
        const changedIndexPosition = newPosition.indexOf(changedElement[0]);

        // const range = changedIndexPosition == 0 ? [newPosition[changedIndexPosition], newPosition[1]] : [newPosition[1], newPosition[changedIndexPosition]];

        let scanRange = [oldPosition, newPosition];
        
        // if(changedIndexPosition != -1 && changedIndexPosition == 0){
        //     scanRange = [newPosition[changedIndexPosition], newPosition[1]];
        // } else {
        //     scanRange = [newPosition[1], newPosition[changedIndexPosition]];
        // }

        console.log("Scan Range " + scanRange);
        
        const detectedObjects = this.objectsInRange(scanRange);

        // Get Weapons from objects
        // detectedObjects.forEach(obj => {
        //     console.log("yoooo");
        //     console.log(obj.object);
        //     if(obj.object.constructor.name == "Weapon"){
        //         console.log("Weapon Detected");
        //     }
        // });

        // Getting random available position to place old weapon
        let randomPosition = [];
        do {
            randomPosition = Util.randomMapPosition();
        } while (this.map[randomPosition[0]][randomPosition[1]].content != "");

        for (let index = 0; index < detectedObjects.length; index++) {
            const element = detectedObjects[index];
            // console.log("Pos ADD");
            // console.log(JSON.stringify(newPosition));
            // console.log(JSON.stringify(element.position));
            // console.log(newPosition);
            // console.log(element.position);
            // console.log(newPosition == element.position);
            // console.log(element);
            if(element.object.constructor.name == "Weapon" && JSON.stringify(newPosition) == JSON.stringify(element.position)){
                console.log("Weapon Detected");
                const oldWeapon = this.activePlayer.weapon;
                this.activePlayer.weapon = element.object;
                this.placeElement(false, this.map[randomPosition[0]][randomPosition[1]], oldWeapon);
                this.map[element.position[0]][element.position[1]].content = "";
                break;
            }
            
        }

        console.log("Detected_Objects");
        console.log(detectedObjects);
        console.log("Detected_Objects__END");

        // this.map[newPosition[0]][newPosition[1]].content.position = newPosition;
        // if (changedElement != [] && changedIndexPosition != -1) {
        //     console.log("jere");
        //     const change = (changedIndexPosition == 0 ? "row" : "column");
        //     if (change == "row" && changedIndexPosition == 0) {
        //         if (newPosition[0] > oldPosition[0]) {
        //             movementRange = ["row", oldPosition[changedIndexPosition], newPosition[changedIndexPosition]];
        //         }
        //     }

            
        // }
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

        // if(newRange[changedIndex] > oldRange[changedIndex]){}
        for (let row = oldRange[0]; row <= newRange[0]; row++) {
            const column = this.map[row];
            console.log("row " + row);
            for (let col = oldRange[1]; col <= newRange[1]; col++) {
                const iRow = this.map[row][col];
                console.log("col " + col);
                // element.content != undefined && element.content.constructor.name == "Player"
                // console.log("iRow");
                // console.log(iRow);
                console.log("ObjectsinRange - Start");
                console.log(JSON.parse(JSON.stringify(iRow)));
                console.log("ObjectsinRange - end");

                if(iRow != undefined && typeof iRow.content == "object"){
                    collectedObjects.push({object: iRow.content, position: [row, col]});
                }
            }
        }
        

        // if(newRange[changedIndex] < oldRange[changedIndex]){
        //     for (let row = oldRange[0]; row >= newRange[0]; row--) {
        //         const column = this.map[row];
                
        //         for (let col = oldRange[1]; col >= newRange[1]; col--) {
        //             const iRow = this.map[row][col];
        //             // element.content != undefined && element.content.constructor.name == "Player"
        //             // console.log("iRow");
        //             // console.log(iRow);
        //             console.log(JSON.parse(JSON.stringify(iRow)));
    
        //             if(iRow != undefined && typeof iRow.content == "object"){
        //                 collectedObjects.push(iRow.content);
        //             }
        //         }
        //     }
        // }



        
        console.log(collectedObjects);
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
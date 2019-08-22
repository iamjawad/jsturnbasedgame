import Board from './modules/board';

window.dragover = function(e){
    e.preventDefault();
    e.currentTarget.classList.add("dragging");
}

window.dragenter = function(e){
    // e.preventDefault();
    e.currentTarget.classList.add("dragging");
}

window.drop = function(e){
    e.preventDefault();
    let sourceElement = gameBoard.getElement(e.dataTransfer.getData("text/plain"));
    let targetElement = gameBoard.getElement(e.currentTarget.parentElement.id);
    gameBoard.nextTurn();
    gameBoard.placeElement(sourceElement,targetElement);
    gameBoard.animateMovement(sourceElement, targetElement);
    
}

window.dragleave = function(e){
    e.currentTarget.classList.remove("dragging");
}

window.dragend = function(e){
    e.currentTarget.classList.remove("dragging");
}



window.dragstart = function(e){
    // e.preventDefault();
    
    e.dataTransfer.setData("text/plain", e.currentTarget.parentElement.id);
    e.currentTarget.classList.add("dragging");
}

var gameBoard = new Board();

let table = gameBoard.initUI();

(function() {
    // document.body.appendChild(gameBoard.ui);
    $('#gameboard').html(table.outerHTML); 
    // gameBoard.activePlayer.weapon.fire();
    gameBoard.updatePlayerDirection();
 })();






// document.onload = function(){
//   document.body.appendChild(table);  
// }


// document.body.appendChild(table);


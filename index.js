import Board from './modules/board';

window.dragover = function(e){
    e.preventDefault();
    e.currentTarget.parentElement.classList.add("dragging");
}

window.dragenter = function(e){
    // e.preventDefault();
    e.currentTarget.parentElement.classList.add("dragging");
}

window.drop = function(e){
    e.preventDefault();
    let sourceElement = gameBoard.getElement(e.dataTransfer.getData("text/plain"));
    let targetElement = gameBoard.getElement(e.currentTarget.parentElement.id);

    if(sourceElement.content != targetElement.content){
        gameBoard.pickWeapon(sourceElement.address, targetElement.address);
        gameBoard.animateMovement(sourceElement, targetElement);
        gameBoard.placeElement(sourceElement,targetElement);
        // gameBoard.nextTurn();
    }
    
    

}

window.dragleave = function(e){
    e.currentTarget.parentElement.classList.remove("dragging");
}

window.dragend = function(e){
    e.currentTarget.parentElement.classList.remove("dragging");
}



window.dragstart = function(e){
    // e.preventDefault();
    e.dataTransfer.setData("text/plain", e.currentTarget.parentElement.id);
    e.currentTarget.parentElement.classList.add("dragging");
}

var gameBoard = new Board();

window.board = gameBoard;

let table = gameBoard.initUI();
console.log("Game Started");
(function() {
    $('#gameboard').html(table.outerHTML); 
 })();



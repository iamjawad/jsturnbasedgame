(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _board = require("./modules/board");

var _board2 = _interopRequireDefault(_board);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.dragover = function (e) {
    e.preventDefault();
    e.currentTarget.classList.add("dragging");
};

window.dragenter = function (e) {
    // e.preventDefault();
    e.currentTarget.classList.add("dragging");
};

window.drop = function (e) {
    e.preventDefault();
    var sourceElement = gameBoard.getElement(e.dataTransfer.getData("text/plain"));
    var targetElement = gameBoard.getElement(e.currentTarget.parentElement.id);
    console.log(sourceElement);
    console.log(targetElement);
    gameBoard.nextTurn();
    gameBoard.pickWeapon(sourceElement.address, targetElement.address);
    gameBoard.placeElement(sourceElement, targetElement);
    gameBoard.animateMovement(sourceElement, targetElement);
};

window.dragleave = function (e) {
    e.currentTarget.classList.remove("dragging");
};

window.dragend = function (e) {
    e.currentTarget.classList.remove("dragging");
};

window.dragstart = function (e) {
    // e.preventDefault();

    e.dataTransfer.setData("text/plain", e.currentTarget.parentElement.id);
    e.currentTarget.classList.add("dragging");
};

var gameBoard = new _board2.default();

var table = gameBoard.initUI();
console.log("Game Started");
(function () {
    // document.body.appendChild(gameBoard.ui);
    $('#gameboard').html(table.outerHTML);
    // gameBoard.activePlayer.weapon.fire();
    gameBoard.updatePlayerDirection();
})();

// document.onload = function(){
//   document.body.appendChild(table);  
// }


// document.body.appendChild(table);

},{"./modules/board":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _weapon = require('./weapon');

var _weapon2 = _interopRequireDefault(_weapon);

var _obstacle = require('./obstacle');

var _obstacle2 = _interopRequireDefault(_obstacle);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
    function Board() {
        _classCallCheck(this, Board);

        this.map = this.generateMapStructure();
        this.ui = "";
        this.weapons = [];
        this.generateWeapons();
        var defaultWeapon = this.weapons[0];
        this.playerOne = new _player2.default(1, "p1", new _weapon2.default('Ordo', 10, 'img/ordo.png'), 'img/player1.png', "", { top: 180, bottom: 0, left: 90, right: -90, lastValue: 0, dirStr: "bottom" });
        // this.playerOne.direction = {top:180, bottom:0, left:90, right:-90, lastValue: 0};
        this.playerTwo = new _player2.default(2, "p2", new _weapon2.default('Ordo', 10, 'img/ordo.png'), 'img/player2.png', "", { top: 0, bottom: 180, left: -90, right: 90, lastValue: 0, dirStr: "top" });
        // this.playerTwo.direction = {top:0, bottom:180, left:-90, right:90, lastValue: 0};
        this.activePlayer = "";

        this.init();
    }

    _createClass(Board, [{
        key: 'generateMapStructure',
        value: function generateMapStructure() {
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
    }, {
        key: 'initEnvironment',
        value: function initEnvironment() {}
    }, {
        key: 'getPlayerMoves',
        value: function getPlayerMoves() {}
    }, {
        key: 'init',
        value: function init() {
            var playerOneLocation = [Math.floor(Math.random() * 3 + 0), Math.floor(Math.random() * 7 + 0)];
            var playerTwoLocation = [Math.floor(Math.random() * (7 - 4 + 1)) + 4, Math.floor(Math.random() * 7 + 0)];
            var randomPlayer = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
            this.activePlayer = randomPlayer ? this.playerOne : this.playerTwo;
            this.playerOne.position = [playerOneLocation[0], playerOneLocation[1]];
            this.playerTwo.position = [playerTwoLocation[0], playerTwoLocation[1]];
            this.placeElement(false, this.map[playerOneLocation[0]][playerOneLocation[1]], this.playerOne);
            this.placeElement(false, this.map[playerTwoLocation[0]][playerTwoLocation[1]], this.playerTwo);
            console.log(this.weapons);
        }
    }, {
        key: 'generateWeapons',
        value: function generateWeapons() {
            // let ordo = new Weapon('Ordo',10 ,'img/ordo.png');
            var estes = new _weapon2.default('Estes Mini', 15, 'img/EstesMini.png');
            var fab = new _weapon2.default('FAB-500', 20, 'img/FAB-500.png');
            var sion = new _weapon2.default('Sion', 25, 'img/sion.png');
            var mOne = new _weapon2.default('M1002', 30, 'img/M1002.png');

            this.weapons.push(estes, fab, sion, mOne);
        }
    }, {
        key: 'initUI',
        value: function initUI() {
            var _this = this;

            var table = document.createElement('table');
            var map = this.map;

            // Placing Obstacles on map
            var obstacles = this.generateObstacles(10);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = obstacles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var obstacle = _step.value;

                    var randomLocation = _util2.default.randomMapPosition();

                    do {
                        randomLocation = _util2.default.randomMapPosition();
                    } while (this.map[randomLocation[0]][randomLocation[1]].content != "");

                    obstacle.ui = "";
                    this.placeElement(false, this.map[randomLocation[0]][randomLocation[1]], obstacle);
                    this.map[randomLocation[0]][randomLocation[1]].content = obstacle;
                    this.map[randomLocation[0]][randomLocation[1]].validMove = false;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.validateMoves(this.activePlayer.position);
            // Placing Weapons
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.weapons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var weapon = _step2.value;

                    var randomLocation = _util2.default.randomMapPosition();

                    do {
                        randomLocation = _util2.default.randomMapPosition();
                    } while (this.map[randomLocation[0]][randomLocation[1]].content != "");

                    this.placeElement(false, this.map[randomLocation[0]][randomLocation[1]], weapon);
                    // this.map[randomLocation[0]][randomLocation[1]].content = obstacle;
                    // this.map[randomLocation[0]][randomLocation[1]].validMove = false;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var targetPosition = this.getTargetPosition();

            var _loop = function _loop(row) {
                var tableRow = document.createElement('tr');

                row.forEach(function (value) {
                    var cell = document.createElement('td');
                    var span = document.createElement('span');
                    var typeName = value.content.constructor.name;

                    if (_typeof(value.content) == "object" && value.content.ui != "") {
                        span.appendChild(value.content.ui);
                    }

                    if (typeName == "Player" && _this.activePlayer == value.content) {
                        cell.classList.add("active-player");
                        cell.setAttribute("direction", _this.activePlayer.direction.dirStr);
                    }

                    if (typeName == "Obstacle") {
                        span.classList.add("obstacle");
                    }

                    if (value.validMove == true && value.content == "") {
                        cell.classList.add("valid-move");
                    }

                    if (value.id == map[targetPosition[1]][targetPosition[0]].id) {
                        cell.classList.add("locked-target");
                    }
                    // cell.innerHTML = span.outerHTML;
                    cell.setAttribute("validMove", value.validMove);
                    cell.setAttribute("id", value.id);
                    cell.setAttribute("isBlank", value.isBlank);
                    cell.setAttribute("content", value.content);
                    if (typeName == "Player" || value.validMove == true) {
                        span.setAttribute("ondragover", "dragover(event)");
                        span.setAttribute("ondragenter", "dragenter(event)");
                        span.setAttribute("ondragend", "dragend(event)");
                        span.setAttribute("ondragleave", "dragleave(event)");
                        span.setAttribute("ondragstart", "dragstart(event)");
                        span.setAttribute("ondrop", "drop(event)");
                        span.setAttribute("draggable", "true");
                    }

                    cell.appendChild(span);
                    tableRow.appendChild(cell);
                });

                table.appendChild(tableRow);
            };

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = map[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var row = _step3.value;

                    _loop(row);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            this.ui = table;
            var self = this;
            $(function () {
                $('#gameboard table').on('contextmenu', 'tr', function (e) {
                    e.preventDefault();
                    self.activePlayer.weapon.fire();
                    self.activePlayer.score += 10;
                    var oppositePlayer = self.getOppositePlayer();
                    oppositePlayer.health -= 10;
                    console.log(self.getOppositePlayer().health);
                    console.log(self.activePlayer.score);
                });
            });

            return table;
        }
    }, {
        key: 'updateUIElement',
        value: function updateUIElement() {
            var _this2 = this;

            console.log("Updating.......");
            var table = document.createElement('table');
            var map = this.map;
            this.validateMoves(this.activePlayer.position);

            var targetPosition = this.getTargetPosition();

            var _loop2 = function _loop2(row) {
                var tableRow = document.createElement('tr');

                row.forEach(function (value) {
                    var cell = document.createElement('td');
                    var span = document.createElement('span');
                    var typeName = value.content.constructor.name;

                    if (_typeof(value.content) == "object" && value.content.ui != "") {
                        span.appendChild(value.content.ui);
                    }

                    if (typeName == "Obstacle") {
                        span.classList.add("obstacle");
                    }

                    if (typeName == "Player" && _this2.activePlayer == value.content) {
                        cell.classList.add("active-player");
                        cell.setAttribute("direction", _this2.activePlayer.direction.dirStr);
                    }

                    if (value.validMove == true && value.content == "") {
                        cell.classList.add("valid-move");
                    }

                    if (value.id == map[targetPosition[1]][targetPosition[0]].id) {
                        cell.classList.add("locked-target");

                        console.log(targetPosition);
                    }

                    cell.setAttribute("validMove", value.validMove);

                    cell.setAttribute("id", value.id);
                    cell.setAttribute("isBlank", value.isBlank);
                    cell.setAttribute("content", value.content);
                    if (typeName == "Player" || value.validMove == true) {
                        span.setAttribute("ondragover", "dragover(event)");
                        span.setAttribute("ondragenter", "dragenter(event)");
                        span.setAttribute("ondragend", "dragend(event)");
                        span.setAttribute("ondragleave", "dragleave(event)");
                        span.setAttribute("ondragstart", "dragstart(event)");
                        span.setAttribute("ondrop", "drop(event)");
                        span.setAttribute("draggable", "true");
                    }
                    cell.appendChild(span);
                    tableRow.appendChild(cell);
                });

                table.appendChild(tableRow);
            };

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = map[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var row = _step4.value;

                    _loop2(row);
                }

                // let gameContainer = document.getElementById('gameboard');
                // document.body.outerHTML = table.outerHTML;
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            $('#gameboard').html(table.outerHTML);

            this.ui = table;

            this.ui = table;
            var self = this;
            $(function () {
                $('#gameboard table').on('contextmenu', 'tr', function (e) {
                    e.preventDefault();
                    self.activePlayer.weapon.fire();
                });
            });
        }
    }, {
        key: 'getTargetPosition',
        value: function getTargetPosition() {
            var map = this.map;
            var activePlayerPosition = this.activePlayer.position;
            var row = activePlayerPosition[0];
            var column = activePlayerPosition[1];
            var activePlayerDirection = this.activePlayer.direction.dirStr;

            switch (activePlayerDirection) {
                case "top":
                    for (var index = row - 1; index >= 0; index--) {
                        var element = map[index][column];

                        if (element.content != "") {
                            return [column, index];
                        }
                    }
                    return [column, 0];
                    break;

                case "bottom":
                    for (var _index = row + 1; _index < map.length; _index++) {
                        var _element = map[_index][column];

                        if (_element.content != "") {
                            return [column, _index];
                        }
                    }
                    return [column, map.length - 1];
                    break;

                case "left":
                    for (var _index2 = column - 1; _index2 >= 0; _index2--) {
                        var _element2 = map[row][_index2];

                        if (_element2.content != "") {
                            return [_index2, row];
                        }
                    }
                    return [0, row];
                    break;

                case "right":
                    for (var _index3 = column + 1; _index3 < map[0].length; _index3++) {
                        var _element3 = map[row][_index3];

                        if (_element3.content != "") {
                            return [_index3, row];
                        }
                    }
                    return [map[0].length - 1, row];
                    break;

                default:
                    break;
            }
        }
    }, {
        key: 'getOppositePlayer',
        value: function getOppositePlayer() {
            if (this.activePlayer == this.playerOne) {
                return this.activePlayer;
            }

            return this.playerTwo;
        }
    }, {
        key: 'updatePlayerDirection',
        value: function updatePlayerDirection() {
            var _this3 = this;

            var direction = "";
            var map = this.map;
            var playerPosition = this.activePlayer.position;
            var column = playerPosition[0];
            var row = playerPosition[1];
            for (var index = 0; index < map[column].length; index++) {
                var element = map[index][row];
                // console.log(element);
                if (this.activePlayer != element.content && element.content.constructor.name == "Player") {
                    if (column > index) {
                        (function () {
                            _this3.activePlayer.direction.lastValue = _this3.activePlayer.direction.top;
                            _this3.activePlayer.direction.dirStr = "top";
                            var timeout = setTimeout(function () {
                                _this3.rotatePlayer(_this3.activePlayer.direction.top);
                                clearTimeout(timeout);
                            }, 1);
                        })();
                    } else {
                        (function () {
                            _this3.activePlayer.direction.lastValue = _this3.activePlayer.direction.bottom;
                            _this3.activePlayer.direction.dirStr = "bottom";
                            var timeout = setTimeout(function () {
                                _this3.rotatePlayer(_this3.activePlayer.direction.bottom);
                                clearTimeout(timeout);
                            }, 1);
                        })();
                    }
                    return;
                }
            }

            for (var _index4 = 0; _index4 < map[column].length; _index4++) {
                var _element4 = map[column][_index4];

                if (this.activePlayer != _element4.content && _element4.content.constructor.name == "Player") {
                    if (row > _index4) {
                        (function () {
                            var timeout = setTimeout(function () {
                                _this3.rotatePlayer(_this3.activePlayer.direction.left);
                                clearTimeout(timeout);
                            }, 1);
                            _this3.activePlayer.direction.dirStr = "left";
                            _this3.activePlayer.direction.lastValue = _this3.activePlayer.direction.left;
                        })();
                    } else {
                        (function () {
                            var timeout = setTimeout(function () {
                                _this3.rotatePlayer(_this3.activePlayer.direction.right);
                                clearTimeout(timeout);
                            }, 1);
                            _this3.activePlayer.direction.dirStr = "right";
                            _this3.activePlayer.direction.lastValue = _this3.activePlayer.direction.right;
                        })();
                    }
                    return;
                }
            }
        }
    }, {
        key: 'rotatePlayer',
        value: function rotatePlayer(degrees) {

            var css = {
                'transform': 'rotate(' + degrees + 'deg)',
                '-ms-transform': 'rotate(' + degrees + 'deg)',
                '-moz-transform': 'rotate(' + degrees + 'deg)',
                '-webkit-transform': 'rotate(' + degrees + 'deg)',
                '-o-transform': 'rotate(' + degrees + 'deg)',
                '-webkit-transition': '-webkit-transform 1s linear 0.2s',
                '-moz-transition': '-moz-transform 1s linear 0.2s',
                'transition': 'transform 1s linear 0.2s'
            };

            $('.active-player span img').css(css);

            return css;
        }
    }, {
        key: 'animateMovement',
        value: function animateMovement(sourceElement, targetElement) {
            var _this4 = this;

            var source = $('#' + sourceElement.id + ' span');
            var targetElm = $('#' + targetElement.id + ' span');

            source.animate({
                top: targetElm.offset().top - source.parent().offset().top,
                left: targetElm.offset().left - source.parent().offset().left
            }, {
                easing: "swing",
                duration: 3000,
                complete: function complete() {
                    _this4.playerOne.getUi();
                    _this4.playerTwo.getUi();
                    _this4.updatePlayerDirection();
                    _this4.updateUIElement();
                    // this.activePlayer.weapon.fire();
                }
            });
        }
    }, {
        key: 'nextTurn',
        value: function nextTurn() {
            this.playerOne.move();
            if (this.activePlayer == this.playerOne) {
                this.activePlayer = this.playerTwo;
            } else {
                this.activePlayer = this.playerOne;
            }
            this.validateMoves(this.activePlayer.position);
        }
    }, {
        key: 'validateMoves',
        value: function validateMoves(location) {
            var map = this.map;
            var miniMap = [];
            var center = this.map[location[0]][location[1]];
            var area = "";

            this.map.forEach(function (element) {
                element.forEach(function (subElement) {
                    subElement.validMove = false;
                });
            });

            // Setting Horizental Moves

            // Left # 1
            area = this.elementExisit([location[0], location[1] - 1]) ? map[location[0]][location[1] - 1] : false;
            area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;

            // Left # 2 - Checking if obstacle detected at first
            if (area != false && area.validMove == true) {
                area = this.elementExisit([location[0], location[1] - 2]) ? map[location[0]][location[1] - 2] : false;
                area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
            }

            // Left # 3
            if (area != false && area.validMove == true) {
                area = this.elementExisit([location[0], location[1] - 3]) ? map[location[0]][location[1] - 3] : false;
                area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
            }

            // Right # 1
            area = this.elementExisit([location[0], location[1] + 1]) ? map[location[0]][location[1] + 1] : false;
            area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;

            // Right # 2
            if (area.validMove == true) {
                area = this.elementExisit([location[0], location[1] + 2]) ? map[location[0]][location[1] + 2] : false;
                area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
            }

            // Right # 3
            if (area.validMove == true) {
                area = this.elementExisit([location[0], location[1] + 3]) ? map[location[0]][location[1] + 3] : false;
                area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
            }

            // Setting Vertical Moves
            // Top # 1
            area = this.elementExisit([location[0] - 1, location[1]]) ? map[location[0] - 1][location[1]] : false;
            area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;

            // Top # 2 - Checking if obstacle detected at first
            if (area.validMove == true) {
                area = this.elementExisit([location[0] - 2, location[1]]) ? map[location[0] - 2][location[1]] : false;
                area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
            }

            // Top # 3 
            if (area.validMove == true) {
                area = this.elementExisit([location[0] - 3, location[1]]) ? map[location[0] - 3][location[1]] : false;
                area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
            }

            // Bottom # 1 
            area = this.elementExisit([location[0] + 1, location[1]]) ? map[location[0] + 1][location[1]] : false;
            area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;

            // console.log(JSON.parse(JSON.stringify(area)));
            // Bottom # 2
            if (area.validMove == true) {
                area = this.elementExisit([location[0] + 2, location[1]]) ? map[location[0] + 2][location[1]] : false;
                area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
            }

            // Bottom # 3
            if (area.validMove == true) {
                area = this.elementExisit([location[0] + 3, location[1]]) ? map[location[0] + 3][location[1]] : false;
                area != false && area.content.constructor.name != "Obstacle" ? area.validMove = true : false;
            }
        }
    }, {
        key: 'elementExisit',
        value: function elementExisit(element) {
            if (typeof this.map[element[0]] != "undefined" && typeof this.map[element[0]][element[1]] != "undefined") {
                return true;
            }
            return false;
        }
    }, {
        key: 'getElement',
        value: function getElement(id) {
            var found = false;

            for (var index = 0; index < this.map.length; index++) {

                for (var cell = 0; cell < this.map[index].length; cell++) {
                    var element = this.map[index][cell];
                    if (element.id == id) {
                        element.address = [index, cell];
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
    }, {
        key: 'generateObstacles',
        value: function generateObstacles(obstacleCount) {
            var obstacles = [];

            for (var index = 0; index < obstacleCount; index++) {
                var obst = new _obstacle2.default("solid", 'img/obs2.png');
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

    }, {
        key: 'placeContent',
        value: function placeContent(location, content) {
            this.map[location[0]][location[1]].content = content;
        }
    }, {
        key: 'placeElement',
        value: function placeElement() {
            var sourceElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var targetElement = arguments[1];
            var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var traces = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


            var found = false;

            for (var index = 0; index < this.map.length; index++) {

                for (var cell = 0; cell < this.map[index].length; cell++) {
                    var element = this.map[index][cell];
                    if (element.id == targetElement.id) {
                        var oldContent = this.map[index][cell].content;
                        this.map[index][cell].content = content ? content : sourceElement.content;
                        // Problem - Content Replaced Before
                        if (element.content != undefined && element.content.constructor.name == "Player") {
                            var oldPosition = this.map[index][cell].content.position;
                            var newPosition = [index, cell];
                            // this.pickWeapon(oldPosition, newPosition);

                            this.map[index][cell].content.position = [index, cell];
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
                        if (sourceElement.id != targetElement.id) {
                            sourceElement != false ? sourceElement.content = "" : false;
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
    }, {
        key: 'pickWeapon',
        value: function pickWeapon(oldPosition, newPosition) {
            console.log(oldPosition);

            var changedElement = newPosition.filter(function (element) {
                return !oldPosition.includes(element);
            });
            var changedIndexPosition = newPosition.indexOf(changedElement[0]);

            // const range = changedIndexPosition == 0 ? [newPosition[changedIndexPosition], newPosition[1]] : [newPosition[1], newPosition[changedIndexPosition]];

            var scanRange = [oldPosition, newPosition];

            // if(changedIndexPosition != -1 && changedIndexPosition == 0){
            //     scanRange = [newPosition[changedIndexPosition], newPosition[1]];
            // } else {
            //     scanRange = [newPosition[1], newPosition[changedIndexPosition]];
            // }

            console.log("Scan Range " + scanRange);

            var detectedObjects = this.objectsInRange(scanRange);

            // Get Weapons from objects
            // detectedObjects.forEach(obj => {
            //     console.log("yoooo");
            //     console.log(obj.object);
            //     if(obj.object.constructor.name == "Weapon"){
            //         console.log("Weapon Detected");
            //     }
            // });

            // Getting random available position to place old weapon
            var randomPosition = [];
            do {
                randomPosition = _util2.default.randomMapPosition();
            } while (this.map[randomPosition[0]][randomPosition[1]].content != "");

            for (var index = 0; index < detectedObjects.length; index++) {
                var element = detectedObjects[index];
                console.log("Pos ADD");
                console.log(JSON.stringify(newPosition));
                console.log(JSON.stringify(element.position));
                console.log(newPosition);
                console.log(element.position);
                console.log(newPosition == element.position);
                console.log(element);
                if (element.object.constructor.name == "Weapon" && JSON.stringify(newPosition) == JSON.stringify(element.position)) {
                    console.log("Weapon Detected");
                    var oldWeapon = this.activePlayer.weapon;
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
    }, {
        key: 'objectsInRange',
        value: function objectsInRange(range) {
            var collectedObjects = [];
            var oldRange = range[0];
            var newRange = range[1];
            var changedElement = newRange.filter(function (element) {
                return !oldRange.includes(element);
            });
            var changedIndex = newRange.indexOf(changedElement[0]);
            var temp = [];

            if (newRange[0] < oldRange[0] || newRange[1] < oldRange[1]) {
                temp = [newRange[0], newRange[1]];
                newRange = [oldRange[0], oldRange[1]];
                oldRange = temp;
            }

            // if(newRange[changedIndex] > oldRange[changedIndex]){}
            for (var row = oldRange[0]; row <= newRange[0]; row++) {
                var column = this.map[row];
                console.log("row " + row);
                for (var col = oldRange[1]; col <= newRange[1]; col++) {
                    var iRow = this.map[row][col];
                    console.log("col " + col);
                    // element.content != undefined && element.content.constructor.name == "Player"
                    // console.log("iRow");
                    // console.log(iRow);
                    console.log("ObjectsinRange - Start");
                    console.log(JSON.parse(JSON.stringify(iRow)));
                    console.log("ObjectsinRange - end");

                    if (iRow != undefined && _typeof(iRow.content) == "object") {
                        collectedObjects.push({ object: iRow.content, position: [row, col] });
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
    }, {
        key: 'findCell',
        value: function findCell(id) {

            var found = false;

            for (var index = 0; index < this.map.length; index++) {

                for (var cell = 0; cell < this.map[index].length; cell++) {
                    var element = this.map[index][cell];
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
    }, {
        key: 'reflectUI',
        value: function reflectUI() {}
    }]);

    return Board;
}();

exports.default = Board;

},{"./obstacle":3,"./player":4,"./util":5,"./weapon":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Obstacle = function () {
    function Obstacle(name, picture) {
        _classCallCheck(this, Obstacle);

        this.name = name;
        this.picture = picture;
        this.ui = this.getUI();
    }

    _createClass(Obstacle, [{
        key: 'getUI',
        value: function getUI() {
            var image = document.createElement('img');
            image.src = this.picture;
            image.width = 50;
            image.draggable = false;
            return image;
        }
    }]);

    return Obstacle;
}();

exports.default = Obstacle;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(id, name, weapon, picture) {
        var position = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
        var direction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";

        _classCallCheck(this, Player);

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

    _createClass(Player, [{
        key: "move",
        value: function move() {
            $(".active-player").animate({ "left": "-=50px" }, "slow");
        }
    }, {
        key: "attack",
        value: function attack() {
            this.enemy.health -= this.weapon.demage;
        }
    }, {
        key: "defend",
        value: function defend() {}
    }, {
        key: "getUi",
        value: function getUi() {
            var image = document.createElement('img');
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
    }]);

    return Player;
}();

exports.default = Player;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
    function Util() {
        _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
        key: "randomMapPosition",
        value: function randomMapPosition() {
            var minRow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var maxRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;
            var minCol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var maxCol = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 7;

            var row = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
            var col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;

            return [row, col];
        }
    }]);

    return Util;
}();

exports.default = Util;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Weapon = function () {
    function Weapon(name) {
        var damage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
        var picture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

        _classCallCheck(this, Weapon);

        this.name = name;
        this.damage = damage;
        this.picture = picture;
        this.ui = this.getUI();
    }

    _createClass(Weapon, [{
        key: 'getUI',
        value: function getUI() {
            var wrapper = document.createElement('span');
            var image = document.createElement('img');
            var label = document.createElement('span');

            label.innerHTML = this.name + " - X" + this.damage;
            label.classList.add("weapon-label");
            image.src = this.picture;
            image.width = 50;
            image.draggable = false;

            wrapper.appendChild(image);
            wrapper.appendChild(label);
            return wrapper;
        }
    }, {
        key: 'fire',
        value: function fire() {
            var activePlayer = $('.active-player span img');
            var direction = $('.active-player').attr("direction");
            var changeInDirection = "";
            var target = $('.locked-target');

            switch (direction) {
                case "top":
                    changeInDirection = { top: target.offset().top + 30 };
                    break;

                case "bottom":
                    changeInDirection = { top: target.offset().top + 30 };
                    break;

                case "left":
                    changeInDirection = { left: target.offset().left + 55 };
                    break;

                case "right":
                    changeInDirection = { left: target.offset().left + 55 };
                    break;

                default:
                    break;
            }

            var wrapper = $(document.createElement('span'));
            wrapper.css({
                position: "absolute",
                width: "10px",
                height: "10px",
                top: activePlayer.offset().top + 10,
                left: activePlayer.offset().left + 10.5,
                borderRadius: "50%",
                border: "8px solid #005600",
                boxShadow: "inset 0 52px 60px #119b00"
            });
            $('body').append(wrapper);
            wrapper.animate(changeInDirection, {
                easing: "swing",
                duration: 2000,
                complete: function complete() {
                    wrapper.remove();
                    var img = $(document.createElement('img'));
                    img.css({
                        position: "absolute",
                        width: "95px",
                        top: target.offset().top,
                        left: target.offset().left + 6
                    });

                    $('body').append(img);
                    img.attr("src", "img/fire3.gif" + "?id=" + Math.random());
                    target.find('img').addClass("vibration");
                    var timeout = setTimeout(function () {
                        img.remove();
                        target.find('img').removeClass("vibration");
                        clearTimeout(timeout);
                    }, 1500);
                }
            });
        }
    }]);

    return Weapon;
}();

exports.default = Weapon;

},{}]},{},[1]);

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _board = require("./modules/board");

var _board2 = _interopRequireDefault(_board);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.dragover = function (e) {
    e.preventDefault();
    e.currentTarget.parentElement.classList.add("dragging");
};

window.dragenter = function (e) {
    e.preventDefault();
    e.currentTarget.parentElement.classList.add("dragging");
};

window.drop = function (e) {
    e.preventDefault();
    var sourceElement = gameBoard.getElement(e.dataTransfer.getData("text/plain"));
    var targetElement = gameBoard.getElement(e.currentTarget.parentElement.id);

    if (sourceElement.content != targetElement.content) {
        gameBoard.pickWeapon(sourceElement.address, targetElement.address);
        gameBoard.animateMovement(sourceElement, targetElement);
        gameBoard.placeElement(sourceElement, targetElement);
        // gameBoard.nextTurn();
    }
};

window.dragleave = function (e) {
    e.currentTarget.parentElement.classList.remove("dragging");
};

window.dragend = function (e) {
    e.currentTarget.parentElement.classList.remove("dragging");
};

window.dragstart = function (e) {
    // e.preventDefault();
    e.dataTransfer.setData("text/plain", e.currentTarget.parentElement.id);
    e.currentTarget.parentElement.classList.add("dragging");
};

var gameBoard = new _board2.default();

window.board = gameBoard;

var table = gameBoard.initUI();
console.log("Game Started");
console.log(board.map);
(function () {
    $('#gameboard').html(table.outerHTML);
})();

},{"./modules/board":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinyTracker = function () {
    function TinyTracker(domId) {
        _classCallCheck(this, TinyTracker);

        this.symbol = "fa-heart";
        this.id = "";
        this.health = "";
        this.ui = "";
        this.domId = domId;
    }

    _createClass(TinyTracker, [{
        key: "updateHealth",
        value: function updateHealth(id, health) {
            this.id = id;
            this.health = health;
        }
    }, {
        key: "initUI",
        value: function initUI() {
            var wrapper = document.createElement('div');
            var icon = document.createElement('i');
            var value = document.createElement('i');
            value.id = this.domId;

            wrapper.classList.add('tiny-tracker');
            icon.classList.add("fas");
            icon.classList.add(this.symbol);
            value.classList.add("health-state");
            value.innerText = this.health;
            icon.appendChild(value);
            wrapper.appendChild(icon);
            // wrapper.appendChild(value);

            this.ui = wrapper;
            return wrapper;
        }
    }, {
        key: "updateUI",
        value: function updateUI() {}
    }, {
        key: "place",
        value: function place() {

            if (this.ui == "") {
                var target = document.getElementById(this.id);
                target.appendChild(this.initUI());
            } else {
                $('#' + this.domId).text(this.health);
            }
        }
    }]);

    return TinyTracker;
}();

exports.default = TinyTracker;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _weapon = require('./weapon');

var _weapon2 = _interopRequireDefault(_weapon);

var _obstacle = require('./obstacle');

var _obstacle2 = _interopRequireDefault(_obstacle);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _os = require('os');

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
        this.playerTwo = new _player2.default(2, "p2", new _weapon2.default('Ordo', 10, 'img/ordo.png'), 'img/player2.png', "", { top: 0, bottom: 180, left: -90, right: 90, lastValue: 0, dirStr: "top" });
        this.activePlayer = "";
        this.gameEnded = false;
        this.dynamicCSS = { ".vibration-ani": "{}" };
        this.init();
    }

    _createClass(Board, [{
        key: 'getDynamicCSS',
        value: function getDynamicCSS() {
            var allCSS = "<style>";

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(this.dynamicCSS)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var selector = _ref2[0];
                    var css = _ref2[1];

                    var trimedCSS = css.trim();
                    if (trimedCSS.startsWith("@key")) {
                        allCSS += trimedCSS;
                    } else {
                        allCSS += selector + trimedCSS;
                    }
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

            return allCSS + "</style>";
        }
    }, {
        key: 'updateDynamicCSS',
        value: function updateDynamicCSS() {
            $('head > style').remove();
            $('html > head').append(this.getDynamicCSS());
        }
    }, {
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
        }
    }, {
        key: 'enemyFromRange',
        value: function enemyFromRange(position) {
            var enemy = this.getOppositePlayer();

            if (this.map[position[0] - 1][position[1]].content == enemy) {
                return "top";
            } else if (this.map[position[0] + 1][position[1]].content == enemy) {
                return "bottom";
            } else if (this.map[position[0]][position[1] - 1].content == enemy) {
                return "left";
            } else if (this.map[position[0]][position[1] + 1].content == enemy) {
                return "right";
            } else {
                return false;
            }
        }
    }, {
        key: 'enemyInRange',
        value: function enemyInRange() {
            var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            var enemy = this.getOppositePlayer();
            var player = this.activePlayer;
            var playerPosition = position == "" ? player.position : position;
            var direction = player.direction.dirStr;
            var inRange = false;
            console.log("I go position: " + position);
            switch (direction) {
                case "top":
                    if (this.map[playerPosition[0] - 1][playerPosition[1]].content == enemy) {
                        inRange = true;
                    }
                    break;

                case "bottom":
                    if (this.map[playerPosition[0] + 1][playerPosition[1]].content == enemy) {
                        inRange = true;
                    }
                    break;

                case "left":
                    if (this.map[playerPosition[0]][playerPosition[1] - 1].content == enemy) {
                        inRange = true;
                    }
                    break;

                case "right":
                    if (this.map[playerPosition[0]][playerPosition[1] + 1].content == enemy) {
                        inRange = true;
                    }
                    break;

                default:
                    inRange = false;
                    break;
            }
            return inRange;
        }
    }, {
        key: 'generateWeapons',
        value: function generateWeapons() {
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

            this.showSplash();
            var table = document.createElement('table');
            var map = this.map;

            // Placing Obstacles on map
            var obstacles = this.generateObstacles(10);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = obstacles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var obstacle = _step2.value;

                    var randomLocation = _util2.default.randomMapPosition();

                    do {
                        randomLocation = _util2.default.randomMapPosition();
                    } while (this.map[randomLocation[0]][randomLocation[1]].content != "");

                    obstacle.ui = "";
                    this.placeElement(false, this.map[randomLocation[0]][randomLocation[1]], obstacle);
                    this.map[randomLocation[0]][randomLocation[1]].validMove = false;
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

            this.validateMoves(this.activePlayer.position);

            // Placing Weapons
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.weapons[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var weapon = _step3.value;

                    var randomLocation = _util2.default.randomMapPosition();

                    do {
                        randomLocation = _util2.default.randomMapPosition();
                    } while (this.map[randomLocation[0]][randomLocation[1]].content != "");

                    this.placeElement(false, this.map[randomLocation[0]][randomLocation[1]], weapon);
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

                    if (typeName == "Player") {
                        cell.setAttribute("direction", value.content == _this.playerOne ? _this.playerOne.direction.dirStr : _this.playerTwo.direction.dirStr);
                    }

                    if (typeName == "Player" && _this.activePlayer == value.content) {
                        cell.classList.add("active-player");
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
                    cell.setAttribute("draggable", false);
                    if (typeName == "Player" && value.content == _this.activePlayer || value.validMove == true) {
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

                    _loop(row);
                }
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

            this.ui = table;
            var self = this;

            setTimeout(function () {
                _this.playerOne.updateHealth();
                _this.playerTwo.updateHealth();
            }, 1);

            // Fire on double click
            $(function () {
                $('#gameboard table').on('dblclick', 'tr', function (e) {
                    e.preventDefault();
                    var oppositePlayer = self.getOppositePlayer();
                    self.activePlayer.weapon.fire(self.activePlayer, oppositePlayer, self);
                });
            });

            // Defend on right click
            $(function () {
                $('#gameboard table').on('contextmenu', 'tr', function (e) {
                    e.preventDefault();
                    var targetId = $(e.target).parent().attr("id");

                    if (targetId == self.activePlayer.mapId) {
                        self.activePlayer.defending = true;
                        _util2.default.showInfo("Defending", self.activePlayer.name + " is defending the attack!", true);
                        console.log("Defending");
                    } else {
                        console.log("JUst changed turn");
                    }

                    self.nextTurn();
                    self.updateUIElement();
                });
            });

            return table;
        }
    }, {
        key: 'updateUIElement',
        value: function updateUIElement() {
            var _this2 = this;

            var table = document.createElement('table');
            var map = this.map;
            this.validateMoves(this.activePlayer.position);
            this.adjustRotation(false);
            var targetPosition = this.getTargetPosition();

            var _loop2 = function _loop2(row) {
                var tableRow = document.createElement('tr');

                row.forEach(function (value) {
                    var cell = document.createElement('td');
                    var span = document.createElement('span');
                    var typeName = value.content.constructor.name;

                    if (_typeof(value.content) == "object" && value.content.ui != "") {
                        if (typeName == "Player") {
                            span.appendChild(value.content.getUi());
                        } else {
                            span.appendChild(value.content.ui);
                        }
                    }

                    if (typeName == "Obstacle") {
                        span.classList.add("obstacle");
                    }

                    if (typeName == "Player") {
                        cell.setAttribute("direction", value.content == _this2.playerOne ? _this2.playerOne.direction.dirStr : _this2.playerTwo.direction.dirStr);
                    }

                    if (typeName == "Player" && _this2.activePlayer == value.content) {
                        cell.classList.add("active-player");
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
                    cell.setAttribute("draggable", false);
                    if (typeName == "Player" && value.content == _this2.activePlayer || value.validMove == true && _this2.gameEnded == false) {
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

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = map[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var row = _step5.value;

                    _loop2(row);
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            $('#gameboard').html(table.outerHTML);

            this.ui = table;

            this.ui = table;

            setTimeout(function () {
                _this2.adjustRotation();
            }, 1);
            var self = this;

            $(function () {
                $('#gameboard table').on('dblclick', 'tr', function (e) {
                    e.preventDefault();
                    var oppositePlayer = self.getOppositePlayer();
                    self.activePlayer.weapon.fire(self.activePlayer, oppositePlayer, self);
                });
            });

            // Defend on right click
            $(function () {
                $('#gameboard table').on('contextmenu', 'tr', function (e) {
                    e.preventDefault();
                    var targetId = $(e.target).parent().attr("id");

                    if (targetId == self.activePlayer.mapId) {
                        self.activePlayer.defending = true;
                        _util2.default.showInfo("Defending", self.activePlayer.name + " is defending the attack!", true);
                        console.log("Defending");
                    } else {
                        console.log("JUst changed turn");
                    }

                    self.nextTurn();
                    self.updateUIElement();
                });
            });

            this.playerOne.healthTrackerUI.ui = "";
            this.playerTwo.healthTrackerUI.ui = "";
            setTimeout(function () {
                _this2.playerOne.updateHealth();
                _this2.playerTwo.updateHealth();
            }, 1);
        }

        // Prepairing to depricate

    }, {
        key: 'getTargetPosition',
        value: function getTargetPosition() {
            var map = this.map;
            var activePlayerPosition = this.activePlayer.position;
            var row = activePlayerPosition[0];
            var column = activePlayerPosition[1];
            var activePlayerDirection = this.activePlayer.direction.dirStr;

            // --|--
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
            if (JSON.stringify(this.activePlayer) == JSON.stringify(this.playerOne)) {
                return this.playerTwo;
            }

            return this.playerOne;
        }
    }, {
        key: 'getDirectionToEnemy',
        value: function getDirectionToEnemy() {
            var fromPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            var player = this.activePlayer;
            var position = fromPosition == "" ? player.position : fromPosition;

            var enemy = this.getOppositePlayer();
            var enemyPosition = enemy.position;

            if (position[0] > enemyPosition[0] && position[1] == enemyPosition[1]) {
                return "top";
            } else if (position[0] < enemyPosition[0] && position[1] == enemyPosition[1]) {
                return "bottom";
            } else if (position[1] > enemyPosition[1] && position[0] == enemyPosition[0]) {
                return "left";
            } else if (position[1] < enemyPosition[1] && position[0] == enemyPosition[0]) {
                return "right";
            } else {
                return false;
            }
        }
    }, {
        key: 'updatePlayerDirection',
        value: function updatePlayerDirection(target) {
            var direction = "";
            var map = this.map;
            var playerPosition = this.activePlayer.position;
            var position = target.address;

            var targetRow = position[0];
            var targetColumn = position[1];
            var row = playerPosition[0];
            var column = playerPosition[1];
            console.log(target);
            if (targetColumn < column) {
                this.activePlayer.direction.dirStr = "left";
                this.activePlayer.direction.lastValue = this.activePlayer.direction.left;
            } else if (targetColumn > column) {
                this.activePlayer.direction.dirStr = "right";
                this.activePlayer.direction.lastValue = this.activePlayer.direction.right;
            } else if (targetRow < row) {
                this.activePlayer.direction.dirStr = "top";
                this.activePlayer.direction.lastValue = this.activePlayer.direction.top;
            } else if (targetRow > row) {
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
        key: 'adjustRotation',
        value: function adjustRotation() {
            var rotateUI = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var enemyDirection = this.getDirectionToEnemy();
            var player = this.activePlayer;

            if (enemyDirection != false) {
                player.direction.lastValue = player.direction[enemyDirection];
                player.direction.dirStr = enemyDirection;

                if (rotateUI == true) {
                    this.rotatePlayer(player.direction[enemyDirection]);
                    $('.active-player').attr('direction', player.direction.dirStr);
                }
            }
        }
    }, {
        key: 'animateMovement',
        value: function animateMovement(sourceElement, targetElement) {
            var _this3 = this;

            var source = $('#' + sourceElement.id + ' span');
            var targetElm = $('#' + targetElement.id + ' span');
            var direction = this.activePlayer.direction;
            var player = this.activePlayer;
            var enemyDirection = this.getDirectionToEnemy(targetElement.address);

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


            var animation = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(source.animate({
                        top: targetElm.offset().top - source.parent().offset().top,
                        left: targetElm.offset().left - source.parent().offset().left
                    }, {
                        easing: "swing",
                        duration: 2000,
                        complete: function complete() {
                            _this3.playerOne.getUi();
                            _this3.playerTwo.getUi();
                            console.log("Enemy:dir:" + enemyDirection);
                            console.log("Enemy:dirstring:" + JSON.stringify(enemyDirection));
                            if (enemyDirection != false) {
                                player.direction.lastValue = player.direction[enemyDirection];
                                player.direction.dirStr = enemyDirection;
                                _this3.rotatePlayer(player.direction[enemyDirection]);

                                setTimeout(function () {
                                    _this3.nextTurn();
                                    _this3.updateUIElement();
                                }, 1500);
                            } else {
                                _this3.nextTurn();
                                _this3.updateUIElement();
                            }

                            // this.nextTurn();
                            // this.updateUIElement();

                            console.log("Enemy in range: " + _this3.enemyInRange());
                            // this.activePlayer.weapon.fire();
                        }
                    }));
                }, 1000);
            });
            // this.rotatePlayer(this.activePlayer.direction[this.getDirectionToEnemy()]);

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
    }, {
        key: 'showSplash',
        value: function showSplash() {
            var wrapper = document.createElement('div');
            wrapper.classList.add("splash");
            var img = document.createElement('img');
            img.src = "img/splash.png";
            wrapper.appendChild(img);
            document.body.appendChild(wrapper);

            $(wrapper).click(function () {
                $(this).animate({
                    opacity: "toggle"
                }, {
                    duration: 3000,
                    specialEasing: {
                        width: "linear",
                        height: "easeOutBounce"
                    },
                    complete: function complete() {
                        $(this).remove();
                    }
                });
            });
        }
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
                        this.map[index][cell].address = [index, cell];
                        if (element.content != undefined && element.content.constructor.name == "Player") {
                            var oldPosition = this.map[index][cell].content.position;
                            var newPosition = [index, cell];

                            this.map[index][cell].content.position = [index, cell];
                            this.map[index][cell].content.mapId = targetElement.id;
                        }

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

            var scanRange = [oldPosition, newPosition];

            console.log("Scan Range " + scanRange);

            var detectedObjects = this.objectsInRange(scanRange);

            var randomPosition = [];
            do {
                randomPosition = _util2.default.randomMapPosition();
            } while (this.map[randomPosition[0]][randomPosition[1]].content != "");

            for (var index = 0; index < detectedObjects.length; index++) {
                var element = detectedObjects[index];

                if (element.object.constructor.name == "Weapon" && JSON.stringify(newPosition) == JSON.stringify(element.position)) {
                    console.log("Weapon Detected");
                    var oldWeapon = this.activePlayer.weapon;
                    this.activePlayer.weapon = element.object;
                    this.placeElement(false, this.map[randomPosition[0]][randomPosition[1]], oldWeapon);
                    this.map[element.position[0]][element.position[1]].content = "";
                    break;
                }
            }
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

            for (var row = oldRange[0]; row <= newRange[0]; row++) {
                var column = this.map[row];

                for (var col = oldRange[1]; col <= newRange[1]; col++) {
                    var iRow = this.map[row][col];

                    if (iRow != undefined && _typeof(iRow.content) == "object") {
                        collectedObjects.push({ object: iRow.content, position: [row, col] });
                    }
                }
            }

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

},{"./obstacle":4,"./player":5,"./util":6,"./weapon":7,"os":8}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TinyTracker = require("./TinyTracker");

var _TinyTracker2 = _interopRequireDefault(_TinyTracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        this.defending = false;
        this.mapId = "";
        this.healthTrackerUI = new _TinyTracker2.default("trackerhealth" + id);
    }

    _createClass(Player, [{
        key: "move",
        value: function move() {
            $(".active-player").animate({ "left": "-=50px" }, "slow");
        }
    }, {
        key: "updateHealth",
        value: function updateHealth() {
            this.healthTrackerUI.updateHealth(this.mapId, this.health);
            this.healthTrackerUI.place();
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

},{"./TinyTracker":2}],6:[function(require,module,exports){
'use strict';

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
        key: 'randomMapPosition',
        value: function randomMapPosition() {
            var minRow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var maxRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;
            var minCol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var maxCol = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 7;

            var row = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
            var col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;

            return [row, col];
        }
    }, {
        key: 'showInfo',
        value: function showInfo() {
            var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Info";
            var msg = arguments[1];
            var autoHide = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


            var box = document.createElement('div');
            $('#mpopup').remove();
            box.id = "mpopup";
            box.classList.add("abs-center");

            var boxTitle = document.createElement('div');
            boxTitle.classList.add("header");
            boxTitle.innerText = title;
            box.appendChild(boxTitle);

            var boxContent = document.createElement('div');
            boxContent.classList.add('content');
            boxContent.innerText = msg;
            box.appendChild(boxContent);

            document.body.appendChild(box);

            if (autoHide == true) {
                setTimeout(function () {
                    $(box).fadeOut();
                }, 2500);
            }
        }
    }]);

    return Util;
}();

exports.default = Util;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        this.defend = false;
        this.attacking = false;
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
            var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            var _this = this;

            var opposite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
            var board = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";


            if (this.attacking == true) {
                return false;
            }

            this.attacking = true;
            var activePlayer = $('.active-player span img');
            var direction = $('.active-player').attr("direction");
            var changeInDirection = "";
            var target = $('.locked-target');
            var targetObj = board.getElement(target.attr('id'));

            if (targetObj != "" && targetObj.content.constructor.name != "Player") {
                return false;
            }

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
                top: activePlayer.offset().top + 12,
                left: activePlayer.offset().left + 12,
                borderRadius: "50%",
                border: "5px solid #005600",
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

                    var vibrationCSS = '\
                    @keyframes vibration-ani{\
                        0% {transform: rotate(' + (player.direction.lastValue - 9) + 'deg)}\
                        45% {transform: rotate(' + player.direction.lastValue + 'deg)}\
                        85% {transform: rotate(' + (player.direction.lastValue - 9) + 'deg)}\
                        100% {transform: rotate(' + player.direction.lastValue + 'deg)}\
                    }';

                    if (board.enemyInRange() == true) {
                        board.dynamicCSS['.vibration-ani'] = vibrationCSS;
                        board.updateDynamicCSS();
                        target.find('img').addClass("vibration");
                    }

                    var timeout = setTimeout(function () {
                        board.updateUIElement();
                        img.remove();
                        target.find('img').removeClass("vibration");

                        // Update health
                        if (opposite.mapId == target.attr("id") && board.enemyInRange() == true) {
                            if (opposite.defending == true) {
                                opposite.health -= _this.damage / 2;
                                opposite.defending = false;
                            } else {
                                opposite.health -= _this.damage;
                            }
                        }

                        opposite.updateHealth();

                        if (opposite.health <= 0) {
                            opposite.health = 0;
                            opposite.updateHealth();
                            board.gameEnded = true;
                            board.updateUIElement();
                            _util2.default.showInfo("Game Over", player.name + " won the game!", false);
                            $('#gameboard').addClass('not-avaiable');
                            return;
                        }

                        _this.attacking = false;
                        board.nextTurn();
                        setTimeout(function () {
                            board.updateUIElement();
                        }, 1);

                        clearTimeout(timeout);
                    }, 1500);
                }
            });
        }
    }]);

    return Weapon;
}();

exports.default = Weapon;

},{"./util":6}],8:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}]},{},[1]);

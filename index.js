var CELL_SIZE = 40;

var CELL_UNKNOWN = 0;
var CELL_BLOCKED = 1;
var CELL_START = 2;
var CELL_END = 3;

var g_map = [];


var EDIT_MODE_UNKNOWN = CELL_UNKNOWN;
var EDIT_MODE_BLOCK = CELL_BLOCKED;
var EDIT_MODE_START = CELL_START;
var EDIT_MODE_END = CELL_END;

var g_editMode = EDIT_MODE_UNKNOWN;

function getIndex(x, y) {
    return g_width * y + x;
}

function getMap(x, y) {
    return g_map[g_width * y + x];
}

function setMap(x, y, v) {
    g_map[g_width * y + x] = v;
    var color = '#fff';
    if (v === CELL_UNKNOWN)
        color = '#aaa';
    if (v === CELL_BLOCKED)
        color = '#f00';
    if (v === CELL_START)
        color = '#0f0';
    if (v === CELL_END)
        color = '#00f';
    changeCellColor(getIndex(x, y), color);
}

function changeCellColor(index, color) {
    var ele = document.querySelector('.cell[data-index="' + index + '"]');
    ele.style['background-color'] = color;
}

function setCellText(index, text) {
    var ele = document.querySelector('.cell[data-index="' + index + '"]');
    ele.innerHTML = text;
}

function removeOthers(e) {
    var maxCnt = g_width * g_height;
    for (var i = 0; i < maxCnt; i++) {
        if (g_map[i] === e) {
            g_map[i] = CELL_UNKNOWN;
            changeCellColor(i, '#aaa');
        }
    }
}


function onClickCell() {
    var index = this.getAttribute('data-index');

    if (g_editMode === EDIT_MODE_START ||
        g_editMode === EDIT_MODE_END) {
        removeOthers(g_editMode);
    }

    var x = index % g_width;
    var y = Math.floor(index / g_width);
    console.log(x, y);
    setMap(x, y, g_editMode);
}

function generateStageHTML() {
    var maxCnt = g_width * g_height;

    var ele = document.querySelectorAll("#container")[0];
    ele.style.width = (CELL_SIZE + 2) * g_width + "px";

    ele.innerHTML = '';

    g_map = [];

    var cell;
    for (var i = 0; i < maxCnt; i++) {
        cell = document.createElement('div');
        cell.innerHTML = '<div class="cell" data-index=' + i + ' data-checked=false></div>';
        cell.firstChild.style.width = CELL_SIZE + "px";
        cell.firstChild.style.height = CELL_SIZE + "px";
        cell.firstChild.onclick = onClickCell;

        ele.appendChild(cell.firstChild);

        g_map.push(0);
    }
}

function init(width, height) {
    g_width = width;
    g_height = height;
    generateStageHTML();
}

function canMove(x, y) {
    if (x < 0)
        return false;
    if (y < 0)
        return false;
    if (x >= g_width)
        return false;
    if (y >= g_height)
        return false;

    if (getMap(x, y) !== CELL_UNKNOWN)
        return false;

    return true;
}

function refreshDivs() {
    var maxCnt = g_width * g_height;
    for (var i = 0; i < maxCnt; ++i) {
        var x = i % g_width;
        var y = Math.floor(i / g_width);
        setMap(x, y, g_map[i]);
        setCellText(i, '');
    }

}

function demo() {
    refreshDivs();

    var startX = 0;
    var startY = 0;
    var endX = 0;
    var endY = 0;

    var maxCnt = g_width * g_height;
    for (var i = 0; i < maxCnt; ++i) {
        if (g_map[i] === CELL_START) {
            startX = i % g_width;
            startY = Math.floor(i / g_width);
        }
        if (g_map[i] === CELL_END) {
            endX = i % g_width;
            endY = Math.floor(i / g_width);
        }
    }

    var astar = new AStar(canMove);
    astar.useEx = false;
    var path = astar.find(startX, startY, endX, endY);
    if (path.length === 0)
        alert('찾기 실패');

    var list = astar.getCellForDebug(3, 5);

    for (j = 0; j < list.length; ++j) {
        var c = list[j];
        setCellText(getIndex(c.x, c.y), "f = " + c.f + "<br> h = " + c.h + "<br> g = " + c.g);
    }

    var step = Math.floor(255 / path.length);

    for (i = 0; i < path.length; ++i) {
        var cell = path[i];
        changeCellColor(getIndex(cell.x, cell.y), 'rgb(' + i * step + ', 0, 100)');
        list = astar.getCellForDebug(cell.x, cell.y);
        for (j = 0; j < list.length; ++j) {
            var c2 = list[j];
            setCellText(getIndex(c2.x, c2.y), "f = " + c2.f + "<br> h = " + c2.h + "<br> g = " + c2.g);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    init(20, 20);
    var startX = 3;
    var startY = 5;

    var endX = 13;
    var endY = 10;
    setMap(startX, startY, CELL_START);
    setMap(endX, endY, CELL_END);

    setMap(5, 5, CELL_BLOCKED);
    setMap(5, 6, CELL_BLOCKED);
    setMap(5, 4, CELL_BLOCKED);

    setMap(7, 0, CELL_BLOCKED);
    setMap(7, 1, CELL_BLOCKED);
    setMap(7, 2, CELL_BLOCKED);
    setMap(7, 3, CELL_BLOCKED);
    setMap(7, 4, CELL_BLOCKED);
    setMap(7, 5, CELL_BLOCKED);
    setMap(7, 6, CELL_BLOCKED);
    setMap(7, 7, CELL_BLOCKED);
    setMap(7, 8, CELL_BLOCKED);


    setMap(0, 9, CELL_BLOCKED);
    setMap(1, 9, CELL_BLOCKED);
    setMap(2, 9, CELL_BLOCKED);
    setMap(3, 9, CELL_BLOCKED);
    //    setMap(4, 9, CELL_BLOCKED);
    setMap(5, 9, CELL_BLOCKED);
    setMap(6, 9, CELL_BLOCKED);
    setMap(7, 9, CELL_BLOCKED);


    demo();
});
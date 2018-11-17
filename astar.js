function AStarCell(parent, x, y, g, h) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.originG = g;
    this.g = 0;
    this.h = h;
    this.f = g + h;

    this.refreshG();
}


AStarCell.prototype.refreshG = function()
{
    this.g = this.originG;
    if(!this.parent)
        return;
    this.g += this.parent.g;
    this.f = this.g + this.h;
};

function AStar(canMove) {
    this.useEx = false;
    this.useDebug = true;

    this.openList = [];
    this.closeList = [];
    this.debugList = [];
    this.posList = [
        [0, -1, 10],
        [-1, 0, 10],
        [0, 1, 10],
        [1, 0, 10]
    ];

    this.posListEx = [
        [-1, -1, 14],
        [0, -1, 10],
        [1, -1, 14],

        [-1, 0, 10],
        [1, 0, 10],

        [-1, 1, 14],
        [0, 1, 10],
        [1, 1, 14],
    ];

    this.start = null;
    this.end = null;
    this.findPathList = [];
    this.canMove = canMove;
}

AStar.prototype.findFromList = function (list, x, y) {
    for (var i in list) {
        var cell = list[i];
        if (cell.x === x && cell.y === y) {
            return i;
        }
    }

    return -1;
};

AStar.prototype.addToList = function (list, cell) {
    if (this.findFromList(list, cell.x, cell.y) !== -1)
        return;

    list.push(cell);
};

AStar.prototype.removeFromList = function (list, x, y) {
    var index = this.findFromList(list, x, y);
    if (index === -1)
        return;
    list.splice(index, 1);
};

AStar.prototype.getNearCell = function (list, curCell) {
    return list[0];
};

AStar.prototype.getH = function (x, y) {
    var a = x - this.end.x;
    var b = y - this.end.y;

    var c = Math.sqrt(a * a + b * b);

    return Math.floor(c * 10);
};

AStar.prototype.getNewCell = function (parent, x, y, g, h) {
    var i = this.findFromList(this.openList, x, y);

    if (i === -1)
        return new AStarCell(parent, x, y, g, h);

    var cell = this.openList[i];
    if(cell.g < parent.g)
    {
        cell.parent = parent;
        cell.refreshG();
    }
    return cell;
};

AStar.prototype.sortFunc = function (a, b) {
    return a.f - b.f;
};

AStar.prototype.makePath = function (curCell) {
    if (!curCell.parent)
        return;

    this.findPathList.push(curCell);

    this.makePath(curCell.parent);
};

AStar.prototype.searchArea = function (curCell) {

    var posList = this.posList;

    if (this.useEx)
        posList = this.posListEx;

    var newCells = [];
    var refresh = false;

    for (var i = 0; i < posList.length; i++) {
        var pos = posList[i];
        var nx = curCell.x + pos[0];
        var ny = curCell.y + pos[1];
        var g = pos[2];

        if (nx === this.end.x &&
            ny === this.end.y) {
            this.makePath(curCell);
            return null;
        }

        if (this.canMove(nx, ny) && this.findFromList(this.closeList, nx, ny) === -1) {
            var newCell = this.getNewCell(curCell, nx, ny, g, this.getH(nx, ny));
            newCells.push(newCell);
            this.addToList(this.debugList, newCell);
            this.addToList(this.openList, newCell);
        }
    }
 
    this.removeFromList(this.openList, curCell.x, curCell.y);
    this.addToList(this.closeList, curCell);

    if (this.openList.length === 0)
        return null;

    this.openList.sort(this.sortFunc);
    this.closeList.sort(this.sortFunc);

    var targetCell = this.getNearCell(this.openList, curCell);

    return this.searchArea(targetCell);
};

AStar.prototype.find = function (sx, sy, dx, dy) {
    this.openList = [];
    this.closeList = [];
    this.findPathList = [];
    this.debugList = [];

    this.start = new AStarCell(null, sx, sy, 0, 0, 0);
    this.end = new AStarCell(null, dx, dy, 0, 0, 0);

    this.searchArea(this.start);

    return this.findPathList;
};

AStar.prototype.getCellForDebug = function (x, y) {
    var ret = [];


    var posList = this.posList;

    if (this.useEx)
        posList = this.posListEx;


    for (var i = 0; i < posList.length; i++) {
        var pos = posList[i];
        var nx = x + pos[0];
        var ny = y + pos[1];
        var c = this.findFromList(this.debugList, nx, ny);

        if (c !== -1)
            ret.push(this.debugList[c]);
    }

    return ret;
};
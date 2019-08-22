class Util{
    static randomMapPosition(minRow = 0,maxRow = 7, minCol = 0, maxCol = 7){
        let row = Math.floor(Math.random() * (maxRow-minRow+1))+minRow;
        let col = Math.floor(Math.random() * (maxCol-minCol+1))+minCol;

        return [row, col];

    }
}

export default Util;
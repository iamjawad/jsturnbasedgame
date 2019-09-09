class Util{
    static randomMapPosition(minRow = 0,maxRow = 7, minCol = 0, maxCol = 7){
        let row = Math.floor(Math.random() * (maxRow-minRow+1))+minRow;
        let col = Math.floor(Math.random() * (maxCol-minCol+1))+minCol;

        return [row, col];

    }

    static showInfo(title = "Info", msg, autoHide = true){
        const box = document.createElement('div');
        box.id = "mpopup";
        box.classList.add("abs-center");

        const boxTitle = document.createElement('div');
        boxTitle.classList.add("header");
        boxTitle.innerText = title;
        box.appendChild(boxTitle);

        const boxContent = document.createElement('div');
        boxContent.classList.add('content');
        boxContent.innerText = msg;
        box.appendChild(boxContent);

        document.body.appendChild(box);

        if(autoHide == true){
            setTimeout(() => {
                $(box).fadeOut();
            }, 2500);
        }
    }
}

export default Util;
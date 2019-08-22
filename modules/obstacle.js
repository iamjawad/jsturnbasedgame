class Obstacle{
    constructor(name, picture){
        this.name = name;
        this.picture = picture;
        this.ui = this.getUI();
    }

    getUI(){
        let image = document.createElement('img');
        image.src = this.picture;
        image.width = 50;
        image.draggable = false;
        return image;
    }

}

export default Obstacle;
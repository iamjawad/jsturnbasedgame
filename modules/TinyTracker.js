class TinyTracker{
    constructor(domId){
        this.symbol = "fa-heart";
        this.id = "";
        this.health = "";
        this.ui = "";
        this.domId = domId;
    }

    updateHealth(id, health){
        this.id = id;
        this.health = health;
    }

    initUI(){
        const wrapper = document.createElement('div');
        const icon = document.createElement('i');
        const value = document.createElement('i');
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

    updateUI(){
        
    }

    place(){

        if(this.ui == ""){
            const target = document.getElementById(this.id);
            target.appendChild(this.initUI());
        } else {
            $('#' + this.domId).text(this.health);
        }

    }
}

export default TinyTracker;
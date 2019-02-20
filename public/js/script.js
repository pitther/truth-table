let UI, CORE;

class UserInterface{
    constructor() {
        this.inputExpressionForm = document.getElementById("inputExpression");
    }
    onMakeTable(){
        CORE.proceedExpression(this.inputExpressionForm);
    }
}

class Core{
    constructor(){

    }
    proceedExpression(exp){
        console.log("Processing expression: "+exp);

    }
}

window.onload = function () {
    UI = new UserInterface();
    CORE = new Core();
}

let UI, CORE;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


class UserInterface{
    constructor() {
        this.castomization = false;
        this.inputExpressionElement = document.getElementById("inputExpression");
        this.inputTipElement = document.getElementById("tipInput");
    }
    onMakeTable(){
        let val = this.inputExpressionElement.value.toUpperCase();
        this.inputExpressionElement.value = val;
        CORE.proceedExpression(val);
    }

    inputError(reason){
        this.removeClass(this.inputExpressionElement,"is-valid");
        this.addClass(this.inputExpressionElement,"is-invalid");
        document.getElementById("invalidReasonDiv").innerHTML = reason;
    }
    inputSuccess(){
        this.removeClass(this.inputExpressionElement,"is-invalid");
        this.addClass(this.inputExpressionElement,"is-valid");
    }
    removeClass(ele,cls) {
            while(ele.className.indexOf(cls) > -1){
                ele.className = ele.className.replace(cls,"");
            }
    }
    onDetailed(){
        CORE.detailedOperations = !CORE.detailedOperations;
        this.onMakeTable();
        if (!CORE.detailedOperations){
            document.getElementById("detailedOperationsButton").innerHTML = "Detailed";
        } else {
            document.getElementById("detailedOperationsButton").innerHTML = "Simple";
        }
    }
    onColorizeOperations(){
        CORE.colorizeSteps = !CORE.colorizeSteps;
        this.onMakeTable();
        if (!CORE.colorizeSteps){
            document.getElementById("colorizeOperationsButton").innerHTML = "Colorize";
            document.getElementById("colorizeOperationsButton").style.color = "#dc3545";
        } else {
            document.getElementById("colorizeOperationsButton").innerHTML = "Decolorize";
            document.getElementById("colorizeOperationsButton").style.color = "#ffc107";
        }
    }
    onCustomization(){
        this.castomization = !this.castomization;
        if (this.castomization){
            document.getElementById("stepsButton").style.display = "";
            document.getElementById("replaceOperationsButton").style.display = "";
            document.getElementById("colorizeOperationsButton").style.display = "";
           // document.getElementById("detailedOperationsButton").style.display = "";
        } else {
            document.getElementById("stepsButton").style.display = "none";
            document.getElementById("replaceOperationsButton").style.display = "none";
            document.getElementById("colorizeOperationsButton").style.display = "none";
            document.getElementById("detailedOperationsButton").style.display = "none";
        }
    }
    onReplaceOperations(){
        CORE.replaceOperations = !CORE.replaceOperations;
        this.onMakeTable();
        if (CORE.replaceOperations){
            document.getElementById("replaceOperationsButton").innerHTML = "Symbols";
        } else {
            document.getElementById("replaceOperationsButton").innerHTML = "Namings";
        }
    }
    onViewSteps(){

        CORE.showSteps = !CORE.showSteps;
        this.onMakeTable();
        if (CORE.showSteps){
            document.getElementById("stepsButton").innerHTML = "Hide steps";
            //document.getElementById("replaceOperationsButton").disabled = false;
            //document.getElementById("replaceOperationsButton").style.display = "";
            //document.getElementById("colorizeOperationsButton").style.display = "";
            document.getElementById("detailedOperationsButton").style.display = "";
        } else {
            document.getElementById("stepsButton").innerHTML = "Show steps";
            //document.getElementById("replaceOperationsButton").disabled = true;
            //document.getElementById("replaceOperationsButton").style.display = "none";
            //document.getElementById("colorizeOperationsButton").style.display = "none";
            document.getElementById("detailedOperationsButton").style.display = "none";

        }

    }
    onChangeTheme(){
        let navEl = document.getElementById("nav");
        let tableEl = document.getElementById("table");
        if ( navEl.className.indexOf("dark") > -1) {
            this.removeClass(navEl,"navbar-dark");
            this.removeClass(navEl,"bg-dark");
            this.addClass(navEl,"navbar-light bg-light");
            document.getElementById("themeButton").innerHTML = "Dark theme";
            document.body.style.backgroundColor = "white";
        } else {
            this.removeClass(navEl,"navbar-light");
            this.removeClass(navEl,"bg-light");
            this.addClass(navEl,"navbar-dark bg-dark");
            document.getElementById("themeButton").innerHTML = "Light theme";
            document.body.style.backgroundColor = "#212529";
        }

        if ( tableEl.className.indexOf("dark") > -1) {
            this.removeClass(tableEl,"table-dark");
            this.addClass(tableEl,"table-light");
        } else {
            this.removeClass(tableEl,"table-light");
            this.addClass(tableEl,"table-dark");
        }
    }
    onHint(){
        if ( this.inputTipElement.className.indexOf("is-valid") > -1){
            this.removeClass(this.inputTipElement,"is-valid");
        } else {
            this.addClass(this.inputTipElement,"is-valid");
            let tip = "List of operations:";

            tip += "<br><b>"+CORE.dict["NOT"]+"</b> - Negation (NOT)";
            tip += "<br><b>"+CORE.dict["OR"]+"</b> - Disjunction (OR)";
            tip += "<br><b>"+CORE.dict["AND"]+"</b> - Conjunction (AND)";
            tip += "<br><b>"+CORE.dict["IMP"]+"</b> - Implication (IMPLY)";
            tip += "<br><b>"+CORE.dict["EQ"]+"</b> - Equality (EQ,XNOR)";

            tip+= "<br><br><b>Use round brackers to set priority!</b>"

            tip += "<br><br>Available characters:<br>"+CORE.alphabet;
            document.getElementById("tipDiv").innerHTML = tip;

        }

    }
    addClass(ele,cls){
            ele.className += " "+ cls;
    }
    clearTableInnerHtml(){
        document.getElementById("table").innerHTML = "";
    }
    appendToTable(html){
        document.getElementById("table").innerHTML += html;
    }
    generateTableHead(heads){
        let str = "<thead ><tr>"
        for (let i = 0; i < heads.length; i++){
            str += `<th class='text-info' style="text-align: center" scope="col">${heads[i]}</th>`;
        }
        str += "</tr></thead>";
        this.appendToTable(str);
        return str;
    }
    generateTableBody(data){
        let str = "<tbody>";
        for (let i = 0; i < data.length; i++){
            str += "<tr >";
            for (let j = 0; j < data[i].length; j++){
                str += `<th scope="col" style="text-align: center" >${data[i][j]}</th>`;
            }
            str += "</tr>";
        }
        this.appendToTable(str);
        return str;
    }
}

class Core{
    constructor(){
        this.detailedOperations = false;
        this.colorizeSteps = true;
        this.showSteps = false;
        this.replaceOperations = false;
        this.letterAlphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
            "Q", "R", "S", "T", "U", "W", "X", "Y", "Z"];
        this.alphabet = ["(",")"];
        this.dict = {
            "NOT": "!",
            "OR": "||",
            "AND": "&&",
            "IMP": ">>",
            "EQ": "<>"
        };
        this.alphabet.push(this.dict["OR"],this.dict["AND"],this.dict["EQ"],this.dict["IMP"],this.dict["NOT"]);
        console.log(this.alphabet);
        this.alphabet = this.alphabet.concat(this.letterAlphabet);
    }

    proceedExpression(exp){
        exp = exp.replace(/\s/g,'');
        if (this.checkExpression(exp).length > 0){return;}
        console.log("Processing expression: "+exp);
        let parsed = parse(exp,{brackets: ['()'],
            escape: '\\',
            flat: true});
        let variables = this.getVariables(exp);
        UI.clearTableInnerHtml();
        let inputCombosArr = this.binaryCombos(variables.length);

        this.proceedParsed(parsed, variables, inputCombosArr)
    }
    proceedParsed(parsed, variables, inputCombosArr){
        console.log(parsed,variables,inputCombosArr);
        let headers = variables,
            body = inputCombosArr;

        for (let i = parsed.length-1; i >= 0; i--){
            if (headers.indexOf(this.replaceLinks(parsed,i)) > -1){
                continue;
            } else {
                headers.push("<span class=''>"+this.replaceOperationsStr(this.replaceLinks(parsed,i),this.replaceOperations)+"</span>");
            }

            for (let j = 0; j < inputCombosArr.length; j++){
                let res = this.proceedLogicOperation(inputCombosArr[j],this.replaceLinks(parsed,i),variables);
                if (res == -1){
                    return;
                }
                body[j].push(res);
            }
        }
        console.log(body);
        UI.generateTableHead(headers);
        UI.generateTableBody(body);
    }
    proceedLogicOperation(input,str,variables) {
        console.log(input, str);

        for (let i = 0; i < str.length; i++) {
            for (let j = 0; j < variables.length; j++) {
                if (str[i] == variables[j]) {
                    str = str.replace(variables[j], input[j]);
                    break;
                }
            }
        }
        console.log(str);
        let step_str = str,
            rep_step = str;
        let LogicArr = [
            [this.dict["NOT"]+"1", 0], [this.dict["NOT"]+"0", 1],
            ["1"+this.dict["OR"]+"1", 1], ["1"+this.dict["OR"]+"0", 1], ["0"+this.dict["OR"]+"1", 1], ["0"+this.dict["OR"]+"0", 0],
            ["1"+this.dict["AND"]+"1", 1], ["1"+this.dict["AND"]+"0", 0], ["0"+this.dict["AND"]+"1", 0], ["0"+this.dict["AND"]+"0", 0],
            ["1"+this.dict["EQ"]+"1", 1], ["1"+this.dict["EQ"]+"0", 0], ["0"+this.dict["EQ"]+"1", 0], ["0"+this.dict["EQ"]+"0", 1],
            ["1"+this.dict["IMP"]+"1", 1], ["1"+this.dict["IMP"]+"0", 0], ["0"+this.dict["IMP"]+"1", 1], ["0"+this.dict["IMP"]+"0", 1]
        ];

        let DEPTH = 20;
        for (let j = 0; j < DEPTH; j++) {
            let buff = "";
            for (let i = 0; i < LogicArr.length; i++) {
                buff = str.replaceAll(LogicArr[i][0], LogicArr[i][1]);
                if (buff != str){
                    str = buff;
                    step_str += "<br>"+str;
                }
                buff = str.replaceAll('(' + LogicArr[i][0] + ')', LogicArr[i][1]);
                if (buff != str){
                    str = buff;
                    step_str += "<br>"+str;
                }
                buff = str.replaceAll('(1)', '1');
                if (buff != str){
                    str = buff;
                    //step_str += "<br>"+str;
                }
                buff = str.replaceAll('(0)', '0');
                if (buff != str){
                    str = buff;
                    //step_str += "<br>"+str;
                }
            }

        }
        console.log(str);
        if (!this.detailedOperations){
            step_str = rep_step;
        }
        if (str == "1"){
            if (this.showSteps){
                if (this.detailedOperations){
                    return this.replaceOperationsStr(step_str,this.replaceOperations);
                } else {
                    return this.replaceOperationsStr(step_str,this.replaceOperations) + " = "+1;
                }

            } else {
                return 1;
            }

        } else if (str == "0"){
            if (this.showSteps){
                if (this.detailedOperations){
                    return this.replaceOperationsStr(step_str,this.replaceOperations);
                } else {
                    return this.replaceOperationsStr(step_str,this.replaceOperations) + " = "+0;
                }
            } else {
                return 0;
            }
        } else {
            if (str.length <= 0){
                UI.inputError("Enter expression firstly");
            } else {
                UI.inputError("Invalid expression format");
            }
            console.log("ERROR");
            return -1;

        }

    }
    replaceOperationsStr(str, t_){
        let class_ = "";
        if (this.colorizeSteps){class_ = "text-danger"}
        if (t_) {
            str = str.replaceAll(this.dict["EQ"], " <span class="+class_+">EQ</span> ");
            str = str.replaceAll(this.dict["IMP"], " <span class="+class_+">IMP</span> " );
            str = str.replaceAll(this.dict["AND"], " <span class="+class_+">AND</span> ");
            str = str.replaceAll(this.dict["NOT"], " <span class="+class_+">NOT</span>");
            str = str.replaceAll(this.dict["OR"], " <span class="+class_+">OR</span> ");

        } else {
            str = str.replaceAll(this.dict["EQ"], "<span class="+class_+">"+` ${this.dict["EQ"]} `+"</span> ");
            str = str.replaceAll(this.dict["IMP"], "<span class="+class_+">"+` ${this.dict["IMP"]} `+"</span> ");
            str = str.replaceAll(this.dict["NOT"], "<span class="+class_+">"+` ${this.dict["NOT"]}`+"</span>");
            str = str.replaceAll(this.dict["OR"], "<span class="+class_+">"+` ${this.dict["OR"]} `+"</span> ");
            str = str.replaceAll(this.dict["AND"], "<span class="+class_+">"+` ${this.dict["AND"]} `+"</span> ");

        }

        return str;
    }
    replaceLinks(parsed,i){
        let str = parsed[i],
            replaced = false;
        while (!replaced) {
            let replaced_ = false;
            for (let i = 0; i < parsed.length; i++) {
                if (str.indexOf('\\' + i) > -1) {
                    replaced_ = true;
                    str = str.replace('\\' + i, parsed[i]);
                }
            }
            if (!replaced_){
                replaced = true;
                break;
            }
        }
        return str;
    }
    binaryCombos(n){
        var result = [];
        for(let y=0; y<Math.pow(2,n); y++){
            var combo = [];
            for(let x=0; x<n; x++){
                if((y >> x) & 1)
                    combo.push(1);
                else
                    combo.push(0);
            }
            result.push(combo);
        }
        return result;
    }
    getVariables(exp){
        let res = [];
        for (let i = 0; i < exp.length; i++){
            if (this.letterAlphabet.indexOf(exp[i]) > -1 && res.indexOf(exp[i]) < 0){
                res.push(exp[i]);
            }
        }
        return res;
    }
    checkExpression(exp){
        for (let i = 0; i < this.alphabet.length; i++){
            while (exp.indexOf(this.alphabet[i]) > -1){
                exp = exp.replace(this.alphabet[i],"");
            }
        }
        console.log(exp);
        if (exp.length > 0){
            let chars = exp;
            chars = chars.split("");
            let reason = "Unexpected characters: "+chars;
            reason += "<br>Acceptable characters: "+CORE.alphabet;
            UI.inputError(reason);
            return exp;
        } else {
            UI.inputSuccess();
            return exp;
        }
    }
}

window.onload = function () {
    UI = new UserInterface();
    CORE = new Core();

    };


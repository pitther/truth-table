let UI, CORE;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


class UserInterface{
    constructor() {
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
        this.letterAlphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
            "Q", "R", "S", "T", "U", "W", "X", "Y", "Z"];
        this.alphabet = ["(",")"];
        this.dict = {
            "NOT": "!",
            "OR": "||",
            "AND": "&&",
            "IMP": ">",
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
            headers.push(this.replaceLinks(parsed,i));
            for (let j = 0; j < inputCombosArr.length; j++){
                let res = this.proceedLogicOperation(inputCombosArr[j],this.replaceLinks(parsed,i),variables);
                if (res == -1){
                    return;
                }
                body[j].push(res);
            }
        }

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

        let LogicArr = [
            [this.dict["NOT"]+"1", 0], [this.dict["NOT"]+"0", 1],
            ["1"+this.dict["OR"]+"1", 1], ["1"+this.dict["OR"]+"0", 1], ["0"+this.dict["OR"]+"1", 1], ["0"+this.dict["OR"]+"0", 0],
            ["1"+this.dict["AND"]+"1", 1], ["1"+this.dict["AND"]+"0", 0], ["0"+this.dict["AND"]+"1", 0], ["0"+this.dict["AND"]+"0", 0],
            ["1"+this.dict["EQ"]+"1", 1], ["1"+this.dict["EQ"]+"0", 0], ["0"+this.dict["EQ"]+"1", 0], ["0"+this.dict["EQ"]+"0", 1],
            ["1"+this.dict["IMP"]+"1", 1], ["1"+this.dict["IMP"]+"0", 0], ["0"+this.dict["IMP"]+"1", 1], ["0"+this.dict["IMP"]+"0", 1]
        ];

        let DEPTH = 20;
        for (let j = 0; j < DEPTH; j++) {
            for (let i = 0; i < LogicArr.length; i++) {
                str = str.replaceAll(LogicArr[i][0], LogicArr[i][1]);
                str = str.replaceAll('(' + LogicArr[i][0] + ')', LogicArr[i][1]);
                str = str.replaceAll('(1)', '1');
                str = str.replaceAll('(0)', '0');
            }
        }
        console.log(str);
        if (str == "1"){
            return 1;
        } else if (str == "0"){
            return 0;
        } else {
            UI.inputError("Invalid expression format");
            console.log("ERROR");
            return -1;

        }

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


// The dafault input for grades
var grades = [65.95, 56.98, 78.62, 96.1, 90.3, 72.24, 92.34, 60.00, 81.43, 86.22, 88.33, 9.03, 49.93, 52.34, 53.11, 50.10, 88.88, 55.32, 55.69, 61.68, 70.44, 70.54, 90.0, 71.11, 80.01];
var bounds;
var inputTimer;
var console_table = document.getElementById("console");
var console_length = 1;

class Bound {
    constructor(lower, upper) {
        this.upper = upper;
        this.lower = lower;
    }

    isValid(input, nextBound) {
        return (this.upper > input && input > nextBound.lower); 
    }

    isValidForLastItem(input) {
        return (this.upper > input);
    }

    isInBound(input){
        return (this.upper > input && input >= this.lower);
    }

    updateBounds (input, nextBound) {
        this.setLowerBound(input);
        nextBound.setUpperBound(input);
    }

    setLowerBound(input) {
        this.lower = input;
    }

    setUpperBound(input) {
        this.upper = input
    }
}

class Bounds {
    constructor (boundsArr) {
        this.F = new Bound(boundsArr[0], boundsArr[1]);
        this.D = new Bound(boundsArr[1], boundsArr[2]);
        this.Cminus = new Bound(boundsArr[2], boundsArr[3]);
        this.C = new Bound(boundsArr[3], boundsArr[4]);
        this.Cplus = new Bound(boundsArr[4], boundsArr[5]);
        this.Bminus = new Bound(boundsArr[5], boundsArr[6]);
        this.B = new Bound(boundsArr[6], boundsArr[7]);
        this.Bplus = new Bound(boundsArr[7], boundsArr[8]);
        this.Aminus = new Bound(boundsArr[8], boundsArr[9]);
        this.A = new Bound(boundsArr[9], boundsArr[10]);
        this.Aplus = new Bound(boundsArr[10], boundsArr[11]);
        this.Max = new Bound(boundsArr[11], Number.MAX_SAFE_INTEGER);
        this.boundsMap = [this.F, this.D, this.Cminus, this.C, this.Cplus, this.Bminus, this.B, this.Bplus, this.Aminus, this.A, this.Aplus, this.Max];
    }

    Reset (boundsArr) {
        this.F.lower = boundsArr[0];
        this.F.upper = boundsArr[1];
        this.D.lower = boundsArr[1];
        this.D.upper = boundsArr[2];
        this.Cminus.lower = boundsArr[2];
        this.Cminus.upper = boundsArr[3];
        this.C.lower = boundsArr[3];
        this.C.upper = boundsArr[4];
        this.Cplus.lower = boundsArr[4];
        this.Cplus.upper = boundsArr[5];
        this.Bminus.lower = boundsArr[5];
        this.Bminus.upper = boundsArr[6];
        this.B.lower = boundsArr[6];
        this.B.upper = boundsArr[7];
        this.Bplus.lower = boundsArr[7];
        this.Bplus.upper = boundsArr[8];
        this.Aminus.lower = boundsArr[8];
        this.Aminus.upper = boundsArr[9];
        this.A.lower = boundsArr[9];
        this.A.upper = boundsArr[10];
        this.Aplus.lower = boundsArr[10];
        this.Aplus.upper = boundsArr[11];
        this.Max.lower = boundsArr[11];
        this.Max.upper = Number.MAX_SAFE_INTEGER;
    }
}

// Reset the timer on keydown, keydown means the user is still typing
function ResetTimer() {
    clearTimeout(inputTimer);
}

// Restart the timer on keyup, keyup indicates that the user might be done typing
// Use capture input as a callback to capture the user input
function StartTimer(inputNum) {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(CaptureInput, 300, inputNum);
}

function CaptureInput(inputNum){
    var input = document.getElementById("input" + inputNum.toString());
    var bound = bounds.boundsMap[inputNum];
    var input_number = parseFloat(input.value);
    const float_regex = /^[-+]?[0-9]+[.]?[0-9]*$/;

    if (inputNum != 0) {
        var nextBound = bounds.boundsMap[inputNum-1];
        if (float_regex.test(input.value) && bound.isValid(input_number, nextBound)){
            // Valid input 
            bound.updateBounds(input_number, nextBound);
            input.style.backgroundColor = "white";
            // Render the output
            RenderOutput();
        }
        else {
            input.style.backgroundColor = "rgb(242,191,191)";
            AppendInvalidInputMessage(input.value, inputNum);
        }
    }
    else {
        // If the inputNum is 0, there is no next bound to check for
        if (float_regex.test(input.value) && bound.isValidForLastItem(input_number)){
            // Valid input 
            bound.setLowerBound(input_number);
            input.style.backgroundColor = "white";
            // Render the output
            RenderOutput();
        }
        else {
            input.style.backgroundColor = "rgb(242,191,191)";
            AppendInvalidInputMessage(input.value, inputNum);
        } 
    }
}

function RenderOutput() {
    var distribution = CalculateDistribution();
    ClearPreviousOutput();
    AppendNewDistribution(distribution);

    for (var index = 0 ; index < 11 ; index++){
        var td = document.getElementById("output" + index.toString());
        for (var count = 0 ; count < distribution[index] ; count++){
            td.textContent += "💪";
        }
    }
}

function CalculateDistribution() {
    var distribution = [0,0,0,0,0,0,0,0,0,0,0];
    for (var index = 0 ; index < grades.length ; index++) {
        for (var i = 0 ; i < 11 ; i++){
            if (bounds.boundsMap[i].isInBound(grades[index])){
                distribution[i]++;
            }
        }
    }

    return distribution;
}

function ClearPreviousOutput() {
    for (var index = 0 ; index < 11 ; index++){
        var td = document.getElementById("output" + index.toString());
        td.textContent = "";
    }
}

function AppendInvalidInputMessage(inputVal, inputNum) {
    let table = document.getElementById("error_table");
    let row = table.insertRow(-1);
    let title = row.insertCell(0);
    let content = row.insertCell(1);

    let titleText = document.createTextNode('Invalid input ' + '[' + inputVal + ']:');
    if (inputNum != 11 && inputNum != 0){
        let contentText = document.createTextNode('The input should be in range ' + 
        bounds.boundsMap[inputNum+1].lower + ' and ' + 
        bounds.boundsMap[inputNum-1].lower + '.');
        content.appendChild(contentText);

    }
    else if (inputNum == 11){
        let contentText = document.createTextNode('The input should be in range ' + 
        ' INT_MAX and ' + bounds.boundsMap[inputNum-1].lower + '.');
        content.appendChild(contentText);
    }
    else if (inputNum == 0){
        let contentText = document.createTextNode('The input should be in range ' + 
        bounds.boundsMap[inputNum+1].lower + ' and INT_MIN.');
        content.appendChild(contentText);
    }

    title.appendChild(titleText);

    if (table.offsetHeight >= 550){
        table.deleteRow(0);
    }
}

function AppendNewDistribution(){
    let table = document.getElementById("error_table");
    let row = table.insertRow(-1);
    let title = row.insertCell(0);
    let content = row.insertCell(1);

    let titleText = document.createTextNode('Current range: ');
    let contentText = document.createTextNode( 
        bounds.boundsMap[10].upper + ' - ' + bounds.boundsMap[10].lower + ', ' + 
        bounds.boundsMap[9].upper + ' - ' + bounds.boundsMap[9].lower + ', ' + 
        bounds.boundsMap[8].upper + ' - ' + bounds.boundsMap[8].lower + ', ' + 
        bounds.boundsMap[7].upper + ' - ' + bounds.boundsMap[7].lower + ', ' + 
        bounds.boundsMap[6].upper + ' - ' + bounds.boundsMap[6].lower + ', ' + 
        bounds.boundsMap[5].upper + ' - ' + bounds.boundsMap[5].lower + ', ' + 
        bounds.boundsMap[4].upper + ' - ' + bounds.boundsMap[4].lower + ', ' + 
        bounds.boundsMap[3].upper + ' - ' + bounds.boundsMap[3].lower + ', ' + 
        bounds.boundsMap[2].upper + ' - ' + bounds.boundsMap[2].lower + ', ' + 
        bounds.boundsMap[1].upper + ' - ' + bounds.boundsMap[1].lower + ', ' + 
        bounds.boundsMap[0].upper + ' - ' + bounds.boundsMap[0].lower
    ); 
    title.appendChild(titleText);
    content.appendChild(contentText);

    if (table.offsetHeight >= 550){
        table.deleteRow(0);
    }
}

function ResetTable() {
    document.getElementById("input11").value = "100.00";
    document.getElementById("input10").value = "95.00";
    document.getElementById("input9").value = "90.00";
    document.getElementById("input8").value = "85.00";
    document.getElementById("input7").value = "80.00";
    document.getElementById("input6").value = "75.00";
    document.getElementById("input5").value = "70.00";
    document.getElementById("input4").value = "65.00";
    document.getElementById("input3").value = "60.00";
    document.getElementById("input2").value = "55.00";
    document.getElementById("input1").value = "50.00";
    document.getElementById("input0").value = "0.00";
    document.getElementById("input11").style.backgroundColor = "white";
    document.getElementById("input10").style.backgroundColor = "white";
    document.getElementById("input9").style.backgroundColor = "white";
    document.getElementById("input8").style.backgroundColor = "white";
    document.getElementById("input7").style.backgroundColor = "white";
    document.getElementById("input6").style.backgroundColor = "white";
    document.getElementById("input5").style.backgroundColor = "white";
    document.getElementById("input4").style.backgroundColor = "white";
    document.getElementById("input3").style.backgroundColor = "white";
    document.getElementById("input2").style.backgroundColor = "white";
    document.getElementById("input1").style.backgroundColor = "white";
    document.getElementById("input0").style.backgroundColor = "white";

    let table = document.getElementById("error_table");
    let tr = table.getElementsByTagName("tr");
    console.log(tr);
    for (var i = tr.length ; i > 0; i--){
        table.deleteRow(i-1);
    }

    let boundsArr = [0.00,50.00,55.00,60.00,65.00,70.00,75.00,80.00,85.00,90.00,95.00,100.00];
    bounds.Reset(boundsArr);
    RenderOutput();
}

// Initialize work for when the page first load
function initialize() {
    var boundsArr = [];
    // Collect the default values of all the inputs in the table
    for (var i = 0 ; i < 12; i++){
        boundsArr.push(parseFloat(document.getElementById("input" + i.toString()).value));
    }
    bounds = new Bounds(boundsArr);
    grades.sort();
    RenderOutput();
}

initialize();
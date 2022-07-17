const screen = document.querySelector(".screen > .input > .content");
const answer = document.querySelector(".screen > .input > .answer");

const operations = {"+": (n1, n2) => n1+n2,
    "-": (n1, n2) => n1-n2,
    "*": (n1, n2) => n1*n2,
    "/": (n1, n2) => n1/n2,
    "^": (n1, n2) => {
      let result = 1;
      for (let i = 0; i < n2; i++) {
        result *= n1;
      }
      return result;
    }};

function clearScreen () {
  screen.textContent = "";
}

function operate () {
  let expression = screen.textContent;
  expression = expression.replace(/\s/g, "")
  expression = expression.replace(/(\d+)\.(\D+)/g, "$1.0$2")
  expression = expression.replace(/\+-/g, "+0-")
  expression = expression.replace(/(\d+)([\*])-(\d+)/g, "-$3$2$1")
  expression = expression.replace(/(\d+)([/])-(\d+)/g, "-$1$2$3")


  if (expression[0] == "-") {
    expression = "0" + expression;
  }
  if (expression.slice(-1).search(/[\d\.]/)) {
    expression = expression.slice(0,-1);
  }
  try {
    operator = expression.match(/[*/]/g);
    if (operator != null) {
      for (let operation of operator) {
        let actualExpression = expression.match("\\-?\\d+(\\.\\d+)?["+operation+"]\\d+(\\.\\d+)?")[0];
        let n1 = Number(actualExpression.match(/^-?\d+(\.\d+)?/)[0]);
        let n2 = Number(actualExpression.match(/\d+(\.\d+)?$/)[0]);
        expression = expression.replace(actualExpression,
           operations[operation](n1, n2));
      }
    }

    operator = expression.match(/[+\-]/g);
    if (operator != null) {
      for (let operation of operator) {
        let actualExpression = expression.match("\\-?\\d+(\\.\\d+)?["+operation+"]\\d+(\\.\\d+)?")[0];
        let n1 = Number(actualExpression.match(/^-?\d+(\.\d+)?/)[0]);
        let n2 = Number(actualExpression.match(/\d+(\.\d+)?$/)[0]);
        expression = expression.replace(actualExpression,
           operations[operation](n1, n2));
      }
    }
  } catch (e) {};
  answer.textContent = Math.round(expression * 100000) / 100000;
  if (answer.textContent === "NaN") {
    answer.textContent = screen.textContent;
  }
}

function changeScreen () {
  screen.textContent = answer.textContent;
}


function handleInput (action) {
  if (action == "AC") {
    clearScreen();
  } else if (Object.keys(operations).includes(action.trim())) {
    if (screen.textContent != "" &&
        !Object.keys(operations).includes(screen.textContent.slice(-2, -1)) ||
        action == " - " && screen.textContent.slice(-2, -1) != "-") {
      screen.textContent += action;
    }
  } else if (action.trim() == "=") {
    changeScreen();
  } else if (action.trim() == "bs") {
    screen.textContent = screen.textContent.trim().slice(0, -1);
  } else if (action.trim() == ".") {
    if (/\b\d+\.\d+$/.test(screen.textContent) || /\.$/.test(screen.textContent)) {
    } else if (!/ $/.test(screen.textContent)) {
      screen.textContent += ".";
    }
  } else {
    screen.textContent += action;
  }
  operate();
}




for (let button of document.querySelectorAll(".button")) {
  button.addEventListener("click", (e) => {
    let button_value = button.getAttribute("data-value");
    handleInput (button_value);
  });
}

window.addEventListener ("keydown", (e) => kBSupport(e));



function kBSupport (e) {
  const button_list = {
    "Backspace": () => handleInput("bs"),
    "Escape": () => handleInput("AC"),
    "Enter": () => handleInput("="),
    "0": () => handleInput("0"),
    "1": () => handleInput("1"),
    "2": () => handleInput("2"),
    "3": () => handleInput("3"),
    "4": () => handleInput("4"),
    "5": () => handleInput("5"),
    "6": () => handleInput("6"),
    "7": () => handleInput("7"),
    "8": () => handleInput("8"),
    "9": () => handleInput("9"),
    "+": () => handleInput(" + "),
    "-": () => handleInput(" - "),
    "*": () => handleInput(" * "),
    "/": () => {handleInput(" / "); e.preventDefault()},
    ".": () => handleInput(" . "),
  }
  if (Object.keys(button_list).includes(e.key)) {
    button_list[e.key]();
  }
}
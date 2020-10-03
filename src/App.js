import React from "react";
import "./App.css";

const buttons = [
  {
    text: "AC",
    id: "clear",
  },
  {
    text: "/",
    id: "divide",
  },
  {
    text: "X",
    id: "multiply",
  },
  {
    text: 7,
    id: "seven",
  },
  {
    text: 8,
    id: "eight",
  },
  {
    text: 9,
    id: "nine",
  },
  {
    text: "-",
    id: "subtract",
  },
  {
    text: 4,
    id: "four",
  },
  {
    text: 5,
    id: "five",
  },
  {
    text: 6,
    id: "six",
  },
  {
    text: "+",
    id: "add",
  },
  {
    text: 1,
    id: "one",
  },
  {
    text: 2,
    id: "two",
  },
  {
    text: 3,
    id: "three",
  },
  {
    text: "=",
    id: "equals",
  },
  {
    text: 0,
    id: "zero",
  },
  {
    text: ".",
    id: "decimal",
  },
];
const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ["+", "-", "/", "X"];

class App extends React.Component {
  state = { mainDisplay: "0", secondaryDisplay: "" };

  btns = React.createRef();

  componentDidMount() {
    this.clearDisplay();
  }

  handleClick = (e) => {
    let text = e.target.innerHTML;
    let index = 0;
    let res = 0;
    operators.map((op) => {
      if ((this.state.secondaryDisplay + text).includes(op)) {
        index = (this.state.secondaryDisplay + text).lastIndexOf(op);
        if (index > res) res = index;
      }
    });

    ///PREVENT GETTING SPAN
    if (text.length > 2) return 0;
    ///

    /// CLEAR
    if (text === "AC") {
      this.clearDisplay();
    }
    ///

    ///DECIMAL
    else if (text === ".") {
      if (
        this.state.mainDisplay === "0" &&
        this.state.secondaryDisplay === ""
      ) {
        this.setState({
          mainDisplay: (this.state.mainDisplay + text).slice(res),
          secondaryDisplay: this.state.mainDisplay + text,
        });
      } else {
        this.setState({
          mainDisplay: (this.state.secondaryDisplay + text).slice(res + 1),
          secondaryDisplay: this.state.secondaryDisplay + text,
        });
      }
      document.getElementById("decimal").style.pointerEvents = "none";
      document.getElementById("zero").style.pointerEvents = "all";
    }
    ///

    /// AFTER EQUALS (AGAIN)
    else if (this.state.secondaryDisplay.includes("=")) {
      if (this.isOperator(text)) {
        this.setState({
          mainDisplay: text,
          secondaryDisplay: this.state.mainDisplay.toString() + text,
        });
      } else {
        this.setState({
          mainDisplay: text,
          secondaryDisplay: text,
        });
      }
      document.getElementById("decimal").style.pointerEvents = "all";
      document.getElementById("zero").style.pointerEvents = "none";
    }
    ///

    /// EQUATION
    else if (text === "=") {
      this.setState({
        mainDisplay:
          Math.round(this.equals(this.state.secondaryDisplay) * 100000) /
          100000,
      });
      document.getElementById("decimal").style.pointerEvents = "none";
    }
    ///

    ///DIGIT LIMIT
    else if (this.state.mainDisplay.length > 15 && this.isNum(text)) {
      this.setState({ mainDisplay: "DIGIT LIMIT MET" });
      this.btns.current.style.pointerEvents = "none";
      setTimeout(() => {
        this.setState({
          mainDisplay: this.state.secondaryDisplay,
        });
        document.getElementById("decimal").style.pointerEvents = "none";
        this.btns.current.style.pointerEvents = "all";
      }, 800);
    }
    ///

    ///NUMBERS
    else if (this.isNum(text)) {
      if ((this.state.secondaryDisplay + text).slice(res).includes(".")) {
        document.getElementById("decimal").style.pointerEvents = "none";
      } else {
        document.getElementById("decimal").style.pointerEvents = "all";
      }
      if (
        this.isOperator(this.state.secondaryDisplay.slice(-1)) ||
        this.isOperator(this.state.secondaryDisplay)
      ) {
        this.setState({
          mainDisplay: (this.state.secondaryDisplay + text).slice(res + 1),
          secondaryDisplay: this.state.secondaryDisplay + text,
        });
      } else {
        this.setState({
          mainDisplay: this.state.secondaryDisplay + text,
          secondaryDisplay: this.state.secondaryDisplay + text,
        });
        document.getElementById("zero").style.pointerEvents = "all";
      }
      if (
        (this.state.secondaryDisplay.slice(-1) === "0" &&
          this.isOperator(this.state.secondaryDisplay.slice(-2)) &&
          this.isNum(text)) ||
        this.state.secondaryDisplay === "0"
      ) {
        this.setState({
          mainDisplay:
            this.state.secondaryDisplay.substring(
              0,
              this.state.secondaryDisplay.length - 1
            ) + text,
          secondaryDisplay:
            this.state.secondaryDisplay.substring(
              0,
              this.state.secondaryDisplay.length - 1
            ) + text,
        });
      }
      if (text !== "0") {
        document.getElementById("zero").style.pointerEvents = "all";
      }
    }
    ///

    ///OPERATOR
    else if (this.isOperator(text)) {
      if (text === "+" || text === "/" || text === "X") {
        if (this.state.secondaryDisplay.slice(-1) === "-") {
          this.setState({
            mainDisplay: text.slice(1),
            secondaryDisplay: this.state.secondaryDisplay,
          });
        } else if (this.isOperator(this.state.secondaryDisplay.slice(-1))) {
          this.setState({
            mainDisplay: text.slice(1),
            secondaryDisplay: this.state.secondaryDisplay.slice(0, -1) + text,
          });
        } else {
          this.setState({
            mainDisplay: text.slice(1),
            secondaryDisplay: this.state.secondaryDisplay + text,
          });
        }
      } else if (text === "-") {
        if (
          this.isOperator(this.state.secondaryDisplay.slice(-1)) &&
          this.state.secondaryDisplay.slice(-1) !== "-"
        ) {
          this.setState({
            mainDisplay: text.slice(1),
            secondaryDisplay: this.state.secondaryDisplay + text,
          });
        } else if (
          this.isNum(this.state.secondaryDisplay.slice(-1)) ||
          this.state.secondaryDisplay === ""
        ) {
          this.setState({
            mainDisplay: text.slice(1),
            secondaryDisplay: this.state.secondaryDisplay + text,
          });
        } else {
          this.setState({
            mainDisplay: text.slice(1),
            secondaryDisplay: this.state.secondaryDisplay,
          });
        }
      }
      document.getElementById("decimal").style.pointerEvents = "none";
    }
    ////
  };

  isNum = (num) => {
    return nums.includes(num);
  };
  isOperator = (eq) => {
    return operators.some((op) => eq.includes(op));
  };
  clearDisplay = () => {
    this.setState({
      mainDisplay: "0",
      secondaryDisplay: "",
    });
    document.getElementById("decimal").style.pointerEvents = "all";
    document.getElementById("zero").style.pointerEvents = "none";
  };
  equals = (input) => {
    let res = input.replace(/X/g, "*");
    if (
      res.charAt(0) === "+" ||
      res.charAt(0) === "*" ||
      res.charAt(0) === "/"
    ) {
      res = res.substring(1);
    }
    for (let i = 0; i < 2; i++) {
      if (this.isOperator(res.slice(-1)) || res.slice(-1) === "*") {
        res = res.slice(0, -1);
      }
    }
    this.setState({
      secondaryDisplay: `${res.replaceAll("*", "X")}= ${
        Math.round(eval(res) * 100000) / 100000
      }`,
    });
    return eval(res);
  };

  render() {
    return (
      <main>
        <div className="main">
          <div id="display">
            <p className="secondary-display">{this.state.secondaryDisplay}</p>
            <p className="main-display">{this.state.mainDisplay}</p>
          </div>

          <div ref={this.btns} className="buttons">
            {buttons.map((btn) => {
              return (
                <div
                  key={btn.id}
                  className="btn"
                  id={btn.id}
                  onClick={this.handleClick}
                >
                  <span className={btn.id}>{btn.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }
}

export default App;

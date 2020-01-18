class UI {
    constructor() {
        this.inputEngine = new InputEngine();
        this.parser = new PostfixNotationParser();
        this.mathEngine = new PostfixNotationMathEngine();
        this.calculatorBtns = document.querySelector('.buttons');
        this.inputBar = document.querySelector('.userInput');
        this.resultBar = document.querySelector('.result');
        this.isResultUpdated = true;
    }

    init() {
        this.calculatorBtns.addEventListener('click', (e) => this.onAnyButtonClicked(e));
    }

    resizeInput() {
        if (this.inputBar.value.length > 50) {
            this.inputBar.style.fontSize = "1.00rem";
        } else if (this.inputBar.value.length > 35) {
            this.inputBar.style.fontSize = "1.17rem";
        } else if (this.inputBar.value.length > 20)  {
            this.inputBar.style.fontSize = "1.35rem";
        } else {
            this.inputBar.style.fontSize = "1.5rem";
        }
    }

    onAnyButtonClicked(e) {
        const target = e.target.parentNode.type === "button" ? e.target.parentNode : e.target;  

        if (target.classList.contains("number")) {
            this.onInputButtonClicked(target, CHAR_TYPES.NUMBER);
        }
        else if (target.classList.contains("op")) {
            this.onInputButtonClicked(target, CHAR_TYPES.OPERATION);
        } 
        else if (target.classList.contains("parenthesis")) {
            this.onInputButtonClicked(target, CHAR_TYPES.PARENTHESIS);
        }
        else if (target.classList.contains("float")) {
            this.onInputButtonClicked(target, CHAR_TYPES.FLOAT);
        }
        else if (target.classList.contains("clear")) {
            this.onClearClicked(target);
        }
        else if (target.classList.contains("equals")) {
            this.onEqualsClicked();
        }

        this.resizeInput();
    }

    onInputButtonClicked(btn, charType) {
        const character = btn.textContent;
        this.inputEngine.updateInput(character, charType);
        this.inputBar.value = this.inputEngine.currentInput;
        this.isResultUpdated = false;
    }

    onEqualsClicked() {
        if (this.isResultUpdated) {
            return;
        }

        this.inputEngine.lastInput = this.inputEngine.currentInput;
        this.inputEngine.lastInputParenthesesCount = this.inputEngine.parenthesesCount;
        this.resultBar.value = this.inputEngine.isReadyToCalculate() ? this.getEquationResult() : "Syntax error";
        this.isResultUpdated = true;
    }

    onClearClicked(clearBtn) {
        const clearOperation = clearBtn.textContent;
        this.inputEngine.clear(clearOperation);
        this.inputBar.value = this.inputEngine.currentInput;
        this.isResultUpdated = false;
    }

    getEquationResult() { 
        const equation = this.parser.getEquationInPostfixNotation(this.inputEngine.currentInput); 
        const result = this.mathEngine.calculatePostfixEquation(equation);

        if (result === 0) {
            this.inputEngine.isInputTouched = false;
        }

        this.parser.setDefault();

        if (!isNaN(result)) {
            this.inputEngine.currentInput = `${result}`;
        }
        
        return result;
    }
}
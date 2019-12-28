class UI {
    constructor() {
        this.mathEngine = new MathEngine();
        this.calculatorBtns = document.querySelector('.buttons');
        this.resultBar = document.querySelector('.form-control');
    }

    init() {
        this.calculatorBtns.addEventListener('click', (e) => this.onAnyButtonClicked(e));
    }

    onAnyButtonClicked(e) {
        const target = e.target.parentNode.type === "button" ? e.target.parentNode : e.target;  

        if (target.classList.contains("number")) {
            this.onNumberClicked(target);
        }
        else if (target.classList.contains("op")) {
            this.onOperationClicked(target);
        } 
        else if (target.classList.contains("clear")) {
            this.onClearClicked(target);
        }
        else if (target.classList.contains("float")) {
            this.onFloatClicked();
        }
    }

    onNumberClicked(numberBtn) {
        const number = numberBtn.textContent;
        this.mathEngine.updateCurrentNumber(number);
        this.resultBar.value = this.mathEngine.currentNumberInput;
    }

    onClearClicked(clearBtn) {
        const clearOperation = clearBtn.textContent;
        this.mathEngine.clear(clearOperation);
        this.resultBar.value = this.mathEngine.currentNumberInput;
    }

    onOperationClicked(operationBtn) {
        const operation = operationBtn.textContent;
        this.mathEngine.operationChangeHandler(operation);
        this.resultBar.value = this.mathEngine.result;
    }

    onFloatClicked() {
        this.mathEngine.setNumberToFloat();
        this.resultBar.value = this.mathEngine.currentNumberInput;
    }
}
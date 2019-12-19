class UI {
    constructor() {
        this.mathEngine = new MathEngine();
        this.numberBtns = document.querySelectorAll('.number');
        this.operationBtns = document.querySelectorAll('.op');
        this.floatBtn = document.querySelector('.float');
        this.clearBtns = document.querySelectorAll('.clear');
        this.resultBar = document.querySelector('.form-control');
    }

    init() {
        this.initNumberBtns();
        this.initOperationBtns();
        this.initClearBtns();
        this.floatBtn.addEventListener('click', (e) => this.onFloatButtonClicked(e));
    }

    initNumberBtns() {
        this.numberBtns.forEach(numberBtn => {
            numberBtn.addEventListener("click", (e) => this.onNumberClicked(e));
        });
    }

    initOperationBtns() {
        this.operationBtns.forEach(operationBtn => {
            operationBtn.addEventListener('click', (e) => this.onOperationClicked(e));
        });
    }

    initClearBtns() {
        this.clearBtns.forEach(clearBtn => {
            clearBtn.addEventListener('click', (e) => this.onClearClicked(e));
        });
    }

    onNumberClicked(e) {
        const num = e.target.textContent;
        this.mathEngine.updateCurrentNumber(num);
        this.resultBar.value = this.mathEngine.currentNumberInput;
    }

    onClearClicked(e) {
        const clearKey = e.target.textContent;
        this.mathEngine.clear(clearKey);
        this.resultBar.value = this.mathEngine.currentNumberInput;
    }

    onOperationClicked(e) {
        const operation = e.target.textContent;
        this.mathEngine.operationChangeHandler(operation);
        this.resultBar.value = this.mathEngine.result;
    }

    onFloatButtonClicked() {
        this.mathEngine.setNumberToFloat();
        this.resultBar.value = this.mathEngine.currentNumberInput;
    }
}
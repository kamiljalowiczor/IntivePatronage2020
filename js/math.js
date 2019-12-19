class MathEngine {
    constructor() {
        this.setDefault();
    }

    setDefault() {
        this.currentNumberInput = "0";
        this.result = 0;
        this.operation = null;
        this.isInputTouched = false;
        this.isLastClickNumber = true;
        this.isFloatingPointSet  = false;
    }

    parseNumber() {
        this.currentNumberInput = parseFloat(this.currentNumberInput);
    }

    resultToFixed() {
        this.result = this.result.toFixed(12) * 1;
    }

    updateCurrentNumber(num) {
        if (this.currentNumberInput.length > 12) {
            return;
        }

        if (!this.isInputTouched) {
            this.setFirstDigit(num);
        } else {
            this.currentNumberInput += num;
        }   

        this.isLastClickNumber = true;
    }

    setFirstDigit(num) {
        if (num !== "0") {
            this.currentNumberInput = num;
            this.isInputTouched = true;
        } else {
            this.currentNumberInput = 0;
        }
    }

    setNumberToFloat() {
        if(!this.isFloatingPointSet) {
            this.setFloatingPoint();
            this.isFloatingPointSet = true;
            this.isInputTouched = true;
        }
    }

    setFloatingPoint() {
        if (!this.isInputTouched) {
            this.currentNumberInput = "0.";
        } else {
            this.currentNumberInput += ".";
        }
    }

    operationChangeHandler(operation) { 
        this.updateResult();

        if (operation === OPERATIONS.EQUALS) {
            this.operation = null;
        } else {
            this.operation = operation;
        }      

        this.isInputTouched = false;
        this.isLastClickNumber = false; 
        this.isFloatingPointSet = false;
    }

    updateResult() {
        if(this.isLastClickNumber) {
            this.parseNumber();
            this.calculateResult();
            this.resultToFixed();
        }
    }

    calculateResult() {
        if (this.operation) {
            switch(this.operation) {
                case OPERATIONS.ADD:
                    this.result += this.currentNumberInput;
                    break;
                case OPERATIONS.SUB:
                    this.result -= this.currentNumberInput;
                    break;
                case OPERATIONS.MUL:
                    this.result *= this.currentNumberInput;
                    break;
                case OPERATIONS.DIV:
                    this.result /= this.currentNumberInput;
                    break;
                default:
                    this.result = NaN;
            }            
        } else {
            this.result = this.currentNumberInput;
        }
    }

    clear(clearKey) {
        switch(clearKey) {
            case CLEAR_KEYS.C:
                this.setDefault();
                break;
            case CLEAR_KEYS.CE: 
                this.clearEntry();
                break;
            default:
                this.result = NaN;
        }
    }

    clearEntry() {
        if (!this.isLastClickNumber) {
            this.setDefault();
        } else {
            this.isFloatingPointSet = false;
            this.isInputTouched = false;
        }
    }
}
class MathEngine {
    constructor() {
        this.setDefault();
    }

    setDefault() {
        this.currentNumberInput = "0";
        this.result = 0;
        this.operation = null;
        this.isInputTouched = false;
        this.isReadyToCalculate = true;
        this.isFloatingPointSet = false;
    }

    parseNumber() {
        this.currentNumberInput = parseFloat(this.currentNumberInput);
    }

    resultToFixed() {
        this.result = this.result.toFixed(12) * 1;
    }

    updateCurrentNumber(number) {
        if (this.currentNumberInput.length > 12) {
            return;
        }

        this.isInputTouched ? this.currentNumberInput += number : this.setFirstDigit(number);

        this.isReadyToCalculate = true;
    }

    setFirstDigit(number) {
        if (number !== "0") {
            this.currentNumberInput = number;
            this.isInputTouched = true;
        } else {
            this.currentNumberInput = "0";
        }
    }

    setNumberToFloat() {
        if (!this.isFloatingPointSet) {
            this.setFloatingPoint();
            this.isFloatingPointSet = true;
            this.isInputTouched = true;
            this.isReadyToCalculate = true;
        }
    }

    setFloatingPoint() {
        this.isInputTouched ? this.currentNumberInput += "." : this.currentNumberInput = "0.";
    }

    operationChangeHandler(operation) {
        const isOperationInstant = this.isOperationInstant(operation);
        
        if (isOperationInstant) {
            this.setInstantOperation(operation);
        }
        
        this.updateResult();

        operation === OPERATIONS.EQUALS || isOperationInstant ? this.operation = null : this.operation = operation;

        this.isInputTouched = false;
        this.isReadyToCalculate = false;
        this.isFloatingPointSet = false;
    }

    setInstantOperation(operation) {
        if (!this.isInputTouched) {
            this.currentNumberInput = this.result;
        }
        this.operation = operation;
        this.isReadyToCalculate = true;
    }

    isOperationInstant(operation) {
        switch (operation) {
            case OPERATIONS.SQUARE:
                return true;
            case OPERATIONS.SQRT:
                return true;
            default:
                return false;
        }
    }

    updateResult() {
        if (this.isReadyToCalculate) {
            this.parseNumber();
            this.calculateResult();
            this.resultToFixed();
        }
    }

    calculateResult() {
        if (this.operation) {
            switch (this.operation) {
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
                    this.performDivision();
                    break;
                case OPERATIONS.SQUARE:
                    this.result = Math.pow(this.currentNumberInput, 2);
                    break;
                case OPERATIONS.SQRT:
                    this.performSqrt();
                    break;
                case OPERATIONS.POW:
                    this.result = Math.pow(this.result, this.currentNumberInput);
                    break;
                case OPERATIONS.NTH_ROOT:
                    this.performNthRoot()
                    break;
                default:
                    this.result = NaN;
            }
        } else {
            this.result = this.currentNumberInput;
        }
    }

    performDivision() {
        this.currentNumberInput === 0 ? alert("Dividing by zero is not allowed") : this.result /= this.currentNumberInput;
    }

    performNthRoot() {
        this.result === 0 ? alert("Root can not be zero") : this.result = Math.pow(this.currentNumberInput, 1 / this.result);
    }

    performSqrt() {
        this.currentNumberInput < 0 ? alert("Square root of a negative number is not allowed") : this.result = Math.sqrt(this.currentNumberInput);
    }

    clear(clearKey) {
        switch (clearKey) {
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
        if (!this.isReadyToCalculate) {
            this.setDefault();
        } else {
            this.isFloatingPointSet = false;
            this.isInputTouched = false;
        }
    }
}
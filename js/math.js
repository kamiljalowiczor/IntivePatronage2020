class PostfixNotationMathEngine {
    constructor() {
        this.currentOperation = null;
        this.generalArray = [];
    }

    calculatePostfixEquation(postfixEquationArray) {
        postfixEquationArray.forEach(element => {
            const isElementOperation = StringUtils.checkForArithmeticalOperation(element);
            isElementOperation ?  this.handleCalculatingOperation(element) : this.generalArray.push(parseFloat(element));
        }) 

        return this.generalArray.pop();
    }

    handleCalculatingOperation(operation) {
        let numberRight = this.generalArray.pop();
        let numberLeft = this.generalArray.pop();

        this.currentOperation = numberLeft + ` ${operation} ` + numberRight;

        let result = this.calculateResult(operation, numberLeft, numberRight);
        this.generalArray.push(result);
    }

    numberToFixed(number) {
        return number.toFixed(10) * 1;
    }

    calculateResult(operation, numberLeft, numberRight) {
        let result;
        switch (operation) {
            case OPERATIONS.ADD:
                result = numberLeft + numberRight;
                break;
            case OPERATIONS.SUB:
                result = numberLeft - numberRight;
                break;
            case OPERATIONS.MUL:
                result = numberLeft * numberRight;
                break;
            case OPERATIONS.DIV:
                result = this.performDivision(numberLeft, numberRight);
                break;
            case OPERATIONS.POW_SHORT:
                result = this.performExponentiation(numberLeft, numberRight);
                break;
            case OPERATIONS.NTH_ROOT_SHORT:
                result = this.performNthRoot(numberLeft, numberRight);
                break;
            default:
                result = NaN;
        }
        return this.numberToFixed(result);
    }

    performExponentiation(numberLeft, numberRight) {
        if (numberLeft < 0) { 
            numberLeft = numberLeft * -1;
            if (numberRight % 2 !== 0) {
                return -1 * Math.pow(numberLeft, numberRight); // np -3^-(1/3)
            }
        }
        return Math.pow(numberLeft, numberRight)
    }

    performDivision(numberLeft, numberRight) {
        if (numberRight === 0) {
            alert(`Error in calculating ${this.currentOperation} : Dividing by zero is not allowed.`)
            return NaN
        }
        return numberLeft / numberRight;
    }

    performNthRoot(index, radicand) {
        if (index === 0) {
            alert(`Error in calculating ${this.currentOperation} : Index of root can not be zero.`);
            return NaN;
        }
        else if (index % 2 === 0 && radicand < 0) {
            alert(`Error in calculating ${this.currentOperation} : Can't perform the nth root operation - In order to calculate nth root of an negative radicand, the index has to be an odd number.`);
            return NaN;
        } else if (index % 2 === 1 && radicand < 0) {
            return -1 * this.performExponentiation(Math.abs(radicand), 1 / index);
        }

        return this.performExponentiation(radicand, 1 / index);
    }
}
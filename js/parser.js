class PostfixNotationParser {
    constructor() {
        this.setDefault();
    }

    setDefault() {
        this.equationArray = [];
        this.result = 0;
        this.generalArray = [];
        this.postfixEquationArray = [];
        this.currentOperation = null;
    }

    getEquationInPostfixNotation(equation) {
        this.parseEquationToArray(equation);
        this.convertEquationToPostfix();
        return [...this.postfixEquationArray];
    }

    parseEquationToArray(input) { 
        const nonOperatorsRe = /-?[A-Z]+\(\d+\.?\d+\)|-?[0-9\.]+|-?\(|\)/;
        const nonOperatorsSeperator = /(-?[A-Z]+\(\d+\.?\d+\)|-?[0-9\.]+|-?\(|\))/;
        const operatorsRe = /\s[\*\/\-\+]\s|√|\^/g;

        let inputCopy = input.replace(operatorsRe, "#");
        const inputArray = inputCopy.split(nonOperatorsSeperator).filter((n) => { return n });
        const operatorsArray = input.split(nonOperatorsRe).filter((n) => { return n });
        const numbersAndParenthesesArray = input.split(nonOperatorsSeperator).filter((n) => { return nonOperatorsRe.test(n) });

        this.mergeEquationArray([...inputArray], [...operatorsArray], [...numbersAndParenthesesArray])
    }

    mergeEquationArray(inputArray, operatorsArray, numbersAndParenthesesArray) {
        inputArray.forEach(element => {
            if (element === "#") {
                const operationSymbol = StringUtils.removeWhitespacesFromString(operatorsArray.shift());
                this.equationArray.push(operationSymbol);
            } else {
                this.equationArray.push(numbersAndParenthesesArray.shift());     
            }
        }); 
    }

    convertEquationToPostfix() {
        this.equationArray.forEach(element => {
            if (StringUtils.checkForParentheses(element)) {
                this.handleParenthesisPushing(element);
            } else if (StringUtils.checkForArithmeticalOperation(element)) {
                this.handleOperationPushing(element);
            } else {
                this.postfixEquationArray.push(element);
            }
        })

        while(this.generalArray.length !== 0) {
            this.postfixEquationArray.push(this.generalArray.pop());
        }
    }

    handleParenthesisPushing(parenthesis) {
        if (parenthesis === PARENTHESES.LEFT) {
            this.generalArray.push(parenthesis);
        } else if (parenthesis === PARENTHESES.RIGHT) {
            while (this.generalArray.slice(-1).pop() !== PARENTHESES.LEFT) { 
                this.postfixEquationArray.push(this.generalArray.pop());
            }
            this.generalArray.pop();
        }
    }

    handleOperationPushing(operation) {
        const currentOperationPriority = this.getOperationPriority(operation);

        while (currentOperationPriority <= this.getLastOperationPriority()) {
            this.postfixEquationArray.push(this.generalArray.pop());
        }

        this.generalArray.push(operation);
    }

    getLastOperationPriority() {
        let lastOperation = this.generalArray.slice(-1).pop();
        return this.getOperationPriority(lastOperation);
    }

    getOperationPriority(operation) {
        switch (operation) {
            case OPERATIONS.ADD:
            case OPERATIONS.SUB:
                return 1;
            case OPERATIONS.MUL:
            case OPERATIONS.DIV:
                return 2;
            case OPERATIONS.POW_SHORT:
            case OPERATIONS.NTH_ROOT_SHORT:
                return 3;
            default:
                return 0;
        }
    }
}
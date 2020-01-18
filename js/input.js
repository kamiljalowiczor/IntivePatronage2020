class InputEngine {
    constructor() {
        this.setDefault();
    }

    setDefault() {
        this.currentInput = "0";
        this.lastOperationSymbol = null;
        this.lastInput = null;
        this.isInputTouched = false;
    }

    resetLastInput() {
        if (this.lastInput !== null) {
            this.lastInput = null;
        }   
    }

    updateInput(character, characterType) { 
        this.resetLastInput();

        if (this.currentInput.length > 70) {
            return;
        }

        this.appendCharacter(character, characterType)
    }

    appendCharacter(character, characterType) {
        switch(characterType) {
            case CHAR_TYPES.OPERATION:
                this.handleOperationAppending(character);
                break;
            case CHAR_TYPES.NUMBER:
                this.handleNumberAppending(character);
                break;
            case CHAR_TYPES.PARENTHESIS:
                this.handleParenthesisAppending(character);
                break;
            case CHAR_TYPES.FLOAT:
                this.setNumberToFloat();
                break;
            default: 
                return;
        }
    }

    handleNumberAppending(character) {
        this.isInputTouched ? this.appendNumber(character) : this.setFirstDigit(character);
    }

    setFirstDigit(character) {
        if (character !== "0") {
            this.currentInput = character;
            this.isInputTouched = true;
        }
    }

    appendNumber(character) {
        if (this.getLastCharacterOfInput() === PARENTHESES.RIGHT) {
            this.currentInput += ` * ${character}`;
        } else if (this.getLastNumberInCurrentInput() !== "0") { 
            this.currentInput += character;
        }
    }

    updateFloatingPoint() {
        if (this.isFloatingPointSet()) {
            this.currentInput = StringUtils.removeTrailingZerosAfterFloatingPoint(this.currentInput);
            this.currentInput = StringUtils.removeInvalidFloatingPointPlacement(this.currentInput);
        }
    }

    handleOperationAppending(character) {
        this.updateFloatingPoint(); 

        if (this.isLastCharacterNegativeNumberSymbol()) {
            return;
        } else if (character === OPERATIONS.SUB && this.isNegativeNumberSymbolPossibleToAppend()) {
            this.appendNegativeNumberSymbol();
        } else if (this.getLastCharacterOfInput() !== PARENTHESES.LEFT) {
            const operationSymbol = this.getOperationSymbol(character);
            this.appendOperationSymbol(operationSymbol);
        }

        if (!this.isInputTouched) { this.isInputTouched = true; }
    }

    isNegativeNumberSymbolPossibleToAppend() {
        return (this.isLastCharacterNonNumber() || !this.isInputTouched) && this.getLastCharacterOfInput() !== PARENTHESES.RIGHT;
    }

    appendNegativeNumberSymbol() {
        this.isInputTouched ? this.currentInput += OPERATIONS.SUB : this.currentInput = OPERATIONS.SUB
        this.lastOperationSymbol = OPERATIONS.SUB;
    }

    appendOperationSymbol(operation) {
        this.currentInput = this.isLastCharacterOperation() ? this.currentInput.slice(0, -this.lastOperationSymbol.length) + operation : this.currentInput + operation;

        this.lastOperationSymbol = operation;
    }

    getOperationSymbol(operation) {
        switch (operation) {
            case OPERATIONS.POW:
            case OPERATIONS.POW_SHORT:
                return "^";
            case OPERATIONS.NTH_ROOT:
            case OPERATIONS.NTH_ROOT_SHORT:
                return "√";
            default:
                return ` ${operation} `;
        }
    }
    
    handleParenthesisAppending(character) {
        if (character === PARENTHESES.LEFT) {
            this.appendLeftParenthesis();
        } else if (character === PARENTHESES.RIGHT) {
            this.appendRightParenthesis();
        }
    }

    appendLeftParenthesis() {
        if (this.isMultiplicationOperatorNeededBeforeLeftParenthesis()) {
            this.handleOperationAppending(OPERATIONS.MUL); 
        }
        this.currentInput += PARENTHESES.LEFT;
        this.isInputTouched = true;
    }

    appendRightParenthesis() {
        if (this.isRightParenthesisPossibleToAppend()) {
            this.updateFloatingPoint();
            this.currentInput += PARENTHESES.RIGHT;
            this.isInputTouched = true;   
        }               
    }

    isMultiplicationOperatorNeededBeforeLeftParenthesis() {
        return !this.isLastCharacterOperation() && this.getLastCharacterOfInput() !== PARENTHESES.LEFT;
    }

    isRightParenthesisPossibleToAppend() {
        return !this.isLastCharacterOperation() && this.getLastCharacterOfInput() !== PARENTHESES.LEFT && this.getParenthesesCount() - 1 >= 0;
    }

    setNumberToFloat() {
        if (!this.isFloatingPointSet()) {
            this.setFloatingPoint();
            this.isInputTouched = true;
        }
    }

    isFloatingPointSet() {
        const lastNumber = this.getLastNumberInCurrentInput()
        return StringUtils.checkForFloatingPointInNumber(lastNumber);
    }

    setFloatingPoint() {
        if (this.getLastCharacterOfInput() === PARENTHESES.RIGHT) {
            this.handleOperationAppending(OPERATIONS.MUL); 
        }
        this.currentInput += this.isLastCharacterNonNumber() ? "0." : ".";
    }

    getLastNumberInCurrentInput() {
        return StringUtils.getNumbersInInput(this.currentInput).pop();
    }

    getParenthesesCount() {
        return StringUtils.getNumberOfOpenedParenthesesInInput(this.currentInput);
    }

    isLastCharacterOperation() {
        return StringUtils.checkForArithmeticalOperation(this.getLastCharacterOfInput())
    }

    isLastCharacterNonNumber() {
        return StringUtils.checkForNonNumberSymbol(this.getLastCharacterOfInput());
    }

    isLastCharacterNegativeNumberSymbol() {
        return this.currentInput.slice(-1) === OPERATIONS.SUB;
    }

    getLastCharacterOfInput() {
        return this.currentInput.trim().slice(-1);
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
        if (this.lastInput !== null) {
            this.currentInput = this.lastInput;
        }

        this.currentInput = this.currentInput.trim().slice(0, -1); 

        this.isLastCharacterOperation() ? this.lastOperationSymbol = this.getOperationSymbol(this.getLastCharacterOfInput()) : this.currentInput = this.currentInput.trim();

        if (this.isCurrentInputInStartingState()) {
            this.setDefault();
        }

        this.resetLastInput();
    }

    isCurrentInputInStartingState() {
        return this.currentInput.length === 0 || (this.currentInput.length === 1 && this.getLastNumberInCurrentInput() === "0") // float -> CE
    }

    isReadyToCalculate() {
        this.updateFloatingPoint();

        if (this.isLastCharacterNonNumber() && this.getLastCharacterOfInput() !== PARENTHESES.RIGHT) {
            return false;
        }

        this.replaceNegativeNumberSymbolsWithMultiplication()        
        this.appendMissingParentheses();
        return true;
    }

    replaceNegativeNumberSymbolsWithMultiplication() {
        const match = this.currentInput.match(/-(?=[\(])/g); 
        
        if (match !== null) {
            this.currentInput = this.currentInput.replace(/-(?=\()/g, "(-1 * (");
        }    
    }

    appendMissingParentheses() {
        let parenthesesCount = this.getParenthesesCount();
        if (parenthesesCount !== 0) {
            this.currentInput += PARENTHESES.RIGHT.repeat(parenthesesCount); 
            parenthesesCount = 0;
        }
    }
}

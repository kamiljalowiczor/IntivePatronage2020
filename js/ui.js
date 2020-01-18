class UI {
    constructor() {
        this.inputEngine = new InputEngine();
        this.parser = new PostfixNotationParser();
        this.mathEngine = new PostfixNotationMathEngine();
        this.currencyEngine = new CurrencyEngine();
        this.calculatorBtns = document.querySelector('.buttons');
        this.inputBar = document.querySelector('.userInput');
        this.resultBar = document.querySelector('.result');
        this.currenciesMenu = document.querySelector('.btn-dropdown');
        this.bidBtn = document.querySelector(".bid");
        this.askBtn = document.querySelector(".ask");
        this.isResultUpdated = false;
    }

    init() {
        this.calculatorBtns.addEventListener('click', (e) => this.onAnyButtonClicked(e));
        
        this.currencyEngine.getAvailableCurrencies()
            .then(data => {
                this.initCurrenciesMenu(data);
            })
            .catch(error => {
                alert("Error occured while fetching currency rates.");
            })
    }

    initCurrenciesMenu(data) {
        data.forEach(currency => {
            this.currenciesMenu.nextElementSibling.innerHTML += `
                <a class="dropdown-item" href="#">${currency.code}</a> 
            `
        });
    }

    resizeInput() {
        if (this.inputBar.value.length > 50) {
            this.inputBar.style.fontSize = "0.8rem";
        } else if (this.inputBar.value.length > 35) {
            this.inputBar.style.fontSize = "1.1rem";
        } else if (this.inputBar.value.length > 20)  {
            this.inputBar.style.fontSize = "1.3rem";
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
        else if (target.classList.contains("dropdown-item")) {
            this.onInputButtonClicked(target, CHAR_TYPES.CURRENCY);
        }
        else if (target.classList.contains("clear")) {
            this.onClearClicked(target);
        }
        else if (target.classList.contains("equals")) {
            this.onEqualsClicked();
        } 
        else if (target.classList.contains("rate")) {
            this.onRateClicked(target);
        }

        this.resizeInput();
    }

    onInputButtonClicked(btn, charType) {
        const character = btn.textContent;
        this.inputEngine.updateInput(character, charType);
        this.inputBar.value = this.inputEngine.currentInput;
        this.isResultUpdated = false;
    }

    onClearClicked(clearBtn) {
        const clearOperation = clearBtn.textContent;
        this.inputEngine.clear(clearOperation);
        this.inputBar.value = this.inputEngine.currentInput;
        this.isResultUpdated = false;
    }

    onEqualsClicked() {
        if (this.isResultUpdated) {
            return;
        }

        this.inputEngine.lastInput = this.inputEngine.currentInput;
        this.resultBar.value = this.inputEngine.isSyntaxCorrect() ? this.getEquationResult() : "Syntax error";

        this.isResultUpdated = true;
    }

    getEquationResult() { 
        this.inputEngine.prepareToCalculate(); 

        const equation = this.parser.getEquationInPostfixNotation(this.inputEngine.currentInput); 
        const equationWithoutCurrencyCodes = this.currencyEngine.convertCurrenciesInEquationArray([...equation]);
        let result = this.mathEngine.calculatePostfixEquation(equationWithoutCurrencyCodes);

        this.parser.setDefault();

        return this.handleResultLogic(result, [...equation]);
    }

    handleResultLogic(result, equation) {
        if (result === 0) { 
            this.inputEngine.isInputTouched = false; 
        }

        if (!isNaN(result) && result !== Infinity) { 
            this.inputEngine.currentInput = `${result}`; 
            
            if (this.isResultInPLN([...equation])) { 
                result += " zł"; 
            }
        }
        return result;
    }

    isResultInPLN(equation) {
        for (let i = 0; i < equation.length; i++) {
            if (StringUtils.checkForCompleteCurrencyValueExpression(equation[i])) {
                return true;
            }
        }
        return false;
    }

    onRateClicked(btn) {
        const rateType = btn.textContent.toLowerCase();

        if (this.isResultUpdated) {
            this.inputEngine.currentInput = this.inputEngine.lastInput;
        }

        if (rateType === RATE_TYPES.BID && !btn.classList.contains("btn-primary")) {
            this.changeRateToBid();
        } 
        else if (rateType === RATE_TYPES.ASK && !btn.classList.contains("btn-primary")) {
            this.changeRateToAsk();
        } 
    }

    changeRateToBid() {
        this.bidBtn.classList.remove("btn-dark");
        this.bidBtn.classList.add("btn-primary");
        this.askBtn.classList.remove("btn-primary");
        this.askBtn.classList.add("btn-dark"); 

        this.currencyEngine.rateType = RATE_TYPES.BID;
        this.isResultUpdated = false;
    }

    changeRateToAsk() {
        this.askBtn.classList.remove("btn-dark");
        this.askBtn.classList.add("btn-primary");
        this.bidBtn.classList.remove("btn-primary");
        this.bidBtn.classList.add("btn-dark");

        this.currencyEngine.rateType = RATE_TYPES.ASK;
        this.isResultUpdated = false;
    }
}
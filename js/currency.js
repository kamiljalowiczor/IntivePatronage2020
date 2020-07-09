class CurrencyEngine {
    constructor() {
        this.url = "http://api.nbp.pl/api/exchangerates/";
        this.currencies = null;
        this.rateType = RATE_TYPES.BID;
    }

    async getAvailableCurrencies() {
        const currenciesResponse = await fetch(`${this.url}/tables/c/?format=json`);
        const currenciesData = await currenciesResponse.json();
        const currencies = currenciesData[0].rates;
        this.currencies = currencies;
        return currencies;
    }

    convertCurrenciesInEquationArray(equationArray) {
        equationArray.forEach((element, index) => {
            if (StringUtils.checkForCompleteCurrencyValueExpression(element)) {
                let value = this.convertCurrency(element);
                equationArray[index] = value;
            }
        });

        return [...equationArray];
    }

    convertCurrency(element) {
        let isValueNegative = false;

        if (element.slice(0, 1) === OPERATIONS.SUB) {
            element = element.slice(1);
            isValueNegative = true;
        }

        const elementCurrencyCode = element.slice(0, 3);
        const amount = element.slice(4, -1);

        const result = this.performCurrencyConversion(elementCurrencyCode, amount);
        
        return isValueNegative ? result * -1 : result * 1;    
    }

    performCurrencyConversion(elementCurrencyCode, amount) {
        for (let i = 0; i < this.currencies.length; i++) {   
            if (this.currencies[i].code === elementCurrencyCode) {
                let rate = this.rateType === RATE_TYPES.BID ? this.currencies[i].bid : this.currencies[i].ask;
                let result = amount * rate;
                return parseFloat(result.toFixed(10)); 
            }
        }   
    }
}
class StringUtils {
    constructor () {}

    static checkForArithmeticalOperation(input) {
        const arithmeticalOperationRe = /[√\^]|([\+\/\-\*]\s*$)/;
        return arithmeticalOperationRe.test(input);
    }

    static checkForNonNumberSymbol(input) {
        const nonNumberRe = /\s*[√\+\/\-\*\^\(\)]\s*/;
        return nonNumberRe.test(input);
    }

    static checkForParentheses(input) {
        const parenthesesRe = /-?\(|\)/;
        return parenthesesRe.test(input);
    }

    static checkForFloatingPointInNumber(input) {
        const floatingPointInNumberRe = /^\d+\.\d*$/;
        return floatingPointInNumberRe.test(input);
    }

    static removeInvalidFloatingPointPlacement(input) {
        if (input.slice(-1) === ".") {
            input = input.slice(0, -1);
        }
        return input;
    }
    
    static removeTrailingZerosAfterFloatingPoint(input) {
        const match = /\.\d+0{0,}$/.exec(input);
        if (match !== null) {
            const matchWithoutTrailingZeros = match[0].replace(/\.?0*$/, '');
            input = input.slice(0, -match[0].length).concat(matchWithoutTrailingZeros);
        }
        return input;
    }

    static removeParenthesesFromString(input) { 
        return input.replace(/[\(\)]/g, "");
    }

    static removeWhitespacesFromString(input) {
        return input.replace(/\s/g, "");
    }

    static getNumberOfOpenedParenthesesInInput(input) {
        const leftParentheses = input.match(/\(/g);
        const rightParentheses = input.match(/\)/g);
        if (leftParentheses !== null && rightParentheses !== null) {
            return leftParentheses.length - rightParentheses.length;
        } else if (leftParentheses !== null) {
            return leftParentheses.length;
        }
        return 0;
    }

    static getNumbersInInput(input) {
        const arithmeticalOperationRe = /\s*[√\+\/\-\*\^]{1}\s*/;
        const inputWithoutParentheses = this.removeParenthesesFromString(input);
        const numbersInInputArray = inputWithoutParentheses.split(arithmeticalOperationRe);
        return numbersInInputArray;
    }
}
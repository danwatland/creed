const getParameterName = /\(([^)]+)\)/;
const functionInfoRegex = '\.((?:(?! ).)*) (===|!==|>|>=|<|<=) ([\'\"]?[a-zA-Z0-9]+[\'\"]?)';
const getFunctionInfo = (parameterName) => new RegExp(`${parameterName}${functionInfoRegex}`);

export class Model {
    constructor(options) {

    }

    map(selector) {
        const selectorString = selector.toString();
        const parameterName = getParameterName.exec(selectorString)[1];
        const fieldName = new RegExp(`${parameterName}\\.((?:(?![,;]).)*)`, 'gm')[Symbol.match](selectorString);

        return fieldName;
    }

    where(predicate, context = {}) {
        const predicateString = predicate.toString();
        const parameterName = getParameterName.exec(predicateString)[1];

        const functionInfo = getFunctionInfo(parameterName).exec(predicateString);


        return {
            columnName: functionInfo[1],
            operator: functionInfo[2],
            testValue: new Function('with(this) return ' + functionInfo[3]).call(context)
        };
    }
}

// function someFunc(a) {
//     return a.field === 1;
// }
//
// const someOtherFunc = (a) => a.field === 1;

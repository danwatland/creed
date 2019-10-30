const getParameterName = /\(([^)]+)\)/;
const functionInfoRegex = '\.((?:(?! ).)*) (===|!==|>|>=|<|<=) ([\'\"]?[a-zA-Z0-9]+[\'\"]?)';
const getFunctionInfo = (parameterName) => new RegExp(`${parameterName}${functionInfoRegex}`);

export class Query {
    constructor(modelType) {
        this.modelType = modelType;
    }

    select(selector) {
        const selectorString = selector.toString();
        const parameterName = getParameterName.exec(selectorString)[1];
        const fieldNameRegex = new RegExp(`${parameterName}\\.((?:(?![,;]).)*)`, 'gm');

        let fieldNames = [];
        let fieldName = fieldNameRegex.exec(selectorString);

        while (fieldName !== null) {
            fieldNames.push(fieldName[1]);
            fieldName = fieldNameRegex.exec(selectorString);
        }

        this.fieldNames = fieldNames;
        return this;
    }

    where(predicate, context = {}) {
        const predicateString = predicate.toString();
        const parameterName = getParameterName.exec(predicateString)[1];

        const functionInfo = getFunctionInfo(parameterName).exec(predicateString);

        this.whereClause = {
            columnName: functionInfo[1],
            operator: functionInfo[2],
            testValue: new Function('with(this) return ' + functionInfo[3]).call(context)
        };

        return this;
    }
}
/* Framework validator.
 * PARAMETERS :
 *  > type              Validator type based on the following list.
 *                       MANDATORY      : Mandatory
 *                       MINLENGTH      : Minimum string length [int min]
 *                       MAXLENGTH      : Maximum string length [int max]
 *                       INTLENGTH      : Intermediate string length [int min, int max]
 *                       ALPHA          : Only alphabetic characters []
 *                       ALPHANUMERIC   : Only alphabetic and numeric characters []
 *                       ALPHAEXTENDED  : Only alphabetic, numeric and ponctuation characters []
 *                       NUMERIC        : Numeric string []
 *                       NUMERICPOS     : Positive numeric string []  
 *                       NUMERICMIN     : Numeric minimum [int min]   
 *                       NUMERICMAX     : Numeric maximum [int max]                                      
 *  > parameters        Validator parameters.                                   
 *  > violation         Violation message, including wildcards ($param$).       */

function Validator(type, parameters, violation) {
    switch (type) {
        case "MANDATORY":
            break;
        case "MINLENGTH": 
            Toolkit.checkTypeOf(parameters.min, "number");
            break;
        case "MAXLENGTH": 
            Toolkit.checkTypeOf(parameters.max, "number");
            break;
        case "INTLENGTH":
            Toolkit.checkTypeOf(parameters.min, "number");
            Toolkit.checkTypeOf(parameters.max, "number");
            break;
        case "ALPHA": break;
        case "ALPHANUMERIC": break;
        case "ALPHAEXTENDED": break;
        case "EMAIL": break;
        case "NUMERIC": break;
        case "NUMERICPOS": break;
        case "NUMERICMIN": 
            Toolkit.checkTypeOf(parameters.min, "number");
            break;
        case "NUMERICMAX": 
            Toolkit.checkTypeOf(parameters.max, "number");
            break;
        default: 
            var p = {
                type: type
            };
            throw new Error("cpn", 24, p);
    }
    
    
    this.type = type;
    this.parameters = parameters;
    this.message = this.report(violation);
}
/* Validator type. */
Validator.prototype.getType = function() {
    return this.type;
};
/* Validator parameters. */
Validator.prototype.getParameters = function() {
    return this.parameters;
};
/* Validtor.
 * Checks a value for the current validator.
 * PARAMETERS :
 *  > value         Checked value.
 * RETURN :
 *  true if validation successfull, false else.                              */
Validator.prototype.validate = function(value) {
    try {
        switch (this.type) {
            case "MANDATORY":
                return value.length > 0;
            case "MINLENGTH":
                return value.length >= this.parameters.min;
            case "MAXLENGTH":
                return value.length <= this.parameters.max;
            case "INTLENGTH":
                return value.length >= this.parameters.min && value.length <= this.parameters.max;
            case "ALPHA":
                return /[A-Za-z]/.test(value);
            case "ALPHANUMERIC":
                return /[A-Za-z0-9]/.test(value);
            case "ALPHAEXTENDED":
                return /[A-Za-z0-9,.:;!\?]/.test(value);
            case "EMAIL":
                return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value);
            case "NUMERIC":
                return parseInt(value).toString() !== "NaN";
            case "NUMERICPOS":
                return parseInt(value).toString() !== "NaN" && parseInt(value) > 0;
            case "NUMERICMIN":
                return parseInt(value).toString() !== "NaN" && parseInt(value) >= parameters.min;
            case "NUMERICMAX":
                return parseInt(value).toString() !== "NaN" && parseInt(value) <= parameters.max;
        }
        ;
    } catch (e) {
        return false;
    }
};
/* Violation message generator.
 * Completes the violation message.
 * PARAMETERS :
 *  > message           Violation message.
 * RETURNS :
 *  Enriched violation message.                                             */
Validator.prototype.report = function(message) {
    var i, j, buff;
    i = message.indexOf("$");
    while (i !== -1) {
        j = message.indexOf("$", i + 1);
        if (j === -1) {
            return message;
        } else {
            buff = message.substring(i, j + 1);
            if (Toolkit.isNull(this.parameters[buff.replace(/\$/g, "")])) {
                var p = {
                    variable: buff.replace(/\$/g, ""),
                    type: this.type,
                    message: message
                };
                throw new Error("cpn", 25, p);
            }
            message = message.replace(buff, this.parameters[buff.replace(/\$/g, "")]);
        }
        i = message.indexOf("$");
    }
    return message;
};
/* Message */
Validator.prototype.getMessage = function() {
    return this.message;
};


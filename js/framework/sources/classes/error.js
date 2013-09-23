/* Throwable framework error. 
 * PARAMETERS :
 *  > context       Error context.
 *                  Has to match catalog name on treatment.
 *  > code          Error code.
 *  > params        Error parameters.
 *  > cause         Error cause.                                                */

function Error(context, code, params, cause) {
    if (typeof(context) !== "string" || typeof(code) !== "number") {
        context = "core";
        code = 0;
        params = null;
        cause = null;
    };
    
    this.context = context;
    this.code = code;
    this.params = params;
    this.cause = cause;
    this.stack = printStackTrace();
}
/* Error context */
Error.prototype.getContext = function() {
    return this.context;
};
/* Error code */
Error.prototype.getCode = function() {
    return this.code;
};
/* Error params */
Error.prototype.getParams = function() {
    return this.params;
};
Error.prototype.getParam = function(i) {
    return this.params[i].toString();
};
/* Error cause */
Error.prototype.getCause = function() {
    return this.cause;
};
/* Stack */
Error.prototype.getStack = function() {
    return this.stack;
};
Error.prototype.setStack = function(e) {
    this.stack = printStackTrace({e: e});
};
/* Error ID.
 * RETURNS : error full ID.                                                 */
Error.prototype.getID = function() {
    return  Toolkit.leadingChars(this.code, 4, "0") +
            "@" +
            Toolkit.followingChars(this.context.toUpperCase(), 8, ".");
};
/* Error causes hierarchy length.
 * PARAMETERS : N/A
 * RETURNS :
 *  Hierarchy size.                                                         */
Error.prototype.getCauseLength = function() {
    var i = 0;
    var buff = this.getCause();
    while (buff instanceof Error) {
        i++;
        buff = buff.getCause();
    }
    return i;
};
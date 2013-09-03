/* Framework component method.
 * Memorize a callable function, caracterized by a name and a list of necessary
 * arguments.
 * PARAMETERS :
 *  > ref                   Method reference.
 *  > name                  Method name.                                        
 *  > rw                    Rewritable method (yes if true).                    */

function Method(ref, name, rw, interface) {
    Toolkit.checkTypeOf(ref, "function");
    Toolkit.checkTypeOf(name, "string");
    Toolkit.checkTypeOf(rw, "boolean");
    
    this.reference = ref;
    this.name = name;
    this.rw = rw;
    this.interface = interface;
    this.context;
}
/* Reference */
Method.prototype.getReference = function() {
    return this.reference;
};
/* Name */
Method.prototype.getName = function() {
    return this.name;
};
/* Interface */
Method.prototype.hasInterface = function() {
    return !Toolkit.isNull(this.interface);
};
Method.prototype.getInterface = function() {
    return this.interface;
};
Method.prototype.setInterface = function(interface) {
    this.interface = interface;
}; 
/* Context */
Method.prototype.getContext = function() {
    return this.context;
};
Method.prototype.setContext = function(context) {
    Toolkit.checkClassOf(context, Component);

    this.context = context;
};
/* Rewritable */
Method.prototype.isRewritable = function() {
    return this.rw;
};
/* Comparator */
Method.prototype.equals = function(method) {
    if (method.hasInterface()) {
        return this.hasInterface() && method.getName() === this.getName() && method.getInterface() === this.getInterface();
    } else {
        return !this.hasInterface() &&  method.getName() === this.getName();
    }
};
/* Method call.
 * PARAMETERS :
 *  > params                Parameters as array.
 * RETURNS :
 *  Implemented function result.                                            */
Method.prototype.call = function(params) {
    try {
        if (Toolkit.isNull(params)) {
            params = [];
        }
        if (this.hasInterface()) {
            for (var i = params.length; i > 0; i--) {
                params[i] = params[i - 1];
            }
            params[0] = this.getContext().getInterfaceData(this.interface);
        }
        return this.getReference().apply(this.context, params);
    } catch (e) {
        var p = {
            name: this.name,
            interface: this.interface,
            context: this.context,
            params: params
        };
        throw new Error("cpn", 1, p, e);
    }
};
/* Interface.
 * Allow defining one or multiple registered methods (with commun instanciation)
 * for a given component and setup.
 * PARAMETERS :
 *  > name                      Interface name.
 *  > setup                     Interface setup.                                */

function Interface(name, setup) {
    Toolkit.checkTypeOf(name, "string");
    Toolkit.checkTypeOf(setup, "object");
    
    this.name = name;
    this.setup = setup;
    this.methods = [];
}
/* Name. */
Interface.prototype.getName = function() {
    return this.name;
};
/* Setup. */
Interface.prototype.getSetup = function() {
    return this.setup;
};
/* Methods. */
Interface.prototype.getMethods = function() {
    return this.methods;
};
Interface.prototype.addMethod = function(method) {
    Toolkit.checkClassOf(method, Method);
    this.methods[this.methods.length] = method;
};
Interface.prototype.registerMethod = function(ref, name, rw) {
    var m = new Method(ref, name, rw);
    this.addMethod(m);
};


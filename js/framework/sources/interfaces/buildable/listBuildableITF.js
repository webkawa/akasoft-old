/* List buildable interface.
 * Allow list generation trough an external-defined repeater.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.mode              * Injection mode (1: array; 2: XML)
 *  > setup.buffer            * Data buffer.
 *  > setup.add               * Adding method name.
 *  > setup.addITF              Adding method interface.
 *  > setup.wrapper           * List wrapper selector.
 *  > setup.size                Maximum list size.
 *  > setup.init                Initial data.                                   */

function ListBuildableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.mode, "number");
    Toolkit.checkTypeOf(setup.buffer, "string");
    Toolkit.checkTypeOf(setup.wrapper, "string");
    Toolkit.checkTypeOf(setup.add, "string");
    if(Toolkit.isNull(setup.size)) {
        setup.size = 256;
    }
    
    cpn.registerMethod(this.prototype.init, "init", false);
    cpn.registerMethod(this.prototype.inject, "inject", false);
    cpn.registerMethod(this.prototype.injectArray, "injectArray", false);
    cpn.registerMethod(this.prototype.injectXML, "injectXML", false);
    cpn.registerMethod(this.prototype.refresh, "refresh", false);
    cpn.registerMethod(this.prototype.clear, "clear", false);
}
/* Name. */
ListBuildableITF.prototype.name = "ListBuildable";
/* Initialization. */
ListBuildableITF.prototype.init = function(setup) {
    if (!Toolkit.isNull(setup.init)) {
        this.getMethod("inject", "ListBuildable").call();
    }
};
/* Auto injection. */
ListBuildableITF.prototype.inject = function(setup) {
    if (setup.mode === 1) {
        this.getMethod("injectArray", "ListBuildable").call();
    } else if (setup.mode === 2) {
        this.getMethod("injectXML", "ListBuildable").call();
    }
};
/* Array injection. */
ListBuildableITF.prototype.injectArray = function(setup) {
    var m = this.getMethod(setup.add, setup.addITF);
    var s = this.qs(setup.wrapper);
    
    for (var i = 0; i < this[setup.buffer].length && i < setup.size ; i++) {
        $(s).append(m.call([this[setup.buffer][i]]));
    }
};
/* XML injection. */
ListBuildableITF.prototype.injectXML = function(setup) {
    var m = this.getMethod(setup.add, setup.addITF);
    var s = this.qs(setup.wrapper);
    
    $(this[setup.buffer]).each(function(i) {
        if (i < setup.size) {
            $(s).append(m.call([this]));
        }
    });
};
/* List refreshing. */
ListBuildableITF.prototype.refresh = function(setup) {
    this.getMethod("clear", "ListBuildable").call();
    this.getMethod("inject", "ListBuildable").call([this[setup.buffer]]);
};
/* List clearing. */
ListBuildableITF.prototype.clear = function(setup) {
    this.qs(setup.wrapper, "*").remove();
};
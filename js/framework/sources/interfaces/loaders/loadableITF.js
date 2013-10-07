/* Loadable interface.
 * Proceed synchronous pre-loading of one or multiple elements.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.load              * Loaded components selectors (as array).
 *  > setup.callbacks           Callbacks as array.
 *  > setup.state               Return state.                                   */

function LoadableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.load, "string");
    if (Toolkit.isNull(setup.callbacks)) {
        Toolkit.checkTypeOf(setup.state, "string");
    }
    
    cpn.registerMethod(LoadableITF.prototype.check, "check", false);
    cpn.registerMethod(LoadableITF.prototype.load, "load", false);
    cpn.registerMethod(LoadableITF.prototype.execute, "execute", false);
}
/* Name. */
LoadableITF.prototype.name = "Loadable";
/* Checker. */
LoadableITF.prototype.check = function(setup) {
    this.load_count++;
    
    if (this.load_count === this.load_length) {
        this.qs(setup.load).removeClass("displayNone").unbind("load");
        this.getMethod("execute", "Loadable").call([]);
    }
};
/* Starter. */
LoadableITF.prototype.load = function(setup) {
    this.register("load_count", 0, true);
    this.register("load_length", this.qs(setup.load).length, true);
    
    var ctx = this;
    this.qs(setup.load).addClass("displayNone").load(function() {
        ctx.getMethod("check", "Loadable").call([]);
    }).each(function() {
        if(this.complete) {
            $(this).trigger('load');
        }
    });
    if (this.load_targets === 0) {
        this.getMethod("execute", "Loadable").call([]);
    }
};
/* Execution. */
LoadableITF.prototype.execute = function(setup) {
    for (var i = 0; !Toolkit.isNull(setup.callbacks) && i < setup.callbacks.length; i++) {
        this.getMethod(setup.callbacks[i].call, setup.callbacks[i].interface).call([]);
    }
    if (!Toolkit.isNull(setup.state)) {
        this.go(setup.state);
    }
};
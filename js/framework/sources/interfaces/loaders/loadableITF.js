/* Loadable interface.
 * Proceed synchronous pre-loading of one or multiple elements.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.load              * Loaded components selectors (as array).
 *  > setup.callbacks           Callbacks as array.
 *  > setup.state             * Return state.                                   */

function LoadableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.load, "object");
    Toolkit.checkTypeOf(setup.state, "string");
    
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
        for (var i = 0; i < this.load_length; i++) {
            this.qs(setup.load[i]).unbind("load");
            this.qs(setup.load[i]).removeClass("displayNone");
        }
        this.getMethod("execute", "Loadable").call([]);
    }
};
/* Starter. */
LoadableITF.prototype.load = function(setup) {
    this.register("load_count", 0, true);
    this.register("load_length", setup.load.length, true);
    this.register("load_targets", 0, true);
    
    var ctx = this;
    for (var i = 0; i < this.load_length; i++) {
        this.qs(setup.load[i]).addClass("displayNone");
        this.qs(setup.load[i]).load(function() {
            ctx.getMethod("check", "Loadable").call([]);
        }).each(function() {
            ctx.load_targets++;
            if(this.complete) {
                $(this).trigger('load');
            }
        });
    }
    if (this.load_targets === 0) {
        this.getMethod("execute", "Loadable").call([]);
    }
};
/* Execution. */
LoadableITF.prototype.execute = function(setup) {
    for (var i = 0; !Toolkit.isNull(setup.callbacks) && i < setup.callbacks.length; i++) {
        this.getMethod(setup.callbacks[i].call, setup.callbacks[i].interface).call([]);
    }
    this.go(setup.state);
};
/* Loadable interface.
 * Proceed synchronous pre-loading of one or multiple elements.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.load              * Loaded components selectors (as array).
 *  > setup.back              * Return state.                                   */

function LoadableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.load, "object");
    Toolkit.checkTypeOf(setup.back, "string");
    
    cpn.registerMethod(LoadableITF.prototype.check, "check", false);
    cpn.registerMethod(LoadableITF.prototype.load, "load", false);
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
        this.go(setup.back);
    }
};
/* Starter. */
LoadableITF.prototype.load = function(setup) {
    this.register("load_count", 0, true);
    this.register("load_length", setup.load.length, true);
    
    var ctx = this;
    for (var i = 0; i < this.load_length; i++) {
        this.qs(setup.load[i]).addClass("displayNone");
        this.qs(setup.load[i]).load(function() {
            ctx.getMethod("check", "Loadable").call([]);
        }).each(function() {
            if(this.complete) {
                $(this).trigger('load');
            }
        });
    }
};
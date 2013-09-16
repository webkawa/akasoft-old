/* Hoverable interface.
 * Manages mouse hover check in case of premature exit.
 * PARAMETERS :
 *  > cpn                         * Owner component.
 *  > setup.target                * Monitored area.
 *  > setup.state                 * Return state.
 *  > setup.callback                Return callback.
 *  > setup.callbackITF             Return callback interface.                   */

function HoverableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.target, "string");
    Toolkit.checkTypeOf(setup.state, "string");
    
    cpn.registerMethod(HoverableITF.prototype.init, "init", false);
    cpn.registerMethod(HoverableITF.prototype.start, "start", false);
    cpn.registerMethod(HoverableITF.prototype.check, "check", false);
    cpn.registerMethod(HoverableITF.prototype.back, "back", false);
};
/* Name. */
HoverableITF.prototype.name = "Hoverable";
/* Initialization. */
HoverableITF.prototype.init = function(setup) {
    var ctx = this;
    
    this.register("hoverable_ignore", false, true);
    this.register("hoverable_targets", this.qs(setup.target).add(this.qs(setup.target).find("*")));
    this.register("hoverable_in", function(evt) {
        ctx.register("hoverable_ignore", true, true);
        ctx.register("hoverable_back", false, true);
    });
    this.register("hoverable_out", function() {
        if (!ctx.hoverable_ignore) {
            ctx.register("hoverable_back", true, true);
            ctx.getMethod("check", "Hoverable").call([]);
        } else {
            ctx.register("hoverable_ignore", false, true);
        }
    });
};
/* Starter. */
HoverableITF.prototype.start = function() {
    this.register("hoverable_back", false, true);
    
    $(this.hoverable_targets).bind("mousemove", this.hoverable_in);
    $("body").bind("mousemove", this.hoverable_out);
};
/* Check. */
HoverableITF.prototype.check = function() {
    if (this.hoverable_back) {
        this.getMethod("back", "Hoverable").call([]);
    }
};
/* Back. */
HoverableITF.prototype.back = function(setup) {
    if (this.getStatus() === 0) {
        $(this.hoverable_targets).unbind("mousemove", this.hoverable_in);
        $("body").unbind("mousemove", this.hoverable_out);
        
        if (!Toolkit.isNull(setup.callback)) {
            this.getMethod(setup.callback, setup.callbackITF).call([]);
        }
        this.go(setup.state);
    }
};
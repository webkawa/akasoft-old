/* Hoverable interface.
 * Manages mouse hover check in case of premature exit.
 * PARAMETERS :
 *  > cpn                         * Owner component.
 *  > setup.openState             * Open state.
 *  > setup.openCallback            Open callback.
 *  > setup.openCallbackITF         Open callback interface.                    
 *  > setup.closeState            * Close state.
 *  > setup.closeCallback           Close callback.
 *  > setup.closeCallbackITF        Close callback interface.                    */

function HoverableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.openState, "string");
    Toolkit.checkTypeOf(setup.closeState, "string");
    
    cpn.registerMethod(HoverableITF.prototype.enter, "enter", false);
    cpn.registerMethod(HoverableITF.prototype.leave, "leave", false);
};
/* Name. */
HoverableITF.prototype.name = "Hoverable";
/* Switch */
HoverableITF.prototype.enter = function(setup) {
    if (!Toolkit.isNull(setup.openCallback)) {
        this.getMethod(setup.openCallback, setup.openCallbackITF).call([]);
    }
    this.go(setup.openState);
};
HoverableITF.prototype.leave = function(setup) {
    if (!Toolkit.isNull(setup.closeCallback)) {
        this.getMethod(setup.closeCallback, setup.closeCallbackITF).call([]);
    }
    this.go(setup.closeState);
};
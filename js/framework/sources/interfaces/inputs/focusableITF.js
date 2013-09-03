/* Focusable interface.
 * Manages focus check in case of quick user changes.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.field             * Field selector.
 *  > setup.stateFocus        * Focused state.
 *  > setup.stateBlur           Blured state.
 *  > setup.callbackFocus       Focus callback.
 *  > setup.callbackFocusITF    Focus callback interface.
 *  > setup.callbackBlur        Blur callback.
 *  > setup.callbackBlurITF     Blur callback interface.                        */

function FocusableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.field, "string");
    Toolkit.checkTypeOf(setup.stateFocus, "string");
    Toolkit.isNull(setup.stateBlur) ?
        Toolkit.checkTypeOf(setup.callbackBlur, "string") :
        Toolkit.checkTypeOf(setup.stateBlur, "string");

    cpn.registerMethod(this.prototype.check, "check", false);
}
/* Name. */
FocusableITF.prototype.name = "Focusable";
/* Focus check. */
FocusableITF.prototype.check = function(setup) {
    var f = $(":focus()");
    if (this.getState() !== setup.stateFocus && this.qs(setup.field).is(f)) {
        Toolkit.isNull(setup.callbackFocus) ?
            this.go(setup.stateFocus) :
            this.getMethod(setup.callbackFocus, setup.callbackFocusITF).call();
        return;
    }
    if (this.getState() === setup.stateFocus && !this.qs(setup.field).is(f)) {
        Toolkit.isNull(setup.callbackBlur) ?
            this.go(setup.stateBlur) :
           this.getMethod(setup.callbackBlur, setup.callbackBlurITF).call();
    }
};
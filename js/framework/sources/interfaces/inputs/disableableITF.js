/* Disableable interface.
 * Allow enabling/disabling control on a input field.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.field             * Field selector.                                 */

function DisableableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.field, "string");

    cpn.registerMethod(this.prototype.on, "on", false);
    cpn.registerMethod(this.prototype.off, "off", false);
}
/* Name. */
DisableableITF.prototype.name = "Disableable";
/* Disable. */
DisableableITF.prototype.on = function(setup) {
    this.qs(setup.field).attr("disabled", "disabled");
};
/* Enable. */
DisableableITF.prototype.off = function(setup) {
    this.qs(setup.field).removeAttr("disabled");
};

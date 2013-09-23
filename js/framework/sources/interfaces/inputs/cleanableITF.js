/* Cleanable interface.
 * Manages facultative cleaning of an input field.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.field             * Field selector.
 *  > setup.execute           * Execute cleaning (true/false).                  */

function CleanableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.field, "string");
    if (Toolkit.isNull(setup.execute)) {
        setup.execute = false;
    }

    cpn.registerMethod(this.prototype.execute, "do", true);
}
/* Name. */
CleanableITF.prototype.name = "Cleanable";
/* Field cleaning. */
CleanableITF.prototype.execute = function(setup) {
    if (setup.execute || Toolkit.isNull(setup.execute)) {
        this.qs(setup.field).val("");
    }
};

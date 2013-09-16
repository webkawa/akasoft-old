/* Input buildable interface.
 * Allow classic input initialization, following a given ID and default value.
 * PARAMETERS :
 *  > cpn                 * Owner component.
 *  > setup.id            * Tagged ID.
 *  > setup.value           Default value.
 *  > setup.selectLabel     Label selector.
 *  > setup.selectField   * Field selector.                                     */

function InputBuildableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.id, "string");
    Toolkit.checkTypeOf(setup.selectField, "string");
    
    cpn.registerMethod(this.prototype.build, "initBuild", false);
}
/* Name. */
InputBuildableITF.prototype.name = "InputBuildable";
/* Describable build. */
InputBuildableITF.prototype.build = function(setup) {
    this.qs(setup.selectLabel).attr("for", setup.id);
    this.qs(setup.selectField).attr("id", setup.id);
    this.qs(setup.selectField).attr("name", setup.id);

    if (!Toolkit.isNull(setup.value)) {
        var sf = this.qs(setup.selectField);

        if (sf.is("input")) {
            sf.attr("value", setup.value);
            sf.text(setup.value);
        } else if (sf.is("select")) {
            sf.attr("value", setup.value);
        }
    }
};
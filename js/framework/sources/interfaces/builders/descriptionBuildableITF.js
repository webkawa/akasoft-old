/* Description buildable interface.
 * Allow simple building of a label (title) and a description (text) for the 
 * component.
 * PARAMETERS :
 *  > cpn                         * Owner component.
 *  > setup.selectTitle             Label selector.
 *  > setup.selectText              Descritpion selector.
 *  > setup.dataTitle               Label data.
 *  > setup.dataText                Description data.                           */

function DescriptionBuildableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.selectTitle, "string");
    Toolkit.checkTypeOf(setup.selectText, "string");
    
    cpn.registerMethod(this.prototype.init, "init", false);
}
/* Name. */
DescriptionBuildableITF.prototype.name = "DescriptionBuildable";
/* Initialization. */
DescriptionBuildableITF.prototype.init = function(setup) {
    Toolkit.isNull(setup.dataTitle) ?
        this.qs(setup.selectTitle).remove() :
        this.qs(setup.selectTitle).text(setup.dataTitle);
    Toolkit.isNull(setup.dataText) ?
        this.qs(setup.selectText).remove() :
        this.qs(setup.selectText).text(setup.dataText);
}
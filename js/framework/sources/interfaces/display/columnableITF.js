/* Columnable interface.
 * Allow automatic resizing of an equal-width list of columns.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.container         * Columns container.
 *  > setup.columns             Columns list (container childrens if undefined). */

function ColumnableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.container, "string");
    
    cpn.registerMethod(ColumnableITF.prototype.refresh, "refresh", false);
}
/* Name. */
ColumnableITF.prototype.name = "Columnable";
/* Global refreshing. */
ColumnableITF.prototype.refresh = function(setup) {
    var container = this.qs(setup.container);
    var columns = $(container).children();
    
    if (!Toolkit.isNull(setup.columns)) {
        columns = this.qs(setup.columns);
    }
    
    var cnum = 0;
    $(columns).each(function() {
        if ($(this).attr("class").indexOf("2cols") !== -1) {
            cnum += 2;
        } else if ($(this).attr("class").indexOf("3cols") !== -1) {
            cnum += 3;
        } else if ($(this).attr("class").indexOf("4cols") !== -1) {
            cnum += 4;
        } else {
            cnum += 1;
        }
    });
    
    var cw = $(container).width() / cnum;
    $(columns).each(function() {
        var w;
        if ($(this).attr("class").indexOf("2cols") !== -1) {
            w = cw * 2;
        } else if ($(this).attr("class").indexOf("3cols") !== -1) {
            w = cw * 3;
        } else if ($(this).attr("class").indexOf("4cols") !== -1) {
            w = cw * 4;
        } else {
            w = cw;
        }
        $(this).css("width", Math.floor(w - $(this).outerWidth(true) - $(this).width()) + "px");
    });
};
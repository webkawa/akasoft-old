/* Columnable interface.
 * Allow automatic resizing of an equal-width list of columns.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.container         * Columns container.
 *  > setup.columns             Columns list (container childrens if undefined).
 *  > setup.apply               Auto-apply classes (true by default).
 *  > setup.classFirst          First column classes.
 *  > setup.classLast           Last column classes.
 *  > setup.classFirstExcept    First-excepted column classes.
 *  > setup.classLastExcept     Last-excepted column classes.                   */

function ColumnableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.container, "string");
    
    cpn.registerMethod(ColumnableITF.prototype.init, "init", false);
    cpn.registerMethod(ColumnableITF.prototype.target, "target", false);
    cpn.registerMethod(ColumnableITF.prototype.apply, "apply", false);
    cpn.registerMethod(ColumnableITF.prototype.refresh, "refresh", false);
}
/* Name. */
ColumnableITF.prototype.name = "Columnable";
/* Initialization. */
ColumnableITF.prototype.init = function(setup) {
    this.getMethod("target", "Columnable").call([]);
    if (Toolkit.isNull(setup.apply) || setup.apply) {
        this.getMethod("apply", "Columnable").call([]);
    }
    $(this.columns).addClass("floatLeft");
};
/* Columns refreshing. */
ColumnableITF.prototype.target = function(setup) {
    var columns = this.qs(setup.container).children();
    if (!Toolkit.isNull(setup.columns)) {
        columns = this.qs(setup.columns);
    }
    this.register("columns", columns, true);
};
/* Styles refreshing. */
ColumnableITF.prototype.apply = function(setup) {
    $(this.columns).filter(":first()").addClass(setup.classFirst);
    $(this.columns).filter(":last()").addClass(setup.classLast);
    $(this.columns).filter(":not(:first())").addClass(setup.classFirstExcept);
    $(this.columns).filter(":not(:last())").addClass(setup.classLastExcept);
};
/* Global refreshing. */
ColumnableITF.prototype.refresh = function(setup) {
    var container = this.qs(setup.container);
    
    var cnum = 0;
    $(this.columns).each(function() {
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
    $(this.columns).each(function() {
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
        Toolkit.absRealWidth(this, Math.floor(w));
    });
};
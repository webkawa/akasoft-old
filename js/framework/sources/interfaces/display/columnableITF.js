/* Columnable interface.
 * Allow automatic resizing of an equal-width list of columns.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.containers        * Columns container(s).
 *  > setup.apply               Auto-apply classes (true by default).
 *  > setup.classFirst          First column classes.
 *  > setup.classLast           Last column classes.
 *  > setup.classFirstExcept    First-excepted column classes.
 *  > setup.classLastExcept     Last-excepted column classes.                   */

function ColumnableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.containers, "string");
    
    cpn.registerMethod(ColumnableITF.prototype.apply, "apply", false);
    cpn.registerMethod(ColumnableITF.prototype.refresh, "refresh", false);
}
/* Name. */
ColumnableITF.prototype.name = "Columnable";
/* Global refreshing. */
ColumnableITF.prototype.refresh = function(setup) {
    var ctx = this;
    this.qs(setup.containers).each(function() {
        var container = $(this);
        var columns = $(this).children();
        
        if (Toolkit.isNull(setup.apply) || setup.apply) {
            ctx.getMethod("apply", "Columnable").call([]);
        }
        $(columns).addClass("floatLeft");

        var cnum = 0;
        $(columns).each(function() {
            if ($(this).hasClass("2cols")) {
                cnum += 2;
            } else if ($(this).hasClass("3cols")) {
                cnum += 3;
            } else if ($(this).hasClass("4cols")) {
                cnum += 4;
            } else {
                cnum += 1;
            }
        });

        var cw = $(container).width() / cnum;
        $(columns).each(function() {
            var w;
            if ($(this).hasClass("2cols")) {
                w = cw * 2;
            } else if ($(this).hasClass("3cols")) {
                w = cw * 3;
            } else if ($(this).hasClass("4cols")) {
                w = cw * 4;
            } else {
                w = cw;
            }
            Toolkit.absRealWidth(this, Math.floor(w));
        });
    });
};
/* Styles refreshing. */
ColumnableITF.prototype.apply = function(setup) {
    this.qs(setup.containers).each(function() {
        var columns = $(this).children();
        $(columns).filter(":first()").addClass(setup.classFirst);
        $(columns).filter(":last()").addClass(setup.classLast);
        $(columns).filter(":not(:first())").addClass(setup.classFirstExcept);
        $(columns).filter(":not(:last())").addClass(setup.classLastExcept);
    });
};
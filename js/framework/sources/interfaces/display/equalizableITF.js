/* Equalizable interface.
 * Allow automatic width and/or height equalizing of a list of items.
 * PARAMETERS :
 *  > cpn                         * Owner component.
 *  > setup.containers              Targets container(s).
 *  > setup.childs                  Targets childs (as array).
 *  > setup.doWidth                 Width maximizing (false by default).
 *  > setup.doHeight                Height maximizing (true by default).        */

function EqualizableITF(cpn, setup) {
    cpn.registerMethod(EqualizableITF.prototype.refresh, "refresh", false);
    cpn.registerMethod(EqualizableITF.prototype.refreshSet, "refreshSet", false);
}
/* Name. */
EqualizableITF.prototype.name = "Equalizable";
/* Global refreshing. */
EqualizableITF.prototype.refresh = function(setup, targets) {
    var m = this.getMethod("refreshSet", "Equalizable");
    if (!Toolkit.isNull(setup.containers)) {
        this.qs(setup.containers).each(function() {
            m.call([$(this).children()]);
        });
    }
    for (var i = 0; !Toolkit.isNull(setup.childs) && i < setup.childs.length; i++) {
        m.call([this.qs(setup.childs[i])]);
    }
    for (var i = 0; !Toolkit.isNull(targets) && i < targets.length; i++) {
        m.call([targets[i]]);
    }
};
/* Local refreshing. */
EqualizableITF.prototype.refreshSet = function(setup, targets) {
    if (Toolkit.isNull(setup.doHeight) || setup.doHeight) {
        var maxOH = 0;
        $(targets).each(function() {
            if ($(this).outerHeight(true) > maxOH) {
                maxOH = $(this).outerHeight(true);
            }
        });
        Toolkit.absRealHeight(targets, maxOH);
    }

    if (setup.doWidth) {
        var maxOW = 0;
        $(targets).each(function() {
            if ($(this).outerWidth(true) > maxOW) {
               maxOW = $(this).outerWidth(true);
           }
        });
        Toolkit.absRealWidth(targets, maxOW);
    }
};
/* Equalizable interface.
 * Allow automatic width and/or height equalizing of a list of items.
 * PARAMETERS :
 *  > cpn                         * Owner component.
 *  > setup.targets[i].container    Targets container (has to be defined if childs are not).
 *  > setup.targets[i].childs       Targets list (container childrens if undefined).
 *  > setup.doWidth                 Width maximizing (false by default).
 *  > setup.doHeight                Height maximizing (true by default).        */

function EqualizableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.targets, "object");
    
    cpn.registerMethod(EqualizableITF.prototype.refresh, "refresh", false);
}
/* Name. */
EqualizableITF.prototype.name = "Equalizable";
/* Global refreshing. */
EqualizableITF.prototype.refresh = function(setup) {
    for (var i = 0; i < setup.targets.length; i++) {
        if (Toolkit.isNull(setup.targets[i].container)) {
            Toolkit.checkTypeOf(setup.targets[i].childs, "string");
        }
        
        var targets;
        if (!Toolkit.isNull(setup.targets[i].container)) {
            targets = $(this.qs(setup.targets[i].container)).children();
        }
        if (!Toolkit.isNull(setup.targets[i].childs)) {
            targets = this.qs(setup.targets[i].childs);
        }

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
    }
};
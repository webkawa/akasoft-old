/* Sortable interface.
 * Allow automatised treatment of a data array based on a rewritable comparison
 * method.
 * PARMATERS :
 *  > cpn                 * Component.
 *  > setup.data          * Data component variable.
 *  > setup.process         Sort processing.
 *  > setup.comparator      Comparator method.
 *  > setup.comparatorITF   Comparator method ITF.                              */

function SortableITF(cpn, setup) {
    Toolkit.checkTypeOf(cpn[setup.data], "object");
    if (Toolkit.isNull(setup.process)) {
        setup.process = true;
    }
    
    cpn.registerMethod(SortableITF.prototype.process, "process", false);
    cpn.registerMethod(SortableITF.prototype.equals, "equals", true);
};
/* Name. */
SortableITF.prototype.name = "Sortable";
/* Processing. */
SortableITF.prototype.process = function(setup) {
    if (setup.process) {
        var d = this[setup.data];
        var m;
        if (Toolkit.isNull(setup.comparator)) {
            m = this.getMethod("equals", "Sortable");
        } else {
            m = this.getMethod(setup.comparator, setup.comparatorITF);
        }
        
        var c, b1, b2;
        for (var i = 0; i < d.length - 1; i++) {
            b1 = d[i];
            b2 = d[i + 1];
            c = m.call([b1, b2]);
            
            if (c === -1) {
                d[i] = b2;
                d[i + 1] = b1;
                i = -1;
            }
        }
        this[setup.data] = d;
    }
};
/* Equalization. */
SortableITF.prototype.equals = function(setup, a, b) {
    Toolkit.checkTypeOf(a, "string");
    Toolkit.checkTypeOf(b, "string");
    
    if (a < b) {
        return 1;
    } else if (a === b) {
        return 0;
    } else {
        return -1;
    }
};


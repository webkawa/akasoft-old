/* Navigable interface.
 * Allow simplified management of a simple navigation process.
 * PARMATERS :
 *  > cpn                 * Component.
 *  > setup.driver        * Driver method.
 *  > setup.driverITF       Driver method interface.
 *  > setup.start           Initial page.                                       */

function NavigableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.driver, "string");
    
    cpn.registerMethod(NavigableITF.prototype.init, "init", false);
    cpn.registerMethod(NavigableITF.prototype.go, "go", false);
};
/* Name. */
NavigableITF.prototype.name = "Navigable";
/* Initialization. */
NavigableITF.prototype.init = function(setup) {
    this.register("at", setup.start, false);
    this.register("history", [], false);
    
    if (!Toolkit.isNull(setup.start)) {
        this.getMethod(setup.driver, setup.driverITF).call([setup.start]);
    }
};
/* Navigation. */
NavigableITF.prototype.go = function(setup, to) {
    this.history[this.history.length] = this.at;
    this.getMethod(setup.driver, setup.driverITF).call([to]);
    this.at = to;
};


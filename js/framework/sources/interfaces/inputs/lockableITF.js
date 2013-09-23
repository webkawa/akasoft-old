/* Lockable interface.
 * Allow locking and unlocking of an input field.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.field             * Field selector.
 *  > setup.stateLock         * Locked state.                                   */

function LockableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.field, "string");
    Toolkit.checkTypeOf(setup.stateLock, "string");
    
    cpn.registerMethod(this.prototype.init, "init", false);
    cpn.registerMethod(this.prototype.lock, "lock", false);
    cpn.registerMethod(this.prototype.unlock, "unlock", false);
    cpn.registerMethod(this.prototype.toggle_lock, "toggleLock", false);
}
/* Name. */
LockableITF.prototype.name = "Lockable";
/* Initialize disableable interface. */
LockableITF.prototype.init = function(setup) {
    var subsetup = {
        field: setup.field
    };
    this.saveInterface(DisableableITF, subsetup);

    this.Lockable = {
        state: false,
        to: setup.stateLock
    };
};
/* Executes lock. */
LockableITF.prototype.lock = function() {
    var to = this.Lockable.to;
    if (!this.Lockable.state) {
        this.Lockable = {
            state: true,
            to: this.state
        };

        this.getMethod("on", "Disableable").call();
        this.go(to);
    }
};
/* Removes lock. */
LockableITF.prototype.unlock = function(setup) {
    var to = this.Lockable.to;
    if (this.Lockable.state) {
        this.Lockable = {
            state: false,
            to: setup.stateLock
        };

        this.getMethod("off", "Disableable").call();
        this.go(to);
    }
};
/* Switch lock. */
LockableITF.prototype.toggle_lock = function() {
    this.Lockable.state ?
        this.getMethod("unlock", "Lockable").call() :
        this.callMethod("lock", "Lockable").call();
};

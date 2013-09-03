/* Double-validable interface.
 * Allow cumuled validation from client and server, as prescribed by the
 * "ClientValidableITF" and "ServerValidableITF". 
 * PARAMETERS :
 *  > cpn                         * Owner component.
 *  > setup.selectField           * Field selector.
 *  > setup.selectNotification    * Notification selector.
 *  > setup.stateOk                 OK state.
 *  > setup.stateKo                 KO state.
 *  > setup.stateChecking           Checking state.
 *  > setup.validators              Validators list.
 *  > setup.gatekeeper              Gatekeeper source name.                     */

function DoubleValidableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.selectField, "string");
    Toolkit.checkTypeOf(setup.selectNotification, "string");
    if (Toolkit.isNull(setup.validators)) {
        setup.validators = [];
    }
    
    cpn.registerMethod(this.prototype.init, "init", false);
    cpn.registerMethod(this.prototype.validate, "validate", false);
}
/* Name. */
DoubleValidableITF.prototype.name = "DoubleValidable";
/* Execute two-sided validation. */
DoubleValidableITF.prototype.validate = function(setup) {
    if (this.getMethod("validate", "ClientValidable").call()) {
        if (Toolkit.isNull(setup.gatekeeper)) {
            this.go(setup.stateOk);
        } else {
            this.go(setup.stateChecking);
        }
    }
};
/* Initializates sub-interfaces. */
DoubleValidableITF.prototype.init = function(setup) {
    var subsetup = {
        selectField: setup.selectField,
        selectNotification: setup.selectNotification,
        stateKo: setup.stateKo,
        validators: setup.validators
    };
    this.saveInterface(ClientValidableITF, subsetup);

    if (!Toolkit.isNull(setup.gatekeeper)) {
        subsetup = {
            selectField: setup.selectField,
            selectNotification: setup.selectNotification,
            stateOk: setup.stateOk,
            stateKo: setup.stateKo,
            gatekeeper: setup.gatekeeper
        };
        this.saveInterface(ServerValidableITF, subsetup);
    }
};
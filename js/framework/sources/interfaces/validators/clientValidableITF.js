/* Client-validable interface.
 * Allow client sequenced testing on an input field, followed by a facultative
 * state change.
 * PARAMETERS :
 *  > cpn                         * Owner component.
 *  > setup.selectField           * Field selector. 
 *  > setup.selectNotification    * Notification selector.
 *  > setup.stateOk                 OK state.
 *  > setup.stateKo                 KO state.
 *  > setup.validators            * Validators list.                            */

function ClientValidableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.selectField, "string");
    Toolkit.checkTypeOf(setup.selectNotification, "string");
    Toolkit.checkTypeOf(setup.validators, "object");
    
    cpn.registerMethod(this.prototype.validate, "validate", false);
}
/* Name. */
ClientValidableITF.prototype.name = "ClientValidable";
/* Executes sequence validation. */
ClientValidableITF.prototype.validate = function(setup) {
    var value = this.qs(setup.selectField).val();
    for (var i = 0; i < setup.validators.length; i++) {
        if (!setup.validators[i].validate(value)) {
            this.qs(setup.selectNotification).text(setup.validators[i].getMessage());
            if (!Toolkit.isNull(setup.stateKo)) {
                this.go(setup.stateKo);
            }
            return false;
        }
    }
    this.qs(setup.selectNotification).text("\xa0");
    if (!Toolkit.isNull(setup.stateOk)) {
        this.go(setup.stateOk);
    }
    return true;
};
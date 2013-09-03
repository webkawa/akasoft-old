/* Server-validable interface.
 * Allow server testing, based on a gatekeeper service, on a input field,
 * followed by a facultative state change.
 * PARAMETERS :
 *  > cpn                         * Owner component. 
 *  > setup.selectField           * Field selector.
 *  > setup.selectNotification    * Notification selector.
 *  > setup.stateOk                 OK state.
 *  > setup.stateKo                 KO state.
 *  > setup.gatekeeper            * Gatekeeper source service name                  */

function ServerValidableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.selectField, "string");
    Toolkit.checkTypeOf(setup.selectNotification, "string");
    Toolkit.checkTypeOf(setup.gatekeeper, "string");
    
    cpn.registerMethod(this.prototype.init, "init", false);
    cpn.registerMethod(this.prototype.validate, "validate", false);
    cpn.registerMethod(this.prototype.conclude, "conclude", false);
}
/* Name. */
ServerValidableITF.prototype.name = "ServerValidable";
/* Configures gatekeeper source. */
ServerValidableITF.prototype.init = function(setup) {
    this.getSource(setup.gatekeeper).addCallback("conclude", "ServerValidable");
};
/* Launches server validation. */
ServerValidableITF.prototype.validate = function(setup) {
    var parameters = {
        value: this.qs(setup.selectField).val()
    };
    this.access(setup.gatekeeper, parameters);
};
/* Concludes server validation. */
ServerValidableITF.prototype.conclude = function(setup) {
    var result = this.getSourceData(setup.gatekeeper, 'i[class="result"]').text();
    var message = this.getSourceData(setup.gatekeeper, 'i[class="message"]').text();
    if (result === "OK") {
        this.qs(setup.selectNotification).text("\xa0");
        if (!Toolkit.isNull(setup.stateOk)) {
            this.go(setup.stateOk);
        }
        return true;
    } else {
        this.qs(setup.selectNotification).text(CFG.get("violations", message));
        if (!Toolkit.isNull(setup.stateKo)) {
            this.go(setup.stateKo);
        }
        return false;
    }
};
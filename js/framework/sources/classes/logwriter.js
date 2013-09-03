/* Log writing-entity.
 * PARAMETERS :
 *  > entity                Writing entity.                                     */

function LogWriter(entity) {
    Toolkit.checkTypeOf(entity, "object");
    if (typeof(entity.getLogID) !== "function") {
        var p = {
            entity: entity
        };
        throw new Error("log", 1, p);
    }
    
    this.entity = entity;
    this.count = 1;
    this.logID = entity.getLogID();
};
/* Writing entity */
LogWriter.prototype.getEntity = function() {
    return this.entity;
};
/* Messages count */
LogWriter.prototype.getCount = function() {
    return this.count;
};
LogWriter.prototype.increaseCount = function() {
    this.count++;
};
/* Log ID */
LogWriter.prototype.getLogID = function() {
    return this.logID;
};
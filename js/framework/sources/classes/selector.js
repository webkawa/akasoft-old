/* Framework component selector.
 * Component-linked selector based on a classic jQuery path.
 * PARAMETERS :
 *  > owner                 Owner component.
 *  > name                  Selector name.
 *  > path                  Selector path.                                      
 *  > state                 Parent state (null if component).                   */

function Selector(owner, name, path, state) {
    Toolkit.checkClassOf(owner, Component);
    Toolkit.checkTypeOf(name, "string");
    Toolkit.checkTypeOf(path, "string");
    
    this.owner = owner;
    this.name = name;
    this.path = path;
    this.nodes = null;
    this.state = state;
    this.status = false;
};
/* Owner component */
Selector.prototype.getOwner = function() {
    return this.owner;
};
/* Name */
Selector.prototype.getName = function() {
    return this.name;
};
/* Path */
Selector.prototype.getPath = function() {
    return this.path;
};
/* Targets */
Selector.prototype.getNodes = function() {
    return this.nodes;
};
/* Parent state */
Selector.prototype.getState = function() {
    return this.state;
};
/* Status */
Selector.prototype.getStatus = function() {
    return this.status;
};
Selector.prototype.on = function() {
    this.status = true;
};
Selector.prototype.off = function() {
    this.status = false;
};
/* Nodes refresher.
 * Refresh the list of matching nodes for the selector.
 * PARAMETERS : N/A
 * RETURNS :
 *  New nodes list.                                                          */
Selector.prototype.refresh = function() {
    this.nodes = $(this.owner.getContainer()).find(this.path);
    return this.nodes;
};
/* Delayed removal tagger.
 * Put a tag on selected nodes for delayed suppression (avoid removed-promise
 * bug).
 * PARAMETERS : N/A
 * RETURNS : N/A                                                            */
Selector.prototype.remove = function() {
    var tag = CFG.get("components", "css.class.removal");

    if (this.getOwner().getStatus() < 1) {
        var p = {
            component: this.getOwner().getID(),
            status: this.getOwner().getStatus()
        };
        throw new Error("cpn", 21, p);
    } else {
        this.refresh();
        $(this.nodes).addClass(tag);
    }
};
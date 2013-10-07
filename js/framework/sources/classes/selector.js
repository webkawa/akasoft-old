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
    
    this.cfg_classremoval = CFG.get("components", "css.class.removal");
    
    this.owner = owner;
    this.name = name;
    this.path = path;
    this.nodes = null;
    this.state = state;
    this.status = false;
    this.explore = false;
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
/* Mode */
Selector.prototype.setMode = function(mode) {
    Toolkit.checkTypeOf(mode, "boolean");
    this.explore = mode;
};
Selector.prototype.getMode = function() {
    return this.explore;
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
    var subpaths = this.path.split(",");
    
    this.nodes = $([]);
    if (this.explore) {
        for (var i = 0; i < subpaths.length; i++) {
            this.nodes = $(this.nodes).add("#" + this.owner.getID() + " " + subpaths[i]);
        }
    } else {
        for (var i = 0; i < subpaths.length; i++) {
            this.nodes = $(this.nodes).add("#" + this.owner.getID() + " > " + subpaths[i]);
        }
    }
    return this.nodes;
};
/* Delayed removal tagger.
 * Put a tag on selected nodes for delayed suppression (avoid removed-promise
 * bug).
 * PARAMETERS : N/A
 * RETURNS : N/A                                                            */
Selector.prototype.remove = function() {
    if (this.getOwner().getStatus() < 1) {
        var p = {
            component: this.getOwner().getID(),
            status: this.getOwner().getStatus()
        };
        throw new Error("cpn", 21, p);
    } else {
        this.refresh();
        $(this.nodes).addClass(this.cfg_classremoval);
    }
};
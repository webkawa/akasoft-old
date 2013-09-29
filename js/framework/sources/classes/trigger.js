/* Framework component trigger.
 * Manages loading, update and exploitation of a component trigger.
 * PARAMETERS :
 *  > owner             Owner component.
 *  > name              Model node.                                             */

function Trigger(owner, node) {
    Toolkit.checkClassOf(owner, Component);
    Toolkit.checkClassOf(node, jQuery);
    
    var ctx = this;
    
    this.owner = owner;
    this.node = node;
    this.bind = $(node).attr("bind");
    this.prevent = false;
    if ($(this.node).attr("prevent") === "true") {
        this.prevent = true;
    }
    this.transfer = true;
    if ($(this.node).attr("transfer") === "false") {
        this.transfer = false;
    }
    this.state = "@None";
    if ($(this.node).parents("state").length > 0) {
        this.state = $(node).parents("state").attr("id");
    }
    this.master = false;
    if ($(this.node).is("master")) {
        this.master = true;
    }
    this.targets = [];
    $(this.node).children("target").each(function() {
        ctx.targets[ctx.targets.length] = this;
    });
    this.actions = [];
    $(this.node).children("action").each(function() {
        ctx.actions[ctx.actions.length] = this;
    });
    this.scenario = function(event) {
        ctx.owner.ltn = $(this);
        if (ctx.hasPrevent()) {
            event.preventDefault();
        }
        if (!ctx.hasTransfer()) {
            event.stopPropagation();
        }
        for (var i = 0; i < ctx.actions.length; i++) {
            ctx.owner.call.apply($(ctx.actions[i]), [ctx.owner]);
        }
    };
};
/* Bind */
Trigger.prototype.getBind = function() {
    return this.bind;
};
/* Node */
Trigger.prototype.getNode = function() {
    return this.node;
};
/* Prevent */
Trigger.prototype.hasPrevent = function() {
    return this.prevent;
};
/* Transfer */
Trigger.prototype.hasTransfer = function() {
    return this.transfer;
};
/* State */
Trigger.prototype.getState = function() {
    return this.state;
};
/* Master */
Trigger.prototype.isMaster = function() {
    return this.master;
};
/* Targets */
Trigger.prototype.getTarget = function() {
    return this.targets;
};
Trigger.prototype.getTargetNodes = function() {
    var nodes = $([]);
    var buff;
    for (var i = 0; i < this.targets.length; i++) {
        buff = this.targets[i];
        nodes = $(nodes).add(this.owner.quickSelect($(buff).text(), $(buff).attr("refresh") === "true", true));
    }
    return nodes;
};
/* Actions */
Trigger.prototype.getActions = function() {
    return this.actions;
};
Trigger.prototype.getScenario = function() {
    return this.scenario;
};
/* Activation and descativation */
Trigger.prototype.on = function() {
    $(this.getTargetNodes()).on(this.bind, this.scenario);
};
Trigger.prototype.off = function() {
    $(this.getTargetNodes()).unbind(this.bind, this.scenario);
};

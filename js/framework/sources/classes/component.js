/* Framework component.
 * Independant, semi-auto managed front-office component.
 * PARAMETERS :
 *  > container             Containing node.
 *  > descriptor            URL of description file.                            */
function Component(container, descriptor) {
    Toolkit.checkTypeOf(container, "object");
    Toolkit.checkClassOf(container, jQuery);
    Toolkit.checkTypeOf(descriptor, "string");
    
    this.cfg_ais = CFG.get("components", "allow.inactive.selectors");
    this.cfg_keyfrom = CFG.get("components", "css.prefix.from");
    this.cfg_keyto = CFG.get("components", "css.prefix.to");
    this.cfg_keyat = CFG.get("components", "css.prefix.at");
    this.cfg_classout = CFG.get("components", "css.class.out");
    this.cfg_classin = CFG.get("components", "css.class.in");
    this.cfg_classremoval = CFG.get("components", "css.class.removal");
    
    this.container = container;                         // Component container
    this.descriptor = descriptor;                       // Component descriptor
    this.model = null;                                  // XML model
    this.methods = [];                                  // Methods list
    this.methods_idx = {};                              // Methods list index
    this.selectors = [];                                // Selectors
    this.selectors_idx = {};                            // Selectors index
    this.interface = "";                                // Interface buffer
    this.parents = [];                                  // Parents list
    this.datas = [];                                    // Interface datas
    this.triggers = [];                                 // Triggers
    this.as;                                            // Active selectors
    this.ltn;                                           // Last triggered node
    this.sources = [];                                  // Data sources
    this.state = "@None";                               // Current state
    this.nstate = "@None";                              // Next state
    this.nstatecp;                                      // Next state complements
    this.status = 3;                                    // Current status
    this.id = Register.add(this);                       // Component ID
    this.dt = [];                                       // Delayed threads
    this.dfr_start = new jQuery.Deferred();             // Deffered starter
    this.dfr_evolve;                                    // Deffered evolver
    this.queue_state;                                   // Queue state
    this.queue_objective;                               // Queue objective
        
    /* Initialize */
    this.log("Initializing new component");
    this.log("Loading descriptor");
    jQuery.ajax({
        context: this,
        type: "GET",
        url: this.descriptor,
        data: null,
        dataType: "xml",
        cache: false,
        async: true,
        timeout: 500
    }).error(function(jqXHR, status, info) {
        var p = {
            url: this.url,
            info: info
        };
        throw new Error("cpn", 4, p);
    }).success(function(data) {
        this.model = data;
    
        this.log("Tagging container");
        $(this.container).addClass("cpn" + this.getModelName());

        this.log("Loading selectors, triggers and masters");
        var ctx = this;
        $(this.model).find("selector").each(function() {
            var buff;
            if (ctx.isSelector($(this).attr("id"))) {
                var p = {
                    name: $(this).attr("id")
                };
                throw new Error("cpn", 8, p);
            } else {
                buff = new Selector(
                    ctx, 
                    $(this).attr("id"),
                    $(this).text(),
                    $(this).parents("state").attr("id")
                );
                if ($(this).attr("explore") === "true") {
                    buff.setMode(true);
                }
                ctx.selectors[ctx.selectors.length] = buff;
                ctx.selectors_idx[buff.getName()] = buff;
            }
        });
        $(this.model).find("trigger, master").each(function() {
            ctx.triggers[ctx.triggers.length] = new Trigger(ctx, $(this));
        });
            
        this.dfr_start.resolve();
    });
    
    this.log("Saving initial methods"); 
    this.pushMethod(this.go, "go");
    this.pushMethod(this.log, "log");
    this.pushMethod(this.retrigger, "retrigger");
    this.pushMethod(this.shortcutGet, "get");
    this.pushMethod(this.shortcutReselect, "reselect");
    this.pushMethod(this.shortcutTrigger, "trigger");
    this.pushMethod(this.shortcutSourcePost, "sourcePost");
    this.pushMethod(this.shortcutSourcePostForce, "sourcePostForce");
    this.pushMethod(this.shortcutSourceGet, "sourceGet");
    this.pushMethod(this.shortcutSourceGetForce, "sourceGetForce");
    this.pushMethod(this.shortcutOuterHeight, "outerHeight");
    this.pushMethod(this.shortcutOuterWidth, "outerWidth");
    this.pushMethod(this.shortcutRealHeight, "realHeight");
    this.pushMethod(this.shortcutRealWidth, "realWidth");
    this.pushMethod(this.shortcutAbsRealHeight, "absRealHeight");
    this.pushMethod(this.shortcutAbsRealWidth, "absRealWidth");
    this.pushMethod(this.shortcutCenter, "center");
    this.pushMethod(this.shortcutCenterX, "centerX");
    this.pushMethod(this.shortcutCenterY, "centerY");
    this.pushMethod(this.shortcutPosition, "position");
    this.pushMethod(this.shortcutClean, "clean");
    this.pushMethod(this.shortcutClass, "class");
    this.pushMethod(this.shortcutAttribute, "attribute");
    this.pushMethod(this.shortcutCss, "css");
};
/* Container */
Component.prototype.getContainer = function() {
    return this.container;
};
/* Parent */
Component.prototype.getParent = function(at) {
    if (Toolkit.isNull(at)) {
        at = 1;
    }
    return this.parents[at];
};
/* Descriptor */
Component.prototype.getDescriptor = function() {
    return this.descriptor;
};
/* Model */
Component.prototype.getModel = function() {
    return this.model;
};
Component.prototype.getModelName = function() {
    return $(this.model).find("component").attr("name");
};
Component.prototype.getModelType = function() {
    return $(this.model).find("component").attr("type");
};
/* Methods */
Component.prototype.isMethod = function(name, interface) {
    return Toolkit.isNull(interface) ?
        !Toolkit.isNull(this.methods_idx[name]) :
        !Toolkit.isNull(this.methods_idx[name + '@' + interface]);
};
Component.prototype.getMethod = function(name, interface) {
    var m = Toolkit.isNull(interface) ? 
        this.methods_idx[name] : 
        this.methods_idx[name + '@' + interface];
    
    if (!Toolkit.isNull(m)) {
        return m;
    }
    
    var p = {
        component: this.getID(),
        name: name,
        interface: interface
    };
    throw new Error("cpn", 2, p);
};
Component.prototype.saveMethod = function(method) {
    Toolkit.checkTypeOf(method, "object");
    Toolkit.checkClassOf(method, Method);

    if (this.interface !== "") {
        method.setInterface(this.interface);
    }
    method.setContext(this);
    
    if (!Toolkit.isNull(this.methods_idx[method.getID()])) {
        if (this.methods_idx[method.getID()].isRewritable()) {
            for (var i = 0; i < this.methods.length; i++) {
                if (this.methods[i].equals(method)) {
                    this.methods[i] = method;
                }
            }
            this.methods_idx[method.getID()] = method;
        } else {
            var p = {
                component: this.getID(),
                name: method.getName()
            };
            throw new Error("cpn", 7, p);
        }
    } else {
        this.methods[this.methods.length] = method;
        this.methods_idx[method.getID()] = method;
    }
};
Component.prototype.pushMethod = function(ref, name) {
    var method = new Method(ref, name, false);
    method.setContext(this);
    
    this.methods[this.methods.length] = method;
    this.methods_idx[method.getID()] = method;
};
Component.prototype.registerMethod = function(ref, name, rw) {
    var m = new Method(ref, name, rw);
    this.saveMethod(m);
};
/* Interfaces */
Component.prototype.getInterfaceData = function(name) {
    return this.datas[name];
};
Component.prototype.declareInterface = function(name) {
    this.interface = name;
};
Component.prototype.saveInterface = function(interface, setup) {
    Toolkit.checkTypeOf(interface, "function");
    Toolkit.checkTypeOf(setup, "object");

    var name = interface.prototype.name;

    var pre = this.interface;
    this.declareInterface(name);
    
    this.datas[name] = setup;
    interface.apply(interface, [this, setup]);
    
    this.declareInterface(pre);
};
/* Selectors */
Component.prototype.isSelector = function(name) {
    return !Toolkit.isNull(this.selectors_idx[name]) && this.selectors_idx[name].getStatus();
};
Component.prototype.getSelector = function(name, refresh, force) {
    var s = this.selectors_idx[name];
    if (!Toolkit.isNull(s)) {
        if (s.getStatus() || this.cfg_ais || force) {
            if (refresh) {
                s.refresh();
            }
            return s;
        } else {
            var p = {
                name: name,
                path: s.getPath()
            };
            throw new Error("cpn", 5, p);
        }
    }
    
    var p = {
        name: name
    };
    throw new Error("cpn", 6, p);
};
Component.prototype.quickSelect = function(name, refresh, force) {
    if (Toolkit.isNull(refresh)) {
        refresh = false;
    }
    
    var r = $([]);
    var s = name.split(" ");
    for (var i = 0; i < s.length; i++) {
        switch (s[i]) {
            case "$TRIGGERED":
                if (!Toolkit.isNull(this.ltn)) {
                    r = $(r).add(this.ltn);
                }
                break;
            case "$BODY":       r = $(r).add($("body")); break;
            case "$WINDOW":     r = $(r).add($(window)); break;
            case "$SELF":       r = $(r).add(this.container); break;
            case "$IMAGES":     r = $(r).add($(this.container).find("img")); break;
            case "$IFRAMES":    r = $(r).add($(this.container).find("iframe")); break;
            default:            r = $(r).add(this.getSelector(s[i], refresh, force).getNodes()); break;
        }
    }
    return r;
};
Component.prototype.qs = function(name, select) {
    if (Toolkit.isNull(select)) {
        return this.quickSelect(name);
    }
    if (select.indexOf(" ") !== -1) {
        return this.quickSelect(name).find(select);
    }
    return this.quickSelect(name).children(select);
};
/* Data sources */
Component.prototype.isSource = function(name) {
    for (var i = 0; i < this.sources.length; i++) {
        if (this.sources[i].getName() === name) {
            return true;
        }
    }
    return false;
};
Component.prototype.getSource = function(name) {
    for (var i = 0; i < this.sources.length; i++) {
        if (this.sources[i].getName() === name) {
            return this.sources[i];
        }
    }
    var p = {
        component: this.getID(),
        source: name
    };
    throw new Error("cpn", 19, p);
};
Component.prototype.getSourceData = function(name, selector) {
    return $(this.getSource(name).getData(selector));
};
Component.prototype.saveSource = function(source) {
    Toolkit.checkClassOf(source, Source);

    if (this.isSource(source.getName())) {
        var p = {
            component: this.getID(),
            name: source.getName()
        };
        throw new Error("cpn", 3, p);
    }
    source.setOwner(this);
    this.sources[this.sources.length] = source;
};
Component.prototype.registerSource = function(name, service, backup, callbacks) {
    var s = new Source(name, service, backup, callbacks);
    this.saveSource(s);
    return s;
};
/* Current state */
Component.prototype.getState = function() {
    return this.state;
};
Component.prototype.setState = function(state) {
    if ($(this.model).find('state[id="' + state + '"]').length === 1) {
        this.state = state;
    } else {
        var p = {
            component: this.getID(),
            state: state
        };
        throw new Error("cpn", 9, p);
    }
};
Component.prototype.setStateClass = function(from, to) {
    var buff;
    var ctx = this;

    // Pre-clean
    $(this.model).find("state").each(function() {
        buff = ctx.cfg_keyfrom + $(this).attr("id") + " " +
               ctx.cfg_keyto + $(this).attr("id") + " " +
               ctx.cfg_keyat + $(this).attr("id");
        $(ctx.container).removeClass(buff);
    });

    // Adding classes
    if (from === "@None" && Toolkit.isNull(to)) {
        return;
    } else if (from === to) {
        $(this.container).addClass(this.cfg_keyat + from);
    } else if (Toolkit.isNull(to)) {
        $(this.container).addClass(this.cfg_keyfrom + from);
    } else if (from === "@None") {
        $(this.container).addClass(this.cfg_keyto + to);
    } else {
        $(this.container).addClass(this.cfg_keyfrom + from + " " + this.cfg_keyto + to);
    }
};
Component.prototype.setSwitchClass = function(mode) {
    if (mode === -1) {
        $(this.container).addClass(this.cfg_classout);
    } else if (mode === 0) {
        $(this.container).removeClass(this.cfg_classin);
    } else {
        $(this.container).removeClass(this.cfg_classout);
        $(this.container).addClass(this.cfg_classin);
    }
};
/* Current status 
 *  0 > Ready
 *  1 > Switching out
 *  2 > Switching in
 *  3 > Starting
 *  9 > Cleaned                                                             */
Component.prototype.getStatus = function() {
    return this.status;
};
Component.prototype.setStatus = function(status) {
    this.status = status;
};
/* ID */
Component.prototype.getID = function() {
    return this.id;
};
Component.prototype.getLogID = function() {
    return 'Component ' + this.getModelName() + '#' + this.id;
};
/* Delayed tasks */
Component.prototype.addDelayedTask = function(id) {
    this.dt[this.dt.length] = id;
};
Component.prototype.clearDelayedTasks = function() {
    for (var i = 0; i < this.dt.length; i++) {
        clearTimeout(this.dt[i]);
    }
    this.dt = [];
};
/* Attributes register.
 * Adds a new attribute to component for specific use.
 * PARAMETERS :
 *  name                    Variable name.
 *  value                   Variable default value.
 *  force                   Force register (true/false).
 * RETURNS : N/A                                                                */
Component.prototype.register = function(name, value, force) {
    if (Toolkit.isNull(this[name]) || force) {
        this[name] = value;
    } else {
        var p = {
            component: this.getID(),
            name: name,
            value: value
        };
        throw new Error("cpn", 27, p);
    }
};
/* DOM re-writer.
 * Empties and re-writes container DOM.
 * PARAMETERS :
 *  data                    DOM data.
 * RETURN : N/A                                                                 */
Component.prototype.rewrite = function(data) {
    $(this.container).html(data);
};
/* Triggers refresher.
 * Re-bind all triggers for the selected state.
 * PARAMETERS : N/A
 * RETURNS : N/A                                                                */
Component.prototype.retrigger = function(distant) {
    if (Toolkit.isNull(distant)) {
        distant = false;
    }
    this.retriggerParents();
    if (distant) {
        var master;
        var state;
        for (var i = 0; i < this.triggers.length; i++) {
            master = this.triggers[i].isMaster();
            state = this.triggers[i].getState();
            
            if (master) {
                this.triggers[i].off();
                if (state === "@None" || state === this.state) {
                    this.triggers[i].on();
                }
            }
        }
    } else {
        var state;
        for (var i = 0; i < this.triggers.length; i++) {
            state = this.triggers[i].getState();
               
            this.triggers[i].off();
            if (state === "@None" || state === this.state) {
                this.triggers[i].on();
            }
        }
    }
};
Component.prototype.retriggerParents = function() {
    if (this.parents.length > 1) {
        this.parents[1].retrigger(true);
    }
};
Component.prototype.untrigger = function() {
    for (var i = 0; i < this.triggers.length; i++) {
        this.triggers[i].off();
    }
};
/* Selector refresher.
 * Checks all selectors for activation/desactivation.
 * PARAMETERS : N/A
 * RETURNS : N/A                                                                */
Component.prototype.reselect = function() {
    var buff;
    
    this.as = $([]);
    for (var i = 0; i < this.selectors.length; i++) {
        buff = this.selectors[i];
        if (buff.getState() === this.state || Toolkit.isNull(buff.getState())) {
            buff.on();
            buff.refresh();
            this.as = $(this.as).add(buff.getNodes());
        } else {
            buff.off();
        }
    }
};
/* Data source accessor.
 * PARAMETERS :
 *  name            Data source name.
 *  params          Load parameters.
 * RETURNS : N/A                                                                */
Component.prototype.access = function(name, params) {
    this.getSource(name).load(params);
};
/* Call a pre-saved method.
 * PARAMETERS :
 *  context                     Binding context.
 * RETURN :
 *  Method result or 0 if delayed.                                              */
Component.prototype.call = function(context) {
    var name = $(this).attr("call");
    
    var interface;
    if ($(this).attr("on") !== "") {
        interface = $(this).attr("on");
    }
    
    var caller;
    if ($(this).attr('context') === "distant") {
        var t = context.qs("$TRIGGERED").is('[id]') ?
            context.qs("$TRIGGERED").attr("id") :
            context.qs("$TRIGGERED").parents("[id]:first()").attr("id");
        var tcpn = Register.get(t);
    
        if ($(this).is('[parent]')) {
            caller = tcpn.getParent($(this).attr("parent"));
        } else {
            caller = tcpn;
        }
    } else {
        if ($(this).is('[parent]')) {
            caller = context.parents[$(this).attr("parent")];
        } else {
            caller = context;
        }
    }
    
    var params = [];
    $(this).children("parameter").each(function() {
        if ($(this).attr("variable") === "true") {
            if (Toolkit.isNull(context[$(this).text()])) {
                var p = {
                    component: context.getID(),
                    name: $(this).text()
                };
                throw new Error("cpn", 28, p);
            }
            params[params.length] = context[$(this).text()];
        } else {
            params[params.length] = $(this).text();
        }
    });
    
    var delay = 0;
    if ($(this).is('[delay]')) {
        delay = parseInt($(this).attr("delay"));
    }

    try {
        if (delay === 0) {
            return caller.getMethod(name, interface).call(params, interface);
        } else {
            var t = setTimeout(function() {
                try {
                    caller.getMethod(name, interface).call(params, interface);
                } catch (e) {
                    var p = {
                        component: caller.getID(),
                        method: name
                    };
                    ErrorManager.process(new Error("cpn", 23, p, e));
                    caller.stop();
                }
            }, delay);
            caller.addDelayedTask(t);

            return 0;
        }
    } catch (e) {
        var p = {
            name: name
        };
        ErrorManager.process(new Error("cpn", 12, p, e));
        caller.stop();
    }
};
/* Executes pre-formated animation postback.
 * PARAMETERS :
 *  postback.methods        Postback methods nodes as list.
 *  postback.sequences      Postback sequences nodes as list.
 * RETURNS : N/A                                                                */
Component.prototype.postback = function(postback) {
    var ctx = this;
    $(postback.methods).each(function() {
        ctx.call.apply(this, [ctx]);
    });
    $(postback.sequences).each(function() {
        ctx.execute(this);
    });
};
/* Executes a pre-saved animation.
 * PARAMETERS :
 *  animation               Descripting animation node.
 *  targets                 Targets list.
 *  postback                Postbacks.
 * RETURNS : N/A                                                                */
Component.prototype.animate = function(animation, targets, postback) {
    var trajectory = $();
    var from = {};
    var to = {};
    var clean = {};
    var b1, b2;
    var dfr_animation = new jQuery.Deferred();
    var animation_state = 0;
    var animation_objective = $(targets).length;
    var ctx = this;

    // Trajectory loading
    trajectory = $(this.model).find('trajectories > trajectory[name="' + $(animation).attr("base") + '"]');
    if ($(trajectory).length === 0) {
        var p = {
            component: this.getID(),
            trajectory: trajectory
        };
        throw new Error("cpn", 22, p);
    }

    // Initialization
    $(trajectory).children("move").each(function() {
        b1 = $(this).children("property").text();

        b2 = $(this).children("from");
        if ($(b2).length > 0) {
            from[b1] = $(b2).text();
            $(this).children("origin").each(function() {
                from[b1] = ctx.call.apply(this, [ctx]);
            });
        }

        var b3;
        $(this).children("goal").each(function() {
            b3 = ctx.call.apply(this, [ctx]);
        });

        if ($(this).attr("clean") !== "false") {
            clean[b1] = "";
        }

        Toolkit.isNull(b3) ?
                to[b1] = $(this).children("to").text() :
                to[b1] = b3;
    });
    $(animation).children("move").each(function() {
        b1 = $(this).children("property").text();

        b2 = $(this).children("from");
        if ($(b2).length > 0) {
            from[b1] = $(b2).text();
        }

        var b3;
        $(this).children("goal").each(function() {
            b3 = ctx.call.apply(this, [ctx]);
        });

        if ($(this).attr("clean") !== "false") {
            clean[b1] = "";
        }
        
        if (!Toolkit.isNull(b3) || $(this).children("to").length > 0) {
            Toolkit.isNull(b3) ?
                    to[b1] = $(this).children("to").text() :
                    to[b1] = b3;
        }
    });

    // Setup
    $(targets).css(from);

    // Initialization
    var delay = 0
    if ($(animation).is("[wait]")) {
        delay = parseInt($(animation).attr("wait"));
    }
    var params = {
        duration:
            $(animation).children("speed").length === 1 ?
                parseInt($(animation).children("speed").text()) :
                parseInt($(trajectory).children("speed").text()),
        easing:
            $(animation).children("easing").length === 1 ?
                $(animation).children("easing").text() :
                $(trajectory).children("easing").text(),
        fail: function() {
            throw new Error("cpn", 13);
        }, done: function() {
            $(targets).css(clean);
            
            animation_state++;
            if (animation_state === animation_objective) {
                dfr_animation.resolve();
            }
        }
    };
    if ($(animation).children("progress").length === 1) {
        params.progress = function() {
            ctx.call.apply($(animation).children("progress"), [ctx]);
        };
    };
    dfr_animation.promise().done(function() {
        ctx.postback(postback);
        ctx.queue_state++;
        if (ctx.queue_state === ctx.queue_objective) {
            ctx.dfr_evolve.resolve();
        }
    });
    
    // Animation
    if ($(animation).is("[cascade]")) {
        var cascade = $(animation).attr("cascade");
        if (cascade === "0") {
            cascade = params.duration;
        }
        
        $(targets).each(function(i) {
            $(this).delay(delay + (cascade * i)).animate(to, params);
        });
    } else {
        $(targets).delay(delay).animate(to, params);
    }
    if ($(targets).length === 0) {
        dfr_animation.resolve();
    }
};
/* Executes a pre-saved sequence.
 * PARAMETERS :
 *  sequence                Descripting sequence node.
 * RETURNS : N/A                                                                */
Component.prototype.execute = function(sequence) {
    var lt;
    if ($(sequence).is("in")) {
        lt = "in";
    } else if ($(sequence).is("out")) {
        lt = "out";
    } else {
        lt = "queue";
    }
    this.log("Executes sequence [" + lt + "]/[" + this.getState() + "]");

    // Use vars
    var ctx = this;
    var targets = $([]);
    var animation;
    var postback = {
        method: $([]),
        sequence: $([])
    };
    var buff;

    // Executing pre-call
    $(sequence).children("pre").each(function() {
        ctx.call.apply(this, [ctx]);
    });
    
    // Retriggering parents
    if ($(sequence).attr("monitor") === "true") {
        this.retriggerParents();
    }

    // Loading targets
    $(sequence).children("target").each(function() {
        try {
            buff = ctx.quickSelect($(this).text(), $(this).attr("refresh") === "true");
            targets = $(targets).add($(buff));
        } catch (e) {
            var p = {
                component: ctx.getID(),
                target: $(this).text()
            };
            throw new Error("cpn", 11, p, e);
        }
    });

    // Loading animation, postback and queue
    animation = $(sequence).children("animation");
    postback.methods = $(sequence).children("post");
    postback.sequences = $(sequence).children("queue");

    // Launching
    if ($(animation).length > 0) {
        this.animate(animation, targets, postback);
    } else {
        this.postback(postback);
    }
};
/* Manages transition from current state to another state.
 * PARAMETERS :
 *  to                      Destination state.
 *  complement              Complementary callback function.
 * RETURN : N/A                                                                 */
Component.prototype.go = function(to, complement) {
    if (this.status !== 0) {
        this.nstate = to;
        this.nstatecp = complement;
    } else {
        if (Toolkit.isNull(to)) {
            var p = {
                component: this.getID(),
                error: "No destination defined"
            };
            throw new Error("cpn", 15, p);
        }

        // Used variables
        var ctx = this;
        var node_origin;
        var node_dest;
        if (!Toolkit.isNull(this.state)) {
            node_origin = $(this.model).find('component > state[id="' + this.state + '"]');
        }
        if (!Toolkit.isNull(to)) {
            node_dest = $(this.model).find('component > state[id="' + to + '"]');
        }
        var seq_exit = $();
        var seq_entry = $();

        try {
            // Cleaning delayed tasks
            this.clearDelayedTasks();

            // Untriggering
            this.untrigger();

            // Setting classes
            this.setStateClass(this.state, to);
            this.setSwitchClass(-1);

            // Loading exit/entry sequences
            if (!Toolkit.isNull(node_origin)) {
                if ($(node_origin).children('out[to*="' + to + '"]').length > 0) {
                    seq_exit = $(seq_exit).add($(node_origin).children('out[to*="' + to + '"]'));
                }
                if ($(node_origin).children('out:not([to])').length > 0) {
                    seq_exit = $(seq_exit).add($(node_origin).children('out:not([to])'));
                }
            }
            if (!Toolkit.isNull(node_dest)) {
                if ($(node_dest).children('in[from*="' + this.state + '"]').length > 0) {
                    seq_entry = $(seq_entry).add($(node_dest).children('in[from*="' + this.state + '"]'));
                }
                if ($(node_dest).children('in:not([from])').length > 0) {
                    seq_entry = $(seq_entry).add($(node_dest).children('in:not([from])'));
                }
            }

            // Executing exit sequence
            this.status = 1;
            this.prepare(seq_exit);
            this.dfr_evolve.promise().done(function() {
                try {
                    // Executes delayed removal
                    $(ctx.getContainer()).find("." + ctx.cfg_classremoval).remove();

                    // Switching state
                    ctx.setState(to);

                    // Setting classes
                    ctx.setSwitchClass(1);

                    // Revalidating selectors
                    ctx.reselect();

                    // Executing entry sequence
                    ctx.setStatus(2);
                    ctx.prepare(seq_entry);

                    ctx.dfr_evolve.promise().done(function() {
                        try {
                            ctx.setStatus(0);
                            if (Toolkit.isNull(to)) {
                                // Closing component
                                ctx.clean();
                            } else {
                                // Executes delayed removal
                                $(ctx.getContainer()).find("." + ctx.cfg_classremoval).remove();

                                // Setting classes
                                ctx.setStateClass(ctx.state, to);
                                ctx.setSwitchClass(0);

                                // Executes complementary callback
                                if (!Toolkit.isNull(complement)) {
                                    complement.apply(ctx);
                                }

                                // Executes conclusion methods
                                if (!Toolkit.isNull(node_origin)) {
                                    $(node_origin).find("conclude").each(function() {
                                        ctx.call.apply(this, [ctx]);
                                    });
                                }

                                // Executes conclusion starters
                                if (!Toolkit.isNull(node_dest)) {
                                    $(node_dest).find("begin").each(function() {
                                        ctx.call.apply(this, [ctx]);
                                    });
                                }
                                
                                // Going next state or retriggering
                                if (ctx.nstate !== "@None") {
                                    var ns = ctx.nstate;
                                    var nscp = ctx.nstatecp;
                                    
                                    ctx.nstate = "@None";
                                    ctx.nstatecp = null;
                                    
                                    if (ns !== ctx.state) {
                                        ctx.go(ns, nscp);
                                    }
                                } else {
                                    ctx.retrigger();
                                }
                            }
                        } catch (e) {
                            ErrorManager.process(e);
                        }
                    });
                    if ($(seq_entry).length > 0) {
                        $(seq_entry).each(function() {
                            ctx.execute(this);
                        });
                    } else {
                        ctx.dfr_evolve.resolve();
                    }
                } catch (e) {
                    ErrorManager.process(e);
                }
            });
            if ($(seq_exit).length > 0) {
                $(seq_exit).each(function() {
                    ctx.execute(this);
                });
            } else {
                this.dfr_evolve.resolve();
            }
        } catch (e) {
            var p = {
                component: this.getID()
            };
            ErrorManager.process(new Error("cpn", 14, p, e));
        }
    }
};
Component.prototype.prepare = function(node) {
    this.dfr_evolve = new jQuery.Deferred();
    this.queue_state = 0;
    this.queue_objective = $(node).add($(node).find("queue")).length;
};
/* Starts component to initial state.
 * PARAMETERS : N/A
 * RETURNS :
 *  True if starting was successfull, false else.                               */
Component.prototype.start = function() {
    var ctx = this;
    this.dfr_start.promise().done(function() {
        try {
            ctx.log("Starting component");
            if (ctx.state !== "@None") {
                if (CFG.get("components", "allow.invalid.start")) {
                    return false;
                } else {
                    var p = {
                        component: ctx.getID()
                    };
                    throw new Error("cpn", 10, p);
                }
            } else {
                // Writing initial DOM
                ctx.rewrite($(ctx.model).find("component > loader > dom").text());

                // Loading global selectors
                ctx.reselect();

                // Selecting parents
                ctx.parents[0] = ctx;
                $(ctx.container).parents("[id]").each(function() {
                    ctx.parents[ctx.parents.length] = Register.get($(this).attr("id"));
                });

                // Applying styles
                $(ctx.model).find("component > loader > style").each(function() {
                    if ($(this).is("[find]")) {
                        ctx.qs($(this).attr("target"), $(this).attr("find")).addClass($(this).text());
                    } else {
                        ctx.qs($(this).attr("target")).addClass($(this).text());
                    }
                });

                // Launching init actions
                for (var i = 0; i < ctx.methods.length; i++) {
                    if (ctx.methods[i].getName().indexOf("init") === 0) {
                        ctx.methods[i].call([]);
                    }
                }

                // Launching start actions
                $(ctx.model).find("component > loader > action").each(function() {
                    ctx.call.apply(this, [ctx]);
                });

                // Migrating to initial state
                ctx.setStatus(0);
                ctx.go($(ctx.model).find("component > loader > to").text());
            }
        } catch (e) {
            var p = {
                component: ctx.getID()
            };
            ErrorManager.process(new Error("cpn", 29, p, e));
        }
    });
};
/* Component deallocation.
 * PARAMETERS : N/A
 * RETURNS : N/A                                                                */
Component.prototype.stop = function() {
    this.log("Cleaning component");

    // Stop threads
    this.clearDelayedTasks();

    // Removing DOM
    this.setStateClass();
    $(this.container).removeClass(this.getModelName());
    $(this.container).empty();

    // Cleaning references
    this.sources = [];
    Register.remove(this.getID());
};
/* Component restart.
 * PARAMETERS : N/A
 * RETURNS : N/A                                                                */
Component.prototype.restart = function() {
    this.stop();
    this.state = "@None";
    this.start();
};
/* Quick log */
Component.prototype.log = function(message, add) {
    Log.print(this, message, add);
};
/* Manual reselecting.
 * PARAMETERS :
 *  > selector      Selector name.
 * RETURNS : N/A                                                                */
Component.prototype.shortcutReselect = function(selector) {
    if (Toolkit.isNull(selector)) {
        this.reselect();
    } else {
        this.quickSelect(selector, true);
    }
};
/* Manual getting.
 * PARAMETERS :
 *  > variable      Variable name.
 *  > base          Default value.
 * RETURNS : N/A                                                                */
Component.prototype.shortcutGet = function(variable, base) {
    return Toolkit.isNull(this[variable]) ? base : this[variable];
};
/* Manual triggering.
 * PARAMETERS :
 *  > target        Target selector or item.
 *  > trigger       Trigger.
 * RETURNS : N/A                                                                */
Component.prototype.shortcutTrigger = function(target, trigger) {
    this.qs(target).trigger(trigger);
};
/* Source loader.
 * PARAMETERS :
 *  > source        Source name.
 * RETURNS : N/A                                                                */
Component.prototype.shortcutSourcePost = function(source) {
    this.getSource(source).post({});
};
Component.prototype.shortcutSourcePostForce = function(source) {
    this.getSource(source).postForce({});
};
Component.prototype.shortcutSourceGet = function(source) {
    this.getSource(source).get({});
};
Component.prototype.shortcutSourceGetForce = function(source) {
    this.getSource(source).getForce({});
}
/* Outer height getter.
 * PARAMETERS :
 *  > target        Target selector or item.
 *  > margin        Include margins.
 * RETURNS :
 *  Target outer height.                                                        */
Component.prototype.shortcutOuterHeight = function(target, margin) {
    if (Toolkit.isNull(margin)) {
        margin = true;
    }
    
    return this.qs(target).outerHeight(margin);
};
/* Outer width getter.
 * PARAMETERS :
 *  > target        Target selector or item.
 *  > margin        Include margins.
 * RETURNS :
 *  Target outer width.                                                         */
Component.prototype.shortcutOuterWidth = function(target, margin) {
    if (Toolkit.isNull(margin)) {
        margin = true;
    }
    
    return this.qs(target).outerWidth(margin);
};
/* Manual vertical re-sizing.
 * PARAMETERS :
 *  > target        Target selector.
 *  > difference    Target difference width (add/remove).
 * RETURNS : N/A                                                                */
Component.prototype.shortcutRealHeight = function(target, difference) {
    Toolkit.realHeight(this.qs(target), difference);
};
Component.prototype.shortcutAbsRealHeight = function(target, height) {
    Toolkit.absRealHeight(this.qs(target), height);
};
/* Manual horizontal re-sizing.
 * PARAMETERS :
 *  target          Target selector.
 *  difference      Target difference width (add/remove).
 * RETURNS : N/A                                                                */
Component.prototype.shortcutRealWidth = function(target, difference) {
    Toolkit.realWidth(this.qs(target), difference);
};
Component.prototype.shortcutAbsRealWidth = function(target, width) {
    Toolkit.absRealWidth(this.qs(target), width);
};
/* Executes a global centering on a element.
 * PARAMETERS :
 *  target          Target element.
 * RETURNS : N/A                                                                */
Component.prototype.shortcutCenter = function(target) {
    Toolkit.center(this.qs(target));
};
Component.prototype.shortcutCenterX = function(target) {
    Toolkit.centerX(this.qs(target));
};
Component.prototype.shortcutCenterY = function(target) {
    Toolkit.centerY(this.qs(target));
};
/* Executes an absolute positioning on a element.
 * PARAMETERS :
 *  target          Target element.
 *  hpos            Horizontal positionning.
 *  vpos            Vertical positionning.
 *  mode            Inversion mode.
 *                   0 Classic (left/top)
 *                   1 Horizontal switch (right/top)
 *                   2 Vertical switch (left/bottom)
 *                   3 Global switch (right/bottom)
 * RETURNS : N/A                                                                */
Component.prototype.shortcutPosition = function(target, hpos, vpos, mode) {
    var p;
    switch(mode) {
        case 0:
            p = {
                left: hpos,
                top: vpos
            };
            break;
        case 1:
            p = {
                right: hpos,
                top: vpos
            };
            break;
        case 2:
            p = {
                left: hpos,
                bottom: vpos
            };
            break;
        case 3:
            p = {
                right: hpos,
                bottom: vpos
            };
            break
        default:
            p = {
                left: hpos,
                top: vpos
            };
            break;
    }
    this.qs(target).addClass("positionAbsolute");
    this.qs(target).css(p);
};
/* Executes cleaning on a given element style.
 * PARAMETERS :
 *  target          Target element.
 *  property        CSS property.
 * RETURNS : N/A                                                                */
Component.prototype.shortcutClean = function(target, property) {
    this.qs(target).css(property, "");
};
/* Push or remove a HTML class on a given target.
 *  target          Target element.
 *  name            Class name.
 *  action          Action (add/remove).
 * RETURNS : N/A                                                                */
Component.prototype.shortcutClass = function(target, name, action) {
    if (Toolkit.isNull(action)) {
        this.qs(target).toggleClass(name);
    } else {
        if (action === "add") {
            this.qs(target).addClass(name);
        } else {
            this.qs(target).removeClass(name);
        }
    }
};
/* Push or remove HTML attribute on a given target.
 * PARAMETERS :
 *  target          Target element.
 *  attribute       Attribute name.
 *  value           Value (if null, deletes attribute).
 * RETURNS : N/A                                                                */
Component.prototype.shortcutAttribute = function(target, attribute, value) {
    if (Toolkit.isNull(value)) {
        this.qs(target).removeAttr(attribute);
    } else {
        this.qs(target).attr(attribute, value);
    }
};
/* Push or remove a CSS attribute on a given target.
 * PARAMETERS :
 *  target          Target element.
 *  attribute       Attribute name.
 *  value           Value.
 * RETURNS :
 *  Initial CSS value.                                                          */
Component.prototype.shortcutCss = function(target, attribute, value) {
    var res = this.qs(target).css(attribute);
    if (!Toolkit.isNull(value)) {
        this.qs(target).css(attribute, value);
    }
    return res;
};
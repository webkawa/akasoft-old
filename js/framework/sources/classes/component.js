/* Framework component.
 * Independant, semi-auto managed front-office component.
 * PARAMETERS :
 *  > container             Containing node.
 *  > descriptor            URL of description file.                            */

function Component(container, descriptor) {
    Toolkit.checkTypeOf(container, "object");
    Toolkit.checkClassOf(container, jQuery);
    Toolkit.checkTypeOf(descriptor, "string");
    
    this.container = container;
    this.descriptor = descriptor;
    this.model = null;
    this.methods = [];
    this.interface = "";
    this.datas = [];
    this.selectors = [];
    this.ltn;
    this.sources = [];
    this.state = "@None";
    this.status = 3;
    this.id = Register.add(this);
    this.dt = [];
        
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
        async: false,
        timeout: 500
    }).error(function(jqXHR, status, info) {
        var p = {
            url: this.url,
            info: info
        };
        throw new Error("cpn", 4, p);
    }).success(function(data) {
        this.model = data;
    });
    
    this.log("Tagging container");
    $(this.container).addClass("cpn" + this.getModelName());
    
    this.log("Loading selectors");
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
            ctx.selectors[ctx.selectors.length] = buff;
        }
    });
    
    this.log("Saving initial methods"); 
    this.registerMethod(this.go, "go", false);
    this.registerMethod(this.log, "log", true);
    this.registerMethod(this.retrigger, "retrigger", false);
    this.registerMethod(this.shortcutGet, "get", false);
    this.registerMethod(this.shortcutReselect, "reselect", false);
    this.registerMethod(this.shortcutTrigger, "trigger", false);
    this.registerMethod(this.shortcutOuterHeight, "outerHeight", false);
    this.registerMethod(this.shortcutOuterWidth, "outerWidth", false);
    this.registerMethod(this.shortcutRealHeight, "realHeight", false);
    this.registerMethod(this.shortcutRealWidth, "realWidth", false);
    this.registerMethod(this.shortcutCenter, "center", false);
    this.registerMethod(this.shortcutClean, "clean", false);
    this.registerMethod(this.shortcutClass, "class", false);
    this.registerMethod(this.shortcutAttribute, "attribute", false);
    this.registerMethod(this.shortcutCss, "css", false);
};
/* Container */
Component.prototype.getContainer = function() {
    return this.container;
};
/* Descriptor */
Component.prototype.getDescriptor = function() {
    return this.descriptor;
};
/* Model */
Component.prototype.getModelName = function() {
    return $(this.model).find("component").attr("name");
};
Component.prototype.getModelType = function() {
    return $(this.model).find("component").attr("type");
};
/* Methods */
Component.prototype.isMethod = function(name) {
    for (var i = 0; i < this.methods.length; i++) {
        if (this.methods[i].getName() === name) {
            return true;
        }
    }
    return false;
};
Component.prototype.getMethod = function(name, interface) {
    for (var i = 0; i < this.methods.length; i++) {
        if (this.methods[i].getName() === name) {
            if ((Toolkit.isNull(interface) && Toolkit.isNull(this.methods[i].getInterface())) || this.methods[i].getInterface() === interface) {
                return this.methods[i];
            }
        }
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
    for (var i = 0; i < this.methods.length; i++) {
        if (this.methods[i].equals(method)) {
            if (this.methods[i].isRewritable()) {
                this.methods[i] = method;
                return;
            } else {
                var p = {
                    component: this.getID(),
                    name: method.getName()
                };
                throw new Error("cpn", 7, p);
            }
        }
    }
    this.methods[this.methods.length] = method;
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
    for (var i = 0; i < this.selectors.length; i++) {
        if (this.selectors[i].getName() === name && this.selectors[i].getStatus()) {
            return true;
        }
    }
    return false;
};
Component.prototype.getSelector = function(name, refresh) {
    var cfg_ais = CFG.get("components", "allow.inactive.selectors");
    for (var i = 0; i < this.selectors.length; i++) {
        if (this.selectors[i].getName() === name) {
            if (this.selectors[i].getStatus() || cfg_ais) {
                if (refresh) {
                    this.selectors[i].refresh();
                }
                return this.selectors[i];
            } else {
                var p = {
                    name: name,
                    path: this.selectors[i].getPath()
                };
                throw new Error("cpn", 5, p);
            }
        }
    }
    var p = {
        name: name
    };
    throw new Error("cpn", 6, p);
};
Component.prototype.activeSelect = function() {
    var c = $(this.container);
    for (var i = 0; i < this.selectors.length; i++) {
        if (this.selectors[i].getStatus()) {
            c = c.add(this.selectors[i].getNodes());
        }
    }
    return c;
};
Component.prototype.quickSelect = function(name, refresh) {
    if (Toolkit.isNull(refresh)) {
        refresh = false;
    }
    
    if (name === "$BODY") {
        return $("body");
    }
    if (name === "$WINDOW") {
        return $(window);
    }
    if (name === "$SELF") {
        return this.container;
    }
    if (!Toolkit.isNull(this.ltn) && name === "$TRIGGERED") {
        return this.ltn;
    }

    return this.getSelector(name, refresh).getNodes();
};
Component.prototype.qs = function(name, select) {
    if (Toolkit.isNull(select)) {
        return this.quickSelect(name);
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
    var keyfrom = CFG.get("components", "css.prefix.from");
    var keyto = CFG.get("components", "css.prefix.to");
    var keyat = CFG.get("components", "css.prefix.at");
    var ctx = this;

    // Pre-clean
    $(this.model).find("state").each(function() {
        buff = keyfrom + $(this).attr("id") + " " +
                keyto + $(this).attr("id") + " " +
                keyat + $(this).attr("id");
        $(ctx.container).removeClass(buff);
    });

    // Adding classes
    if (from === "@None" && Toolkit.isNull(to)) {
        return;
    } else if (from === to) {
        $(this.container).addClass(keyat + from);
    } else if (Toolkit.isNull(to)) {
        $(this.container).addClass(keyfrom + from);
    } else if (from === "@None") {
        $(this.container).addClass(keyto + to);
    } else {
        $(this.container).addClass(keyfrom + from + " " + keyto + to);
    }
};
Component.prototype.setSwitchClass = function(mode) {
    var o = CFG.get("components", "css.class.out");
    var i = CFG.get("components", "css.class.in");

    if (mode === -1) {
        $(this.container).addClass(o);
    } else if (mode === 0) {
        $(this.container).removeClass(i);
    } else {
        $(this.container).removeClass(o);
        $(this.container).addClass(i);
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
    $(this.container).empty();
    $(this.container).append(data);
};
/* Triggers refresher.
 * Re-bind all triggers for the selected state.
 * PARAMETERS : N/A
 * RETURNS : N/A                                                                */
Component.prototype.retrigger = function() {
    var nodes = $([]);
    var targets;
    var bind;
    var ctx = this;

    nodes = $(nodes).add($(this.model).find('component > trigger'));
    nodes = $(nodes).add($(this.model).find('component > state[id="' + this.state + '"] > trigger'));

    var i = 0;
    $(nodes).each(function(i, item) {
        // Parsing
        targets = $([]);
        $(this).children("target").each(function() {
            targets = $(targets).add(ctx.quickSelect($(this).text(), $(this).attr("refresh") === "true"));
        });
        bind = $(this).attr("bind");

        // Binding
        $(targets).on(bind, function(event) {
            // Refreshing last triggered node
            ctx.ltn = $(this);
            
            // Preventing
            if ($(item).attr("prevent") === "true") {
                event.preventDefault();
            }
            
            // Transfering
            if ($(item).attr("stop") === "true") {
                event.stopPropagation();
            }

            // Executing
            $(item).children("action").each(function() {
                ctx.call.apply(this, [ctx]);
            });
        });
    });
};
/* Selector refresher.
 * Checks all selectors for activation/desactivation.
 * PARAMETERS : N/A
 * RETURNS : N/A                                                                */
Component.prototype.reselect = function() {
    var buff;
    for (var i = 0; i < this.selectors.length; i++) {
        buff = this.selectors[i];
        if (buff.getState() === this.state || Toolkit.isNull(buff.getState())) {
            buff.on();
            buff.refresh();
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
            return context.getMethod(name, interface).call(params, interface);
        } else {
            var t = setTimeout(function() {
                try {
                    context.getMethod(name, interface).call(params, interface);
                } catch (e) {
                    var p = {
                        component: context.getID(),
                        method: name
                    };
                    ErrorManager.process(new Error("cpn", 23, p, e));
                    context.stop();
                }
            }, delay);
            context.addDelayedTask(t);

            return 0;
        }
    } catch (e) {
        var p = {
            name: name
        };
        ErrorManager.process(new Error("cpn", 12, p, e));
        context.stop();
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
}
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
    var b1, b2;
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
        }

        var b3;
        $(this).children("goal").each(function() {
            b3 = ctx.call.apply(this, [ctx]);
        });

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

        Toolkit.isNull(b3) ?
                to[b1] = $(this).children("to").text() :
                to[b1] = b3;
    });

    // Setup
    $(targets).css(from);

    // Execution
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
            ctx.postback(postback);
        }
    };
    if ($(animation).children("progress").length === 1) {
        params.progress = function() {
            ctx.call.apply($(animation).children("progress"), [ctx]);
        };
    }
    ;
    $(targets).animate(to, params);
};
/* Executes a pre-saved sequence.
 * PARAMETERS :
 *  sequence                Descripting sequence node.
 * RETURNS : N/A                                                                */
Component.prototype.execute = function(sequence) {
    var lt;
    if ($(sequence).is("in"))
        lt = "in";
    else if ($(sequence).is("out"))
        lt = "out";
    else
        lt = "queue";
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
        var p = {
            component: this.getID(),
            error: "Component not ready"
        };
        throw new Error("cpn", 15, p);
    }
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
    var drt = CFG.get("components", "css.class.removal");

    try {
        // Cleaning delayed tasks
        this.clearDelayedTasks();

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

        // Unloading triggers
        this.activeSelect().unbind();

        // Executing exit sequence
        this.status = 1;
        if (!Toolkit.isNull(seq_exit)) {
            $(seq_exit).each(function() {
                ctx.execute(this);
            });
        }
        this.activeSelect().promise().done(function() {
            // Executes delayed removal
            $(ctx.getContainer()).find("." + drt).remove();

            // Switching state
            ctx.setState(to);

            // Setting classes
            ctx.setSwitchClass(1);

            // Revalidating selectors
            ctx.reselect();

            // Executing entry sequence
            ctx.setStatus(2);
            if (!Toolkit.isNull(seq_entry)) {
                $(seq_entry).each(function() {
                    ctx.execute(this);
                });
            }
            ctx.activeSelect().promise().done(function() {
                ctx.setStatus(0);
                if (Toolkit.isNull(to)) {
                    // Closing component
                    ctx.clean();
                } else {
                    // Executes delayed removal
                    $(ctx.getContainer()).find("." + drt).remove();

                    // Reloading triggers
                    ctx.retrigger();

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
                }
            });
        });
    } catch (e) {
        var p = {
            component: this.getID()
        };
        throw new Error("cpn", 14, p, e);
    }
};
/* Starts component to initial state.
 * PARAMETERS : N/A
 * RETURNS :
 *  True if starting was successfull, false else.                               */
Component.prototype.start = function() {
    this.log("Starting component");
    if (this.state !== "@None") {
        if (CFG.get("components", "allow.invalid.start")) {
            return false;
        } else {
            var p = {
                component: this.getID()
            };
            throw new Error("cpn", 10, p);
        }
    } else {
        // Writing initial DOM
        this.rewrite($(this.model).find("component > loader > dom").text());

        // Loading global selectors
        this.reselect();

        // Launching start actions
        var ctx = this;
        $(this.model).find("component > loader > action").each(function() {
            ctx.call.apply(this, [ctx]);
        });

        // Launching init actions
        for (var i = 0; i < this.methods.length; i++) {
            if (this.methods[i].getName().indexOf("init") === 0) {
                this.methods[i].call([]);
            }
        }

        // Migrating to initial state
        this.setStatus(0);
        this.go($(this.model).find("component > loader > to").text());
    }
};
/* Component deallocation.
 * PARAMETERS : N/A
 * RETURNS : N/A                                                                */
Component.prototype.stop = function() {
    this.log("Cleaning component");

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
    this.getSelector(selector, true);
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
/* Manual horizontal re-sizing.
 * PARAMETERS :
 *  target          Target selector.
 *  difference      Target difference width (add/remove).
 * RETURNS : N/A                                                                */
Component.prototype.shortcutRealWidth = function(target, difference) {
    Toolkit.realWidth(this.qs(target), difference);
};
/* Executes a vertical centering on a element.
 * PARAMETERS :
 *  target          Target element.
 * RETURNS : N/A                                                                */
Component.prototype.shortcutCenter = function(target) {
    Toolkit.center(this.qs(target));
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
 *  value           Value (if null, deletes attribute).
 * RETURNS : N/A                                                                */
Component.prototype.shortcutCss = function(target, attribute, value) {
    if (Toolkit.isNull(value)) {
        this.qs(target).css(attribute, "");
    } else {
        this.qs(target).css(attribute, value);
    }
};
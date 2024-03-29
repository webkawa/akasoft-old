/* Framework component datasource.
 * Manages loading, update and exploitation of an XML data source.
 * PARAMETERS :
 *  > name              Data source name.
 *  > service           Service URL.     
 *  > backup            Backup state.                                       
 *  > callbacks         Callbacks as array.                                     */

function Source(name, service, backup, callbacks) {
    Toolkit.checkTypeOf(name, "string");
    Toolkit.checkTypeOf(service, "string");
    Toolkit.checkTypeOf(backup, "string");
    if (!Toolkit.isNull(callbacks)) {
        Toolkit.checkTypeOf(callbacks, "object");
    }
    if (Toolkit.isNull(callbacks)) {
        callbacks = [];
    }
    
    this.owner;
    this.name = name;
    this.backup = backup;
    this.service = service;
    this.data;
    this.callbacks = callbacks;
    
};
/* Owner */
Source.prototype.getOwner = function() {
    return this.owner;
};
Source.prototype.setOwner = function(owner) {
    Toolkit.checkClassOf(owner, Component);

    this.owner = owner;
};
/* Name */
Source.prototype.getName = function() {
    return this.name;
};
/* Backup */
Source.prototype.getBackup = function() {
    return this.backup;
};
/* Service */
Source.prototype.getService = function() {
    return this.service;
};
/* Data */
Source.prototype.getData = function(selector) {
    if (Toolkit.isNull(this.data)) {
        var p = {
            source: this.name,
            component: this.owner.getID()
        };
        throw new Error("cpn", 26, p);
    }
    if (Toolkit.isNull(selector)) {
        return $(this.data);
    } else {
        return $(this.data).find(selector);
    }
};
Source.prototype.getDataByKey = function(model, key, value) {
    var base = this.getData('s.' + model);
    var result = $([]);
    $(base).each(function() {
        if ($(this).children('i.' + key).text() === value) {
            result = $(result).add(this);
        }
    });
    return result;
};
Source.prototype.getDataByKeys = function(model, couples) {
    var base = this.getData('s.' + model);
    var result = $([]);
    $(base).each(function() {
        var b = true;
        for (var i = 0; i < couples.length; i++) {
            if ($(this).children('i.' + couples[i].key).text() === couples[i].value) {
                b = false;
            }
        }
        if (b) {
            result = $(result).add(this);
        }
    });
    return result;
};
Source.prototype.hasData = function() {
    return !Toolkit.isNull(this.data);
};
/* Callbacks. */
Source.prototype.getCallbacks = function() {
    return this.callbacks;
};
Source.prototype.addCallback = function(callback, interface) {
    Toolkit.checkTypeOf(callback, "string");
    
    this.callbacks[this.callbacks.length] = {
        call: callback,
        interface: interface
    };
};
/* Data selector.
 * PARAMETERS :
 *  > selector          Selector.
 * RETURNS : N/A                                                            */
Source.prototype.select = function(selector) {
    return $(this.data).find(selector);
};
/* Data loader.
 * Executes an asynchronious AJAX call to the data service, memorize XML
 * result, and execute callbacks.
 * PARAMETERS :
 *  > params            Service parameters.
 *  > mode              Call mode (default : POST).
 * RETURNS : N/A                                                            */
Source.prototype.load = function(params, mode) {
    if (Toolkit.isNull(this.data)) {
        this.loadForce(params, mode);
    }
};
Source.prototype.loadForce = function(params, mode) {
    var error;
    var errorlength;
    var buff;
    var method;
    var ctx = this;
    
    if (Toolkit.isNull(mode)) {
        mode = "POST";
    }

    this.getOwner().log("Accessing data at URL " + ctx.getService());
    jQuery.ajax({
        context: ctx,
        type: mode,
        url: ctx.getService(),
        data: params,
        dataType: "xml",
        cache: true,
        async: true,
        timeout: 5000
    }).error(function(jqXHR, status, info) {
        var p = {
            url: this.service,
            info: info
        };
        ErrorManager.process(new Error("cpn", 18, p));
        this.owner.go(this.backup);
    }).done(function(data) {
        try {
            // Copying data
            this.data = data;

            // Checking for native error
            errorlength = $(this.data).find("data > error").length;
            for (var i = 0; i < errorlength; i++) {
                var id = $(this.data).find("data > error:eq(" + (errorlength - i - 1) + ")").attr("id");
                var p = {};
                $(this.data).find("data > error:eq(" + (errorlength - i - 1) + ") > parameter").each(function() {
                    p[$(this).attr("name")] = $(this).text();
                });
                error = new Error("wf", parseInt(id), p, error);
            }
            if ($(this.data).find("data > error").length > 0) {
                p = {
                    component: ctx.getOwner().getID(),
                    source: ctx.getName()
                };
                throw new Error("cpn", 20, p, error);
            }

            // Linking 
            buff = $(this.data).find("data:first");
            $(this.data).find("model").each(function() {
                // Selecting set
                buff = $(buff).children("s");

                // Linking set
                $(buff).attr("class", $(this).attr("alias").toLowerCase());

                // Linking items
                $(this).children("column").each(function(position) {
                    $(buff).find("s > i:eq(" + position + ")").attr("class", $(this).text().toLowerCase());
                });
            });

            // Executes callbacks.
            for (var i = 0; i < this.callbacks.length; i++) {
                method = this.getOwner().getMethod(this.callbacks[i].call, this.callbacks[i].interface);
                method.call([]);
            }

            return;
        } catch (e) {
            ErrorManager.process(e);
            this.owner.go(this.backup);
        }
    });
};
/* Data getter.
 * Execute data loading on the data source with forced POST or GET mode.
 * PARAMETERS :
 *  > params        Call parameters.
 * RETURNS : N/A                                                                */
Source.prototype.get = function(params) {
    this.load(params, "GET");
};
Source.prototype.getForce = function(params) {
    this.loadForce(params, "GET");
};
Source.prototype.post = function(params) {
    this.load(params, "POST");
};
Source.prototype.postForce = function(params) {
    this.loadForce(params, "POST");
};
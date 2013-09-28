/* Logger tool.
 * Log is a pseudo-class, offering only static methods, with no
 * error-based parameters check.                                                */

var Log = {
    cfg_display: null,
    cfg_plength: null,
    cfg_mlength: null,
    cfg_clength: null,
    count: 1,
    
    /* Starter */
    start: function() {
        Log.cfg_display = CFG.get("logs", "display");
        Log.cfg_plength = CFG.get("logs", "display.length.prefix");
        Log.cfg_mlength = CFG.get("logs", "display.length.message");
        Log.cfg_clength = CFG.get("logs", "display.length.directout");
    },
    
    /* Writers */
    writers: [],
    getWriter: function(id) {
        for (var i = 0; i < Log.writers.length; i++) {
            if (Log.writers[i].getLogID() === id) {
                return Log.writers[i];
            }
        }
        var p = {
            id: id
        };
        throw new Error("logs", 3, p);
    },
    addWriter: function(writer) {
        for (var i = 0; i < Log.writers.length; i++) {
            if (Log.writers[i].getLogID() === writer.getLogID()) {
                var p = {
                    id: writer.getLogID(),
                    entity: writer
                };
                throw new Error("logs", 2, p);
            }
        }
        Log.writers[Log.writers.length] = writer;
        return writer;
    },
            
    /* Last writer */
    lastwriter: null,
    getLastWriter: function() {
        return Log.lastwriter;
    },
            
    /* Direct printer.
     * PARAMETERS :
     *  > author                Author entity.
     *  > message               Text message.
     *  > directout             Complementary direct output.
     * RETURNS : N/A                                                            */
    print: function(author, say, directout) {
        if (!Log.cfg_display) {
            return;
        }
        
        var writer = null;
        var prefix = "";
        var message = "";
        var messagepre = "";
        var complement = "";
        var buff = "";
        
        // Writer verification
        try {
            writer = Log.getWriter(author.getLogID());
        } catch (e) {
            writer = Log.addWriter(new LogWriter(author));
        }
        
        // Clear
        Log.count++;
        if (Log.count % 1000 === 0) {
            console.clear();
        }
        
        // Prefix
        prefix = "\n";
        if (writer === Log.getLastWriter()) {
            buff  = Toolkit.followingChars(writer.getCount(), 6, ".");
                
            prefix += Toolkit.leadingChars(buff, Log.cfg_plength, " ");
        } else {
            buff  = Toolkit.formatDate(new Date(), "exacthour");
            buff += " ";
            buff += Toolkit.followingChars(writer.getCount(), 6, ".");
            
            prefix += Toolkit.leadingChars(buff, Log.cfg_plength, " ");
        }
        
        // Message
        messagepre = Toolkit.repeatedString(Log.cfg_plength, " ");
        message  = "From : ";
        message += writer.getLogID();
        message += "\n";
        message += messagepre;
        message += Toolkit.cut(say, Log.cfg_mlength).join("\n" + messagepre);
        
        // Complement
        if (!Toolkit.isNull(directout)) {
            complement  = "\n";
            complement += Toolkit.leadingChars("Direct output ", Log.cfg_plength, " ");
            complement += Toolkit.cut(directout, Log.cfg_clength).join("\n" + messagepre);
        }
        
        // Fill last writer
        Log.lastwriter = writer;
        
        // Increase writer count
        writer.increaseCount();
        
        // Print
        console.log(prefix + message + complement);
    }
};
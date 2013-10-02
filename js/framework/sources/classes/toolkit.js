/* Framework general interest tools.
 * Toolkit is a pseudo-class, offering only static methods, with no error-based
 * parameters check.                                                            */
var Toolkit = { 
    
    /* Generates repeated string.
     * PARAMETERS : 
     *  > value         Value to repeat.
     *  > size          Number of iterations.
     * RETURBS : repeated string.                                               */
    repeatedString: function(size, value) {
        var result = "";
        for (var i = 0; i < size; i++) {
            result += value;
        }
        return result;
    },
    
    /* Adds leading chars to a string.
     * PARAMETERS :
     *  > value         Base value.
     *  > fulllength    Full length of value with leading chars.
     *  > char          Leading char.
     * RETURNS : 
     *  Value with leading chars.                                               */
    leadingChars: function(value, fulllength, char) {
        var valuelength = value.toString().length;
        var result = '';
        for (var i = 0; i < fulllength - valuelength; i++) {
            result += char;
        }
        result += value;
        return result;
    },
    
    /* Adds following chars to a string.
     * PARAMETERS :
     *  > value         Base value.
     *  > fulllength    Full length of value with following chars.
     *  > char          Following char.
     * RETURNS :
     *  Value with following chars.                                             */
    followingChars: function(value, fulllength, char) {
        var valuelength = value.toString().length;
        var result = value;
        for (var i = 0; i < fulllength - valuelength; i++) {
            result += char;
        }
        return result;
    },
    
    /* Shorten a string at selected size.
     * PARAMETERS :
     *  > base                      Base string.
     *  > length                    String length.
     * RETURNS :
     *  Shortened string.                                                       */
    shorten: function(base, length){
        return base.substr(0, length) + (base.length > length ? '...' : '');
    },
            
    /* Cut a string at the selected size.
     * PARAMETERS :
     *  > value                     Base value.
     *  > size                      Lines size.
     * RETURNS :
     *  Array of text lines.                                                    */
     cut: function(value, size) {
         var lines = [];
         var sum = 0;
         var p = 0;
         
         p = size;
         while (p < value.length) {
             while (value.charAt(p) !== " " && value.charAt(p) !== "\n" && p > sum) {
                 p--;
             }
             if (p === sum) {
                 p = sum + size;
             }
             lines[lines.length] = value.substr(sum, p - sum);
             sum = p + 1;
             p = Math.min(sum + size, value.length);
         }
         lines[lines.length] = value.substr(sum);
         
         return lines;
     },
    
    /* Converts and returns a date to an appropriate string format.
     * PARAMETERS:
     *  > date          Date to convert.
     *  > format        Expected format (allows : exacthour, en - default).
     * RETURNS : 
     *  Correctly formated date.                                                */
    formatDate: function(date, format) {
        if (Toolkit.isNull(format)) {
            format = 'en';
        }
        if (format === "exacthour") {
            return this.leadingChars(date.getHours(), 2, '0') +
                   ':' +
                   this.leadingChars(date.getMinutes(), 2, '0') +
                   ':' +
                   this.leadingChars(date.getSeconds(), 2, '0') +
                   '.' +
                   this.followingChars(date.getMilliseconds(), 3, '0');
        }
        if (format === 'en') {
            return date.getFullYear() +
                   '.' +
                   this.leadingChars(date.getMonth() + 1, 2, '0') +
                   '.' +
                   this.leadingChars(date.getDate(), 2, '0') +
                   ' ' +
                   this.leadingChars(date.getHours(), 2, '0') +
                   ':' +
                   this.leadingChars(date.getMinutes(), 2, '0') +
                   ':' +
                   this.leadingChars(date.getSeconds(), 2, '0') +
                   '.' +
                   this.followingChars(date.getMilliseconds(), 3, '0');
        }
    },
    
    /* Checks if a variable is correctly initialized with a pre-assigned format
     * and throws an error if necessary.
     * PARAMETERS :
     *  > value         Variable value.
     *  > type          Expected JS type as result of typeof() function.
     * RETURNS : N/A                                                            */
    checkTypeOf: function(value, type) {
        var rtype = typeof(value);
        if (rtype === "undefined" || rtype !== type) {
            var p = {
                value: value,
                type: type,
                rtype: rtype
            };
            throw new Error("core", 5, p);
        }
    },
    
    /* Checks if a variable is correctly initialized with a pre-assigned class
     * and throws an error if necessary.
     * PARAMETERS :
     *  > value         Variable value.
     *  > prototype     Class prototype.                                        
     * RETURNS : N/A                                                            */
    checkClassOf: function(value, prototype) {
        Toolkit.checkTypeOf(value, "object");
        if (!(value instanceof prototype)) {
            var p = {
                value: value,
                proto: prototype
            };
            throw new Error("core", 6, p);
        }
    },
    
    /* Checks if a variable is undefined.
     * PARAMETERS :
     *  > value         Checked value.
     * RETURNS :
     *  true if value is undefined, false else.                                 */
    isNull: function(value) {
        return typeof(value) === "undefined";
     },
     
    /* Executes a vertical resizing on a element.
     * PARAMETERS :
     *  > target        Target element.
     *  > difference    Target difference height (add/remove).
     * RETURNS : N/A                                                           */
    realHeight: function(target, difference) {
        var height;
        if (Toolkit.isNull(difference)) {
            height = $(target).parent().height();
        } else {
            height = $(target).parent().height() + parseInt(difference);
        }
        Toolkit.absRealHeight(target, height);
    },
             
    /* Executes an horizontal resizing on a element.
     * PARAMETERS :
     *  > target        Target element.
     *  > difference    Target difference width (add/remove).
     * RETURNS : N/A                                                            */
    realWidth: function(target, difference) {
        var width;
        if (Toolkit.isNull(difference)) {
            width = $(target).parent().width();
        } else {
            width = $(target).parent().width() + parseInt(difference);
        }
        Toolkit.absRealWidth(target, width);
    },
            
    /* Executes an (absolute) vertical resizing on a element.
     * PARAMETERS :
     *  > target        Target element.
     *  > height        Height.
     * RETURNS : N/A                                                           */
    absRealHeight: function(target, height) {
        var padding;
        $(target).each(function(i, buff) {
            padding = $(buff).outerHeight(true) - $(buff).height();
            $(buff).height(height - padding);
        });
    },
             
    /* Executes an (absolute) horizontal resizing on a element.
     * PARAMETERS :
     *  > target        Target element.
     *  > width         Width.
     * RETURNS : N/A                                                            */
    absRealWidth: function(target, width) {
        var padding;
        $(target).each(function(i, buff) {
            padding = $(buff).outerWidth(true) - $(buff).width();
            $(buff).width(width - padding);
        });
    },
    
    /* Executes a centering on a element.
     * PARAMETERS :
     *  > target         Target element.
     * RETURNS : N/A                                                            */
    center: function(target) {
        $(target).css({
            "margin-top": "",
            "margin-right": "",
            "margin-bottom": "",
            "margin-left": ""
        });
        $(target).css("margin-top", (($(target).parent().height() - $(target).outerHeight(false)) / 2) + "px");
        $(target).css("margin-left", (($(target).parent().width() - $(target).outerWidth(false)) / 2) + "px");
    },
    centerX: function(target) {
        $(target).css({
            "margin-right": "",
            "margin-left": ""
        });
        $(target).css("margin-left", (($(target).parent().width() - $(target).outerWidth(false)) / 2) + "px");
    },
    centerY: function(target) {
        $(target).css({
            "margin-top": "",
            "margin-bottom": "",
        });
        $(target).css("margin-top", (($(target).parent().height() - $(target).outerHeight(false)) / 2) + "px");
    }
};
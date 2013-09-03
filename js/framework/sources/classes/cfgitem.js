/*  Configuration variable.
 *  Simple, independant configuration variable caracterized by a group, key, level
 *  and type.                                                                   */

function CFGItem(group, key, level, type, value) {
    Toolkit.checkTypeOf(group, "string");
    Toolkit.checkTypeOf(key, "string");
    Toolkit.checkTypeOf(level, "number");
    Toolkit.checkTypeOf(type, "string");

    this.group = group;
    this.key = key;
    this.level = level;
    this.type = type;
    
    /* Value */
    try {
        if (this.type === "string")         this.value = value;
        else if (this.type === "integer")   this.value = parseInt(value);
        else if (this.type === "float")     this.value = parseFloat(value);
        else if (this.type === "date")      this.value = Date.parse(value);
        else if (this.type === "boolean")   this.value = (value === "true");
    } catch(jse) {
        var p1 = {
            name: jse.name,
            message: jse.message
        };
        var c = new Error("core", 2, p1);
        var p2 = {
            group: this.group,
            key: this.key,
            value: value,
            type: this.type
        };
        throw new Error("cfg", 4, p2, c);
    };
    this.getValue = function() {
        return this.value;
    };
};
/* Group */
CFGItem.prototype.getGroup = function() {
    return this.group;
};
/* Key */
CFGItem.prototype.getKey = function() {
    return this.key;
};
/* Level */
CFGItem.prototype.getLevel = function() {
    return this.level;
};
/* Type */
CFGItem.prototype.getType = function() {
    return this.type;
};
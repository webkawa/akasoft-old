/* Left link.
 * Left navigation link.                                                        */

function LeftLinkCPN(ctn, setup) {
    var cpn = new Component(ctn, "js/components/leftlink.xml");
    
    s = {
        target: "hover",
        state: "Close"
    };
    cpn.saveInterface(HoverableITF, s);
    
    cpn.register("link", setup.link);
    cpn.register("title", setup.title);
    cpn.register("description", setup.description);
    cpn.register("image", setup.image);
    cpn.register("color", setup.color);
    cpn.register("altcolor", setup.altcolor);
    
    cpn.registerMethod(this.init, "init", false);
    
    return cpn;
}
/* Initialization. */
LeftLinkCPN.prototype.init = function() {
    this.qs("title").text(this.title);
    this.qs("description").text(this.description);
    this.qs("icon").attr("src", "data/img/" + this.image);
    this.qs("icon").css("background-color", this.color);
    this.qs("wrapper").css("background-color", this.color);
};
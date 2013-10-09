/* Left link.
 * Left navigation link.                                                        */

function LeftLinkCPN(ctn, setup) {
    var cpn = new Component(ctn, "js/components/layout/leftlink.xml");
    
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
    this.qs("link").attr("href", "#" + this.link);
    this.qs("icon").attr("src", "data/img/" + this.image);
    this.qs("icon").css("background-color", this.color);
    this.qs("wrapper").css("background-color", this.color);
    
    this.qs("title").text(this.title);
    
    this.qs("description").html(this.description);
    this.qs("description").children("span").addClass("displayBlock size16px");
    this.qs("description", "span:eq(0)").addClass("marginV8px");
    this.qs("description", "span:eq(1)").addClass("textRight");
    this.qs("description", "span > a > span").addClass("marginR2px marginT4px paddingH8px paddingV2px radius4px colorWhite").css("background-color", this.altcolor);
};
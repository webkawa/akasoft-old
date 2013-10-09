/* Right link.
 * Right navigation link.                                                        */

function RightLinkCPN(ctn, setup) {
    var cpn = new Component(ctn, "js/components/layout/rightlink.xml");
    
    cpn.register("image", setup.image);
    cpn.register("title", setup.title);
    cpn.register("color", setup.color);
    cpn.register("altcolor", setup.altcolor);
    
    cpn.registerMethod(this.init, "init", false);
    
    return cpn;
}
/* Initialization. */
RightLinkCPN.prototype.init = function() {
    this.qs("title").text(this.title);
    this.qs("icon").attr("src", "data/img/" + this.image);
    this.qs("icon").css("background-color", this.color);
    this.qs("wrapper").css("background-color", this.color);
};
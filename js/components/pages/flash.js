/* Flash page.                                                              */

function FlashCPN(ctn, setup) {
    Toolkit.checkTypeOf(setup.title, "string");
    Toolkit.checkTypeOf(setup.message, "string");
    Toolkit.checkTypeOf(setup.icon, "string");
    Toolkit.checkTypeOf(setup.linklabel, "string");
    Toolkit.checkTypeOf(setup.linkreference, "string");
    
    var cpn = new Component(ctn, "js/components/pages/flash.xml");
    
    cpn.register("title", setup.title, false);
    cpn.register("message", setup.message, false);
    cpn.register("icon", setup.icon, false);
    cpn.register("linklabel", setup.linklabel, false);
    cpn.register("linkreference", setup.linkreference, false);
    
    cpn.registerMethod(this.init, "init", false);
    
    return cpn;
}
FlashCPN.prototype.init = function() {
    this.qs("title").text(this.title);
    this.qs("title").css("background-image", "url('data/img/visuals/" + this.icon + "')");
    this.qs("message").text(this.message);
    this.qs("link").text(this.linklabel);
    this.qs("link").attr("href", "#" + this.linkreference);
};
/* Product push. */
function ProductPushCPN(ctn, setup) {
    var cpn = new Component(ctn, "js/components/widgets/productPush.xml");
    
    Toolkit.checkTypeOf(setup.on, "string");
    Toolkit.checkTypeOf(setup.off, "string");
    Toolkit.checkTypeOf(setup.legend, "string");
    Toolkit.checkTypeOf(setup.link, "string");
    
    cpn.register("on", setup.on);
    cpn.register("off", setup.off);
    cpn.register("legend", setup.legend);
    cpn.register("link", setup.link);
    cpn.register("special", setup.special);
    
    cpn.registerMethod(this.init, "init", false);
    
    return cpn;
}
ProductPushCPN.prototype.init = function() {
    this.qs("link").attr("href", this.link);
    if (this.special) {
        this.qs("link").addClass("special");
    }
    this.qs("on").attr("src", this.on);
    this.qs("off").attr("src", this.off);
    this.qs("legend").text(this.legend);
};
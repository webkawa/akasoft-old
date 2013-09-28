/* Layout.
 * Global site layout.                                                          */

function LayoutCPN() {
    var cpn = new Component($("body > div"), "js/components/layout.xml");
    var setup;
    
    setup = {
        load: ['image'],
        back: "Ready"
    };
    cpn.saveInterface(LoadableITF, setup);
    
    setup = {
        target: "image",
        container: "$SELF",
        mode: 3
    };
    cpn.saveInterface(EnhanceableITF, setup);
    
    cpn.registerMethod(this.refresh, "refresh", false);
    cpn.registerMethod(this.start, "start", false);
    
    return cpn;
}
/* Refresher. */
LayoutCPN.prototype.refresh = function() {
    this.getMethod("refresh", "Enhanceable").call([]);
    this.getMethod("center").call(['inner']);
};
/* Body starter. */
LayoutCPN.prototype.start = function() {
    new BodyCPN(this.qs("inner")).start();
};
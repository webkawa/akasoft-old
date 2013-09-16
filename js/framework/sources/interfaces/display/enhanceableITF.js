/* Enhanceable interface.
 * Enhanceable object, valued by central positionment and resizing.
 * PARAMETERS :
 *  > cpn                     * Owner component.
 *  > setup.target            * Enhanced target.
 *  > setup.container         * Referenced container.
 *  > setup.mode                Maximizing mode.
 *                               0  No (default)
 *                               1  Width
 *                               2  Height
 *                               3  Mixed (with overflow)
 *                               4  Mixed (without overflow)
 *                               5  Both
 *  > setup.ratio               Width/height ratio.                             */

function EnhanceableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.target, "string");
    Toolkit.checkTypeOf(setup.container, "string");
    
    cpn.registerMethod(EnhanceableITF.prototype.init, "init", false);
    cpn.registerMethod(EnhanceableITF.prototype.refresh, "refresh", false);
    cpn.registerMethod(EnhanceableITF.prototype.resize, "resize", false);
    cpn.registerMethod(EnhanceableITF.prototype.recenter, "recenter", true);
}
/* Name. */
EnhanceableITF.prototype.name = "Enhanceable";
/* Initialization. */
EnhanceableITF.prototype.init = function(setup) {
    var ratio = this.qs(setup.target).outerWidth(true) / this.qs(setup.target).outerHeight(true);
    this.register("enhance_ratio", ratio, true);
    
    this.qs(setup.container).addClass("overflowHidden");
    this.qs(setup.target).addClass("positionAbsolute");
};
/* Global refreshing. */
EnhanceableITF.prototype.refresh = function() {
    this.getMethod("resize", "Enhanceable").call([]);
    this.getMethod("recenter", "Enhanceable").call([]);
};
/* Resizing. */
EnhanceableITF.prototype.resize = function(setup) {
    switch (setup.mode) {
        case 1:
            this.getMethod("realWidth").call([setup.target]);
            this.qs(setup.target).css("height", "");
            break;
        case 2:
            this.qs(setup.target).css("width", "");
            this.getMethod("realHeight").call([setup.target]);
            break;
        case 3:
            if (this.qs(setup.container).width() / this.qs(setup.container).height() > this.enhance_ratio) {
                this.getMethod("realWidth").call([setup.target]);
                this.qs(setup.target).css("height", this.qs(setup.target).width() / this.enhance_ratio);
            } else {
                this.getMethod("realHeight").call([setup.target]);
                this.qs(setup.target).css("width", this.qs(setup.target).height() * this.enhance_ratio);
            }
            break;
        case 4:
            if (this.qs(setup.container).width() / this.qs(setup.container).height() > this.enhance_ratio) {
                this.getMethod("realHeight").call([setup.target]);
                this.qs(setup.target).css("width", this.qs(setup.target).height() * this.enhance_ratio);
            } else {
                this.getMethod("realWidth").call([setup.target]);
                this.qs(setup.target).css("height", this.qs(setup.target).width() / this.enhance_ratio);
            }
            break;
        case 5:
            this.getMethod("realWidth").call([setup.target]);
            this.getMethod("realHeight").call([setup.target]);
            break;
    }
};
/* Recentering. */
EnhanceableITF.prototype.recenter = function(setup) {
    var l = (this.qs(setup.container).width() - this.qs(setup.target).outerWidth(true)) / 2;
    var t = (this.qs(setup.container).height() - this.qs(setup.target).outerHeight(true)) / 2;
    this.qs(setup.target).css({
        left: l + "px",
        top: t + "px"
    });
};
/* Slidable interface.
 * Allow simplified management of a bi-directionnal slider.
 * PARMATERS :
 *  > cpn                     * Component.
 *  > setup.source            * Slider source.
 *  > setup.build             * Build method.
 *  > setup.buildITF            Build method interface.
 *  > setup.stateLoadNext     * Next (right) slide loading state.
 *  > setup.stateLoadBack       Back (left) slide loading state.
 *  > setup.stateBack           Back state.                                     */

function SlidableITF(cpn, setup) {
    Toolkit.checkTypeOf(setup.source, "string");
    Toolkit.checkTypeOf(setup.build, "string");
    Toolkit.checkTypeOf(setup.stateLoadNext, "string");
    
    cpn.registerMethod(SlidableITF.prototype.init, "init", false);
    cpn.registerMethod(SlidableITF.prototype.start, "start", false);
    cpn.registerMethod(SlidableITF.prototype.to, "to", false);
    cpn.registerMethod(SlidableITF.prototype.next, "next", false);
    cpn.registerMethod(SlidableITF.prototype.back, "back", false);
    cpn.registerMethod(SlidableITF.prototype.build, "build", false);
};
/* Name. */
SlidableITF.prototype.name = "Slidable";
/* Initialization. */
SlidableITF.prototype.init = function(setup) {
    this.register("slide", -1);
    this.getSource(setup.source).addCallback("start", "Slidable");
};
/* Navigation. */
SlidableITF.prototype.start = function(setup) {
    this.register("slideLength", this.getSourceData(setup.source, 's[class="slide"]').length, true);
    this.getMethod("to", "Slidable").call([0]);
};
SlidableITF.prototype.to = function(setup, to) {
    var from = this.slide;
    
    this.slide = to;
    if ((from === 0 && to === this.slideLength - 1) || (from > to && !(from === this.slideLength - 1 && to === 0)) && !Toolkit.isNull(setup.stateLoadBack)) {
        this.go(setup.stateLoadBack);
    } else {
        this.go(setup.stateLoadNext);
    }
};
SlidableITF.prototype.next = function(setup) {
    var l = this.getSourceData(setup.source, 's[class="slide"]').length;
    if (this.slide === this.slideLength - 1) {
        this.getMethod("to", "Slidable").call([0]);
    } else {
        this.getMethod("to", "Slidable").call([this.slide + 1]);
    }
};
SlidableITF.prototype.back = function(setup) {
    if (this.slide === 0) {
        this.getMethod("to", "Slidable").call([this.slideLength - 1]);
    } else {
        this.getMethod("to", "Slidable").call([this.slide - 1]);
    }
};
SlidableITF.prototype.build = function(setup) {
    this.getMethod(setup.build, setup.buildITF).call([this.getSourceData(setup.source, 's[class="slide"]:eq(' + this.slide + ')')]);
    if (!Toolkit.isNull(setup.stateBack)) {
        this.go(setup.stateBack);
    }
};
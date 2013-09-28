/* Homepage.                                                                    */

function HomeCPN(ctn) {
    var cpn = new Component(ctn, "js/components/pages/home.xml");
    
    cpn.registerSource("slider", "data/site/hpslider.xml", "Ready");
    
    var s = {
        source: "slider",
        build: "build",
        stateLoadNext: "LoadNext",
        stateLoadBack: "LoadBack",
        stateBack: "Ready"
    };
    cpn.saveInterface(SlidableITF, s);
    
    var s = {
        container: "foot",
        columns: "footChilds",
        classFirstExcept: "borderLeft1px border444"
    };
    cpn.saveInterface(ColumnableITF, s);
    
    cpn.registerMethod(this.init, "init", false);
    cpn.registerMethod(this.build, "build", false);
    cpn.registerMethod(this.sliderNextOrigin, "nextOrigin", false);
    cpn.registerMethod(this.sliderNextGoal, "nextGoal", false);
    cpn.registerMethod(this.sliderBackOrigin, "backOrigin", false);
    cpn.registerMethod(this.sliderBackGoal, "backGoal", false);
    
    return cpn;
}
HomeCPN.prototype.init = function() {
    this.getMethod("refresh", "Columnable").call([]);
};
HomeCPN.prototype.build = function(slide) {
    this.qs("slide").remove();
    this.qs("footLeft").empty();
    this.qs("footCenter").empty();
    this.qs("footRight").empty();
    
    var buff =  '<div class="in width100per height100per">';
        buff += '<div class="positionAbsolute width100per height100per backgroundWhite opacity04" />'
        buff += '<div class="positionAbsolute">';
        buff += $(slide).children('i[class="center"]').text();
        buff += '</div>';
        buff += '</div>';
    
    this.qs("slider").append(buff);
    this.qs("footLeft").append($(slide).children('i[class="footleft"]').text());
    this.qs("footCenter").append($(slide).children('i[class="footcenter"]').text());
    this.qs("footRight").append($(slide).children('i[class="footright"]').text());
};
HomeCPN.prototype.sliderNextOrigin = function() {
    return ($(window).width() - this.qs("slider").offset().left) + "px";
};
HomeCPN.prototype.sliderNextGoal = function() {
    return (0 - this.qs("slider").offset().left - this.qs("slide").outerWidth(false)) + "px";
};
HomeCPN.prototype.sliderBackOrigin = function() {
    return (0 - this.qs("slider").offset().left - this.qs("slide").outerWidth(false)) + "px";
};
HomeCPN.prototype.sliderBackGoal = function() {
    return ($(window).width() - this.qs("slider").offset().left) + "px";
}; 
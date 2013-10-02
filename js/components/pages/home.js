/* Homepage.                                                                    */

function HomeCPN(ctn) {
    var cpn = new Component(ctn, "js/components/pages/home.xml");
    
    cpn.register("autoplay", true, true);
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
    
    cpn.registerMethod(this.build, "build", false);
    cpn.registerMethod(this.sliderNextOrigin, "nextOrigin", false);
    cpn.registerMethod(this.sliderNextGoal, "nextGoal", false);
    cpn.registerMethod(this.sliderBackOrigin, "backOrigin", false);
    cpn.registerMethod(this.sliderBackGoal, "backGoal", false);
    cpn.registerMethod(this.auto, "auto", false);
    cpn.registerMethod(this.stop, "stop", false);
    
    return cpn;
}
HomeCPN.prototype.build = function(slide) {
    this.qs("slide").remove();
    this.qs("footLeft").empty();
    this.qs("footCenter").empty();
    this.qs("footRight").empty();
    
    var buff =  '<div class="in width100per height100per">';
        buff += '<div class="positionAbsolute width100per height100per backgroundWhite opacity04" />'
        buff += '<div class="positionAbsolute width100per height100per">';
        buff += $(slide).children('i[class="center"]').text();
        buff += '</div>';
        buff += '</div>';
    
    this.qs("slider").append(buff);
    
    this.qs("footLeft").append($(slide).children('i[class="footleft"]').text());
    this.qs("footCenter").append($(slide).children('i[class="footcenter"]').text());
    this.qs("footRight").append($(slide).children('i[class="footright"]').text());
    
    this.getSelector("slideIn").refresh();
    this.getSelector("footChilds").refresh();
    
    this.qs("footChilds", "h2, p").addClass("displayInline");
    this.qs("footChilds", "h2").addClass("marginT8px line12px");
    this.qs("footChilds", "p").addClass("nowrap size16px");
    this.qs("footChilds", "a").addClass("displayBlock positionAbsolute bottom8px nowrap radius4px paddingV2px paddingH8px weightBold background444 colorWhite textRight size16px");
    switch($(slide).children('i[class="id"]').text()) {
        case 'fasttrack':
            this.qs("slideIn", "img").css({
                position: "absolute",
                left: 0,
                top: 0
            });
            this.qs("slideIn", "div.title").css({
                position: "absolute",
                right: "20px",
                top: "30px",
                width: "420px"
            });
            this.qs("slideIn", "div.title > h1").addClass("weightBolder size48px").css({
                color: "rgb(211, 38, 0)"
            });
            this.qs("slideIn", "div.title > h2").addClass("weightNormal size32px marginT4px color444");
            this.qs("slideIn", "div.text").addClass("positionAbsolute").css({
                right: "20px",
                top: "190px",
                width: "380px"
            });
            this.qs("slideIn", "div.text > div:eq(0)").addClass("positionAbsolute width100per height100per background444 opacity06 radius8px border2px").css({
                "border-color": "rgb(211, 38, 0)"
            });
            this.qs("slideIn", "div.text > div:eq(1)").addClass("positionRelative paddingH16px paddingT16px paddingB32px");
            this.qs("slideIn", "div.text > div:eq(1) > p").addClass("colorWhite size18px");
            this.qs("slideIn", "div.text > div:eq(1) > p:last()").addClass("weightBold marginT4px");
            this.qs("slideIn", "div.text > div:eq(2)").addClass("positionAbsolute paddingV4px paddingH16px radius8px").css({
                right: "20px",
                "background-color": "rgb(211, 38, 0)"
            });
            this.qs("slideIn", "div.text > div:eq(2) > a").addClass("weightBold size20px colorWhite");
            this.qs("slideIn", "div.text > div:eq(2)").css({bottom: (this.qs("slideIn", "div.text > div:eq(2)").outerHeight(true) / -2) + "px"});
            this.qs("foot", "div:last() > h2").css({
                "padding-left": "30px",
                background: "url('data/img/visuals/warning.png') left center no-repeat",
                color: "rgb(211, 38, 0)"
            });
            this.qs("footChilds", "a").addClass("redBackgroundOnHover");
            break;
        case 'deluxe':
            this.qs("slideIn", "img").css({
                position: "absolute",
                right: 0,
                top: 0
            });
            this.qs("slideIn", "div.title").css({
                position: "absolute",
                left: "50px",
                top: "20px",
                width: "400px"
            });
            this.qs("slideIn", "div.title > h1").addClass("weightBold size48px").css("color", "rgb(58, 115, 173)");
            this.qs("slideIn", "div.title > h2").addClass("weightNormal size32px color444");
            this.qs("slideIn", "div.text").css({
                position: "absolute",
                left: "50px",
                top: "155px",
                width: "340px"
            });
            this.qs("slideIn", "div.text > p").addClass("textCenter");
            this.qs("slideIn", "div.text > p:eq(0)").addClass("weightNormal marginV16px size20px color444");
            this.qs("slideIn", "div.text > p:eq(1)").addClass("marginV16px");
            this.qs("slideIn", "div.text > p > a").addClass("size20px weightBold colorWhite textRight");
            this.qs("slideIn", "div.text > p > a > span").addClass("paddingV4px paddingH16px radius4px").css({
                "background-color": "rgb(58, 115, 173)"
            });
            this.qs("footChilds", "a").addClass("blueBackgroundOnHover");
            break;
        case 'discount':
            this.qs("slideIn", "img").css({
                position: "absolute",
                left: 0,
                top: 0
            });
            this.qs("slideIn", "div.title").css({
                position: "absolute",
                right: "60px",
                top: "20px",
                width: "460px"
            });
            this.qs("slideIn", "div.title > h1").addClass("textRight weightBold size48px").css({
                color: 'rgb(107, 167, 28)'
            });
            this.qs("slideIn", "div.title > h2").addClass("textRight weightNormal size32px color444");
            this.qs("slideIn", "div.text").css({
                position: "absolute",
                right: "60px",
                top: "140px",
                width: "320px"
            });
            this.qs("slideIn", "div.text > p").addClass("textRight size20px color444");
            this.qs("slideIn", "div.text > p:eq(1)").addClass("weightBold");
            this.qs("slideIn", "div.text > p:eq(2)").addClass("marginV16px");
            this.qs("slideIn", "div.text > p > a").addClass("size20px weightBold colorWhite textRight");
            this.qs("slideIn", "div.text > p > a > span").addClass("paddingV4px paddingH16px radius4px").css({
                "background-color": 'rgb(107, 167, 28)'
            });
            this.qs("footChilds", "a").addClass("greenBackgroundOnHover");
            break;
    }
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
HomeCPN.prototype.auto = function() {
    if (this.autoplay) {
        this.getMethod("next", "Slidable").call([]);
    }
};
HomeCPN.prototype.stop = function() {
    this.autoplay = false;
};
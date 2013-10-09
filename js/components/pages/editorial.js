/* Editorial page.                                                              */

function EditorialCPN(ctn, src, to) {
    var cpn = new Component(ctn, "js/components/pages/editorial.xml");
    
    cpn.register("goto", to);
    
    var cb = [
        {
            call: "build"
        }
    ];
    cpn.registerSource("data", "data/site/editorial_" + src + ".xml", "Error", cb);
    
    var s = {
        load: "$IMAGES $IFRAMES",
        state: "Ready",
        callbacks: [
            {
                call: "spe"
            }
        ]
    };
    cpn.saveInterface(LoadableITF, s);
    
    s = {
        containers: "columnables"
    };
    cpn.saveInterface(ColumnableITF, s);
    
    s = {
        containers: "columnables"
    };
    cpn.saveInterface(EqualizableITF, s);
    
    cpn.registerMethod(this.build, "build", false);
    cpn.registerMethod(this.follow, "follow", false);
    cpn.registerMethod(this.spe, "spe", false);
    cpn.registerMethod(this.speProduct, "speProduct", false);
    
    return cpn;
}
EditorialCPN.prototype.build = function() {
    if (!this.getSource("data").hasData()) {
        this.getSource("data").get();
    } else {
        if (Toolkit.isNull(this.goto)) {
            this.register("goto", this.getSourceData("data", 's.page:first() > i.name').text());
        }
        var page = this.getSource("data").getDataByKey("page", "name", this.goto);
        
        if ($(page).length === 0) {
            this.getParent().getMethod("go", "Navigable").call(["404"]);
        }
        
        this.qs("breadcrumb").html(this.getSourceData("data", "s.area > i.breadcrumb").text());
        
        this.qs("title").text($(page).children("i.title").text());
        this.qs("subtitle").text($(page).children("i.subtitle").text());
        
        this.qs("wrapper").html($(page).children("i.content").text());
        
        this.qs("head").find("a").addClass("speColorHoverBlue");
        this.qs("breadcrumb").find("a").addClass("size12px");
        this.qs("body").find("p").addClass("size16px line24px marginB16px");
        
        this.getMethod("load", "Loadable").call([]);
    }
};
EditorialCPN.prototype.follow = function() {
    this.register("goto", this.qs("$TRIGGERED").attr("href").replace(/#/g, ''), true);
    this.go("Switch");
};
/* Content-specific */
EditorialCPN.prototype.spe = function() {
    var page = this.getSource("data").getDataByKey("page", "name", this.goto);
    if ($(page).children("i.post").text() !== "N/A") {
        this.getMethod($(page).children("i.post").text()).call([]);
    }
};
EditorialCPN.prototype.speProduct = function() {
    new ProductPushCPN(this.qs("wrapper", "div.left > div.st"), {
        on: "data/img/picts/bp_small.png",
        off: "data/img/picts/bp_small_bw.png",
        legend: "Le Studio",
        link: "#st",
        special: true
    }).start();
    new ProductPushCPN(this.qs("wrapper", "div.left > div.dc"), {
        on: "data/img/picts/bonsai_small.png",
        off: "data/img/picts/bonsai_small_bw.png",
        legend: "La Pépinière",
        link: "#dc",
        special: true
    }).start();
    new ProductPushCPN(this.qs("wrapper", "div.left > div.ft"), {
        on: "data/img/picts/red_small.png",
        off: "data/img/picts/red_small_bw.png",
        legend: "L'Express",
        link: "#ft",
        special: true
    }).start();
    
    this.qs("wrapper", "div").addClass("floatLeft");
    this.qs("wrapper", "div.left").addClass("width160px borderL1px borderB1px borderR1px border444 backgroundDDD").css({
        "border-radius": "0px 0px 8px 8px"
    });
    this.qs("wrapper", "div.left > span").addClass("paddingV4px marginV16px size16px background444 weightBold colorDDD textCenter").text("Nos autres services");
    this.qs("wrapper", "div.left > div").addClass("displayBlock marginT8px marginB16px");
    this.qs("wrapper", "div.right").addClass("paddingH16px paddingV8px");
    this.qs("wrapper", "div.right > p").addClass("paddingH16px");
    this.qs("wrapper").find("span").addClass("displayBlock");
    
    Toolkit.absRealWidth(this.qs("wrapper", "div.right"), this.qs("wrapper").width() - this.qs("wrapper", "div.left").outerWidth(true));
    
    this.getSelector("columnables").refresh();
    this.qs("columnables", "div").addClass("padding8px marginB4px marginH2px backgroundEEE border1px border888");
    this.qs("columnables").eq(0).children("div:first()").css("border-radius", "8px 0px 0px 0px");
    this.qs("columnables").eq(0).children("div:last()").css("border-radius", "0px 8px 0px 0px");
    this.qs("columnables").eq(1).children("div:first()").css("border-radius", "0px 0px 0px 8px");
    this.qs("columnables").eq(1).children("div:last()").css("border-radius", "0px 0px 8px 0px");
    this.qs("columnables", "* > span").addClass("size14px");
    this.qs("columnables", "* > a").addClass("textCenter floatRight");
    this.qs("columnables", "* > a > span").addClass("width128px paddingH16px paddingV2px marginT8px size14px colorWhite radius4px background444 speBackgroundHoverBlue");
    this.qs("columnables", "* > ul > li").addClass("marginL32px marginV2px listDisc size14px");
    
    this.getMethod("refresh", "Columnable").call([]);
    var c = [
        this.qs("columnables").eq(0).find("div > ul"),
        this.qs("columnables").eq(1).find("div > ul")
    ];
    this.getMethod("refresh", "Equalizable").call([c]);
};
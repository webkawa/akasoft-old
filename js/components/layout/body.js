/* Body.
 * Site body.                                                                   */

function BodyCPN(ctn) {
    var cpn = new Component(ctn, "js/components/layout/body.xml");
    
    var cb = [
        {
            call: "buildNavigation"
        }
    ];
    cpn.registerSource("navmap", "data/site/nav.xml", "Ready", cb);
    
    setup = {
        driver: "navigate"
    };
    cpn.saveInterface(NavigableITF, setup);
    
    cpn.register("goto", "sample", false);
    
    cpn.registerMethod(this.init, "init", false);
    cpn.registerMethod(this.loadNavigation, "loadNavigation", false);
    cpn.registerMethod(this.buildNavigation, "buildNavigation", false);
    cpn.registerMethod(this.addNavigation, "addNavigation", false);
    cpn.registerMethod(this.navigate, "navigate", false);
    cpn.registerMethod(this.follow, "follow", false);
    
    return cpn;
}
/* Initialization. */
BodyCPN.prototype.init = function() {
    var cpn = new LogoCPN(this.qs("logo"));
    cpn.start();
    this.register("logo", cpn, false);
};
/* Navigation load. */
BodyCPN.prototype.loadNavigation = function() {
    this.getSource("navmap").get();
};
/* Navigation build. */
BodyCPN.prototype.buildNavigation = function() {
    this.getMethod("addNavigation").call([0]);
};
/* Navigation add. */
BodyCPN.prototype.addNavigation = function(index) {
    if (Toolkit.isNull(index)) {
        index = 0;
    }
    var i = this.getSourceData("navmap", "s:eq(" + index + ")");
    
    var pbuff = i.children("i.position").text();
    if (pbuff === "left") {
        var s = {
            link: i.children("i.link").text(),
            title: i.children("i.title").text(),
            description: i.children("i.description").text(),
            image: i.children("i.image").text(),
            color: i.children("i.color").text(),
            altcolor: i.children("i.altcolor").text()
        };
        
        this.qs("left").append('<div />');
        new LeftLinkCPN(this.qs("left", "div:last()"), s).start();
    } else if (pbuff === "right") {
        var t = 0;
        this.qs("right", "div").each(function() {
            t += $(this).outerHeight(true);
        });
        var s = {
            title: i.children("i.title").text(),
            image: i.children("i.image").text(),
            color: i.children("i.color").text(),
            altcolor: i.children("i.altcolor").text()
        };
        
        this.qs("right").append('<div />');
        this.qs("right", "div:last()").css("bottom", t + "px");
        
        new RightLinkCPN(this.qs("right", "div:last()"), s).start();
    }
    
    if (this.getSourceData("navmap", "s").length !== index - 1) {
        var ctx = this;
        setTimeout(function() {
            ctx.getMethod("addNavigation").call([parseInt(index) + 1]);
        }, 250);
    }
};
/* Page change. */
BodyCPN.prototype.navigate = function(to) {
    // Selecting
    var cpn;
    switch(to) {
        case "home":
            cpn = new HomeCPN(this.qs("centerFrame"));
            break;
        default:
            cpn = new EditorialCPN(this.qs("centerFrame"), to);
            break;
    }
    
    // Show/hide logo
    if (to === "home" && this.at !== "home") {
        this.logo.go("Hidden");
    } else if (to !== "home" && (this.at === "home" || Toolkit.isNull(this.at))) {
        this.logo.go("Visible");
    }
    
    // Stopping
    if (!Toolkit.isNull(this.body)) {
        this.body.stop();
    }
    cpn.start();
    
    // Registering
    this.register("body", cpn, true);
};
/* Page switch (link click). */
BodyCPN.prototype.follow = function() {
    this.goto = this.qs("$TRIGGERED").attr("href").replace(/#/g, '');
    this.go("Switch");
};
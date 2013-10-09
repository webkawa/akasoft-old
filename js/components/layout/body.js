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
    
    cpn.register("goto", "services@ft", false);
    
    cpn.registerMethod(this.init, "init", false);
    cpn.registerMethod(this.loadNavigation, "loadNavigation", false);
    cpn.registerMethod(this.buildNavigation, "buildNavigation", false);
    cpn.registerMethod(this.addNavigation, "addNavigation", false);
    cpn.registerMethod(this.startNavigation, "startNavigation", false);
    cpn.registerMethod(this.navigate, "navigate", false);
    cpn.registerMethod(this.follow, "follow", false);
    
    return cpn;
}
BodyCPN.prototype.init = function() {
    var cpn = new LogoCPN(this.qs("logo"));
    cpn.start();
    
    this.register("logo", cpn);
    this.register("navigation", []);
};
BodyCPN.prototype.loadNavigation = function() {
    this.getSource("navmap").get();
};
BodyCPN.prototype.buildNavigation = function() {
    this.getMethod("addNavigation").call([]);
    this.getMethod("startNavigation").call([0]);
};
BodyCPN.prototype.addNavigation = function() {
    var ctx = this;
    var buff;
    this.getSourceData("navmap", "s").each(function() {
        var position = $(this).children("i.position").text();
        
        if (position === "left") {
            var s = {
                link: $(this).children("i.link").text(),
                title: $(this).children("i.title").text(),
                description: $(this).children("i.description").text(),
                image: $(this).children("i.image").text(),
                color: $(this).children("i.color").text(),
                altcolor: $(this).children("i.altcolor").text()
            };
            ctx.qs("left").append('<div />');
            
            buff = new LeftLinkCPN(ctx.qs("left", "div:last()"), s);
        } else if (position === "right") {
            var s = {
                title: $(this).children("i.title").text(),
                image: $(this).children("i.image").text(),
                color: $(this).children("i.color").text(),
                altcolor: $(this).children("i.altcolor").text()
            };
            ctx.qs("right").append('<div />');
            
            buff = new RightLinkCPN(ctx.qs("right", "div:last()"), s);
        }
        ctx.navigation[ctx.navigation.length] = buff;
    });
};
BodyCPN.prototype.startNavigation = function(index) {
    var ctx = this;
    setTimeout(function() {
        if (ctx.navigation[index].getModelName() === "RightLink") {
            var t = 0;
            ctx.qs("right", "div").each(function() {
                t += $(this).outerHeight(true);
            });
            ctx.navigation[index].getContainer().css("bottom", t + "px");
        }
        
        ctx.navigation[index].start();
        
        if (index < ctx.navigation.length - 1) {
            ctx.getMethod("startNavigation").call([parseInt(index) + 1]);
        }
    }, 250);
};
BodyCPN.prototype.navigate = function(to) {
    // Selecting
    var cpn;
    switch(to) {
        case "home":
            cpn = new HomeCPN(this.qs("centerFrame"));
            break;
        case "products":
            cpn = new ProductsCPN(this.qs("centerFrame"));
            break;
        case "404":
            var s = {
                title: "Erreur 404",
                message: "Cette page n'existe pas ou semble avoir été supprimée ...",
                icon: "xion.png",
                linklabel: "Retour à l'accueil",
                linkreference: "home"
            };
            cpn = new FlashCPN(this.qs("centerFrame"), s);
            break;
        default:
            var s = to.split("@");
            cpn = new EditorialCPN(this.qs("centerFrame"), s[0], s[1]);
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
BodyCPN.prototype.follow = function() {
    var tr = this.qs("$TRIGGERED");
    
    if (tr.parents(".cpnLeftLink").length > 0) {
        Register.getFrom(tr.parents(".cpnLeftLink")).getMethod("go").call(["Close"]);
    }
    
    this.goto = tr.attr("href").replace(/#/g, '');
    this.go("Switch");
};
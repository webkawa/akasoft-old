/* Editorial page.                                                              */

function EditorialCPN(ctn, src) {
    var cpn = new Component(ctn, "js/components/pages/editorial.xml");
    
    var cb = [
        {
            call: "start"
        }
    ];
    cpn.registerSource("data", "data/site/editorial_" + src + ".xml", "Ready", cb);
    
    var s = {
        load: ['images', 'frames'],
        back: "Ready"
    };
    cpn.saveInterface(LoadableITF, s);
    
    setup = {
        driver: "build"
    };
    cpn.saveInterface(NavigableITF, setup);
    
    cpn.registerMethod(this.start, "start", false);
    cpn.registerMethod(this.follow, "follow", false);
    cpn.registerMethod(this.build, "build", false);
    cpn.registerMethod(this.height, "height", false);
    
    return cpn;
}
/* Starter */
EditorialCPN.prototype.start = function() {
    this.register("goto", this.getSourceData("data", 's[class="page"]:first() > i[class="name"]').text(), true);
    this.getMethod("build").call([this.goto]);
    this.getMethod("load", "Loadable").call([]);
};
/* Navigation */
EditorialCPN.prototype.build = function(to) {
    var data = this.getSource("data").getDataByKey("page", "name", this.goto);
    
    this.qs("content").remove();
    this.qs("title").text($(data).children('i[class="title"]').text());
    this.qs("subtitle").text($(data).children('i[class="subtitle"]').text());
    this.qs("frame").append($(data).children('i[class="content"]').text());
};
/* Navigation */
EditorialCPN.prototype.follow = function() {
    this.goto = this.qs("$TRIGGERED").attr("href").replace(/#/g, '');
    this.go("Switch");
};
/* Content height */
EditorialCPN.prototype.height = function(mode) {
    var v;
    mode === "true" ?
        v = "heightMax" :
        v = "heightMin";

    this.register(v, this.qs("frame").outerHeight(true) + "px", true);
};
/* Products page.                                                               */

function ProductsCPN(ctn, src) {
    var cpn = new Component(ctn, "js/components/pages/products.xml");
    
    var cb = [
        {
            call: "start"
        }
    ];
    cpn.registerSource("data", "data/site/products.xml", "Preview", cb);
    
    var s = {
        load: ['$IMAGES', '$IFRAMES'],
        callbacks: [
            {
                call: "refresh",
                interface: "Columnable"
            }
        ],
        state: "Preview"
    };
    cpn.saveInterface(LoadableITF, s);
    
    s = {
        container: "preview",
        classFirstExcept: "borderLeft1px border444"
    };
    cpn.saveInterface(ColumnableITF, s);
    
    s = {
        targets: [
            {
                childs: "previewSubtitles"
            },{
                childs: "previewTexts"
            }
        ]
    };
    cpn.saveInterface(EqualizableITF, s);
    
    cpn.registerMethod(this.init, "init", false);
    cpn.registerMethod(this.start, "start", false);
    cpn.registerMethod(this.build, "build", false);
    cpn.registerMethod(this.follow, "follow", false);
    
    return cpn;
}
ProductsCPN.prototype.init = function() {
    this.register("tnoh", -this.qs("title").outerHeight(true), false);
};
ProductsCPN.prototype.start = function() {
    var left = this.getSource("data").getDataByKey('category', 'id', '1');
    var center = this.getSource("data").getDataByKey('category', 'id', '2');
    var right = this.getSource("data").getDataByKey('category', 'id', '3');
    
    this.qs("previewLeft").children("h2").append($(left).children('i[class="title"]').text());
    this.qs("previewCenter").children("h2").append($(center).children('i[class="title"]').text());
    this.qs("previewRight").children("h2").append($(right).children('i[class="title"]').text());
    this.qs("previewLeft").children("div").append($(left).children('i[class="text"]').text());
    this.qs("previewCenter").children("div").append($(center).children('i[class="text"]').text());
    this.qs("previewRight").children("div").append($(right).children('i[class="text"]').text());
    this.qs("previewLeft").children("a").append($(left).children('i[class="linklabel"]').text());
    this.qs("previewCenter").children("a").append($(center).children('i[class="linklabel"]').text());
    this.qs("previewRight").children("a").append($(right).children('i[class="linklabel"]').text());
    this.qs("previewLeft").children("a").attr("href", "#" + $(left).children('i[class="linkreference"]').text());
    this.qs("previewCenter").children("a").attr("href", "#" + $(center).children('i[class="linkreference"]').text());
    this.qs("previewRight").children("a").attr("href", "#" + $(right).children('i[class="linkreference"]').text());
    
    this.getMethod("load", "Loadable").call([]);
};
ProductsCPN.prototype.build = function(to) {
    
};
ProductsCPN.prototype.follow = function() {
    
};
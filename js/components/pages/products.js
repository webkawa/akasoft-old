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
        load: '$IMAGES $IFRAMES',
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
        containers: "preview",
        classFirstExcept: "borderL1px border888"
    };
    cpn.saveInterface(ColumnableITF, s);
    
    s = {
        childs: [
            "previewHeads",
            "previewBodies"
        ]
    };
    cpn.saveInterface(EqualizableITF, s);
    
    cpn.registerMethod(this.init, "init", false);
    cpn.registerMethod(this.start, "start", false);
    
    return cpn;
}
ProductsCPN.prototype.init = function() {
    this.register("tnoh", -this.qs("title").outerHeight(true), false);
};
ProductsCPN.prototype.start = function() {
    var left = this.getSource("data").getDataByKey('category', 'id', 'classic');
    var center = this.getSource("data").getDataByKey('category', 'id', 'discount');
    var right = this.getSource("data").getDataByKey('category', 'id', 'fasttrack');
    
    this.qs("previewLeft", "div.head > h2").append($(left).children('i.title').text());
    this.qs("previewCenter", "div.head > h2").append($(center).children('i.title').text());
    this.qs("previewRight", "div.head > h2").append($(right).children('i.title').text());
    this.qs("previewLeft", "div.head > h3").append($(left).children('i.subtitle').text());
    this.qs("previewCenter", "div.head > h3").append($(center).children('i.subtitle').text());
    this.qs("previewRight", "div.head > h3").append($(right).children('i.subtitle').text());
    this.qs("previewLeft", "div.body").prepend($(left).children('i.text').text());
    this.qs("previewCenter", "div.body").prepend($(center).children('i.text').text());
    this.qs("previewRight", "div.body").prepend($(right).children('i.text').text());
    this.qs("previewLeft", "p > a").append($(left).children('i.linklabel').text()).attr("href", "#" + $(left).children('i.linkreference').text());
    this.qs("previewCenter", "p > a").append($(center).children('i.linklabel').text()).attr("href", "#" + $(center).children('i.linkreference').text());
    this.qs("previewRight", "p > a").append($(right).children('i.linklabel').text()).attr("href", "#" + $(right).children('i.linkreference').text());
   
    this.qs("previewBodies", "p").addClass("marginV16px line18px size16px"); 
    this.qs("previewBodies", "p > img").addClass("floatLeft marginR8px marginB4px speBackgroundDarkBlue opacity08 radius4px");
    
    this.getMethod("load", "Loadable").call([]);
};
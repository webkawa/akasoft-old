/* Editorial page.                                                              */

function EditorialCPN(ctn, src) {
    var cpn = new Component(ctn, "js/components/editorial.xml");
    
    cpn.registerSource("data", "editorial_" + src + ".xml", "Ready");
    
    setup = {
        driver: "navigate"
    };
    cpn.saveInterface(NavigableITF, setup);
    
    return cpn;
}
EditorialCPN.prototype.navigate = function(to) {
    
};
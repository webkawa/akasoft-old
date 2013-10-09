/* Framework component register.
 * Register is a pseudo-class, offering only static methods, with no error-based
 * parameters check.                                                            */

var Register = {
    /* Components list */
    idx: [],
    
    /* Presets list */
    presets: {},
    
    /* Registers a new component.
     * PARAMETERS :
     *  cpn                 Registered component.
     * RETURNS :
     *  Attributed ID.                                                          */
    add: function(cpn) {
        Toolkit.checkClassOf(cpn, Component);
        
        var id = Register.idx.length;
        Register.idx[id] = cpn;
        cpn.getContainer().attr("id", id);
        return id;
    },
            
   /* Return a component by his ID.
    * PARAMETERS :
    *  id                  Component ID.
    * RETURNS :
    *  Searched component.                                                     */
    get: function(id) {
         if (id >= Register.idx.length) {
             var p = {
                id: id,
                error: "Component ID is superior to register size"
             };
             throw new Error("cpn", 16, p);
         }
         if (Toolkit.isNull(Register.idx[id])) {
             var p = {
                 id: id,
                 error: "Component has been cleaned"
             }
         }
         return Register.idx[id];
     },
    /* Return a component by his container.
     * PARAMETERS :
     *  container           Component container.
     * RETURNS :
     *  Searched component.                                                     */
     getFrom: function(container) {
        return Register.get($(container).attr("id"));
     },

     /* Removes a component by his ID.
      * PARAMETERS :
      *  id                 Component ID.
      * RETURNS : N/A                                                           */
     remove: function(id) {
         delete this.idx[id];
     },
     
     /* Saves a preset.
      * PARAMETERS :
      *  name               Preset (model) name.
      *  selectors          Selectors list.
      *  triggers           Triggers list.
      *  states             States list.
      *  trajectories       Trajectories list.                                 
      *  dom                DOM node.
      *  styles             Styles list.
      *  actions            Actions list.
      *  to                 To node.     
      * RETURNS : N/A                                                           */
     save: function(name, selectors, triggers, states, trajectories, dom, styles, actions, to) {
         Register.presets[name] = {
             selectors: selectors,
             triggers: triggers,
             states: states,
             trajectories: trajectories,
             dom: dom,
             styles: styles,
             actions: actions,
             to: to
         };
     },
             
     /* Returns a presets.
      * PARAMETERS :
      *  name               Preset (model) name.
      * RETURNS : N/A                                                           */
     load: function(name) {
         return Register.presets[name];
     },
             
     /* Checks if a preset exists.
      * PARAMETERS :
      *  name               Preset (model) name.
      * RETURNS :
      *  true if preset exists, false else.                                     */
     has: function(name) {
        return !Toolkit.isNull(Register.presets[name]);
     }
};
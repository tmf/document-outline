/*!
 * docoument-outline - a TOC generator
 * https://github.com/tmf/document-outline
 * MIT License | (c) Tom Forrer 2015
 */
// amd and commonjs support from http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define([], function(){
            return (root.documentOutline = factory());
        });
    } else if(typeof module === "object" && module.exports) {
        module.exports = (root.documentOutline = factory());
    } else {
        root.documentOutline = factory();
    }
}(this, function() {
    var documentOutline = {
        /**
         * [
         *   {
         *     title: "heading 1",
         *     ref: nodeRef,
         *     elements: [
         *       {
         *         title: "heading 2",
         *         ref: nodeRef,
         *         elements: [ ]
         *       }
         *     ]
         *   }
         * ]
         * @param containerNode
         */
        extractOutline: function(containerNode){
            var outline = [],
                currentLevel = 1,
                currentSection = outline,
                previousElement = null,
                parentSections = [];
            [].forEach.call(containerNode.querySelectorAll('h1, h2, h3, h4, h5, h6'), function(headingNode){
                var title = headingNode.textContent,
                    level = headingNode.hasAttribute('aria-level') ? parseInt(headingNode.getAttribute('aria-level')) : parseInt(headingNode.nodeName[1]),
                    element = { title: title, ref: headingNode, elements: [] };
                if(level > currentLevel){
                    parentSections.push(currentSection);
                    currentSection = previousElement.elements;
                }else if(level < currentLevel){
                    for(var i=0; i<(currentLevel - level); i++){
                        currentSection = parentSections.pop()
                    }
                }
                currentLevel = level;
                currentSection.push(element);
                previousElement = element;
            });
            return outline;
        },
        /**
         *
         * @param outline
         */
        createTOC: function(outline){
            outline.map(function(element){

            })
        }
    };
    return documentOutline;
}));
/*!
 * docoument-outline - a TOC generator
 * https://github.com/tmf/document-outline
 * MIT License | (c) Tom Forrer 2015
 */
// amd and commonjs support from http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(['slug'], function () {
            return (root.documentOutline = factory(slug));
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = (root.documentOutline = factory(slug));
    } else {
        root.documentOutline = factory(root.slug);
    }
}(this, function (slug) {

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
        extractOutline: function (containerNode, minLevel, maxLevel) {
            var outline = [],
                currentLevel = typeof minLevel === 'undefined' ? 1 : parseInt(minLevel),
                maxLevel = typeof maxLevel === 'undefined' ? 6 : parseInt(maxLevel),
                currentSection = outline,
                previousElement = null,
                parentSections = [];
            [].forEach.call(containerNode.querySelectorAll('h1, h2, h3, h4, h5, h6'), function (headingNode) {
                var title = this.extractTitle(headingNode),
                    level = this.extractLevel(headingNode),
                    element = {title: title, ref: headingNode, elements: []};
                if(level >= minLevel && level <= maxLevel) {
                    if (level > currentLevel) {
                        parentSections.push(currentSection);
                        currentSection = previousElement.elements;
                    } else if (level < currentLevel) {
                        for (var i = 0; i < (currentLevel - level); i++) {
                            currentSection = parentSections.pop()
                        }
                    }
                    currentLevel = level;
                    currentSection.push(element);
                    previousElement = element;
                }
            }, this);
            return outline;
        },

        /**
         *
         * @param headingNode
         * @returns {string}
         */
        extractTitle: function(headingNode){
            return headingNode.textContent;
        },

        /**
         *
         * @param headingNode
         * @returns {Number}
         */
        extractLevel: function(headingNode){
            return headingNode.hasAttribute('aria-level') ? parseInt(headingNode.getAttribute('aria-level')) : parseInt(headingNode.nodeName[1]);
        },
        /**
         *
         * @param outline
         */
        createTOC: function (outline) {
            var listElements = outline.map(function (element) {
                    var li = this.createListElement(element);

                    if (element.elements.length > 0) {
                        li.appendChild(this.createTOC(element.elements));
                    }
                    return li;
                }, this);
            return this.createList(listElements);
        },

        /**
         *
         * @param headingNode
         * @returns {string}
         */
        decorateHeadingWithId: function (headingNode) {
            if (!headingNode.hasAttribute('id')) {
                headingNode.setAttribute('id', slug(headingNode.textContent).toLowerCase());
            }
            return headingNode.getAttribute('id');
        },

        /**
         *
         * @param element
         * @returns {HTMLElement}
         */
        createListElement: function (element) {
            var li = document.createElement('li'),
                anchor = document.createElement('a'),
                name = this.decorateHeadingWithId(element.ref);

            anchor.setAttribute('href', '#' + name);
            anchor.textContent = element.title;
            li.appendChild(anchor);
            return li;
        },

        /**
         *
         * @param elements
         * @returns {HTMLElement}
         */
        createList: function (elements) {
            var ul = document.createElement('ul');
            [].forEach.call(elements, function (listElement) {
                ul.appendChild(listElement);
            });
            return ul;
        }

    };
    return documentOutline;
}));
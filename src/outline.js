document.addEventListener('DOMContentLoaded', function () {
    var outline = document.createElement('ul'),
        currentLevel = 1,
        currentElement = outline,
        lastElement = null;
    [].forEach.call(document.querySelectorAll('h1, h2, h3, h4, h5, h6'), function (heading) {
        var el = document.createElement('li');
        el.textContent = heading.textContent;

        if (heading.nodeName[1] > currentLevel) {
            var ul = document.createElement('ul');
            ul.appendChild(el);
            lastElement.appendChild(ul);
            currentLevel = heading.nodeName[1];
            currentElement = ul;

        } else if (heading.nodeName[1] == currentLevel) {
            currentElement.appendChild(el);
        } else {
            for (var i = 1; i <= ( currentLevel - heading.nodeName[1]); i++) {
                currentElement = currentElement.parentNode.parentNode;
            }
            currentElement.appendChild(el);
            currentLevel = heading.nodeName[1];
        }
        lastElement = el;
    });

    document.querySelector('#toctitle').appendChild(outline);

});
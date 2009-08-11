function Leader() {
    this.addClickToRadioLabel = function() {
        var allInputTags = $("input");
        var thisInputTag;
        var newLabel;

        for (var i = 0; i < allInputTags.length; i++) {
            thisInputTag = allInputTags[i];

            if ( thisInputTag.getAttribute("type") == "radio" ) {
                var value = thisInputTag.getAttribute("value");
                thisInputTag.setAttribute("id", "action_"+value);
                newLabel = document.createElement("label");
                newLabel.setAttribute("for", "action_"+value);
                newLabel.appendChild(thisInputTag.nextSibling);
                thisInputTag.parentNode.insertBefore(newLabel, thisInputTag.nextSibling);
            }
        }
    }
}

var leader= new Leader();
leader.addClickToRadioLabel();

function Messages() {

    this.getSignature = function(account) {
        var def = "";
        var rs = db.execute("select signature from Signatures where account = ?;", [account]);
        while (rs.isValidRow()) {
            def = rs.field(0);
            rs.next();
        }
        rs.close();
        return def;
    }

    this.signOverriddenSubmit = function(event) {
        var target = event ? event.target : this;
        var accountName = utils.getOption("account");
        var equipe = utils.getOption("team");
        var i = 2;
        if ( equipe == Constants.SF )  //  there is an "anonyme" checkbox at SF level so we shift the index
            i++;

        if ( location.href.search("repondre") != -1 ) {     //  answer window
            if ( target.elements[i+1].value.length > 0 ) {
                target.elements[i].value = target.elements[i].value + "\n\n\n" + target.elements[i+1].value;
            }
            if ( target.elements[i+2].checked == true ) {
                db.execute("insert or replace into Signatures values (?,?)", [accountName, target.elements[i+1].value]);
            }
        } else {    //  normal window
            if ( target.elements[i+2].value.length > 0 ) {
                target.elements[i+1].value = target.elements[i+1].value + "\n\n\n" + target.elements[i+2].value;
            }
            if ( target.elements[i+3].checked == true ) {
                db.execute("insert or replace into Signatures values (?,?)", [accountName, target.elements[i+2].value]);
            }
        }
    }

    this.addSignature = function() {
        var index,
        textAreas,
        msgTextArea,
        signTextArea,
        signTextAreaValue,
        signSaveCheckbox,
        accountName;

        accountName = utils.getOption("account");

        textAreas = $("textarea");
        if (textAreas.length > 0) {
            index = 0;
            while (textAreas[index].name != "mess")
                index++;
            msgTextArea = textAreas[index];

            signTextArea = document.createElement("textarea");
            signTextArea.setAttribute("name", "sign");
            signTextArea.setAttribute("cols", "40");
            signTextArea.setAttribute("rows", "5");
            signTextAreaValue = this.getSignature(accountName);
            signTextArea.appendChild(document.createTextNode(signTextAreaValue));

            signSaveCheckbox = document.createElement("input");
            signSaveCheckbox.setAttribute("type", "checkbox");
            signSaveCheckbox.setAttribute("name", "save");
            signSaveCheckbox.setAttribute("checked", "checked");

            msgTextArea.removeChild(msgTextArea.firstChild);  //  remove the default string in the textarea ("Corps du message")

            msgTextArea.parentNode.insertBefore(document.createTextNode("Corps du message :"), msgTextArea);
            msgTextArea.parentNode.insertBefore(document.createElement("br"), msgTextArea);

            msgTextArea.parentNode.insertBefore(document.createElement("br"), msgTextArea.parentNode.lastChild);
            msgTextArea.parentNode.insertBefore(document.createTextNode("Signature :"), msgTextArea.parentNode.lastChild.previousSibling);
            msgTextArea.parentNode.insertBefore(signTextArea, msgTextArea.parentNode.lastChild);
            msgTextArea.parentNode.insertBefore(signTextArea, msgTextArea.parentNode.lastChild);
            msgTextArea.parentNode.insertBefore(document.createElement("br"), msgTextArea.parentNode.lastChild);
            msgTextArea.parentNode.insertBefore(document.createTextNode("Sauvegarder cette signature"), msgTextArea.parentNode.lastChild);
            msgTextArea.parentNode.insertBefore(signSaveCheckbox, msgTextArea.parentNode.lastChild);

            realWindow.addEventListener("submit", this.signOverriddenSubmit, true);
        }
    }

    this.addReplyToAll = function() {
        var allMsgDiv,
        thisMsgDiv,
        thisMsgAuthor,
        thisMsgLink,
        newMsgLink,
        space,
        center,
        index;

        allMsgDiv = $("td > div");

        for (var i = 0; i < allMsgDiv.length; i++) {
            thisMsgDiv = allMsgDiv[i];

            index = 0;
            while (thisMsgDiv.childNodes[index] && thisMsgDiv.childNodes[index].nodeName.toLowerCase() != "a")
                index++;

            thisMsgLink = thisMsgDiv.childNodes[index];

            if ( thisMsgLink && thisMsgLink.nodeName.toLowerCase() == "a" ) {
                thisMsgLink.parentNode.insertBefore(document.createElement("br"), thisMsgLink);
                center = thisMsgLink.parentNode.insertBefore(document.createElement("div"), thisMsgLink);
                center.setAttribute("align", "center");
                center.appendChild(thisMsgLink);

                newLink = thisMsgLink.cloneNode(true);
                thisMsgAuthor = thisMsgDiv.firstChild.firstChild.nodeValue;

                if ( thisMsgAuthor.match("#Canal v.t.ran#") ) {
                    newLink.href = newLink.href.substring(0, newLink.href.indexOf("repondre=")+9) + thisMsgAuthor.slice(7,14) + "s"; // accents problems...
                    newLink.firstChild.replaceChild(document.createTextNode("Répondre a tous"), newLink.firstChild.firstChild);
                }
                if ( thisMsgAuthor.match("#Canal Orateur#") ) {
                    newLink.href = newLink.href.substring(0, newLink.href.indexOf("repondre=")+9) + "orateurs";
                    newLink.firstChild.replaceChild(document.createTextNode("Répondre a tous"), newLink.firstChild.firstChild);
                }
                if ( thisMsgAuthor.match("#Canal confr.rie#") ) {
                    newLink.href = newLink.href.substring(0, newLink.href.indexOf("repondre=")+9) + "confrérie";
                    newLink.firstChild.replaceChild(document.createTextNode("Répondre a tous"), newLink.firstChild.firstChild);
                }
                if ( thisMsgAuthor.match("#Canal v.t.ran#") || thisMsgAuthor.match("#Canal Orateur#") || thisMsgAuthor.match("#Canal confr.rie#") ) {
                    space = document.createElement("span");
                    space.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";

                    thisMsgLink.parentNode.appendChild(space);
                    thisMsgLink.parentNode.appendChild(newLink);
                }
            }
        }
    }

    this.addDeleteButtons = function() {
        var allCheckboxes,
        thisCheckbox,
        newDeleteImg,
        newDeleteLink;

        allCheckboxes = $("input[type='checkbox']");

        for (var i = 0; i < allCheckboxes.length; i++) {
            thisCheckbox = allCheckboxes[i];

            newDeleteLink = document.createElement("a");
            newDeleteLink.setAttribute("href", "");

            newDeleteImg = document.createElement("img");
            newDeleteImg.setAttribute("src", Constants.deleteImg);
            newDeleteImg.setAttribute("id", "delete_" + (i+1));
            newDeleteImg.setAttribute("border", "0");
            newDeleteImg.setAttribute("title", "Supprimer ce message");

            newDeleteLink.appendChild(newDeleteImg);

            thisCheckbox.parentNode.style.textAlign = "center";
            thisCheckbox.parentNode.insertBefore(document.createElement("br"), thisCheckbox.parentNode.firstChild);
            thisCheckbox.parentNode.insertBefore(document.createElement("br"), thisCheckbox.parentNode.firstChild);
            thisCheckbox.parentNode.insertBefore(newDeleteLink, thisCheckbox.parentNode.firstChild);
        }

        document.addEventListener("click", function(event) {
                var imgId = event.target.id,
                    msgNum;

                if ( imgId.match("delete_") ) {
                    event.stopPropagation();
                    event.preventDefault();

                    if (confirm("Etes-vous sûr de vouloir supprimer ce message ?")) {
                        for (i = 0; i < realWindow.document.forms[0].elements.length;i++) {
                            realWindow.document.forms[0].elements[i].checked = false;
                        }

                        msgNum = imgId.substring(imgId.indexOf("delete_")+7);

                        realWindow.document.forms[0].elements[msgNum].checked = true;
                        realWindow.document.forms[0].submit();
                    }
                }

            }, true);
    }

}

var msg = new Messages();
if (location.href.search("ecrire=") != -1)
    msg.addSignature();

if (location.href.search("ecrire=") == -1 && location.href.search("envoi=1") == -1) {
    msg.addDeleteButtons();
    msg.addReplyToAll();
}

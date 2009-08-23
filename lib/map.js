function Map() {

    this.findPlanetByName = function(name) {
        var allPlanets, thisPlanet;
        allPlanets = $("div > a[target='detail']");
        
        for (var i = 0; i < allPlanets.length; i++) {
            thisPlanet = allPlanets[i];

            if (thisPlanet.lastChild.nodeValue &&
                thisPlanet.lastChild.nodeValue == name + " ") {
                return thisPlanet;
            }
        }
        
    };

    this.putLeader = function(leader,planet) {
        planet = this.findPlanetByName(planet);
        var planetDiv = (planet == null) ? null : planet.parentNode;

        if (planetDiv != null) {
            var myLeaders = $("a[href*='leader.php'] > img");

            var put = true;
            for (var i = 0; i < myLeaders.length; i++) {
                if (myLeaders[i].getAttribute("title") + "(" + utils.getOption("account") + ")" == leader)
                    put = false;
            }

            if (put) {
                var lead = document.createElement('img');
                lead.src = Constants.redLeader;
                lead.title = leader;
                var color = utils.getLeaderColor(leader);
                lead.style.border = "1px solid " + color;
                planetDiv.insertBefore(lead, planetDiv.lastChild.nextSibling);
            }
        }
    };

    this.displayUsefulInfomation = function() {
        var planet, leader, lead_array, num;

        var rs = db.execute("select name, position from Leaders where account = ?;", [utils.getOption("account")]);
        while (rs.isValidRow()) {
            def = rs.field(0);
            this.putLeader(rs.field(0), rs.field(1));
            rs.next();
        }
        rs.close();
    };

    function changePlanetBackground(planet) {
        var planetDiv = planet.parentNode;
        var thisAttribute, planetName;

        thisAttribute = planet.getAttribute('onmouseover');
        planetName = thisAttribute.substring(thisAttribute.indexOf('montre_legende')+16, thisAttribute.indexOf('\',\'Controle'));

        var back = $("#bg_" + planetName);
        if (back[0])
            back[0].style.visibility = "visible";
        else {
            planetDiv.style.zIndex = 10;

            back = document.createElement('img');
            back.setAttribute("id", "bg_" + planetName);
            back.src = Constants.greenBG;
            back.style.position = "absolute";
            back.style.zIndex = "1";
            back.style.left = planetDiv.style.left;
            back.style.top = planetDiv.style.top;
            back.style.height = 50;
            back.style.width = 50;

            planetDiv.parentNode.insertBefore(back, planetDiv);
        }
    }

    function resetPlanetBackground(planet) {
        var planetDiv = planet.parentNode;
        var thisAttribute, planetName;

        thisAttribute = planet.getAttribute('onmouseover');

        if (thisAttribute != null) {
            planetName = thisAttribute.substring(thisAttribute.indexOf('montre_legende')+16, thisAttribute.indexOf('\',\'Controle'));

            var back = $("#bg_" + planetName);
            if (back[0])
                back[0].style.visibility = "hidden";
        }
    }

    function getCanvas() {
        realWindow.canvas = document.createElement('canvas');
        var body = $("body")[0];
        var canvas = realWindow.canvas;
        var old_canvas = $("canvas")[0];

        var team = utils.getOption("team");

        canvas.style.position = "absolute";
        canvas.style.left = "0";
        canvas.style.top = "80";
        canvas.style.zIndex = "0";

        canvas.width = (team == Constants.M2 ||
                        team == Constants.F1 ||
                        team == Constants.F2 ||
                        team == Constants.MU) ? "1600" : "800";
        canvas.height = ( team == Constants.E2 || 
                          team == Constants.F2 || 
                          team == Constants.MU ) ? "2000" : "1000";

        if (old_canvas == undefined) {
            body.insertBefore(canvas,body.firstChild);
        }
        else {
            body.replaceChild(canvas,old_canvas);
        }

        return canvas;
    }

    function hackAnimations() {
        var ships_switch = utils.getOption("Ships_switch", "1");
        var leaders_switch = utils.getOption("Leaders_switch", "1");

        var imgList = $("img");

        for(var i = 0; i < imgList.length; i++) {
            if( imgList[i].src.search("astro_mini.gif") != -1 ) {
                imgList[i].parentNode.removeChild(imgList[i]);
            }
        }

        realWindow.anim = function () {
            var ctx = getCanvas().getContext('2d');
            ctx.lineCap = "round";
            ctx.lineWidth = 2;
            realWindow.image.visibility = 'hidden';

            for (var i = 0; i < realWindow.totanim; i++) {
                coordx=realWindow.depx[i] - 54;
                coordy=realWindow.depy[i] + 25;
                destx=realWindow.arrx[i] - 54;
                desty=realWindow.arry[i] + 25;

                if ( realWindow.objvol[i] == 7 && leaders_switch == "1" ) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgb(0,0,255)';
                    ctx.moveTo(coordy,coordx);
                    ctx.lineTo(desty,destx);
                    ctx.stroke();
                    continue;
                }

                if ( realWindow.objvol[i] != 7 && ships_switch == "1" ) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgb(255,255,0)';
                    ctx.moveTo(coordy,coordx);
                    ctx.lineTo(desty,destx);
                    ctx.stroke();
                }
            }

            for (i = 0; i < realWindow.totanim; i++) {
                destx=realWindow.arrx[i] - 55;
                desty=realWindow.arry[i] + 25;

                if ( realWindow.objvol[i] == 7 && leaders_switch == "1" ) {
                    ctx.beginPath();
                    ctx.fillStyle = 'rgb(200,0,255)';
                    ctx.arc(desty, destx, 29, 0, Math.PI*2, false);
                    ctx.fill();
                    continue;
                }

                if ( realWindow.objvol[i] != 7 && ships_switch == "1" ) {
                    ctx.beginPath();
                    ctx.fillStyle = 'rgb(255,0,0)';
                    ctx.arc(desty, destx, 29, 0, Math.PI*2, false);
                    ctx.fill();
                }
            }

            for (i = 0; i < realWindow.totanim; i++) {
                coordx=realWindow.depx[i] - 55;
                coordy=realWindow.depy[i] + 25;

                if ( realWindow.objvol[i] == 7 && leaders_switch == "1" ) {
                    ctx.beginPath();
                    ctx.fillStyle = 'rgb(0,200,255)';
                    ctx.arc(coordy, coordx, 27, 0, Math.PI*2, false);
                    ctx.fill();
                    continue;
                }

                if ( realWindow.objvol[i] != 7 && ships_switch == "1" ) {
                    ctx.beginPath();
                    ctx.fillStyle = 'rgb(0,255,0)';
                    ctx.arc(coordy, coordx, 27, 0, Math.PI*2, false);
                    ctx.fill();
                }
            }
            
            var team = utils.getOption("team");
            
            if (team == Constants.F2 || team == Constants.MU || team == Constants.E2)
                drawSectorHLimits(team, ctx);

            if (team == Constants.M2 || team == Constants.F2 || team == Constants.MU || team == Constants.F1)
                drawSectorVLimits(team, ctx);

        };

        realWindow.affcible = function () {};
        realWindow.effacecible = function () {};
        realWindow.vole = function () {};

        realWindow.anim();
    }

    this.hackShipsMoves = function() {
        hackGenericMoves("Ships");
    };

    this.hackLeadersMoves = function() {
        hackGenericMoves("Leaders");
    };
    
    function hackGenericMoves(sw) {
        var Generic_switch = utils.getOption(sw + "_switch", "1");

        if ( Generic_switch == "0" ) {
            utils.setOption(sw + "_switch", "1");
        } else {
            utils.setOption(sw + "_switch", "0");
        }
        hackAnimations();
    }

    function highlightMatchingPlanets (crit) {
        var selectedPlanets, thisPlanet, thisAttribute, thisPlanetName;

        resetPlanetsBG();

        if (utils.getOption("BG_switch", "0") == "0") {
            utils.setOption("BG_switch", "1");
        }
        else {
            selectedPlanets = document.evaluate(
                crit,
                document,
                null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                null);

            for (var i = 0; i < selectedPlanets.snapshotLength; i++) {
                thisPlanet = selectedPlanets.snapshotItem(i);

                changePlanetBackground(thisPlanet);
            }
            utils.setOption("BG_switch", "0");
        }
    }

    function resetPlanetsBG() {
        var allPlanets, thisPlanet;

        allPlanets = $("div > a[target='detail']");

        for (var i = 0; i < allPlanets.length; i++) {
            thisPlanet = allPlanets[i];
            resetPlanetBackground(thisPlanet);
        }
    }

    this.addTopLink = function(sw,label,callback) {
        var allTables,
            topTable,
            link;

        allTables = $("table");
        topTable = allTables[0];

        link = document.createElement("a");
        link.id = sw + "Link";
        link.href = "";
        link.setAttribute("style", "font-size:13px; color:#FFFF33; font-weight:bold");
        link.appendChild(document.createTextNode(" : "));
        link.appendChild(document.createTextNode(label));
        link.appendChild(document.createTextNode(" : "));

        topTable.parentNode.insertBefore(link, topTable);

        document.addEventListener('click', function(event) {
                if ( event.target.id == sw + "Link" ) {
                    event.stopPropagation();
                    event.preventDefault();
                    callback();
                }
            }, true);
    };

    this.highlightFastShuttlePlanets = function() {
        highlightMatchingPlanets("//div/a[contains(@onmouseover, 'Navette rapide')]");
    };

    this.addFSPLink = function() {
        this.addTopLink("FSP","Navettes rapides",this.highlightFastShuttlePlanets);
    };

    this.highlightGoldPlanets = function() {
        highlightMatchingPlanets("//div[contains(.,'or-')]/a[contains(@onmouseover, 'Controle')]");
    };

    this.addGoldLink = function() {
        this.addTopLink("Gold","Offres en or",this.highlightGoldPlanets);
    };

    this.highlightEmpirePlanets = function() {
        highlightMatchingPlanets("//div/a[contains(@onmouseover, 'Empire') and not(contains(@onmouseover, 'Controle : " + utils.getOption("account") + "'))]");
    };

    this.addEmpireLink = function() {
        this.addTopLink("Empire","Planètes Empire manquantes",this.highlightEmpirePlanets);
    };

    this.highlightToasterPlanets = function() {
        highlightMatchingPlanets("//div/a[contains(@onmouseover, 'Brouilleur')]");
    };

    this.addToasterLink = function() {
        this.addTopLink("Toaster","Planètes équipées de brouilleurs",this.highlightToasterPlanets);
    };

    this.highlightNeutral = function() {
        highlightMatchingPlanets("//div/a[contains(@onmouseover, 'astronefs') and number(substring-after(substring-before(@onmouseover, '% Indécis'), '00CC>')) > 40]");
    };

    this.addNeutralLink = function() {
        this.addTopLink("Neutral","Influence neutre",this.highlightNeutral);
    };

    this.addGenericLinks = function() {
        this.addTopLink("ShipsMoves","Mouvements astronefs", this.hackShipsMoves);
        this.addTopLink("LeadersMoves","Mouvements leaders", this.hackLeadersMoves);
    };

    function drawSectorHLimits(team, ctx) {
        ctx.lineCap = "round";
        ctx.lineWidth = 2;

        //  E2 map is only one sector large
        var size = (team == Constants.E2) ? 800 : 1600;
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(255,255,255)';
        ctx.moveTo(0,991);
        ctx.lineTo(size,991);
        ctx.stroke();
    }

    function drawSectorVLimits(team, ctx) {
        ctx.lineCap = "round";
        ctx.lineWidth = 2;

        //  M2 and F1 maps are only one sector tall
        var size = (team == Constants.M2 || team == Constants.F1) ? 1000 : 2000;
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(255,255,255)';
        ctx.moveTo(791,0);
        ctx.lineTo(791,size);
        ctx.stroke();
    }

    function autoselectDestination(planetName, x, y) {
        var planetId = x + "-" + y + "-" + planetName;
        var detailFrame = parent.frames[2];
        var select = null,
            selectDef,
            selectX33,
            selectArray,
            inputArray,
            radioBomb,
            radioProtect,
            radioLeader;

        //  ships destination
        if ( detailFrame && detailFrame.location.pathname.search('detail.php') != -1 ) {
            selectArray = $("select", detailFrame.document);

            for (var i = 0; i < selectArray.length; i++) {
                if ( selectArray[i].name == "cible" ) {
                    select = selectArray[i];
                    break;
                }
            }
            if ( select )
                for (i = 0; i < select.childNodes.length; i++) {
                    if ( select.childNodes[i].value.search(planetId) != -1 ) {
                        select.selectedIndex = i;
                        break;
                    }
                }
        }
        //  leader destination
        else if ( detailFrame && detailFrame.location.pathname.search('leader.php') != -1 ) {
            if ( detailFrame.document.getElementById("action_1") != null ) {
                selectArray = $("select", detailFrame.document);
                inputArray = $("input", detailFrame.document);

                for (var i = 0; i < inputArray.length; i++) {
                    if ( inputArray[i].type == "radio" )
                        if ( inputArray[i].value == "1" ) {
                            radioLeader = inputArray[i];
                            break;
                        }
                }

                for (i = 0; i < selectArray.length; i++) {
                    if ( selectArray[i].name == "planete" ) {
                        select = selectArray[i];
                        break;
                    }
                }
            }
            if ( select )
                for (i = 1; i < select.childNodes.length; i++) {
                    if ( select.childNodes[i].value.search(planetId) != -1 ) {
                        select.selectedIndex = i-1;
                        radioLeader.checked = "true";
                        break;
                    }
                }
        }
        //  cruiser destination
        else if ( detailFrame && detailFrame.location.pathname.search('croiseur.php') != -1 ) {
            selectArray = $("select", detailFrame.document);
            inputArray = $("input", detailFrame.document);

            for (var i = 0; i < inputArray.length; i++) {
                if ( inputArray[i].type == "radio" )
                    if ( inputArray[i].value == "1" )
                        radioProtect = inputArray[i];
                if ( inputArray[i].value == "2" )
                    radioBomb = inputArray[i];
            }

            for (var i = 0; i < selectArray.length; i++) {
                if ( selectArray[i].name == "cible" )
                    select = selectArray[i];
                if ( selectArray[i].name == "cibledef" )
                    selectDef = selectArray[i];
            }

            if ( select )
                for (var i = 0; i < select.childNodes.length; i++) {
                    if ( select.childNodes[i].value.search(planetId) != -1 ) {
                        select.selectedIndex = i;
                        radioBomb.checked = "true";
                        break;
                    }
                }

            if ( selectDef )
                for (var i = 0; i < selectDef.childNodes.length; i++) {
                    if ( selectDef.childNodes[i].value.search(planetId) != -1 ) {
                        selectDef.selectedIndex = i;
                        radioProtect.checked = "true";
                        break;
                    }
                }

            for (var i = 0; i < selectArray.length; i++) {
                if ( selectArray[i].name == "frappe" ) {
                    selectX33 = selectArray[i];
                    break;
                }
            }

            if ( selectX33 != undefined )
                for (var i = 0; i < selectX33.childNodes.length; i++) {
                    if ( selectX33.childNodes[i].value.search(planetId) != -1 ) {
                        selectX33.selectedIndex = i;
                        break;
                    }
                }
        }
    }

    this.handlePlanetDblClick = function() {
        document.addEventListener('dblclick', function(event) {
                var planetName,
                    img,
                    link,
                    x,
                    y;

                if ( event.target.nodeName.toLowerCase() == "img" && event.target.src.match("planete")) {
                    event.stopPropagation();
                    event.preventDefault();
                    img = event.target;

                    for (var i = 0; i < img.parentNode.childNodes.length; i++) {
                        if ( img.parentNode.childNodes[i].nodeName.toLowerCase() == "a" ) {
                            link = img.parentNode.childNodes[i];
                            break;
                        }
                    }

                    planetName = link.lastChild.nodeValue.slice(0, link.lastChild.nodeValue.length-1);
                    x = link.href.substr(link.href.indexOf('?x=')+3, 3);
                    y = link.href.substr(link.href.indexOf('&y=')+3, 3);
                    autoselectDestination(planetName, x, y);
                }
            }, true);
    };

    this.newStyle = function() {
        var newStyle = document.createElement("style");
        newStyle.appendChild(document.createTextNode("a:link { color: #09f } \na:visited { color: #09f } \na:hover { color: red} \n"));
        var head = $("head")[0];
        head.appendChild(newStyle);
        var body = $("body")[0];
        body.background = "";
        /*
          allImg = document.getElementsByTagName("img");

          for (var i = 0; i < allImg.length; i++) {
          //GM_log(allImg[i].src);
          if (allImg[i].src == "http://www.fondationjeu.com/images/explode2.gif")
          allImg[i].src = explosionImg;
          //GM_log(allImg[i].src);
          }
        */
    };

    this.installHacks = function() {
        var team = utils.getOption("team");

        this.handlePlanetDblClick();
        this.displayUsefulInfomation();

        this.addGenericLinks();

        if (team == Constants.I3 || team == Constants.SF || team == Constants.MU) {
            this.addFSPLink();
        }

        if (team == Constants.M1 || team == Constants.M2) {
            this.addGoldLink();
        }

        if (team == Constants.E1 || team == Constants.E2) {
            this.addEmpireLink();
        }

        if (team == Constants.F1 || team == Constants.F2 || team == Constants.SF || team == Constants.MU) {
            this.addToasterLink();
        }

        if (team == Constants.MU)
            this.addNeutralLink();

        utils.setOption("BG_switch", "1");
        hackAnimations();

        this.newStyle();

    };

}

var map = new Map();
map.installHacks(); 

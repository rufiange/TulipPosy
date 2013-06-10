/************************************************************************
 * This module is deprecated, it draws an interface onto the svg 
 * window but for the clients needs, this interface was removed and 
 * recreated with html elements. 
 * @requires d3.js
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

(function () {

    import_class('context.js', 'TP');
    import_class("objectReferences.js", "TP");


    var Interface = function () {
        var __g__ = this;

        var contxt = TP.Context();

        var objectReferences = TP.ObjectReferences();

        this.includeFormParam = function (target) {
            myinput = svg.append("foreignObject")
                .attr("width", 100)
                .attr("height", 100)
                .append("xhtml:body")
                .html("<form><input type=checkbox id=check /></form>")
                .on("click", function (d, i) {
                //console.log(svg.select("#check").node().checked);
                });
            myinput = svg.append("foreignObject")
                .attr("width", 300)
                .attr("height", 100)
                .attr("x", 200)
                .attr("y", 200)
                .append("xhtml:body")
                .html("<form><input type=input id=input /></form>")

            //console.log("input created", myinput);
        }


        this.eraseAllInterface = function (target) {
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            var coh = svg.selectAll(".interfaceButton")
                .data([])
                .exit()
                .remove()
        }


        // This function adds a small frame that displays the entanglement informations while they are updated
        // target, the string of the svg interface to draw the frame in
        this.addEntanglementFeedback = function (target) {

            // if pour éviter la recopie si on charge u autre fihier --> nouvelle solutio à voir
           /* $("<div/>", {

                id:"entanglement",
                style:"background-color: #fdd0a2;"
            }).appendTo("#entanglement-cont");*/

            document.getElementById('menu-2').innerHTML += 
                "<div id='entanglement-cont'>"+
                    "<div id='bg'></div>"+
                    "<div id='entanglement'><p>Entanglement:</br>" + 
                "<ul type='none'><li>Intensity: <text id='intensity'></text></br></li>" + 
                "<li>Homogeneity: <text id='homogeneity'></text></li></ul></p></div>"+
                "</div>"

            /*if ($("#entanglement")[0].innerHTML!=="") {$("#entanglement")[0].innerHTML=""};
            $("#entanglement")[0].innerHTML += "<div id='entanglement-cont'><p>Entanglement:</br>" + 
                "<ul type='none'><li>Intensity: <text id='intensity'></text></br></li>" + 
                "<li>Homogeneity: <text id='homogeneity'></text></li></ul></p></div>";*/

            /*var cGraph = null
            var svg = null

            //document.getElementById("").innerHTML = "<p>Name: " + target + "</p>";
            svg = TP.Context().view(target).getSvg();
            cGraph = TP.Context().getViewGraph(target);

            var coh = svg.selectAll("rect entanglement")
                .data(["entanglement"])
                .enter()
                .append('g')
                .attr("transform", function (d) {
                    return "translate(" + 10 + "," + 395 + ")";
                })

            coh.append("rect")
                .attr("class", "entanglementframe")
                .classed("interfaceButton", 1)
                .attr("width", 120)
                .attr("height", 90)
                .style("fill-opacity", 0)
                .style("stroke-width", 1)
                .style("stroke", 'black')

            coh.append("text")
                .attr('class', 'entanglementlabel')
                .classed("interfaceButton", 1)
                .attr("dx", 5)
                .attr("dy", 15)
                .text("Entanglement")
                .style("fill", 'black')
                .style("font-family", TP.Context().defaultTextFont)
                .style("font-size", TP.Context().defaultTextSize)

            coh.append("text")
                .attr('class', 'intensitylabel')
                .classed("interfaceButton", 1)
                .attr("dx", 10)
                .attr("dy", 35)
                .text("intensity:")
                .style("fill", 'black')
                .style("font-size", TP.Context().defaultTextSize)
                .style("font-family", TP.Context().defaultTextFont)

            coh.append("text")
                .attr('class', 'intensity')
                .classed("interfaceButton", 1)
                .attr("dx", 110)
                .attr("dy", 50)
                .text(function (d) {
                    return "" + TP.Context().entanglement_intensity
                })
                .style("fill", 'blue')
                .style("font-family", TP.Context().defaultTextFont)
                .style("font-size", TP.Context().defaultTextSize)
                .style('text-anchor', 'end')

            coh.append("text")
                .attr('class', 'homogeneitylabel')
                .classed("interfaceButton", 1)
                .attr("dx", 10)
                .attr("dy", 70)
                .attr("width", 120)
                .style("font-family", TP.Context().defaultTextFont)
                .text('homogeneity:')
                .style("font-size", TP.Context().defaultTextSize)
                .style("fill", 'black')
                
            coh.append("text")
                .attr('class', 'homogeneity')
                .classed("interfaceButton", 1)
                .attr("dx", 110)
                .attr("dy", 85)
                .text(function (d) {                   
                    return "" + TP.Context().entanglement_homogeneity
                })
                .style('text-anchor', 'end')
                .style("font-family", TP.Context().defaultTextFont)
                .style("fill", 'blue')
                .style("font-size", TP.Context().defaultTextSize)
                */
        }



        // This function adds the graph interactor buttons (move and select) 
        // to a target interface.
        // target, the string of the svg interface to draw the buttons in
        // positionNumber, the position at which we want to place the buttons
        // One button triggers the other one on or off, and refers to the 
        // global mode variable 'move_mode' or 'select_mode'
        this.addGraphInteractorButtons = function (target, positionNumber) {
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            var btMove = svg.selectAll("rect.moveButton")
                .data([{
                    text: "move",
                    colorOver: TP.Context().defaultFillColor,
                    colorOut: TP.Context().highlightFillColor
                }])
                .enter()
                .append('g')
                .attr("class", "moveButton")
                .classed("interfaceButton", 1)
                .attr("transform", function (d) {
                    return "translate(" + 10 + "," + (10+25*positionNumber) + ")";
                })
                .on("click", function (d) {
                    d3.select(this)
                        .select("rect")
                        .style("fill", "yellow");
                    //objectReferences.InterfaceObject.toggleSelectMove(target);
                    TP.Context().stateStack[target].executeCurrentState();
                })
                .on("mouseover", function (d) {
                    TP.Context().mouse_over_button = true;
                    if (!TP.Context().view[target].getMoveMode()) {
                        d.colorOver = TP.Context().highlightFillColor;
                        d.colorOut = TP.Context().defaultFillColor;
                    } else {
                        d.colorOver = TP.Context().defaultFillColor;
                        d.colorOut = TP.Context().highlightFillColor;
                    }  
                    d3.select(this)
                        .select("rect")
                        .style("fill", d.colorOver);
                })

                .on("mouseout", function (d) {
                    TP.Context().mouse_over_button = false;
                    if (!TP.Context().view[target].getMoveMode()) {
                        d.colorOver = TP.Context().highlightFillColor;
                        d.colorOut = TP.Context().defaultFillColor;
                    } else {
                        d.colorOver = TP.Context().defaultFillColor;
                        d.colorOut = TP.Context().highlightFillColor;
                    }
                    d3.select(this)
                        .select("rect")
                        .style("fill", d.colorOut);
                })

            btMove.append("rect")
                .attr("class", "moveButton")
                .classed("interfaceButton", 1)
                .attr("width", 120)
                .attr("height", 20)
                .style("fill", TP.Context().highlightFillColor)
                .style("stroke-width", TP.Context().defaultBorderWidth)
                .style("stroke", TP.Context().defaultBorderColor)

            btMove.append("text")
                .attr("class", "moveButton")
                .classed("interfaceButton", 1)
                .attr("dx", 5)
                .attr("dy", 15)
                .text(function (d) {
                    return d.text
                })
                .style("font-family", TP.Context().defaultTextFont)
                .style("fill", TP.Context().defaultTextColor)
                .style("font-size", TP.Context().defaultTextSize)

            var btSelect = svg.selectAll("rect.selectButton")
                .data([{
                    text: "select",
                    colorOver: TP.Context().highlightFillColor,
                    colorOut: TP.Context().defaultFillColor
                }])
                .enter()
                .append('g')
                .attr("class", "selectButton")
                .classed("interfaceButton", 1)
                .attr("transform", function (d) {
                    return "translate("+10+","+(10+25*(positionNumber+1))+")";
                })
                .on("click", function (d) {
                    d3.select(this)
                        .select("rect")
                        .style("fill", "yellow");
                    //objectReferences.InterfaceObject.toggleSelectMove(target);
                    TP.Context().stateStack[target].executeCurrentState();
                })
                .on("mouseover", function (d) {
                    TP.Context().mouse_over_button = true;
                    var select_mode = TP.Context().view[target].getSelectMode();
                    //if (!eval("TP.Context().select_mode_" + target)) {
                    if (!select_mode) {
                        d.colorOver = TP.Context().highlightFillColor;
                        d.colorOut = TP.Context().defaultFillColor;
                    } else {
                        d.colorOver = TP.Context().defaultFillColor;
                        d.colorOut = TP.Context().highlightFillColor;
                    }
                    d3.select(this)
                        .select("rect")
                        .style("fill", d.colorOver);
                })
                .on("mouseout", function (d) {
                    TP.Context().mouse_over_button = false;
                    var select_mode = TP.Context().view[target].getSelectMode();
                    //if (!eval("TP.Context().select_mode_" + target)) {
                    if (!select_mode) {
                        d.colorOver = TP.Context().highlightFillColor;
                        d.colorOut = TP.Context().defaultFillColor;
                    } else {
                        d.colorOver = TP.Context().defaultFillColor;
                        d.colorOut = TP.Context().highlightFillColor;
                    }
                    d3.select(this)
                        .select("rect")
                        .style("fill", d.colorOut);
                })

            btSelect.append("rect")
                .attr("class", "selectButton")
                .classed("interfaceButton", 1)
                .attr("width", 120)
                .attr("height", 20)
                .style("fill", TP.Context().defaultFillColor)
                .style("stroke-width", TP.Context().defaultBorderWidth)
                .style("stroke", TP.Context().defaultBorderColor)
            btSelect.append("text")
                .attr("class", "selectButton")
                .classed("interfaceButton", 1)
                .attr("dx", 5)
                .attr("dy", 15)
                .text(function (d) {
                    return d.text
                })
                .style("fill", TP.Context().defaultTextColor)
                .style("font-family", TP.Context().defaultTextFont)
                .style("font-size", TP.Context().defaultTextSize)
        }


        this.addInfoButton = function (target) {
            var cGraph = target.getGraph();
             var zone = '#infoView'
             document.getElementById('infoView').innerHTML = ''
             $('<p/>', {style:'text-align:center', text:'Name: '+target.getName()}).appendTo(zone);
            $('<p/>', {text:cGraph.nodes().length+' nodes'}).appendTo(zone);
            $('<p/>', {text:cGraph.links().length+' links'}).appendTo(zone);

            

            /*
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().getViewGraph(target);

            posInfo_x = TP.Context().width - 30
            posInfo_y = TP.Context().height - 5
            var btInfo = svg.selectAll("g.info")
                .data(["`"])
                .enter()
                .append('g')
                .attr("class", "info")
                .classed("interfaceButton", 1)
                .attr("transform", function () {
                    return "translate(" + posInfo_x + "," + posInfo_y + ")";
                })


            btInfo.append("text")
                .text(function (d) {
                    return "`"
                })
                .style("fill", "lightgray")
                .style("font-family", "EntypoRegular")
                .style("font-size", 50)
                .on("mouseover", function () {
                    d3.select(this)
                        .style("fill", "black")
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .style("fill", "lightgray");
                    svg.selectAll(".infoWindow")
                        .data([])
                        .exit()
                        .remove();
                })


            btInfo.on("click", function () {
                sGroup = svg.selectAll("infoWindow")
                    .data(['WX'])
                    .enter()
                    .append("g")
                    .attr("class", "infoWindow")
                    .attr("transform", function () {
                        return "translate(" + (posInfo_x - 120) + "," 
                            + (posInfo_y - 40) + ")";
                    })

                sRect = sGroup.append("rect")
                    .attr("class", "infoWindow")
                    .attr("width", 120)
                    .attr("height", 35)
                    .style("fill", TP.Context().defaultFillColor)
                    .style("stroke-width", TP.Context().defaultBorderWidth)
                    .style("stroke", TP.Context().defaultBorderColor)

                sGroup.append("text")
                    .attr("class", "infoWindow")
                    .attr("dx", 5)
                    .attr("dy", 15)
                    .text(function () {
                        return "" + cGraph.nodes().length + " nodes"
                    })
                    .style("font-family", TP.Context().defaultTextFont)
                    .style("fill", TP.Context().defaultTextColor)
                    .style("font-size", TP.Context().defaultTextSize)

                sGroup.append("text")
                    .attr("class", "infoWindow")
                    .attr("dx", 5)
                    .attr("dy", 28)
                    .text(function () {
                        return "" + cGraph.links()
                            .length + " links"
                    })
                    .style("font-family", TP.Context().defaultTextFont)
                    .style("fill", TP.Context().defaultTextColor)
                    .style("font-size", TP.Context().defaultTextSize)
            })*/
        }


        this.selectWeightProperty = function (group) {
            group.append("foreignObject")
                .attr("x", 10)
                .attr("y", 20)
                .attr("width", 200)
                .attr("height", 200)
                .append("xhtml:body")
                .html(function (d) {
                    selectHTMLString = "<form><select id=weightPropSel>"
                    selectHTMLString += " <option value=\"\"><i>--</i></option>"

                    nbElements = Object.keys(TP.Context().substrateProperties)
                        .length
                    Object.keys(TP.Context().substrateProperties)
                        .forEach(function (k, i) {
                            //console.log("props: ", k)
                            if (TP.Context().substrateProperties[k] == "number") {
                                selectHTMLString += " <option value=\"" + k + "\">" + k + "</option>"
                            }
                        });

                    selectHTMLString += "</select></form>"

                    return selectHTMLString
                })
        }


        this.holdSVGInteraction = function (target) {
            objectReferences.InteractionObject.removeZoom(target);
            objectReferences.InteractionObject.removeLasso(target);
        }


        // This function toggles the 'select' and 'move' modes for the 
        // interactors
        // target, the string value of the target svg view
        this.toggleSelectMove = function (target) {

            if (!target)
                return

            var svg = null
            svg = TP.Context().view[target].getSvg();
			
            //eval("TP.Context().select_mode_"+target+" = ! TP.Context().select_mode_"+target);
            //eval("TP.Context().move_mode_"+target+" = ! TP.Context().move_mode_"+target);
           
            //TP.Context().tabSelectMode[target] = !TP.Context().tabSelectMode[target];
            TP.Context().view[target].setSelectMode(!TP.Context().view[target].getSelectMode());
            //TP.Context().tabMoveMode[target] = !TP.Context().tabMoveMode[target];
            TP.Context().view[target].setMoveMode(!TP.Context().view[target].getMoveMode());
            
            console.log(!TP.Context().view[target].getSelectMode())
            console.log(!TP.Context().view[target].getMoveMode())
            
            //if(eval("TP.Context().select_mode_"+target)) {
            
            if(TP.Context().view[target].getSelectMode()) {            	
                svg.select('rect.moveButton').style('fill', TP.Context().defaultFillColor);
                svg.select('rect.selectButton').style('fill', TP.Context().highlightFillColor); 
                objectReferences.InteractionObject.addLasso(target);
                objectReferences.InteractionObject.removeZoom(target);
            }

            //if(eval("TP.Context().move_mode_"+target)) {
            if(TP.Context().view[target].getMoveMode()) {
                //svg.style("cursor", "all-scroll");
                svg.select('rect.moveButton').style('fill', TP.Context().highlightFillColor);
                svg.select('rect.selectButton').style('fill', TP.Context().defaultFillColor);
                objectReferences.InteractionObject.removeLasso(target);
                objectReferences.InteractionObject.addZoom(target);
            }
        }


        this.addSettingsButton = function (target) {
            objectReferences.InterfaceObject.holdSVGInteraction(target) //before, there was only substrate

            svg = TP.Context().view[target].getSvg();
            posSettings_x = TP.Context().width - 30
            posSettings_y = 30

            var btSettings = svg.selectAll("g.settings")
                .data(["@"])
                .enter()
                .append('g')
                .attr("class", "settings")
                .classed("interfaceButton", 1)
                .attr("transform", function () {
                    return "translate(" + posSettings_x + "," + posSettings_y+")";
                })

            btSettings.append("text")
                .text(function (d) {
                    return "@"
                })
                .style("fill", "lightgray")
                .style("font-family", "EntypoRegular")
                .style("font-size", 50)
                .on("mouseover", function () {
                    d3.select(this).style("fill", "black")
                })
                .on("mouseout", function () {
                    d3.select(this).style("fill", "lightgray")
                })

            btSettings.on("click", function () {
                sGroup = svg.selectAll("settingsWindow")
                    .data(['WX'])
                    .enter()
                    .append("g")
                    .attr("class", "settingsWindow")
                    .attr("transform", function () {
                        return "translate(" + (posSettings_x - 120) + "," + posSettings_y + ")";
                    })

                sRect = sGroup.append("rect")
                    .attr("class", "settingsWindow")
                    .attr("width", 120)
                    .attr("height", 120)
                    .style("fill", TP.Context().defaultFillColor)
                    .style("stroke-width", TP.Context().defaultBorderWidth)
                    .style("stroke", TP.Context().defaultBorderColor)

                sGroup.append("text")
                    .attr("class", "settingsWindow")
                    .attr("dx", 5)
                    .attr("dy", 15)
                    .text(function () {
                        return "Weight property"
                    })
                    .style("font-family", TP.Context().defaultTextFont)
                    .style("fill", TP.Context().defaultTextColor)
                    .style("font-size", TP.Context().defaultTextSize)

                objectReferences.InterfaceObject.selectWeightProperty(sGroup);

                sGroup.append("text")
                    .attr("class", "settingsWindow")
                    .attr("dx", 50)
                    .attr("dy", 115)
                    .text(function () {
                        return "WX"
                    })
                    .style("font-family", "EntypoRegular")
                    .style("fill", "lightgray")
                    .style("font-size", 30)
                    .on("click", function () {
                        TP.Context().substrateWeightProperty=svg.select("#weightPropSel")
                            .node()
                            .value;
                        svg.selectAll(".settingsWindow")
                            .data([])
                            .exit()
                            .remove();
                    })
                    .on("mouseover", function () {
                        d3.select(this).style("fill", "black")
                    })
                    .on("mouseout", function () {
                        d3.select(this).style("fill", "lightgray")
                    })
            })
        }


        // Adds a button to a specific interface with its callback
        // target, the string of the svg interface to draw the button in
        // positionNumber, the position at which we want to place the button
        // buttonLabel, the label of the button
        // className, the name of the class assigned to the button
        // callback, the callback function associated to the button click        
        this.addButton = function(target,positionNumber,buttonLabel,className,callback){
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            var bt = svg.selectAll("rect." + className)
                .data([buttonLabel])
                .enter()
                .append('g')
                .attr("class", className)
                .classed("interfaceButton", 1)
                .attr("transform", function (d) {
                    return "translate(" + 10 + "," + (10+25*positionNumber)+")";
                })
                .on("click", function () {
                    d3.select(this)
                        .select("rect")
                        .style("fill", "yellow");
                    callback();
                })
                .on("mouseover", function () {
                    d3.select(this)
                        .select("rect")
                        .style("fill", TP.Context().highlightFillColor);
                    TP.Context().mouse_over_button = true;
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .select("rect")
                        .style("fill", TP.Context().defaultFillColor);
                    TP.Context().mouse_over_button = false;
                })

            bt.append("rect")
                .attr("class", className)
                .classed("interfaceButton", 1)
                .attr("width", 120)
                .attr("height", 20)
                .style("fill", TP.Context().defaultFillColor)
                .style("stroke-width", TP.Context().defaultBorderWidth)
                .style("stroke", TP.Context().defaultBorderColor)


            bt.append("text")
                .attr("class", className)
                .classed("interfaceButton", 1)
                .attr("dx", 5)
                .attr("dy", 15)
                .text(function (d) {
                    return d
                })
                .style("fill", TP.Context().defaultTextColor)
                .style("font-family", TP.Context().defaultTextFont)
                .style("font-size", TP.Context().defaultTextSize)
        }


        this.attachInfoBox = function (target) {
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            //eval("TP.Context().node_information_" + target + " = !TP.Context().node_information_" + target);
			//TP.Context().tabNodeInformation[target] = !TP.Context().tabNodeInformation[target];
            TP.Context().view[target].setNodeInformation(!TP.Context().view[target].getNodeInformation());

            if (!TP.Context().view[target].getNodeInformation()) {
                svg.selectAll("g.infoBox")
                    .on("mouseout", function () {
                        d3.select(this)
                            .select("rect.infoBox")
                            .style("fill", TP.Context().defaultFillColor);
                        TP.Context().mouse_over_button = false;
                    });
                svg.selectAll("g.node").on("mouseover", null);
                return
            }

            svg.selectAll("g.infoBox")
                .on("mouseout", function () {
                    d3.select(this)
                        .select("rect.infoBox")
                        .style("fill", TP.Context().highlightFillColor);
                    TP.Context().mouse_over_button = false;
                });
            svg.selectAll("g.node")
                .on("mouseover", function (d) {
                    objectReferences.InterfaceObject.addInfoBox(target, d)
                });
        }


        this.addInfoBox = function (target, node) {
            var cGraph = null
            var svg = null

            svg = TP.Context().view[target].getSvg();
            cGraph = TP.Context().view[target].getGraph();

            function move() {
                objectReferences.InterfaceObject.parentNode.appendChild(this);
                var dragTarget = d3.select(this);
                var currentPanel = dragTarget.data()[0]
                var posX = d3.event.dx
                var posY = d3.event.dy

                var newX = 0
                var newY = 0

                if (currentPanel.panelPosX || currentPanel.panelPosY) {
                    newX = currentPanel.panelPosX + posX
                    newY = currentPanel.panelPosY + posY
                } else {
                    newX = currentPanel.x + posX
                    newY = currentPanel.y + posY
                }

                dragTarget.attr("transform", function (d) {
                    d.panelPosX = newX;
                    d.panelPosY = newY;
                    return "translate(" + newX + "," + newY + ")"
                });
            };

            nbInfoBox = svg.selectAll("g.nodeInfo")[0].length
            //console.log("the current node", node);

            ib = svg.selectAll("g.nodeInfo" + node.baseID)
                .data([node])
                .enter()
                .append("g")
                .attr("class", function (d) {
                    return "nodeInfo" + d.baseID
                })
                .attr("transform", function (d) {
                    return "translate(" + d.currentX + "," + d.currentY + ")";
                })
                .call(d3.behavior.drag()
                .on("drag", objectReferences.InterfaceObject.move))

            ib.append("rect")
                .classed("nodeInfo", true)
                .attr("width", 200)
                .attr("height", 200)
                .style("fill", TP.Context().defaultFillColor)
                .style("stroke-width", TP.Context().defaultBorderWidth)
                .style("stroke", TP.Context().defaultBorderColor)

            ib.append("text")
                .classed("nodeInfo", true)
                .text("node information")
                .attr("dx", 5)
                .attr("dy", 15)
                .style("fill", TP.Context().defaultTextColor)
                .style("font-family", TP.Context().defaultTextFont)
                .style("font-size", TP.Context().defaultTextSize)

            ib.append("text")
                .classed("nodeInfo", true)
                .text(function (d) {
                    return ("ID " + d.baseID)
                })
                .attr("dx", 5)
                .attr("dy", 30)
                .style("fill", TP.Context().defaultTextColor)
                .style("font-family", TP.Context().defaultTextFont)
                .style("font-size", TP.Context().defaultTextSize)

            ib.append("text")
                .classed("nodeInfo", true)
                .text(function (d) {
                    return d.label
                })
                .attr("dx", 5)
                .attr("dy", 42)
                .style("fill", TP.Context().defaultTextColor)
                .style("font-family", TP.Context().defaultTextFont)
                .style("font-size", TP.Context().defaultTextSize)

            ib.append("text")
                .classed("nodeInfo", true)
                .text("X")
                .attr("dx", 186)
                .attr("dy", 18)
                .style("fill", "lightgray")
                .style("font-family", "EntypoRegular")
                .style("font-size", 30)
                .on("click", function (d) {
                    svg.selectAll("g.nodeInfo" + node.baseID)
                        .data([])
                        .exit()
                        .remove();
                })
                .on("mouseover", function () {
                    d3.select(this)
                        .style("fill", "black")
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .style("fill", "lightgray")
                })

            //console.log("node info appended", ib)
        }


        this.setCombinedForeground = function (target) {
            TP.Context().combined_foreground = target;
            var toggleBtnText = ""
            if (target == "substrate") {
                toggleBtnText = "catalyst";
            } else if (target == "catalyst") {
                toggleBtnText = "substrate";
            }

            //console.log("toggling: ", TP.Context().combined_foreground);

            TP.Context().view["combined"].getSvg().selectAll("g.toggleCombinedForeground")
                .select("text")
                .text("g " + toggleBtnText)

            TP.Context().view["combined"].getSvg().selectAll("g.node")
                .data(TP.Context().tabGraph["graph_combined"].nodes(), function(d){return d.baseID}) 
                .style("opacity", function (d) {
                    if (d._type == TP.Context().combined_foreground) {
                        return 1;
                    } else {
                        return 0.5;
                    }
                })
        }


        this.toggleCombinedForeground = function (target) {
            if (TP.Context().combined_foreground == "substrate") {
                __g__.setCombinedForeground("catalyst");
            } else if (TP.Context().combined_foreground == "catalyst") {
                __g__.setCombinedForeground("substrate");
            }
        }


        // gestion du menu à gauche
        
        /*this.createMenu = function(nbPane){
            for(i=0; i<nbPane; i++)
                this.addPane();
        }


        this.addPane = function(){
            menuNum =TP.Context().menuNum++;
            $("<div/>", {
                "class": "cont",
                id: "menu-"+menuNum,
                style:"left:-231; z-index:0;",
            }).appendTo("#wrap");

            $("<span/>", {
                "class": "toggleButton",
                id: "toggleBtn"+menuNum,
                text: ">",
                style:"top:"+40*menuNum+"px;",
            }).appendTo("#menu-"+menuNum);
            
        }*/

        this.addPanelMenu = function(header){
            menuNum =contxt.menuNum++;
            $("<div/>", {
                "class": "cont",
                id: "menu-"+menuNum,
            }).appendTo("#wrap");

            $("<span/>", {
                "class": "toggleButton",
                id: "toggleBtn"+menuNum,
                text: ">",
                style:"top:"+40*menuNum+"px;",
            }).appendTo("#menu-"+menuNum);

            $('<div/>', {
                class:'header-menu', 
                text:header
            }).appendTo('#menu-'+menuNum);

            $('<div/>',{
                id:'menu'+menuNum+'-content',
                class:'menu-content',
            }).appendTo('#menu-'+menuNum)
            
            return 'menu-'+menuNum;
        }

        this.interactionPane = function(buttons, mode){
            var menu, content;
            if(mode==='update'){
                for(var i=0; i<contxt.menuNum;i++){
                    if($('.header-menu').eq(i).text()==='Interactions'){
                        menu = '#' + $('.header-menu').eq(i).parent().attr('id')
                        content = $('.header-menu').eq(i).siblings('.menu-content')
                        document.getElementById(content.attr('id')).innerHTML = ''
                    }
                }
            }else if(mode==='create'){
                menu = this.addPanelMenu('Interactions');
                content = $("#"+menu +" .menu-content");
                content.accordion({
                    collapsible:true,
                    active:false,
                    heightStyle:'content'
                });
            }
            this.createArrayButtons(buttons, content.attr('id'));
        }

        this.infoPane = function(){
            var menu = this.addPanelMenu('Informations');
            var content = $("#"+menu +" .menu-content");

            $('<div/>', {id:'infoView'}).appendTo('#'+content.attr('id'));


            document.getElementById(menu).innerHTML += 
                "<div id='entanglement-cont'>"+
                    "<div id='bg'></div>"+
                    "<div id='entanglement'><p>Entanglement:</br>" + 
                "<ul type='none'><li>Intensity: <text id='intensity'></text></br></li>" + 
                "<li>Homogeneity: <text id='homogeneity'></text></li></ul></p></div>"+
                "</div>"

            //affichage par défaut
            //this.addInfoButton(contxt.activeView);
        }


        this.visuPane = function(pane){
            var menu = this.addPanelMenu('');
            var content = $("#"+menu +" .menu-content");

      

            var visu = content[0];
            var view = TP.Context().activeView;
            visu.innerHTML += 
                "Nodes: </br>" +
                    "<span id='colorNode' ></span><button id='shapeNode'>shape</button></br>"+
                "Links: </br>" +
                    "<span id='colorLink'></span><button id='shapeLink'>shape</button></br>"+
                "Background: </br>" +

                    "<span id='colorBg'></span> <span id='test' ></span> </br>"+
                     "<button id='apply'>Apply</button> </br>"/*+
                "Labels: </br>" +
                    "<span id='colorLabel'></span> </br>"+
                     "<button id='apply'>Apply</button> </br>"*/;
            
           $('#colorNode').jPicker({
                window:{
                    expandable: true, 
                    position:{x:250, y:0},   

                },
            });
           $('#colorLink').jPicker({
                window:{
                    expandable: true, 
                    position:{x:250, y:0},
                }
            });
           $('#colorBg').jPicker({
                window:{
                    expandable: true,
                    position:{x:250, y:0},
                }
            });
           /*$('#colorLabel').jPicker({
                window:{
                    expandable: true,
                    position:{x:250, y:0},

                }
            });  */  
            $('#apply').click(function(){
                /*contxt.labelColor = "#" + $.jPicker.List[3].color.active.val('hex');
                console.log(contxt.labelColor)*/

                    TP.Context().view[TP.Context().activeView].setNodesColor("#" + $.jPicker.List[0].color.active.val('hex'));
                    TP.Context().view[TP.Context().activeView].setLinksColor("#" + $.jPicker.List[1].color.active.val('hex'));
                    TP.Context().view[TP.Context().activeView].setBgColor("#" + $.jPicker.List[2].color.active.val('hex'));
                    objectReferences.VisualizationObject.changeColor(TP.Context().activeView, "node", TP.Context().view[TP.Context().activeView].getNodesColor());
                    objectReferences.VisualizationObject.changeColor(TP.Context().activeView, "link", TP.Context().view[TP.Context().activeView].getLinksColor());
                    objectReferences.VisualizationObject.changeColor(TP.Context().activeView, "bg", TP.Context().view[TP.Context().activeView].getBgColor());
            });
            

        }

        this.createElement = function(balise, attributes,  parentId, labelPrec, labelSuiv){
            if(labelPrec) jQuery('<label/>', {text:labelPrec+' '}).appendTo(parentId);
            var elem = jQuery('<'+balise+'/>', attributes).appendTo(parentId);
            if(labelSuiv) jQuery('<label/>', {text:' '+labelSuiv}).appendTo(parentId);
            return elem;
        }
        this.createForm = function(menuPane, id, title, tab, event){

            if (tab!=''){
                var elem = this.createElement('p', {class:'header-form', text:title}, '#'+menuPane)
                this.createElement('div', {class:'accordion', id:id}, '#'+menuPane)
                for (var i = 0; i < tab.length; i++) {
                    this.createElement(tab[i][0], tab[i][1], '#'+id, tab[i][2], tab[i][3])
                    this.createElement('br', null, '#'+id)
                }

                this.createElement('button', {class:'submit', id:'submit-'+id, text:"Apply"}, '#'+id)
                $('#submit-'+id).click(function(){objectReferences.InterfaceObject.callbackMenu('#submit-'+id, event)})

            }else{
                var elem = this.createElement('p', {class:'buttonMenu', text:title}, '#'+menuPane)
                elem.click(event.click)
                this.createElement('div', {class:"button-collapsed"}, '#'+menuPane)
            }

            $('#'+menuPane).accordion('refresh')
        }

        this.createArrayButtons = function(tab, pane){
            for(var i=0; i<tab.length; i++){
                this.createForm(pane, tab[i][0], tab[i][1], tab[i][2], tab[i][3])
            }
                $( "#sizemap" ).slider({ 
                    range: true,
                    min: 0,
                    max: 99,
                    values: [ 3, 12 ],
                    change: function() {
                        var value = $("#sizemap").slider("values",0);
                        var value2 = $("#sizemap").slider("values",1);
                        $("#sizemap").find(".ui-slider-handle").eq(0).text(value);
                        $("#sizemap").find(".ui-slider-handle").eq(1).text(value2);
                    },
                    slide: function() {
                        var value = $("#sizemap").slider("values",0);
                        var value2 = $("#sizemap").slider("values",1);
                        $("#sizemap").find(".ui-slider-handle").eq(0).text(value);
                        $("#sizemap").find(".ui-slider-handle").eq(1).text(value2);
                    }
                });
        }

        this.callbackMenu = function(param, event){
        var res = {}
        var key = null;
        var val = null;
        var btn = $(param);
        // console.log(btn.siblings('input'))
        // console.log(btn.siblings('input[type="text"]')[0].name)
        // console.log(btn.siblings('input[type="text"]')[0].value)

        var data = btn.siblings("input[type='radio']:checked")
        data.each(function(){
            key = btn.attr('name');
            res[key] = btn.val();
        })

        data = btn.siblings('.ui-spinner')
        data.each(function(){
            key = btn.children('input').attr('name');       
            val = btn.children('input')[0].value
            res[key] = val;
        })

        data = btn.siblings("input[type='checkbox']:checked")
        data.each(function(){

            key = btn.attr('name');
            if (res[key]==null)         
                res[key] = btn.val();
            else
                res[key] += ", "+btn.val();
        })

        data = btn.siblings("input[type='text']")
        for(var i=0; i<data.length; i++){
            key = data[i].name;
            val = data[i].value;
            res[key] = val;
        }

        data = btn.siblings('.slider');
        var data2 = btn.siblings('.slider');
        console.log(data)
        for(var i=0; i<data.length; i++){
            key = 'valMin'+i
            val = data.eq(i).slider("values",0);
            res[key] = val;
            key = 'valMax'+i
            val = data.eq(i).slider("values",1);
            res[key] = val;
        }
        //console.log(res)

        event.call(res)
        
        }

        return __g__;

    }
    return {Interface: Interface};
})()
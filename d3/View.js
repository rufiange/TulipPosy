/************************************************************************
 * This module implements the concept of "View". It associates the svg
 * graphs with their corresponding html elements.
 * @authors Fabien Gelibert, Anne Laure Mesure, Guillaume Guerin
 * @created March 2013
 ***********************************************************************/

(function () {

import_class('context.js', 'TP');
import_class("objectReferences.js", "TP");
import_class('stateSelect.js','TP');

var View = function (id, groupe, bouton, svgs, target, nodesC, linksC, bgC, view_nodes, type, idAssociation) {

	//assert(bouton != null && svgs != null && target != null && application != null, "parametres ok!");
    var __g__ = this;


    var tabDataSvg = svgs;
    var viewGroup = groupe;
    //TP.Context().view[target] = __g__;
    
    var controller = null;
    var svg = null;
    var nodesColor = nodesC;
    var linksColor = linksC;
    var bgColor = bgC;
    var viewNodes = null;
    var lasso = null;
    var DataTranslation = null;
    
	var selectMode = null;
	var moveMode = null;
	var showLabels = null;
	var showLinks = null;
	var nodeInformation = null; 
    
    var metric_BC = null;
    var metric_SP = null;
    var combined_foreground = null;
    
    var typeView = type;
    var acceptedGraph = [];
    var tabLinks = new Object();
    var name = target;
    
    var graph = null;
    var viewInitialized = null;
    
   	var ID = id;
    
    this.getGroup = function()
    {    	
    	return viewGroup;    	
    }
    
    this.viewInitialized = function()
    {
    	return viewInitialized;
    }
    
    this.getGraph = function()
    {
    	return graph;
    }
    
    this.getName = function()
    {
    	return name;
    }
    
    this.getID = function(){    	
    	//return name;
    	return ID;    	
    }    
    
    this.setAssociatedView = function(linkType, view)
    {
       	if(tabLinks[linkType] != null)
    	{
    		tabLinks[linkType].push(view);    		
    	}
    	else{    		
    		tabLinks[linkType] = new Array();
    		tabLinks[linkType].push(view);    		
    	}    	
    }
    
    
    this.getAssociatedView = function(linkType)
    {
    	if(tabLinks[linkType] != null){
    		if(tabLinks[linkType].length != 0)
    			return tabLinks[linkType];
    		else
    			return null;
    	}
    	else
    		return null;
    }
    
    
    
    this.getType = function()
    {
    	return typeView;
    }
            
    
    this.getDataTranslation = function(){    	
    	return DataTranslation;    	
    }
    
    this.setDataTranslation = function(value){    	
    	DataTranslation = value;    	
    }
    
    
    this.setMetric_BC = function(value){    	
    	metric_BC = value;    	
    }
    
    this.getMetric_BC = function(){    	
    	return metric_BC;    	
    }
    
    this.setMetric_SP = function(value){    	
    	metric_SP = value;    	
    }
    
    this.getMetric_SP = function(){    	
    	return metric_SP;    	
    }
    
    this.setLasso = function(value){	
		lasso = value;    	
    }
    
    this.getLasso = function(value){    	
    	return lasso;    	
    }
    
    this.getController = function(){    	
    	return controller;    	
    }

	this.getSvg = function(){		
		return svg;		
	}
	
	this.getNodesColor = function(){		
		return nodesColor;		
	}
	
	this.setNodesColor = function(value){		
		nodesColor = value;		
	}	

	this.getLinksColor = function(){		
		return linksColor;		
	}
	
	this.setLinksColor = function(value){		
		linksColor = value;		
	}
	
	this.getBgColor = function(){		
		return bgColor;		
	}

	this.setBgColor = function(value){		
		bgColor = value;		
	}

	this.getViewNodes = function(){		
		return viewNodes;		
	}
	
	this.getSelectMode = function(){		
		return selectMode;		
	}
	
	this.setSelectMode = function(value){		
		selectMode = value;		
	}
	
	this.getMoveMode = function(){		
		return moveMode;		
	}
	
	this.setMoveMode = function(value){		
		moveMode = value;		
	}
	
	this.getShowLabels = function(){		
		return showLabels;		
	}
	
	this.setShowLabels = function(value){		
		showLabels = value;		
	}
	
	
	this.getShowLinks = function(){		
		return showLinks;		
	}
	
	this.setShowLinks = function(value){		
		showLinks = value;		
	}	
	
	this.getNodeInformation = function(){		
		return nodeInformation;		
	}
	
	this.setNodeInformation= function(value){		
		nodeInformation = value;		
	}		

	this.addView = function() {
		
	    elem = document.getElementById("bouton" + ID);
	    if (elem) elem.parentNode.removeChild(elem);
	    elem = $("div[aria-describedby='zone" + ID + "']");
	     console.log(elem)
	    if (elem!=[])elem.remove();
	
	    
	    console.log($("div[aria-describedby='zone"+ID+"']"))
	    //console.log($("div[aria-describedby='zoneBarChart_substrate']"))
	   
	    //if (elem!=[])elem.remove();
	
		//$("#container").empty();
	
	    /**************************
	     * Application
	     **************************/
	    controller = Em.Application.create();
	
	    /**************************
	     * Models
	     **************************/
	
	    controller.Boutton = Em.Object.extend({
	        idButton: '',
	        fonction: ''
	    });
	
	
	    /**************************
	     * Controllers
	     **************************/
	
	    controller.testArrayController = Em.ArrayController.create({
	        content: [],
	
	        loadFunction: function (propName, value) {
	            var obj = this.findProperty(propName, value);
	            obj.fonction();
	        },
	
	        addFunction: function (object) {
	            var obj = this.findProperty("idButton", object.idButton);
	            if (obj == null) {
	                this.pushObject(object);
	                //console.log("ajout bouton");
	            }
	        }
	    });
	
	
	    /**************************
	     * Views
	     **************************/
	
	    //TP.Context().activeView = ID;
	    //console.log('-->'+target);
	    
	
	    if(typeView ==="substrate")    {TP.Context().activeView = ID; TP.Context().dialogTop=0;  TP.Context().dialogRight=600; }
	    else if(typeView ==="catalyst"){ TP.Context().dialogTop=0;  TP.Context().dialogRight=100; }
	    else                        { TP.Context().dialogTop=235; TP.Context().dialogRight=260; }
	
	
	    /****  création du dialog ****/
	    //document.getElementById("container").innerHTML += "<div id='zone" + target + "' title='" + target + "' ></div>";
	
	     $("<div/>", {id: "zone"+ID, title: target}).appendTo("html");
	
	    var dialog = $("[id=zone" + ID + "]");
	    //console.log(dialog);
	
	    dialog.dialog({
	        height: TP.Context().dialogHeight,
	        width: TP.Context().dialogWidth,
	        minWidth:185,
	        position: "right-"+ TP.Context().dialogRight + " top+" + TP.Context().dialogTop ,/*{my: "center", at: "center", of: "#container"}*/
	    }).parent().resizable({
	        containment: "#container"
	    }).draggable({
	        containment: "#container",
	        opacity: 0.70
	    });
	
	    /****   en-tête du dialog   ****/
	
	    var titlebar = dialog.parents('.ui-dialog').find('.ui-dialog-titlebar');
	    $("<button/>", {text:"-"}).appendTo(titlebar).button().click(function() {dialog.toggle();});        
	    $("<button/>", {id: "toggle"+ID, text:"Move"}).appendTo(titlebar); 
	
	    $('#toggle' + ID).button().click (function(event){
	        var interact = $(this).button("option","label");
	        if (interact=="Move")   { $(this).button("option", "label", "Select");}
	        else                    { $(this).button("option", "label", "Move");}
	        TP.Context().stateStack[ID].executeCurrentState();
	    });
		        
	    

	    dialog.parent().click(function(){ 
	        TP.Context().activeView = ID;
	        console.log(TP.Context().activeView);
	        TP.Context().InterfaceObject.interactionPane(bouton,'update')
        	TP.Context().InterfaceObject.addInfoButton(__g__);
        	/*
	        var num = 0;
	        $(".arrayButtons").remove();
	
	        var pane = d3.select('#menu-1').append("div")
	            .attr("id", "button" + ID)
	            .attr('class','arrayButtons');
	
	        while (num < bouton.length) {
	            var i = num;
	            var j = 0 + i;
	            var bout = TP.Context().view[ID].getController().Boutton.create({
	                idButton: bouton[i][0],
	                fonction: bouton[i][2]
	            });
	            TP.Context().view[ID].getController().testArrayController.addFunction(bout);
	            (function (i) {
	
	                var paneB = pane.append("div");
	                paneB.append("input")
	                    .attr("type", "button")
	                    .attr("class", "button")
	                    .attr("value", bouton[i][1])
	                    .on("click", function () {
	                    TP.Context().view[ID].getController().testArrayController.loadFunction("idButton", bouton[i][0]);
	                });
	            })(i);
	            num++;
	        }
	 		*/
	 		//var colorNode = TP.Context().tabNodeColor[target];
	 		//var colorLink = TP.Context().tabLinkColor[target];
	 		//var colorBg = TP.Context().tabBgColor[target];
	 		//console.log(colorNode);
	 		//console.log(colorLink);
	 		//console.log(colorBg);       
	        console.log($.jPicker.List[0])
	        $.jPicker.List[0].color.active.val('hex', nodesColor);
	        $.jPicker.List[1].color.active.val('hex', linksColor);
	        $.jPicker.List[2].color.active.val('hex', bgColor);

	        //TP.ObjectReferences().Interface().addInfoButton(ID);
	    });
	
	    titlebar.dblclick(function() {
	        if(typeView ==="substrate")    { TP.Context().dialogTop=26;  TP.Context().dialogRight=600; }
	        else if(typeView ==="catalyst"){ TP.Context().dialogTop=26;  TP.Context().dialogRight=100; }
	        else                        { TP.Context().dialogTop=240; TP.Context().dialogRight=260; }
	
	        var fullheight = $('#container').height()-10;
	        var fullwidth = $('#container').width()-10;
	        console.log(dialog.parent().width() + " - " + fullwidth);
	        console.log(dialog.parent());
	        if(dialog.parent().width()!=fullwidth){
	            console.log(1);
	            dialog.dialog({
	                width:fullwidth, 
	                height:fullheight,
	                position: ["left+"+15, "top+"+27] ,
	            });
	        }
	        else{
	            console.log(2);
	            dialog.dialog({
	                width:TP.Context().dialogWidth, 
	                height:TP.Context().dialogHeight,
	                position: "right-"+ TP.Context().dialogRight + " top+" + TP.Context().dialogTop ,
	            });
	        }
	        console.log(TP.Context().dialogTop);
	
	            //$(this).height()=fullheight;
	    });
	    
	   function add() {
	        if(ID != null){
	           
	            if(view_nodes != null)
	            	viewNodes = view_nodes;
	            else
	            	viewNodes = "rect";
	            				
				DataTranslation = [0,0];            
	    	    //TP.Context().tabNodeColor[target] = nodesC;
		        //TP.Context().tabLinkColor[target] = linksC;
		        //TP.Context().tabBgColor[target] = bgC;
			    
		        selectMode = false;
		        moveMode = true;
		        showLabels = true;
		        showLinks = true;
		        nodeInformation = false;           
	           
	            TP.Interaction().createLasso(ID);
	            TP.Interaction().addZoom(ID);
	            
	            if(typeView == "substrate"){
	           		//objectReferences.InteractionObject.addZoom(target);
	                //TP.Interface().addEntanglementFeedback(ID);
	           }
	            TP.Context().stateStack[ID] = new TP.States();
	            TP.Context().stateStack[ID].addState('select', new TP.stateSelect(ID));
	            TP.Context().stateStack[ID].executeCurrentState();             
	        }
	    }    
	    
	    if (tabDataSvg[0] == "svg" && tabDataSvg[1] == "graph") {
	
	            //TP.Context().tabSvg["svg_"+target] = d3.select("#zone" + target)            
	            svg = d3.select("#zone" + ID)
	                .append("svg")
	                .attr("width", "100%")
	                .attr("height", "100%")
	                .attr("id", tabDataSvg[4]);

	                //.attr("viewBox", "0 0 500 600");
	                
	            TP.Context().tabGraph["graph_"+ID] = new TP.Graph();
	            graph = TP.Context().tabGraph["graph_"+ID];            
				
	            add();
	            
	            //TP.Context().tabType[target] = typeView;
	            
	           	if(typeView == "combined")
	            {
	            	combined_foreground = "substrate";
	            }
	            
	     }
	     
	           	if(typeView == "substrate"){
	            	TP.Context().GroupOfView[viewGroup] = [];
	            	TP.Context().GroupOfView[viewGroup]["substrate"] = __g__;
	            }
	           	else{
	            	TP.Context().GroupOfView[viewGroup][typeView] = __g__;
	            }	     
		
	     $("#zone"+ID).parent().appendTo("#container")
	     
     	viewInitialized = 1;
	}
	
	     this.buildLinks = function(){
		     if(idAssociation != null)	{
		            		
		            		if(typeView !== "combined"){
		            			var tmp = TP.Context().view[idAssociation];
		            			tmp.setAssociatedView(typeView, __g__);        		
		            			__g__.setAssociatedView(tmp.getType(), tmp);
		            		}
		            		else
		            		{
		            			var tmp1 = TP.Context().view[idAssociation[0]];
		            			var tmp2 = TP.Context().view[idAssociation[1]];
		            			
		            			tmp1.setAssociatedView(typeView, __g__);
		            			tmp2.setAssociatedView(typeView, __g__); 		
		            			__g__.setAssociatedView(tmp1.getType(), tmp1);
		            			__g__.setAssociatedView(tmp2.getType(), tmp2);
		            				            			
		            		}
		            		
		            		console.log(TP.Context().view[idAssociation]);
		            		
		            		           	
		     }
	     }
		

//utilisé pour test nombre View
	


    return __g__;

}
return {View: View};
})()
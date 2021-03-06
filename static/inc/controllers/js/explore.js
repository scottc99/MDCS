/**
 * 
 * File Name: explore.js
 * Author: Sharief Youssef
 * 		   sharief.youssef@nist.gov
 *
 *         Guillaume SOUSA AMARAL
 *         guillaume.sousa@nist.gov
 * 
 * Sponsor: National Institute of Standards and Technology (NIST)
 * 
 */


/**
 * AJAX call, checks that a template is selected
 * @param selectedLink redirection link
 */
verifyTemplateIsSelected = function(selectedLink)
{
    console.log('BEGIN [verifyTemplateIsSelected]');

    $.ajax({
        url : "/explore/verify_template_is_selected",
        type : "GET",
        dataType: "json",
        success: function(data){
        	verifyTemplateIsSelectedCallback(data, selectedLink);
        }
    });
    
    console.log('END [verifyTemplateIsSelected]');
}


/**
 * AJAX callback, redirects to selected link if authorized
 * @param data data from server
 * @param selectedLink redirection link
 */
verifyTemplateIsSelectedCallback = function(data, selectedLink)
{
    console.log('BEGIN [verifyTemplateIsSelectedCallback]');

    if (data.templateSelected == 'no') {
        $(function() {
            $( "#dialog-error-message" ).dialog({
                modal: true,
                buttons: {
                    Ok: function() {
                    $( this ).dialog( "close" );
                    }
                }
            });
        });
    } else {
        location.href = selectedLink;
    }

    console.log('END [verifyTemplateIsSelectedCallback]');
}

/**
 * Load controllers for the template selection
 */
loadTemplateSelectionControllers = function()
{
    console.log('BEGIN [loadTemplateSelectionControllers]');
    $('.btn.set-explore-template').on('click', setExploreCurrentTemplate);
    $('.btn.set-explore-user-template').on('click', setExploreCurrentUserTemplate);
    redirect_explore_tabs();
    console.log('END [loadTemplateSelectionControllers]');
}



/**
 * AJAX call, sets tabs when redirect
 */
redirect_explore_tabs = function(){
	$.ajax({
        url : "/explore/redirect_explore_tabs",
        type : "GET",
        dataType: "json",
        success: function(data){
        	if (data.tab == "sparql"){
        		redirectSPARQLTab();
        	}else{
        		switchTabRefresh();
        	}
        }
    });
}



/**
 * set the current template
 * @returns {Boolean}
 */
setExploreCurrentTemplate = function()
{
    var templateName = $(this).parent().parent().children(':first').text();
    var templateID = $(this).parent().parent().children(':first').attr('templateID');
    var templateFilename = $(this).parent().parent().children(':nth-child(2)').text();
    var tdElement = $(this).parent();
		
    tdElement.html('<img src="/static/resources/img/ajax-loader.gif" alt="Loading..."/>');
    $('.btn.set-template').off('click');
    
    console.log('[setExploreCurrentTemplate] Setting '+templateName+' with filename '+templateFilename+' as current template...');

    set_current_template(templateFilename, templateID);

    return false;
}


/**
 * AJAX call, sets the current template
 * @param templateFilename name of the selected template
 * @param templateID id of the selected template
 */
set_current_template = function(templateFilename,templateID){
    $.ajax({
        url : "/explore/set_current_template",
        type : "POST",
        dataType: "json",
        data : {
            templateFilename : templateFilename,
            templateID: templateID
        },
        success: function(){
        	setCurrentTemplateCallback();
        }
    });
}



/**
 * AJAX call, get custom form from server
 */
get_custom_form = function(){
    $.ajax({
        url : "/explore/get_custom_form",
        type : "GET",
        dataType: "json",
        success: function(data){
        	if ('queryForm' in data){
        		$('#queryForm').html(data.queryForm);
        	}  
        	$("#customForm").html(data.customForm);
        	$("#sparqlCustomForm").html(data.sparqlCustomForm);
        	if ('sparqlQuery' in data){
        		$('#SPARQLqueryBuilder .SPARQLTextArea').html(data.sparqlQuery);
        	}        	
        }
    });
}


/**
 * set the current user template
 * @returns {Boolean}
 */
setExploreCurrentUserTemplate = function()
{
    var templateName = $(this).parent().parent().children(':first').text();
    var templateID = $(this).parent().parent().children(':first').attr('templateID');
    var tdElement = $(this).parent();
		
    tdElement.html('<img src="/static/resources/img/ajax-loader.gif" alt="Loading..."/>');
    $('.btn.set-template').off('click');

    set_current_user_template(templateID);

    return false;
}


/**
 * AJAX call, sets the current user defined template
 * @param templateID
 */
set_current_user_template = function(templateID){
    $.ajax({
        url : "/explore/set_current_user_template",
        type : "POST",
        dataType: "json",
        data : {
            templateID: templateID
        },
        success: function(){
        	setCurrentTemplateCallback();
        }
    });
}


/**
 * Set template Callback. Updates the template display.
 * @param data
 */
setCurrentTemplateCallback = function()
{
    console.log('BEGIN [setCurrentTemplateCallback]');

    $('#template_selection').load(document.URL +  ' #template_selection', function() {
		loadTemplateSelectionControllers();
		displayTemplateSelectedDialog();
    });
    console.log('END [setCurrentTemplateCallback]');
}


/**
 * Shows a dialog when the template is selected
 */
displayTemplateSelectedDialog = function()
{
 $(function() {
    $( "#dialog-message" ).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  });
}


/**
 * When an element is selected in the query builder, input fields are added to the form regarding the type of the element.
 * @param fromElementID
 * @param criteriaID
 */
function updateUserInputs(fromElementID, criteriaID){
	$("input").each(function(){
	    $(this).attr("value", $(this).val());
	});
	$('select option').each(function(){ this.defaultSelected = this.selected; });
	var html = $("#queryForm").html();
	update_user_inputs(html, fromElementID, criteriaID);
}


/**
 * AJAX call, update user inputs for the selected element type 
 */
update_user_inputs = function(html, fromElementID, criteriaID){
    $.ajax({
        url : "/explore/update_user_inputs",
        type : "POST",
        dataType: "json",
        data : {
        	html: html,
        	fromElementID: fromElementID,
        	criteriaID: criteriaID
        },
        success: function(data){
            $("#queryForm").html(data.queryForm);
        }
    });
}


/**
 * Submit a query
 */
function query(){
	$("input").each(function(){
	    $(this).attr("value", $(this).val());
	});
	$('select option').each(function(){ this.defaultSelected = this.selected; });
	var queryForm = $("#queryForm").html()
	
	var elems = $("#fed_of_queries_instances")[0].getElementsByTagName("input");
    for(var i = 0; i < elems.length; i++) {
    	if(elems[i].checked == true)
    	{
    		elems[i].setAttribute("checked","checked");
    	}else
    	{
    		elems[i].removeAttribute('checked');
    	}
    }
	var fedOfQueries = $("#fed_of_queries_instances").html()
	
	execute_query(queryForm, fedOfQueries);
}


/**
 * AJAX call, execute query and redirects to result page
 * @param queryForm for that hosts the query builder
 * @param fedOfQueries list of selected repositories
 */
execute_query = function(queryForm, fedOfQueries){
    $.ajax({
        url : "/explore/execute_query",
        type : "POST",
        dataType: "json",
        data : {
        	queryForm: queryForm,
        	fedOfQueries: fedOfQueries
        },
        success: function(data){
            if ('errors' in data){
            	if (data.errors == 'zero'){
            		showErrorInstancesDialog();
            	}
            }else if ('listErrors' in data){
                $('#listErrors').html(data.listErrors);
                displayErrors();
            }else{
            	window.location = "/explore/results"
            }
        }
    });
}


/**
 * Get results asynchronously (disabled)
 * @param numInstance
 */
getAsyncResults = function(numInstance)
{
	/*for (i=0; i < Number(nbInstances); ++i){
		Dajaxice.explore.getResultsByInstance(Dajax.process,{"numInstance": i});		
	}*/
	get_results_by_instance(numInstance);
}


/**
 * AJAX call, gets query results
 * @param numInstance
 */
get_results_by_instance = function(numInstance){
    $.ajax({
        url : "/explore/get_results_by_instance",
        type : "GET",
        dataType: "json",
        data : {
        	numInstance: numInstance,
        },
        success: function(data){
        	$("#results").html(data.results);
        }
    });
}


/**
 * AJAX call, gets the results
 */
get_results = function(){
    $.ajax({
        url : "/explore/get_results",
        type : "GET",
        dataType: "json",
        success: function(data){
        	getAsyncResults(data.numInstance);
        }
    });	
}


/**
 * Get SPARQL results asynchronously (disabled)
 * @param numInstance
 */
getAsyncSparqlResults = function(numInstance)
{
	/*for (i=0; i < Number(nbInstances); ++i){
		Dajaxice.explore.getSparqlResultsByInstance(Dajax.process,{"numInstance": i});
	}*/
	get_sparql_results_by_instance(numInstance);
}


/**
 * AJAX call, get SPARQL query results
 * @param numInstance
 */
get_sparql_results_by_instance = function(numInstance){
    $.ajax({
        url : "/explore/get_sparql_results_by_instance",
        type : "GET",
        dataType: "json",
        data : {
        	numInstance: numInstance,
        },
        success: function(data){
            $("#results").html(data.results);
        }
    });
}


/**
 * AJAX call, gets the sparql results
 */
get_sparql_results = function(){
    $.ajax({
        url : "/explore/get_sparql_results",
        type : "GET",
        dataType: "json",
        success: function(data){
        	getAsyncSparqlResults(data.numInstance);
        }
    });	
}


/**
 * Add an empty field to the query builder
 */
function addField(){
	$("input").each(function(){
	    $(this).attr("value", $(this).val());
	});
	$('select option').each(function(){ this.defaultSelected = this.selected; });
	var htmlForm = $("#queryForm").html()
	add_field(htmlForm);
}


/**
 * AJAX call, add field to the form
 * @param htmlForm
 */
add_field = function(htmlForm){
    $.ajax({
        url : "/explore/add_field",
        type : "POST",
        dataType: "json",
        data : {
        	htmlForm: htmlForm,
        },
        success: function(data){
            $("#queryForm").html(data.queryForm);
        }
    });
}


/**
 * Remove a field from the query builder
 * @param tagID
 */
function removeField(criteriaID){
	$("input").each(function(){
	    $(this).attr("value", $(this).val());
	});
	$('select option').each(function(){ this.defaultSelected = this.selected; });
	var queryForm = $("#queryForm").html()
	remove_field(queryForm, criteriaID);
}


/**
 * AJAX call, remove field from the form
 * @param htmlForm
 */
remove_field = function(queryForm, criteriaID){
    $.ajax({
        url : "/explore/remove_field",
        type : "POST",
        dataType: "json",
        data : {
        	queryForm: queryForm,
        	criteriaID: criteriaID
        },
        success: function(data){
        	$("#queryForm").html(data.queryForm);
        }
    });
}


/**
 * Save the current query
 */
function saveQuery(){
	$("input").each(function(){
	    $(this).attr("value", $(this).val());
	});
	$('select option').each(function(){ this.defaultSelected = this.selected; });
	var queryForm = $("#queryForm").html()
	
	save_query(queryForm);
}


/**
 * AJAX call, save the query
 * @param htmlForm
 */
save_query = function(queryForm){
    $.ajax({
        url : "/explore/save_query",
        type : "POST",
        dataType: "json",
        data : {
        	queryForm: queryForm,
        },
        success: function(data){
        	if ('listErrors' in data){
        		$('#listErrors').html(data.listErrors);
            	displayErrors();
        	}else{
        		$('#queriesTable').load(document.URL +  ' #queriesTable', function() {});
        	}
        }
    });
}


/**
 * Insert a saved query in the query builder
 * @param savedQueryID
 */
function addSavedQueryToForm(savedQueryID){
	$("input").each(function(){
	    $(this).attr("value", $(this).val());
	});
	$('select option').each(function(){ this.defaultSelected = this.selected; });
	var queryForm = $("#queryForm").html()
	
	add_saved_query_to_form(queryForm, savedQueryID);
} 


/**
 * AJAX call, insert a saved query in the query builder
 * @param queryForm form
 * @param savedQueryID id of the query to insert
 */
add_saved_query_to_form = function(queryForm, savedQueryID){
    $.ajax({
        url : "/explore/add_saved_query_to_form",
        type : "POST",
        dataType: "json",
        data : {
        	queryForm: queryForm,
        	savedQueryID: savedQueryID
        },
        success: function(data){
        	$("#queryForm").html(data.queryForm);
        }
    });
}


/**
 * Delete a saved query
 * @param savedQueryID
 */
function deleteQuery(savedQueryID){
	$(function() {
        $( "#dialog-DeleteQuery" ).dialog({
            modal: true,
            buttons: {		
            	Delete: function(){
		        	delete_query(savedQueryID);
		        	$( this ).dialog( "close" );
        		},
        		Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    });
}


/**
 * AJAX call, delete a saved query
 * @param savedQueryID
 */
delete_query = function(savedQueryID){
    $.ajax({
        url : "/explore/delete_query",
        type : "POST",
        dataType: "json",
        data : {
        	savedQueryID: savedQueryID
        },
        success: function(data){
        	$('#queriesTable').load(document.URL +  ' #queriesTable', function() {});
        }
    });
}


/**
 * Clear the current criterias
 */
function clearCriterias(){
	$("input").each(function(){
	    $(this).attr("value", $(this).val());
	});
	$('select option').each(function(){ this.defaultSelected = this.selected; });
	var queryForm = $("#queryForm").html()
	
	clear_criterias(queryForm);
}


/**
 * AJAX call, clear current criterias
 * @param queryForm
 */
clear_criterias = function(queryForm){
    $.ajax({
        url : "/explore/clear_criterias",
        type : "POST",
        dataType: "json",
        data : {
        	queryForm: queryForm
        },
        success: function(data){
        	$("#queryForm").html(data.queryForm);
        }
    });	
}


/**
 * Delete all saved queries 
 */
clearQueries = function()
{
	$(function() {
        $( "#dialog-DeleteAllQueries" ).dialog({
            modal: true,
            buttons: {		
        		Delete: function(){
		        	$("input").each(function(){
		        	    $(this).attr("value", $(this).val());
		        	});
		        	$('select option').each(function(){ this.defaultSelected = this.selected; });
		        	clear_queries();
		        	$( this ).dialog( "close" );
        		},
        		Cancel: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    });
}


/**
 * AJAX call, delete all saved queries
 */
clear_queries = function(){
    $.ajax({
        url : "/explore/clear_queries",
        type : "GET",
        dataType: "json",
        success: function(data){
        	$('#queriesTable').load(document.URL +  ' #queriesTable', function() {}); 
        }
    });	
}


/**
 * Save the custom form
 */
exploreData = function()
{
    console.log('BEGIN [exploreData]');

    // Need to Set input values explicitiy before sending innerHTML for save
    var elems = document.getElementsByName("xsdForm")[0].getElementsByTagName("input");
    for(var i = 0; i < elems.length; i++) {
    	// sent attribute to property value
    	elems[i].setAttribute("value", elems[i].checked);
    	if(elems[i].checked == true)
    	{
    		elems[i].setAttribute("checked","checked");
    	}
    }
    $('select option').each(function(){ this.defaultSelected = this.selected; }); 
    formContent = document.getElementById('xsdForm').innerHTML;
    save_custom_data(formContent);

    console.log('END [exploreData]');
}


/**
 * AJAX call, saev the custom form and redirects to perform search
 * @param formContent
 */
save_custom_data = function(formContent){
	$.ajax({
        url : "/explore/save_custom_data",
        type : "POST",
        dataType: "json",
        data : {
        	formContent : formContent,
        },
        success: function(data){
        	window.location = "/explore/perform-search"
        }
    });
}


/**
 * Change a choice in the XSD form
 * @param selectObj
 */
changeChoice = function(selectObj)
{
    console.log('BEGIN [changeChoice(' + selectObj.id + ' : ' + selectObj.selectedIndex + ')]');

    // get the index of the selected option 
    var idx = selectObj.selectedIndex;  

    for (i=0; i < selectObj.options.length;i++) {
    	if (i == idx){
    		$("#" + selectObj.id + "-" + i).removeAttr("style");
		} else {
			$("#" + selectObj.id + "-" + i).attr("style","display:none");
		}
    	
    }

    console.log('END [changeChoice(' + selectObj.id + ' : ' + selectObj.selectedIndex + ')]');
}

/**
 * Check that a template is selected
 */
verifyTemplateIsSelectedCustomize = function(){
    console.log('BEGIN [verifyTemplateIsSelected]');

    verify_template_is_selected_customize(); 

    console.log('END [verifyTemplateIsSelected]');
}


/**
 * AJAX call, checks that a template has been selected
 * @param callback
 */
verify_template_is_selected_customize = function(){
    $.ajax({
        url : "/explore/verify_template_is_selected",
        type : "GET",
        dataType: "json",
        success: function(data){
        	verifyTemplateIsSelectedCustomizeCallback(data);
        }
    });
}


/**
 * Callback of check template selected. Display an error message if not selected.
 * @param data
 */
verifyTemplateIsSelectedCustomizeCallback = function(data)
{
    console.log('BEGIN [verifyTemplateIsSelectedCallback]');

    if (data.templateSelected == 'no') {
        location.href = "/explore";
    }else{
    	loadExploreCurrentTemplateForm();
    }

    console.log('END [verifyTemplateIsSelectedCallback]');
}


/**
 * Generate a form to select fields to use in the query builder
 */
loadExploreCurrentTemplateForm = function()
{
    console.log('BEGIN [loadExploreCurrentTemplateForm]');

    $('.btn.clear-fields').on('click', clearFields);

    generate_xsd_tree_for_querying_data(); 

    console.log('END [loadExploreCurrentTemplateForm]');
}


/**
 * AJAX call, generates HTML tree from XSD
 */
generate_xsd_tree_for_querying_data = function(){
    $.ajax({
        url : "/explore/generate_xsd_tree_for_querying_data",
        type : "GET",
        dataType: "json",
        success: function(data){
            $("#xsdForm").html(data.xsdForm);
        }
    });
}


/**
 * Clear all check boxes of the form
 */
clearFields = function()
{
    console.log('BEGIN [clearFields]');

    // reset all select to their 0 index
    $('#dataQueryForm').find("select").each(function(){
	  this.selectedIndex = 0;
	  for (i=0; i < this.options.length;i++) {
	    if (i == 0){
	    		$("#" + this.id + "-" + i).removeAttr("style");
			} else {
	        $("#" + this.id + "-" + i).attr("style","display:none");
			}
	    	
	    }
	});
    // clear all checkboxes
    $("#dataQueryForm").find("input").each(function() {
    	$( this ).removeAttr('checked');
    });
    // display a message
    $(function() {
        $( "#dialog-cleared-message" ).dialog({
            modal: true,
            buttons: {
		Ok: function() {
                    $( this ).dialog( "close" );
                }
	    }
        });
    });
	
    console.log('END [clearFields]');
}


/**
 * Download all results
 */
downloadResults = function()
{
	console.log('BEGIN [downloadResults]');
		
	download_results();
	
	console.log('END [downloadResults]');
}


/**
 * AJAX call, redirects to download view
 */
download_results = function(){
    $.ajax({
        url : "/explore/download_results",
        type : "GET",
        dataType: "json",
        success: function(data){
        	if ('savedResultsID' in data){
        		window.location = "/explore/results/download-results?id=" + data.savedResultsID;
        	}
        }
    });
}


/**
 * Display errors
 */
displayErrors = function()
{
	$(function() {
        $( "#dialog-errors-message" ).dialog({
            modal: true,
            buttons: {
		Ok: function() {
                    $( this ).dialog( "close" );
                }
	    }
        });
    });
}


/**
 * Comes back to the query, keeping the current criterias
 */
backToQuery = function()
{
	console.log('BEGIN [backToQuery]');
	
	back_to_query();
	
	console.log('END [backToQuery]');
}


/**
 * AJAX call, redirects to query builder
 */
back_to_query = function(){
    $.ajax({
        url : "/explore/back_to_query",
        type : "GET",
        dataType: "json",
        success: function(data){
        	window.location = "/explore/perform-search"    	
        }
    });
}


/**
 * Manage the display of the tabs
 */
switchTabRefresh = function()
{
	console.log('BEGIN [switchTabRefresh]');
	
	var tab = $("#explore-tabs").find("input:radio:checked").attr("id");	
	
	if (tab == null){
		$("#tab-1").prop("checked",true);
		tab = "tab-1"
	}
	switchTab(tab);
	
	console.log('END [switchTabRefresh]');
}

/**
 * Manage the display of the tabs
 */
switchTab = function(tab)
{
	console.log('BEGIN [switchTab]');
	
	//var tab = $("#explore-tabs").find("input:radio:checked").attr("id")
	
	$("#subnav-wrapper .tabbed").attr("style","display:none;");
	$("#subnav-"+tab).removeAttr("style");
	
	if (tab == "tab-1"){
		$("#queryBuilder").removeAttr("style");
		$("#customForm").removeAttr("style");
		$("#QbEDesc").removeAttr("style");
		$("#SPARQLqueryBuilder").attr("style","display:none;");		
		$("#SPARQLDesc").attr("style","display:none;");	
	}else{
		$("#queryBuilder").attr("style","display:none;");
		$("#customForm").attr("style","display:none;");
		$("#QbEDesc").attr("style","display:none;");
		$("#SPARQLqueryBuilder").removeAttr("style");
		$("#SPARQLDesc").removeAttr("style");	
	}
	switch_explore_tab(tab);
	
	console.log('END [switchTab]');
}


switch_explore_tab = function(tab){
    $.ajax({
        url : "/explore/switch_explore_tab",
        type : "POST",
        dataType: "json",
        data : {
        	tab : tab,
        },
        success: function(data){
            $('#customForm').html(data.customForm);
            $('#sparqlCustomForm').html(data.sparqlCustomForm);
        }
    });
}


/**
 * Manage the display of the tabs
 */
redirectExplore = function(tab)
{
	console.log('BEGIN [redirectExplore]');
	
	redirect_explore();
	
	console.log('END [redirectExplore]');
}


/**
 * AJAX call, manage the tabs
 */
redirect_explore = function(){
    $.ajax({
        url : "/explore/redirect_explore",
        type : "GET",
        dataType: "json",
        success: function(data){
        	window.location = "/explore"
        }
    });
}


/**
 * Manage the display of the tabs
 */
redirectSPARQLTab = function()
{
	console.log('BEGIN [redirectSPARQLTab]');
	
	$("#explore-tabs").find("input:radio").removeAttr('checked');
	$("#tab-2").prop("checked",true);
	switchTabRefresh();
	
	console.log('END [redirectSPARQLTab]');
}


/**
 * Show the custom tree to choose a field for the query builder
 * @param criteriaID
 */
showCustomTree = function(currentCriteriaID)
{
	console.log('BEGIN [showCustomTree]');
	
	set_current_criteria(currentCriteriaID);
	
	$(function() {
        $( "#dialog-customTree" ).dialog({
            modal: true,
            width: 500,
            height: 620,
            buttons: {
		Close: function() {
                    $( this ).dialog( "close" );
                }
	    }
        });
    });
	
	console.log('END [showCustomTree]');
}


/**
 * AJAX call, set the id of the current criteria to be set
 * @param currentCriteriaID
 */
set_current_criteria = function(currentCriteriaID){
	$.ajax({
        url : "/explore/set_current_criteria",
        type : "POST",
        dataType: "json",
        data : {
        	currentCriteriaID : currentCriteriaID,
        }
    });
}


/**
 * Select an element to insert in the query builder
 * @param elementID
 */
selectElement = function(elementID)
{
	console.log('BEGIN [selectElement]');
		
	var elementName = $("#" + elementID).text().trim();
	select_element(elementID, elementName);
	
	console.log('END [selectElement]');
}


/**
 * AJAX call, select an element to insert in the query
 * @param elementID
 * @param elementName
 */
select_element = function(elementID, elementName){
	$.ajax({
        url : "/explore/select_element",
        type : "POST",
        dataType: "json",
        data : {
        	elementID: elementID,
        	elementName: elementName
        },
		success: function(data){
	        if(data.tab == "tab-1"){
                $($("#" + data.criteriaTagID).children()[1]).val(elementName);
                $($("#" + data.criteriaTagID).children()[1]).attr("class","elementInput");
                updateUserInputs(elementID, data.criteriaID); 
                $("#dialog-customTree").dialog("close");    
	        }else{
	        	$("#sparqlElementPath").val(data.elementPath);
                $("#sparqlExample").html(data.queryExample);
	        }
	    }
    });
}


/**
 * Submit a SPARQL query
 */
function sparqlquery(){
	var queryStr = $("#SPARQLqueryBuilder .SPARQLTextArea").val();	
	var sparqlFormatIndex = $("#SPARQLFormat").prop("selectedIndex");
	var elems = $("#fed_of_queries_instances")[0].getElementsByTagName("input");
    for(var i = 0; i < elems.length; i++) {
    	if(elems[i].checked == true)
    	{
    		elems[i].setAttribute("checked","checked");
    	}else
    	{
    		elems[i].removeAttribute('checked');
    	}
    }
	var fedOfQueries = $("#fed_of_queries_instances").html()
	execute_sparql_query(queryStr, sparqlFormatIndex, fedOfQueries);
}


/**
 * AJAX call, submit a SPARQL query
 * @param queryStr
 * @param sparqlFormatIndex
 * @param fedOfQueries
 */
execute_sparql_query = function(queryStr, sparqlFormatIndex, fedOfQueries){
	$.ajax({
        url : "/explore/execute_sparql_query",
        type : "POST",
        dataType: "json",
        data : {
        	queryStr: queryStr,
        	sparqlFormatIndex: sparqlFormatIndex,
        	fedOfQueries: fedOfQueries,
        },
		success: function(data){
			if('errors' in data){
				showErrorInstancesDialog();
			}else{
				window.location = "/explore/sparqlresults";
			}
	    }
    });
}


/**
 * Download SPARQL results
 */
downloadSparqlResults = function()
{
	console.log('BEGIN [downloadSparqlResults]');
	
	download_sparql_results();
	
	console.log('END [downloadSparqlResults]');
}


/**
 * AJAX call, redirects to download view
 */
download_sparql_results = function(){
	$.ajax({
        url : "/explore/download_sparql_results",
        type : "GET",
        dataType: "json",
		success: function(data){
			window.location = "/explore/results/download-sparqlresults?id=" + data.savedResultsID;
	    }
    });
}


/**
 * Get the path to an element to use in a SPARQL query
 */
getElementPath = function()
{
	console.log('BEGIN [getElementPath]');
	
	$(function() {
        $( "#dialog-sparqlcustomTree" ).dialog({
            modal: true,
            width: 510,
            height: 660,
            buttons: {
		Close: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    });
	
	console.log('END [getElementPath]');
}

/**
 * Select an element from the custom tree, for subelement query
 * @param leavesID
 */
selectParent = function(leavesID)
{
	console.log('BEGIN [selectParent]');
	
	try{
		$("#dialog-customTree").dialog("close"); 
		subElementQuery(leavesID);
	}catch(err)
	{
		
	}
	console.log('END [selectParent]');
}

/**
 * Open the dialog to create a query on subelements of the same document
 * @param leavesID
 */
subElementQuery = function(leavesID)
{
	console.log('BEGIN [subElementQuery]');
	$(function() {
        $( "#dialog-subElementQuery" ).dialog({
            modal: true,
            width: 670,
            height: 420,
            buttons: {
		Close: function() {
                    $( this ).dialog( "close" );
                },
        Insert: function(){
        			var checkboxes = $("#subElementQueryBuilder").find("input:checkbox");
        			for(var i = 0; i < checkboxes.length; i++) {
        				checkboxes[i].setAttribute("value", checkboxes[i].checked);
        		    	if(checkboxes[i].checked == true)
        		    	{
        		    		checkboxes[i].setAttribute("checked","checked");
        		    	}
        		    }
        			$("input").each(function(){
        			    $(this).attr("value", $(this).val());
        			});
        			$('select option').each(function(){ this.defaultSelected = this.selected; });
        			var form = $("#subElementQueryBuilder").html();
        			insert_sub_element_query(leavesID, form);
        		}
            }
        });
    });
	
	prepare_sub_element_query(leavesID);
	console.log('END [subElementQuery]');
}


/**
 * AJAX call, inserts a sub query in the form
 * @param leavesID
 * @param form
 */
insert_sub_element_query = function(leavesID, form){
	$.ajax({
        url : "/explore/insert_sub_element_query",
        type : "POST",
        dataType: "json",
        data : {
        	leavesID: leavesID,
        	form: form
        },
		success: function(data){
			if ('listErrors' in data){
				$('#listErrors').html(data.listErrors);
				displayErrors();
			}else{
				// insert the pretty query in the query builder
	            $($("#" + data.criteriaID).children()[1]).attr("value", data.prettyQuery);
	            var field = $("#" + data.criteriaID).children()[1]
	            // replace the pretty by an encoded version
	            $(field).attr("value",$(field).html($(field).attr("value")).text())
	            // set the class to query
	            $($("#" + data.criteriaID).children()[1]).attr("class","queryInput");
	            // remove all other existing inputs
	            $("#" +data.uiID).children().remove();
	            // close the dialog
	            $("#dialog-subElementQuery").dialog("close");  
			}
	    }
    });
}


/**
 * AJAX call, preapres the sub element query
 * @param leavesID
 */
prepare_sub_element_query = function(leavesID){
	$.ajax({
        url : "/explore/prepare_sub_element_query",
        type : "GET",
        dataType: "json",
        data : {
        	leavesID: leavesID,
        },
		success: function(data){
			$("#subElementQueryBuilder").html(data.subElementQueryBuilder);    
	    }
    });
}


/**
 * Show an error message when no repository are selected
 */
showErrorInstancesDialog = function()
{
	$(function() {
        $( "#dialog-Instances" ).dialog({
            modal: true,
            buttons: {
            	OK: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    });
}

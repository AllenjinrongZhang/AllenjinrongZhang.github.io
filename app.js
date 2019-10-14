var url;
async function getData(word)
{
	saveSearchValue(word);
	document.getElementById("list").innerHTML="";
	document.getElementById("title").innerHTML="";
	document.getElementById("partOfSpeech").innerHTML="";
	document.getElementsByClassName("noRes")[0].innerHTML = "";
	document.getElementsByClassName("errorMsg")[0].innerHTML="";
	document.getElementById("ipa").innerHTML="";
	// var word = document.getElementById("searchBox").value;
	if(word=="" || word==null)
	{
		document.getElementsByClassName("errorMsg")[0].innerHTML='Please input any word.';
	}
	else
	{
		url ="https://dictionaryapi.com/api/v3/references/learners/json/"+word
		+"?key=6b5f2059-92e7-4761-b787-d7ff3514ae73";
		const def = await fetch(url);
	 	const jsonobj = await def.json();
	 	console.log(jsonobj[0]);
	 	if(typeof(jsonobj[0])=="string")
	 	{
	 		var sugg = jsonobj[0];
			for (var i = 1; i < jsonobj.length ; i++) 
			{
			 	sugg = sugg + ', '+jsonobj[i];
			}
			console.log(sugg);
			var show = document.getElementsByClassName("noRes")[0];
			show.style.display="block";
	 		show.innerHTML = 'Sorry! No results found. Did you mean any of '+
	 		sugg+ '?';
	 	}
	 	else
	 	{
			var partOfSpeech = jsonobj[0].fl;
			var ipa = jsonobj[0].hwi.prs[0].ipa;
	 		console.log(typeof(jsonobj[0]));
		 	var defs= [];
		 	defs=jsonobj[0].shortdef;
	 		var output="";
		 	for (var i = 0; i < defs.length; i++) 
			{
		  		output = output + '<li>'+defs[i]+'</li>';
			}
		    document.getElementById("partOfSpeech").innerHTML=partOfSpeech;
			document.getElementById("list").innerHTML=output;
			document.getElementById("ipa").innerHTML=ipa;
	 	}
	 	
	    document.getElementById("title").innerHTML=word;
		document.getElementById("searchBox").value='';
	}

}

function loadHistory(){
	var historyList = [];
	var result = localStorage.getItem("history");
	if( result!=null ){
		historyList = JSON.parse(result);
	}
	return historyList;
}

function saveHistory(historyList){
	localStorage.setItem("history", JSON.stringify(historyList) );
}

function cleanHistoryAll(){
	localStorage.removeItem("history");
}

function saveSearchValue(value){
	//some contents have been saved in LocalStorage
	var historyList = loadHistory();
	if(value){
		historyList.push(value);
		saveHistory(historyList);
	}
}

function toggleDrawer(){
	$("#drawer").fadeToggle();
}

function hidenAll(){
	$("#home").hide();
	$("#history").hide();
	$("#offlineEnglishDict").hide();
}

function showHome(){
	hidenAll();
	$("#home").show();
}

function showOfflineEnglish(){
	hidenAll();
	$("#offlineEnglishDict").show();
}

function searchOfflineEnglish( searchValue ){
	if( !searchValue ){
		alert("Please input search value!");
		return;
	}
	//look at if there are some vocas exisiting in offline-db or not
	var result = offlineEnglishDB[searchValue];
	var $offlineResult = $("#offlineResult");
	if(result){
		//formatted display
		$offlineResult.html(result);
	}else{
		$offlineResult.html("has no result！");
	}
}


function initOfflineEnglish(){
	$("#btnOfflineSearch").click(function(){
		var searchValue = $("#offlineSearchBox").val();
		searchOfflineEnglish(searchValue);
	});
}

function showHomeSearchResult(searchValue){
	//display the main searching page
	hidenAll();
	$("#home").show();
	//setting the contents needed to be searched
	$("#searchBox").val("abc");
	//acquire the research results
	getData(searchValue);
}

function updateHistoryList(){
	var historyList = loadHistory();
	var $history = $("#historyList");
	//if there are database have been recorded in historical record, some elements can be deleted
	$history.empty();
	//add some new record
	var itemList = [];
	for(let i=0;i<historyList.length;i++){
		let value = historyList[i];
		let $li = $("<li>"+value+"</li>");
		// add some functional 
		$li.click(function(){
			var searchText = $(this).text();
			showHomeSearchResult(searchText);
		})
		itemList.push($li);
	}
	$history.html(itemList);
}

function initCleanHistory(){
	$btnCleanHistory = $("#btnCleanAllHistory");
	$btnCleanHistory.click(function(){
		cleanHistoryAll();
		updateHistoryList();
	});
}

function init(){
	initCleanHistory();
	initOfflineEnglish();
	showHome();
}

function showHistory(){
	hidenAll();
	$("#history").show();
	updateHistoryList();
}

init();

var url;
async function getData()
{
	document.getElementById("list").innerHTML="";
	document.getElementById("title").innerHTML="";
	document.getElementById("partOfSpeech").innerHTML="";
	document.getElementsByClassName("noRes")[0].innerHTML = "";
	document.getElementsByClassName("errorMsg")[0].innerHTML="";
	document.getElementById("ipa").innerHTML="";
	var word = document.getElementById("searchBox").value;
	if(word=="" || word==null)
	{
		document.getElementsByClassName("errorMsg")[0].innerHTML='Please enter any word.';
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


// function displayNotification(mhead,mbody) {
//     if (Notification.permission == 'granted') {
//       navigator.serviceWorker.getRegistration().then(function(reg) {
//         var options = {
//           body: mbody,
//           icon: './icons/icon48.png',
//           vibrate: [100, 50, 100],
//           data: {
//             dateOfArrival: Date.now(),
//             primaryKey: 1
//           },
//           actions: [
//             {action: 'explore', title: 'retry'},
//             {action: 'close', title: 'close'}
//           ]
//         };
//         reg.showNotification(mhead, options);
//       });
//     }
// }


window.addEventListener('load', async e => {
    console.log(navigator.onLine);
    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('./serviceworker.js');
            console.log('SW registered');
        } catch (error) {
            console.log('SW failed');

        }
    }
    // if(navigator.onLine){
    //     navigator.serviceWorker.controller.postMessage("online");
    // }
    // else
    // {
    //     displayNotification('No Internet','Please connent to a network to search a new word');
    //     navigator.serviceWorker.controller.postMessage("offline");
    // }
    // await getData();
});

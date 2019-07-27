  
var config = {
    apiKey: "AIzaSyD94RLkg6xNZiamUahEszDvYgiV7bdhs_4",
    authDomain: "slangdoeraway.firebaseapp.com",
    databaseURL: "https://slangdoeraway.firebaseio.com",
    projectId: "slangdoeraway",
    storageBucket: "slangdoeraway.appspot.com",
    messagingSenderId: "444972459308"
  };
firebase.initializeApp(config);
var database=firebase.database().ref();
$("body").append('<div id="popper">Popper.js</div>');

var words = {
    the: {
        "the": 500,
        "TJEM": 300,
        "ASDG": 95
    },
    real: {
        "thin": 6000
	},
      covfefe: {
        "Coffee": 200
	},
        realdonaldtrump: {
        "The President": 200
	}
};

database.on("child_added",function(snapshot){
	words[snapshot.key]=snapshot.val();
	
    $("body").highlight(snapshot.key, {
        element: 'a',
        className: 'slangdoeraway',
		wordsOnly:true
    });

    $("body p a.slangdoeraway").attr({
        href: '#'
    });

    
$(".slangdoeraway").mouseenter(function(){
 var o=order($(this).text());
$("#popper").html(o);    
instance = new Popper(this, popper, {
  placement: 'right',
});
});


$(".slangdoeraway").mouseleave(function(){
instance.destroy();
});


});

    $("body").highlight(Object.keys(words), {
        element: 'a',
        className: 'slangdoeraway',
		wordsOnly:true
    });

    $("body p a.slangdoeraway").attr({
        href: '#'
    });

function order(word) {
    var definitions = words[word];
    var sortable = [];
    for (var def in definitions) {
        sortable.push([def, definitions[def]]);
    }

    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });

    console.log(sortable);
	var html="<ol>";
for(var i in sortable){
	html+="<li><b>"+sortable[i][0]+":</b> "+ sortable[i][1]+' ';
	
}
	html+="</ol>"
	return html;
	// 	console.log($('.slangdoeraway')
//   .parentsUntil( "body"));
}

var instance;

$(".slangdoeraway").mouseenter(function(){
 var o=order($(this).text());
$("#popper").html(o);    
instance = new Popper(this, popper, {
  placement: 'right',
});
});


$(".slangdoeraway").mouseleave(function(){
instance.destroy();
});

function addTo(text){
    chrome.storage.sync.set({'wiki-eshashid': text}, function() {
          // Notify that we saved.
          console.log('Settings saved');
        });
}
// define a handler
function doc_keyUp(e) {

    // this would test for whichever key is 40 and the ctrl key at the same time
    if (e.altKey && e.keyCode == 90) {
     var word=window.getSelection().toString().replace(/\W/g, '');
        
        $.get("https://glosbe.com/gapi/translate?from=eng&dest=eng&format=json&phrase="+word.toLowerCase()+"&pretty=true",
             function(data){
          addTo(data.tuc[0].meanings[0].text);
            
        });
      
    }
      if (e.altKey && e.keyCode == 87) {
     var word=window.getSelection().toString().replace(/\W/g, '');
        
        $.get("https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles="+word.toLowerCase()+"&format=json",
             function(data){
            var da=data.query.pages;
            var keys = Object.keys(da); 
          addTo(da[keys[0]].revisions[0]['*']);
                });
      
    }
}
// register the handler 
document.addEventListener('keyup', doc_keyUp, false);

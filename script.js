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
    slender: {
        "thin": 6000
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

});

for (var word in words) {
    console.log(word);
    $("body").highlight(word, {
        element: 'a',
        className: 'slangdoeraway',
		wordsOnly:true
    });

    $("body p a.slangdoeraway").attr({
        href: '#'
    });



}

function order(word) {
    var definitions = words[word.toLowerCase()];
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






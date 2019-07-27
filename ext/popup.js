var apikey = "AIzaSyBtW2HtjaqOiiGUkH7A6hTm6y3-GCA61bg";
var guid;
var app={
    loggedIn:false    
};
var config = {
	apiKey: "AIzaSyD94RLkg6xNZiamUahEszDvYgiV7bdhs_4",
	authDomain: "slangdoeraway.firebaseapp.com",
	databaseURL: "https://slangdoeraway.firebaseio.com",
	projectId: "slangdoeraway",
	storageBucket: "slangdoeraway.appspot.com",
	messagingSenderId: "444972459308"
};
firebase.initializeApp( config );

function firebaseSetup() {
    app.loggedIn=true;
	firebase.database().ref( guid + "/bookmarks" ).on( "child_added", function(
		snap ) {
		console.log( snap );
		var bookmarkTemplate = '<div id="' + snap.key +
			'" class="card"> <div class="card-header"> <button class="btn btn-primary float-right"><i class="icon icon-edit"></i></button> <h5 href="" class="card-title"></h5> <h6 class="card-subtitle"></h6> </div> <div class="card-body"> </div> <div class="card-footer"> </div>';
		var label = '<label class="chip"> Crime </label>';
		var id = "#" + snap.key,
			titleid = id + " div h5",
			dateid = id + " div h6";
		$( "body" ).append( bookmarkTemplate );
		$( titleid ).text( snap.val().title );
		$( titleid ).attr( "url", snap.val().url );
		$( dateid ).text( snap.val().date );
	} );
}
$( document ).on( "click", "h5", function( e ) {
	var newURL = $( e.target ).attr( "url" );
	chrome.tabs.create( {
		url: newURL
	} );
} );
$( "#ifLoggedIn" ).hide();
progBar( false );
chrome.tabs.query( {
	'active': true,
	'lastFocusedWindow': true
}, function( tabs ) {
	var url = tabs[ 0 ].url;
	$.ajax( {
		url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + apikey,
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		data: '{ longUrl: "' + url + '"}',
		success: function( response ) {
			$( 'h3' ).text( response.id );
			var qrcode = new QRCode( document.getElementById(
				"asdgaeh234jl32jtklajweg890jakjcvsdklgm" ), {
				text: response.id,
				width: 128,
				height: 128,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: QRCode.CorrectLevel.H
			} );
		}
	} );
} );

function loadingSomething( yeah ) {
	if ( yeah ) {
		$( ".load" ).addClass( "loading" );
	} else {
		$( ".load" ).removeClass( "loading" );
	}
}
chrome.storage.sync.get( "wiki-ehashid", function( items ) {
	console.log( items );
} );
chrome.storage.sync.get( "guid", function( items ) {
	if ( items.guid.length !== 0 ) {
		guid = items.guid;
		$( "form" ).hide();
		$( "h2" ).text( guid );
		$( "#ifLoggedIn" ).show();
		firebaseSetup();
	}
} );

function progBar( show ) {
	if ( show ) {
		$( ".bar-item" ).animate( {
			width: "0%"
		} );
		$( ".progress" ).show();
	} else {
		$( ".progress" ).hide();
	}
}
chrome.storage.onChanged.addListener( function( changes, namespace ) {
	for ( key in changes ) {
		switch ( key ) {
			case "wiki-ehashid":
				var storageChange = changes[ "wiki-ehashid" ];
				$( "#app" ).html( storageChange.newValue );
				break;
			case "guid":
				guid = changes[ "guid" ].newValue;
				$( "form" ).hide();
				$( "h2" ).text( guid );
				$( "#ifLoggedIn" ).show();
				firebaseSetup();
				break;
			default:
		}
	}
} );
$( "form.login" ).on( "submit", function( event ) {
	event.preventDefault();
	$.post(
		"https://us-central1-qwerasdfzxcvmnblkjpoi987ii.cloudfunctions.net/loginUser",
		$( this ).serialize(),
		function( data ) {
			chrome.storage.sync.set( {
				'guid': data
			}, function() {
				progBar( false );
				// Notify that we saved.
				console.log( 'Settings saved' );
				firebaseSetup();
			} );
		} ).progress( function( e ) {
		// tracking downloading
	} ).uploadProgress( function( e ) {
		if ( e.lengthComputable ) {
			progBar( true );
			var percentage = Math.round( ( e.loaded * 100 ) / e.total );
			$( ".bar-item" ).animate( {
				width: percentage + "%"
			} );
		}
	} );
} );
$( "#logout" ).click( function() {
	chrome.storage.sync.remove( "guid", function() {
		guid = null;
		$( "form" ).show();
		$( "h2" ).text( guid );
		$( "#ifLoggedIn" ).hide();
	} );
} );


$(".closeModal").click(function(){
    $(".modal").removeClass("active");
});
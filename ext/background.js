var config = {
    apiKey: "AIzaSyD94RLkg6xNZiamUahEszDvYgiV7bdhs_4",
    authDomain: "slangdoeraway.firebaseapp.com",
    databaseURL: "https://slangdoeraway.firebaseio.com",
    projectId: "slangdoeraway",
    storageBucket: "slangdoeraway.appspot.com",
    messagingSenderId: "444972459308"
  };

  firebase.initializeApp(config);

chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
      });
var guid;
function genericOnClick(info,tab){

    console.log(info.selectionText);
       
}


function bookmark(info,tab){
var url=tab.url;
 var title=tab.title;
var n=new Date();
    var d=n.getDate();
    var tags=[];
     firebase.database().ref(guid+"/bookmarks").push({
    url: url,
    title: title,
    user : guid,
        date:d
  });
}
var done=false;



chrome.storage.sync.get("guid",function(items) {
      if(items.guid!==undefined){ guid=items["guid"];
            if(!done){createMenus();
        }
      }
    
      });


chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log(changes["guid"].newValue);
    if(changes["guid"].newValue!==undefined){
        if(!done){
            guid=changes["guid"];
            createMenus();
        }
     }
    else{
        chrome.contextMenus.removeAll();
    }
    
      });
function createMenus(){
    
    
chrome.contextMenus.create({"title": "Add Word to E#ashID Dictionary", "contexts":["selection"],
                                       "onclick": genericOnClick});



chrome.contextMenus.create({"title": "Bookmark this page to E#ashID", "contexts":["all"],
                                       "onclick": bookmark});
        done=true;
}

var firebaseConfig = {
    apiKey: "AIzaSyCuO3691x9nsMVWJRQWMRUwtRa3WcqgPoM",
    authDomain: "test-3232b.firebaseapp.com",
    databaseURL: "https://test-3232b-default-rtdb.firebaseio.com",
    projectId: "test-3232b",
    storageBucket: "test-3232b.appspot.com",
    messagingSenderId: "733792251946",
    appId: "1:733792251946:web:304a2c83386af044aad353"
};
var provider = new firebase.auth.GoogleAuthProvider();

function loadusers() {
    var userlog = localStorage.getItem("user")
    var login = localStorage.getItem("firebaseui::rememberedAccounts");
    var loginjson = JSON.parse(login);
    try{
        if (login.length > 0) {
            document.querySelector(".new-message").style.display="flex";
            document.querySelector(".login").style.display="none";
            document.querySelector("#new-group").style.display="block";
        }
    }
    catch{
        document.querySelector(".new-message").style.display="none";
        document.querySelector(".login").style.display="block";
        document.querySelector("#new-group").style.display="none";

    }
}

var files = [];
document.getElementById("FileInput").addEventListener("change", function(e) {
    
    var labelVal = $(".title").text();
            var oldfileName = $(this).val();
                fileName = e.target.value.split( '\\' ).pop();

                if (oldfileName == fileName) {return false;}
                let extension = fileName.split('.').pop();

            if ($.inArray(extension,['jpg','jpeg','png']) >= 0) {
                $(".filelabel i").removeClass().addClass('icon-photo');
                $(".filelabel i, .filelabel .title").css({'color':'#208440'});
                $(".filelabel").css({'border':' 2px solid #208440'});
            }else if(extension == 'pdf'){
                $(".filelabel i").removeClass().addClass('icon-file-pdf-o');
                $(".filelabel i, .filelabel .title").css({'color':'red'});
                $(".filelabel").css({'border':' 2px solid red'});

            }else if(extension == 'doc' || extension == 'docx'){
                $(".filelabel i").removeClass().addClass('icon-file-word-o');
                $(".filelabel i, .filelabel .title").css({'color':'#2388df'});
                $(".filelabel").css({'border':' 2px solid #2388df'});
            }else if(extension == 'pptx'){
                $(".filelabel i").removeClass().addClass('icon-file-powerpoint-o');
                $(".filelabel i, .filelabel .title").css({'color':'#D04423'});
                $(".filelabel").css({'border':' 2px solid #D04423'});
            }else if(extension == 'xlsx' || extension == 'xlsm' || extension == 'xlsm' || extension == 'xlsb' || extension == 'xls' || extension == 'xlm'){
                $(".filelabel i").removeClass().addClass('icon-file-excel-o');
                $(".filelabel i, .filelabel .title").css({'color':'#1d6f42'});
                $(".filelabel").css({'border':' 2px solid #1d6f42'});
            }
            else{
                $(".filelabel i").removeClass().addClass('icon-file-o');
                $(".filelabel i, .filelabel .title").css({'color':'black'});
                $(".filelabel").css({'border':' 2px solid black'});
            }

            if(fileName ){
                if (fileName.length > 10){
                    $(".filelabel .title").text(fileName.slice(0,4)+'...'+extension);
                }
                else{
                    $(".filelabel .title").text(fileName);
                }
            }
            else{
                $(".filelabel .title").text(labelVal);
            }
    files = e.target.files;
    for (let i = 0; i < files.length; i++) {
    }
});
(function() {
'use strict';

var db = new Firebase('https://test-3232b-default-rtdb.firebaseio.com');

var messages;
var currentChannel;

$('#create-channel-btn').on('click', function() {
    let erorrs = document.querySelectorAll(".erorrs");
    let erorrs_div = document.querySelector(".erorrs-div");
    let sucses_div = document.querySelector(".sucses-div");
    let Timeout = setTimeout(() => {
        document.querySelector(".erorrs-div").style.height = "0px";
        document.querySelector(".sucses-div").style.height = "0px";
        for (let i = 0; i < erorrs.length; i++) {
            erorrs[i].style.display="none";
        }
    }, 2000);
    let new_group_title = document.querySelector("#channel-title").value.length;
    let new_group_desc = document.querySelector("#channel-description").value.length;
    if ( new_group_title > 0 && new_group_desc > 0 ) {
        db.child('channels').push({
            title: $('#channel-title').val(),
            description: $('#channel-description').val(),
            admin:"admin: "+loginjson[0].email
        }, function() {

            sucses_div.style.height = "40px";
            document.querySelector(".sucses-group").style.display = "block";
            Timeout

            $('#create-channel').modal('hide');
        });
    }else if (new_group_title == 0) {
        erorrs_div.style.height = "40px";
        document.querySelector(".erorr-title").style.display = "block";
        Timeout
    }
    else if (new_group_desc == 0) {
        erorrs_div.style.height = "40px";
        document.querySelector(".erorr-desc").style.display = "block";
        Timeout
    }
});


db.child('channels').on('child_added', function (snapshot) {
    var channel = snapshot.val();
    let groupl = document.querySelectorAll(".num").length;
    let length = document.querySelector(".length");
    length.innerHTML="( "+groupl+"ta )";
    channel.key = snapshot.key();

    var ch = addItem($('#channel-list'), $('#channel-item-template'));

    showData(ch, channel);

    if (!currentChannel) selectChannel();

    ch.on('click', selectChannel);
    

    function selectChannel() {

        if (messages) {

            messages.off('child_added', showMessage);

            $('#channel-messages .message').not('#message-template').remove();
        }

        currentChannel = channel;

        messages = db.child('messages/' + channel.key);

        showData($('#channel-info'), channel);

        messages.on('child_added', showMessage);

        $('#channel-list li').removeClass('selected');

        ch.addClass('selected');
    }
});




$('#message-text').on('keypress', function(e) {
    if (e.keyCode == 13) sendMessage();
})
$('#send-message').on('click', sendMessage);

function sendMessage() {
    var control = $("#FileInput"),
        clearBn = $("#clear");
    if (files.length != 0) {
        document.querySelector(".progres-div").classList.add("sending");
        for (let i = 0; i < files.length; i++) {
          var storage = firebase.storage().ref(files[i].name);
          var upload = storage.put(files[i]);
          upload.on(
            "state_changed",
            function progress(snapshot) {
              var percentage =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              document.getElementById("progress").value = percentage;
            },
            function error() {
              alert("error uploading file");
            },
            function complete() {
              var storage = firebase.storage().ref(files[i].name);
              storage
                .getDownloadURL()
                .then(function(url) {
                    //let username = localStorage.getItem("/slack_clone/userHandle").length;
                    let sucses_div = document.querySelector(".sucses-div");
                    let erorrs = document.querySelectorAll(".erorrs");
                    let erorrs_div = document.querySelector(".erorrs-div");
                    let Timeout = setTimeout(() => {
                        erorrs_div.style.height = "0px";
                        sucses_div.style.height = "0px";
                        for (let i = 0; i < erorrs.length; i++) {
                            erorrs[i].style.display="none";
                        }
                    }, 2000);
                    
                    if (fileName.split('.').pop()=="doc" || fileName.split('.').pop()=="docx" || fileName.split('.').pop()=="pptx" || fileName.split('.').pop()=="pdf" || fileName.split('.').pop()== 'xlsx' || fileName.split('.').pop()== 'xlsm' || fileName.split('.').pop()== 'xlsm' || fileName.split('.').pop()== 'xlsb' || fileName.split('.').pop()== 'xls' || fileName.split('.').pop()== 'xlm'){
                            var text = $('#message-text');
                            messages.push({
                                userHandle: loginjson[0].displayName, 
                                text: text.val(),
                                timestamp: Date.now(),
                                img: "<img src="+" ' "+loginjson[0].photoUrl+" ' "+ "class='author-img'"+">",
                                file:"<div class="+" ' "+"file-body"+"'"+"><div class="+"'"+"some-file"+"'"+"><div class="+"'"+"donwload-link"+"'"+"><a href="+url+" class="+"'"+"link-file"+"'"+" target="+"'"+"_blank"+"'"+"><i class="+"'"+"icon-file-o"+"'"+"></i></a></div></div><div class="+"'"+"file-heading"+"'"+"><p class="+"'"+"file-title"+"'"+">"+fileName+"</p></div></div>",
                            });
                            text.val('');
                            sucses_div.style.height = "40px";
                            document.querySelector(".sucses-message").style.display = "block";
                            Timeout
                    }else if (fileName.split('.').pop()=="jpeg" || fileName.split('.').pop()=="png" || fileName.split('.').pop()=="jpg") {
                            var text = $('#message-text');
                            messages.push({
                                userHandle: loginjson[0].displayName,
                                text: text.val(),
                                timestamp: Date.now(),
                                img: "<img src="+" ' "+loginjson[0].photoUrl+" ' "+ "class='author-img'"+">",
                                file:"<img class="+"'"+"file-img"+"'"+" src="+"'"+url+"'>",
                            });
                            text.val('');
                            sucses_div.style.height = "40px";
                            document.querySelector(".sucses-message").style.display = "block";
                            Timeout
                    }else{
                            erorrs_div.style.height = "40px";
                            document.querySelector(".erorr-file").style.display = "block";
                            Timeout
                    }

                    document.getElementById("channel-messages").scrollTop = document.getElementById("channel-messages").scrollHeight;
                    document.querySelector(".progres-div").classList.remove("sending");
                    control.replaceWith( control.val(''));
                    var icon_class = document.getElementById("load_icon");
                    icon_class.removeAttribute("class");
                    icon_class.setAttribute("class","icon-paperclip");
                    icon_class.style.color="";
                    document.getElementById("filelabel").style.border="none";
                })
                ;
            }
          );
        }
    }else{
        //let username = localStorage.getItem("/slack_clone/userHandle").length;
        let message_len = document.querySelector("#message-text").value.length;
        let sucses_div = document.querySelector(".sucses-div");
        let erorrs = document.querySelectorAll(".erorrs");
        let erorrs_div = document.querySelector(".erorrs-div");
        let Timeout = setTimeout(() => {
            erorrs_div.style.height = "0px";
            sucses_div.style.height = "0px";
            for (let i = 0; i < erorrs.length; i++) {
                erorrs[i].style.display="none";
            }
        }, 2000);
            if ( message_len > 0 ) {
                var text = $('#message-text');
                messages.push({
                    userHandle: loginjson[0].displayName,
                    text: text.val(),
                    timestamp: Date.now(),
                    img: "<img src="+" ' "+loginjson[0].photoUrl+" ' "+ "class='author-img'"+">",
                });
                text.val('');
                sucses_div.style.height = "40px";
                document.querySelector(".sucses-message").style.display = "block";
                Timeout
                document.getElementById("channel-messages").scrollTop = document.getElementById("channel-messages").scrollHeight;
            }else if (message_len == 0) {
            erorrs_div.style.height = "40px";
            document.querySelector(".erorr-message").style.display = "block";
            Timeout
        }
    }
    
    
}

var HANDLE_KEY = '/slack_clone/userHandle';

var userHandle = $('#user-handle');

userHandle.val(getHandle());

userHandle.on('input', function() {
    setHandle(userHandle.val());
});

function getHandle() {
    return window.localStorage.getItem(HANDLE_KEY);
}

function setHandle(text) {
    window.localStorage.setItem(HANDLE_KEY, text);
}

function showMessage(snapshot) {
    var message = snapshot.val();

    var msg = addItem($('#channel-messages'), $('#message-template'));

    showData(msg, message);
}


function showData($el, data) {
    for (var prop in data) {
        $('[data=' + prop + ']', $el).html(data[prop]);
    }
}

function addItem($list, $template) {
    var item = $template.clone();

    item.removeClass('hidden');

    item.removeAttr('id');

    $list.append(item);

    return item;
}

})();


function menuadd() {
    document.body.classList.add("menu");
}
function menuremove() {
    document.body.classList.remove("menu");
}



firebase.initializeApp(firebaseConfig);
// 1) Create a new firebaseui.auth instance stored to our local variable ui
const ui = new firebaseui.auth.AuthUI(firebase.auth())

// 2) These are our configurations.
const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult(authResult, redirectUrl) {
      return true
    },
    uiShown() {
    },
  },
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
}

// 3) Call the 'start' method on our ui class
// including our configuration options.
ui.start("#firebaseui-auth-container", uiConfig)

function singout() {
    localStorage.setItem("user","false");
    localStorage.removeItem("firebaseui::rememberedAccounts");
    history.go(0);
}
var login = localStorage.getItem("firebaseui::rememberedAccounts");
var loginjson = JSON.parse(login);
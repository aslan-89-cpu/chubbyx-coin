/*=========================================
CHUBBYX—WALLET.JS
DIRECTTONCONNECTFIX
=========================================*/

lettonConnectUI=null;
lettonConnectStarting=null;
letwalletPageCreated=false;

constMANIFEST_URL=
"https://aslan-89-cpu.github.io/chubbyx-coin/tonconnect-manifest.json";

constTWA_RETURN_URL=
"https://t.me/ChubbyX_Coin_bot/chubbyx";


/*=========================================
WALLETPAGE
=========================================*/

functionwalletPage(){

constpage=
document.getElementById("wallet-page");

if(!page){
return;
}


/*
*CREATEPAGEONLYONCE
*/

if(!walletPageCreated){

page.innerHTML=`

<divclass="cx-wallet">

<button
id="cx-wallet-back"
type="button"
class="cx-back">
‹
</button>


<h2>Wallet</h2>

<pid="cx-message">
ConnectyourTONwallet
</p>


<divclass="cx-box">

<div
id="cx-status"
class="cx-status">
NotConnected
</div>


<!--OUROWNCONNECTBUTTON-->

<button
id="cx-connect"
type="button"
class="cx-connect">
ConnectWallet
</button>


<button
id="cx-disconnect"
type="button"
class="cx-disconnect"
style="display:none;">
Disconnect
</button>

</div>


<button
id="cx-home"
type="button"
class="cx-home">
BacktoHome
</button>

</div>

`;


addWalletStyles();


constback=
document.getElementById(
"cx-wallet-back"
);

consthome=
document.getElementById(
"cx-home"
);

constconnect=
document.getElementById(
"cx-connect"
);

constdisconnect=
document.getElementById(
"cx-disconnect"
);


if(back){
back.onclick=goHome;
}


if(home){
home.onclick=goHome;
}


/*
*DIRECTTONCONNECTOPEN
*/

if(connect){

connect.onclick=
asyncfunction(event){

event.preventDefault();
event.stopPropagation();

console.log(
"CHUBBYX:CONNECTCLICK"
);


try{

/*
*MakesureTONConnect
*existsbeforeopening.
*/

constui=
awaitstartTonConnect();


if(!ui){

console.error(
"CHUBBYX:TONCONNECTNOTREADY"
);

return;

}


console.log(
"CHUBBYX:OPENINGWALLETMODAL"
);


awaitui.openModal();


console.log(
"CHUBBYX:WALLETMODALOPENED"
);


}catch(error){

console.error(
"CHUBBYXOPENMODALERROR:",
error
);

}

};

}


if(disconnect){

disconnect.onclick=
disconnectWallet;

}


walletPageCreated=true;

}


/*
*STARTTONCONNECT
*/

startTonConnect();

}


/*=========================================
STYLES
=========================================*/

functionaddWalletStyles(){

if(
document.getElementById(
"cx-wallet-style"
)
){
return;
}


conststyle=
document.createElement("style");


style.id=
"cx-wallet-style";


style.textContent=`

#wallet-page{
overflow-y:auto;
overflow-x:hidden;
touch-action:pan-y;
}


.cx-wallet{
position:relative;
width:100%;
min-height:100%;
padding:70px20px100px;
text-align:center;
color:white;
}


.cx-back{
position:absolute;
top:15px;
left:15px;
width:45px;
height:45px;
border:none;
border-radius:50%;
background:rgba(255,255,255,.12);
color:white;
font-size:34px;
display:flex;
align-items:center;
justify-content:center;
z-index:1000;
cursor:pointer;
touch-action:manipulation;
}


.cx-walleth2{
margin:0;
font-size:28px;
color:#eeb308;
}


.cx-wallet>p{
margin-top:8px;
color:#aaa;
font-size:14px;
}


.cx-box{
width:100%;
max-width:400px;
margin:35pxauto0;
padding:25px20px;
border-radius:20px;
background:rgba(255,255,255,.07);
}


.cx-status{
color:white;
font-size:15px;
margin-bottom:20px;
}


/*
*DIRECTCONNECTBUTTON
*/

.cx-connect{
width:100%;
max-width:320px;
min-height:52px;
padding:15px20px;
border:none;
border-radius:14px;

background:#2196F3;
color:white;

font-size:16px;
font-weight:bold;

cursor:pointer;

touch-action:manipulation;
-webkit-tap-highlight-color:transparent;

position:relative;
z-index:9999;
}


.cx-connect:active{
transform:scale(.98);
}


.cx-disconnect{
width:100%;
max-width:320px;
margin-top:15px;
padding:15px;
border:none;
border-radius:14px;

background:#ff4d4d;
color:white;

font-size:16px;
font-weight:bold;

cursor:pointer;
touch-action:manipulation;

position:relative;
z-index:9999;
}


.cx-home{
position:absolute;
left:20px;
right:20px;
bottom:20px;

width:calc(100%-40px);

padding:15px;

border:none;
border-radius:15px;

background:rgba(255,255,255,.12);
color:white;

font-size:16px;
font-weight:bold;

cursor:pointer;

z-index:1000;
touch-action:manipulation;
}

`;


document.head.appendChild(style);

}


/*=========================================
TONCONNECTSTART
=========================================*/

asyncfunctionstartTonConnect(){

/*
*ALREADYREADY
*/

if(tonConnectUI){

updateWalletUI(
tonConnectUI.wallet
);

returntonConnectUI;

}


/*
*PREVENTDUPLICATESTART
*/

if(tonConnectStarting){
returntonConnectStarting;
}


tonConnectStarting=
(async()=>{

try{

/*
*CHECKSDK
*/

if(
!window.TON_CONNECT_UI||
!window.TON_CONNECT_UI.TonConnectUI
){

console.error(
"CHUBBYX:TONCONNECTSDKNOTFOUND"
);

returnnull;

}


/*
*CREATETONCONNECT
*
*IMPORTANT:
*NObuttonRootIdHERE.
*
*Weuseourownbutton
*andcallopenModal().
*/

tonConnectUI=
newwindow.TON_CONNECT_UI.TonConnectUI({

manifestUrl:
MANIFEST_URL,

uiPreferences:{

colorsSet:{

DARK:{

connectButton:{

background:
"#2196F3"

}

},

LIGHT:{

connectButton:{

background:
"#2196F3"

}

}

}

}

});


/*
*GLOBAL
*/

window.tonConnectUI=
tonConnectUI;


/*
*TELEGRAMMINIAPP
*/

tonConnectUI.uiOptions={

twaReturnUrl:
TWA_RETURN_URL

};


/*
*WALLETSTATUS
*/

tonConnectUI.onStatusChange(
function(wallet){

console.log(
"CHUBBYXWALLETSTATUS:",
wallet
);

updateWalletUI(
wallet
);

}
);


/*
*RESTORECONNECTION
*/

try{

awaittonConnectUI
.connectionRestored;

}catch(error){

console.log(
"CHUBBYXRESTORE:",
error
);

}


/*
*UPDATEUI
*/

updateWalletUI(
tonConnectUI.wallet
);


console.log(
"CHUBBYX:TONCONNECTREADY"
);


returntonConnectUI;


}catch(error){

console.error(
"CHUBBYXTONCONNECTERROR:",
error
);


tonConnectUI=
null;

window.tonConnectUI=
null;


returnnull;

}finally{

tonConnectStarting=
null;

}

})();


returntonConnectStarting;

}


/*=========================================
UPDATEWALLETUI
=========================================*/

functionupdateWalletUI(wallet){

conststatus=
document.getElementById(
"cx-status"
);

constmessage=
document.getElementById(
"cx-message"
);

constconnect=
document.getElementById(
"cx-connect"
);

constdisconnect=
document.getElementById(
"cx-disconnect"
);


if(!status){
return;
}


if(wallet){

status.textContent=
"WalletConnected";


if(message){

message.textContent=
"TONwalletconnected";

}


/*
*Hideconnectbutton
*/

if(connect){

connect.style.display=
"none";

}


/*
*Showdisconnect
*/

if(disconnect){

disconnect.style.display=
"block";

}

}else{

status.textContent=
"NotConnected";


if(message){

message.textContent=
"ConnectyourTONwallet";

}


/*
*Showconnectbutton
*/

if(connect){

connect.style.display=
"block";

}


/*
*Hidedisconnect
*/

if(disconnect){

disconnect.style.display=
"none";

}

}

}


/*=========================================
DISCONNECT
=========================================*/

asyncfunctiondisconnectWallet(event){

if(event){

event.preventDefault();
event.stopPropagation();

}


try{

if(!tonConnectUI){
return;
}


awaittonConnectUI.disconnect();


updateWalletUI(null);


console.log(
"CHUBBYX:WALLETDISCONNECTED"
);


}catch(error){

console.error(
"CHUBBYXDISCONNECTERROR:",
error
);

}

}


/*=========================================
GOHOME
=========================================*/

functiongoHome(event){

if(event){

event.preventDefault();
event.stopPropagation();

}


try{

if(
tonConnectUI&&
typeoftonConnectUI.closeModal===
"function"
){

tonConnectUI.closeModal();

}

}catch(error){

console.log(
"CHUBBYXCLOSEMODAL:",
error
);

}


if(
typeofwindow.switchPage===
"function"
){

window.switchPage(
"home"
);

}

}


/*=========================================
GLOBAL
=========================================*/

window.walletPage=
walletPage;

window.startTonConnect=
startTonConnect;

window.disconnectWallet=
disconnectWallet;

window.goHome=
goHome;


console.log(
"CHUBBYX:DIRECTWALLETCONNECTLOADED"
);
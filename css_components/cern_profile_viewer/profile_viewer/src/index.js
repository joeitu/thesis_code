console.log("loading main.js")

// Import from "@inrupt/solid-client-authn-browser"
import {
  fetch,
  getDefaultSession,
  handleIncomingRedirect,
  login
} from "@inrupt/solid-client-authn-browser";

// Import from "@inrupt/solid-client"
import {
  addStringNoLocale,
  createThing,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getUrl,
  removeStringNoLocale,
  removeThing,
  saveSolidDatasetAt,
  setStringNoLocale,
  setThing
} from "@inrupt/solid-client";

import { VCARD, FOAF } from "@inrupt/vocab-common-rdf";


// 1a. Start Login Process. Call login() function.
function loginToInruptDotCom() {
  return login({
    // oidcIssuer: "https://solidcommunity.net",
    oidcIssuer: "http://localhost:5001/",
    redirectUrl: window.location.href,
    clientName: "Getting started app"
  });
}

// 1b. Login Redirect. Call handleIncomingRedirect() function.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();

  const session = getDefaultSession();
  if (session.info.isLoggedIn) {
    // Update the page with the status.
    document.getElementById("btnLogin").textContent = "Logout" 

    // document.getElementById("webID").value = session.info.webId
    console.log("login with: " + session.info.webId )
    readProfile(session.info.webId).catch(err => console.log('error in handleRedirectAfterLogin: ' + err));

  }
}



function getPodNameCSS(){
	return window.location.pathname.split('/')[1]
}

function isWebidURL(){
   return window.location.href.includes('/profile/card')
}

function getProfileUrl(podName){
  return window.location.protocol + '//' + window.location.host + '/' + podName + '/profile/card#me'
}


// 2. Read profile
async function readProfile(webID) {
  
  const profileDocumentURI = webID.split('#')[0]; // remove the '#me'('#()
  const myDataset = await getSolidDataset(profileDocumentURI, { fetch: fetch });

  // Get the Profile data from the retrieved SolidDataset
  const profile = getThing(myDataset, webID);

  console.log('vcard')
  console.log(VCARD)

  const fn = getStringNoLocale(profile, VCARD.fn);
  const role = getStringNoLocale(profile, VCARD.role);
  const image = getUrl(profile, VCARD.hasPhoto);
  const orga = getStringNoLocale(profile, VCARD.organization_name);
  const note = getStringNoLocale(profile, VCARD.note);

  // Update the page with the retrieved values.
  document.getElementById("labelFN").textContent = fn;
  document.getElementById("labelFNEdit").value= fn;
  document.getElementById("labelRole").textContent = role;
  document.getElementById("labelRoleEdit").value= role;
  document.getElementById("labelOrga").textContent= orga;
  document.getElementById("labelOrgaEdit").value= orga;
  document.getElementById("labelNote").textContent= note;
  document.getElementById("labelNoteEdit").value= note;
  // document.getElementById("labelPodName").textContent =  '-' + getPodNameCSS();
  // document.getElementById("labelBool").textContent =  '-' + isWebidURL();
}

async function get_webid_css(){
  // return the webid corresponding to the current pod

  // get pod from URL ( specific to CSS )
	const podName = window.location.pathname.split('/')[1]
	const podWebID = getProfileUrl(podName)
	const podProfileDocumentURI = podWebID.split('#')[0]


  // fetch the pod profile and get the owner webID by fetching the `maker` thing
  const myDataset = await getSolidDataset(podProfileDocumentURI, { fetch: fetch }).catch( err => {
    console.log("error get_webid_css: " + err);
  })
  const profile = getThing(myDataset, podProfileDocumentURI);
  console.log(profile)
  const maker = getUrl(profile, FOAF.maker);
  console.log(maker)
  console.log('maker: ' + maker)
	return maker
  
}

async function updateVcard(){

  const webIdUrl = getDefaultSession().info.webId
  const profileCardUrl = webIdUrl.slice(0,-3);
  let myProfileCard ;

  const new_fn   = document.getElementById("labelFNEdit").value
  const new_role = document.getElementById("labelRoleEdit").value
  const new_orga = document.getElementById("labelOrgaEdit").value
  const new_note = document.getElementById("labelNoteEdit").value

  try {
    myProfileCard = await getSolidDataset(profileCardUrl, { fetch: fetch });
    let cardMe = getThing(myProfileCard, webIdUrl)

    let new_card = setStringNoLocale(cardMe, VCARD.note, new_note);
    new_card = setStringNoLocale(new_card, VCARD.role, new_role);
    new_card = setStringNoLocale(new_card, VCARD.organization_name, new_orga);
    new_card = setStringNoLocale(new_card, VCARD.fn, new_fn);

    myProfileCard = setThing(myProfileCard, new_card);
    let savedProfileCard = await saveSolidDatasetAt(
      profileCardUrl,
      myProfileCard,
      { fetch: fetch }
    );
  } catch (error) {
    console.log("ERR:"+error)
  }
}

function switchEditMode(){
	let editModeLabels = document.getElementsByClassName("editMode");
  for ( let i=0; i < editModeLabels.length; i++ ) {
      editModeLabels[i].style.visibility = "visible"
  }
	let normalModeLabels = document.getElementsByClassName("normalMode");
  for ( let i=0; i < normalModeLabels.length; i++ ) {
      normalModeLabels[i].style.visibility = "hidden"
  }
  document.getElementById('btnEdit').style.visibility = "hidden"
  document.getElementById('btnSave').style.visibility = "visible"
}

// document.querySelector("#btnSwitchEdit").onclick = () => switchEditMode()

function switchNormalMode(){
	let editModeLabels = document.getElementsByClassName("editMode");
  for ( let i=0; i < editModeLabels.length; i++ ) {
      editModeLabels[i].style.visibility = "hidden"
  }
	let normalModeLabels = document.getElementsByClassName("normalMode");
  for ( let i=0; i < normalModeLabels.length; i++ ) {
      normalModeLabels[i].style.visibility = "visible"
  }
  document.getElementById('btnEdit').style.visibility = "visible"
  document.getElementById('btnSave').style.visibility = "hidden"
}

// document.querySelector("#btnSwitchNormal").onclick = () => switchNormalMode()


const buttonLogin = document.querySelector("#btnLogin");
// const buttonRead = document.querySelector("#btnRead");
const buttonEdit = document.querySelector("#btnEdit");
const buttonSave = document.querySelector("#btnSave");

buttonLogin.onclick = function() {  
  loginToInruptDotCom();
};

// buttonRead.onclick = function() {  
//   const webID = document.getElementById("webID").value;
//   // const webIdUrl = getDefaultSession().info.webId
//   document.getElementById("labelProfile").textContent = webID;
//   readProfile(webID);
// };

buttonEdit.onclick = function() {
	if(getDefaultSession().info.isLoggedIn){
  	switchEditMode()
	}else{
  	alert("please login first to edit the profile")
	}
};

buttonSave.onclick = async function() {
 // document.getElementById("webIdCard").style.visibility="hidden";
  const webID = getDefaultSession().info.webId
  console.log('ici2')
  await updateVcard();
  console.log('ici3')
  readProfile(webID);
  console.log('ici4')
  switchNormalMode()
};



function main () {

 // document.getElementById("webIdCard").style.visibility="hidden";

 if(isWebidURL()){
   handleRedirectAfterLogin().then(
     _ => {
       get_webid_css().then( maker_webID => readProfile(maker_webID))
     }).catch( err => console.log("err in main:" + err))
   switchNormalMode()
   // const maker_webID = await get_webid_css();
   // await readProfile(maker_webID).catch( err =>
   //     console.log('error mainpodName' + err)
   //   )
 }else if(document.location.pathname == '/'){
   document.getElementById("webIdCard").style.visibility="hidden";
   document.getElementById("defaultPage").innerHTML = `Welcome to Solid ! <br/> You can <a href="/idp/register/"> Sign up for an account and get started with your Pod and WebID<br/> <a href="https://solidproject.org/about">Learn more about solid<a/> <br/> <a href="https://github.com/joeitu/cern-css/blob/master/manual/readme.md"> Checkout the user manual for CERN user</a>`
  }else{
   document.getElementById("webIdCard").style.visibility="hidden";
   const basenameUrl = document.location.protocol + '//' + document.location.hostname
   const podName = getPodNameCSS()
   const profileUrl = getProfileUrl(podName)
   document.getElementById("defaultPage").innerHTML = `Hello ! you are on  ${podName} 's Pod. You can browse the Pod's content with <a href='https://penny.vincenttunru.com/?solid_server=${basenameUrl}'>Penny</a>  or checkout this Pod's <a href=${profileUrl}>user profile</a>`

  
   }
}



main();


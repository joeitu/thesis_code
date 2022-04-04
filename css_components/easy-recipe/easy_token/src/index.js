import {
  setThing,
  addStringNoLocale,
  saveSolidDatasetAt,
  getSolidDataset,
  getThing,
  
} from "@inrupt/solid-client";

import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from "@inrupt/solid-client-authn-browser";



// 1a. Start Login Process. Call login() function.
function startLogin(oidcIssuer) {
  return login({
    // oidcIssuer: "https://broker.pod.inrupt.com",
    oidcIssuer: oidcIssuer,
    redirectUrl: window.location.href,
    clientName: "Getting started !"
  });
}

async function addToken(token_value, webIdUrl) {
  const profileCardUrl = `${webIdUrl}`;
  const OIDC_SCHEMA ="http://www.w3.org/ns/solid/terms#oidcIssuerRegistrationToken"
  let myProfileCard ;
 

  try {
    myProfileCard = await getSolidDataset(profileCardUrl, { fetch: fetch });
  } catch (error) {
      console.error(error.message);
  }

  let card = getThing(myProfileCard, webIdUrl)
  card = addStringNoLocale(card, OIDC_SCHEMA, token_value);
  myProfileCard = setThing(myProfileCard, card);

  try {
    // Save the SolidDataset
    await saveSolidDatasetAt(
      profileCardUrl,
      myProfileCard,
      { fetch: fetch }
    );
  } catch (error) {
    console.log(error);
  } 
}

// 1b. Login Redirect.
// When redirected after login, call handleIncomingRedirect() function to
// finish the login process by retrieving session information.

// The example has the login redirect back to the index.html.
// finishLogin() calls the function to process login information.
// If the function is called when not part of the login redirect, the function is a no-op.


export async function check_if_token_in_webid_document(pod_url, token){
  // WIP... verify if token dully added to webID document
  // from https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/read-write-data/

  const myDataset = await getSolidDataset(
      pod_url + '/profile/card', {
      fetch: fetch
    });

  const profile = getThing(
    myDataset,
    pod_url + "/profile/card#me"
  );

  console.log("READ")
  console.log(myDataset);
  console.log(profile);

  const tokens = profile.predicates['http://www.w3.org/ns/solid/terms#oidcIssuerRegistrationToken'].literals['http://www.w3.org/2001/XMLSchema#string']
  console.log('tokens')
  console.log(tokens)
  console.log('token')
  console.log(token)

  if(tokens.indexOf(token) >= 0){
    console.log('Token exist on the pod')
    return true
  }else{
    console.log('Couldn\'t find token on the pod')
    return false
  }
}


export async function afterLoginHook(func, args=[]) {
  console.log("afterLoginHook: runing " + func.name)
  await handleIncomingRedirect();
  const session = getDefaultSession();
  if (session.info.isLoggedIn) {
    console.log("afterLoginHook: logged in!")
    func(session, ...args);
  }else{
    console.log("afterLoginHook: NOT logged in")
  }
}

export function get_issuer_and_login () {
  let oidcIssuer = document.getElementById('oidcIssuer').value
  startLogin(oidcIssuer);
}

export function add_token(token) {
    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
      // let token = document.getElementById('tokenValue').value
      addToken(token, session.info.webId );
      // document.getElementById("sendStatus").textContent = `token sent`;
      console.log(`token sent`);
    }else{
      // document.getElementById("labelStatus").textContent = ` 👈 Please login first`;
      console.log(` 👈 Please login first`);
    }
};



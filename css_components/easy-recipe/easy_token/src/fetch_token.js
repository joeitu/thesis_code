
async function fetch_token(form_data, idp_url) {
  resp = await fetch(idp_url,
                      {method: "POST",
                       headers:{
                         "Content-Type": "application/json",
                         "Accept": "application/json"},
                       body:JSON.stringify(form_data)})
              .then(resp => resp.json())
              .then( data => {
                console.log(data)
                token = data.details.quad.split(' ')[2].slice(1, -2)
                console.log("raw tok " + token)
                document.getElementById("tokenValue").value = token;
              });

};


function get_form_data() {
  const webId = document.getElementById("webIdValue").value;
  // send fake data as we just need a failed login to get the token
  // only the webID should be correct, other return wrong token
  data = {"email": "a@a.a",
           "password": "a",
           "confirmPassword": "a",
           "podName": "a",
           "register": "on",
           "createPod": "on",
           "webId": webId
  }
  return data
}



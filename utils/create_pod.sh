NAME="$1"
URL=${CSS_URL:-$2}

test -n "$NAME" || echo "please enter a pod name"
test -n "$URL"  || echo "please enter CSS'URL"

mail="${NAME}@${NAME}.${NAME}"
pwd="${NAME}"
podname="${NAME}"



curl -i  -H "Accept: application/json"  -H "Content-Type: application/json" -X POST -d `{"email": $mail, "password": "b", "confirmPassword":$pwd, "podName": $podname, "register": "on", "createWebId": "on", "createPod": "on"}` http://localhost:3000/idp/register/


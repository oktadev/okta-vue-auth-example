npm run build
cd dist
touch Staticfile
echo 'pushstate: enabled' > Staticfile
cf push vue-auth-pwa --no-start
cf set-env vue-auth-pwa FORCE_HTTPS true
cf start vue-auth-pwa

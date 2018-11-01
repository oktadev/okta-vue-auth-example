/* globals localStorage */
const OktaAuth = require('@okta/okta-auth-js')
const authClient = new OktaAuth({url: 'https://dev-158606.oktapreview.com', issuer: 'default'})

export default {
  login (email, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
    return authClient.signIn({
      username: email,
      password: pass
    }).then(response => {
      if (response.status === 'SUCCESS') {
        return authClient.token.getWithoutPrompt({
          clientId: 'MjlYvTtFW26gOoOAHKOz',
          responseType: ['id_token', 'token'],
          scopes: ['openid', 'email', 'profile'],
          sessionToken: response.sessionToken,
          redirectUri: window.location.origin
        }).then(tokens => {
          localStorage.token = tokens[1].accessToken
          localStorage.idToken = tokens[0].idToken
          if (cb) cb(true)
          this.onChange(true)
        })
      }
    }).fail(err => {
      console.error(err.message)
      if (cb) cb(false)
      this.onChange(false)
    })
  },

  getToken () {
    return localStorage.token
  },

  getName () {
    const claims = this.parseJwt(localStorage.idToken)
    // console.jwt(localStorage.idToken)
    return claims['name']
  },

  parseJwt (token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
  },

  logout (cb) {
    delete localStorage.token
    delete localStorage.idToken
    if (cb) cb()
    this.onChange(false)
    return authClient.signOut()
  },

  loggedIn () {
    return !!localStorage.token
  },

  onChange () {
  }
}

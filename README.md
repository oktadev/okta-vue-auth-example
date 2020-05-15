# Vue.js App with Okta Authentication

This example shows how to create a Vue.js application that uses Okta's Auth SDK to log in with Okta.

Please read [The Lazy Developer's Guide to Authentication with Vue.js](https://developer.okta.com/blog/2017/09/14/lazy-developers-guide-to-auth-with-vue) to see how this application was created.

**Prerequisites:** [Node.js](https://nodejs.org/).

> [Okta](https://developer.okta.com/) has Authentication and User Management APIs that reduce development time with instant-on, scalable user infrastructure. Okta's intuitive API and expert support make it easy for developers to authenticate, manage and secure users and roles in any application.

* [Getting Started](#getting-started)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

To install this example application, run the following commands:

```bash
git clone https://github.com/oktadeveloper/okta-vue-auth-example.git
cd okta-vue-auth-example
npm install
npm start
```

This will get a copy of the project installed locally, install all of its dependencies and start the app.

### Create an OIDC App in Okta

You’ll need to create an OIDC App in Okta to get a `{clientId}`. To do this, log in to your Okta Developer account, or [create one](https://developer.okta.com/signup/) if you don't have one.  Navigate to **Applications** > **Add Application**. Click **SPA** and click the **Next** button. Give the app a name you’ll remember, and specify `http://localhost:8080` as a Base URI and Login Redirect URI.

<img src="https://d33wubrfki0l68.cloudfront.net/53b99de8758a120a740a7ba5e812960d3db9203b/d9fcf/assets-jekyll/blog/vue-auth-sdk/oidc-settings-81dfb851c028131fb639bb2eded39813070c9c17064c283de28e5ecb48002d10.png" alt="OIDC Settings" width="700"/>

Click **Done** and you’ll be shown a screen with this information as well as a Client ID at the bottom. Set `{yourOktaDomain}` and copy the Client ID into `src/auth.js`.

```javascript
const OktaAuth = require('@okta/okta-auth-js')
const authClient = new OktaAuth({url: 'https://{yourOktaDomain}.com', issuer: 'default'})

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
          clientId: '{clientId}',
          responseType: ['id_token', 'token'],
          scopes: ['openid', 'email', 'profile'],
          sessionToken: response.sessionToken,
          redirectUri: 'http://localhost:8080'
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
  ...
}
```

**NOTE:** The value of `{yourOktaDomain}` should be something like `dev-123456.oktapreview`. Make sure you don't include `-admin` in the value!

After making these changes, you should be able to log in with your credentials at `http://localhost:8080`.

## Links

This example uses the following libraries provided by Okta:

* [Okta Auth SDK](https://github.com/okta/okta-auth-js)

## Help

Please post any questions as comments on the [blog post](https://developer.okta.com/blog/2017/09/14/lazy-developers-guide-to-auth-with-vue), or visit our [Okta Developer Forums](https://devforum.okta.com/). You can also email developers@okta.com if would like to create a support ticket.

## License

Apache 2.0, see [LICENSE](LICENSE).

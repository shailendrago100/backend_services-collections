# Node.js i18n: multilingual
 To create a multilingual version of your app, you should use one of the Node.js internationalization libraries available, for example on Openbase. We do implement localization functionality pretty much in the same way.

# Dependencies
- i18next
- i18next-http-backend
- i18next-http-middleware


# create an i18n config object
Before we use the library, we need to configure it.
- i18next
# Why should you use i18n?
- Auto detection of locale from the browser by header, cookie or query parameter depending on your setup.
-  comes with examples as well.
- It need generates a en.json   inside ./locales/. This acts as a master file for you to start building new translations.
- Supports Singular and plural forms

- We added support for 2 languages, with the default one being en (English) and the second one being de ("German) . View the whole list of all  onfiguration options for the library to learn more.
- Support for parameters: 
    - console.log(t('welcome', { lng: 'de' })) returns hallo welt  // in German
    - console.log(t('welcome') returns hello world    // in defualt english     
    - req.t("welcome")  returns hello world    // in defualt english
    - req.t("welcome", { lng: 'de' })  returns hello world   // in German


    # app.use(i18nextMiddleware.handle(i18next)); // expose req.t with fixed lng
```sh
 i18next       = require('i18next')
 HttpBackend   = require('i18next-http-backend')
 middleware      = require('i18next-http-middleware')
 SERVER_ROOT_URI="http://localhost:8080";
app.use('/locales',express.static(path.join(__dirname, "locales")));
i18next.use(HttpBackend).use(middleware.LanguageDetector).init({
  lng: 'en',
  fallbackLng: 'en',
  preload: ['en', 'de'],
  ns: ['translation'],
  defaultNS: 'translation',
  backend: {
    loadPath: `${SERVER_ROOT_URI}/locales/{{lng}}/{{ns}}.json`
  }
}, (err, t) => {
  if (err) return console.error(err)
  // console.log(t('welcome'))
  // console.log(t('welcome', { lng: 'de' }))

})
app.use(middleware.handle(i18next))
```
- The i18next is the simplest and greatest module that you should use. You can use directly in Javascript code or with Jade/Handlebar templates with express js.




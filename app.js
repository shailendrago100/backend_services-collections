const express       = require("express");
const app           = express();
let bodyParser      = require("body-parser");
const db            = require("./databaseConnect");
const routes        = require("./server/routes");
const PORT          = process.env.PORT || 8080;
const cors          = require('cors');
const path          = require('path');
const i18next       = require('i18next')
const HttpBackend   = require('i18next-http-backend')
var middleware      = require('i18next-http-middleware')
const config        = require("config");
let SERVER_ROOT_URI="http://localhost:8080";
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

const uploadRoutes  = require("./server/routes/upload.routes");
const admin         = require("./server/routes/adminRoutes/index")
app.use(middleware.handle(i18next))
db.mongoConnect();
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', routes)
app.use('/upload', uploadRoutes)
app.use("/admin",admin);


let router = express.Router();
app.use(router);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

// const { facebookRoutes, googleRoutes, githubRoutes, instagramRoutes,twitterRoutes,appAuthRoutes,routeArry } = require("./server/routes");
// app.use("/auth/app", appAuthRoutes);
// app.use("/auth/facebook", facebookRoutes);
// app.use("/auth/google", googleRoutes);
// app.use("/auth/github", githubRoutes);
// app.use("/auth/instagram",instagramRoutes)
// app.use("/auth/twitter",twitterRoutes)
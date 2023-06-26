// https://github.com/codepo8/github-page-pwa

// Change this to your repository name
var GHPATH = '/mgps_js';
 
// Choose a different app prefix name
var APP_PREFIX = 'mgpsjs_';
 
// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = '0.5.2';
 
// The files to make available for offline use. make sure to add 
// others to this list
var URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,

  `${GHPATH}/css/fontawesome.min.css`,
  `${GHPATH}/css/regular.min.css`,
  `${GHPATH}/css/solid.min.css`,
  `${GHPATH}/css/bootstrap.min.css`,
  `${GHPATH}/css/brands.min.css`,

  `${GHPATH}/js/jquery-3.7.0.min.js`,
  `${GHPATH}/js/strftime.js`,
  `${GHPATH}/js/mgpsjs.js`,
  `${GHPATH}/js/geoPosition.js`,
  `${GHPATH}/js/popper.min.js`,
  `${GHPATH}/js/bootstrap.min.js`,
  `${GHPATH}/js/found_items.js`,

  `${GHPATH}/webfonts/fa-solid-900.woff2`,
  `${GHPATH}/webfonts/fa-solid-900.ttf`,
  `${GHPATH}/webfonts/fa-v4compatibility.woff2`,
  `${GHPATH}/webfonts/fa-v4compatibility.ttf`
]






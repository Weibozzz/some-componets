const path = require('path')
const fs = require('fs')

function resolve(file){
  return path.resolve(__dirname, file);
}
const jsStr = fs.readFileSync(resolve(`../dist/bundle.js`)).toString()

const str = `// ==UserScript==
// @name         decryptResponse
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  const app = {
    createApp(){
      const app = document.createElement('div')
      app.setAttribute('id', 'uhou-root')
      document.body.appendChild(app)
    },
    createAppStyle(){
      const head = document.getElementsByTagName('head')[0]
      const style = document.createElement('style')
      style.type = 'text/css'
      const text = document.createTextNode(\`
      #uhou-root{
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999999999;
}\`)
      style.appendChild(text)
      head.appendChild(style)
    },
    createDistStyle(){
      const head = document.getElementsByTagName('head')[0]
      const style = document.createElement('style')
      style.type = 'text/css'
      const text = document.createTextNode(\`\`)
      style.appendChild(text)
      head.appendChild(style)
    },
  }
  app.createApp()
  app.createAppStyle()
  app.createDistStyle()
  ;(() => {
    ${jsStr}
  })()
})();

`
fs.writeFileSync(resolve('../index.js'), str)

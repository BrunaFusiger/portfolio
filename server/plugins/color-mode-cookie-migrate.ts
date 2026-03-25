/**
 * Runs before @nuxtjs/color-mode's inline script: copy legacy localStorage value
 * into the cookie so SSR and the first paint agree after switching storage to cookie.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (htmlContext) => {
    const key = 'nuxt-color-mode-v2'
    const migrate = `<script>(function(){try{var k=${JSON.stringify(key)};if(document.cookie.split("; ").some(function(p){return p.indexOf(k+"=")===0}))return;var v=localStorage.getItem(k);if(v)document.cookie=k+"="+v+";max-age=31536000;path=/";}catch(e){}})();</script>`
    htmlContext.head.unshift(migrate)
  })
})

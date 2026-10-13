/* =====================================================================
   BeMer Flow — aviso no aparelho (Web Push) · 13/10/2026 · 0061
   Só mostra o aviso e abre a pendência no toque. Não guarda nada em
   cache (o Flow sempre vem da rede).
   ===================================================================== */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch(x){ d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'BeMer Flow', {
    body: d.body || '', tag: d.tag || undefined, renotify: !!d.tag,
    icon: 'icone-180.png', badge: 'icone-180.png', data: { url: d.url || './' }
  }));
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(ws){
    for (var i = 0; i < ws.length; i++){
      var w = ws[i];
      if (w.url.indexOf(self.registration.scope) === 0 && 'focus' in w){
        return w.focus().then(function(f){ return f && f.navigate ? f.navigate(url) : f; }).catch(function(){ return self.clients.openWindow(url); });
      }
    }
    return self.clients.openWindow(url);
  }));
});

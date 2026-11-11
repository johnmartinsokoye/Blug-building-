
(function () {
  "use strict";

  var K = {
    news: "ds_news",
    users: "ds_users",
    sess: "ds_session",
  };

  function load(k, d) {
    try {
      var value = localStorage.getItem(k);
      return value ? JSON.parse(value) : d;
    } catch (e) {
      return d;
    }
  }

  function save(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }

  function img(s) {
    return "https://picsum.photos/seed/" + s + "/900/600";
  }

  var now = Date.now();
  var day = 864e5;
  var seed = [
    {
      id: "n1",
      title: "Lagos opens new light-rail extension to ease commuter traffic",
      cat: "local",
      summary:
        "The extension is expected to cut daily travel times for thousands of commuters.",
      body:
        "Officials opened the new stretch on Monday, with the first trains running at peak hours.\n\nCommuters say the change is already noticeable, though some stations still need better access roads.",
      image: img("rail"),
      featured: true,
      published: true,
      author: "Newsroom",
      date: now - day * 0.2,
    },
    {
      id: "n2",
      title: "Local traders adapt as market prices shift again this week",
      cat: "local",
      summary: "Food sellers report mixed results as supply routes recover.",
      body:
        "Traders at several major markets told our reporters that prices of staples moved up and down within days.\n\nBuyers are changing habits, choosing smaller quantities and comparing stalls more carefully.",
      image: img("market"),
      featured: false,
      published: true,
      author: "Newsroom",
      date: now - day * 1,
    },
    {
      id: "n3",
      title: "Students showcase solar-powered projects at state science fair",
      cat: "local",
      summary: "Secondary school teams presented low-cost energy ideas for homes.",
      body:
        "More than forty teams entered this year, many building small solar chargers and lamps.\n\nJudges praised the creativity and encouraged schools to keep funding practical science.",
      image: img("science"),
      featured: false,
      published: true,
      author: "Newsroom",
      date: now - day * 2,
    },
    {
      id: "n4",
      title: "Global leaders meet to agree new climate financing targets",
      cat: "foreign",
      summary: "Negotiators are trying to close a gap between pledges and delivery.",
      body:
        "Delegates arrived with competing priorities, from faster funding for vulnerable nations to clearer reporting rules.\n\nObservers expect talks to run late, with a final text still uncertain.",
      image: img("summit"),
      featured: false,
      published: true,
      author: "Newsroom",
      date: now - day * 0.5,
    },
    {
      id: "n5",
      title: "Europe’s central banks weigh next steps as inflation cools",
      cat: "foreign",
      summary: "Markets are watching for signals on interest rates.",
      body:
        "Recent data suggests price growth is easing, but officials say they will stay cautious.\n\nAnalysts expect any change to be gradual and tied to new figures.",
      image: img("bank"),
      featured: false,
      published: true,
      author: "Newsroom",
      date: now - day * 1.5,
    },
    {
      id: "n6",
      title: "Space agencies announce joint mission to study the outer planets",
      cat: "foreign",
      summary: "The mission will combine instruments from several countries.",
      body:
        "Engineers say the spacecraft will carry cameras and sensors designed to last for years in deep space.\n\nLaunch is planned for the end of the decade, pending final budgets.",
      image: img("space"),
      featured: false,
      published: true,
      author: "Newsroom",
      date: now - day * 3,
    },
  ];

  var news = load(K.news, null);
  if (!news) {
    news = seed;
    save(K.news, news);
  }

  var users = load(K.users, null);
  if (!users) {
    users = [
      {
        id: "u1",
        name: "Administrator",
        username: "admin",
        password: "admin123",
        role: "admin",
      },
    ];
    save(K.users, users);
  }

  var app = document.getElementById("app");
  var tab = "articles";
  var editing = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  function fmt(t) {
    return new Date(t).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function toast(m) {
    var t = document.getElementById("toast");
    t.textContent = m;
    t.className = "show";
    clearTimeout(toast.h);
    toast.h = setTimeout(function () {
      t.className = "";
    }, 2200);
  }

  function session() {
    return load(K.sess, null);
  }

  function pub() {
    return news
      .filter(function (n) {
        return n.published;
      })
      .sort(function (a, b) {
        return b.date - a.date;
      });
  }

  function label(c) {
    return c === "local" ? "Local" : "Foreign";
  }

  function row(n) {
    return (
      '<a class="row" href="#article/' +
      n.id +
      '"><img src="' +
      esc(n.image) +
      '" alt=""><div><span class="tag ' +
      n.cat +
      '">' +
      label(n.cat) +
      "</span><h3>" +
      esc(n.title) +
      '</h3><span class="meta">' +
      fmt(n.date) +
      "</span></div></a>"
    );
  }

  function card(n) {
    return (
      '<a class="card" href="#article/' +
      n.id +
      '"><img src="' +
      esc(n.image) +
      '" alt="" loading="lazy"><div><span class="tag ' +
      n.cat +
      '">' +
      label(n.cat) +
      "</span><h3>" +
      esc(n.title) +
      "</h3><p>" +
      esc(n.summary) +
      '</p><p class="meta" style="margin-top:.6rem">' +
      fmt(n.date) +
      " · " +
      esc(n.author) +
      "</p></div></a>"
    );
  }

  function grid(list) {
    return list.length
      ? '<div class="grid">' + list.map(card).join("") + "</div>"
      : '<div class="empty">No stories here yet.</div>';
  }

  function home() {
    var p = pub();
    var lead = p.filter(function (n) {
      return n.featured;
    })[0] || p[0];

    if (!lead) {
      app.innerHTML = '<div class="empty">No stories published yet.</div>';
      return;
    }

    var rest = p.filter(function (n) {
      return n !== lead;
    });
    var loc = p
      .filter(function (n) {
        return n.cat === "local";
      })
      .slice(0, 3);
    var frn = p
      .filter(function (n) {
        return n.cat === "foreign";
      })
      .slice(0, 3);

    app.innerHTML =
      '<section class="hero"><a class="lead" href="#article/' +
      lead.id +
      '" style="background-image:url(' +
      esc(lead.image) +
      ')"><div><span class="tag" style="color:var(--acc)">' +
      label(lead.cat) +
      "</span><h1>" +
      esc(lead.title) +
      "</h1><p>" +
      esc(lead.summary) +
      '</p></div></a><div class="side">' +
      rest
        .slice(0, 4)
        .map(row)
        .join("") +
      '</div></section><div class="sec"><h2>Local news</h2><a href="#local">See all</a></div>' +
      grid(loc) +
      '<div class="sec"><h2>Foreign news</h2><a href="#foreign">See all</a></div>' +
      grid(frn);
  }

  function cat(c) {
    var t =
      c === "local"
        ? ["Local news", "Stories from our city and state."]
        : ["Foreign news", "What is happening around the world."];

    app.innerHTML =
      '<div class="page-h"><h1>' +
      t[0] +
      "</h1><p>" +
      t[1] +
      "</p></div>" +
      grid(
        pub().filter(function (n) {
          return n.cat === c;
        })
      );
  }

  function article(id) {
    var n = news.filter(function (x) {
      return x.id === id && x.published;
    })[0];

    if (!n) {
      app.innerHTML =
        '<div class="empty">That story isn’t available. <a href="#home">Back to home</a></div>';
      return;
    }

    app.innerHTML =
      '<article><span class="tag ' +
      n.cat +
      '">' +
      label(n.cat) +
      " news</span><h1>" +
      esc(n.title) +
      '</h1><p class="meta">By ' +
      esc(n.author) +
      " · " +
      fmt(n.date) +
      '</p><img src="' +
      esc(n.image) +
      '" alt=""><div class="body">' +
      String(n.body)
        .split(/\n+/)
        .map(function (p) {
          return "<p>" + esc(p) + "</p>";
        })
        .join("") +
      "</div></article>";
  }

function login(){
  app.innerHTML=='<div class="panel login"><h2>Admin sign in</h2><form id="lf"><label for="u">Username</label><input id="u" autocomplete="username" required><label for="p">Password</label><input id="p" type="password" autocomplete="current-password" required><p class="err" id="le"></p><button type="submit">Sign in</button></form><p class="meta">First time? Use admin / admin123, then change it by adding a new admin user.</p></div>';
  document.getElementById('lf').onsubmit=function(e){e.preventDefault();
    var u = document.getElementById("u").value.trim().toLowerCase();
    var p = document.getElementById("p").value;
    var m = users.filter(function (x) {
      return x.username === u && x.password === p;
    })[0];
    if(!m){document.getElementById('le').textContent='Wrong username or password.';return}
    save(K.sess,{id:m.id});admin()}}
function admin(){
  var s=session(),me=s&&users.filter(function(u){return u.id===s.id})[0];
  if(!me){login();return}
  var isAdmin=me.role==='admin';if(tab==='users'&&!isAdmin)tab='articles';
  var h='<div class="tabs"><button data-t="articles" class="'+(tab==='articles'?'on':'')+'">Articles</button><button data-t="editor" class="'+(tab==='editor'?'on':'')+'">'+(editing?'Edit story':'Write story')+'</button>'+(isAdmin?'<button data-t="users" class="'+(tab==='users'?'on':'')+'">Users</button>':'')+'<span class="sp"></span><span class="meta">'+esc(me.name)+' ('+me.role+')</span><button class="alt sm" id="out">Sign out</button></div>';
  if(tab==='articles'){
    h+='<div class="panel tw"><table><thead><tr><th>Title</th><th>Section</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>'+
    news.slice().sort(function(a,b){return b.date-a.date}).map(function(n){return '<tr><td>'+esc(n.title)+'</td><td>'+label(n.cat)+'</td><td><span class="pill">'+(n.published?'Published':'Draft')+'</span></td><td>'+fmt(n.date)+'</td><td style="white-space:nowrap"><button class="alt sm" data-edit="'+n.id+'">Edit</button> <button class="del sm" data-del="'+n.id+'">Delete</button></td></tr>'}).join('')+'</tbody></table></div>';
  }else if(tab==='editor'){
    var n=editing?news.filter(function(x){return x.id===editing})[0]:null;n=n||{title:'',cat:'local',summary:'',body:'',image:'',featured:false,published:true};
    h+='<form class="panel" id="ef"><label for="t">Headline</label><input id="t" required value="'+esc(n.title)+'"><div class="two"><div><label for="c">Section</label><select id="c"><option value="local"'+(n.cat==='local'?' selected':'')+'>Local news</option><option value="foreign"'+(n.cat==='foreign'?' selected':'')+'>Foreign news</option></select></div><div><label for="i">Image URL (optional)</label><input id="i" type="url" value="'+esc(n.image)+'" placeholder="https://…"></div></div><label for="s">Summary</label><input id="s" required maxlength="160" value="'+esc(n.summary)+'"><label for="b">Story</label><textarea id="b" required>'+esc(n.body)+'</textarea><label class="chk"><input type="checkbox" id="f"'+(n.featured?' checked':'')+'> Feature on the home page</label><label class="chk"><input type="checkbox" id="p"'+(n.published?' checked':'')+'> Publish now (untick to save as draft)</label><p style="margin-top:1rem"><button type="submit">Save story</button> <button type="button" class="alt" id="cx">Cancel</button></p></form>';
  }else{
    h+='<div class="two"><div class="panel tw"><h3>Team</h3><table><thead><tr><th>Name</th><th>Username</th><th>Role</th><th></th></tr></thead><tbody>'+users.map(function(u){return '<tr><td>'+esc(u.name)+'</td><td>'+esc(u.username)+'</td><td><span class="pill">'+u.role+'</span></td><td>'+(u.id===me.id?'':'<button class="del sm" data-du="'+u.id+'">Remove</button>')+'</td></tr>'}).join('')+'</tbody></table></div><form class="panel" id="uf"><h3>Add user</h3><label for="un">Full name</label><input id="un" required><label for="uu">Username</label><input id="uu" required autocomplete="off"><label for="up">Password</label><input id="up" type="password" required minlength="6" autocomplete="new-password"><label for="ur">Role</label><select id="ur"><option value="editor">Editor (writes stories)</option><option value="admin">Admin (also manages users)</option></select><p class="err" id="ue"></p><button type="submit">Add user</button></form></div>';
  }
  app.innerHTML=h;
  var q=function(s){return app.querySelectorAll(s)};
  q('[data-t]').forEach(function(b){b.onclick=function(){tab=b.dataset.t;if(tab!=='editor')editing=null;admin()}});
  q('#out')[0].onclick=function(){try{localStorage.removeItem(K.sess)}catch(e){}login()};
  q('[data-edit]').forEach(function(b){b.onclick=function(){editing=b.dataset.edit;tab='editor';admin()}});
  q('[data-del]').forEach(function(b){b.onclick=function(){if(confirm('Delete this story?')){news=news.filter(function(n){return n.id!==b.dataset.del});save(K.news,news);toast('Deleted');admin()}}});
  q('[data-du]').forEach(function(b){b.onclick=function(){if(confirm('Remove this user?')){users=users.filter(function(u){return u.id!==b.dataset.du});save(K.users,users);toast('User removed');admin()}}});
  if(q('#ef')[0]){
    q('#cx')[0].onclick=function(){editing=null;tab='articles';admin()};
    q('#ef')[0].onsubmit=function(e){e.preventDefault();
      var v=function(i){return document.getElementById(i)},title=v('t').value.trim();
      var o={title:title,cat:v('c').value,summary:v('s').value.trim(),body:v('b').value.trim(),image:v('i').value.trim()||img('n'+Date.now()),featured:v('f').checked,published:v('p').checked};
      if(o.featured)news.forEach(function(n){n.featured=false});
      if(editing){news.forEach(function(n){if(n.id===editing)for(var k in o)n[k]=o[k]})}
      else{o.id='n'+Date.now();o.author=me.name;o.date=Date.now();news.push(o)}
      save(K.news,news);editing=null;tab='articles';toast('Saved');admin()}}
  if(q('#uf')[0]){q('#uf')[0].onsubmit=function(e){e.preventDefault();
    var uu=document.getElementById('uu').value.trim().toLowerCase();
    if(users.some(function(u){return u.username.toLowerCase()===uu})){document.getElementById('ue').textContent='That username is taken. Choose another.';return}
    users.push({id:'u'+Date.now(),name:document.getElementById('un').value.trim(),username:uu,password:document.getElementById('up').value,role:document.getElementById('ur').value});
    save(K.users,users);toast('User added');admin()}}
}
function route(){
  var h=(location.hash||'#home').slice(1).split('/'),r=h[0];
  document.querySelectorAll("nav a").forEach(function (a) {
    a.classList.toggle("on", a.dataset.r === r);
  });
  window.scrollTo(0,0);
  if(r==='local'||r==='foreign')cat(r);else if(r==='article')article(h[1]);else if(r==='admin')admin();else home()}
window.addEventListener('hashchange',route);route();
})();

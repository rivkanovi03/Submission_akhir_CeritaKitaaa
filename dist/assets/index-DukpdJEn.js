var ae=t=>{throw TypeError(t)};var J=(t,e,n)=>e.has(t)||ae("Cannot "+n);var s=(t,e,n)=>(J(t,e,"read from private field"),n?n.call(t):e.get(t)),d=(t,e,n)=>e.has(t)?ae("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),l=(t,e,n,a)=>(J(t,e,"write to private field"),a?a.call(t,n):e.set(t,n),n),T=(t,e,n)=>(J(t,e,"access private method"),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const P={BASE_URL:"https://story-api.dicoding.dev/v1"},fe="BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk",y={FETCH_STORIES:`${P.BASE_URL}/stories`,LOGIN_USER:`${P.BASE_URL}/login`,REGISTER_USER:`${P.BASE_URL}/register`,SUBSCRIBE:`${P.BASE_URL}/subscribe`,UNSUBSCRIBE:`${P.BASE_URL}/unsubscribe`},D=()=>sessionStorage.getItem("token"),E={async ambilSemuaCerita(){const t=await fetch(y.FETCH_STORIES,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${D()}`}});if(!t.ok)throw new Error(`Gagal memuat data (${t.status})`);return await t.json()},async ambilCeritaBerdasarkanId(t){const e=await fetch(`${y.FETCH_STORIES}/${t}`,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${D()}`}});if(!e.ok)throw new Error(`Gagal mengambil data dengan ID ${t} (${e.status})`);return await e.json()},async kirimCeritaBaru(t){const e=await fetch(y.FETCH_STORIES,{method:"POST",headers:{Authorization:`Bearer ${D()}`},body:t});if(!e.ok){const n=await e.text();throw new Error(`Gagal mengirim cerita (${e.status}): ${n}`)}return await e.json()},async loginPengguna({email:t,password:e}){const n=await fetch(y.LOGIN_USER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:e})});if(!n.ok){const a=await n.text();throw new Error(`Login gagal (${n.status}): ${a}`)}return await n.json()},async daftarPenggunaBaru({name:t,email:e,password:n}){const a=await fetch(y.REGISTER_USER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,email:e,password:n})});if(!a.ok){const i=await a.text();throw new Error(`Registrasi gagal (${a.status}): ${i}`)}return await a.json()},async subsPushNotification({endpoint:t,keys:{p256dh:e,auth:n}}){const a=await fetch(y.SUBSCRIBE,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${D()}`},body:JSON.stringify({endpoint:t,keys:{p256dh:e,auth:n}})});if(!a.ok)throw new Error(`Gagal berlangganan notifikasi: ${a.statusText}`);return{...await a.json(),ok:a.ok}},async unsubsPushNotification({endpoint:t}){const e=await fetch(y.UNSUBSCRIBE,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${D()}`},body:JSON.stringify({endpoint:t})});if(!e.ok)throw new Error(`Gagal berhenti berlangganan notifikasi: ${e.statusText}`);return{...await e.json(),ok:e.ok}}},be=E.subsPushNotification,ye=E.unsubsPushNotification;var M,f,w;class we{constructor({model:e,view:n,dbModel:a}){d(this,M);d(this,f);d(this,w);l(this,M,e),l(this,f,n),l(this,w,a)}async ambilData(){s(this,f).showLoading();try{const e=await s(this,M).ambilSemuaCerita();e&&Array.isArray(e.listStory)?await Promise.all(e.listStory.map(n=>s(this,w).saveStory(n))):Array.isArray(e)&&await Promise.all(e.map(n=>s(this,w).saveStory(n))),s(this,f).tampilkanData(e)}catch(e){console.warn("Gagal memuat data dari API. Mencoba mengambil dari IndexedDB...",e);try{const n=await s(this,w).getAllStories();n.length>0?s(this,f).tampilkanData({listStory:n}):alert("Tidak ada data lokal yang tersedia.")}catch(n){console.error("Gagal mengambil data dari IndexedDB:",n),alert("Gagal memuat data.")}}s(this,f).hideLoading()}}M=new WeakMap,f=new WeakMap,w=new WeakMap;const X=(t,e)=>e.some(n=>t instanceof n);let ie,re;function ke(){return ie||(ie=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ve(){return re||(re=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Z=new WeakMap,Y=new WeakMap,z=new WeakMap;function Ee(t){const e=new Promise((n,a)=>{const i=()=>{t.removeEventListener("success",o),t.removeEventListener("error",r)},o=()=>{n(v(t.result)),i()},r=()=>{a(t.error),i()};t.addEventListener("success",o),t.addEventListener("error",r)});return z.set(e,t),e}function xe(t){if(Z.has(t))return;const e=new Promise((n,a)=>{const i=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",r),t.removeEventListener("abort",r)},o=()=>{n(),i()},r=()=>{a(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",o),t.addEventListener("error",r),t.addEventListener("abort",r)});Z.set(t,e)}let ee={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Z.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return v(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function de(t){ee=t(ee)}function Ie(t){return ve().includes(t)?function(...e){return t.apply(te(this),e),v(this.request)}:function(...e){return v(t.apply(te(this),e))}}function Le(t){return typeof t=="function"?Ie(t):(t instanceof IDBTransaction&&xe(t),X(t,ke())?new Proxy(t,ee):t)}function v(t){if(t instanceof IDBRequest)return Ee(t);if(Y.has(t))return Y.get(t);const e=Le(t);return e!==t&&(Y.set(t,e),z.set(e,t)),e}const te=t=>z.get(t);function Se(t,e,{blocked:n,upgrade:a,blocking:i,terminated:o}={}){const r=indexedDB.open(t,e),u=v(r);return a&&r.addEventListener("upgradeneeded",c=>{a(v(r.result),c.oldVersion,c.newVersion,v(r.transaction),c)}),n&&r.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),u.then(c=>{o&&c.addEventListener("close",()=>o()),i&&c.addEventListener("versionchange",m=>i(m.oldVersion,m.newVersion,m))}).catch(()=>{}),u}const Be=["get","getKey","getAll","getAllKeys","count"],Te=["put","add","delete","clear"],Q=new Map;function oe(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Q.get(e))return Q.get(e);const n=e.replace(/FromIndex$/,""),a=e!==n,i=Te.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!(i||Be.includes(n)))return;const o=async function(r,...u){const c=this.transaction(r,i?"readwrite":"readonly");let m=c.store;return a&&(m=m.index(u.shift())),(await Promise.all([m[n](...u),i&&c.done]))[0]};return Q.set(e,o),o}de(t=>({...t,get:(e,n,a)=>oe(e,n)||t.get(e,n,a),has:(e,n)=>!!oe(e,n)||t.has(e,n)}));const Pe=["continue","continuePrimaryKey","advance"],se={},ne=new WeakMap,le=new WeakMap,De={get(t,e){if(!Pe.includes(e))return t[e];let n=se[e];return n||(n=se[e]=function(...a){ne.set(this,le.get(this)[e](...a))}),n}};async function*Me(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const n=new Proxy(e,De);for(le.set(n,e),z.set(n,te(e));e;)yield n,e=await(ne.get(n)||e.continue()),ne.delete(n)}function ce(t,e){return e===Symbol.asyncIterator&&X(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&X(t,[IDBIndex,IDBObjectStore])}de(t=>({...t,get(e,n,a){return ce(e,n)?Me:t.get(e,n,a)},has(e,n){return ce(e,n)||t.has(e,n)}}));const _=Se("ceritakita-db",1,{upgrade(t){t.objectStoreNames.contains("stories")||t.createObjectStore("stories",{keyPath:"id"})}}),ue={async saveStory(t){if(!Object.hasOwn(t,"id"))throw new Error("`id` is required to save.");return(await _).put("stories",t)},async getAllStories(){return(await _).getAll("stories")},async getStoryById(t){if(!t)throw new Error("`id` is required.");return(await _).get("stories",t)},async deleteStory(t){return(await _).delete("stories",t)}};var C;class Ce{constructor(){d(this,C)}async render(){return`
      <style>
        .button-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .judul-section {
          text-align: center;
          color: #7e2553;
          margin: 40px 0 20px;
        }
        #btn-tambah {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        #btn-tambah:hover {
          background-color: #45a049;
        }
        #daftar-cerita {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 20px;
        }
        .cerita-item {
          background: #fff0f6;
          border: 2px solid #f8bbd0;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.2s ease;
        }
        .cerita-item:hover {
          box-shadow: 0 4px 8px rgba(122, 45, 105, 0.3);
        }
        .cerita-item img {
          width: 100%;
          border-radius: 6px;
          object-fit: cover;
          max-height: 180px;
          margin-bottom: 12px;
        }
        .cerita-item h3 {
          margin-bottom: 8px;
          color: #7e2553;
        }
        .cerita-item p {
          color: #5a2a57;
          font-size: 0.9rem;
          text-align: center;
        }
        /* Responsive */
        @media screen and (max-width: 900px) {
          #daftar-cerita {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media screen and (max-width: 600px) {
          #daftar-cerita {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <section class="container">
        <div id="loading-indicator"></div>
        <div class="button-wrapper">
          <button id="btn-tambah">Tambah Cerita</button>
        </div>
        <br/><br/>
        <h2 class="judul-section">Daftar Cerita</h2>
        <div id="daftar-cerita"></div>

        <h2 class="judul-section">Lokasi Cerita</h2>
        <div id="map" style="height: 400px; margin-top: 20px;"></div>
      </section>
    `}showLoading(){document.getElementById("loading-indicator").innerHTML="<p>Loading...</p>"}hideLoading(){document.getElementById("loading-indicator").innerHTML=""}async afterRender(){if(!sessionStorage.getItem("token")){alert("Silakan login terlebih dahulu."),window.location.href="#/login";return}l(this,C,new we({model:E,view:this,dbModel:ue})),await s(this,C).ambilData(),document.getElementById("btn-tambah").addEventListener("click",()=>{window.location.href="#/tambah"})}tampilkanData(e){const n=document.getElementById("daftar-cerita"),a=e.listStory.slice(0,9);n.innerHTML=a.map(r=>`
          <button class="cerita-item" data-id="${r.id}">
            <img src="${r.photoUrl}" alt="Gambar Cerita" />
            <h3>${r.name}</h3>
            <p>${r.description}</p>
          </button>
        `).join(""),document.querySelectorAll(".cerita-item").forEach(r=>{r.addEventListener("click",()=>{const u=r.getAttribute("data-id");if(!document.startViewTransition){window.location.href=`#/detail/${u}`;return}document.startViewTransition(()=>{window.location.href=`#/detail/${u}`})})});const i=document.getElementById("map");i._leaflet_id&&(i._leaflet_id=null,i.innerHTML="");const o=L.map("map").setView([-6.2,106.816666],5);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(o),a.forEach(r=>{r.lat&&r.lon&&L.marker([r.lat,r.lon]).addTo(o).bindPopup(`<strong>${r.name}</strong><br>${r.description}`)})}}C=new WeakMap;class Ae{async render(){return this.generateContent()}generateContent(){return`
      <section class="about-page-custom">
        <div class="about-container">
          <h2 class="about-title">Tentang Pengembang</h2>
          <p><strong>Nama:</strong> Rivka Novi Cahyati</p>
          <p><strong>NIM:</strong> FC613D5X0908</p>
          <p><strong>Kelas:</strong> FC-13</p>
          <p>
            Saya adalah mahasiswa Universitas Mercu Buana Yogyakarta yang tengah mengikuti program belajar dari Dicoding. 
            Proyek ini dibuat sebagai bagian dari pengembangan kemampuan di bidang front-end development, dengan harapan 
            dapat memberikan pengalaman belajar yang nyata dan bermanfaat.
          </p>
        </div>
      </section>
    `}async afterRender(){var e;(e=document.querySelector(".about-container"))==null||e.classList.add("fade-slide")}}var A,N,j;class Ne{constructor(e,{model:n,view:a}){d(this,A);d(this,N);d(this,j);l(this,A,e),l(this,N,n),l(this,j,a)}async getDataDetail(){try{const e=await s(this,N).ambilCeritaBerdasarkanId(s(this,A));s(this,j).renderDetail(e)}catch(e){throw e}}}A=new WeakMap,N=new WeakMap,j=new WeakMap;var R;class je{constructor(){d(this,R)}async render(){return`
    <style>
      .detail-section {
        max-width: 800px;
        margin: 2rem auto;
        font-family: Arial, sans-serif;
        padding: 1rem;
      }
      #detail-container {
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        padding: 1.5rem;
      }
      .btn-back {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        margin-bottom: 1rem;
      }
      .btn-back:hover {
        background: #0056b3;
      }
      .loading-text {
        font-style: italic;
        color: #666;
      }
      .error-text {
        color: red;
      }
      .detail-title {
        margin-top: 0;
        color: #222;
      }
      .detail-description {
        line-height: 1.5;
        color: #444;
      }
      .detail-image {
        max-width: 100%;
        border-radius: 6px;
        margin: 1rem 0;
      }
      .detail-id {
        font-size: 0.8rem;
        color: #888;
      }
      #map-container {
        margin-top: 1rem;
        border-radius: 6px;
        overflow: hidden;
      }
    </style>

    <section class="detail-section">
      <div id="detail-container">
        <div id="loading-indicator"></div>

        <button id="back-button" class="btn-back">← Kembali</button>

        <div id="detail-content"></div>

        <div id="map-container" style="height: 400px;"></div>
      </div>
    </section>
  `}showLoading(){const e=document.getElementById("loading-indicator");e&&(e.innerHTML='<p class="loading-text">Memuat data...</p>')}hideLoading(){const e=document.getElementById("loading-indicator");e&&(e.innerHTML="")}getIdFromHash(){const n=(location.hash||"").slice(1).split("/");return n.length>=3&&n[1]==="detail"?n[2]:null}async afterRender(){document.getElementById("back-button").addEventListener("click",()=>{document.startViewTransition?document.startViewTransition(()=>{window.location.hash="#/"}):window.location.hash="#/"});const n=this.getIdFromHash();l(this,R,new Ne(n,{model:E,view:this})),this.showLoading();try{await s(this,R).getDataDetail()}catch(a){console.error("Gagal mengambil detail:",a);const i=document.getElementById("detail-content");i.innerHTML='<p class="error-text">Tidak dapat memuat data detail.</p>'}finally{this.hideLoading()}}renderDetail(e){const n=document.getElementById("detail-content");if(!n)return;n.innerHTML=`
      <h2 class="detail-title">${e.story.name}</h2>
      <p class="detail-description">${e.story.description}</p>
      <img class="detail-image" src="${e.story.photoUrl}" alt="Gambar ${e.story.name}" />
    `;const a=e.story.lat,i=e.story.lon;if(a&&i){const o=document.getElementById("map-container");o.innerHTML="";const r=L.map("map-container").setView([a,i],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(r),L.marker([a,i]).addTo(r).bindPopup(`<strong>${e.story.name}</strong><br>Lokasi: ${a.toFixed(5)}, ${i.toFixed(5)}`).openPopup()}}}R=new WeakMap;var O;class Re{constructor({model:e}){d(this,O);l(this,O,e)}async kirimData(e){try{const n=await s(this,O).kirimCeritaBaru(e);alert("Data berhasil ditambahkan!"),console.log("Respon server:",n)}catch(n){alert("Gagal menambahkan data: "+n.message),console.error("Error saat submit:",n)}}}O=new WeakMap;class Oe{async render(){return`
    <style>
      .auth-section {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 2rem;
      }

      .auth-wrapper {
        width: 100%;
        max-width: 600px;
        background: #fff0f6;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      .auth-wrapper h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #7e2553;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      label {
        font-weight: bold;
        color: #5a2a57;
        margin-top: 0.5rem;
      }

      textarea {
        resize: vertical;
        min-height: 100px;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
      }

      input[type="file"] {
        border: none;
      }

      button {
        background-color: #7e2553;
        color: white;
        padding: 10px 16px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button:hover {
        background-color: #5a2a57;
      }

      video, canvas {
        width: 100%;
        border-radius: 8px;
      }

      #map {
        border-radius: 8px;
      }

      #location-coordinates {
        text-align: center;
        color: #444;
        font-size: 0.95rem;
        margin-bottom: 1rem;
      }

      @media screen and (max-width: 600px) {
        .auth-wrapper {
          padding: 1rem;
        }
      }
    </style>

    <section class="auth-section">
      <div class="auth-wrapper">
        <h1>Form Tambah Data</h1>
        <form id="form-tambah">
          <label for="description">Deskripsi:</label>
          <textarea id="description" placeholder="Tulis deskripsi..." required></textarea>

          <button type="button" id="btn-kamera">Gunakan Kamera</button>
          <video id="video-stream" autoplay style="display: none; margin-top: 1rem;"></video>
          <button type="button" id="btn-capture" style="display: none;">Ambil Gambar</button>
          <canvas id="snapshot-canvas" style="display: none;"></canvas>

          <label for="image-upload">Atau unggah gambar dari perangkat:</label>
          <input type="file" id="image-upload" accept="image/*" />

          <p style="font-size: 0.9rem; color: gray;">Pilih salah satu metode: kamera atau upload</p>

          <label for="map">Tentukan Lokasi:</label>
          <div id="map" style="height: 300px;"></div>
          <p id="location-coordinates">Klik pada peta untuk memilih lokasi</p>

          <button type="submit">Simpan Data</button>
        </form>
      </div>
    </section>
  `}async afterRender(){const e=document.getElementById("video-stream"),n=document.getElementById("snapshot-canvas"),a=n.getContext("2d"),i=document.getElementById("btn-kamera"),o=document.getElementById("btn-capture"),r=document.getElementById("image-upload");let u=null,c=null;const m=async()=>{try{u=await navigator.mediaDevices.getUserMedia({video:!0}),e.srcObject=u,e.style.display="block",o.style.display="inline-block",i.textContent="Matikan Kamera"}catch(g){alert("Tidak bisa mengakses kamera: "+g.message)}},G=()=>{u&&(u.getTracks().forEach(g=>g.stop()),u=null),e.style.display="none",o.style.display="none",i.textContent="Gunakan Kamera",c=null};i.addEventListener("click",()=>{e.style.display==="none"?m():G()}),o.addEventListener("click",async()=>{if(!u){alert("Kamera belum diaktifkan!");return}n.width=e.videoWidth,n.height=e.videoHeight,a.drawImage(e,0,0,n.width,n.height),c=await new Promise(g=>{n.toBlob(g,"image/jpeg")}),alert("Gambar berhasil diambil.")});const F=L.map("map").setView([-7.797068,110.370529],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"}).addTo(F);let V=null,W=null,q=null;const he=document.getElementById("location-coordinates");F.on("click",g=>{const{lat:x,lng:h}=g.latlng;V=x,W=h,q&&F.removeLayer(q),q=L.marker([x,h]).addTo(F),he.textContent=`Lat: ${x.toFixed(6)}, Lng: ${h.toFixed(6)}`}),document.getElementById("form-tambah").addEventListener("submit",async g=>{g.preventDefault();const x=document.getElementById("description").value.trim();if(!x){alert("Deskripsi tidak boleh kosong!");return}if(V===null||W===null){alert("Tentukan lokasi terlebih dahulu pada peta.");return}let h=null;if(e.style.display==="block"&&c?h=c:r.files.length>0&&(h=r.files[0]),!h){alert("Harap unggah atau ambil gambar terlebih dahulu.");return}const B=new FormData;B.append("description",x),B.append("photo",h,"image.jpg"),B.append("lat",V),B.append("lon",W),await new Re({model:E}).kirimData(B),G(),window.location.href="/"}),window.addEventListener("popstate",G),window.addEventListener("hashchange",G)}}var $,U;class $e{constructor({model:e,view:n}){d(this,$);d(this,U);l(this,$,e),l(this,U,n)}async processLogin(e){try{s(this,U).showLoading();const n=await s(this,$).loginPengguna(e);sessionStorage.setItem("token",n.loginResult.token),window.location.href="#/",window.location.reload()}catch{alert("Failed login: Incorrect Email or Password"),window.location.reload()}}}$=new WeakMap,U=new WeakMap;class Ue{async render(){return`
      <section class="login-section flex justify-center items-center min-h-screen bg-gray-100">
        <div class="login-wrapper bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <div id="loading-indicator" class="mb-4 text-center text-blue-500"></div>

          <h1 class="text-2xl font-semibold text-center mb-6">Masuk ke Akun Anda</h1>

          <form id="login-form" class="space-y-4">
            <div>
              <label for="user-email" class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                id="user-email" 
                placeholder="Masukkan email" 
                required 
                class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label for="user-password" class="block text-sm font-medium text-gray-700">Kata Sandi</label>
              <input 
                type="password" 
                id="user-password" 
                placeholder="Masukkan kata sandi" 
                required 
                class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <button 
              type="submit"
              class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
            >
              Masuk
            </button>
          </form>

          <p class="mt-4 text-center text-sm text-gray-600">
            Belum punya akun? <a href="#/register" class="text-blue-600 hover:underline">Daftar</a>
          </p>
        </div>
      </section>
    `}showLoading(){const e=document.getElementById("loading-indicator");e.innerHTML=""}hideLoading(){const e=document.getElementById("loading-indicator");e.innerHTML=""}async afterRender(){if(sessionStorage.getItem("token")){document.startViewTransition(()=>{window.location.href="#/"});return}document.getElementById("login-form").addEventListener("submit",async a=>{a.preventDefault();const i=document.getElementById("user-email").value.trim(),o=document.getElementById("user-password").value.trim();if(!i||!o){alert("Mohon isi email dan kata sandi.");return}await new $e({model:E,view:this}).processLogin({email:i,password:o})})}}var H,I;class He{constructor({model:e,view:n}){d(this,H);d(this,I);l(this,H,e),l(this,I,n)}async processSignUp(e){try{s(this,I).showLoading();const n=await s(this,H).daftarPenggunaBaru(e);alert("Registration successful! Please login."),window.location.href="#/login"}catch(n){console.error("Failed to register:",n.message),alert("Registration failed. the email you entered is already registered")}finally{s(this,I).hideLoading()}}}H=new WeakMap,I=new WeakMap;class Ge{async render(){return`
      <section class="registration-section">
        <div class="register-wrapper">
          <div id="spinner-container"></div>
          <h1>Daftar Akun</h1>
          <br />
          <form id="register-form">
            <label for="full-name">Nama Lengkap:</label>
            <input type="text" id="full-name" placeholder="Nama lengkap" required />

            <label for="reg-email">Email:</label>
            <input type="email" id="reg-email" placeholder="Alamat email" required />

            <label for="reg-password">Kata Sandi:</label>
            <input type="password" id="reg-password" placeholder="Kata sandi" required />

            <button type="submit">Daftar</button>
          </form>

          <p>Sudah punya akun? <a href="#/login">Masuk</a></p>
        </div>
      </section>
    `}showLoading(){const e=document.getElementById("spinner-container");e.innerHTML=""}hideLoading(){const e=document.getElementById("spinner-container");e.innerHTML=""}async afterRender(){document.getElementById("register-form").addEventListener("submit",async n=>{n.preventDefault();const a=document.getElementById("full-name").value.trim(),i=document.getElementById("reg-email").value.trim(),o=document.getElementById("reg-password").value.trim();if(!a||!i||!o){alert("Semua kolom wajib diisi!");return}await new He({model:E,view:this}).processSignUp({name:a,email:i,password:o})})}}const Fe={"/":new Ce,"/about":new Ae,"/detail/:id":new je,"/tambah":new Oe,"/login":new Ue,"/register":new Ge};function _e(){return`
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `}function Ke(){return`
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `}function ze(){return"serviceWorker"in navigator}async function Ve(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(t=>console.log("Service Worker registered",t)).catch(t=>console.error("Service Worker registration failed",t))})}function We(){return"Notification"in window}function qe(){return Notification.permission==="granted"}async function Je(){if(!We())return console.warn("Browser tidak mendukung Notification API."),!1;if(qe())return!0;const t=await Notification.requestPermission();return t==="denied"?(alert("Izin notifikasi ditolak oleh pengguna."),!1):t==="default"?(alert("Permintaan notifikasi ditutup atau diabaikan."),!1):!0}async function me(){const t=await navigator.serviceWorker.getRegistration();return(t==null?void 0:t.pushManager.getSubscription())??null}async function ge(){return await me()!==null}function Ye(){return{userVisibleOnly:!0,applicationServerKey:tt(fe)}}async function Qe(){if(!await Je())return;if(await ge()){alert("Push notification sudah diaktifkan sebelumnya.");return}console.log("Memulai proses aktivasi push notification...");let n;try{n=await(await navigator.serviceWorker.getRegistration()).pushManager.subscribe(Ye());const{endpoint:i,keys:o}=n.toJSON(),r=await be({endpoint:i,keys:o});if(!r.ok){console.error("Gagal menyimpan langganan ke server:",r),alert("Gagal mengaktifkan notifikasi."),await n.unsubscribe();return}alert("Push notification berhasil diaktifkan.")}catch(a){console.error("Terjadi kesalahan saat langganan:",a),alert("Tidak dapat mengaktifkan push notification."),n&&await n.unsubscribe()}}async function Xe(){try{const t=await me();if(!t){alert("Belum ada langganan push notification yang aktif.");return}const{endpoint:e}=t.toJSON(),n=await ye({endpoint:e});if(!n.ok){console.error("Gagal menghapus langganan dari server:",n),alert("Gagal menonaktifkan notifikasi.");return}if(!await t.unsubscribe()){alert("Gagal berhenti langganan dari browser.");const{keys:i}=t.toJSON();await subscribePushNotification({endpoint:e,keys:i});return}alert("Push notification berhasil dinonaktifkan.")}catch(t){console.error("Kesalahan saat menonaktifkan push notification:",t),alert("Terjadi kesalahan saat menonaktifkan notifikasi.")}}var k,S,p,b,pe,K;class Ze{constructor({content:e,drawerButton:n,navigationDrawer:a}){d(this,b);d(this,k);d(this,S);d(this,p);l(this,k,e),l(this,S,n),l(this,p,a),T(this,b,pe).call(this)}async renderPage(){let e=location.hash.slice(1)||"/";e.startsWith("/detail/")&&(e="/detail/:id");const n=sessionStorage.getItem("token");if(!n&&!["/login","/register","/about"].includes(e)){window.location.hash="#/login";return}if(n&&(e==="/login"||e==="/register")){window.location.hash="#/";return}const i=Fe[e];if(!i){s(this,k).innerHTML='<h2 style="text-align:center;">404 - Halaman tidak ditemukan</h2>';return}try{s(this,k).innerHTML=await i.render(),typeof i.afterRender=="function"&&await i.afterRender()}catch(o){console.error("Error saat memuat halaman:",o),s(this,k).innerHTML="<p>Maaf, terjadi kesalahan saat memuat halaman.</p>"}ze()&&T(this,b,K).call(this)}}k=new WeakMap,S=new WeakMap,p=new WeakMap,b=new WeakSet,pe=function(){s(this,S).addEventListener("click",()=>{s(this,p).classList.toggle("open")}),document.body.addEventListener("click",e=>{const n=s(this,p).contains(e.target),a=s(this,S).contains(e.target);!n&&!a&&s(this,p).classList.remove("open"),s(this,p).querySelectorAll("a").forEach(i=>{i.contains(e.target)&&s(this,p).classList.remove("open")})})},K=async function(){const e=document.getElementById("push-notification-tools");if(await ge()){e.innerHTML=Ke(),document.getElementById("unsubscribe-button").addEventListener("click",()=>{Xe().finally(()=>{T(this,b,K).call(this)})});return}e.innerHTML=_e(),document.getElementById("subscribe-button").addEventListener("click",()=>{Qe().finally(()=>{T(this,b,K).call(this)})})};const{saveStory:ot,getAllStories:st,deleteStory:ct}=ue;document.addEventListener("DOMContentLoaded",async()=>{const t=new Ze({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await Ve(),await et(),await t.renderPage(),window.addEventListener("hashchange",async()=>{await t.renderPage()})});async function et(){if(Notification.permission!=="granted"){const t=await Notification.requestPermission();console.log(t==="granted"?"Notifikasi diizinkan":"Notifikasi ditolak")}else console.log("Notifikasi sudah diizinkan")}function tt(t){const e="=".repeat((4-t.length%4)%4),n=(t+e).replace(/-/g,"+").replace(/_/g,"/"),a=window.atob(n);return Uint8Array.from([...a].map(i=>i.charCodeAt(0)))}

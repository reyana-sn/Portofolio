// ===== ISI DATAMU DI SINI (berlaku di semua halaman) =====
const profil = {
  nama: "M. A. Dzakii Ikhsan S.",
  inisial: "MADIS",
  peran: "Bachelor of Mechanical Engineering<br>Universitas Sebelas Maret",
  foto: "pp.jpeg",
  email: "ikhsan090607@gmail.com",
  linkedin: "https://www.linkedin.com/in/muhammad-alif-dzakii-ikhsan-sofyan-847679420/",
  instagram: "https://instagram.com/reyana.sn",
  github: "https://github.com/reyana-sn",
  cv: "cv.pdf"
};

// Link Google Form dan link CSV dari Google Sheets (tempel di antara tanda kutip)
const ulasanCfg = {
  form: "",
  csv: ""
};

const menu = [
  ["index.html", "Beranda"],
  ["pengalaman.html", "Pengalaman"],
  ["lomba.html", "Lomba dan prestasi"],
  ["program.html", "Program dan training"],
  ["seminar.html", "Seminar dan sertifikat"],
  ["proyek.html", "Proyek"],
  ["galeri.html", "Galeri"]
];

// ===== BAGIAN DI BAWAH INI TIDAK PERLU DIUBAH =====
const halaman = location.pathname.split("/").pop() || "index.html";

const menuHtml = menu
  .map(([url, teks]) => `<a href="${url}"${url === halaman ? ' aria-current="page"' : ""}>${teks}</a>`)
  .join("");

document.getElementById("side").innerHTML = `
  <div class="portrait">
    <div class="frame">
      <img src="${profil.foto}" alt="Foto ${profil.nama}" onerror="this.style.display='none'">
    </div>
  </div>
  <div class="name"><a href="index.html">${profil.nama}</a></div>
  <p class="role">${profil.peran}</p>
  <nav class="menu" aria-label="Menu halaman">${menuHtml}</nav>
  <ul class="links">
    <li><a href="mailto:${profil.email}">${profil.email}</a></li>
    <li><a href="${profil.linkedin}">LinkedIn</a></li>
    <li><a href="${profil.instagram}">Instagram</a></li>
    <li><a href="${profil.github}">GitHub</a></li>
    <li><a href="${profil.cv}" download>Unduh CV</a></li>
  </ul>`;

// Banner lebar di atas halaman (seperti banner channel YouTube)
document.querySelector(".shell").insertAdjacentHTML("beforebegin", `
  <div class="banner">
    <div class="frame">
      <img src="banner.jpg" alt="" onerror="this.style.display='none'">
    </div>
  </div>`);

// Ikon kecil di tab browser (kotak oranye berisi inisial)
const ikon = document.createElement("link");
ikon.rel = "icon";
ikon.href = "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='#f25c05'/><text x='32' y='43' font-size='30' font-weight='700' text-anchor='middle' fill='white' font-family='sans-serif'>${profil.inisial}</text></svg>`
);
document.head.appendChild(ikon);

// Judul tab: "Pengalaman - Nama Kamu"
const judul = document.body.dataset.judul;
if (judul) document.title = judul + " - " + profil.nama;

// ===== ALBUM FOTO: foto depan + "+N", klik untuk lihat semua =====
const viewer = document.createElement("div");
viewer.className = "viewer";
viewer.hidden = true;
viewer.innerHTML = `
  <div class="viewer-bar">
    <strong class="viewer-title"></strong>
    <span class="viewer-count"></span>
    <button type="button" class="viewer-back" hidden>Semua foto</button>
    <button type="button" class="viewer-close">Tutup</button>
  </div>
  <div class="viewer-grid"></div>
  <div class="viewer-single" hidden>
    <button type="button" class="viewer-prev" aria-label="Foto sebelumnya">&lsaquo;</button>
    <figure><img alt=""><figcaption></figcaption></figure>
    <button type="button" class="viewer-next" aria-label="Foto berikutnya">&rsaquo;</button>
  </div>`;
document.body.appendChild(viewer);

const q = (s) => viewer.querySelector(s);
let daftar = [], fokus = 0, pemicu = null;

function tampilGrid() {
  q(".viewer-grid").hidden = false;
  q(".viewer-single").hidden = true;
  q(".viewer-back").hidden = true;
  q(".viewer-count").textContent = daftar.length + " foto";
}

function tampilSatu(i) {
  fokus = (i + daftar.length) % daftar.length;
  const f = daftar[fokus];
  q(".viewer-single img").src = f.src;
  q(".viewer-single img").alt = f.alt;
  q("figcaption").textContent = f.alt;
  q(".viewer-grid").hidden = true;
  q(".viewer-single").hidden = false;
  q(".viewer-back").hidden = daftar.length < 2;
  q(".viewer-count").textContent = (fokus + 1) + " / " + daftar.length;
}

function bukaAlbum(foto, nama, tombolPemicu) {
  daftar = foto;
  pemicu = tombolPemicu;
  q(".viewer-title").textContent = nama;
  viewer.classList.toggle("satu", foto.length < 2);
  const grid = q(".viewer-grid");
  grid.replaceChildren();
  foto.forEach((f, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "frame viewer-thumb";
    const img = document.createElement("img");
    img.src = f.src;
    img.alt = f.alt;
    b.appendChild(img);
    b.addEventListener("click", () => tampilSatu(i));
    grid.appendChild(b);
  });
  viewer.hidden = false;
  document.body.classList.add("no-scroll");
  if (foto.length < 2) tampilSatu(0); else tampilGrid();
  q(".viewer-close").focus();
}

function tutupAlbum() {
  viewer.hidden = true;
  document.body.classList.remove("no-scroll");
  if (pemicu) pemicu.focus();
}

q(".viewer-close").addEventListener("click", tutupAlbum);
q(".viewer-back").addEventListener("click", tampilGrid);
q(".viewer-prev").addEventListener("click", () => tampilSatu(fokus - 1));
q(".viewer-next").addEventListener("click", () => tampilSatu(fokus + 1));
document.addEventListener("keydown", (e) => {
  if (viewer.hidden) return;
  const satu = !q(".viewer-single").hidden;
  if (e.key === "Escape") { if (satu && daftar.length > 1) tampilGrid(); else tutupAlbum(); }
  if (satu && e.key === "ArrowLeft") tampilSatu(fokus - 1);
  if (satu && e.key === "ArrowRight") tampilSatu(fokus + 1);
});

// Ubah setiap <div class="album"> menjadi foto depan + label "+N"
document.querySelectorAll(".album").forEach((album) => {
  const foto = [...album.querySelectorAll("img")].map((i) => ({ src: i.getAttribute("src"), alt: i.alt }));
  if (!foto.length) return;
  const namaAlbum = album.dataset.judul || "Foto";
  const sisa = foto.length - 1;

  const tombol = document.createElement("button");
  tombol.type = "button";
  tombol.className = "frame entry-photo album-cover" + (album.classList.contains("contain") ? " contain" : "");
  tombol.setAttribute("aria-label", "Lihat " + foto.length + " foto: " + namaAlbum);

  const cover = document.createElement("img");
  cover.src = foto[0].src;
  cover.alt = foto[0].alt;
  cover.onerror = () => { cover.style.display = "none"; };
  tombol.appendChild(cover);

  if (sisa > 0) {
    const label = document.createElement("span");
    label.className = "more";
    label.textContent = "+" + sisa;
    tombol.appendChild(label);
  }

  album.replaceChildren(tombol);
  tombol.addEventListener("click", () => bukaAlbum(foto, namaAlbum, tombol));
});

// ===== TESTIMONIAL DARI ORANG LAIN (Google Form + Google Sheets) =====
function parseCsv(teks) {
  const baris = [];
  let sel = "", row = [], kutip = false;
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (kutip) {
      if (c === '"' && teks[i + 1] === '"') { sel += '"'; i++; }
      else if (c === '"') kutip = false;
      else sel += c;
    } else if (c === '"') kutip = true;
    else if (c === ",") { row.push(sel); sel = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && teks[i + 1] === "\n") i++;
      row.push(sel); sel = ""; baris.push(row); row = [];
    } else sel += c;
  }
  if (sel || row.length) { row.push(sel); baris.push(row); }
  return baris;
}


const wadahUlasan = document.getElementById("ulasan-list");
if (wadahUlasan && ulasanCfg.csv) {
  fetch(ulasanCfg.csv)
    .then((r) => r.text())
    .then((teks) => {
      const [kepala, ...isi] = parseCsv(teks);
      if (!kepala) return;
      const cari = (...nama) => kepala.findIndex((h) => nama.some((n) => h.trim().toLowerCase().startsWith(n)));
      const iNama = cari("name", "nama"), iAsal = cari("from", "how", "hubungan"), iUlasan = cari("testimonial", "review", "ulasan"), iTampil = cari("show", "tampilkan");
      if (iUlasan < 0 || iTampil < 0) return;

      isi
        .filter((r) => ["yes", "ya"].includes((r[iTampil] || "").trim().toLowerCase()) && (r[iUlasan] || "").trim())
        .forEach((r) => {
          const bq = document.createElement("blockquote");
          bq.className = "quote";
          const p = document.createElement("p");
          p.textContent = '"' + r[iUlasan].trim() + '"';
          const by = document.createElement("span");
          by.className = "by";
          by.textContent = [r[iNama], r[iAsal]].filter(Boolean).join(", ");
          bq.append(p, by);
          wadahUlasan.appendChild(bq);
        });
    })
    .catch(() => {});
}

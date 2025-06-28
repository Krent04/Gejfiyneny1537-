// === BASISVARIABELEN ===
let currentSlideIndex = 0;
let slides = [];
let scoreTotaal = {};

let juryData = [];
let televoteData = {};
let currentJuryIndex = 0;

// === GOOGLE DRIVE MAPPINGS ===
const vlaggenanimatiesMp4 = {
  "Antwerpen": "https://drive.google.com/uc?export=view&id=1hh_PjkyAU68zRe_AoYTrLJnVc-42PE30",
  "Arnhem": "https://drive.google.com/uc?export=view&id=1out5QeFf23CqSCbckXrG0nqMUTdkeFa2",
  "ATKA": "https://drive.google.com/uc?export=view&id=1HJhuzDHil8XkZAXQ1KdSCwjbZCa-xyaa",
  "Brussel": "https://drive.google.com/uc?export=view&id=1_86VE2s3sKQt5wmKocJYrxAmWnQ8dVeV",
  "Den Bosch": "https://drive.google.com/uc?export=view&id=1sPxYU-2EtV78vf0fqY0jwc58fH1ghqet",
  "FILMACADEMIE": "https://drive.google.com/uc?export=view&id=160i0mSii2hIrPisFWqSfvk1tFTQH02k8",
  "Gent": "https://drive.google.com/uc?export=view&id=1EAxWbsnQRih0HxzsyOYRX_g3qaUTOdGv",
  "Leuven": "https://drive.google.com/uc?export=view&id=1XvshrRk1Zx-4YaOy2JazBUNRhGQ5AmNV",
  "Maastricht": "https://drive.google.com/uc?export=view&id=1bAuuw4YaorON50EyLlDyxfxyWFmLnHgw",
  "Rotterdam": "https://drive.google.com/uc?export=view&id=1YHKROTB8pO_8nBfm8-7cArT1BA1mfkWF",
  "Tilburg": "https://drive.google.com/uc?export=view&id=1wNMGf1jhnzWOAsNJD0DbOThPJuEBL-p6",
  "Utrecht": "https://drive.google.com/uc?export=view&id=11R-fRPiEEv0nqd4BkTvhzl1iNCIKOZ9s",
};

const vlaggenPng = {
  "Antwerpen": "https://drive.google.com/uc?export=view&id=1snegMVIluDjShELEcVu_QGPmGhwfB_hX",
  "Arnhem": "https://drive.google.com/uc?export=view&id=10B3C05rOizplqkljx6AQ_jJ9ckMdr-Lw",
  "ATKA": "https://drive.google.com/uc?export=view&id=1sBQtZf7iAYDprs-lkeKzFFtDA8tnIaPh",
  "Brussel": "https://drive.google.com/uc?export=view&id=17HFOrQ_DTv_CZryJbWIQYXhRePQij1HK",
  "Den Bosch": "https://drive.google.com/uc?export=view&id=1utownyHyAptBrfn3gAYV6AEjPQ8nBDvh",
  "FILMACADEMIE": "https://drive.google.com/uc?export=view&id=19-nupTqyTAdXxZd43vjH8hQYwx1eOSIr",
  "Gent": "https://drive.google.com/uc?export=view&id=1PnORbXM9jPlIIf64vaCx6bXx5jgdTAKe",
  "Leuven": "https://drive.google.com/uc?export=view&id=1dIrayxdFA6aDpqELF5Lhy2Qg_NgL038B",
  "Maastricht": "https://drive.google.com/uc?export=view&id=1cH72n4pYsq_cl5DUfbk9Ro9ObTJoOPrL",
  "Rotterdam": "https://drive.google.com/uc?export=view&id=1oj-gpjNO-s2J42leRW8BF7RBC5GPS1ev",
  "Tilburg": "https://drive.google.com/uc?export=view&id=1zfaDvKiAnvLmph47Pcvl_MSiGuZljVFs",
  "Utrecht": "https://drive.google.com/uc?export=view&id=1pMvdi1pdvrGLrKGwjxlycTpLA8g5ConU",
};

const backgroundPng = "https://drive.google.com/uc?export=view&id=1zPVYRYm2AI4AVLkoW4wZpMfIS2AyT0Jd";
const logoPng = "https://drive.google.com/uc?export=view&id=1SZGiqQ6yYbr8kJk0aFmOB_TzEORDlCSn";

// === SLIDES AANMAKEN ===
function setupSlidesFromData(juryData) {
  slides = [
    createStartSlide(1),
    createStartSlide(2)
  ];

  juryData.forEach((jury, idx) => {
    const jurySchool = jury.school;
    const punten = jury.punten;

    slides.push(createJuryIntroSlide(jurySchool));

    // EERST de horizontale animatieslide, DAN de verticale puntenanimatieslide
    slides.push(createAnimatieSlide1(idx + 1, juryData.length, jurySchool));
    slides.push(createPuntenAnimatieSlide(idx + 1, juryData.length, jurySchool));

    slides.push(createPuntenSlide(punten, idx));
    slides.push(createScoreboardSlide(scoreTotaal, punten));
  });
}

// --- LAAD DATA ---
fetch("punten.json")
  .then((response) => response.json())
  .then((data) => {
    juryData = data.jury;
    televoteData = data.televote;
    setupSlidesFromData(juryData);
    showSlide(0);
  });

// --- STARTSLIDE ---
function createStartSlide(number = 1) {
  const slide = document.createElement("div");
  slide.className = "slide start";

  const img = document.createElement("img");
  img.src = logoPng;
  img.alt = "Theaterscholen Songfestival Logo";
  img.style.maxWidth = "50%";
  img.style.objectFit = "contain";

  if (number === 2) {
    img.style.opacity = "0.999";
  }

  slide.appendChild(img);
  return slide;
}

// --- JURY INTRO SLIDE (MET VIDEO, ZONDER TEKST, AUTOMATISCH DOORSCHAKELEN) ---
function createJuryIntroSlide(jurySchool) {
  const slide = document.createElement("div");
  slide.className = "slide jury-intro-video";

  // Video-element toevoegen
  const video = document.createElement("video");
  video.src = vlaggenanimatiesMp4[jurySchool] || "";
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.controls = false;
  video.setAttribute("preload", "auto");

  // Zodra de video eindigt: ga automatisch naar volgende slide
  video.addEventListener("ended", () => {
    // Zoek de huidige slide-index opnieuw op, want showSlide kan async zijn
    const idx = slides.indexOf(slide);
    if (idx === currentSlideIndex) {
      advanceOrAnimate();
    }
  });

  slide.appendChild(video);

  return slide;
}

// --- Animatieslide 1: Horizontale puntenrij ---
function createAnimatieSlide1(juryNr = 1, juryTotaal = 12, juryNaam = "ATKA") {
  const slide = document.createElement("div");
  slide.className = "slide";
  // Background
  const bg = document.createElement("div");
  bg.className = "animatieslide1-bg";
  slide.appendChild(bg);

  // Puntenrij onderin
  const punten = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1];
  const puntenRij = document.createElement("div");
  puntenRij.className = "animatieslide1-puntenrij";
  punten.forEach((pt, i) => {
    const blok = document.createElement("div");
    blok.className = "animatieslide1-puntenblok" + (i === 0 ? " twaalf" : "");
    blok.textContent = pt;
    puntenRij.appendChild(blok);
  });
  bg.appendChild(puntenRij);

  // Jury info rechtsonder
  const juryInfo = document.createElement("div");
  juryInfo.className = "animatieslide1-juryinfo";
  const juryBlok1 = document.createElement("div");
  juryBlok1.className = "animatieslide1-juryblok";
  juryBlok1.textContent = `${juryNr} van ${juryTotaal}`;
  const juryBlok2 = document.createElement("div");
  juryBlok2.className = "animatieslide1-juryblok";
  juryBlok2.textContent = juryNaam;
  juryInfo.appendChild(juryBlok1);
  juryInfo.appendChild(juryBlok2);
  bg.appendChild(juryInfo);

  return slide;
}

// --- PUNTEN ANIMATIE SLIDE 2 (verticale blokken, exact als puntenslide, maar alleen punten) ---
function createPuntenAnimatieSlide(juryNr, juryTotaal, juryNaam) {
  const slide = document.createElement("div");
  slide.className = "slide";

  // Achtergrond (nu transparant, want body::before is de achtergrond)
  // container en kolommen zijn IDENTIEK aan puntenslide
  const container = document.createElement("div");
  container.className = "punten-container";

  const kolomLinks = document.createElement("div");
  kolomLinks.className = "punten-kolom";
  const kolomRechts = document.createElement("div");
  kolomRechts.className = "punten-kolom";

  // Zelfde layout: 12/10/8/7/6 links, 5/4/3/2/1 rechts
  [12, 10, 8, 7, 6].forEach((pt) => {
    const blok = document.createElement("div");
    blok.className = "punten-blok twaalf-only";
    blok.innerHTML = `<span class="punten${pt === 12 ? " twaalf" : ""}">${pt}</span>`;
    kolomLinks.appendChild(blok);
  });
  [5, 4, 3, 2, 1].forEach((pt) => {
    const blok = document.createElement("div");
    blok.className = "punten-blok twaalf-only";
    blok.innerHTML = `<span class="punten">${pt}</span>`;
    kolomRechts.appendChild(blok);
  });

  container.appendChild(kolomLinks);
  container.appendChild(kolomRechts);
  slide.appendChild(container);

  // Jury info rechtsonder
  const juryInfo = document.createElement("div");
  juryInfo.className = "puntenanimatie-juryinfo";
  const juryBlok1 = document.createElement("div");
  juryBlok1.className = "puntenanimatie-juryblok";
  juryBlok1.textContent = `${juryNr} van ${juryTotaal}`;
  const juryBlok2 = document.createElement("div");
  juryBlok2.className = "puntenanimatie-juryblok";
  juryBlok2.textContent = juryNaam;
  juryInfo.appendChild(juryBlok1);
  juryInfo.appendChild(juryBlok2);
  slide.appendChild(juryInfo);

  return slide;
}

// --- PUNTENSLIDE (jury geeft punten) ---
function createPuntenSlide(punten, juryIndex) {
  const slide = document.createElement("div");
  slide.className = "slide punten-slide";

  const container = document.createElement("div");
  container.className = "punten-container";

  const kolomLinks = document.createElement("div");
  kolomLinks.className = "punten-kolom";
  const kolomRechts = document.createElement("div");
  kolomRechts.className = "punten-kolom";

  const entries = Object.entries(punten).sort((a, b) => b[1] - a[1]);
  const leftPoints = [12, 10, 8, 7, 6];
  const rightPoints = [5, 4, 3, 2, 1];

  entries.forEach(([school, value]) => {
    const item = document.createElement("div");
    item.className = "punten-blok";

    if (value === 12) {
      item.classList.add("twaalf-only");
      item.innerHTML = `<span class='punten twaalf'>${value}</span>`;
    } else {
      item.innerHTML = `
        <span class='school'>
          <img src="${vlaggenPng[school] || ''}" class="vlag-icoon">
          ${school}
        </span>
        <span class='punten'>${value}</span>`;
    }

    if (leftPoints.includes(value)) {
      kolomLinks.appendChild(item);
    } else if (rightPoints.includes(value)) {
      kolomRechts.appendChild(item);
    }
  });

  container.appendChild(kolomLinks);
  container.appendChild(kolomRechts);
  slide.appendChild(container);

  // Jury info onderin
  const juryInfo = document.createElement("div");
  juryInfo.className = "animatieslide1-juryinfo";
  const juryBlok1 = document.createElement("div");
  juryBlok1.className = "animatieslide1-juryblok";
  juryBlok1.textContent = `${juryIndex + 1} van ${juryData.length}`;
  const juryBlok2 = document.createElement("div");
  juryBlok2.className = "animatieslide1-juryblok";
  juryBlok2.textContent = juryData[juryIndex].school;
  juryInfo.appendChild(juryBlok1);
  juryInfo.appendChild(juryBlok2);
  slide.appendChild(juryInfo);

  currentJuryIndex++;
  return slide;
}

// --- SCOREBORD SLIDE (met cyaan/paars juryblokjes rechtsonder) ---
function createScoreboardSlide(scoreTotaal, nieuwePunten) {
  const slide = document.createElement("div");
  slide.className = "slide scoreboard-slide";

  Object.entries(nieuwePunten).forEach(([school, punten]) => {
    if (!scoreTotaal[school]) scoreTotaal[school] = 0;
    scoreTotaal[school] += punten;
  });

  const allSchools = [
    "ATKA", "Antwerpen", "Arnhem", "Brussel", "Den Bosch",
    "Filmacademie", "Gent", "Leuven", "Maastricht",
    "Rotterdam", "Tilburg", "Utrecht"
  ];

  const sorted = allSchools.map((school) => {
    const totaal = scoreTotaal[school] || 0;
    const nieuw = nieuwePunten[school] || 0;
    return { school, totaal, nieuw };
  }).sort((a, b) => b.totaal - a.totaal)
    .map((entry, i) => ({ ...entry, positie: i + 1 }));

  const container = document.createElement("div");
  container.className = "scoreboard-container";

  const kolom1 = document.createElement("div");
  kolom1.className = "score-kolom";
  const kolom2 = document.createElement("div");
  kolom2.className = "score-kolom";

  sorted.forEach((entry, i) => {
    const box = document.createElement("div");
    box.className = "score-box";
    box.innerHTML = `
      <div class="positie">${entry.positie.toString().padStart(2, '0')}</div>
      <div class="schoolblok">
        <span class="schoolnaam">
          <img src="${vlaggenPng[entry.school] || ''}" class="vlag-icoon">
          ${entry.school}
        </span>
        ${entry.nieuw > 0 ? `<span class="puntennieuw ${entry.nieuw === 12 ? 'twaalf' : ''}">${entry.nieuw}</span>` : ''}
        <span class="puntentotaal">${entry.totaal}</span>
      </div>`;

    if (i < 6) {
      kolom1.appendChild(box);
    } else {
      kolom2.appendChild(box);
    }
  });

  container.appendChild(kolom1);
  container.appendChild(kolom2);
  slide.appendChild(container);

  // Jury info onderin (altijd cyaan met paars)
  const juryInfoBlokken = document.createElement("div");
  juryInfoBlokken.className = "animatieslide1-juryinfo";
  // Voeg .twaalf class toe aan beide blokken voor de juiste styling!
  const blokLinks = document.createElement("div");
  blokLinks.className = "animatieslide1-juryblok twaalf";
  blokLinks.textContent = "12 punten";
  const ontvanger = Object.entries(nieuwePunten).find(([, p]) => p === 12)?.[0] || "?";
  const blokRechts = document.createElement("div");
  blokRechts.className = "animatieslide1-juryblok twaalf";
  blokRechts.textContent = ontvanger;
  juryInfoBlokken.appendChild(blokLinks);
  juryInfoBlokken.appendChild(blokRechts);
  slide.appendChild(juryInfoBlokken);

  return slide;
}

// --- SLIDESHOW FUNCTIES (NU MET FADE-IN) ---
function showSlide(index) {
  const slideshow = document.getElementById("slideshow");
  slideshow.innerHTML = "";
  if (slides[index]) {
    // fade-in effect toevoegen
    slides[index].classList.add("fade-in");
    slideshow.appendChild(slides[index]);
    // Verwijder de fade-in class na de animatie, zodat hij opnieuw kan werken bij volgende keer
    setTimeout(() => {
      slides[index].classList.remove("fade-in");
    }, 1000);
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowRight") {
    if (!document.fullscreenElement && document.body.requestFullscreen) {
      document.body.requestFullscreen().then(() => {
        advanceOrAnimate();
      });
    } else {
      advanceOrAnimate();
    }
  }
});
function advanceOrAnimate() {
  currentSlideIndex++;
  if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
  showSlide(currentSlideIndex);
}

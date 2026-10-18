import "server-only";
import type { Locale } from "./config";

// Interface text for the public site. The editor stays in English.
const en = {
  meta: { title: "Axel Püss — developer", description: "A developer in Estonia. Websites, tools, game experiments, and notes along the way.", projects: "Projects", writing: "Writing", uses: "Uses", projectNotFound: "Project not found", postNotFound: "Post not found" },
  nav: { home: "Axel, home", main: "Main navigation", work: "Work", writing: "Writing", uses: "Tools", language: "Language" },
  theme: { toLight: "Switch to light theme", toDark: "Switch to dark theme", change: "Change colour theme" },
  shell: { skip: "Skip to content", call: "I read every message. {em}", callEm: "Say hi.", callNote: "Whether it’s about work, a project, or something I’ve built.", localTime: "{location}, {time}", timeLabel: "Local time", colophon: "Next.js, Supabase & Cloudflare.", editor: "Editor" },
  home: { greeting: "Hi, I’m {name}", seeWork: "See what I’ve made", getInTouch: "Get in touch", madeTitle: "Things I’ve made", allProjects: "All projects", smallerOne: "+ 1 smaller thing", smallerOther: "+ {count} smaller things", smallerNote: "One-day builds, experiments, and things I made to learn something", writingTitle: "From the notebook", allWriting: "All writing", toolsTitle: "What I build with", fullList: "The full list", aboutTitle: "Away from the screen" },
  projects: {
    title: "Things I’ve made", intro: "The bigger projects first. Further down are the smaller ones: one-day builds, experiments, and things I made just to learn something.",
    smallerTitle: "Smaller things", empty: "There are no published projects yet.", readMore: "Read more", onSteam: "On Steam", watch: "Watch it", visit: "Visit", source: "Source",
    builtWith: "Built with", back: "Projects", status: "Status", whatItIs: "What it is", when: "When", links: "Links", steam: "Steam", video: "Video",
    learned: "What I learned", next: "Next project", placeholderArt: "A contour map standing in for a {title} screenshot",
    statuses: { active: "In progress", experiment: "Experiment", archived: "Wrapped up" },
  },
  gallery: { viewFull: "View full size: {alt}", more: "More screenshots", viewer: "Screenshot viewer", previous: "Previous screenshot", next: "Next screenshot", close: "Close" },
  blog: { title: "The notebook", intro: "Things I’m working on, figuring out, or just want to remember.", pages: "Blog pages", newer: "← Newer", older: "Older →", back: "All writing", empty: "Nothing published here yet. More soon.", draft: "Draft", readingTime: "{n} min read" },
  uses: { title: "Things I use", intro: "The tools and applications that find their way into my work.", empty: "A list is taking shape." },
  contact: {
    message: "Message", placeholder: "Write me something…", email: "Your email", send: "Send", sending: "Sending…", thanks: "Thanks, I’ll get back to you soon.",
    needEmail: "Add an email address so I can reply.", needMessage: "Write a message first.", tooLong: "Keep it under 5000 characters.", checkForm: "Check the form and try again.",
    rateLimited: "That’s a few messages in a row. Try again in a little while.", demo: "The form isn’t connected to a database in demo mode.", failed: "Something went wrong on my side. Please try again.",
  },
  loading: "Loading page",
  notFound: { title: "Nothing here, for now.", text: "That page may have moved or hasn’t been published yet.", back: "Back to Axel’s site" },
};
export type Dictionary = typeof en;

const et: Dictionary = {
  meta: { title: "Axel Püss — arendaja", description: "Arendaja Eestist. Veebilehed, tööriistad, mängukatsetused ja märkmed teel olles.", projects: "Projektid", writing: "Kirjutised", uses: "Tööriistad", projectNotFound: "Projekti ei leitud", postNotFound: "Postitust ei leitud" },
  nav: { home: "Axel, avaleht", main: "Peamenüü", work: "Tööd", writing: "Kirjutised", uses: "Tööriistad", language: "Keel" },
  theme: { toLight: "Lülitu heledale teemale", toDark: "Lülitu tumedale teemale", change: "Muuda värviteemat" },
  shell: { skip: "Liigu sisu juurde", call: "Loen iga sõnumit. {em}", callEm: "Kirjuta julgelt.", callNote: "Olgu see töö, mõne projekti või minu tehtud asjade kohta.", localTime: "{location}, kell {time}", timeLabel: "Kohalik aeg", colophon: "Next.js, Supabase & Cloudflare.", editor: "Toimetaja" },
  home: { greeting: "Tere, mina olen {name}", seeWork: "Vaata, mida olen teinud", getInTouch: "Võta ühendust", madeTitle: "Asjad, mida olen teinud", allProjects: "Kõik projektid", smallerOne: "+ 1 väiksem asi", smallerOther: "+ {count} väiksemat asja", smallerNote: "Ühe päevaga valminud asjad, katsetused ja asjad, mille tegin millegi õppimiseks", writingTitle: "Märkmikust", allWriting: "Kõik kirjutised", toolsTitle: "Millega ma ehitan", fullList: "Terve nimekiri", aboutTitle: "Ekraanist eemal" },
  projects: {
    title: "Asjad, mida olen teinud", intro: "Kõigepealt suuremad projektid. Allpool on väiksemad: ühe päevaga valminud asjad, katsetused ja asjad, mille tegin lihtsalt millegi õppimiseks.",
    smallerTitle: "Väiksemad asjad", empty: "Avaldatud projekte veel pole.", readMore: "Loe edasi", onSteam: "Steamis", watch: "Vaata", visit: "Külasta", source: "Lähtekood",
    builtWith: "Tehtud kasutades", back: "Projektid", status: "Staatus", whatItIs: "Mis see on", when: "Millal", links: "Lingid", steam: "Steam", video: "Video",
    learned: "Mida ma õppisin", next: "Järgmine projekt", placeholderArt: "Kontuurkaart projekti {title} ekraanipildi asemel",
    statuses: { active: "Töös", experiment: "Katsetus", archived: "Lõpetatud" },
  },
  gallery: { viewFull: "Vaata täissuuruses: {alt}", more: "Veel ekraanipilte", viewer: "Ekraanipiltide vaatur", previous: "Eelmine ekraanipilt", next: "Järgmine ekraanipilt", close: "Sulge" },
  blog: { title: "Märkmik", intro: "Asjad, millega tegelen, mida välja nuputan või mida tahan lihtsalt meeles pidada.", pages: "Kirjutiste lehed", newer: "← Uuemad", older: "Vanemad →", back: "Kõik kirjutised", empty: "Siin pole veel midagi avaldatud. Varsti tuleb.", draft: "Mustand", readingTime: "{n} min lugemist" },
  uses: { title: "Asjad, mida kasutan", intro: "Tööriistad ja rakendused, mis minu töös kasutust leiavad.", empty: "Nimekiri alles tekib." },
  contact: {
    message: "Sõnum", placeholder: "Kirjuta mulle midagi…", email: "Sinu e-post", send: "Saada", sending: "Saadan…", thanks: "Aitäh, vastan sulle varsti.",
    needEmail: "Lisa e-posti aadress, et saaksin vastata.", needMessage: "Kirjuta enne sõnum.", tooLong: "Hoia see alla 5000 tähemärgi.", checkForm: "Kontrolli vormi ja proovi uuesti.",
    rateLimited: "Päris mitu sõnumit järjest. Proovi natukese aja pärast uuesti.", demo: "Demorežiimis pole vorm andmebaasiga ühendatud.", failed: "Minu poolel läks midagi valesti. Palun proovi uuesti.",
  },
  loading: "Lehte laaditakse",
  notFound: { title: "Siin pole hetkel midagi.", text: "See leht võib olla liikunud või pole seda veel avaldatud.", back: "Tagasi Axeli lehele" },
};

const de: Dictionary = {
  meta: { title: "Axel Püss — Entwickler", description: "Ein Entwickler aus Estland. Websites, Tools, Spiele-Experimente und Notizen unterwegs.", projects: "Projekte", writing: "Notizen", uses: "Werkzeuge", projectNotFound: "Projekt nicht gefunden", postNotFound: "Beitrag nicht gefunden" },
  nav: { home: "Axel, Startseite", main: "Hauptnavigation", work: "Arbeiten", writing: "Notizen", uses: "Werkzeuge", language: "Sprache" },
  theme: { toLight: "Zum hellen Design wechseln", toDark: "Zum dunklen Design wechseln", change: "Farbschema ändern" },
  shell: { skip: "Zum Inhalt springen", call: "Ich lese jede Nachricht. {em}", callEm: "Schreib einfach.", callNote: "Ob es um Arbeit geht, um ein Projekt oder um etwas, das ich gebaut habe.", localTime: "{location}, {time} Uhr", timeLabel: "Ortszeit", colophon: "Next.js, Supabase & Cloudflare.", editor: "Editor" },
  home: { greeting: "Hi, ich bin {name}", seeWork: "Sieh dir an, was ich gemacht habe", getInTouch: "Schreib mir", madeTitle: "Was ich gemacht habe", allProjects: "Alle Projekte", smallerOne: "+ 1 kleineres Projekt", smallerOther: "+ {count} kleinere Projekte", smallerNote: "An einem Tag Gebautes, Experimente und Dinge, die ich zum Lernen gemacht habe", writingTitle: "Aus dem Notizbuch", allWriting: "Alle Notizen", toolsTitle: "Womit ich baue", fullList: "Die ganze Liste", aboutTitle: "Abseits vom Bildschirm" },
  projects: {
    title: "Was ich gemacht habe", intro: "Zuerst die größeren Projekte. Weiter unten kommen die kleineren: an einem Tag Gebautes, Experimente und Dinge, die ich nur zum Lernen gemacht habe.",
    smallerTitle: "Kleinere Projekte", empty: "Noch keine veröffentlichten Projekte.", readMore: "Weiterlesen", onSteam: "Auf Steam", watch: "Ansehen", visit: "Besuchen", source: "Quellcode",
    builtWith: "Gebaut mit", back: "Projekte", status: "Status", whatItIs: "Was es ist", when: "Wann", links: "Links", steam: "Steam", video: "Video",
    learned: "Was ich gelernt habe", next: "Nächstes Projekt", placeholderArt: "Eine Höhenlinienkarte anstelle eines Screenshots von {title}",
    statuses: { active: "In Arbeit", experiment: "Experiment", archived: "Abgeschlossen" },
  },
  gallery: { viewFull: "In voller Größe ansehen: {alt}", more: "Weitere Screenshots", viewer: "Screenshot-Ansicht", previous: "Vorheriger Screenshot", next: "Nächster Screenshot", close: "Schließen" },
  blog: { title: "Das Notizbuch", intro: "Woran ich arbeite, was ich herausfinde oder einfach nicht vergessen will.", pages: "Seiten", newer: "← Neuere", older: "Ältere →", back: "Alle Notizen", empty: "Hier ist noch nichts veröffentlicht. Bald mehr.", draft: "Entwurf", readingTime: "{n} Min. Lesezeit" },
  uses: { title: "Was ich benutze", intro: "Die Tools und Apps, die in meiner Arbeit landen.", empty: "Die Liste entsteht gerade." },
  contact: {
    message: "Nachricht", placeholder: "Schreib mir etwas…", email: "Deine E-Mail", send: "Senden", sending: "Wird gesendet…", thanks: "Danke, ich melde mich bald.",
    needEmail: "Gib eine E-Mail-Adresse an, damit ich antworten kann.", needMessage: "Schreib zuerst eine Nachricht.", tooLong: "Bitte unter 5000 Zeichen bleiben.", checkForm: "Prüf das Formular und versuch es noch einmal.",
    rateLimited: "Das waren ein paar Nachrichten hintereinander. Versuch es gleich noch einmal.", demo: "Im Demo-Modus ist das Formular nicht mit einer Datenbank verbunden.", failed: "Auf meiner Seite ist etwas schiefgelaufen. Bitte versuch es noch einmal.",
  },
  loading: "Seite wird geladen",
  notFound: { title: "Hier ist gerade nichts.", text: "Die Seite wurde vielleicht verschoben oder ist noch nicht veröffentlicht.", back: "Zurück zu Axels Seite" },
};

export const dictionaries: Record<Locale, Dictionary> = { en, et, de };

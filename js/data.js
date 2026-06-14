/**
 * EVENTS — the master list of events to swipe through.
 *
 * This is sample data so the app works out of the box.
 * Replace this array with your own events (e.g. generated from your
 * Excel list). Each event needs at least: id, title, category, date,
 * location, description. "image" is optional — if left empty, the
 * card shows a colored poster panel with the category instead.
 *
 * Allowed "category" values drive the color of the poster panel:
 * "Music", "Comedy", "Theatre", "Art", "Sports", "Other"
 */

const EVENTS = [
  {
    id: "evt-001",
    title: "Stand-up Comedy Open Mic",
    category: "Comedy",
    date: "jeden Donnerstag",
    time: "20:00",
    location: "Lucky Punch Comedy Club Wien",
    price: "7.90€",
    description:
      "Erlebe hautnah, wie Profis und Newcomer ihre brandneuen Jokes zum allerersten Mal testen. Dauer 90 Minuten mit Pause.",
    image: "Pics/Stand_up_Comedy_OPEN_MIC_2_tickets_2026_c_Markus_Waches_222.jpg",
    tokenCost: "3 &#129689;"
  },
  {
    id: "evt-002",
    title: "Vienna's Weekly Improv Comedy Show",
    category: "Comedy",
    date: "jeden Montag",
    time: "19:30",
    location: "AERA",
    price: "9€",
    description:
      "Da war ich schon mal, war geil, mach mit wenn du bereit bist selber auf die Bühne zu gehen!",
    image: "Pics/Vienna_s_Weekly_Improv_Comedy_Show_tickets_2025_c_American_Improv_Conservatory_222.jpg",
    tokenCost: "3 &#129689;"
  },
  {
    id: "evt-003",
    title: "Stand-up Comedy Mixed Show",
    category: "Comedy",
    date: "jeden Freitag und Samstag",
    time: "20:00",
    location: "Lucky Punch Comedy Club Wien",
    price: "26.40€",
    description:
      "Authentische Primetime Mixed Show mit den angesagtesten Stand up Comedians aus Wien und dem gesamten deutschsprachigen Raum, rohe Gags und lebendige Clubatmosphaere.",
    image: "Pics/Stand-up_Comedy_Mixed_Show_c_LP_222.jpg",
    tokenCost: "9 &#129689;"
  },
  {
    id: "evt-004",
    title: "Peter Filzmaier & Armin Wolf - 'Der Professor und der Wolf'",
    category: "Experience",
    date: ["2026-09-06","2026-11-15"],
    time: "19:30",
    location: "Theater im Park, Globe Wien (Marx Halle)",
    price: "26.40€",
    description:
      "Im Fernsehen reden sie über Politik. Nie über Sport. Dabei weiß Peter über Sport fast noch mehr als über Politik. Armin ist es ein Rätsel, wie man sich für Sport überhaupt interessieren kann. Außer für Curling. Aber das verachtet Peter. Auf der Bühne werden sie trotzdem ein wenig über Sport reden, viel über Politik und übereinander. Wie immer ziemlich schnell.",
    image: "Pics/Peter_Filzmaier_und_Armin_Wolf_-_Der_Professor_und_der_Wolf_-_c_Clemens_Fantur_FM4_-_222.jpg",
    tokenCost: "9 &#129689;"
  },
  {
    id: "evt-005",
    title: "Yorick Thiede - Polygon",
    category: "Comedy",
    date: ["2026-11-26","2026-11-27"],
    time: "19:30",
    location: "Kabarett Niedermair",
    price: "34.40€",
    description:
      "Schlechte Pressetexte würden sagen: 'Ein Potpourri der guten Laune!' Aber zu Künstlern, die sowas sagen, will man ja nicht hin. Kommt hier hin! Das wird super.",
    image: "Pics/Yorick_Thiede_-_Polygon_tickets_2026_c_Simon_Redel_m.jpg",
    tokenCost: "11 &#129689;"
  },
  {
    id: "evt-006",
    title: "Dr. Bohl - Solo",
    category: "Comedy",
    date: ["2026-08-06", "2026-10-18", "2026-10-27", "2026-11-09", "2026-11-27", "2026-11-29", "2026-12-14"],
    time: "19:30",
    location: "Theater im Park, Stadtsaal,, Globe Wien (Marx Halle)",
    price: "35€",
    description:
      "Paulus geht in seinem Solo-Programm humorvoll seinen Tinder-Date-Erfahrungen und persönlichen Geschichten auf den Grund.",
    image: "Pics/dr-bohl-solo-c-mutter-bohl-m.jpg",
    tokenCost: "12 &#129689;"
  },
  {
    id: "evt-008",
    title: "Cosmó",
    category: "Music",
    date: "2026-10-08",
    time: "20:00",
    location: "Flex",
    price: "37.90€",
    description:
      "Lieber Tour ich weiter.",
    image: "Pics/Cosmo-Lieber-Tour-ich-weiter-2026-tickets-m.jpg",
    tokenCost: "13 &#129689;"
  },
  {
    id: "evt-010",
    title: "Zimmer90",
    category: "Theatre",
    date: "2026-11-08",
    time: "20:00",
    location: "Ottakringer Brauerei",
    price: "39.95€",
    description:
      "Arthouse Tour.",
    image: "Pics/Zimmer90.png",
    tokenCost: "13 &#129689;"
  },
  {
    id: "evt-011",
    title: "The Jury Experience: Diamanten, Lügen und ein toter Mann",
    category: "Experience",
    date: ["2026-07-17","2026-09-04","2026-10-04","2026-11-08"],
    time: "18:00, 20:30",
    location: "Lorely Saal, Penzinger Straße",
    price: "40€",
    description:
      "Die 20-Millionen-Dollar-Halskette von Superstar Lana Tonneti ist verschwunden. Jetzt steht ihr Ex-Fahrer wegen Diebstahls vor Gericht. Aber steckt mehr hinter dieser Geschichte?",
    image: "Pics/8a1c2652-127c-11f1-92b2-b2434481c692.jpg",
    tokenCost: "13 &#129689;"
  },
  {
    id: "evt-012",
    title: "The Jury Experience: Tod durch KI: Wer zahlt den Preis?",
    category: "Experience",
    date: ["2026-07-23", "2026-08-22", "2026-09-11", "2026-10-11", "2026-11-14"],
    time: "18:00, 20:30",
    location: "Lorely Saal, Penzinger Straße",
    price: "40€",
    description:
      "Ein selbstfahrendes Auto. Ein Mensch stirbt. Und eine Frage, die noch kein Gericht beantworten musste: Wer muss zahlen, wenn die Technik vor Gericht steht?",
    image: "Pics/f9ecd48a-26d7-11f1-b81d-fa31ec36ed6c.jpg",
    tokenCost: "13 &#129689;"
  },
  {
    id: "evt-013",
    title: "The Jury Experience: Tod an Backbord",
    category: "Experience",
    date: "2026-10-17",
    time: "16:00, 19:00",
    location: "Lorely Saal, Penzinger Straße",
    price: "40€",
    description:
      "Eine Freundesgruppe war auf einem Schnellboot unterwegs, als es zu einem schlimmen Unfall kam. War es vielleicht ein mutwilliger Mord?",
    image: "Pics/94e2e4c8-1271-11f1-9fde-5a92634d281f.jpg",
    tokenCost: "13 &#129689;"
  },
  {
    id: "evt-014",
    title: "Oswald",
    category: "Music",
    date: "2026-09-17",
    time: "20:00",
    location: "Gasometer",
    price: "42.15€",
    description:
      "Wir waren hier Tour.",
    image: "Pics/Oswald.png",
    tokenCost: "14 &#129689;"
  },
  {
    id: "evt-015",
    title: "Tjark",
    category: "Music",
    date: "2026-09-14",
    time: "20:00",
    location: "Simm City Festsaal Zentrum Simmering",
    price: "45.49€",
    description:
      "auch wenn's uns morgen nicht mehr gibt Tour.",
    image: "Pics/tjaark-neutral-2026-222.jpg",
    tokenCost: "15 &#129689;"
  },
  {
    id: "evt-016",
    title: "Ralf Schmitz - Schmitzmän",
    category: "Comedy",
    date: "2026-10-01",
    time: "20:00",
    location: "Wiener Stadthalle D",
    price: "50.40€",
    description:
      "In seinem neuen Programm geht er wieder genau dorthin, wo er am stärksten ist: mitten in unseren Alltag, mitten in unsere Leben, mitten in unsere Köpfe.",
    image: "Pics/Schmitz.png",
    tokenCost: "17 &#129689;"
  },
  {
    id: "evt-017",
    title: "Jungle",
    category: "Music",
    date: "2026-11-13",
    time: "19:30",
    location: "Wiener Stadthalle D",
    price: "70.40€",
    description:
      "Jungle sind im November 2026 zurück und machen mit Special Guest Rio Kosta Halt in der Wiener Stadthalle.",
    image: "Pics/Jungle_c-Mason-Rose_tickets-2026-m.jpg",
    tokenCost: "25 &#129689;"
  }
];

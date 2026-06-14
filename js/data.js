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
    title: "Vienna Sessions: Late Night Jazz",
    category: "Music",
    date: "2026-07-03",
    time: "20:30",
    location: "Porgy & Bess, Vienna",
    price: "€28",
    description:
      "An intimate jazz club night with a rotating quartet of local and touring musicians. Expect long improvisations and a smoky, low-lit room.",
    image: ""
  },
  {
    id: "evt-002",
    title: "Open Air: Electro Pop Festival",
    category: "Music",
    date: "2026-07-18",
    time: "16:00",
    location: "Donauinsel, Vienna",
    price: "€55",
    description:
      "A full-day outdoor festival with three stages, food trucks, and a lineup of electro-pop acts running well past midnight.",
    image: ""
  },
  {
    id: "evt-003",
    title: "Stand-Up Showdown: English Open Mic",
    category: "Comedy",
    date: "2026-06-25",
    time: "19:30",
    location: "Kabarett Niedermair, Vienna",
    price: "€12",
    description:
      "A rapid-fire English-language open mic featuring ten comedians, five minutes each. Unpredictable, occasionally brilliant.",
    image: ""
  },
  {
    id: "evt-004",
    title: "Improv Night: Whose Show Is It Anyway?",
    category: "Comedy",
    date: "2026-07-09",
    time: "20:00",
    location: "Theater im Werk X, Vienna",
    price: "€18",
    description:
      "A long-form improv troupe builds an entire show from a single audience suggestion. No two nights are the same.",
    image: ""
  },
  {
    id: "evt-005",
    title: "Immersive Art Walk: Light & Shadow",
    category: "Art",
    date: "2026-08-02",
    time: "18:00",
    location: "Kunsthalle Wien",
    price: "€16",
    description:
      "A late-night opening with projection installations spread across three floors, plus a rooftop bar for in-between breaks.",
    image: ""
  },
  {
    id: "evt-006",
    title: "Late Night Chamber: Strings After Dark",
    category: "Music",
    date: "2026-07-11",
    time: "21:00",
    location: "Musikverein, Vienna",
    price: "€40",
    description:
      "A string quartet performs a candlelit late-night program mixing baroque pieces with contemporary commissions.",
    image: ""
  },
  {
    id: "evt-007",
    title: "Comedy Roast: Local Legends",
    category: "Comedy",
    date: "2026-08-14",
    time: "20:30",
    location: "Stadtsaal, Vienna",
    price: "€24",
    description:
      "Four comedians take turns roasting each other — and the city itself — in front of a rowdy crowd.",
    image: ""
  },
  {
    id: "evt-008",
    title: "Outdoor Cinema: Cult Classics Under the Stars",
    category: "Other",
    date: "2026-07-25",
    time: "21:30",
    location: "Augarten, Vienna",
    price: "€10",
    description:
      "A pop-up screen in the park shows a rotating selection of cult classics. Bring a blanket, snacks are sold on site.",
    image: ""
  },
  {
    id: "evt-009",
    title: "Derby Day: Local Football Showdown",
    category: "Sports",
    date: "2026-07-30",
    time: "17:00",
    location: "Allianz Stadion, Vienna",
    price: "€32",
    description:
      "A high-stakes local derby with two rival fan blocks, a packed stadium, and fireworks before kickoff.",
    image: ""
  },
  {
    id: "evt-010",
    title: "Theatre: A Modern Retelling of Orpheus",
    category: "Theatre",
    date: "2026-08-08",
    time: "19:00",
    location: "Volkstheater, Vienna",
    price: "€38",
    description:
      "A stripped-down, modern staging of the Orpheus myth with a single actor, a looping cello score, and minimal set design.",
    image: ""
  },
  {
    id: "evt-011",
    title: "Night Market & Live Funk Sessions",
    category: "Music",
    date: "2026-08-21",
    time: "18:30",
    location: "Karmelitermarkt, Vienna",
    price: "Free",
    description:
      "A weekly night market with food stalls, natural wine, and a rotating live funk and soul band on a small stage.",
    image: ""
  },
  {
    id: "evt-012",
    title: "Sketch Comedy: The Office Files",
    category: "Comedy",
    date: "2026-09-05",
    time: "20:00",
    location: "Kulisse Wien",
    price: "€20",
    description:
      "A sketch troupe satirizes corporate life with rapid scene changes, deadpan delivery, and absurd props.",
    image: ""
  }
];

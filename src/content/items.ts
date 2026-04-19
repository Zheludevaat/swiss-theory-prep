// Hand-authored seed items. Each item has exactly 1 or 2 correct options
// (ASA format). Keep rationales short, factual, and rule-linked — the
// rationale is what the learner reads after Submit, and it's what teaches.

import type { Item } from "./schema";

export const seedItems: Item[] = [
  // ---------- priority ----------
  {
    id: "q.priority.unmarked-4way",
    ruleIds: ["priority.right-hand.default"],
    question:
      "At an unmarked four-way intersection in a residential area, who has priority?",
    diagramAssetId: "priority-4way-unmarked.svg",
    imageAlt:
      "Top view of an unmarked four-way intersection. Your blue car enters from the bottom; a red car enters from the right. An amber priority arrow follows the red car straight across — right-of-way flows from the right.",
    options: [
      { text: "The vehicle approaching from your right", correct: true },
      { text: "The vehicle on the wider road", correct: false },
      { text: "Whichever vehicle arrived first", correct: false },
    ],
    rationale:
      "Unless signs or markings say otherwise, traffic from the right has priority at all intersections (VRV Art. 36).",
    tags: ["intersection"],
    difficulty: 2,
    de: {
      question:
        "An einer unsignalisierten Vier-Wege-Kreuzung im Wohnquartier — wer hat Vortritt?",
      options: [
        "Das von rechts kommende Fahrzeug",
        "Das Fahrzeug auf der breiteren Strasse",
        "Wer zuerst da war",
      ],
      rationale:
        "Solange keine Signale oder Markierungen etwas anderes vorschreiben, gilt an allen Verzweigungen der Rechtsvortritt (VRV Art. 36).",
      imageAlt:
        "Draufsicht auf eine unsignalisierte Vier-Wege-Kreuzung. Ihr blaues Fahrzeug kommt von unten; ein rotes Fahrzeug kommt von rechts. Ein gelber Vortrittspfeil folgt dem roten Fahrzeug quer durch die Kreuzung — der Vortritt kommt von rechts.",
    },
  },
  {
    id: "q.priority.roundabout.yield",
    ruleIds: ["priority.roundabout"],
    question: "You are approaching a single-lane roundabout. What applies?",
    diagramAssetId: "roundabout-1lane-yield.svg",
    imageAlt:
      "Single-lane roundabout seen from above. Your blue car is stopped at a dashed yield line on the bottom approach. A red car is already circulating and carries the amber priority arrow.",
    options: [
      { text: "Traffic already inside the roundabout has priority", correct: true },
      { text: "You must stop even if the circle is empty", correct: false },
      { text: "Signal left while inside the circle", correct: false },
    ],
    rationale:
      "Inside traffic has priority. You may enter without stopping if the circle is clear, and you only signal right when leaving.",
    tags: ["roundabout"],
    difficulty: 2,
    de: {
      question: "Sie nähern sich einem einspurigen Kreisverkehr. Was gilt?",
      options: [
        "Der Verkehr im Kreisel hat Vortritt",
        "Sie müssen auch bei leerem Kreisel anhalten",
        "Im Kreisel links blinken",
      ],
      rationale:
        "Der Verkehr im Kreisel hat Vortritt. Bei freiem Kreisel dürfen Sie ohne Halt einfahren; rechts blinken nur beim Verlassen.",
      imageAlt:
        "Einspuriger Kreisverkehr in der Draufsicht. Ihr blaues Fahrzeug steht an einer unterbrochenen Wartelinie auf der unteren Zufahrt. Ein rotes Fahrzeug fährt bereits im Kreisel und trägt den gelben Vortrittspfeil.",
    },
  },
  {
    id: "q.priority.roundabout.signal",
    ruleIds: ["priority.roundabout"],
    question: "Which statements about signalling in a roundabout are correct?",
    diagramAssetId: "roundabout-signal-exit.svg",
    imageAlt:
      "Single-lane roundabout in top view. A blue car circulates anti-clockwise and is about to take the east exit. A yellow right-hand blinker is shown on the car, and a badge below reads 'no signal on entry'.",
    options: [
      { text: "Signal right just before the exit", correct: true },
      { text: "Signal left while circulating past exits you skip", correct: false },
      { text: "Do not signal on entry", correct: true },
    ],
    rationale:
      "Swiss practice: no entry signal; signal right immediately before the exit you take.",
    tags: ["roundabout"],
    difficulty: 3,
    de: {
      question: "Welche Aussagen zum Blinken im Kreisverkehr sind richtig?",
      options: [
        "Kurz vor der Ausfahrt rechts blinken",
        "Beim Vorbeifahren an nicht benutzten Ausfahrten links blinken",
        "Bei der Einfahrt nicht blinken",
      ],
      rationale:
        "Schweizer Praxis: kein Blinker bei der Einfahrt; rechts blinken erst unmittelbar vor der gewählten Ausfahrt.",
      imageAlt:
        "Einspuriger Kreisverkehr in der Draufsicht. Ein blaues Fahrzeug fährt gegen den Uhrzeigersinn und setzt unmittelbar vor der östlichen Ausfahrt den rechten Blinker. Ein Hinweisfeld darunter zeigt: kein Blinker bei der Einfahrt.",
    },
  },
  {
    id: "q.priority.tram.cross",
    ruleIds: ["priority.tram"],
    question: "A tram approaches from your left at an unmarked intersection. You:",
    diagramAssetId: "tram-cross-from-left.svg",
    imageAlt:
      "Unsignalised crossroads. Rails cross the horizontal road; an amber tram is approaching from the left along the rails. Your blue car from the bottom carries a yield triangle and the amber priority arrow follows the tram across.",
    options: [
      { text: "Have priority because the tram is on your left", correct: false },
      { text: "Must yield to the tram", correct: true },
      { text: "Proceed only if the tram has stopped", correct: false },
    ],
    rationale:
      "Trams always have priority, which overrides the right-hand rule (SVG Art. 38).",
    tags: ["tram"],
    difficulty: 3,
    de: {
      question:
        "An einer unsignalisierten Kreuzung nähert sich von links ein Tram. Sie:",
      options: [
        "Haben Vortritt, weil das Tram von links kommt",
        "Müssen dem Tram den Vortritt gewähren",
        "Fahren nur weiter, wenn das Tram angehalten hat",
      ],
      rationale:
        "Strassenbahnen haben immer Vortritt — das geht dem Rechtsvortritt vor (SVG Art. 38).",
      imageAlt:
        "Unsignalisierte Kreuzung. Schienen queren die horizontale Strasse; von links nähert sich ein bernsteinfarbenes Tram. Ihr blaues Fahrzeug von unten trägt ein Vortrittsdreieck, der gelbe Vortrittspfeil folgt dem Tram.",
    },
  },
  {
    id: "q.priority.emergency-vehicles",
    ruleIds: ["priority.emergency-vehicles"],
    question:
      "An emergency vehicle with blue lights and siren approaches from behind. You:",
    diagramAssetId: "emergency-approach-rear.svg",
    imageAlt:
      "Two-lane road seen from above. A white ambulance with blue flashing lights is directly behind a blue car. The blue car has sidestepped right toward the lane edge so the ambulance can pass on the left.",
    options: [
      { text: "Pull over as far right as safe and let it pass", correct: true },
      { text: "Stop immediately in your lane", correct: false },
      { text: "Maintain speed — emergency vehicles must pass on the left", correct: false },
    ],
    rationale:
      "Emergency vehicles under siren have right of way. Clear a path by pulling right; stopping in-lane can block them.",
    tags: ["emergency"],
    difficulty: 2,
    de: {
      question:
        "Ein Einsatzfahrzeug mit Blaulicht und Wechselklanghorn nähert sich von hinten. Sie:",
      options: [
        "Weichen so weit wie möglich nach rechts aus und lassen es vorbei",
        "Halten sofort auf Ihrer Spur an",
        "Behalten die Geschwindigkeit bei — Einsatzfahrzeuge müssen links überholen",
      ],
      rationale:
        "Einsatzfahrzeuge mit Blaulicht und Wechselklanghorn haben Vortritt. Platz machen durch Ausweichen nach rechts; Anhalten auf der Spur kann die Durchfahrt blockieren.",
      imageAlt:
        "Zweispurige Strasse in der Draufsicht. Hinter einem blauen Fahrzeug nähert sich ein weisser Rettungswagen mit Blaulicht. Das blaue Fahrzeug ist nach rechts an den Fahrbahnrand ausgewichen, damit der Rettungswagen links vorbeifahren kann.",
    },
  },
  {
    id: "q.priority.yielding-on-entry",
    ruleIds: ["priority.yielding-on-entry"],
    question:
      "You are leaving a supermarket car park to join a busy main road. Which is correct?",
    diagramAssetId: "priority-driveway.svg",
    imageAlt:
      "A through-road runs horizontally with cars in both directions. A blue car emerges from a private driveway stub at the bottom. A yield triangle on the blue car shows it must give way to every vehicle on the main road.",
    options: [
      { text: "Yield to all traffic on the priority road in both directions", correct: true },
      { text: "You may join if a 2-second gap exists, even if the approaching driver must brake", correct: false },
      { text: "Right-of-way from the right applies because no priority sign is visible from the car park", correct: false },
    ],
    rationale:
      "Joining from private property or a side street: you yield to the priority road in both directions and only enter when no one needs to brake (VRV Art. 15).",
    tags: ["yield"],
    difficulty: 2,
    de: {
      question:
        "Sie fahren aus einem Supermarkt-Parkplatz auf eine belebte Hauptstrasse. Was gilt?",
      options: [
        "Sie gewähren dem Verkehr auf der Hauptstrasse in beiden Richtungen den Vortritt",
        "Sie dürfen einbiegen, wenn eine Lücke von 2 Sekunden besteht, auch wenn ein Herannahender bremsen muss",
        "Rechtsvortritt gilt, weil vom Parkplatz aus kein Vortrittssignal sichtbar ist",
      ],
      rationale:
        "Beim Einfahren aus einem Privatgrundstück oder einer Nebenstrasse: Vortritt gewähren in beiden Richtungen. Einbiegen nur, wenn kein anderer Fahrzeuglenker bremsen muss (VRV Art. 15).",
      imageAlt:
        "Eine horizontale Durchgangsstrasse mit Fahrzeugen in beiden Richtungen. Ein blaues Fahrzeug kommt aus einer privaten Einfahrt von unten. Ein Vortrittsdreieck am blauen Fahrzeug zeigt: beiden Fahrtrichtungen auf der Hauptstrasse den Vortritt gewähren.",
    },
  },
  {
    id: "q.priority.rescue-corridor",
    ruleIds: ["priority.rescue-corridor"],
    question:
      "Traffic on a three-lane motorway slows to a crawl. How is the rescue corridor formed?",
    diagramAssetId: "rettungsgasse-3lane.svg",
    imageAlt:
      "Top view of a three-lane motorway in slow traffic: leftmost lane has moved fully left and the centre + right lanes have moved fully right, opening a corridor for an ambulance to pass between them.",
    options: [
      { text: "Left lane moves fully left; middle and right lanes move fully right", correct: true },
      { text: "All lanes move to the right shoulder", correct: false },
      { text: "Drivers wait until they hear sirens before moving aside", correct: false },
    ],
    rationale:
      "Rettungsgasse: corridor opens between the leftmost and the next-to-leftmost lane, formed as soon as traffic slows — not when sirens arrive (VRV Art. 36 Abs. 1bis).",
    tags: ["emergency", "highway"],
    difficulty: 3,
    de: {
      question:
        "Der Verkehr auf einer dreispurigen Autobahn stockt. Wie wird die Rettungsgasse gebildet?",
      options: [
        "Die linke Spur fährt ganz nach links; die mittlere und rechte Spur fahren ganz nach rechts",
        "Alle Spuren weichen auf den rechten Pannenstreifen aus",
        "Man wartet mit dem Ausweichen, bis man Sirenen hört",
      ],
      rationale:
        "Rettungsgasse: die Gasse öffnet sich zwischen der linken und der zweitlinken Spur, und zwar sobald der Verkehr ins Stocken gerät — nicht erst, wenn Einsatzfahrzeuge zu hören sind (VRV Art. 36 Abs. 1bis).",
      imageAlt:
        "Draufsicht auf eine dreispurige Autobahn im stockenden Verkehr: die linke Spur ist ganz nach links gerückt, die mittlere und rechte Spur sind ganz nach rechts gerückt — dazwischen öffnet sich eine Gasse, durch die ein Rettungswagen vorbeifährt.",
    },
  },
  {
    id: "q.priority.school-bus",
    ruleIds: ["priority.school-bus"],
    question:
      "A school bus is stopped at the roadside with flashing yellow warning lights. You:",
    diagramAssetId: "school-bus-stopped.svg",
    imageAlt:
      "A yellow school bus is stopped against the right kerb with four amber hazard lights flashing and two child pictograms on the pavement. A blue car approaches in the left lane at walking pace, marked with a 5 km/h indicator.",
    options: [
      { text: "Pass at walking pace, ready to stop", correct: true },
      { text: "Maintain the posted speed if your lane is clear", correct: false },
      { text: "Stop completely until the bus moves off", correct: false },
    ],
    rationale:
      "Flashing yellows on a stopped school bus: pass at walking pace, watching for children stepping out (VRV Art. 18).",
    tags: ["school", "bus"],
    difficulty: 2,
    de: {
      question:
        "Ein Schulbus steht mit gelb blinkenden Warnleuchten am Strassenrand. Sie:",
      options: [
        "Fahren in Schrittgeschwindigkeit vorbei und sind bremsbereit",
        "Behalten die signalisierte Geschwindigkeit bei, wenn Ihre Spur frei ist",
        "Halten vollständig an, bis der Bus weiterfährt",
      ],
      rationale:
        "Gelb blinkende Warnleuchten an einem stehenden Schulbus: in Schrittgeschwindigkeit vorbeifahren und mit plötzlich heraustretenden Kindern rechnen (VRV Art. 18).",
      imageAlt:
        "Ein gelber Schulbus steht am rechten Strassenrand mit vier bernsteinfarbenen Warnblinkleuchten und zwei Kinder-Piktogrammen auf dem Trottoir. Ein blaues Fahrzeug fährt auf der linken Spur in Schrittgeschwindigkeit vorbei; eine Tachoanzeige zeigt ~5 km/h.",
    },
  },

  // ---------- signs ----------
  {
    id: "q.signs.stop.behaviour",
    ruleIds: ["signs.stop"],
    question: "At a stop sign on a quiet road with no cross traffic in sight:",
    imageAssetId: "3.01.svg",
    imageAlt: "Red octagonal stop sign with white 'STOP' text (SSV 3.01).",
    options: [
      { text: "You must come to a complete stop at the line", correct: true },
      { text: "You may roll through if the way is clear", correct: false },
      { text: "You yield only to traffic from the right", correct: false },
    ],
    rationale:
      "A stop sign (SSV 3.01) requires wheels-at-zero at the marked line, regardless of visible traffic.",
    tags: ["sign:3.01"],
    difficulty: 1,
    de: {
      question:
        "An einem Stoppsignal an einer ruhigen Strasse ohne sichtbaren Querverkehr:",
      options: [
        "Müssen Sie an der Haltelinie vollständig anhalten",
        "Dürfen Sie rollend weiterfahren, wenn der Weg frei ist",
        "Müssen Sie nur dem Verkehr von rechts den Vortritt gewähren",
      ],
      rationale:
        "Das Stoppsignal (SSV 3.01) verlangt an der markierten Linie einen vollständigen Halt — unabhängig von sichtbarem Verkehr.",
      imageAlt: "Rotes achteckiges Stoppsignal mit weisser Aufschrift 'STOP' (SSV 3.01).",
    },
  },
  {
    id: "q.signs.stop-vs-giveway",
    ruleIds: ["signs.stop", "signs.give-way"],
    question: "Which of these is correct about stop vs. give-way signs?",
    options: [
      { text: "Stop always requires a full stop; give-way does not", correct: true },
      { text: "Both require a full stop", correct: false },
      { text: "Both require only yielding, not stopping", correct: false },
    ],
    rationale:
      "Give-way (SSV 3.02): slow and yield, no stop required if clear. Stop (SSV 3.01): always a full stop.",
    tags: ["sign:3.01", "sign:3.02"],
    difficulty: 2,
    de: {
      question: "Welche Aussage zum Vergleich Stopp- und Kein-Vortritt-Signal ist richtig?",
      options: [
        "Stopp verlangt immer einen vollständigen Halt; Kein Vortritt nicht",
        "Beide verlangen einen vollständigen Halt",
        "Beide verlangen nur Vortrittgewähren, kein Anhalten",
      ],
      rationale:
        "Kein-Vortritt-Signal (SSV 3.02): Geschwindigkeit reduzieren und Vortritt gewähren, kein Halt nötig wenn frei. Stopp-Signal (SSV 3.01): immer vollständiger Halt.",
    },
  },
  {
    id: "q.signs.no-overtaking.applies",
    ruleIds: ["signs.no-overtaking"],
    question:
      "You see the no-overtaking sign (SSV 2.06). Which overtakings remain permitted?",
    imageAssetId: "2.06.svg",
    imageAlt: "Round white sign with red border showing two cars side by side; the right-hand car is red — overtaking prohibited (SSV 2.06).",
    options: [
      { text: "Overtaking a bicycle at walking pace", correct: true },
      { text: "Overtaking a car driving at the speed limit", correct: false },
      { text: "Overtaking a tractor moving at 20 km/h", correct: true },
    ],
    rationale:
      "The ban (SSV 2.06) applies to overtaking motor vehicles. Slow vehicles (<30 km/h) and cyclists remain overtake-able. Cancelled by 2.27.",
    tags: ["sign:2.06"],
    difficulty: 3,
  },
  {
    id: "q.signs.priority-road",
    ruleIds: ["signs.priority-road"],
    question:
      "You are on a road marked with the yellow-diamond priority-road sign. At the next intersection:",
    imageAssetId: "3.03.svg",
    imageAlt: "Square sign tipped on its corner: white border, black border inside, central yellow diamond — priority road (SSV 3.03).",
    options: [
      { text: "You keep priority over crossing traffic", correct: true },
      { text: "You must still yield to traffic from your right", correct: false },
      { text: "Priority depends on the size of the side road", correct: false },
    ],
    rationale:
      "The priority-road sign (SSV 3.03) overrides the right-hand rule until cancelled by SSV 3.04.",
    tags: ["sign:3.03", "priority"],
    difficulty: 2,
    de: {
      question:
        "Sie fahren auf einer mit dem Signal 'Hauptstrasse' (gelbes Quadrat auf Ecke) markierten Strasse. An der nächsten Verzweigung:",
      options: [
        "Haben Sie Vortritt vor dem querenden Verkehr",
        "Müssen Sie dem Verkehr von rechts trotzdem den Vortritt gewähren",
        "Der Vortritt hängt von der Grösse der Nebenstrasse ab",
      ],
      rationale:
        "Das Signal 'Hauptstrasse' (SSV 3.03) setzt den Rechtsvortritt ausser Kraft — bis es durch 'Ende der Hauptstrasse' (SSV 3.04) aufgehoben wird.",
      imageAlt:
        "Auf die Spitze gestelltes Quadrat mit weissem Rand, schwarzem Innenrand und zentralem gelben Feld — Hauptstrasse (SSV 3.03).",
    },
  },
  {
    id: "q.signs.no-entry",
    ruleIds: ["signs.no-entry"],
    question:
      "You see a red disc with a horizontal white bar at the mouth of a street. You:",
    imageAssetId: "2.02.svg",
    imageAlt: "Solid red circle with a horizontal white bar across the centre — no entry (SSV 2.02).",
    options: [
      { text: "Must not enter the street with a motor vehicle", correct: true },
      { text: "May briefly enter to turn around", correct: false },
      { text: "May enter if no other vehicle is visible inside the street", correct: false },
    ],
    rationale:
      "Sign 2.02 (no entry) is absolute. Even a brief entry to turn around is not allowed (SSV Art. 17).",
    tags: ["sign:2.02"],
    difficulty: 1,
    de: {
      question:
        "Am Anfang einer Strasse sehen Sie eine rote Scheibe mit waagrechtem weissem Balken. Sie:",
      options: [
        "Dürfen die Strasse mit einem Motorfahrzeug nicht befahren",
        "Dürfen kurz einfahren, um zu wenden",
        "Dürfen einfahren, wenn kein anderes Fahrzeug in der Strasse sichtbar ist",
      ],
      rationale:
        "Signal 2.02 (Einfahrt verboten) gilt absolut. Auch ein kurzes Einfahren zum Wenden ist nicht erlaubt (SSV Art. 17).",
      imageAlt:
        "Vollständig rote Scheibe mit waagrechtem weissem Balken in der Mitte — Einfahrt verboten (SSV 2.02).",
    },
  },
  {
    id: "q.signs.one-way",
    ruleIds: ["signs.one-way"],
    question:
      "A one-way street (4.08) has a small panel beneath showing a bicycle in the opposite direction. This means:",
    options: [
      { text: "Bicycles may ride against the flow; cars and motorcycles must follow the arrow", correct: true },
      { text: "Bicycles must also follow the arrow direction", correct: false },
      { text: "All traffic may flow in either direction", correct: false },
    ],
    rationale:
      "An exemption panel for bicycles permits cyclists to ride against the one-way flow; motor vehicles still follow the arrow.",
    tags: ["sign:4.08"],
    difficulty: 3,
    de: {
      question:
        "Eine Einbahnstrasse (4.08) mit einer Zusatztafel, die ein Fahrrad in Gegenrichtung zeigt. Das bedeutet:",
      options: [
        "Velos dürfen entgegen der Fahrtrichtung fahren; Autos und Motorräder folgen dem Pfeil",
        "Velos müssen ebenfalls in Pfeilrichtung fahren",
        "Der gesamte Verkehr darf in beide Richtungen fahren",
      ],
      rationale:
        "Eine Ausnahmetafel für Fahrräder erlaubt Velos das Fahren entgegen der Einbahn; Motorfahrzeuge folgen weiterhin dem Pfeil.",
    },
  },
  {
    id: "q.signs.no-parking",
    ruleIds: ["signs.no-parking"],
    question:
      "Under a no-parking sign (SSV 2.17), which of these is permitted?",
    imageAssetId: "2.17.svg",
    imageAlt: "Blue disc with red border and a single red diagonal slash — no parking (SSV 2.17).",
    options: [
      { text: "Stopping briefly to let a passenger get out", correct: true },
      { text: "Leaving the car for two minutes to run into a shop", correct: false },
      { text: "Parking with hazard lights on", correct: false },
    ],
    rationale:
      "No-parking (SSV 2.17) prohibits parking but allows brief boarding/loading. A short shop visit is parking, not a stop.",
    tags: ["sign:2.17", "parking"],
    difficulty: 2,
    de: {
      question: "Unter dem Signal 'Parkieren verboten' (SSV 2.17) ist erlaubt:",
      options: [
        "Kurzes Halten, um einen Fahrgast aussteigen zu lassen",
        "Das Fahrzeug zwei Minuten verlassen, um in ein Geschäft zu gehen",
        "Parkieren mit eingeschalteter Warnblinkanlage",
      ],
      rationale:
        "'Parkieren verboten' (SSV 2.17) untersagt das Parkieren, erlaubt aber kurzes Ein- und Aussteigen oder Güterumschlag. Ein kurzer Einkauf gilt als Parkieren, nicht als Halten.",
      imageAlt:
        "Blaue Scheibe mit rotem Rand und einem roten Schrägstrich — Parkieren verboten (SSV 2.17).",
    },
  },
  {
    id: "q.signs.no-stopping",
    ruleIds: ["signs.no-stopping"],
    question:
      "Under a no-stopping sign (SSV 2.16) you may:",
    imageAssetId: "2.16.svg",
    imageAlt: "Blue disc with red border and a red X — no stopping (SSV 2.16).",
    options: [
      { text: "Stop only if traffic control (red light, pedestrian crossing) requires it", correct: true },
      { text: "Stop briefly to drop a passenger", correct: false },
      { text: "Stop to load groceries", correct: false },
    ],
    rationale:
      "No-stopping (SSV 2.16) is absolute except for traffic-control duties. Even loading and boarding are forbidden.",
    tags: ["sign:2.16", "parking"],
    difficulty: 2,
    de: {
      question: "Unter dem Signal 'Halten verboten' (SSV 2.16) dürfen Sie:",
      options: [
        "Nur halten, wenn es der Verkehr verlangt (Rotlicht, Fussgängerstreifen)",
        "Kurz halten, um einen Fahrgast aussteigen zu lassen",
        "Halten, um Einkäufe zu laden",
      ],
      rationale:
        "'Halten verboten' (SSV 2.16) gilt absolut, ausser zur Erfüllung von Verkehrsregeln. Auch Ein- und Aussteigen oder Güterumschlag sind verboten.",
      imageAlt:
        "Blaue Scheibe mit rotem Rand und einem roten Andreaskreuz — Halten verboten (SSV 2.16).",
    },
  },
  {
    id: "q.signs.children-warning",
    ruleIds: ["signs.children-warning"],
    question:
      "You see the children-warning sign (SSV 1.19) on a town road posted at 50 km/h. The right action is to:",
    imageAssetId: "1.19.svg",
    imageAlt: "Red-bordered triangular warning sign showing two running child silhouettes — children (SSV 1.19).",
    options: [
      { text: "Reduce speed below 50 and watch for children stepping out", correct: true },
      { text: "Maintain 50 km/h — the sign does not change the limit", correct: false },
      { text: "Sound the horn to alert children", correct: false },
    ],
    rationale:
      "The warning sign (SSV 1.19) does not lower the limit, but VRV Art. 4 still requires speed adapted to conditions.",
    tags: ["sign:1.19"],
    difficulty: 2,
  },
  {
    id: "q.signs.mandatory-direction",
    ruleIds: ["signs.mandatory-direction"],
    question:
      "A blue disc with a single white arrow pointing straight up faces you at a junction. You:",
    imageAssetId: "2.40.svg",
    imageAlt: "Blue disc with a single white straight-up arrow — mandatory direction ahead (SSV 2.40).",
    options: [
      { text: "Must continue straight ahead — turning is prohibited", correct: true },
      { text: "May turn right but not left", correct: false },
      { text: "May choose any direction if no other sign appears", correct: false },
    ],
    rationale:
      "Mandatory direction (SSV 2.40–2.47): you must take the indicated direction; turning is treated as a prohibited movement.",
    tags: ["sign:2.40"],
    difficulty: 2,
  },
  {
    id: "q.signs.bicycle-path",
    ruleIds: ["signs.bicycle-path"],
    question:
      "A blue disc shows a single white bicycle. Which is correct?",
    imageAssetId: "2.51.svg",
    imageAlt: "Blue disc with a single white bicycle pictogram — bicycle path (SSV 2.51).",
    options: [
      { text: "Path is reserved for bicycles; motor vehicles must not enter", correct: true },
      { text: "Bicycles must yield to motor vehicles using the path", correct: false },
      { text: "Pedestrians may use the path freely alongside cyclists", correct: false },
    ],
    rationale:
      "A bicycle-only sign (SSV 2.51) reserves the path for bicycles. Pedestrians belong on the pedestrian-and-bicycle combined sign (2.53), not this one.",
    tags: ["sign:2.51"],
    difficulty: 2,
  },
  {
    id: "q.signs.end-of-zone",
    ruleIds: ["signs.end-of-zone", "speeds.default-limits"],
    question:
      "You pass an 'end of Tempo-30 zone' sign while inside a town. The applicable limit becomes:",
    options: [
      { text: "50 km/h, unless another sign posts a different limit", correct: true },
      { text: "Whatever the previous sign before the Tempo-30 zone said", correct: false },
      { text: "80 km/h because you are now outside any zone", correct: false },
    ],
    rationale:
      "End-of-zone returns to the default — 50 km/h in town. 80 only applies outside built-up areas.",
    tags: ["zone", "tempo30"],
    difficulty: 2,
  },
  {
    id: "q.signs.dead-end",
    ruleIds: ["signs.dead-end"],
    question:
      "A dead-end sign (4.09) shows a small pedestrian pictogram at the end of the bar. This means:",
    options: [
      { text: "Motor vehicles cannot pass through; pedestrians can", correct: true },
      { text: "The street is closed to all users", correct: false },
      { text: "Cyclists may pass but cars must turn around", correct: false },
    ],
    rationale:
      "The pedestrian pictogram on a dead-end sign indicates the street continues for foot traffic but ends for motor vehicles.",
    tags: ["sign:4.09"],
    difficulty: 3,
  },
  // --- new sign items wired to public/signs/*.svg (Chunk 5b) ---
  {
    id: "q.signs.no-vehicles.recognition",
    ruleIds: ["signs.no-vehicles"],
    question: "What does this sign mean?",
    imageAssetId: "2.01.svg",
    imageAlt: "Empty white circular sign with a thick red border (SSV 2.01).",
    options: [
      { text: "No vehicles of any kind in either direction", correct: true },
      { text: "End of all restrictions", correct: false },
      { text: "No motor vehicles only", correct: false },
    ],
    rationale:
      "An empty white disc with a red border (SSV 2.01) bans all vehicles, including bicycles, unless an exception plate is shown.",
    tags: ["sign:2.01"],
    difficulty: 2,
  },
  {
    id: "q.signs.no-vehicles.exception",
    ruleIds: ["signs.no-vehicles"],
    question:
      "Beneath a 2.01 sign you see a plate reading 'forestry vehicles excepted'. May you, as a private driver, enter?",
    options: [
      { text: "No — the prohibition still applies to you", correct: true },
      { text: "Yes, because the exception covers all motor vehicles", correct: false },
      { text: "Only at low speed, with hazard lights on", correct: false },
    ],
    rationale:
      "Exception plates only lift the ban for the listed users. Private cars remain prohibited under SSV 2.01.",
    tags: ["sign:2.01"],
    difficulty: 3,
  },
  {
    id: "q.signs.no-uturn.basic",
    ruleIds: ["signs.no-uturn"],
    question: "What does this sign require?",
    imageAssetId: "2.05.svg",
    imageAlt: "Round white sign with red border showing a U-shaped arrow (SSV 2.05).",
    options: [
      { text: "U-turns are prohibited until the next intersection", correct: true },
      { text: "Left turns are prohibited", correct: false },
      { text: "Cars must follow the curve direction shown", correct: false },
    ],
    rationale:
      "SSV 2.05 prohibits making a U-turn on the road. The ban runs until the next intersection or a cancelling sign.",
    tags: ["sign:2.05"],
    difficulty: 1,
  },
  {
    id: "q.signs.speed-limit.basic",
    ruleIds: ["signs.speed-limit"],
    question:
      "On a country road you pass a round white sign with a red border showing '60'. From this point:",
    imageAssetId: "2.09.svg",
    imageAlt: "Round white sign with red border and a black numeral — maximum speed (SSV 2.09).",
    options: [
      { text: "60 km/h is your maximum until cancelled or replaced", correct: true },
      { text: "60 km/h is a recommendation, not a maximum", correct: false },
      { text: "60 km/h is your minimum speed", correct: false },
    ],
    rationale:
      "SSV 2.09 sets a binding maximum speed in km/h, valid until cancelled by an end sign (2.25) or replaced by another limit.",
    tags: ["sign:2.09", "speed"],
    difficulty: 1,
    de: {
      question:
        "Auf einer Ausserortsstrasse passieren Sie ein rundes weisses Signal mit rotem Rand und der Zahl '60'. Ab hier:",
      options: [
        "Gilt 60 km/h als Höchstgeschwindigkeit, bis aufgehoben oder ersetzt",
        "Ist 60 km/h eine Empfehlung, keine Höchstgrenze",
        "Ist 60 km/h Ihre Mindestgeschwindigkeit",
      ],
      rationale:
        "SSV 2.09 setzt eine verbindliche Höchstgeschwindigkeit in km/h — gültig bis zur Aufhebung (SSV 2.25) oder einem anderen Geschwindigkeitssignal.",
      imageAlt:
        "Rundes weisses Signal mit rotem Rand und schwarzer Zahl — Höchstgeschwindigkeit (SSV 2.09).",
    },
  },
  {
    id: "q.signs.speed-limit.vs-default",
    ruleIds: ["signs.speed-limit", "speeds.default-limits"],
    question:
      "A '40' speed-limit sign is posted in a built-up area where the general 50 already applies. The applicable limit is:",
    options: [
      { text: "40 km/h — the posted sign overrides the built-up default", correct: true },
      { text: "50 km/h — built-up always wins", correct: false },
      { text: "Whichever is higher of the two", correct: false },
    ],
    rationale:
      "A more restrictive posted limit always overrides the area default. 40 km/h applies until cancelled.",
    tags: ["sign:2.09", "speed"],
    difficulty: 2,
    de: {
      question:
        "Ein Signal '40' ist innerorts angebracht, wo bereits die Allgemeinhöchstgeschwindigkeit von 50 gilt. Welche Geschwindigkeit gilt?",
      options: [
        "40 km/h — das signalisierte Limit geht der allgemeinen Innerortsgeschwindigkeit vor",
        "50 km/h — innerorts gilt immer 50",
        "Die jeweils höhere der beiden",
      ],
      rationale:
        "Eine strengere signalisierte Höchstgeschwindigkeit geht immer der Allgemeinhöchstgeschwindigkeit vor. 40 km/h gilt bis zur Aufhebung.",
    },
  },
  {
    id: "q.signs.general-50.entry",
    ruleIds: ["signs.general-50"],
    question:
      "You pass a blue rectangular sign reading '50 generell' at the village edge. This means:",
    imageAssetId: "2.10.svg",
    imageAlt: "Blue rectangular sign with white text reading '50 generell' (SSV 2.10).",
    options: [
      { text: "50 km/h is the default on every road in this area until cancelled by 2.26", correct: true },
      { text: "50 km/h applies only on this main road", correct: false },
      { text: "50 km/h is a recommended speed for this stretch", correct: false },
    ],
    rationale:
      "SSV 2.10 sets the area-wide built-up default at 50 km/h, including side streets without their own posted limit.",
    tags: ["sign:2.10", "speed"],
    difficulty: 2,
    de: {
      question:
        "Am Ortsanfang passieren Sie ein blaues Rechtecksignal mit der Aufschrift '50 generell'. Das bedeutet:",
      options: [
        "50 km/h gilt als Allgemeinhöchstgeschwindigkeit für alle Strassen in diesem Gebiet, bis zur Aufhebung (SSV 2.26)",
        "50 km/h gilt nur auf dieser Hauptstrasse",
        "50 km/h ist eine empfohlene Geschwindigkeit für diesen Abschnitt",
      ],
      rationale:
        "SSV 2.10 setzt die Allgemeinhöchstgeschwindigkeit innerorts auf 50 km/h — gültig auch auf Nebenstrassen ohne eigenes Geschwindigkeitssignal.",
      imageAlt:
        "Blaues Rechtecksignal mit weisser Aufschrift '50 generell' (SSV 2.10).",
    },
  },
  {
    id: "q.signs.no-bicycles.motorway",
    ruleIds: ["signs.no-bicycles"],
    question:
      "Why does a motorway entrance always carry the 'no bicycles' sign?",
    imageAssetId: "2.19.svg",
    imageAlt: "Round white sign with red border showing a black bicycle silhouette — no bicycles (SSV 2.19).",
    options: [
      { text: "Bicycles, mopeds, and slow vehicles are forbidden on motorways by law", correct: true },
      { text: "It is only a recommendation, cyclists may use the hard shoulder", correct: false },
      { text: "It applies only to e-bikes above 25 km/h", correct: false },
    ],
    rationale:
      "Bicycles and mopeds are forbidden on motorways. The 2.19 sign reinforces the statutory ban at the entrance.",
    tags: ["sign:2.19", "motorway"],
    difficulty: 2,
  },
  {
    id: "q.signs.no-trucks.scope",
    ruleIds: ["signs.no-trucks"],
    question:
      "A village road posts the 'no trucks' sign (SSV 2.21) without any plate underneath. Which vehicles are banned?",
    imageAssetId: "2.21.svg",
    imageAlt: "Round white sign with red border showing a black truck silhouette — no trucks (SSV 2.21).",
    options: [
      { text: "Lorries above the standard light-truck weight", correct: true },
      { text: "All commercial vehicles, including small vans", correct: false },
      { text: "Buses, even though they show a different silhouette", correct: false },
    ],
    rationale:
      "The 2.21 ban targets trucks proper. Light vans and passenger cars remain allowed; buses fall under their own sign.",
    tags: ["sign:2.21"],
    difficulty: 3,
  },
  {
    id: "q.signs.no-motor-vehicles.bicycles",
    ruleIds: ["signs.no-motor-vehicles", "signs.no-vehicles"],
    question:
      "What is the difference between SSV 2.01 and SSV 2.24?",
    imageAssetId: "2.24.svg",
    imageAlt: "Round white sign with red border showing a car and motorcycle silhouettes — no motor vehicles (SSV 2.24).",
    options: [
      { text: "2.01 bans every vehicle; 2.24 bans only motor vehicles, leaving bicycles allowed", correct: true },
      { text: "Both bans are identical — the symbols are interchangeable", correct: false },
      { text: "2.01 bans only motor vehicles; 2.24 bans every vehicle", correct: false },
    ],
    rationale:
      "2.01 (no vehicles) is the broadest ban; 2.24 (no motor vehicles) leaves bicycles, mopeds, agricultural vehicles, and pedestrians free.",
    tags: ["sign:2.01", "sign:2.24"],
    difficulty: 3,
  },
  {
    id: "q.signs.end-speed-limit.country",
    ruleIds: ["signs.end-speed-limit", "speeds.default-limits"],
    question:
      "On a country road you pass an 'end of 60' sign (SSV 2.25). The applicable limit becomes:",
    imageAssetId: "2.25.svg",
    imageAlt: "Round white sign with a numeral struck through by a black diagonal line — end of speed limit (SSV 2.25).",
    options: [
      { text: "80 km/h, the country-road default", correct: true },
      { text: "100 km/h, because no limit is posted", correct: false },
      { text: "Whatever the limit was before the 60 sign", correct: false },
    ],
    rationale:
      "End of a posted limit returns to the road's default. Country roads default to 80 km/h.",
    tags: ["sign:2.25", "speed"],
    difficulty: 2,
  },
  {
    id: "q.signs.end-overtaking-ban.scope",
    ruleIds: ["signs.end-overtaking-ban"],
    question:
      "After passing the 'end of overtaking ban' sign (SSV 2.27), what changes?",
    imageAssetId: "2.27.svg",
    imageAlt: "Round white sign with the two-car overtaking pictogram crossed out by a diagonal line — end of overtaking ban (SSV 2.27).",
    options: [
      { text: "Overtaking is again allowed where conditions and other rules permit", correct: true },
      { text: "Overtaking is mandatory if a slower vehicle is ahead", correct: false },
      { text: "The speed limit is automatically raised", correct: false },
    ],
    rationale:
      "SSV 2.27 only cancels the no-overtaking ban from SSV 2.06. Speed limits and other rules are unaffected.",
    tags: ["sign:2.27"],
    difficulty: 2,
  },
  {
    id: "q.signs.end-prohibitions.what-changes",
    ruleIds: ["signs.end-prohibitions"],
    question:
      "You pass the 'Freie Fahrt' sign (SSV 2.28) on an open country road. Which restrictions are lifted?",
    imageAssetId: "2.28.svg",
    imageAlt: "Round white sign with multiple thin diagonal lines — end of all restrictions (SSV 2.28).",
    options: [
      { text: "All previously posted prohibitions, including speed and overtaking", correct: true },
      { text: "Only the most recent prohibition", correct: false },
      { text: "Only weight and dimension limits", correct: false },
    ],
    rationale:
      "SSV 2.28 cancels all simultaneously posted prohibitions at once. The general 50 in built-up areas (2.10) is unaffected — only 2.26 cancels it.",
    tags: ["sign:2.28"],
    difficulty: 2,
  },
  {
    id: "q.signs.roundabout.recognition",
    ruleIds: ["signs.roundabout", "priority.roundabout"],
    question:
      "Approaching a roundabout you see the blue disc with three curved arrows (SSV 2.50) above a give-way sign. What must you do?",
    imageAssetId: "2.50.svg",
    imageAlt: "Blue disc with three white curved arrows forming a circle — roundabout (SSV 2.50).",
    options: [
      { text: "Yield to vehicles already inside the roundabout", correct: true },
      { text: "Stop completely before entering, even if the circle is empty", correct: false },
      { text: "Signal left when entering the circle", correct: false },
    ],
    rationale:
      "The roundabout sign combined with give-way (3.02) requires yielding to circulating traffic. No left signal on entry; no full stop required.",
    tags: ["sign:2.50", "roundabout"],
    difficulty: 1,
  },
  {
    id: "q.signs.shared-pedestrian-bicycle.use",
    ruleIds: ["signs.shared-pedestrian-bicycle"],
    question:
      "On a path marked with the SSV 2.53 sign (bicycle and pedestrian together), how should you ride?",
    imageAssetId: "2.53.svg",
    imageAlt: "Blue disc with a bicycle and a pedestrian side by side — shared bike/pedestrian path (SSV 2.53).",
    options: [
      { text: "Ride at low speed and yield to pedestrians", correct: true },
      { text: "Pedestrians must walk on the right edge so cyclists can pass at full speed", correct: false },
      { text: "Cyclists may use it only when no pedestrians are present", correct: false },
    ],
    rationale:
      "On a shared path (2.53), cyclists and pedestrians share the surface; cyclists adapt their speed and yield to walkers.",
    tags: ["sign:2.53", "bicycle"],
    difficulty: 2,
  },
  {
    id: "q.signs.minimum-speed.tunnel",
    ruleIds: ["signs.minimum-speed"],
    question:
      "At a tunnel entrance you see a blue circular '60' sign (SSV 2.56). This means:",
    imageAssetId: "2.56.svg",
    imageAlt: "Blue circular sign with white numeral '60' — minimum speed (SSV 2.56).",
    options: [
      { text: "Vehicles unable to maintain at least 60 km/h must not use the tunnel", correct: true },
      { text: "60 km/h is the maximum permitted speed", correct: false },
      { text: "60 km/h is a recommendation only", correct: false },
    ],
    rationale:
      "A blue circular speed sign sets a minimum. Vehicles unable to meet it must take an alternative route.",
    tags: ["sign:2.56", "speed"],
    difficulty: 2,
  },
  {
    id: "q.signs.snow-chains.required",
    ruleIds: ["signs.snow-chains"],
    question:
      "A pass road shows the 'snow chains required' sign (SSV 2.57) during a snowfall. What must be true of your car?",
    imageAssetId: "2.57.svg",
    imageAlt: "Blue circular sign with a tyre wrapped in chains — snow chains required (SSV 2.57).",
    options: [
      { text: "At least two driving wheels must have snow chains fitted", correct: true },
      { text: "Winter tyres alone are enough to satisfy the sign", correct: false },
      { text: "The sign is purely a recommendation", correct: false },
    ],
    rationale:
      "SSV 2.57 mandates chains on at least two driving wheels. Winter tyres without chains do not satisfy it.",
    tags: ["sign:2.57", "winter"],
    difficulty: 3,
  },
  {
    id: "q.signs.give-way-to-oncoming.bridge",
    ruleIds: ["signs.give-way-to-oncoming"],
    question:
      "On a narrow bridge your side shows the SSV 3.05 sign — black up arrow, red down arrow. You should:",
    imageAssetId: "3.05.svg",
    imageAlt: "Square white sign with a black up arrow and a red down arrow — give way to oncoming (SSV 3.05).",
    options: [
      { text: "Stop short and wait for the oncoming vehicle to pass", correct: true },
      { text: "Cross at low speed in parallel with the oncoming vehicle", correct: false },
      { text: "Sound the horn and continue — you have priority", correct: false },
    ],
    rationale:
      "SSV 3.05 requires you to yield to oncoming traffic on the narrow section. The matching 3.06 faces the other side and grants priority there.",
    tags: ["sign:3.05", "narrow"],
    difficulty: 2,
  },
  {
    id: "q.signs.priority-over-oncoming.use",
    ruleIds: ["signs.priority-over-oncoming"],
    question:
      "You approach a narrow construction contraflow with the SSV 3.06 sign in your direction. You may:",
    imageAssetId: "3.06.svg",
    imageAlt: "Square blue sign with a white up arrow and a red down arrow — priority over oncoming (SSV 3.06).",
    options: [
      { text: "Continue without stopping, but keep speed adapted to view", correct: true },
      { text: "Drive at the posted limit regardless of view", correct: false },
      { text: "Stop and let oncoming traffic pass first", correct: false },
    ],
    rationale:
      "Priority over oncoming (3.06) lets you continue, but VRV Art. 4 still requires speed adapted to conditions.",
    tags: ["sign:3.06", "narrow"],
    difficulty: 2,
  },
  {
    id: "q.signs.end-priority-road.intersection",
    ruleIds: ["signs.end-priority-road", "priority.right-hand.default"],
    question:
      "You are on a priority road and pass the SSV 3.04 sign (priority road struck through). At the next intersection:",
    imageAssetId: "3.04.svg",
    imageAlt: "Yellow diamond sign with a black diagonal stripe through it — end of priority road (SSV 3.04).",
    options: [
      { text: "The right-hand rule applies again unless other signs say otherwise", correct: true },
      { text: "You keep priority for one more intersection", correct: false },
      { text: "Traffic from the left always has priority", correct: false },
    ],
    rationale:
      "SSV 3.04 cancels the priority road. From this point on, the default right-hand rule applies until new signs reassign priority.",
    tags: ["sign:3.04", "priority"],
    difficulty: 2,
  },
  {
    id: "q.signs.junction-right-priority.warning",
    ruleIds: ["signs.junction-right-priority", "priority.right-hand.default"],
    question:
      "You see a black-on-yellow square sign showing a junction with thick lines from the right (SSV 3.10). At the next junction:",
    imageAssetId: "3.10.svg",
    imageAlt: "Yellow square sign on its corner showing a + or T-junction with the right branch in thick black lines — junction with right-hand priority (SSV 3.10).",
    options: [
      { text: "The vehicle from the right has priority — be ready to yield", correct: true },
      { text: "You have priority because your road looks larger", correct: false },
      { text: "Stop is required before entering the junction", correct: false },
    ],
    rationale:
      "SSV 3.10 warns that the right-hand rule applies despite the road's appearance. Yield to traffic from the right.",
    tags: ["sign:3.10", "priority"],
    difficulty: 3,
  },
  {
    id: "q.signs.junction-non-priority.confirm",
    ruleIds: ["signs.junction-non-priority"],
    question:
      "On a road showing the SSV 3.11 sign (priority road with a thinner side road joining):",
    imageAssetId: "3.11.svg",
    imageAlt: "Yellow square sign on its corner showing a thicker through road with a thinner side road meeting it — junction with non-priority side road (SSV 3.11).",
    options: [
      { text: "You keep priority — the joining traffic must yield to you", correct: true },
      { text: "You must yield to traffic on the side road", correct: false },
      { text: "Both roads have equal priority", correct: false },
    ],
    rationale:
      "SSV 3.11 warns of a non-priority road joining yours. You retain priority unless other signs override.",
    tags: ["sign:3.11", "priority"],
    difficulty: 2,
  },
  {
    id: "q.signs.warning-curves.behaviour",
    ruleIds: ["signs.warning-curves"],
    question:
      "You see a 1.02 right-curve warning before a wet bend. The correct technique is to:",
    imageAssetId: "1.02.svg",
    imageAlt: "Red-bordered triangular warning sign showing a curve to the right — right curve (SSV 1.02).",
    options: [
      { text: "Brake on the straight, then steer through the curve at a steady speed", correct: true },
      { text: "Brake hard inside the curve once you can see the exit", correct: false },
      { text: "Maintain speed; the sign is only a suggestion", correct: false },
    ],
    rationale:
      "Brake straight, steer slow: braking inside a curve unsettles the car, especially in the wet. Always reduce speed before the bend.",
    tags: ["sign:1.02", "curve"],
    difficulty: 2,
  },
  {
    id: "q.signs.warning-curves.double",
    ruleIds: ["signs.warning-curves"],
    question:
      "What does a 1.03 sign (double curve, left first) tell you about the second curve?",
    imageAssetId: "1.03.svg",
    imageAlt: "Red-bordered triangular warning sign showing two linked curves, the first to the left — double curve, left first (SSV 1.03).",
    options: [
      { text: "It is a right-hand curve following the left", correct: true },
      { text: "It is another left-hand curve at higher radius", correct: false },
      { text: "There is no second curve — only the left curve is shown", correct: false },
    ],
    rationale:
      "1.03 means the first curve is to the left and the second to the right. Plan your line so both can be taken without sudden steering.",
    tags: ["sign:1.03", "curve"],
    difficulty: 2,
  },
  {
    id: "q.signs.warning-pedestrian-crossing.action",
    ruleIds: ["signs.warning-pedestrian-crossing", "maneuvers.pedestrian-crossing"],
    question:
      "You see a 1.18 sign on a town avenue. The right action is to:",
    imageAssetId: "1.18.svg",
    imageAlt: "Red-bordered triangular warning sign showing a pedestrian on a striped crossing — pedestrian crossing ahead (SSV 1.18).",
    options: [
      { text: "Slow down and watch the kerbs for pedestrians", correct: true },
      { text: "Sound the horn to warn pedestrians off the crossing", correct: false },
      { text: "Overtake the car ahead before reaching the crossing", correct: false },
    ],
    rationale:
      "1.18 announces a crossing further along. Slow, scan the kerbs, and never overtake on the approach to a pedestrian crossing.",
    tags: ["sign:1.18", "pedestrian"],
    difficulty: 1,
  },
  {
    id: "q.signs.warning-slippery.choice",
    ruleIds: ["signs.warning-slippery"],
    question:
      "After a 1.10 'slippery road' sign you should:",
    imageAssetId: "1.10.svg",
    imageAlt: "Red-bordered triangular warning sign showing a car with skid lines — slippery road (SSV 1.10).",
    options: [
      { text: "Reduce speed and avoid sudden steering or braking", correct: true },
      { text: "Brake firmly to test the surface grip", correct: false },
      { text: "Turn off ABS to feel the wheels lock", correct: false },
    ],
    rationale:
      "Smooth inputs preserve grip on slippery surfaces. Sudden steering or braking can trigger a skid.",
    tags: ["sign:1.10", "slippery"],
    difficulty: 1,
  },
  {
    id: "q.signs.warning-tram.behaviour",
    ruleIds: ["signs.warning-tram"],
    question:
      "A 1.17 tram-warning sign appears on a town street. Which statements are correct?",
    imageAssetId: "1.17.svg",
    imageAlt: "Red-bordered triangular warning sign showing a tram silhouette — tram crossing (SSV 1.17).",
    options: [
      { text: "A tram approaching from your left has priority over you", correct: true },
      { text: "Cross the rails as steeply as possible to avoid wheels slipping into the groove", correct: true },
      { text: "Trams must yield to passenger cars at all times", correct: false },
    ],
    rationale:
      "Trams have priority by default (VRV Art. 38) and rails are a real hazard for two-wheelers. Cross at a steep angle.",
    tags: ["sign:1.17", "tram"],
    difficulty: 3,
  },
  {
    id: "q.signs.warning-other-dangers.read-plate",
    ruleIds: ["signs.warning-other-dangers"],
    question:
      "A 1.26 'other dangers' triangle has a 'Smoke' plate underneath. You should:",
    imageAssetId: "1.26.svg",
    imageAlt: "Red-bordered triangular warning sign showing a black exclamation mark — other dangers (SSV 1.26).",
    options: [
      { text: "Slow down and turn on dipped headlights in case visibility drops", correct: true },
      { text: "Switch off all lights to avoid reflection from the smoke", correct: false },
      { text: "Continue at full speed — smoke is only a visual nuisance", correct: false },
    ],
    rationale:
      "1.26 with a plate names the hazard. Smoke can drop visibility quickly — slow and use dipped (not high-beam) headlights.",
    tags: ["sign:1.26"],
    difficulty: 2,
  },
  {
    id: "q.signs.distance-plate.use",
    ruleIds: ["signs.distance-plate"],
    question:
      "A no-overtaking sign (SSV 2.06) has a small white plate beneath reading '300 m' (SSV 5.01). The ban begins:",
    imageAssetId: "5.01.svg",
    imageAlt: "Small white rectangular plate showing a distance in metres — distance to start of restriction (SSV 5.01).",
    options: [
      { text: "300 m further along the road, not at this sign", correct: true },
      { text: "Immediately at this sign and lasts for 300 m", correct: false },
      { text: "Only when an oncoming vehicle is within 300 m", correct: false },
    ],
    rationale:
      "Plate 5.01 indicates the distance to the start of the announced restriction. The sign at the post is a pre-warning.",
    tags: ["sign:5.01", "supplementary"],
    difficulty: 2,
  },
  {
    id: "q.signs.length-plate.use",
    ruleIds: ["signs.length-plate"],
    question:
      "A steep-descent sign (SSV 1.14) carries a '4 km' length plate (SSV 5.02). What does it mean?",
    imageAssetId: "5.02.svg",
    imageAlt: "Small white rectangular plate showing a distance with arrows — length of affected section (SSV 5.02).",
    options: [
      { text: "The descent continues for 4 km — plan engine braking and brake cooling for the full stretch", correct: true },
      { text: "The descent will end in 4 km of road, then a flat section follows immediately", correct: false },
      { text: "There are exactly four hairpin curves in the descent", correct: false },
    ],
    rationale:
      "Plate 5.02 gives the length of the section to which the sign applies. Plan vehicle behaviour for the full distance.",
    tags: ["sign:5.02", "supplementary"],
    difficulty: 3,
  },
  {
    id: "q.signs.icy-road-plate.scope",
    ruleIds: ["signs.icy-road-plate", "signs.warning-slippery"],
    question:
      "A 1.10 slippery-road sign with a 5.05 ice-plate underneath warns of:",
    imageAssetId: "5.05.svg",
    imageAlt: "Small white rectangular plate showing an ice-crystal symbol — icy road surface (SSV 5.05).",
    options: [
      { text: "An icy surface — be ready for very low grip in cold weather", correct: true },
      { text: "Wet leaves only — the plate is irrelevant in summer", correct: false },
      { text: "Aquaplaning risk on rain — ignore in winter", correct: false },
    ],
    rationale:
      "Plate 5.05 narrows the slippery-road warning to ice. Maximum braking distances apply when temperatures fall.",
    tags: ["sign:5.05", "winter"],
    difficulty: 2,
  },
  {
    id: "q.signs.give-way.recognition",
    ruleIds: ["signs.give-way"],
    question: "What does this sign require?",
    imageAssetId: "3.02.svg",
    imageAlt: "Inverted equilateral triangle with a white interior and red border — give way (SSV 3.02).",
    options: [
      { text: "Slow and yield; stop only if necessary to give way", correct: true },
      { text: "Always come to a complete stop at the line", correct: false },
      { text: "Continue at full speed — you have priority", correct: false },
    ],
    rationale:
      "Give way (SSV 3.02) requires yielding without a mandatory stop. If the way is clear, you may roll through.",
    tags: ["sign:3.02"],
    difficulty: 1,
  },
  {
    id: "q.signs.no-overtaking.recognition",
    ruleIds: ["signs.no-overtaking"],
    question: "What does this sign mean?",
    imageAssetId: "2.06.svg",
    imageAlt: "Round white sign with red border showing two cars side by side, the right-hand car red — no overtaking (SSV 2.06).",
    options: [
      { text: "Overtaking motor vehicles is prohibited", correct: true },
      { text: "Overtaking by trucks only is prohibited", correct: false },
      { text: "Two-way traffic ahead", correct: false },
    ],
    rationale:
      "SSV 2.06 prohibits overtaking motor vehicles. Slow vehicles (<30 km/h) and bicycles remain overtake-able.",
    tags: ["sign:2.06"],
    difficulty: 1,
  },
  {
    id: "q.signs.priority-road.recognition",
    ruleIds: ["signs.priority-road"],
    question: "What does this sign mean?",
    imageAssetId: "3.03.svg",
    imageAlt: "Square sign tipped on its corner with a yellow inner diamond — priority road (SSV 3.03).",
    options: [
      { text: "You are on the priority road; the right-hand rule does not apply at intersections", correct: true },
      { text: "You must yield to traffic from your right at the next intersection", correct: false },
      { text: "End of priority road", correct: false },
    ],
    rationale:
      "SSV 3.03 grants priority at all intersections until cancelled by 3.04 or overridden locally.",
    tags: ["sign:3.03"],
    difficulty: 1,
  },
  {
    id: "q.signs.children-warning.recognition",
    ruleIds: ["signs.children-warning"],
    question: "What does this sign warn of?",
    imageAssetId: "1.19.svg",
    imageAlt: "Red-bordered triangular warning sign showing two running child silhouettes — children (SSV 1.19).",
    options: [
      { text: "Children are likely on or near the road — slow down and watch", correct: true },
      { text: "A school zone with a 30 km/h limit", correct: false },
      { text: "A play street where motor traffic is forbidden", correct: false },
    ],
    rationale:
      "1.19 is a warning. It does not lower the limit, but VRV Art. 4 requires a speed adapted to conditions — usually well below the posted limit near schools.",
    tags: ["sign:1.19"],
    difficulty: 2,
  },
  {
    id: "q.signs.bicycle-path.vs-shared",
    ruleIds: ["signs.bicycle-path", "signs.shared-pedestrian-bicycle"],
    question:
      "On the bicycle-only sign (SSV 2.51), pedestrians are:",
    options: [
      { text: "Not allowed — they belong on the shared sign 2.53 or on a footway", correct: true },
      { text: "Allowed if they walk on the right edge", correct: false },
      { text: "Allowed only when no cyclists are present", correct: false },
    ],
    rationale:
      "2.51 reserves the path for bicycles. Pedestrians use 2.52 (pedestrian path) or 2.53 (shared).",
    tags: ["sign:2.51", "sign:2.53"],
    difficulty: 3,
  },
  {
    id: "q.signs.no-overtaking.applies.cancelled-by",
    ruleIds: ["signs.no-overtaking", "signs.end-overtaking-ban"],
    question:
      "A no-overtaking ban (SSV 2.06) is cancelled by:",
    options: [
      { text: "The end-of-overtaking-ban sign (SSV 2.27)", correct: true },
      { text: "The end-of-all-restrictions sign (SSV 2.28)", correct: true },
      { text: "Crossing into a built-up area marked with 2.10", correct: false },
    ],
    rationale:
      "Both 2.27 (specific) and 2.28 (general 'Freie Fahrt') cancel the overtaking ban. Entering a built-up area does not.",
    tags: ["sign:2.06", "sign:2.27", "sign:2.28"],
    difficulty: 3,
  },

  // ---------- maneuvers ----------
  {
    id: "q.maneuvers.pedestrian-crossing",
    ruleIds: ["maneuvers.pedestrian-crossing"],
    question:
      "A pedestrian waits at the kerb of a zebra crossing, looking to cross. You must:",
    options: [
      { text: "Stop to let them cross", correct: true },
      { text: "Sound the horn to let them proceed", correct: false },
      { text: "Continue if you arrived first", correct: false },
    ],
    rationale:
      "You must yield to pedestrians on, or clearly intending to be on, the crossing (VRV Art. 33).",
    tags: ["pedestrian"],
    difficulty: 1,
  },
  {
    id: "q.maneuvers.pedestrian-overtake",
    ruleIds: ["maneuvers.pedestrian-crossing"],
    question: "Which are forbidden on the approach to a pedestrian crossing?",
    options: [
      { text: "Overtaking another vehicle", correct: true },
      { text: "Stopping to yield to a pedestrian", correct: false },
      { text: "Parking within 10 m before the crossing", correct: true },
    ],
    rationale:
      "You may not overtake on the approach, and parking is prohibited within 10 m before the crossing to preserve visibility.",
    tags: ["pedestrian"],
    difficulty: 3,
  },
  {
    id: "q.maneuvers.keep-right",
    ruleIds: ["maneuvers.keep-right"],
    question:
      "After overtaking a slower car on a two-lane motorway, you should:",
    options: [
      { text: "Return to the right lane as soon as you can without forcing the overtaken car to brake", correct: true },
      { text: "Stay in the left lane to maintain a higher cruising speed", correct: false },
      { text: "Wait until the next exit before moving back right", correct: false },
    ],
    rationale:
      "Lane discipline (SVG Art. 34): finish the overtake, return to the right. Lingering in the left lane is a fault.",
    tags: ["lane", "highway"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.lane-change",
    ruleIds: ["maneuvers.lane-change", "vehicle.mirrors-blindspot"],
    question:
      "Before changing lanes you must (select all correct):",
    options: [
      { text: "Check mirrors and the appropriate blind spot", correct: true },
      { text: "Signal in time so other drivers can react", correct: true },
      { text: "Brake gently before initiating the change", correct: false },
    ],
    rationale:
      "Mirrors, blind-spot check, indicator, manoeuvre — without forcing anyone to brake. Pre-braking is unnecessary and unexpected.",
    tags: ["lane-change", "mirrors"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.overtaking-left",
    ruleIds: ["maneuvers.overtaking-left"],
    question:
      "You catch a slow lorry on a country road approaching a curve with limited sight. You should:",
    options: [
      { text: "Wait for a clear sight line before starting the overtake", correct: true },
      { text: "Begin overtaking and abort if oncoming traffic appears", correct: false },
      { text: "Pass on the right where the verge is wide", correct: false },
    ],
    rationale:
      "Overtake only when you have full forward visibility and can complete it safely. Aborting mid-overtake is a high-risk recovery, not a plan.",
    tags: ["overtaking"],
    difficulty: 3,
  },
  {
    id: "q.maneuvers.undertaking-ban",
    ruleIds: ["maneuvers.undertaking-ban"],
    question:
      "On a free-flowing motorway, the right lane is empty while a car cruises in the middle lane at 100 km/h. You may:",
    options: [
      { text: "Use the left lane to overtake; passing on the right is prohibited", correct: true },
      { text: "Pass on the right since the right lane is clear", correct: false },
      { text: "Tailgate to pressure the middle-lane driver to move over", correct: false },
    ],
    rationale:
      "Undertaking on motorways is forbidden in free-flowing traffic. Tailgating compounds the offence.",
    tags: ["motorway"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.parking-distances",
    ruleIds: ["maneuvers.parking-distances"],
    question:
      "Which of the following parking spots are forbidden?",
    options: [
      { text: "Within 10 m before a pedestrian crossing", correct: true },
      { text: "Directly in front of a private driveway", correct: true },
      { text: "20 m before an intersection corner on a wide street", correct: false },
    ],
    rationale:
      "Parking is forbidden within 5 m of an intersection, 10 m before a pedestrian crossing, and in front of driveways (VRV Art. 19). 20 m clears the corner exclusion.",
    tags: ["parking"],
    difficulty: 3,
  },
  {
    id: "q.maneuvers.u-turn",
    ruleIds: ["maneuvers.u-turn"],
    question:
      "On a quiet two-lane road with clear sight in both directions and no nearby junction, a U-turn is:",
    options: [
      { text: "Permitted, after signalling and yielding to any approaching traffic", correct: true },
      { text: "Always forbidden outside built-up areas", correct: false },
      { text: "Permitted only if the road is more than 8 m wide", correct: false },
    ],
    rationale:
      "U-turns are allowed where they do not endanger or obstruct traffic, with proper signalling and yielding.",
    tags: ["u-turn"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.reversing",
    ruleIds: ["maneuvers.reversing"],
    question:
      "You miss your motorway exit. You should:",
    options: [
      { text: "Continue to the next exit and turn around there", correct: true },
      { text: "Reverse carefully along the hard shoulder to the missed exit", correct: false },
      { text: "Make a U-turn through the central crossover", correct: false },
    ],
    rationale:
      "Reversing on motorways is prohibited, as is using the central reservation. Continue to the next exit.",
    tags: ["reversing", "motorway"],
    difficulty: 1,
  },
  {
    id: "q.maneuvers.tunnel-behavior",
    ruleIds: ["maneuvers.tunnel-behavior"],
    question:
      "Before entering a long road tunnel you must:",
    options: [
      { text: "Switch on low beams and remove sunglasses", correct: true },
      { text: "Switch on high beams to compensate for darkness", correct: false },
      { text: "Switch off all lights to avoid dazzling others", correct: false },
    ],
    rationale:
      "Low beams on, sunglasses off, ≥2-second gap. High beams dazzle other drivers in the tunnel.",
    tags: ["tunnel"],
    difficulty: 1,
  },
  {
    id: "q.maneuvers.signalling",
    ruleIds: ["maneuvers.signalling"],
    question:
      "You complete an overtake and prepare to return to the right lane. Correct signalling is:",
    options: [
      { text: "Cancel the left signal and briefly signal right before moving back", correct: true },
      { text: "Leave the left signal on until you are settled in the right lane", correct: false },
      { text: "Move back without signalling — the manoeuvre is obvious", correct: false },
    ],
    rationale:
      "Signal what you intend to do, in time for others to read it. The right signal warns the overtaken driver you're returning.",
    tags: ["signalling"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.hazard-lights",
    ruleIds: ["maneuvers.hazard-lights"],
    question:
      "Which of these are correct uses of hazard lights?",
    options: [
      { text: "Warning following traffic of a forming queue ahead on a motorway", correct: true },
      { text: "Indicating you're about to make an unusual lane change", correct: false },
      { text: "Justifying a brief illegal stop to drop someone off", correct: false },
    ],
    rationale:
      "Hazard lights warn of imminent danger (queue ahead, breakdown, accident). They are not a substitute for indicators or for legal parking (VRV Art. 29).",
    tags: ["hazard-lights"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.seatbelt",
    ruleIds: ["maneuvers.seatbelt", "vehicle.child-seat"],
    question:
      "A 9-year-old, 145 cm tall child travels in the back seat. The legal restraint is:",
    options: [
      { text: "An approved booster seat plus the adult belt", correct: true },
      { text: "The adult seatbelt only — the child is over 8", correct: false },
      { text: "No restraint — the back seat is exempt for children over 8", correct: false },
    ],
    rationale:
      "Children under 12 and shorter than 150 cm need an approved restraint. 145 cm requires a booster (VRV Art. 3a).",
    tags: ["seatbelt", "children"],
    difficulty: 2,
  },

  // ---------- speeds ----------
  {
    id: "q.speeds.country-road",
    ruleIds: ["speeds.default-limits"],
    question:
      "You are on an unsigned rural road outside any town. The speed limit is:",
    options: [
      { text: "80 km/h", correct: true },
      { text: "100 km/h", correct: false },
      { text: "50 km/h", correct: false },
    ],
    rationale:
      "Default: 80 km/h outside built-up areas, 50 km/h inside, 100 on expressways, 120 on motorways (VRV Art. 4a).",
    tags: ["speed"],
    difficulty: 1,
    de: {
      question:
        "Sie fahren auf einer nicht signalisierten Strasse ausserorts. Welche Höchstgeschwindigkeit gilt?",
      options: ["80 km/h", "100 km/h", "50 km/h"],
      rationale:
        "Allgemeinhöchstgeschwindigkeit: 80 km/h ausserorts, 50 km/h innerorts, 100 km/h auf Autostrassen, 120 km/h auf Autobahnen (VRV Art. 4a).",
    },
  },
  {
    id: "q.speeds.town-sign",
    ruleIds: ["speeds.default-limits"],
    question: "You pass the blue place-name sign entering a village. From this point:",
    options: [
      { text: "50 km/h applies until the end-of-town sign", correct: true },
      { text: "80 km/h applies until the next posted sign", correct: false },
      { text: "30 km/h applies by default", correct: false },
    ],
    rationale:
      "The place-name sign triggers the 50 km/h general-town limit. Tempo-30 applies only when explicitly zoned.",
    tags: ["speed"],
    difficulty: 2,
    de: {
      question:
        "Sie passieren die blaue Ortstafel beim Eintritt in ein Dorf. Ab hier:",
      options: [
        "Gilt 50 km/h bis zur Ende-Ortstafel",
        "Gilt 80 km/h bis zum nächsten Geschwindigkeitssignal",
        "Gilt 30 km/h als Standardwert",
      ],
      rationale:
        "Die Ortstafel löst die Allgemeinhöchstgeschwindigkeit innerorts von 50 km/h aus. Tempo-30 gilt nur in entsprechend signalisierten Zonen.",
    },
  },
  {
    id: "q.speeds.tempo30.rules",
    ruleIds: ["speeds.tempo30", "priority.right-hand.default"],
    question: "Inside a Tempo-30 zone, which two statements are true?",
    options: [
      { text: "The limit is 30 km/h", correct: true },
      { text: "Right-of-way from the right applies at each intersection", correct: true },
      { text: "Zebra crossings are mandatory at every junction", correct: false },
    ],
    rationale:
      "Tempo-30 zones omit zebras intentionally — pedestrians cross anywhere and drivers must adjust speed to yield.",
    tags: ["zone", "tempo30"],
    difficulty: 3,
    de: {
      question: "Welche beiden Aussagen zur Tempo-30-Zone sind richtig?",
      options: [
        "Die Höchstgeschwindigkeit beträgt 30 km/h",
        "An jeder Verzweigung gilt der Rechtsvortritt",
        "An jeder Verzweigung muss ein Fussgängerstreifen markiert sein",
      ],
      rationale:
        "Tempo-30-Zonen verzichten bewusst auf Fussgängerstreifen — Fussgänger queren überall, Fahrzeuge müssen die Geschwindigkeit so anpassen, dass sie den Vortritt gewähren können.",
    },
  },
  {
    id: "q.speeds.motorway-minimum",
    ruleIds: ["speeds.motorway-minimum"],
    question:
      "Which vehicles are not allowed on Swiss motorways?",
    options: [
      { text: "An agricultural tractor regardless of speed", correct: true },
      { text: "An E-bike limited to 45 km/h", correct: true },
      { text: "A passenger car capable of 110 km/h", correct: false },
    ],
    rationale:
      "Motorways require a vehicle that can sustain ≥60 km/h and is a road-legal motor vehicle. Tractors and slow E-bikes are excluded (VRV Art. 35).",
    tags: ["motorway"],
    difficulty: 2,
    de: {
      question:
        "Welche Fahrzeuge sind auf der Schweizer Autobahn nicht zugelassen?",
      options: [
        "Ein landwirtschaftlicher Traktor, unabhängig von der erreichten Geschwindigkeit",
        "Ein auf 45 km/h begrenztes E-Bike",
        "Ein Personenwagen, der 110 km/h erreicht",
      ],
      rationale:
        "Die Autobahn ist Motorfahrzeugen vorbehalten, die in der Ebene ≥60 km/h erreichen und verkehrszugelassen sind. Traktoren und langsame E-Bikes sind ausgeschlossen (VRV Art. 35).",
    },
  },
  {
    id: "q.speeds.trailer-reduced",
    ruleIds: ["speeds.trailer-reduced"],
    question:
      "You drive a Cat. B car towing a small trailer on the motorway. The maximum speed is:",
    options: [
      { text: "80 km/h", correct: true },
      { text: "100 km/h", correct: false },
      { text: "120 km/h, the same as without a trailer", correct: false },
    ],
    rationale:
      "Towing reduces the limit to 80 km/h on all roads, including motorways (VRV Art. 5).",
    tags: ["trailer", "speed"],
    difficulty: 1,
    de: {
      question:
        "Sie fahren einen Cat.-B-Personenwagen mit kleinem Anhänger auf der Autobahn. Die Höchstgeschwindigkeit beträgt:",
      options: ["80 km/h", "100 km/h", "120 km/h, gleich wie ohne Anhänger"],
      rationale:
        "Mit Anhänger gilt auf allen Strassen 80 km/h, auch auf der Autobahn (VRV Art. 5).",
    },
  },
  {
    id: "q.speeds.begegnungszone",
    ruleIds: ["speeds.begegnungszone"],
    question:
      "Inside a Begegnungszone, which statements are correct?",
    options: [
      { text: "Maximum speed is 20 km/h", correct: true },
      { text: "Pedestrians have priority over vehicles", correct: true },
      { text: "Parking is allowed anywhere on the street", correct: false },
    ],
    rationale:
      "Begegnungszone (SSV Art. 22b): 20 km/h, pedestrian priority, parking only in marked bays.",
    tags: ["zone", "begegnungszone"],
    difficulty: 2,
    de: {
      question: "Welche Aussagen zur Begegnungszone sind richtig?",
      options: [
        "Die Höchstgeschwindigkeit beträgt 20 km/h",
        "Fussgänger haben Vortritt vor Fahrzeugen",
        "Parkieren ist auf der ganzen Strasse erlaubt",
      ],
      rationale:
        "Begegnungszone (SSV Art. 22b): 20 km/h, Vortritt für Fussgänger, Parkieren nur auf markierten Feldern.",
    },
  },
  {
    id: "q.speeds.adapted-speed",
    ruleIds: ["speeds.adapted-speed"],
    question:
      "Heavy fog reduces visibility to roughly 60 m on a road posted at 80 km/h. You should:",
    options: [
      { text: "Slow well below 80 km/h so you can stop within the visible distance", correct: true },
      { text: "Maintain 80 because it is the posted limit", correct: false },
      { text: "Slow to 70 km/h — that is enough for fog", correct: false },
    ],
    rationale:
      "VRV Art. 4 requires speed adapted to conditions. Visibility 60 m on 80 km/h roads is far too fast — typically you'd be at 40 km/h or less.",
    tags: ["speed", "fog"],
    difficulty: 2,
    de: {
      question:
        "Dichter Nebel reduziert die Sicht auf rund 60 m auf einer 80er-Strasse. Sie sollten:",
      options: [
        "Die Geschwindigkeit deutlich unter 80 km/h reduzieren, damit Sie innerhalb der Sichtweite anhalten können",
        "80 km/h beibehalten, weil die signalisierte Höchstgeschwindigkeit gilt",
        "Auf 70 km/h reduzieren — das reicht bei Nebel",
      ],
      rationale:
        "VRV Art. 4 verlangt eine den Verhältnissen angepasste Geschwindigkeit. 60 m Sicht bei 80 km/h ist viel zu schnell — meist sind 40 km/h oder weniger angemessen.",
    },
  },
  {
    id: "q.speeds.school-approach",
    ruleIds: ["speeds.school-approach", "speeds.adapted-speed"],
    question:
      "You approach a school on a 50 km/h road at school dismissal time, with parked cars along both kerbs. The right speed is:",
    options: [
      { text: "Well below 50 — children can step out from between parked cars", correct: true },
      { text: "Exactly 50 because the limit has not changed", correct: false },
      { text: "Whatever speed lets you keep up with the car ahead", correct: false },
    ],
    rationale:
      "Adapt speed to conditions (VRV Art. 4). At school exit time with view obstructed, 30 km/h is often sensible even where 50 is posted.",
    tags: ["children", "school"],
    difficulty: 2,
    de: {
      question:
        "Sie nähern sich zu Schulschluss einer Schule auf einer 50er-Strasse mit parkierten Fahrzeugen an beiden Strassenrändern. Die angepasste Geschwindigkeit ist:",
      options: [
        "Deutlich unter 50 — Kinder können zwischen parkierten Fahrzeugen hervortreten",
        "Genau 50, weil die Höchstgeschwindigkeit unverändert bleibt",
        "So schnell, wie es das vorausfahrende Fahrzeug zulässt",
      ],
      rationale:
        "Geschwindigkeit den Verhältnissen anpassen (VRV Art. 4). Bei Schulschluss und eingeschränkter Sicht sind 30 km/h häufig angemessen, auch wenn 50 signalisiert ist.",
    },
  },

  // ---------- mountain ----------
  {
    id: "q.mountain.narrow-pass",
    ruleIds: ["mountain.ascending"],
    question:
      "Two cars meet on a single-lane alpine road. Neither has a nearby passing place. Who reverses?",
    options: [
      { text: "The descending vehicle", correct: true },
      { text: "The ascending vehicle", correct: false },
      { text: "The smaller vehicle", correct: false },
    ],
    rationale:
      "Mountain-road rule: ascending has priority because reversing uphill is harder and less safe (VRV Art. 38).",
    tags: ["mountain"],
    difficulty: 3,
  },
  {
    id: "q.mountain.chains-mandatory",
    ruleIds: ["mountain.chains-mandatory"],
    question:
      "You see a circular blue sign showing a tyre with chains at the start of a pass. You must:",
    options: [
      { text: "Fit chains to at least two driving wheels before continuing", correct: true },
      { text: "Switch to four-wheel drive only", correct: false },
      { text: "Continue cautiously since the road looks dry below the sign", correct: false },
    ],
    rationale:
      "Sign 2.48 makes chains mandatory regardless of current surface — the sign overrides individual judgement.",
    tags: ["winter", "mountain"],
    difficulty: 2,
  },
  {
    id: "q.mountain.descending-gear",
    ruleIds: ["mountain.descending-gear"],
    question:
      "Halfway down a long alpine descent you smell hot brakes. The right action is to:",
    options: [
      { text: "Pull over safely, let brakes cool, and use a lower gear afterwards", correct: true },
      { text: "Brake harder to slow down before the brakes fail", correct: false },
      { text: "Shift into neutral to take load off the brakes", correct: false },
    ],
    rationale:
      "Hot brakes mean fade is imminent. Cool them, use engine braking in a lower gear from then on. Neutral is dangerous — you lose engine braking entirely.",
    tags: ["mountain", "braking"],
    difficulty: 3,
  },
  {
    id: "q.mountain.headlights",
    ruleIds: ["mountain.headlights"],
    question:
      "Approaching a short unlit gallery on an alpine road, you should:",
    options: [
      { text: "Switch on low beams before you enter", correct: true },
      { text: "Rely on daytime running lights — they suffice in galleries", correct: false },
      { text: "Switch on high beams to be sure you see clearly", correct: false },
    ],
    rationale:
      "DRLs often leave the rear lights off; in a gallery this is unlawful and unsafe. Low beams ensure both front and rear are lit.",
    tags: ["mountain", "lights"],
    difficulty: 2,
  },
  {
    id: "q.mountain.heavy-vehicle-priority",
    ruleIds: ["mountain.heavy-vehicle-priority", "mountain.ascending"],
    question:
      "Your car descends a single-lane alpine road and meets a coach ascending. There is a passing bay 5 m behind you. The other side has nothing for 200 m. You:",
    options: [
      { text: "Reverse uphill into the nearby bay so the coach can continue", correct: true },
      { text: "Hold position and ask the coach to back up because you arrived first", correct: false },
      { text: "Drive past on the verge", correct: false },
    ],
    rationale:
      "Ascending vehicle has priority; the closer passing place rule still applies. The bay behind you is closer than the coach's options ahead.",
    tags: ["mountain", "heavy-vehicle"],
    difficulty: 3,
  },

  // ---------- adverse-conditions ----------
  {
    id: "q.adverse.aquaplaning",
    ruleIds: ["adverse.aquaplaning"],
    question: "At speed the steering suddenly feels light in heavy rain. You:",
    options: [
      { text: "Lift off the accelerator and keep the wheel straight", correct: true },
      { text: "Brake hard to regain control", correct: false },
      { text: "Steer briskly to check for grip", correct: false },
    ],
    rationale:
      "Aquaplaning response: reduce speed gradually without hard inputs, let tyres regain contact.",
    tags: ["rain"],
    difficulty: 3,
  },
  {
    id: "q.adverse.fog-lights",
    ruleIds: ["adverse.fog-lights"],
    question:
      "Visibility on the motorway has improved from 30 m to 200 m. Which is correct?",
    options: [
      { text: "Switch off the rear fog lamp immediately — leaving it on is an offence", correct: true },
      { text: "Leave the rear fog lamp on as a precaution", correct: false },
      { text: "Switch from low beams to high beams", correct: false },
    ],
    rationale:
      "Rear fog lamp dazzles trailing drivers in clear visibility; turn it off as soon as visibility improves above ~50 m.",
    tags: ["fog", "lights"],
    difficulty: 2,
  },
  {
    id: "q.adverse.winter-tires",
    ruleIds: ["adverse.winter-tires"],
    question:
      "You have an accident on summer tyres after a snowfall in November. Which statements are correct?",
    options: [
      { text: "You may be held liable because tyres were inappropriate to conditions", correct: true },
      { text: "Insurance can reduce payout for clearly inadequate tyres", correct: true },
      { text: "Swiss law fixes a calendar date by which winter tyres are mandatory", correct: false },
    ],
    rationale:
      "Switzerland uses a 'tyres appropriate to conditions' rule, not fixed dates. Liability and insurance reduction follow from the choice of tyre, not the calendar.",
    tags: ["winter", "tyres"],
    difficulty: 2,
  },
  {
    id: "q.adverse.black-ice",
    ruleIds: ["adverse.black-ice"],
    question:
      "Early morning on a rural road near 0 °C you cross a bridge that looks shiny black. The safest response is to:",
    options: [
      { text: "Reduce speed and avoid sudden braking or steering", correct: true },
      { text: "Brake firmly to test grip", correct: false },
      { text: "Steer sharply to one side to check the surface", correct: false },
    ],
    rationale:
      "Bridges and shaded sections are black-ice hotspots. Test grip with a gentle brake on a clear stretch — never with sudden inputs on the suspect surface.",
    tags: ["ice", "winter"],
    difficulty: 3,
  },
  {
    id: "q.adverse.night-glare",
    ruleIds: ["adverse.night-glare"],
    question:
      "A car approaches on a rural road with high beams. You're dazzled. You should:",
    options: [
      { text: "Slow down and look towards the right edge of your lane", correct: true },
      { text: "Match their high beams to retaliate", correct: false },
      { text: "Maintain speed since the dazzle will pass quickly", correct: false },
    ],
    rationale:
      "When dazzled, slow and shift gaze to the right edge to keep the car in its lane until the oncoming vehicle has passed.",
    tags: ["night", "lights"],
    difficulty: 2,
  },

  // ---------- vehicle ----------
  {
    id: "q.vehicle.drl",
    ruleIds: ["vehicle.headlights-day"],
    question: "You set off for a short daytime drive in clear weather. What must be on?",
    options: [
      { text: "Daytime running lights or low beams", correct: true },
      { text: "High beams", correct: false },
      { text: "Fog lights", correct: false },
    ],
    rationale:
      "Since 2014, DRLs or low beams must be lit whenever the vehicle is moving (VRV Art. 41).",
    tags: ["lights"],
    difficulty: 1,
  },
  {
    id: "q.vehicle.tyre-tread-minimum",
    ruleIds: ["vehicle.tyre-tread-minimum"],
    question:
      "The minimum legal tread depth on car tyres in Switzerland is:",
    options: [
      { text: "1.6 mm in the primary grooves", correct: true },
      { text: "3 mm year-round", correct: false },
      { text: "4 mm for winter, no minimum for summer", correct: false },
    ],
    rationale:
      "VTS Art. 58: 1.6 mm minimum. Sensible replacement is well above this, especially for winter tyres.",
    tags: ["tyres"],
    difficulty: 1,
  },
  {
    id: "q.vehicle.mirrors-blindspot",
    ruleIds: ["vehicle.mirrors-blindspot"],
    question:
      "You change from the middle to the right lane on a motorway. Which checks are essential?",
    options: [
      { text: "Interior mirror, right exterior mirror, and a glance over the right shoulder", correct: true },
      { text: "Interior mirror only — the right exterior mirror covers the rest", correct: false },
      { text: "Look only over the right shoulder; mirrors waste time", correct: false },
    ],
    rationale:
      "Mirrors leave a blind spot. A shoulder check catches what the mirrors miss — especially small vehicles on the right.",
    tags: ["mirrors", "blind-spot"],
    difficulty: 2,
  },
  {
    id: "q.vehicle.insurance-minimum",
    ruleIds: ["vehicle.insurance-minimum"],
    question:
      "What insurance must every motor vehicle in Switzerland carry?",
    options: [
      { text: "Third-party liability (Haftpflicht / RC)", correct: true },
      { text: "Comprehensive (Vollkasko)", correct: false },
      { text: "Legal-defence insurance", correct: false },
    ],
    rationale:
      "Only Haftpflicht is mandatory (SVG Art. 63). Kasko coverage is optional, often required by leasing companies.",
    tags: ["insurance"],
    difficulty: 1,
  },
  {
    id: "q.vehicle.registration-card",
    ruleIds: ["vehicle.registration-card"],
    question:
      "You realise mid-trip that you left the Fahrzeugausweis at home. The legal position is:",
    options: [
      { text: "You committed a fault by driving without it, even if no one checks", correct: true },
      { text: "Carrying the licence alone is sufficient", correct: false },
      { text: "Only commercial drivers need to carry the registration card", correct: false },
    ],
    rationale:
      "SVG Art. 10: licence and Fahrzeugausweis must be on you while driving. The fault is committed at departure.",
    tags: ["papers"],
    difficulty: 2,
  },
  {
    id: "q.vehicle.load-securing",
    ruleIds: ["vehicle.load-securing"],
    question:
      "A ladder on your roof rack projects 1.5 m beyond the rear bumper. You must mark it with:",
    options: [
      { text: "A red warning cloth by day; a red marker light at night", correct: true },
      { text: "Hazard lights only", correct: false },
      { text: "Nothing — only projections over 2 m need marking", correct: false },
    ],
    rationale:
      "Loads projecting more than 1 m at the rear must be marked: red cloth daylight, red light at night (VRV Art. 30).",
    tags: ["load"],
    difficulty: 3,
  },
  {
    id: "q.vehicle.lighting-inspection",
    ruleIds: ["vehicle.lighting-inspection"],
    question:
      "Which of these are legally required to function on a passenger car?",
    options: [
      { text: "Brake lights and indicators", correct: true },
      { text: "Number-plate light and rear position lights", correct: true },
      { text: "Interior cabin reading light", correct: false },
    ],
    rationale:
      "VTS Art. 76 lists mandatory exterior lighting. Interior lights are convenience features, not safety equipment for the road.",
    tags: ["lights"],
    difficulty: 2,
  },
  {
    id: "q.vehicle.warning-triangle",
    ruleIds: ["vehicle.warning-triangle"],
    question:
      "You break down on the hard shoulder of a motorway. Where do you place the warning triangle?",
    options: [
      { text: "At least 100 m behind the vehicle", correct: true },
      { text: "Right next to the vehicle so it is easy to set up", correct: false },
      { text: "Across the lane to force traffic to slow", correct: false },
    ],
    rationale:
      "Motorway breakdown: ≥100 m behind so approaching vehicles see the warning in time at high speed (VRV Art. 23).",
    tags: ["breakdown"],
    difficulty: 2,
  },
  {
    id: "q.vehicle.child-seat",
    ruleIds: ["vehicle.child-seat"],
    question:
      "A baby in a rear-facing child seat is placed on the front passenger seat. The mandatory action is:",
    options: [
      { text: "Deactivate the front passenger airbag before the trip", correct: true },
      { text: "Move the seat as far forward as possible", correct: false },
      { text: "Use the regular adult seatbelt without anchors", correct: false },
    ],
    rationale:
      "An active front airbag is fatal to a rear-facing child in a crash. Deactivate it or place the seat in the back (VRV Art. 3a).",
    tags: ["child-seat"],
    difficulty: 2,
  },

  // ---------- driver-fitness ----------
  {
    id: "q.fitness.fatigue-break",
    ruleIds: ["fitness.fatigue-break"],
    question:
      "Halfway through a long highway drive you realise you can't recall the last several kilometres. What should you do?",
    options: [
      { text: "Stop at the next rest area to sleep or fully revive before continuing", correct: true },
      { text: "Open a window and turn up the radio to push through the next hour", correct: false },
      { text: "Speed up so you reach the destination before the tiredness gets worse", correct: false },
    ],
    rationale:
      "Microsleep and lost-time recall are red-flag fatigue signs. SVG Art. 31 requires you to remain capable of controlling the vehicle — you must stop, not mask the symptoms.",
    tags: ["fatigue", "highway"],
    difficulty: 2,
  },
  {
    id: "q.fitness.medications",
    ruleIds: ["fitness.medications"],
    question:
      "You took a prescription painkiller with a 'may cause drowsiness' warning two hours ago and feel slightly slow. You should:",
    options: [
      { text: "Not drive until the medication's effect has worn off", correct: true },
      { text: "Drive carefully and avoid the motorway", correct: false },
      { text: "Drink coffee and proceed normally", correct: false },
    ],
    rationale:
      "Driving while medication impairs you is treated as driving unfit (SVG Art. 31 Abs. 2), independent of alcohol.",
    tags: ["medication"],
    difficulty: 2,
  },
  {
    id: "q.fitness.eyewear",
    ruleIds: ["fitness.eyewear"],
    question:
      "Your driving licence carries a glasses-required condition. You forget your glasses at home before a trip. You may:",
    options: [
      { text: "Not drive — driving without the prescribed aid breaches the licence condition", correct: true },
      { text: "Drive a short distance to fetch them", correct: false },
      { text: "Drive if you feel you can see well enough", correct: false },
    ],
    rationale:
      "Licence conditions are absolute. Driving without the aid is driving without the appropriate licence for that journey (VZV Art. 7).",
    tags: ["vision"],
    difficulty: 1,
  },
  {
    id: "q.fitness.max-driving-hours",
    ruleIds: ["fitness.max-driving-hours"],
    question:
      "You are a private driver on a long holiday trip. The sensible practice is to:",
    options: [
      { text: "Take a break of about 15 minutes every two hours of driving", correct: true },
      { text: "Drive continuously to make the best time", correct: false },
      { text: "Stop only if you actually fall asleep at the wheel", correct: false },
    ],
    rationale:
      "ARV does not bind private drivers, but VRV Art. 2 still requires fitness. Reaction time degrades sharply after about 2–3 hours of continuous driving.",
    tags: ["fatigue"],
    difficulty: 1,
  },
  {
    id: "q.fitness.illness",
    ruleIds: ["fitness.illness"],
    question:
      "You've had high fever for three days and feel only slightly better today. You should:",
    options: [
      { text: "Wait until clearly recovered before driving again", correct: true },
      { text: "Drive — feeling 'a bit better' is recovery enough", correct: false },
      { text: "Drive only on side streets to avoid risk", correct: false },
    ],
    rationale:
      "Acute illness impairs reaction time. SVG Art. 31 Abs. 2 requires you to be fit before driving.",
    tags: ["illness"],
    difficulty: 1,
  },
  {
    id: "q.fitness.distraction-phone",
    ruleIds: ["fitness.distraction-phone"],
    question:
      "Which is permitted while driving?",
    options: [
      { text: "Answering a call via a hands-free system", correct: true },
      { text: "Reading a WhatsApp notification at 80 km/h", correct: false },
      { text: "Holding a phone between shoulder and ear", correct: false },
    ],
    rationale:
      "Handheld phone use is forbidden; hands-free is allowed if it does not consume your attention. Reading a screen at 80 km/h is grave inattention (VRV Art. 3).",
    tags: ["phone"],
    difficulty: 1,
  },

  // ---------- penalties-bac ----------
  {
    id: "q.fitness.bac.novice",
    ruleIds: ["fitness.bac-novice"],
    question: "You hold a probationary licence. What is your effective BAC limit?",
    options: [
      { text: "Below 0.1‰ — effectively zero", correct: true },
      { text: "Below 0.5‰ like regular drivers", correct: false },
      { text: "Below 0.8‰", correct: false },
    ],
    rationale:
      "Probationary drivers (first three years) must be below 0.1‰. Read this as: do not drink and drive at all.",
    tags: ["alcohol", "novice"],
    difficulty: 1,
    de: {
      question:
        "Sie besitzen einen Führerausweis auf Probe. Welche Promillegrenze gilt für Sie?",
      options: [
        "Unter 0,1‰ — praktisch null",
        "Unter 0,5‰ wie bei Fahrern ohne Probezeit",
        "Unter 0,8‰",
      ],
      rationale:
        "In der Probezeit (die ersten drei Jahre) gilt eine Grenze unter 0,1‰. Sinngemäss: gar nicht trinken und fahren.",
    },
  },
  {
    id: "q.fitness.bac.thresholds",
    ruleIds: ["fitness.bac-general"],
    question: "At a BAC of 0.85‰, which consequences apply?",
    options: [
      { text: "Licence withdrawal of at least 3 months", correct: true },
      { text: "It qualifies as a serious (grave) offence", correct: true },
      { text: "Only a fine — no licence impact", correct: false },
    ],
    rationale:
      "From 0.8‰ the offence is classified as grave (qualifiziert) with mandatory licence withdrawal.",
    tags: ["alcohol"],
    difficulty: 3,
    de: {
      question: "Bei einer Blutalkoholkonzentration von 0,85‰ — welche Folgen treffen zu?",
      options: [
        "Führerausweisentzug von mindestens 3 Monaten",
        "Gilt als schwere (qualifizierte) Widerhandlung",
        "Nur eine Busse — keine Auswirkung auf den Ausweis",
      ],
      rationale:
        "Ab 0,8‰ wird die Widerhandlung als qualifiziert (schwer) eingestuft; der Führerausweisentzug ist obligatorisch.",
    },
  },
  {
    id: "q.penalties.bac-grave",
    ruleIds: ["penalties.bac-grave"],
    question:
      "First-offence consequences for a non-novice driver caught at 0.85‰ BAC include:",
    options: [
      { text: "Licence withdrawal of at least 3 months", correct: true },
      { text: "A criminal record entry", correct: true },
      { text: "Only a small administrative fine", correct: false },
    ],
    rationale:
      "≥0.8‰ is a grave offence (SVG Art. 16c): mandatory ≥3 month withdrawal, criminal record, fitness reassessment.",
    tags: ["alcohol", "grave"],
    difficulty: 2,
    de: {
      question:
        "Welche Folgen hat eine erste Widerhandlung mit 0,85‰ für einen Fahrer ohne Probezeit?",
      options: [
        "Führerausweisentzug von mindestens 3 Monaten",
        "Ein Eintrag im Strafregister",
        "Nur eine geringe Ordnungsbusse",
      ],
      rationale:
        "Ab 0,8‰ gilt die Widerhandlung als qualifiziert (SVG Art. 16c): obligatorischer Entzug ≥3 Monate, Eintrag im Strafregister, verkehrsmedizinische Abklärung.",
    },
  },
  {
    id: "q.penalties.drug-impairment",
    ruleIds: ["penalties.drug-impairment"],
    question:
      "Cannabis (THC) is detected in a driver's blood 10 hours after consumption. The legal treatment is:",
    options: [
      { text: "Driving while unfit, equivalent to grave BAC", correct: true },
      { text: "Only a small fine — the dose is too low to count", correct: false },
      { text: "No offence because the consumption was hours earlier", correct: false },
    ],
    rationale:
      "Swiss law uses zero tolerance for THC, cocaine, opiates, amphetamines. Detection itself is the offence (VRV Art. 2 Abs. 2).",
    tags: ["drugs"],
    difficulty: 2,
    de: {
      question:
        "Bei einem Fahrer wird 10 Stunden nach Konsum THC im Blut nachgewiesen. Rechtliche Einordnung:",
      options: [
        "Fahren in fahrunfähigem Zustand, gleichwertig zu qualifizierter Fahrunfähigkeit bei Alkohol",
        "Nur eine kleine Busse — die Menge ist zu gering",
        "Keine Widerhandlung, weil der Konsum Stunden zurückliegt",
      ],
      rationale:
        "Das Schweizer Recht kennt Nulltoleranz für THC, Kokain, Opiate und Amphetamine. Der Nachweis selbst ist die Widerhandlung (VRV Art. 2 Abs. 2).",
    },
  },
  {
    id: "q.penalties.speeding-katalog",
    ruleIds: ["penalties.speeding-katalog"],
    question:
      "You are caught at 110 km/h in a 50 km/h zone. The likely classification is:",
    options: [
      { text: "Raser offence: criminal prosecution, vehicle seized, ≥24 months licence withdrawal", correct: true },
      { text: "Standard speeding fine without licence consequences", correct: false },
      { text: "Administrative warning only since no accident occurred", correct: false },
    ],
    rationale:
      "60 over in a 50 zone is the Raser threshold (SVG Art. 90 Abs. 3). Custodial sentence and vehicle seizure are routine.",
    tags: ["speed"],
    difficulty: 2,
    de: {
      question:
        "Sie werden mit 110 km/h in einer 50er-Zone gemessen. Die wahrscheinliche Einordnung ist:",
      options: [
        "Raser-Tatbestand: Strafverfahren, Fahrzeug-Einziehung, Führerausweisentzug ≥24 Monate",
        "Normale Geschwindigkeitsbusse ohne Konsequenzen für den Führerausweis",
        "Nur eine Verwarnung, weil kein Unfall passiert ist",
      ],
      rationale:
        "60 km/h zu viel in einer 50er-Zone ist der Raser-Tatbestand (SVG Art. 90 Abs. 3). Freiheitsstrafe und Einziehung des Fahrzeugs sind die Regel.",
    },
  },

  // ---------- accidents-insurance ----------
  {
    id: "q.accidents.secure-scene",
    ruleIds: ["accidents.secure-scene"],
    question: "You arrive first at an injury accident on a 50 km/h road. Your immediate priority is to:",
    options: [
      { text: "Secure the scene (hazards, warning triangle, vest)", correct: true },
      { text: "Move injured people off the road to clear traffic", correct: false },
      { text: "Exchange insurance details first", correct: false },
    ],
    rationale:
      "Sequence: secure — aid — call. Moving the injured risks further harm unless they are in immediate danger (SVG Art. 51).",
    tags: ["accident"],
    difficulty: 2,
  },
  {
    id: "q.accidents.aid",
    ruleIds: ["accidents.aid"],
    question:
      "A driver is trapped in a crashed car with neck pain but no fire and no other immediate danger. You should:",
    options: [
      { text: "Keep them warm, talk to them, and wait for emergency services", correct: true },
      { text: "Pull them out so they can lie flat on the verge", correct: false },
      { text: "Lift their head to check responsiveness", correct: false },
    ],
    rationale:
      "Do not move the injured unless in immediate danger. Stabilise, comfort, and wait — moving may worsen spinal injury.",
    tags: ["first-aid"],
    difficulty: 2,
  },
  {
    id: "q.accidents.notification",
    ruleIds: ["accidents.notification"],
    question:
      "You hit a guardrail on the motorway with no other vehicle involved. Which is correct?",
    options: [
      { text: "You must call the police because public infrastructure is damaged", correct: true },
      { text: "Police involvement is optional since no third party is hurt", correct: false },
      { text: "Only the insurance company needs to be informed", correct: false },
    ],
    rationale:
      "Damage to public infrastructure must be reported to the police (SVG Art. 51).",
    tags: ["accident"],
    difficulty: 2,
  },
  {
    id: "q.accidents.documentation",
    ruleIds: ["accidents.documentation"],
    question:
      "After a parking-lot scrape with no injuries you should first:",
    options: [
      { text: "Photograph both cars and the scene layout before moving anything", correct: true },
      { text: "Sign the other driver's handwritten admission of fault to save time", correct: false },
      { text: "Move the cars immediately to free up the parking lot", correct: false },
    ],
    rationale:
      "Document first, then exchange details, then move. Never sign fault admissions at the scene — that is your insurer's role.",
    tags: ["accident"],
    difficulty: 1,
  },
  {
    id: "q.accidents.european-form",
    ruleIds: ["accidents.european-form"],
    question:
      "After a fender-bender with a German driver in Switzerland, the European accident statement form:",
    options: [
      { text: "Records the facts of the incident; both drivers sign and each keeps a copy", correct: true },
      { text: "Determines fault between the two drivers", correct: false },
      { text: "Is only valid if filled in within 24 hours of the accident", correct: false },
    ],
    rationale:
      "The European form documents what happened. Fault is decided later by insurers based on the evidence.",
    tags: ["insurance"],
    difficulty: 2,
  },
  {
    id: "q.accidents.casco-haftpflicht",
    ruleIds: ["accidents.casco-haftpflicht"],
    question:
      "You reverse into your own garage door. Which insurance pays for repairing your car's bodywork?",
    options: [
      { text: "Vollkasko (full comprehensive)", correct: true },
      { text: "Haftpflicht (third-party liability)", correct: false },
      { text: "Teilkasko (partial comprehensive)", correct: false },
    ],
    rationale:
      "Haftpflicht only covers damage to others. Teilkasko covers theft, glass, animals, weather. Self-caused damage to your own car needs Vollkasko.",
    tags: ["insurance"],
    difficulty: 2,
  },

  // ==========================================================================
  // Chunk 6 — Authentic Swiss theory content batch
  // Citations: SVG (Strassenverkehrsgesetz SR 741.01), VRV (Verkehrsregeln-
  // verordnung SR 741.11), SSV (Signalisationsverordnung SR 741.21).
  // No items copied from the licensed ASA catalogue; everything is authored
  // from primary law and asa.ch / astra.admin.ch published guidance.
  // ==========================================================================

  // ---------- priority scenarios ----------
  {
    id: "q.priority.right-hand.tied",
    ruleIds: ["priority.right-hand.default"],
    question:
      "At an unmarked four-way intersection three cars arrive at exactly the same instant: you, a car directly opposite you, and a car on your right. Who goes first?",
    diagramAssetId: "priority-4way-tied.svg",
    imageAlt:
      "Top view of an unmarked four-way intersection. Your blue car enters from the south, a red car from the east (your right), a green car from the north (opposite you). Badges labelled 1, 2, 2 show the right-hand car goes first, then you and the opposite driver resolve the remainder.",
    options: [
      { text: "The car on your right — it has priority over you and the opposite car", correct: true },
      { text: "All three may proceed simultaneously since arrival was tied", correct: false },
      { text: "The car opposite you, because it is straight ahead", correct: false },
    ],
    rationale:
      "Priority always flows from the right (VRV Art. 36). Your opposite-direction neighbour is irrelevant until the right-hand car has cleared.",
    tags: ["intersection", "priority"],
    difficulty: 3,
    de: {
      question:
        "An einer unsignalisierten Vier-Wege-Kreuzung treffen drei Fahrzeuge gleichzeitig ein: Sie, ein Fahrzeug genau gegenüber und ein Fahrzeug von rechts. Wer fährt zuerst?",
      options: [
        "Das Fahrzeug von rechts — es hat Vortritt vor Ihnen und vor dem Fahrzeug gegenüber",
        "Alle drei dürfen gleichzeitig losfahren, weil sie gleichzeitig ankamen",
        "Das Fahrzeug gegenüber, weil es geradeaus fährt",
      ],
      rationale:
        "Der Vortritt kommt immer von rechts (VRV Art. 36). Das entgegenkommende Fahrzeug ist solange irrelevant, bis das Fahrzeug von rechts die Kreuzung freigegeben hat.",
      imageAlt:
        "Draufsicht einer unsignalisierten Vier-Wege-Kreuzung. Ihr blaues Auto kommt von Süden, ein rotes Auto von Osten (von rechts), ein grünes Auto von Norden (gegenüber). Abzeichen 1, 2, 2 zeigen: das Fahrzeug von rechts fährt zuerst, Sie und das gegenüberliegende Fahrzeug lösen den Rest.",
    },
  },
  {
    id: "q.priority.right-hand.opposite-left-turn",
    ruleIds: ["priority.right-hand.default"],
    question:
      "You and an oncoming car are both at an unmarked intersection. The oncoming driver wants to turn left across your path. You want to go straight. Who has priority?",
    diagramAssetId: "priority-left-turn-oncoming.svg",
    imageAlt:
      "Top view of an intersection. Your blue car (south) goes straight with an amber priority arrow. An oncoming red car (north) signals left and waits along a dashed turning path until you clear.",
    options: [
      { text: "You — straight-ahead has priority over a turning oncoming car", correct: true },
      { text: "The oncoming car, because it arrived first", correct: false },
      { text: "Whichever of you signals first", correct: false },
    ],
    rationale:
      "A left-turner must yield to oncoming traffic going straight or turning right (VRV Art. 36 Abs. 3).",
    tags: ["intersection", "left-turn"],
    difficulty: 3,
    de: {
      question:
        "Sie und ein entgegenkommendes Fahrzeug treffen an einer unsignalisierten Kreuzung ein. Das entgegenkommende Fahrzeug möchte links abbiegen und Ihre Fahrlinie kreuzen. Sie wollen geradeaus fahren. Wer hat Vortritt?",
      options: [
        "Sie — geradeausfahrender Verkehr hat Vortritt vor dem entgegenkommenden Linksabbieger",
        "Das entgegenkommende Fahrzeug, weil es zuerst kam",
        "Wer zuerst blinkt",
      ],
      rationale:
        "Wer links abbiegt, muss dem entgegenkommenden Verkehr (geradeaus oder rechts abbiegend) den Vortritt gewähren (VRV Art. 36 Abs. 3).",
      imageAlt:
        "Draufsicht einer Kreuzung. Ihr blaues Auto (Süden) fährt geradeaus mit einem bernsteinfarbenen Vortrittspfeil. Ein entgegenkommendes rotes Auto (Norden) blinkt links und wartet auf einer gestrichelten Abbiegelinie, bis Sie die Kreuzung freigegeben haben.",
    },
  },
  {
    id: "q.priority.right-hand.driveway",
    ruleIds: ["priority.right-hand.default"],
    question:
      "You are leaving a private driveway onto a normal residential street. Traffic on the street is approaching from your left. You:",
    diagramAssetId: "priority-driveway.svg",
    imageAlt:
      "Top view: your blue car emerges from a paved driveway onto a residential street. Amber priority arrows show through-traffic travelling both directions on the main street; a white yield triangle sits in front of your car.",
    options: [
      { text: "Must yield to all traffic on the street", correct: true },
      { text: "Have priority because traffic on the street is on your left", correct: false },
      { text: "Have priority once you have signalled", correct: false },
    ],
    rationale:
      "Vehicles entering the road from a driveway, parking lot, field path, or footway must always yield (VRV Art. 15) — the right-hand rule does not apply here.",
    tags: ["driveway", "priority"],
    difficulty: 2,
    de: {
      question:
        "Sie verlassen eine private Einfahrt auf eine normale Quartierstrasse. Auf der Strasse nähert sich von links Verkehr. Sie:",
      options: [
        "Müssen dem gesamten Verkehr auf der Strasse den Vortritt gewähren",
        "Haben Vortritt, weil der Verkehr auf der Strasse von links kommt",
        "Haben Vortritt, sobald Sie geblinkt haben",
      ],
      rationale:
        "Wer aus einer Einfahrt, einem Parkplatz, einem Feldweg oder einem Trottoir auf die Strasse fährt, muss immer Vortritt gewähren (VRV Art. 15) — der Rechtsvortritt gilt hier nicht.",
      imageAlt:
        "Draufsicht: Ihr blaues Auto verlässt eine Einfahrt und fährt auf eine Quartierstrasse. Bernsteinfarbene Vortrittspfeile zeigen den Durchgangsverkehr in beide Richtungen; ein weisses Vortrittsdreieck liegt vor Ihrem Fahrzeug.",
    },
  },
  {
    id: "q.priority.tram.tight",
    ruleIds: ["priority.tram"],
    question:
      "On a narrow town street a tram is approaching from behind you. You should:",
    diagramAssetId: "tram-narrow-street.svg",
    imageAlt:
      "Narrow city street with tram rails down the middle. Your blue car has pulled partly to the right to free the rails; an amber tram follows on the rails with a priority arrow.",
    options: [
      { text: "Pull aside to the right where possible to let the tram pass", correct: true },
      { text: "Speed up to stay ahead until the next side street", correct: false },
      { text: "Stop in the middle of the road and wait", correct: false },
    ],
    rationale:
      "Trams have absolute priority on rails (VRV Art. 38). Where the road is too narrow to share, a private vehicle must yield by pulling aside.",
    tags: ["tram", "priority"],
    difficulty: 3,
    de: {
      question:
        "In einer engen Strasse in der Stadt nähert sich ein Tram von hinten. Sie sollten:",
      options: [
        "Wo möglich nach rechts ausweichen und das Tram vorbeilassen",
        "Beschleunigen und bis zur nächsten Querstrasse vorausfahren",
        "Mitten auf der Strasse anhalten und warten",
      ],
      rationale:
        "Strassenbahnen haben auf den Schienen absoluten Vortritt (VRV Art. 38). Ist die Strasse zu schmal, muss das Privatfahrzeug ausweichen.",
      imageAlt:
        "Enge Stadtstrasse mit Tramschienen in der Mitte. Ihr blaues Auto hat leicht nach rechts ausgewichen, um die Schienen freizugeben; ein bernsteinfarbenes Tram folgt auf den Schienen mit Vortrittspfeil.",
    },
  },
  {
    id: "q.priority.emergency.intersection",
    ruleIds: ["priority.emergency-vehicles"],
    question:
      "An ambulance with blue lights and siren approaches the intersection where you are stopped first in line at a red light. You should:",
    diagramAssetId: "emergency-at-red.svg",
    imageAlt:
      "Four-way intersection with a red signal. Your blue car eases forward past the stop line along a green dashed path so an ambulance waiting directly behind can pass straight through.",
    options: [
      { text: "Move into the intersection only as far as needed to let it pass, even if your light is red", correct: true },
      { text: "Stay at the line and wait — running a red is always illegal", correct: false },
      { text: "Reverse to clear the lane behind you", correct: false },
    ],
    rationale:
      "VRV Art. 27 Abs. 2 obliges all road users to make way for emergency vehicles, including by entering an intersection on red when needed and safe.",
    tags: ["emergency", "priority"],
    difficulty: 3,
    de: {
      question:
        "Ein Krankenwagen mit Blaulicht und Wechselklanghorn nähert sich der Kreuzung, an der Sie als Erster bei Rot stehen. Sie sollten:",
      options: [
        "Nur so weit in die Kreuzung fahren, wie nötig, um die Durchfahrt freizugeben — auch bei Rotlicht",
        "An der Linie bleiben und warten — Rotlicht zu missachten ist immer verboten",
        "Rückwärts fahren, um die Spur dahinter freizumachen",
      ],
      rationale:
        "VRV Art. 27 Abs. 2 verpflichtet alle Verkehrsteilnehmer, Einsatzfahrzeugen freie Fahrt zu verschaffen — wenn nötig und gefahrlos auch durch Einfahren in die Kreuzung bei Rot.",
      imageAlt:
        "Vier-Wege-Kreuzung mit Rotlicht. Ihr blaues Auto rollt leicht über die Haltelinie auf einer grün-gestrichelten Linie vor, damit ein direkt hinter Ihnen wartender Krankenwagen die Kreuzung passieren kann.",
    },
  },
  {
    id: "q.priority.emergency.tunnel",
    ruleIds: ["priority.emergency-vehicles", "priority.rescue-corridor"],
    question:
      "Traffic on a two-lane motorway tunnel comes to a stop. To allow emergency vehicles through you should:",
    diagramAssetId: "rettungsgasse-2lane.svg",
    imageAlt:
      "Top view of a two-lane motorway: left-lane vehicles have moved fully left, right-lane vehicles fully right, opening a clear central corridor for an ambulance.",
    options: [
      { text: "Form a rescue corridor — left lane to the left edge, right lane to the right edge", correct: true },
      { text: "All vehicles move to the right onto the breakdown shoulder", correct: false },
      { text: "Wait in lane until you actually see flashing lights", correct: false },
    ],
    rationale:
      "Switzerland adopted the Rettungsgasse rule on motorways: stop in the standstill itself splits left and right lanes outward, regardless of whether emergency vehicles are visible yet.",
    tags: ["rescue-corridor", "motorway"],
    difficulty: 3,
    de: {
      question:
        "Der Verkehr in einem zweispurigen Autobahntunnel kommt zum Stillstand. Wie verschaffen Sie Einsatzfahrzeugen freie Fahrt?",
      options: [
        "Eine Rettungsgasse bilden — linke Spur an den linken Fahrbahnrand, rechte Spur an den rechten Rand",
        "Alle Fahrzeuge weichen nach rechts auf den Pannenstreifen aus",
        "In der Spur warten, bis man tatsächlich Blaulicht sieht",
      ],
      rationale:
        "In der Schweiz gilt die Rettungsgasse-Pflicht auf Autobahnen: schon beim Zustandekommen des Staus fahren die linke und rechte Spur nach aussen auseinander, unabhängig davon, ob Einsatzfahrzeuge bereits sichtbar sind.",
      imageAlt:
        "Draufsicht auf eine zweispurige Autobahn: Fahrzeuge auf der linken Spur sind ganz nach links gefahren, jene auf der rechten Spur ganz nach rechts — dazwischen entsteht eine freie Gasse für den Rettungswagen.",
    },
  },
  {
    id: "q.priority.school-bus.stopped",
    ruleIds: ["priority.school-bus"],
    question:
      "A school bus is stopped at the kerb with its hazard lights flashing and children visible in the doorway. You should:",
    diagramAssetId: "school-bus-stopped.svg",
    imageAlt:
      "A yellow school bus stopped at the right-hand kerb with four amber hazard lights blinking and two child pictograms beside the door. Your blue car approaches in the opposite lane at about 5 km/h — the slow-pace indicator is shown in green.",
    options: [
      { text: "Pass at walking pace, ready to stop, leaving extra clearance", correct: true },
      { text: "Maintain the posted speed since it is the bus driver's responsibility to keep children safe", correct: false },
      { text: "Stop completely and wait until all hazard lights are off", correct: false },
    ],
    rationale:
      "VRV Art. 6 requires drivers to pass stopped public-transport vehicles slowly and with care, especially where children are present.",
    tags: ["school-bus", "children"],
    difficulty: 3,
    de: {
      question:
        "Ein Schulbus steht mit eingeschalteter Warnblinkanlage am Strassenrand; Kinder sind in der Tür sichtbar. Sie sollten:",
      options: [
        "In Schrittgeschwindigkeit mit zusätzlichem Sicherheitsabstand vorbeifahren und bremsbereit sein",
        "Die signalisierte Geschwindigkeit beibehalten — die Kinderaufsicht ist Sache des Buschauffeurs",
        "Vollständig anhalten und warten, bis die Warnblinker erloschen sind",
      ],
      rationale:
        "VRV Art. 6 verpflichtet Sie, an haltenden Fahrzeugen des öffentlichen Verkehrs langsam und besonders vorsichtig vorbeizufahren, insbesondere wenn Kinder zugegen sind.",
      imageAlt:
        "Ein gelber Schulbus steht am rechten Strassenrand mit vier blinkenden Warnblinkleuchten und zwei Kinder-Piktogrammen neben der Tür. Ihr blaues Auto nähert sich in der Gegenspur mit etwa 5 km/h — der Schrittgeschwindigkeits-Indikator ist grün dargestellt.",
    },
  },
  {
    id: "q.priority.bus-leaving-stop",
    ruleIds: ["priority.school-bus"],
    question:
      "You are passing a town bus stop. The bus has just signalled left to rejoin traffic. You should:",
    diagramAssetId: "bus-leaving-stop.svg",
    imageAlt:
      "Town street with a 50 km/h roundel and a yellow 'H' bus-stop sign. A city bus is at the kerb signalling left to pull away; your blue car is slowing behind it with a white yield triangle and an amber priority arrow showing the bus rejoining the lane.",
    options: [
      { text: "Reduce speed and let the bus rejoin — it has priority on built-up streets", correct: true },
      { text: "Maintain speed; signalling alone does not transfer priority", correct: false },
      { text: "Sound the horn so the bus driver knows you are passing", correct: false },
    ],
    rationale:
      "On built-up roads (under 50 km/h limit) a bus signalling to leave a stop has priority (VRV Art. 26 Abs. 4). On faster roads only courtesy applies.",
    tags: ["bus", "priority"],
    difficulty: 3,
  },
  {
    id: "q.priority.roundabout.two-lane",
    ruleIds: ["priority.roundabout"],
    question:
      "On a two-lane roundabout, which of these are correct?",
    diagramAssetId: "roundabout-2lane-lane-choice.svg",
    imageAlt:
      "Top view of a two-lane roundabout. Your blue car enters in the outer lane with a solid arrow to the first exit; a dashed green path shows the inner-lane route for a later exit.",
    options: [
      { text: "Choose the lane that matches your exit before entering", correct: true },
      { text: "Signal right just before the exit you take", correct: true },
      { text: "Always pick the inner lane to keep the outer lane free", correct: false },
    ],
    rationale:
      "Lane choice on entry should reflect intended exit. Signal right immediately before exiting; never signal left while inside.",
    tags: ["roundabout"],
    difficulty: 3,
  },
  {
    id: "q.priority.yielding.entry-from-rest",
    ruleIds: ["priority.yielding-on-entry"],
    question:
      "You are stopped at a give-way line. Two cars are approaching on the priority road but are still 200 m away. You may:",
    diagramAssetId: "priority-yield-line.svg",
    imageAlt:
      "T-junction with a give-way triangle sign and a dashed yield line. Your blue car is stopped at the line on the side road while priority-road traffic flows across the top, marked with amber priority arrows.",
    options: [
      { text: "Enter only if you can complete the manoeuvre without forcing the approaching cars to brake", correct: true },
      { text: "Enter immediately since the cars are far away", correct: false },
      { text: "Enter only after both cars have passed the line", correct: false },
    ],
    rationale:
      "Yield at the line means you may join only if you do not impede priority traffic (VRV Art. 14). Distance alone is not the test — required braking is.",
    tags: ["give-way", "intersection"],
    difficulty: 4,
  },
  {
    id: "q.priority.snowy-mountain.descent",
    ruleIds: ["mountain.ascending", "mountain.heavy-vehicle-priority", "adverse.winter-tires"],
    question:
      "On a narrow mountain road in winter you are descending. An ascending lorry on chains and a small ascending bus meet you at a passing place. Who must yield first?",
    diagramAssetId: "mountain-descend-ascend.svg",
    imageAlt:
      "Winding narrow mountain road with a small passing bulge. Your descending blue car has pulled into the passing place while an ascending red car continues up with an amber priority arrow.",
    options: [
      { text: "You — descending vehicles yield to ascending vehicles, regardless of size", correct: true },
      { text: "The lorry — it is the heaviest vehicle", correct: false },
      { text: "The bus — it can manoeuvre most easily", correct: false },
    ],
    rationale:
      "The mountain rule (VRV Art. 38) is that descending traffic yields. Among ascending vehicles, a heavier vehicle in turn has priority over a lighter one if both are climbing.",
    tags: ["mountain", "priority"],
    difficulty: 5,
  },
  {
    id: "q.priority.tram.left-turn",
    ruleIds: ["priority.tram"],
    question:
      "You want to turn left at an intersection. A tram is approaching head-on, signalling for the same crossing. You:",
    diagramAssetId: "tram-left-turn.svg",
    imageAlt:
      "Intersection top view: your blue car signals a left turn and waits on a dashed turning path. An oncoming amber tram on rails advances with a priority arrow.",
    options: [
      { text: "Wait — the tram has priority and your left turn must yield", correct: true },
      { text: "Turn first because the tram has further to travel", correct: false },
      { text: "Proceed at walking pace next to the tram", correct: false },
    ],
    rationale:
      "Trams always have priority. A left turn additionally must yield to oncoming traffic, so this is doubly clear.",
    tags: ["tram", "left-turn"],
    difficulty: 3,
  },

  // ---------- maneuvers ----------
  {
    id: "q.maneuvers.parking.crossing",
    ruleIds: ["maneuvers.parking-distances"],
    question:
      "Within how many metres of a pedestrian crossing is parking forbidden on the same side of the road?",
    options: [
      { text: "5 metres before the crossing", correct: true },
      { text: "10 metres before the crossing", correct: false },
      { text: "Whatever distance keeps the crossing visible", correct: false },
    ],
    rationale:
      "VRV Art. 18 forbids parking and stopping within 5 m before a pedestrian crossing on the same side; visibility from the kerb must remain unobstructed.",
    tags: ["parking", "crossing"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.parking.intersection",
    ruleIds: ["maneuvers.parking-distances"],
    question:
      "How close to an intersection may you stop or park?",
    options: [
      { text: "No closer than 5 m from the prolonged kerb line", correct: true },
      { text: "No closer than 10 m if the side road is wider than 5 m", correct: false },
      { text: "Right up to the intersection if the road is wide enough", correct: false },
    ],
    rationale:
      "VRV Art. 18 Abs. 2 forbids stopping within 5 m of the prolonged kerb line on either side of an intersection.",
    tags: ["parking", "intersection"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.parking.fire-hydrant",
    ruleIds: ["maneuvers.parking-distances"],
    question:
      "You may not park within how many metres of a fire hydrant?",
    options: [
      { text: "1.5 metres", correct: false },
      { text: "5 metres", correct: false },
      { text: "Within the marked yellow band — usually about 1.5 m on each side", correct: true },
    ],
    rationale:
      "Hydrant zones in Switzerland are signalled by yellow paint; parking within the marked band is forbidden so the fire service can connect quickly.",
    tags: ["parking", "hydrant"],
    difficulty: 4,
  },
  {
    id: "q.maneuvers.parking.bus-stop",
    ruleIds: ["maneuvers.parking-distances"],
    question:
      "Outside marked bus-stop bays you may not stop or park within how many metres of the stop sign?",
    options: [
      { text: "15 metres on either side of the stop", correct: true },
      { text: "5 metres on either side", correct: false },
      { text: "10 metres on either side", correct: false },
    ],
    rationale:
      "VRV Art. 18 keeps a 15 m clearance on each side of a bus-stop sign so buses can pull in unimpeded.",
    tags: ["parking", "bus"],
    difficulty: 3,
  },
  {
    id: "q.maneuvers.parking.diagonal",
    ruleIds: ["maneuvers.parking-distances"],
    question:
      "Where may you park on a road with no marked spaces?",
    options: [
      { text: "Parallel to the kerb on the right side, in the direction of travel", correct: true },
      { text: "Diagonally on either side, as long as you are clear of traffic", correct: false },
      { text: "On the left side only when you arrived from that direction", correct: false },
    ],
    rationale:
      "Parking on unmarked roads is parallel to the right kerb in the direction of travel. One-way streets allow parking on either side parallel to the kerb.",
    tags: ["parking"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.u-turn.where-forbidden",
    ruleIds: ["maneuvers.u-turn"],
    question:
      "U-turns are forbidden in all of these locations except one. Which is permitted?",
    options: [
      { text: "On a town road posted at 50 km/h with clear visibility and no oncoming traffic", correct: true },
      { text: "At a level crossing", correct: false },
      { text: "Inside a tunnel", correct: false },
    ],
    rationale:
      "U-turns are prohibited on motorways, expressways, level crossings, in tunnels, near hilltops, and within unsighted curves (VRV Art. 17). On a 50 km/h town road they are legal where visibility allows.",
    tags: ["u-turn"],
    difficulty: 3,
  },
  {
    id: "q.maneuvers.reversing.school-zone",
    ruleIds: ["maneuvers.reversing"],
    question:
      "You missed your turn into a side street. Which of these is the safest legal option?",
    options: [
      { text: "Continue to the next junction and turn around there", correct: true },
      { text: "Reverse along the road for 30 m to reach the side street", correct: false },
      { text: "Make an immediate U-turn regardless of traffic", correct: false },
    ],
    rationale:
      "Reversing on a public road is permitted only over very short distances and never on motorways or where vision is poor. Continuing on is almost always safer (VRV Art. 17).",
    tags: ["reversing"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.tunnel.breakdown",
    ruleIds: ["maneuvers.tunnel-behavior"],
    question:
      "Your car loses power in a long motorway tunnel. The right action is to:",
    options: [
      { text: "Coast to the breakdown bay if reachable; otherwise stop on the right, switch on hazard lights, leave the engine running for ventilation, and get all passengers out on the side away from traffic", correct: true },
      { text: "Leave the car in lane and walk to the next emergency phone", correct: false },
      { text: "Switch off the engine and lights to save the battery", correct: false },
    ],
    rationale:
      "Tunnel-safety guidance: use a breakdown bay where possible, hazards on, evacuate uphill on the safe side, and call from an emergency phone or SOS niche. Engine running keeps ventilation; lights stay on.",
    tags: ["tunnel", "breakdown"],
    difficulty: 4,
  },
  {
    id: "q.maneuvers.tunnel.distance",
    ruleIds: ["maneuvers.tunnel-behavior"],
    question:
      "What following distance is recommended in a long road tunnel?",
    options: [
      { text: "At least 50 m at usual cruising speed; double it on inclines", correct: true },
      { text: "The same one-second rule as outside the tunnel", correct: false },
      { text: "Whatever the vehicle in front signals as comfortable", correct: false },
    ],
    rationale:
      "Tunnel guidance from ASTRA recommends a minimum of 50 m at typical speeds — close enough to keep the queue tight, far enough to react to a fire or breakdown ahead.",
    tags: ["tunnel"],
    difficulty: 3,
  },
  {
    id: "q.maneuvers.hazard-lights.stop",
    ruleIds: ["maneuvers.hazard-lights"],
    question:
      "When should you switch on hazard (4-way) flashers?",
    options: [
      { text: "When approaching the back of a sudden traffic jam at speed", correct: true },
      { text: "When parked illegally to 'excuse' it", correct: false },
      { text: "Whenever towing a trailer", correct: false },
    ],
    rationale:
      "Hazards are for warning others of an unexpected hazard — sudden tailback, breakdown, scene of an accident. They never legalise illegal parking.",
    tags: ["hazard-lights"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.hazard-lights.tow",
    ruleIds: ["maneuvers.hazard-lights"],
    question:
      "You are being towed because of breakdown. You should:",
    options: [
      { text: "Switch on the hazard lights of the towed vehicle", correct: true },
      { text: "Switch on the high-beam headlights of the towed vehicle", correct: false },
      { text: "Switch off all lights — the towing car's lights are sufficient", correct: false },
    ],
    rationale:
      "VRV Art. 30 requires hazards on a towed vehicle so following traffic understands the unusual configuration.",
    tags: ["hazard-lights", "tow"],
    difficulty: 3,
  },
  {
    id: "q.maneuvers.signalling.lane-change",
    ruleIds: ["maneuvers.signalling", "maneuvers.lane-change"],
    question:
      "You want to change lanes on the motorway. The correct sequence is:",
    options: [
      { text: "Mirror, signal, blind-spot check, change", correct: true },
      { text: "Signal, accelerate, change", correct: false },
      { text: "Change, then signal so other drivers know to brake", correct: false },
    ],
    rationale:
      "VRV Art. 13 requires drivers to signal before — and observe before signalling. The blind-spot check after signalling closes the loop on what the mirror could not show.",
    tags: ["lane-change", "signalling"],
    difficulty: 2,
  },
  {
    id: "q.maneuvers.seatbelt.exempt",
    ruleIds: ["maneuvers.seatbelt"],
    question:
      "Which of these is exempt from the seatbelt requirement in a private car?",
    options: [
      { text: "A driver delivering goods who must repeatedly stop in a 50 km/h zone", correct: false },
      { text: "Holders of a medical exemption certificate", correct: true },
      { text: "Children under 12 sitting in the back", correct: false },
    ],
    rationale:
      "Seatbelts are mandatory for all occupants (VRV Art. 3a). Medical exemption is the only personal exception; delivery drivers must still belt up between stops.",
    tags: ["seatbelt"],
    difficulty: 3,
  },
  {
    id: "q.maneuvers.child-seat.cutoff",
    ruleIds: ["vehicle.child-seat"],
    question:
      "Which children must sit in an approved child restraint?",
    options: [
      { text: "Children under 12 years AND under 150 cm tall", correct: true },
      { text: "Children under 7 years only", correct: false },
      { text: "Children under 12 years OR under 150 cm tall — whichever is reached first", correct: false },
    ],
    rationale:
      "VRV Art. 3a Abs. 4 requires a child seat until the child is 12 years old AND 150 cm tall. Both thresholds must be met before an adult belt alone is permitted.",
    tags: ["child-seat"],
    difficulty: 3,
  },
  {
    id: "q.maneuvers.overtaking.zebra",
    ruleIds: ["maneuvers.pedestrian-crossing", "maneuvers.overtaking-left"],
    question:
      "On a town road approaching an unsignalised pedestrian crossing, you may overtake the car ahead:",
    options: [
      { text: "Only if you can complete the overtake well before the crossing and clearly see no pedestrians waiting", correct: false },
      { text: "Never — overtaking is forbidden on the approach to a pedestrian crossing", correct: true },
      { text: "Only if the car ahead is moving below 30 km/h", correct: false },
    ],
    rationale:
      "VRV Art. 33 forbids overtaking near unsignalised crossings to ensure pedestrians remain visible to all approaching drivers.",
    tags: ["overtaking", "crossing"],
    difficulty: 3,
  },

  // ---------- speeds & limits facts ----------
  {
    id: "q.speeds.defaults.country",
    ruleIds: ["speeds.default-limits"],
    question:
      "On a normal country road outside built-up areas with no signs, the default maximum speed for a passenger car is:",
    options: [
      { text: "80 km/h", correct: true },
      { text: "90 km/h", correct: false },
      { text: "100 km/h", correct: false },
    ],
    rationale:
      "Default Swiss limits: 50 in town, 80 country, 100 expressway, 120 motorway (SVG Art. 32, VRV Art. 4a).",
    tags: ["speed", "defaults"],
    difficulty: 1,
    de: {
      question:
        "Ausserorts auf einer normalen Landstrasse ohne Signalisation gilt für einen Personenwagen die Höchstgeschwindigkeit:",
      options: ["80 km/h", "90 km/h", "100 km/h"],
      rationale:
        "Allgemeinhöchstgeschwindigkeiten: 50 innerorts, 80 ausserorts, 100 auf Autostrassen, 120 auf Autobahnen (SVG Art. 32, VRV Art. 4a).",
    },
  },
  {
    id: "q.speeds.defaults.expressway",
    ruleIds: ["speeds.default-limits"],
    question:
      "On a Swiss expressway (Autostrasse, white-on-green sign) the default maximum is:",
    options: [
      { text: "100 km/h", correct: true },
      { text: "120 km/h", correct: false },
      { text: "80 km/h", correct: false },
    ],
    rationale:
      "Autostrasse defaults to 100 km/h. Only Autobahn (motorway, white-on-green) allows 120.",
    tags: ["speed", "expressway"],
    difficulty: 2,
    de: {
      question:
        "Auf einer Schweizer Autostrasse (weisses Signal auf grünem Grund) gilt als Höchstgeschwindigkeit:",
      options: ["100 km/h", "120 km/h", "80 km/h"],
      rationale:
        "Auf der Autostrasse gilt 100 km/h. Nur die Autobahn (weiss auf grünem Grund) erlaubt 120 km/h.",
    },
  },
  {
    id: "q.speeds.defaults.motorway",
    ruleIds: ["speeds.default-limits"],
    question:
      "On a Swiss motorway (Autobahn) with no posted limit and no trailer, your maximum speed is:",
    options: [
      { text: "120 km/h", correct: true },
      { text: "130 km/h", correct: false },
      { text: "100 km/h", correct: false },
    ],
    rationale:
      "Switzerland's motorway default is 120 km/h. Variable signs may lower it; no posted sign means 120.",
    tags: ["speed", "motorway"],
    difficulty: 1,
    de: {
      question:
        "Auf der Schweizer Autobahn ohne signalisierte Höchstgeschwindigkeit und ohne Anhänger beträgt Ihre Höchstgeschwindigkeit:",
      options: ["120 km/h", "130 km/h", "100 km/h"],
      rationale:
        "Die Allgemeinhöchstgeschwindigkeit auf der Autobahn beträgt 120 km/h. Wechselsignale können tiefer signalisieren; ohne Signalisation gilt 120 km/h.",
    },
  },
  {
    id: "q.speeds.tempo30.applies",
    ruleIds: ["speeds.tempo30"],
    question:
      "Inside a Tempo-30 zone the right-hand rule applies and the limit is 30 km/h. Which is also true?",
    options: [
      { text: "There are no marked pedestrian crossings inside the zone unless specifically signed", correct: true },
      { text: "Trams may not enter a Tempo-30 zone", correct: false },
      { text: "Only residents may park inside the zone", correct: false },
    ],
    rationale:
      "Tempo-30 zones generally suppress marked zebras: pedestrians may cross anywhere, drivers must adapt.",
    tags: ["tempo30"],
    difficulty: 3,
  },
  {
    id: "q.speeds.begegnungszone.limit",
    ruleIds: ["speeds.begegnungszone"],
    question:
      "Inside a Begegnungszone (encounter zone) the rules include:",
    options: [
      { text: "Limit 20 km/h, pedestrians have priority over all vehicles", correct: true },
      { text: "Pedestrians may use the road but cars still have priority", correct: false },
      { text: "Limit 30 km/h, same rules as a Tempo-30 zone", correct: false },
    ],
    rationale:
      "Begegnungszone (SSV Art. 22b): 20 km/h, pedestrians may use the entire road and have priority over vehicles.",
    tags: ["zone", "pedestrian"],
    difficulty: 2,
  },
  {
    id: "q.speeds.trailer.car",
    ruleIds: ["speeds.trailer-reduced"],
    question:
      "You tow a trailer behind a passenger car on a Swiss motorway. Your maximum speed is:",
    options: [
      { text: "80 km/h", correct: true },
      { text: "100 km/h", correct: false },
      { text: "120 km/h", correct: false },
    ],
    rationale:
      "Cars towing a trailer are capped at 80 km/h on motorways and expressways alike (VRV Art. 5).",
    tags: ["speed", "trailer"],
    difficulty: 2,
  },
  {
    id: "q.speeds.trailer.country",
    ruleIds: ["speeds.trailer-reduced"],
    question:
      "On a country road, a passenger car towing a small trailer (≤ 3.5 t) is limited to:",
    options: [
      { text: "80 km/h", correct: true },
      { text: "100 km/h", correct: false },
      { text: "60 km/h", correct: false },
    ],
    rationale:
      "Country-road default 80 km/h applies to car + small trailer; 60 km/h applies only to specific heavier combinations and to caravans on certain inclines.",
    tags: ["speed", "trailer"],
    difficulty: 3,
  },
  {
    id: "q.speeds.school.adapt",
    ruleIds: ["speeds.school-approach", "speeds.adapted-speed"],
    question:
      "Approaching a primary school at 08:00 on a school day, the posted limit is 50 km/h. You should:",
    options: [
      { text: "Drop well below 50 km/h, ready to stop for a child stepping out", correct: true },
      { text: "Continue at 50 km/h — the limit is the limit", correct: false },
      { text: "Stop completely until you can see the school yard is empty", correct: false },
    ],
    rationale:
      "VRV Art. 4 requires speed adapted to conditions. Posted limits are maximums, not targets — children near a school easily justify 30 km/h.",
    tags: ["school", "speed"],
    difficulty: 2,
  },
  {
    id: "q.speeds.motorway.minimum",
    ruleIds: ["speeds.motorway-minimum"],
    question:
      "Vehicles using the Swiss motorway must be capable of at least:",
    options: [
      { text: "80 km/h on level ground under their own power", correct: true },
      { text: "60 km/h on level ground", correct: false },
      { text: "Whatever speed they can sustain — there is no minimum", correct: false },
    ],
    rationale:
      "VRV Art. 35: motorways may only be used by vehicles capable of at least 80 km/h on level ground. Mopeds, bicycles, slow tractors are excluded.",
    tags: ["speed", "motorway"],
    difficulty: 3,
  },
  {
    id: "q.speeds.fog.rule",
    ruleIds: ["speeds.adapted-speed", "adverse.fog-lights"],
    question:
      "In dense fog with visibility around 30 m, the safe maximum speed is roughly:",
    options: [
      { text: "30 km/h — match speed to braking distance plus a margin", correct: true },
      { text: "Whatever the posted limit allows", correct: false },
      { text: "60 km/h with rear fog lamp on", correct: false },
    ],
    rationale:
      "Rule of thumb: kilometre-per-hour speed should not exceed the visibility in metres in poor conditions. 30 m visibility → 30 km/h, regardless of the posted limit.",
    tags: ["fog", "speed"],
    difficulty: 4,
    de: {
      question:
        "Bei dichtem Nebel mit rund 30 m Sicht liegt die angepasste Höchstgeschwindigkeit bei etwa:",
      options: [
        "30 km/h — Geschwindigkeit in km/h nicht höher als die Sichtweite in Metern",
        "So hoch, wie es die signalisierte Höchstgeschwindigkeit erlaubt",
        "60 km/h mit eingeschalteter Nebelschlussleuchte",
      ],
      rationale:
        "Faustregel: bei schlechter Sicht soll die Geschwindigkeit in km/h die Sichtweite in Metern nicht überschreiten. 30 m Sicht → 30 km/h, unabhängig von der signalisierten Höchstgeschwindigkeit.",
    },
  },

  // ---------- BAC, drugs, fitness ----------
  {
    id: "q.fitness.bac.general",
    ruleIds: ["fitness.bac-general"],
    question:
      "The general blood alcohol limit for a Cat. B driver in Switzerland is:",
    options: [
      { text: "0.5 ‰ (per mille)", correct: true },
      { text: "0.8 ‰", correct: false },
      { text: "0.0 ‰", correct: false },
    ],
    rationale:
      "SVG Art. 31 sets the general BAC limit at 0.5 ‰. 0.0 ‰ applies to novices, learners, and professional drivers in service.",
    tags: ["bac"],
    difficulty: 1,
    de: {
      question:
        "Die allgemeine Promillegrenze für einen Cat.-B-Fahrer in der Schweiz beträgt:",
      options: ["0,5 ‰ (Promille)", "0,8 ‰", "0,0 ‰"],
      rationale:
        "SVG Art. 31 setzt die allgemeine Promillegrenze auf 0,5 ‰. 0,0 ‰ gilt in der Probezeit, für Lernfahrer sowie für berufsmässige Fahrer im Dienst.",
    },
  },
  {
    id: "q.fitness.bac.novice-probation",
    ruleIds: ["fitness.bac-novice"],
    question:
      "During the three-year probation period a Cat. B driver must observe a BAC limit of:",
    options: [
      { text: "0.0 ‰ — effectively zero tolerance", correct: true },
      { text: "0.1 ‰", correct: false },
      { text: "0.3 ‰", correct: false },
    ],
    rationale:
      "Probation drivers, learners, professional drivers in service, and instructors face a 0.0 ‰ limit (VTS Art. 2).",
    tags: ["bac", "novice"],
    difficulty: 1,
    de: {
      question:
        "In der dreijährigen Probezeit muss ein Cat.-B-Fahrer folgende Promillegrenze einhalten:",
      options: [
        "0,0 ‰ — faktische Nulltoleranz",
        "0,1 ‰",
        "0,3 ‰",
      ],
      rationale:
        "Fahrer in der Probezeit, Lernfahrer, berufsmässige Fahrer im Dienst und Fahrlehrer unterliegen einer 0,0-‰-Grenze (VTS Art. 2).",
    },
  },
  {
    id: "q.fitness.bac.grave",
    ruleIds: ["penalties.bac-grave"],
    question:
      "A driver caught at 0.85 ‰ BAC is treated as a 'grave' offence (qualifizierte Blutalkoholkonzentration). The legal threshold is:",
    options: [
      { text: "0.8 ‰ and above", correct: true },
      { text: "1.0 ‰ and above", correct: false },
      { text: "0.5 ‰ and above", correct: false },
    ],
    rationale:
      "From 0.8 ‰ the offence is qualified: minimum 3-month licence withdrawal, criminal penalties, and obligatory medical assessment.",
    tags: ["bac", "penalties"],
    difficulty: 3,
    de: {
      question:
        "Ein Fahrer mit 0,85 ‰ gilt als 'qualifizierte Blutalkoholkonzentration' (schwere Widerhandlung). Der gesetzliche Schwellenwert liegt bei:",
      options: ["0,8 ‰ und höher", "1,0 ‰ und höher", "0,5 ‰ und höher"],
      rationale:
        "Ab 0,8 ‰ gilt die Widerhandlung als qualifiziert: mindestens 3 Monate Führerausweisentzug, Strafverfolgung und obligatorische verkehrsmedizinische Begutachtung.",
    },
  },
  {
    id: "q.fitness.medications.warning",
    ruleIds: ["fitness.medications"],
    question:
      "The pharmacy gives you a sleeping aid with a warning triangle on the box. You should:",
    options: [
      { text: "Treat yourself as unfit to drive while taking it, even if you 'feel fine'", correct: true },
      { text: "Drive at reduced speed only", correct: false },
      { text: "Drive normally if the dose is small", correct: false },
    ],
    rationale:
      "The triangle marks medication that impairs driving. SVG Art. 31 forbids driving when fitness is reduced; subjective feeling is not the test.",
    tags: ["medication", "fitness"],
    difficulty: 2,
  },
  {
    id: "q.fitness.drugs.cannabis",
    ruleIds: ["penalties.drug-impairment"],
    question:
      "Driving with detectable THC, cocaine, opiates, or amphetamines is treated as:",
    options: [
      { text: "Zero tolerance — any detectable amount triggers the same sanctions as 0.8 ‰ BAC", correct: true },
      { text: "Tolerated below a low threshold, like alcohol", correct: false },
      { text: "Permitted with a medical prescription regardless of dose", correct: false },
    ],
    rationale:
      "VRV Art. 2 sets zero tolerance for the seven listed substances. Penalties match grave alcohol cases.",
    tags: ["drugs", "fitness"],
    difficulty: 3,
  },
  {
    id: "q.fitness.fatigue.signal",
    ruleIds: ["fitness.fatigue-break"],
    question:
      "Which of these is the most reliable warning sign of dangerous fatigue?",
    options: [
      { text: "Difficulty keeping a steady lane and rapid eye blinks", correct: true },
      { text: "A noticeable urge to open the window", correct: false },
      { text: "Tapping the steering wheel to a song", correct: false },
    ],
    rationale:
      "Lane drift and increased blink rate are the classic warning signs. The only effective response is a break and 20-minute nap; coffee alone is insufficient.",
    tags: ["fatigue", "fitness"],
    difficulty: 3,
  },
  {
    id: "q.fitness.fatigue.break-rule",
    ruleIds: ["fitness.max-driving-hours", "fitness.fatigue-break"],
    question:
      "On a long Sunday drive how often should you plan a real rest break?",
    options: [
      { text: "Every 2 hours, even if you don't feel tired", correct: true },
      { text: "Once after 5 hours of driving", correct: false },
      { text: "Only when fatigue becomes obvious", correct: false },
    ],
    rationale:
      "ASTRA road-safety guidance: a 15-minute break every 2 hours keeps reaction times steady. Waiting for symptoms is too late.",
    tags: ["fatigue", "breaks"],
    difficulty: 2,
  },
  {
    id: "q.fitness.eyewear.must-carry",
    ruleIds: ["fitness.eyewear"],
    question:
      "Your driving licence has the eyewear restriction code 01. You must:",
    options: [
      { text: "Wear suitable glasses or contact lenses while driving", correct: true },
      { text: "Carry a spare pair of glasses but only wear them on motorways", correct: false },
      { text: "Always carry sunglasses for daytime driving", correct: false },
    ],
    rationale:
      "Code 01 obliges the holder to wear vision correction. Driving without it is treated as licence breach (SVG Art. 95).",
    tags: ["eyewear", "fitness"],
    difficulty: 2,
  },
  {
    id: "q.fitness.illness.cold",
    ruleIds: ["fitness.illness"],
    question:
      "You have a heavy cold with reduced concentration and reaction time. You should:",
    options: [
      { text: "Postpone non-urgent driving and use public transport", correct: true },
      { text: "Drive only on familiar town routes", correct: false },
      { text: "Drive normally — a cold is not a legal impairment", correct: false },
    ],
    rationale:
      "SVG Art. 31 forbids driving when impaired. Reduced concentration and reaction time from illness are themselves the impairment.",
    tags: ["illness", "fitness"],
    difficulty: 2,
  },
  {
    id: "q.fitness.distraction.phone",
    ruleIds: ["fitness.distraction-phone"],
    question:
      "Holding a smartphone briefly to read a navigation prompt while moving:",
    options: [
      { text: "Is forbidden — drivers may only use a hand-held phone when stationary with the engine off", correct: true },
      { text: "Is permitted at low speed in town", correct: false },
      { text: "Is permitted with hazard lights on", correct: false },
    ],
    rationale:
      "VRV Art. 3 forbids any task that distracts from driving. Hand-held phone use is criminal regardless of duration; hands-free is permitted with care.",
    tags: ["phone", "distraction"],
    difficulty: 2,
  },
  {
    id: "q.fitness.fatigue.coffee",
    ruleIds: ["fitness.fatigue-break"],
    question:
      "After three hours of motorway driving you are yawning. Which is the best response?",
    options: [
      { text: "Pull into the next rest area and take a 20-minute nap", correct: true },
      { text: "Drink an energy drink and keep going", correct: false },
      { text: "Open the windows and turn up the music", correct: false },
    ],
    rationale:
      "The only sleep-replacement that actually works is a short nap. Caffeine helps marginally; cold air and music do not.",
    tags: ["fatigue"],
    difficulty: 3,
  },

  // ---------- adverse conditions ----------
  {
    id: "q.adverse.fog-lights.rear",
    ruleIds: ["adverse.fog-lights"],
    question:
      "The rear fog lamp may be switched on:",
    options: [
      { text: "Only when visibility falls below 50 m", correct: true },
      { text: "Whenever it is raining", correct: false },
      { text: "Whenever you tow a trailer", correct: false },
    ],
    rationale:
      "VRV Art. 31 limits rear fog use to visibility below 50 m to avoid dazzling following drivers.",
    tags: ["fog", "lights"],
    difficulty: 2,
  },
  {
    id: "q.adverse.aquaplaning.action",
    ruleIds: ["adverse.aquaplaning"],
    question:
      "You feel the steering go light on a wet motorway — the front tyres are aquaplaning. You should:",
    options: [
      { text: "Hold the wheel straight, ease off the throttle, do not brake or steer suddenly", correct: true },
      { text: "Brake firmly to clear the water", correct: false },
      { text: "Steer hard to the left to break the water film", correct: false },
    ],
    rationale:
      "Steering and braking inputs during aquaplaning amplify the loss of control once the tyre regains grip. Throttle off, hold straight, wait for grip.",
    tags: ["aquaplaning"],
    difficulty: 4,
  },
  {
    id: "q.adverse.winter.tires-when",
    ruleIds: ["adverse.winter-tires"],
    question:
      "Switzerland does not have a calendar-based winter-tyre rule. Instead:",
    options: [
      { text: "Drivers are responsible for tyres adapted to conditions; an accident with summer tyres in snow can be treated as fault", correct: true },
      { text: "Winter tyres are mandatory from 1 November to 31 March", correct: false },
      { text: "Winter tyres are only required on mountain roads", correct: false },
    ],
    rationale:
      "VRV Art. 29: the driver answers for adequate vehicle condition, including tyres. Insurance can be reduced or refused after winter accidents on summer tyres.",
    tags: ["winter-tires"],
    difficulty: 3,
  },
  {
    id: "q.adverse.black-ice.spots",
    ruleIds: ["adverse.black-ice"],
    question:
      "Black ice is most likely to appear first:",
    options: [
      { text: "On bridges and shaded sections of road", correct: true },
      { text: "On flat stretches in direct sunshine", correct: false },
      { text: "Inside tunnels", correct: false },
    ],
    rationale:
      "Bridges lose heat from above and below; shade keeps frost long after open road has thawed. Approach both with extra care in winter.",
    tags: ["black-ice"],
    difficulty: 3,
  },
  {
    id: "q.adverse.night-glare.response",
    ruleIds: ["adverse.night-glare"],
    question:
      "You are dazzled by an oncoming car with high beams. You should:",
    options: [
      { text: "Look at the right edge of the road and reduce speed", correct: true },
      { text: "Flash your high beams in retaliation", correct: false },
      { text: "Close one eye to preserve night vision", correct: false },
    ],
    rationale:
      "Looking right keeps you on line and protects pupil dilation. Flashing back compounds the dazzle for both drivers.",
    tags: ["night", "lights"],
    difficulty: 2,
  },

  // ---------- vehicle & equipment ----------
  {
    id: "q.vehicle.headlights.day",
    ruleIds: ["vehicle.headlights-day"],
    question:
      "Daytime running lights or dipped headlights are required on a Swiss public road:",
    options: [
      { text: "At all times the vehicle is in motion", correct: true },
      { text: "Only between sunset and sunrise", correct: false },
      { text: "Only on motorways", correct: false },
    ],
    rationale:
      "Since 1 January 2014, daytime headlights or DRL are mandatory all day on cars (SVG Art. 41).",
    tags: ["lights"],
    difficulty: 1,
  },
  {
    id: "q.vehicle.tyre.tread",
    ruleIds: ["vehicle.tyre-tread-minimum"],
    question:
      "The legal minimum tread depth for a passenger-car tyre is:",
    options: [
      { text: "1.6 mm across the main tread groove", correct: true },
      { text: "3.0 mm across the main tread groove", correct: false },
      { text: "2.0 mm at any single point", correct: false },
    ],
    rationale:
      "VTS Art. 58 sets 1.6 mm. Tyre safety experts recommend replacement well before, especially for winter tyres (≥ 4 mm).",
    tags: ["tyres"],
    difficulty: 2,
  },
  {
    id: "q.vehicle.warning-triangle.country",
    ruleIds: ["vehicle.warning-triangle"],
    question:
      "After breakdown on an open country road you must place the warning triangle:",
    options: [
      { text: "At least 50 m behind the vehicle, on the same side of the road", correct: true },
      { text: "Directly behind the vehicle for visibility", correct: false },
      { text: "100 m in front of the vehicle to warn oncoming drivers", correct: false },
    ],
    rationale:
      "VRV Art. 23: at least 50 m behind on country roads, 100 m on motorways, before any other recovery action.",
    tags: ["warning-triangle"],
    difficulty: 2,
  },
  {
    id: "q.vehicle.warning-triangle.motorway",
    ruleIds: ["vehicle.warning-triangle"],
    question:
      "The warning triangle on a motorway breakdown should be placed:",
    options: [
      { text: "At least 100 m behind the vehicle, on the hard shoulder", correct: true },
      { text: "Directly behind the vehicle in lane", correct: false },
      { text: "50 m behind the vehicle in the centre of the lane", correct: false },
    ],
    rationale:
      "Higher speeds need longer warning. 100 m behind on the hard shoulder, hazards on, occupants behind the safety barrier.",
    tags: ["warning-triangle", "motorway"],
    difficulty: 3,
  },
  {
    id: "q.vehicle.lighting.inspection",
    ruleIds: ["vehicle.lighting-inspection"],
    question:
      "Before every long trip you should personally check at least:",
    options: [
      { text: "Lights front and rear, indicators, brake lights, tyre pressure, washer fluid", correct: true },
      { text: "Engine oil only — modern cars manage everything else", correct: false },
      { text: "Nothing — annual MFK inspection is enough", correct: false },
    ],
    rationale:
      "MFK is annual at most; the driver remains responsible for visible safety items every day (VRV Art. 29).",
    tags: ["inspection"],
    difficulty: 2,
  },
  {
    id: "q.vehicle.load.weight",
    ruleIds: ["vehicle.load-securing"],
    question:
      "When loading a roof box, which of these is correct?",
    options: [
      { text: "Total weight must stay within the vehicle's permitted gross weight and the box's stated limit", correct: true },
      { text: "Roof loads do not count towards the vehicle's gross weight", correct: false },
      { text: "Wider items may overhang sideways up to 50 cm if marked", correct: false },
    ],
    rationale:
      "Roof loads count toward gross weight and shift the centre of gravity upward; manufacturers' roof load limit (often 50–75 kg) is binding.",
    tags: ["load"],
    difficulty: 3,
  },
  {
    id: "q.vehicle.mirrors.blindspot",
    ruleIds: ["vehicle.mirrors-blindspot"],
    question:
      "Even with correctly set mirrors a blind spot remains. Where is it most dangerous?",
    options: [
      { text: "Roughly between the driver's shoulder line and the rear corner of the car on each side", correct: true },
      { text: "Directly behind the rear bumper", correct: false },
      { text: "Above the windscreen", correct: false },
    ],
    rationale:
      "Side blind spots near the rear corners hide overtaking traffic and cyclists. A shoulder check before any lane change addresses this.",
    tags: ["mirrors"],
    difficulty: 2,
  },
  {
    id: "q.vehicle.insurance.minimum",
    ruleIds: ["vehicle.insurance-minimum"],
    question:
      "Mandatory insurance for a Swiss-registered car covers:",
    options: [
      { text: "Third-party liability for personal injury and property damage to others", correct: true },
      { text: "Damage to your own car in any accident", correct: false },
      { text: "Theft and vandalism of your own car", correct: false },
    ],
    rationale:
      "Haftpflicht (third-party liability) is compulsory; Kasko is voluntary (SVG Art. 63).",
    tags: ["insurance"],
    difficulty: 1,
  },
  {
    id: "q.vehicle.registration",
    ruleIds: ["vehicle.registration-card"],
    question:
      "Documents you must carry whenever driving in Switzerland include:",
    options: [
      { text: "Driving licence", correct: true },
      { text: "Vehicle registration certificate (Fahrzeugausweis)", correct: true },
      { text: "Vehicle inspection report (MFK)", correct: false },
    ],
    rationale:
      "Both licence and Fahrzeugausweis must be present. The MFK report is filed at home; only the registration entry confirming MFK validity is needed in the vehicle.",
    tags: ["documents"],
    difficulty: 2,
  },

  // ---------- accidents & insurance ----------
  {
    id: "q.accidents.scene.first-step",
    ruleIds: ["accidents.secure-scene"],
    question:
      "The very first action at the scene of a crash with injured people is to:",
    options: [
      { text: "Secure the scene — hazards on, warning triangle out, then check for injuries", correct: true },
      { text: "Move the casualties to the verge so they don't block traffic", correct: false },
      { text: "Take photos for insurance before anything moves", correct: false },
    ],
    rationale:
      "First the scene, then the people: an unsecured scene multiplies casualties. Move the injured only if there is a fire or other immediate threat.",
    tags: ["accident", "scene"],
    difficulty: 3,
  },
  {
    id: "q.accidents.aid.unconscious",
    ruleIds: ["accidents.aid"],
    question:
      "A casualty is unconscious but breathing normally. The right immediate action is:",
    options: [
      { text: "Place them in the recovery position (lateral safety position) and monitor breathing", correct: true },
      { text: "Start chest compressions immediately", correct: false },
      { text: "Sit them up against the kerb", correct: false },
    ],
    rationale:
      "Unconscious + breathing → recovery position to keep airway clear. Compressions are only for someone NOT breathing normally.",
    tags: ["first-aid"],
    difficulty: 3,
  },
  {
    id: "q.accidents.notification.minor",
    ruleIds: ["accidents.notification"],
    question:
      "You scratch a parked car and the owner is not present. You must:",
    options: [
      { text: "Wait a reasonable time, then notify the police if the owner does not appear", correct: true },
      { text: "Leave a note with your number — that satisfies the law", correct: false },
      { text: "Drive on if no one saw you", correct: false },
    ],
    rationale:
      "SVG Art. 51 obliges you to identify yourself to the damaged party. If they cannot be reached, the police must be informed without delay; a note alone is insufficient.",
    tags: ["accident", "notification"],
    difficulty: 4,
  },
  {
    id: "q.accidents.european-form.purpose",
    ruleIds: ["accidents.european-form"],
    question:
      "The European Accident Statement (Europäisches Unfallprotokoll) is used to:",
    options: [
      { text: "Document facts, sketches, and witnesses; insurers later determine fault from the evidence", correct: true },
      { text: "Officially attribute fault on the spot", correct: false },
      { text: "Replace the obligation to notify the police", correct: false },
    ],
    rationale:
      "The form records facts only. Signing does NOT admit fault — that is decided by insurers and, where needed, courts.",
    tags: ["accident", "form"],
    difficulty: 2,
  },
  {
    id: "q.accidents.documentation.photos",
    ruleIds: ["accidents.documentation"],
    question:
      "When documenting a minor crash you should photograph:",
    options: [
      { text: "Damage close-up, both vehicles in context, road markings, and any skid marks", correct: true },
      { text: "Only the damaged area of your own car", correct: false },
      { text: "The other driver's licence — for the insurer", correct: false },
    ],
    rationale:
      "Insurers reconstruct the scene from contextual photos. Avoid intruding into others' personal documents — exchange names and insurance details verbally.",
    tags: ["accident", "documentation"],
    difficulty: 3,
  },
  {
    id: "q.accidents.casco-haftpflicht.choice",
    ruleIds: ["accidents.casco-haftpflicht"],
    question:
      "A hailstorm dents your car overnight. Which insurance pays?",
    options: [
      { text: "Teilkasko (partial comprehensive) — weather damage is included", correct: true },
      { text: "Haftpflicht — third-party liability covers natural events", correct: false },
      { text: "No insurance — weather damage is always your own loss", correct: false },
    ],
    rationale:
      "Teilkasko covers theft, glass, animal collisions, and weather. Haftpflicht only pays others. Vollkasko adds self-caused collision damage.",
    tags: ["insurance"],
    difficulty: 2,
  },

  // ---------- penalties / cadenced edge cases ----------
  {
    id: "q.penalties.speeding.town",
    ruleIds: ["penalties.speeding-katalog"],
    question:
      "Inside a built-up area, exceeding the limit by 25 km/h or more triggers:",
    options: [
      { text: "A driving-licence withdrawal in addition to a fine", correct: true },
      { text: "A fine only, with points added later", correct: false },
      { text: "A warning letter for first offence", correct: false },
    ],
    rationale:
      "Within town the threshold for licence withdrawal under VTS Art. 16a is 25 km/h. Outside town it is 30; on motorway 35.",
    tags: ["speeding", "penalties"],
    difficulty: 3,
  },
  {
    id: "q.penalties.speeding.via-sicura",
    ruleIds: ["penalties.speeding-katalog"],
    question:
      "Which extreme speeding cases trigger 'Raser' (reckless driver) sanctions including up to 4 years prison?",
    options: [
      { text: "≥ 40 km/h over the limit in town, ≥ 50 outside town, ≥ 60 on motorway", correct: true },
      { text: "Any speeding ≥ 30 km/h over the limit", correct: false },
      { text: "Only speeds above 200 km/h", correct: false },
    ],
    rationale:
      "Via sicura's 'Raser' provision (SVG Art. 90 Abs. 3) targets gross excess: 40/50/60 thresholds, with mandatory minimum 1-year prison and 2-year licence loss.",
    tags: ["raser", "penalties"],
    difficulty: 5,
  },
  {
    id: "q.penalties.bac.first-grave",
    ruleIds: ["penalties.bac-grave"],
    question:
      "A first-time grave alcohol offence (≥ 0.8 ‰) leads to a minimum licence withdrawal of:",
    options: [
      { text: "3 months", correct: true },
      { text: "1 month", correct: false },
      { text: "6 months", correct: false },
    ],
    rationale:
      "VTS Art. 16c: minimum 3-month withdrawal for first qualified BAC offence. Repetition triggers longer minimums and obligatory medical examination.",
    tags: ["bac", "penalties"],
    difficulty: 4,
  },

  // ---------- mountain & adverse edge cases ----------
  {
    id: "q.mountain.descending.gear",
    ruleIds: ["mountain.descending-gear"],
    question:
      "Descending a long alpine pass with an automatic gearbox you should:",
    options: [
      { text: "Engage a lower gear (D2/M2 or paddle-shift) so engine braking does most of the work", correct: true },
      { text: "Stay in D and use the brake pedal continuously", correct: false },
      { text: "Shift to N to coast freely", correct: false },
    ],
    rationale:
      "Continuous brake use overheats discs and risks fade. Engine braking via low gear keeps brakes cool and reserves them for emergencies.",
    tags: ["mountain", "descent"],
    difficulty: 3,
  },
  {
    id: "q.mountain.headlights.tunnel",
    ruleIds: ["mountain.headlights"],
    question:
      "A pass road with frequent short tunnels requires:",
    options: [
      { text: "Dipped headlights remain on continuously through and between tunnels", correct: true },
      { text: "Headlights off between tunnels to save fuel", correct: false },
      { text: "High beams inside any tunnel", correct: false },
    ],
    rationale:
      "Dipped headlights are mandatory in tunnels. Switching off between short tunnels causes glare for others adapting to changing light; leave them on.",
    tags: ["mountain", "lights"],
    difficulty: 3,
  },
  {
    id: "q.mountain.heavy-vehicle.priority",
    ruleIds: ["mountain.heavy-vehicle-priority"],
    question:
      "On a narrow alpine road two ascending vehicles meet at a passing place: a passenger car and a heavy lorry. Who has priority?",
    options: [
      { text: "The lorry — heavier ascending vehicle has priority over a lighter ascending vehicle", correct: true },
      { text: "The car — passenger vehicles always have priority", correct: false },
      { text: "Whoever reached the passing place first", correct: false },
    ],
    rationale:
      "On unpaved or narrow mountain roads, the heavier ascending vehicle has priority over the lighter ascending vehicle.",
    tags: ["mountain", "priority"],
    difficulty: 4,
  },
  {
    id: "q.mountain.chains-mandatory.who",
    ruleIds: ["mountain.chains-mandatory", "signs.snow-chains"],
    question:
      "A pass road shows the snow-chains sign and a 4×4 SUV approaches the start. Which is correct?",
    options: [
      { text: "The 4×4 must also fit chains on at least two driving wheels", correct: true },
      { text: "The 4×4 is exempt because all four wheels drive", correct: false },
      { text: "The 4×4 may continue without chains if winter tyres are fitted", correct: false },
    ],
    rationale:
      "The mandatory-chains sign applies to all motor vehicles regardless of drive layout. Only chains satisfy it; tyres alone do not.",
    tags: ["mountain", "winter"],
    difficulty: 3,
  },

  // ---------- difficulty-5 edge cases & overlap items ----------
  {
    id: "q.priority.snow-bus-stopped",
    ruleIds: ["priority.school-bus", "speeds.adapted-speed", "adverse.winter-tires"],
    question:
      "On a snowy mountain road a school bus is stopped with hazards on; children are visible at the kerb side. You are descending and your tyres are summer tyres. The right approach is to:",
    diagramAssetId: "school-bus-stopped.svg",
    imageAlt:
      "A yellow school bus stopped at the kerb with four amber hazard lights blinking and child pictograms beside the door. Your blue car approaches at about 5 km/h — the slow-pace indicator is shown in green.",
    options: [
      { text: "Slow well below safe stopping speed for the surface, prepare to stop, and pass at walking pace if at all", correct: true },
      { text: "Pass at the posted limit since the bus is stopped on the verge", correct: false },
      { text: "Sound the horn so the children move back", correct: false },
    ],
    rationale:
      "Three rules pile up: pass stopped public-transport vehicles slowly, descending vehicle yields, tyres impose extra braking distance. Walking pace is the only safe answer.",
    tags: ["edge-case", "winter", "school-bus"],
    difficulty: 5,
  },
  {
    id: "q.scenario.zebra-tram-merge",
    ruleIds: ["maneuvers.pedestrian-crossing", "priority.tram"],
    question:
      "At a marked town crossing a pedestrian is mid-crossing while a tram is also approaching at low speed. You are stopped before the crossing. You may move on when:",
    options: [
      { text: "The pedestrian is clearly off the crossing AND the tram is no longer a hazard", correct: true },
      { text: "The pedestrian has stepped off your half of the road", correct: false },
      { text: "The tram driver waves you on", correct: false },
    ],
    rationale:
      "Both pedestrian (VRV Art. 33) and tram (Art. 38) priorities must clear before you move. Hand signals from a tram driver have no legal effect on your obligations.",
    tags: ["edge-case", "tram", "pedestrian"],
    difficulty: 5,
  },
  {
    id: "q.scenario.fog-night-zebra",
    ruleIds: ["maneuvers.pedestrian-crossing", "speeds.adapted-speed", "adverse.fog-lights"],
    question:
      "On a foggy night with 30 m visibility you approach an unsignalised town zebra crossing. Which combination of actions is correct?",
    options: [
      { text: "Drop to ~30 km/h, dipped headlights only (no high beams), be ready to brake to a full stop", correct: true },
      { text: "Maintain 50 km/h with high beams on for visibility", correct: false },
      { text: "Sound the horn continuously through the crossing zone", correct: false },
    ],
    rationale:
      "Speed ≈ visibility in metres rule, high beams cause whiteout in fog, and pedestrians may already be in the crossing. Three constraints, one safe answer.",
    tags: ["edge-case", "fog", "pedestrian"],
    difficulty: 5,
  },
  {
    id: "q.scenario.motorway-jam-after-tunnel",
    ruleIds: ["priority.rescue-corridor", "maneuvers.tunnel-behavior"],
    question:
      "Exiting a motorway tunnel into a sudden standstill, the safest sequence is:",
    diagramAssetId: "rettungsgasse-forming.svg",
    imageAlt:
      "Top view of a two-lane motorway in building traffic: vehicles in the left lane are steering fully left and vehicles in the right lane fully right so that a central corridor is beginning to form for emergency vehicles.",
    options: [
      { text: "Hazards on early, brake progressively, leave space ahead, then form the rescue corridor", correct: true },
      { text: "Brake hard immediately and stop in lane with no space ahead", correct: false },
      { text: "Cross to the hard shoulder so others can pass on the right", correct: false },
    ],
    rationale:
      "Two priorities at once: warn following drivers (hazards), and form Rettungsgasse from the standstill outwards. Leaving space ahead also gives a path out if the queue moves.",
    tags: ["edge-case", "tunnel", "motorway"],
    difficulty: 4,
    de: {
      question:
        "Sie verlassen einen Autobahntunnel und geraten unvermittelt in einen Stau. Welche Reihenfolge ist am sichersten?",
      options: [
        "Frühzeitig Warnblinker, gleichmässig bremsen, Abstand nach vorne lassen und dann die Rettungsgasse bilden",
        "Sofort scharf bremsen und ohne Abstand nach vorne in der Spur stehenbleiben",
        "Auf den Pannenstreifen ausweichen, damit andere rechts vorbeifahren können",
      ],
      rationale:
        "Zwei Prioritäten gleichzeitig: nachfolgende Fahrer warnen (Warnblinker) und aus dem Stillstand heraus eine Rettungsgasse bilden. Abstand nach vorne schafft zudem einen Ausweg, falls die Kolonne weiterrollt.",
      imageAlt:
        "Draufsicht auf eine zweispurige Autobahn in stockendem Verkehr: Fahrzeuge auf der linken Spur lenken nach links, Fahrzeuge auf der rechten Spur nach rechts — dazwischen öffnet sich die Rettungsgasse für Einsatzfahrzeuge.",
    },
  },
  {
    id: "q.scenario.descending-overtake-cyclist",
    ruleIds: ["maneuvers.overtaking-left", "mountain.descending-gear", "speeds.adapted-speed"],
    question:
      "On a winding descent you catch a cyclist climbing slowly into a blind right-hand bend. You should:",
    options: [
      { text: "Hold back behind the cyclist until the road opens up beyond the bend", correct: true },
      { text: "Overtake quickly while the cyclist is still slow", correct: false },
      { text: "Sound the horn and pass close to keep the manoeuvre brief", correct: false },
    ],
    rationale:
      "Overtaking around a blind bend on a descent piles three risks: oncoming traffic, cyclist instability, descent commit-distance. Patience is the only safe answer.",
    tags: ["edge-case", "mountain", "cyclist"],
    difficulty: 5,
  },
  {
    id: "q.scenario.aquaplaning-cruise",
    ruleIds: ["adverse.aquaplaning", "speeds.adapted-speed"],
    question:
      "You enter heavy rain on a motorway with cruise control engaged at 120 km/h. The right action is:",
    options: [
      { text: "Disengage cruise control immediately and reduce speed to a level safe for visibility and standing water", correct: true },
      { text: "Keep cruise on so the speed remains constant", correct: false },
      { text: "Set cruise to a slightly lower speed and continue", correct: false },
    ],
    rationale:
      "Cruise can mask aquaplaning and tries to maintain speed across a slippery patch. Disengage in heavy rain; control speed manually.",
    tags: ["edge-case", "aquaplaning"],
    difficulty: 4,
  },
  {
    id: "q.scenario.novice-bac-energy",
    ruleIds: ["fitness.bac-novice", "fitness.medications"],
    question:
      "You are on probation Cat. B and have taken cough syrup containing alcohol. After two doses you feel fine. You may drive:",
    options: [
      { text: "Only after waiting until any alcohol has fully cleared — your limit is 0.0 ‰", correct: true },
      { text: "Yes, because the alcohol is medical and not a beverage", correct: false },
      { text: "Yes, if you stay below 0.5 ‰", correct: false },
    ],
    rationale:
      "0.0 ‰ means zero; the source of the alcohol is irrelevant. Many cough syrups contain enough ethanol to put a novice over.",
    tags: ["edge-case", "bac", "novice"],
    difficulty: 5,
  },
  {
    id: "q.scenario.unprotected-left-tram",
    ruleIds: ["priority.tram", "priority.right-hand.default"],
    question:
      "At an unsignalised intersection you want to turn left. A tram is approaching from your left, and a car is approaching from your right. You should:",
    diagramAssetId: "tram-left-turn.svg",
    imageAlt:
      "Intersection top view: your blue car signals a left turn and waits on a dashed turning path while an oncoming amber tram on rails advances with a priority arrow — an analogous yielding scenario.",
    options: [
      { text: "Yield to both — the tram has priority over you AND the car from your right does too", correct: true },
      { text: "Yield only to the tram", correct: false },
      { text: "Turn first because the tram has further to come", correct: false },
    ],
    rationale:
      "Tram priority + right-hand rule + left-turn-yields-to-oncoming all stack against you. Wait for both.",
    tags: ["edge-case", "tram", "intersection"],
    difficulty: 5,
  },

  // ---------- close-out items: defaults & confirmations ----------
  {
    id: "q.facts.bac-zero-who",
    ruleIds: ["fitness.bac-novice", "fitness.bac-general"],
    question:
      "Which group must observe a 0.0 ‰ BAC limit in Switzerland?",
    options: [
      { text: "Holders of a probationary licence (first 3 years)", correct: true },
      { text: "Professional drivers in service (e.g., bus, taxi, lorry)", correct: true },
      { text: "All drivers under 25 years of age", correct: false },
    ],
    rationale:
      "0.0 ‰ applies to learners, probation drivers, professionals in service, and driving instructors. Age alone is not a criterion.",
    tags: ["bac"],
    difficulty: 2,
    de: {
      question:
        "Für welche Gruppen gilt in der Schweiz eine Promillegrenze von 0,0 ‰?",
      options: [
        "Inhaber eines Führerausweises auf Probe (die ersten 3 Jahre)",
        "Berufsmässige Fahrer im Dienst (z. B. Bus, Taxi, Lastwagen)",
        "Alle Fahrer unter 25 Jahren",
      ],
      rationale:
        "0,0 ‰ gilt für Lernfahrer, Fahrer in der Probezeit, berufsmässige Fahrer im Dienst und Fahrlehrer. Das Alter allein ist kein Kriterium.",
    },
  },
  {
    id: "q.facts.headlights-tunnel",
    ruleIds: ["mountain.headlights", "vehicle.headlights-day"],
    question:
      "Headlights inside a road tunnel must be:",
    options: [
      { text: "Switched on (dipped) regardless of the tunnel's own lighting", correct: true },
      { text: "Switched off if the tunnel has continuous overhead lighting", correct: false },
      { text: "Set to high beam for safety", correct: false },
    ],
    rationale:
      "VRV Art. 30: dipped headlights are obligatory in any tunnel, day or night, regardless of installed lighting.",
    tags: ["lights", "tunnel"],
    difficulty: 1,
  },
  {
    id: "q.facts.motorway-no-stopping",
    ruleIds: ["maneuvers.tunnel-behavior", "speeds.motorway-minimum"],
    question:
      "On a Swiss motorway you may stop:",
    options: [
      { text: "Only in an emergency, on the hard shoulder, with hazards on", correct: true },
      { text: "To check the map briefly", correct: false },
      { text: "If the passenger needs to swap with the driver", correct: false },
    ],
    rationale:
      "Stopping on a motorway is forbidden except for breakdown or accident; the hard shoulder is for emergencies only (VRV Art. 36).",
    tags: ["motorway"],
    difficulty: 2,
  },

  // ---------- additional difficulty-4 ----------
  {
    id: "q.priority.tram-vs-emergency",
    ruleIds: ["priority.tram", "priority.emergency-vehicles"],
    question:
      "A tram is approaching a junction with priority when an ambulance behind you switches on siren and blue lights. What takes precedence?",
    diagramAssetId: "emergency-approach-rear.svg",
    imageAlt:
      "Two-lane road top view: your blue car has pulled right to clear the inside lane; an ambulance with blue lights advances behind you with an amber priority arrow.",
    options: [
      { text: "Make way for the ambulance first, even if it means delaying the tram's path", correct: true },
      { text: "Finish yielding to the tram before reacting to the ambulance", correct: false },
      { text: "Emergency vehicles must wait for trams under all circumstances", correct: false },
    ],
    rationale:
      "SVG Art. 27(2) requires all road users — including drivers interacting with trams — to yield to emergency vehicles with siren and blue lights. Clear the path immediately; the tram driver will manage its own response.",
    tags: ["priority", "tram", "emergency"],
    difficulty: 4,
  },
  {
    id: "q.priority.roundabout-entering-overtaking",
    ruleIds: ["priority.roundabout", "maneuvers.overtaking-left"],
    question:
      "Two-lane roundabout: you entered in the outer lane but want the second exit. A cyclist is riding near the outer edge ahead of you.",
    diagramAssetId: "roundabout-2lane-cyclist.svg",
    imageAlt:
      "Top view of a two-lane roundabout. Your blue car is behind a cyclist in the outer lane. A green arrow marks 'stay and exit'; a red crossed-out path marks 'do not change lanes to overtake'.",
    options: [
      { text: "Stay behind the cyclist, hold the outer lane, and take the second exit without overtaking in the roundabout", correct: true },
      { text: "Swing to the inner lane to pass, then cross back for the exit", correct: false },
      { text: "Signal and overtake on the right within the roundabout", correct: false },
    ],
    rationale:
      "Overtaking cyclists inside a roundabout with tight radii is extremely dangerous; you have no room and lane-changing puts riders at risk. VRV Art. 41b: stay patient, keep the outer lane for exit, signal just before leaving.",
    tags: ["roundabout", "bicycles"],
    difficulty: 4,
  },
  {
    id: "q.maneuvers.overtaking-truck-uphill",
    ruleIds: ["maneuvers.overtaking-left", "mountain.ascending"],
    question:
      "You want to overtake a slow-moving truck on a two-lane mountain road going uphill, with a solid single line converting to a dashed line ahead after a blind rise.",
    options: [
      { text: "Wait until after the rise with clear long sight distance before committing", correct: true },
      { text: "Begin the overtake now — the line will be dashed by the time you're alongside", correct: false },
      { text: "Overtake quickly before the rise while visibility is still partial", correct: false },
    ],
    rationale:
      "Overtaking must be completed in fully observed sight distance (SVG Art. 35). A blind rise masks oncoming traffic even when the marking permits; the marking shows where you *may* overtake, not where it is *safe*.",
    tags: ["overtaking", "mountain", "sight-distance"],
    difficulty: 4,
  },
  {
    id: "q.adverse.aquaplaning-response",
    ruleIds: ["adverse.aquaplaning"],
    question:
      "At 100 km/h on motorway in heavy rain you feel the steering go light and hear a sudden change in tyre noise — classic aquaplaning.",
    options: [
      { text: "Ease off the accelerator smoothly and keep the wheel straight", correct: true },
      { text: "Brake hard to reduce speed immediately", correct: false },
      { text: "Steer firmly to re-establish grip", correct: false },
    ],
    rationale:
      "During aquaplaning the tyres ride on a water film: braking or steering inputs translate into skids. Release the throttle so the wheels slow with the water flow, keep the wheel straight, reapply control once noise returns.",
    tags: ["aquaplaning", "adverse"],
    difficulty: 4,
  },
  {
    id: "q.fitness.medication-label",
    ruleIds: ["fitness.medications"],
    question:
      "You are prescribed a new allergy medication. The package insert warns 'may affect reaction time; do not drive or operate machinery until you know how it affects you.' You feel fine. You should:",
    options: [
      { text: "Not drive until you've observed your personal reaction across at least one full dosing cycle", correct: true },
      { text: "Drive as usual — the warning is precautionary boilerplate", correct: false },
      { text: "Drive only if you've taken less than half the dose", correct: false },
    ],
    rationale:
      "SVG Art. 31 makes fitness-to-drive the driver's own responsibility. The label warning is legally binding context: if an accident occurs, ignoring it is negligent regardless of how you feel subjectively.",
    tags: ["medication", "fitness"],
    difficulty: 4,
  },
  {
    id: "q.penalties.speeding-inner-town-serious",
    ruleIds: ["penalties.speeding-katalog"],
    question:
      "Inside an urban 50 km/h zone you are clocked at 78 km/h (28 over). This falls under:",
    options: [
      { text: "A serious offence triggering mandatory licence withdrawal", correct: true },
      { text: "A minor infringement punishable by fine only", correct: false },
      { text: "The Raser threshold triggering criminal prosecution", correct: false },
    ],
    rationale:
      "The speeding catalogue (ASTRA) treats +25 km/h or more in a 50 zone as a grave offence with minimum one-month licence withdrawal. Raser begins at +50 km/h in 50-zone territory.",
    tags: ["penalties", "speeding"],
    difficulty: 4,
  },
  {
    id: "q.accidents.european-form-use",
    ruleIds: ["accidents.european-form", "accidents.documentation"],
    question:
      "Minor rear-end collision in a supermarket parking lot, no injuries, both drivers agreed on facts. You should:",
    options: [
      { text: "Complete the European Accident Statement (Europäischer Unfallbericht) together and each take a signed copy", correct: true },
      { text: "Exchange insurance cards verbally and drive off", correct: false },
      { text: "Wait for police — they must attend every collision", correct: false },
    ],
    rationale:
      "For minor property-damage collisions with agreement, the European form is the Swiss insurance industry's standard documentation. Police attendance is only mandatory for injury, disputed facts, or State-owned-vehicle involvement.",
    tags: ["accidents", "documentation"],
    difficulty: 4,
  },
  {
    id: "q.mountain.ascending-priority-narrow",
    ruleIds: ["mountain.ascending", "priority.yielding-on-entry"],
    question:
      "Narrow Swiss alpine single-track. You are descending and meet a vehicle coming up. There is a passing bay 40 m behind you and another 20 m behind the uphill car.",
    options: [
      { text: "You (descending) reverse to the nearer passing bay to let the uphill vehicle through", correct: true },
      { text: "The uphill vehicle reverses — they have the clearer sight line", correct: false },
      { text: "Whichever driver is closer to a bay takes it, regardless of direction", correct: false },
    ],
    rationale:
      "VRV Art. 9 and SVG Art. 10: on narrow mountain roads, descending traffic yields to ascending traffic. Reversing uphill is harder and heavy-vehicle-unfriendly; the rule is direction-based, not distance-based.",
    tags: ["mountain", "priority"],
    difficulty: 4,
  },
  {
    id: "q.vehicle.load-overhanging",
    ruleIds: ["vehicle.load-securing"],
    question:
      "You're transporting a 4.8 m ladder on a roof rack. The load:",
    options: [
      { text: "May overhang the rear up to 1 m without marking, beyond that it must be marked with a red flag (day) or red light (night)", correct: true },
      { text: "Must never overhang the silhouette of the vehicle", correct: false },
      { text: "May overhang freely as long as it is strapped down", correct: false },
    ],
    rationale:
      "VTS / VRV load-securing rules allow up to 1 m rear overhang unmarked; beyond 1 m requires the marker; total overhang plus vehicle length must stay within the vehicle class's permitted length. Side overhang is far more restrictive.",
    tags: ["load", "vehicle"],
    difficulty: 4,
  },
  {
    id: "q.fitness.fatigue-alcohol-interaction",
    ruleIds: ["fitness.fatigue-break", "fitness.bac-general"],
    question:
      "Legally you are at 0.4 ‰ BAC (below 0.5 ‰) but you have slept only four hours. You should:",
    options: [
      { text: "Not drive — fatigue multiplies alcohol impairment and you may still be unfit under SVG Art. 31", correct: true },
      { text: "Drive because the legal BAC limit is not exceeded", correct: false },
      { text: "Drive if you drink coffee first", correct: false },
    ],
    rationale:
      "SVG Art. 31 makes the driver responsible for being *fit*, independent of any single legal threshold. Fatigue + sub-threshold alcohol can objectively make you impaired; an accident at 0.4 ‰ with fatigue can still trigger a 'driving unfit' charge.",
    tags: ["fitness", "alcohol", "fatigue"],
    difficulty: 4,
  },

  // ---------- additional difficulty-5 edge cases ----------
  {
    id: "q.edge.tram-emergency-child",
    ruleIds: [
      "priority.tram",
      "priority.emergency-vehicles",
      "maneuvers.pedestrian-crossing",
    ],
    question:
      "You have green at an intersection. A tram is approaching from the left (also green), an ambulance behind you is sounding siren, AND a child has just stepped onto the pedestrian crossing to your right. You must:",
    options: [
      { text: "Stop for the child — pedestrian life takes absolute precedence over any other priority", correct: true },
      { text: "Proceed so the ambulance can use your clear corridor, since life-and-death overrides pedestrian right of way", correct: false },
      { text: "Yield to the tram first as it has track priority", correct: false },
    ],
    rationale:
      "Pedestrian protection at marked crossings (SVG Art. 33) is inviolable — you cannot 'trade' a child's safety for faster emergency passage. Stop; the ambulance driver is trained to work around stopped vehicles; the tram will see the pedestrian cause and hold.",
    tags: ["priority", "pedestrian", "edge-case"],
    difficulty: 5,
  },
  {
    id: "q.edge.mountain-snow-bus-descending",
    ruleIds: [
      "mountain.ascending",
      "mountain.chains-mandatory",
      "priority.school-bus",
      "adverse.winter-tires",
    ],
    question:
      "Single-lane alpine road, fresh snow, 'chains mandatory' sign at the base. You are ascending (with chains). A descending postal bus flashes its yellow lights to signal it is about to pull out of a layby at the switchback above you. Behind the bus a queue of four cars waits. You must:",
    options: [
      { text: "Stop, yield the uphill priority to the postal bus queue on this designated postal-route section, and pull into the nearest widening", correct: true },
      { text: "Hold your uphill priority — the bus must wait until your ascent is clear", correct: false },
      { text: "Reverse all the way to the base — mixed traffic should not meet on a chained single-lane", correct: false },
    ],
    rationale:
      "On postal-bus signalised mountain routes (SVG Art. 38) the yellow horn / lights and PostAuto priority override the general 'ascending has priority' rule. In snow with chains, ascending traffic is actually more stable than a loaded descending bus, and the postal-route priority exists precisely for this case.",
    tags: ["mountain", "priority", "edge-case", "winter"],
    difficulty: 5,
  },
];

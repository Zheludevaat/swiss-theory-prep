// Hand-authored seed rules. Replace / extend in the parallel content repo
// (`swiss-theory-content`) — these exist so the app is testable on day 1.
//
// Each rule is short, statable, and has worked examples for teach mode.
// Legal references use Swiss abbreviations: SVG (Strassenverkehrsgesetz),
// VRV (Verkehrsregelnverordnung), SSV (Signalisationsverordnung),
// VTS (Verordnung über die technischen Anforderungen an Strassenfahrzeuge),
// ARV (Arbeits- und Ruhezeitverordnung).

import type { Rule } from "./schema";

export const seedRules: Rule[] = [
  // ---------- priority ----------
  {
    id: "priority.right-hand.default",
    title: "Right-of-way from the right",
    statement:
      "At intersections where neither signs nor markings establish priority, the vehicle approaching from the right has priority.",
    category: "priority",
    legalRefs: ["VRV Art. 36"],
    tags: ["intersection"],
    examWeight: 0.95,
    workedExamples: [
      "Unmarked four-way in a residential area, a car approaches from your right: you yield.",
      "T-intersection on a side street: the vehicle on the through road has no marked priority, and a car coming from your right still has priority.",
    ],
    de: {
      title: "Rechtsvortritt",
      statement:
        "An Verzweigungen ohne Signale oder Markierungen, die den Vortritt regeln, hat das von rechts kommende Fahrzeug den Vortritt.",
      workedExamples: [
        "Unsignalisierte Kreuzung im Wohnquartier, ein Fahrzeug nähert sich von rechts: Sie gewähren ihm den Vortritt.",
        "T-Kreuzung in einer Nebenstrasse: das Fahrzeug auf der durchgehenden Strasse hat keinen markierten Vortritt — ein von rechts kommendes Fahrzeug hat trotzdem Vortritt.",
      ],
    },
  },
  {
    id: "priority.roundabout",
    title: "Roundabout priority",
    statement:
      "At a roundabout, traffic already inside the circle has priority. Use the indicator only when leaving.",
    category: "priority",
    legalRefs: ["VRV Art. 41b"],
    tags: ["roundabout"],
    examWeight: 0.9,
    workedExamples: [
      "Approaching a single-lane roundabout: yield to all vehicles already circulating.",
      "Inside the roundabout, indicate right just before the exit you intend to take.",
    ],
    de: {
      title: "Vortritt im Kreisverkehr",
      statement:
        "Im Kreisverkehr hat der Verkehr, der sich bereits im Kreis befindet, Vortritt. Der Blinker wird nur beim Verlassen des Kreisels gesetzt.",
      workedExamples: [
        "Einfahrt in einen einspurigen Kreisel: Sie gewähren allen bereits zirkulierenden Fahrzeugen den Vortritt.",
        "Im Kreisel blinken Sie erst kurz vor der Ausfahrt, die Sie nehmen, nach rechts.",
      ],
    },
  },
  {
    id: "priority.tram",
    title: "Trams have priority",
    statement:
      "Trams always have priority over other road traffic, including over road vehicles that would otherwise have priority from the right.",
    category: "priority",
    legalRefs: ["SVG Art. 38"],
    tags: ["tram"],
    examWeight: 0.7,
    workedExamples: [
      "At an unmarked intersection where a tram approaches from the left: you yield to the tram.",
      "A tram stops at a safety island: you pass slowly on the right at walking pace and give way to boarding/alighting passengers.",
    ],
    de: {
      title: "Strassenbahnen haben Vortritt",
      statement:
        "Strassenbahnen (Trams) haben gegenüber dem übrigen Verkehr immer Vortritt, auch gegenüber Fahrzeugen, die sonst Rechtsvortritt hätten.",
      workedExamples: [
        "An einer unsignalisierten Kreuzung nähert sich ein Tram von links: Sie gewähren dem Tram den Vortritt.",
        "Ein Tram hält bei einer Schutzinsel: Sie fahren rechts im Schritttempo vorbei und gewähren ein- und aussteigenden Fahrgästen den Vortritt.",
      ],
    },
  },
  {
    id: "priority.emergency-vehicles",
    title: "Emergency vehicles with blue lights and siren",
    statement:
      "Emergency vehicles (police, fire, ambulance) using blue lights and siren have priority over all other traffic. Other road users must clear a path immediately — typically by pulling to the right — and must not obstruct them, even at red lights or in queues.",
    category: "priority",
    legalRefs: ["SVG Art. 27", "VRV Art. 16"],
    tags: ["emergency", "blue-light", "siren"],
    examWeight: 0.8,
    workedExamples: [
      "An ambulance with blue lights and siren approaches from behind on a two-lane road: pull as far right as safe, slow, and let it pass. Stopping in-lane is not enough — it can block the path.",
      "In a queue at a red light with an emergency vehicle arriving: if safe and lawful, move aside (even partially onto the pavement edge is permitted to clear the path).",
    ],
    de: {
      title: "Einsatzfahrzeuge mit Blaulicht und Wechselklanghorn",
      statement:
        "Einsatzfahrzeuge (Polizei, Feuerwehr, Ambulanz) mit Blaulicht und Wechselklanghorn haben gegenüber dem gesamten übrigen Verkehr Vortritt. Andere Verkehrsteilnehmer müssen sofort Platz machen — in der Regel durch Ausweichen nach rechts — und dürfen sie auch bei Rot oder im Stau nicht behindern.",
      workedExamples: [
        "Eine Ambulanz mit Blaulicht und Horn nähert sich von hinten auf einer zweispurigen Strasse: Sie fahren so weit nach rechts wie sicher möglich, verlangsamen und lassen sie vorbei. In der Spur stehenzubleiben genügt nicht — das blockiert den Weg.",
        "Sie stehen im Stau vor einer roten Ampel, ein Einsatzfahrzeug nähert sich: wenn möglich und zulässig, weichen Sie aus (auch ein teilweises Aufrücken auf den Trottoirrand ist erlaubt, um den Weg freizugeben).",
      ],
    },
  },
  {
    id: "priority.yielding-on-entry",
    title: "Yielding when joining a priority road",
    statement:
      "When joining a priority road from a side street, driveway, or private property, you yield to all traffic on the priority road — in both directions — and enter only when you can do so without forcing anyone to brake.",
    category: "priority",
    legalRefs: ["VRV Art. 15"],
    tags: ["yield", "entry"],
    examWeight: 0.8,
    workedExamples: [
      "Leaving a supermarket car park onto a main road: you must yield to vehicles in both directions, even if the gap looks generous.",
      "Joining from a give-way-signed slip road: you may flow in without stopping only if no approaching vehicle would need to slow.",
    ],
    de: {
      title: "Vortritt beim Einmünden in eine Hauptstrasse",
      statement:
        "Wer von einer Nebenstrasse, einer Einfahrt oder aus privatem Grund auf eine Hauptstrasse einbiegt, gewährt dem gesamten Verkehr der Hauptstrasse Vortritt — in beiden Fahrtrichtungen — und fährt nur dann ein, wenn niemand wegen ihm bremsen muss.",
      workedExamples: [
        "Sie verlassen einen Supermarkt-Parkplatz auf eine Hauptstrasse: Sie müssen den Fahrzeugen in beiden Richtungen den Vortritt gewähren, auch wenn die Lücke grosszügig wirkt.",
        "Sie biegen über einen mit «Kein Vortritt» signalisierten Einfädelstreifen ein: Sie dürfen nur dann ohne Anhalten einschwenken, wenn kein sich näherndes Fahrzeug abbremsen müsste.",
      ],
    },
  },
  {
    id: "priority.rescue-corridor",
    title: "Rescue corridor (Rettungsgasse) on multi-lane roads",
    statement:
      "On motorways and multi-lane roads, as soon as traffic slows to a stop or crawl, vehicles in the left lane move fully left, vehicles in other lanes move fully right, forming a continuous corridor between the left and next-to-left lanes for emergency services.",
    category: "priority",
    legalRefs: ["VRV Art. 36 Abs. 1bis"],
    tags: ["emergency", "highway"],
    examWeight: 0.75,
    workedExamples: [
      "Traffic in front of you brakes to a standstill on a three-lane motorway: the left lane moves fully left, the middle and right lanes move fully right — the gap is between left and middle.",
      "You must form the corridor as soon as traffic slows, not only when you hear sirens — emergency services can approach from behind without warning.",
    ],
    de: {
      title: "Rettungsgasse auf mehrspurigen Strassen",
      statement:
        "Auf Autobahnen und mehrspurigen Strassen bilden Fahrzeuge, sobald der Verkehr zum Stillstand kommt oder nur noch im Schritttempo rollt, eine Rettungsgasse: Fahrzeuge auf der linken Spur fahren ganz nach links, Fahrzeuge auf den übrigen Spuren ganz nach rechts. So entsteht zwischen der linken und der zweitlinken Spur eine durchgehende Gasse für die Einsatzfahrzeuge.",
      workedExamples: [
        "Der Verkehr vor Ihnen bremst auf einer dreispurigen Autobahn bis zum Stillstand ab: die linke Spur rückt ganz nach links, die mittlere und rechte Spur rücken ganz nach rechts — die Gasse liegt zwischen linker und mittlerer Spur.",
        "Sie müssen die Rettungsgasse bilden, sobald der Verkehr ins Stocken gerät — nicht erst, wenn Sie Sirenen hören. Einsatzfahrzeuge können sich ohne Vorwarnung von hinten nähern.",
      ],
    },
  },
  {
    id: "priority.school-bus",
    title: "Stopped school buses and post buses",
    statement:
      "When a school bus signals with flashing yellow warning lights at a stop, pass only at walking pace and be prepared to stop. Post buses (PostAuto) leaving a stop have priority over following traffic on narrow alpine roads; elsewhere the normal signalling rules apply.",
    category: "priority",
    legalRefs: ["VRV Art. 18", "VRV Art. 41 Abs. 3"],
    tags: ["school", "bus", "postbus"],
    examWeight: 0.5,
    workedExamples: [
      "A school bus with flashing yellow lights is stopped at the roadside: reduce to walking pace and watch for children stepping out between parked vehicles.",
      "A post bus signals to pull out from a stop on a mountain road marked with the post-horn sign: you yield, even if it means slowing.",
    ],
  },

  // ---------- signs ----------
  {
    id: "signs.stop",
    title: "Stop sign (3.01)",
    statement:
      "At a stop sign, you must come to a complete stop at the marked line (or before the crossing if no line is marked) and then yield to all cross traffic.",
    category: "signs",
    legalRefs: ["SSV Art. 36"],
    tags: ["sign:3.01"],
    examWeight: 0.95,
    workedExamples: [
      "Approaching a stop sign on a quiet road with no visible cross traffic: still required to stop completely (wheels at zero), then proceed.",
      "A stop line exists: stop at the line even if cross traffic is visible only past the building at the corner. You may then creep forward to see clearly.",
    ],
    de: {
      title: "Stopp-Signal (3.01)",
      statement:
        "Beim Stopp-Signal müssen Sie an der Haltelinie (oder vor der Kreuzung, falls keine Linie markiert ist) vollständig anhalten und anschliessend dem gesamten Querverkehr Vortritt gewähren.",
      workedExamples: [
        "Sie nähern sich einem Stopp-Signal auf einer ruhigen Strasse ohne sichtbaren Querverkehr: trotzdem müssen Sie vollständig anhalten (Räder stehen still), bevor Sie weiterfahren.",
        "Eine Haltelinie ist markiert: Sie halten an der Linie, auch wenn der Querverkehr erst hinter dem Eckgebäude sichtbar wird. Sie dürfen danach langsam nach vorne rollen, bis die Sicht frei ist.",
      ],
    },
  },
  {
    id: "signs.give-way",
    title: "Give-way / yield (3.02)",
    statement:
      "At a give-way sign you must yield to traffic on the priority road but you do not need to stop if the way is clear.",
    category: "signs",
    legalRefs: ["SSV Art. 36"],
    tags: ["sign:3.02"],
    examWeight: 0.85,
    workedExamples: [
      "Joining a main road from a slip with a give-way sign: slow, check, proceed without stopping if no traffic.",
      "Traffic is approaching fast from your left on the priority road: you must stop and wait, even though the sign itself does not order a stop.",
    ],
    de: {
      title: "«Kein Vortritt» (3.02)",
      statement:
        "Beim Signal «Kein Vortritt» müssen Sie dem Verkehr auf der Hauptstrasse den Vortritt gewähren, müssen aber nicht zwingend anhalten, wenn die Fahrbahn frei ist.",
      workedExamples: [
        "Sie biegen über eine Auffahrt mit «Kein Vortritt» auf eine Hauptstrasse ein: verlangsamen, prüfen, bei freier Fahrbahn ohne Anhalten weiterfahren.",
        "Auf der Hauptstrasse nähert sich von links zügig Verkehr: Sie müssen anhalten und warten, auch wenn das Signal selbst nicht zum Halten zwingt.",
      ],
    },
  },
  {
    id: "signs.no-overtaking",
    title: "No overtaking (2.06)",
    statement:
      "From a no-overtaking sign (red car overtaking black car inside a red ring) you may not overtake other motor vehicles until the end-of-prohibition sign (2.27) or the next intersection.",
    category: "signs",
    legalRefs: ["SSV Art. 19"],
    tags: ["sign:2.06"],
    examWeight: 0.65,
    workedExamples: [
      "Bicycles and tractors moving slower than 30 km/h may still be overtaken even where the sign applies.",
      "The prohibition ends automatically at the next intersection unless the sign is repeated after it.",
    ],
    de: {
      title: "Überholverbot (2.06)",
      statement:
        "Ab dem Signal «Überholen verboten» (rotes Auto überholt schwarzes Auto im roten Ring) dürfen Sie keine anderen Motorfahrzeuge mehr überholen — bis zum Aufhebungssignal (2.27) oder bis zur nächsten Verzweigung.",
      workedExamples: [
        "Fahrräder und Traktoren mit weniger als 30 km/h dürfen auch dort überholt werden, wo das Verbot gilt.",
        "Das Verbot endet automatisch bei der nächsten Verzweigung, sofern das Signal danach nicht wiederholt wird.",
      ],
    },
  },
  {
    id: "signs.priority-road",
    title: "Priority road (3.03 / 3.04)",
    statement:
      "The yellow-diamond priority-road sign (3.03) grants you priority over traffic on crossing side roads until the end-of-priority-road sign (3.04) cancels it. While on a priority road, the right-hand rule does not apply at intersections you cross.",
    category: "signs",
    legalRefs: ["SSV Art. 37"],
    tags: ["sign:3.03", "sign:3.04", "priority"],
    examWeight: 0.75,
    workedExamples: [
      "Driving through a town on a road marked with the yellow-diamond 3.03: crossing traffic from unsigned side streets must yield to you, regardless of which side they come from.",
      "After passing the 3.04 end-of-priority sign: the right-hand rule resumes, so a car approaching from an unmarked side street on your right now has priority.",
    ],
    de: {
      title: "Hauptstrasse (3.03 / 3.04)",
      statement:
        "Das gelb-weisse Rautensignal «Hauptstrasse» (3.03) gibt Ihnen Vortritt gegenüber dem Verkehr aus querenden Nebenstrassen — bis das Signal «Ende der Hauptstrasse» (3.04) diesen Vortritt wieder aufhebt. Auf einer Hauptstrasse gilt an den querenden Einmündungen kein Rechtsvortritt.",
      workedExamples: [
        "Sie fahren in einer Ortschaft auf einer mit 3.03 signalisierten Strasse: aus unsignalisierten Nebenstrassen einmündender Querverkehr muss Ihnen Vortritt gewähren, egal von welcher Seite er kommt.",
        "Nach dem Passieren von 3.04 («Ende der Hauptstrasse») gilt wieder der Rechtsvortritt — ein von rechts aus einer unsignalisierten Nebenstrasse kommendes Fahrzeug hat nun Vortritt vor Ihnen.",
      ],
    },
  },
  {
    id: "signs.no-entry",
    title: "No entry (2.02)",
    statement:
      "A red disc with a white horizontal bar prohibits entry for all motor vehicles. It is typically used for one-way streets — you are facing the wrong way — and cannot be ignored even briefly.",
    category: "signs",
    legalRefs: ["SSV Art. 17"],
    tags: ["sign:2.02", "one-way"],
    examWeight: 0.7,
    workedExamples: [
      "You see a red disc with white bar at the mouth of a street: do not enter, even to turn around or park. Find another route.",
      "The other end of the same street typically has a one-way sign (4.08) — residents driving with the flow are legal, you driving against it are not.",
    ],
    de: {
      title: "Einfahrt verboten (2.02)",
      statement:
        "Eine rote Scheibe mit waagrechtem weissem Balken verbietet die Einfahrt für alle Motorfahrzeuge. Das Signal steht typischerweise am falschen Ende einer Einbahnstrasse — auch ein kurzes Hineinfahren ist verboten.",
      workedExamples: [
        "Sie sehen am Beginn einer Strasse eine rote Scheibe mit weissem Balken: nicht einfahren, auch nicht zum Wenden oder Parken. Suchen Sie eine andere Route.",
        "Das andere Ende derselben Strasse trägt meist das Einbahnsignal (4.08) — Anwohner mit dem Verkehr sind legal unterwegs, Sie entgegen der Fahrtrichtung nicht.",
      ],
    },
  },
  {
    id: "signs.one-way",
    title: "One-way street (4.08)",
    statement:
      "A white arrow on blue square indicates a one-way street. Traffic may move only in the direction of the arrow; the opposite end is marked with a no-entry sign.",
    category: "signs",
    legalRefs: ["SSV Art. 57"],
    tags: ["sign:4.08", "one-way"],
    examWeight: 0.55,
    workedExamples: [
      "You enter a street marked with a white arrow on blue: traffic flows only in that direction; parking rules still apply to both kerbs.",
      "A one-way sign with a small supplementary panel showing a bicycle in the opposite direction means bicycles are exempt and may ride against the flow.",
    ],
    de: {
      title: "Einbahnstrasse (4.08)",
      statement:
        "Ein weisser Pfeil auf blauem Quadrat kennzeichnet eine Einbahnstrasse. Der Verkehr darf sich nur in Pfeilrichtung bewegen; das andere Ende trägt das Signal «Einfahrt verboten».",
      workedExamples: [
        "Sie biegen in eine Strasse mit weissem Pfeil auf blauem Grund ein: Verkehr nur in Pfeilrichtung; Parkregeln gelten weiterhin für beide Fahrbahnränder.",
        "Eine Einbahnsignal-Tafel mit einer kleinen Zusatztafel, die ein Fahrrad in Gegenrichtung zeigt, bedeutet, dass Fahrräder ausgenommen sind und gegen die Fahrtrichtung fahren dürfen.",
      ],
    },
  },
  {
    id: "signs.no-parking",
    title: "No parking (2.17)",
    statement:
      "A blue disc with a single red diagonal slash prohibits stationary parking. Short stops for loading or boarding are permitted; leaving the vehicle for other purposes is not.",
    category: "signs",
    legalRefs: ["SSV Art. 30"],
    tags: ["sign:2.17", "parking"],
    examWeight: 0.6,
    workedExamples: [
      "You need to run into a shop for two minutes under a no-parking sign: not permitted — that counts as parking, not a brief load/unload.",
      "You stop for thirty seconds to let a passenger out: permitted, because it is a stop for boarding, not parking.",
    ],
    de: {
      title: "Parkieren verboten (2.17)",
      statement:
        "Eine blaue Scheibe mit einem einzigen roten Schrägstrich verbietet das Parkieren. Kurzes Halten zum Ein- oder Aussteigen und zum Güterumschlag ist erlaubt; das Verlassen des Fahrzeugs zu anderen Zwecken nicht.",
      workedExamples: [
        "Sie wollen kurz für zwei Minuten in ein Geschäft unter einem «Parkieren verboten»-Signal: nicht erlaubt — das gilt als Parkieren, nicht als Güterumschlag.",
        "Sie halten dreissig Sekunden, damit ein Beifahrer aussteigt: erlaubt, denn es ist ein Halten zum Aussteigen, kein Parkieren.",
      ],
    },
  },
  {
    id: "signs.no-stopping",
    title: "No stopping (2.16)",
    statement:
      "A blue disc with a red X crossed through it prohibits stopping entirely. Even brief halts to drop passengers or load goods are forbidden except when traffic control (signals, pedestrians, police) requires it.",
    category: "signs",
    legalRefs: ["SSV Art. 30"],
    tags: ["sign:2.16", "parking"],
    examWeight: 0.6,
    workedExamples: [
      "You see a blue disc with a red X: you may not stop to drop a passenger, even for a few seconds.",
      "The sign does not prevent obeying traffic signals — stopping at a red light or for a pedestrian on a crossing is always required.",
    ],
    de: {
      title: "Halten verboten (2.16)",
      statement:
        "Eine blaue Scheibe mit einem roten Andreaskreuz verbietet das Halten vollständig. Selbst kurzes Halten zum Aussteigen oder Güterumschlag ist verboten — ausser wenn der Verkehr (Signale, Fussgänger, Polizei) Sie zum Halten zwingt.",
      workedExamples: [
        "Sie sehen eine blaue Scheibe mit rotem Kreuz: Sie dürfen nicht halten, um einen Beifahrer aussteigen zu lassen — auch nicht für wenige Sekunden.",
        "Das Signal hebt verkehrsbedingtes Halten nicht auf — vor Rotlicht oder für einen Fussgänger auf dem Streifen müssen Sie selbstverständlich anhalten.",
      ],
    },
  },
  {
    id: "signs.children-warning",
    title: "Children warning (1.19)",
    statement:
      "A triangular warning sign (SSV 1.19) with two running child figures indicates a zone where children are likely — schools, playgrounds, residential streets. Reduce speed, increase following distance, and be ready to brake.",
    category: "signs",
    legalRefs: ["SSV Art. 5", "SSV Anhang 2 Ziff. 1.19"],
    tags: ["sign:1.19", "children"],
    examWeight: 0.55,
    workedExamples: [
      "You see the children-warning sign ahead of a school at the start of the school day: slow well below the posted limit in case a child runs into the road.",
      "The warning itself does not change the speed limit — your duty is to adapt speed to conditions (VRV Art. 4).",
    ],
  },
  {
    id: "signs.mandatory-direction",
    title: "Mandatory direction (2.40–2.47 series)",
    statement:
      "A blue disc with a white arrow (SSV 2.40–2.47) requires you to take the indicated direction at the next intersection. Combinations of arrows permit multiple directions. Disobeying is treated as a prohibited movement, not merely poor lane choice.",
    category: "signs",
    legalRefs: ["SSV Art. 21", "SSV Anhang 2 Ziff. 2.40–2.47"],
    tags: ["sign:2.40", "direction"],
    examWeight: 0.5,
    workedExamples: [
      "A blue disc with a straight-up arrow: you must continue straight — turning right or left is prohibited.",
      "A blue disc with straight + right arrows: you may continue straight or turn right, but not turn left.",
    ],
  },
  {
    id: "signs.bicycle-path",
    title: "Bicycle path (2.51 / 2.53)",
    statement:
      "A blue disc with a white bicycle (SSV 2.51) marks a path reserved for bicycles; motor vehicles must not use it. A combination disc (2.53) shows a pedestrian and bicycle on a shared path.",
    category: "signs",
    legalRefs: ["SSV Art. 33", "SSV Anhang 2 Ziff. 2.51", "SSV Anhang 2 Ziff. 2.53"],
    tags: ["sign:2.51", "bicycle"],
    examWeight: 0.45,
    workedExamples: [
      "A marked bicycle path runs parallel to the road: motorised traffic must stay on the road; crossing the path requires yielding to cyclists on it.",
      "Shared pedestrian/bicycle sign: cyclists ride at reduced speed and yield to pedestrians; motorised vehicles have no right to enter at all.",
    ],
  },
  {
    id: "signs.end-of-zone",
    title: "End of zone (2.53.x)",
    statement:
      "A zone sign with a diagonal line through it (Tempo-30, Begegnungszone, pedestrian zone, etc.) cancels that zone's rules. Previous defaults resume: typically 50 km/h in town and priority by signs.",
    category: "signs",
    legalRefs: ["SSV Art. 22a–22c"],
    tags: ["sign:end-of-zone", "zone"],
    examWeight: 0.5,
    workedExamples: [
      "You pass an 'end Tempo-30' sign: the limit becomes 50 km/h (or whatever is posted next) and right-of-way from the right no longer applies as the zone default.",
      "A 'Begegnungszone 20 km/h' end sign returns the limit to 50 and removes pedestrian priority that applied inside the zone.",
    ],
  },
  {
    id: "signs.dead-end",
    title: "Dead-end street (4.09)",
    statement:
      "A blue square with a horizontal red bar marks a dead-end street. The supplementary T-shape showing a pedestrian or bicycle indicates the street continues for those users but not for motor traffic.",
    category: "signs",
    legalRefs: ["SSV Art. 57"],
    tags: ["sign:4.09", "dead-end"],
    examWeight: 0.3,
    workedExamples: [
      "A plain dead-end sign: entering is legal but you must turn around and come back out; no through-route exists.",
      "A dead-end sign with a pedestrian pictogram at the bar's end: the street ends for cars but pedestrians may continue via a path — useful when planning a route through town.",
    ],
  },
  {
    id: "signs.no-vehicles",
    title: "No vehicles (2.01)",
    statement:
      "A round white sign with a wide red border (SSV 2.01) bans all vehicles in both directions. It is the most general prohibition — applies to motor vehicles, bicycles, and even hand carts unless an exception plate is shown.",
    category: "signs",
    legalRefs: ["SSV Art. 18", "SSV Anhang 2 Ziff. 2.01"],
    tags: ["sign:2.01", "prohibition"],
    examWeight: 0.55,
    workedExamples: [
      "An empty white disc with a red border at the start of a forest road: no vehicles of any kind may enter.",
      "Same sign with a 'forestry vehicles excepted' plate underneath: forestry trucks may pass; private cars still may not.",
    ],
  },
  {
    id: "signs.no-uturn",
    title: "No U-turn (2.05)",
    statement:
      "A round white sign with red border showing a U-shaped arrow (SSV 2.05) prohibits making a U-turn. The ban applies until the next intersection or a cancelling sign.",
    category: "signs",
    legalRefs: ["SSV Art. 19", "SSV Anhang 2 Ziff. 2.05"],
    tags: ["sign:2.05", "u-turn"],
    examWeight: 0.45,
    workedExamples: [
      "You miss your turn on a road posted with the no-U-turn sign: continue to the next intersection and turn around there, not on the road itself.",
      "A no-U-turn sign at the start of a one-way street: this both bans U-turns and (combined with 2.02 if posted) reverses traffic.",
    ],
  },
  {
    id: "signs.speed-limit",
    title: "Maximum speed (2.09)",
    statement:
      "A round white sign with red border and a black numeral (SSV 2.09) sets the maximum speed in km/h on that road. The limit applies to all motor vehicles unless a class-specific sign overrides it. It remains in force until cancelled (2.25) or replaced.",
    category: "signs",
    legalRefs: ["SSV Art. 22", "SSV Anhang 2 Ziff. 2.09"],
    tags: ["sign:2.09", "speed"],
    examWeight: 0.95,
    workedExamples: [
      "A sign showing '60' on a country road outside town: from this point your maximum is 60 km/h, regardless of the prior 80 km/h default.",
      "A '40' sign on a town road: it overrides the 50 km/h built-up default until cancelled or until the road clearly leaves the built-up area.",
    ],
    de: {
      title: "Höchstgeschwindigkeit (2.09)",
      statement:
        "Eine runde weisse Scheibe mit rotem Rand und schwarzer Zahl (SSV 2.09) legt die Höchstgeschwindigkeit in km/h auf der betreffenden Strasse fest. Die Begrenzung gilt für alle Motorfahrzeuge, sofern kein klassenspezifisches Signal sie überlagert, und bleibt in Kraft, bis sie aufgehoben (2.25) oder ersetzt wird.",
      workedExamples: [
        "Ein Signal «60» auf einer Ausserortsstrasse: ab hier ist Ihre Höchstgeschwindigkeit 60 km/h, unabhängig von der vorherigen Allgemeinhöchstgeschwindigkeit von 80 km/h.",
        "Ein Signal «40» innerorts: es überlagert die 50-km/h-Allgemeinhöchstgeschwindigkeit, bis es aufgehoben wird oder die Ortschaft klar verlassen wird.",
      ],
    },
  },
  {
    id: "signs.general-50",
    title: "General speed limit 50 (2.10)",
    statement:
      "The blue rectangular sign with '50 generell' (SSV 2.10) marks entry to a built-up area where 50 km/h applies as the general default for all roads, even those without a posted limit. It is cancelled by 2.26.",
    category: "signs",
    legalRefs: ["SSV Art. 22", "SSV Anhang 2 Ziff. 2.10"],
    tags: ["sign:2.10", "speed", "built-up"],
    examWeight: 0.7,
    workedExamples: [
      "You pass the blue '50 generell' sign at the village edge: 50 km/h becomes the default everywhere in town until you see 2.26.",
      "Inside the built-up area you find a side street with no posted limit: 50 still applies because of the general 50 sign at the entrance.",
    ],
    de: {
      title: "Allgemeine Höchstgeschwindigkeit 50 (2.10)",
      statement:
        "Die blaue Rechtecktafel «50 generell» (SSV 2.10) markiert den Beginn einer Ortschaft, in der 50 km/h als Allgemeinhöchstgeschwindigkeit für alle Strassen gilt — auch für jene ohne ausgeschildertes Tempolimit. Aufgehoben wird sie durch 2.26.",
      workedExamples: [
        "Sie passieren am Ortsanfang die blaue Tafel «50 generell»: ab hier gilt überall in der Ortschaft 50 km/h, bis Sie das Aufhebungssignal 2.26 sehen.",
        "Innerorts finden Sie eine Nebenstrasse ohne eigenes Tempolimit: es gelten weiterhin 50 km/h dank der «50 generell»-Tafel am Ortseingang.",
      ],
    },
  },
  {
    id: "signs.no-bicycles",
    title: "No bicycles / mopeds (2.19)",
    statement:
      "A red-bordered disc with a bicycle silhouette (SSV 2.19) prohibits bicycles and mopeds. This is common on motorways and on roads where cyclists must use a parallel bicycle path.",
    category: "signs",
    legalRefs: ["SSV Art. 18", "SSV Anhang 2 Ziff. 2.19"],
    tags: ["sign:2.19", "bicycle", "prohibition"],
    examWeight: 0.45,
    workedExamples: [
      "A road parallel to a marked cycle path shows the no-bicycles sign at its entry: cyclists must use the path, not the road.",
      "A motorway entrance always carries this sign by default — bicycles, mopeds, pedestrians and slow vehicles are all forbidden on motorways.",
    ],
  },
  {
    id: "signs.no-trucks",
    title: "No trucks (2.21)",
    statement:
      "A red-bordered disc with a truck silhouette (SSV 2.21) prohibits trucks above the standard light-truck weight. Light vans and cars are not affected. A weight figure on a plate below restricts more narrowly.",
    category: "signs",
    legalRefs: ["SSV Art. 19", "SSV Anhang 2 Ziff. 2.21"],
    tags: ["sign:2.21", "truck", "prohibition"],
    examWeight: 0.4,
    workedExamples: [
      "A village road posts the no-trucks sign: light vans and passenger cars may still enter; only trucks must take the bypass.",
      "Same sign with a '7t' plate below: lorries above 7 tonnes are banned, lighter trucks may pass.",
    ],
  },
  {
    id: "signs.no-motor-vehicles",
    title: "No motor vehicles (2.24)",
    statement:
      "A red-bordered disc showing a car and motorcycle (SSV 2.24) prohibits all motor vehicles. Bicycles, mopeds, agricultural vehicles, and pedestrians remain allowed unless a separate sign also bans them.",
    category: "signs",
    legalRefs: ["SSV Art. 18", "SSV Anhang 2 Ziff. 2.24"],
    tags: ["sign:2.24", "prohibition"],
    examWeight: 0.4,
    workedExamples: [
      "A forest track marked with the no-motor-vehicles sign: cars and motorcycles may not enter, but cyclists and walkers may.",
      "Distinguish from 2.01 (no vehicles at all) — 2.24 specifically targets engine-powered vehicles only.",
    ],
  },
  {
    id: "signs.end-speed-limit",
    title: "End of speed limit (2.25)",
    statement:
      "A round white sign with the previous limit numeral struck through by a black diagonal line (SSV 2.25) cancels a posted maximum speed. The applicable default then applies — typically 80 km/h on country roads.",
    category: "signs",
    legalRefs: ["SSV Art. 22", "SSV Anhang 2 Ziff. 2.25"],
    tags: ["sign:2.25", "speed", "end"],
    examWeight: 0.55,
    workedExamples: [
      "A '60' end sign on a country road: the limit returns to the country-road default of 80 km/h.",
      "An end-of-60 sign inside a town: the built-up 50 km/h default resumes, not 80, because the 'general 50' sign is still in effect.",
    ],
  },
  {
    id: "signs.end-overtaking-ban",
    title: "End of overtaking ban (2.27)",
    statement:
      "A white disc with the two-car overtaking pictogram crossed out by a diagonal line (SSV 2.27) cancels a no-overtaking ban posted with 2.06. Normal overtaking rules then apply.",
    category: "signs",
    legalRefs: ["SSV Art. 19", "SSV Anhang 2 Ziff. 2.27"],
    tags: ["sign:2.27", "overtaking", "end"],
    examWeight: 0.4,
    workedExamples: [
      "After a long no-overtaking stretch you see the diagonal-line variant of the sign: overtaking is again allowed where conditions permit.",
      "The end sign does not lower the speed limit, nor does it grant any new priority — only the overtaking ban is lifted.",
    ],
  },
  {
    id: "signs.end-prohibitions",
    title: "End of all restrictions (2.28)",
    statement:
      "A white disc with multiple thin diagonal lines (SSV 2.28, 'Freie Fahrt') cancels every previously posted prohibition simultaneously — speed, overtaking, weight, etc. The road's defaults return.",
    category: "signs",
    legalRefs: ["SSV Art. 16", "SSV Anhang 2 Ziff. 2.28"],
    tags: ["sign:2.28", "end"],
    examWeight: 0.4,
    workedExamples: [
      "After a stretch with limits on speed, weight, and overtaking you see the 'Freie Fahrt' sign: all three are lifted at once.",
      "The sign does not override the general 50 km/h built-up area — that limit comes from 2.10 and is only cancelled by 2.26.",
    ],
  },
  {
    id: "signs.roundabout",
    title: "Roundabout (2.50)",
    statement:
      "A blue disc with three curved arrows (SSV 2.50) marks a roundabout. Combined with the give-way sign (3.02) at the entry, it confirms that traffic already inside has priority.",
    category: "signs",
    legalRefs: ["SSV Art. 24", "SSV Anhang 2 Ziff. 2.50"],
    tags: ["sign:2.50", "roundabout"],
    examWeight: 0.7,
    workedExamples: [
      "Approaching the blue 'three-arrow' sign with a give-way triangle: yield to vehicles already circulating, then enter without signalling.",
      "Inside the roundabout you only signal right just before exiting — the sign establishes the geometry, not a new priority rule.",
    ],
  },
  {
    id: "signs.shared-pedestrian-bicycle",
    title: "Shared bike/pedestrian path (2.53)",
    statement:
      "A blue disc with both a bicycle and a pedestrian (SSV 2.53) marks a shared path. Cyclists and pedestrians share the surface; cyclists must travel at low speed and yield to pedestrians.",
    category: "signs",
    legalRefs: ["SSV Art. 33", "SSV Anhang 2 Ziff. 2.53"],
    tags: ["sign:2.53", "bicycle", "pedestrian"],
    examWeight: 0.4,
    workedExamples: [
      "A blue disc with bike and walker side by side: cyclists ride slowly and give way to walkers; motor vehicles still may not enter.",
      "Sign 2.54 (separated path) divides the surface with a vertical line — each user has their own side.",
    ],
  },
  {
    id: "signs.minimum-speed",
    title: "Minimum speed (2.56)",
    statement:
      "A blue disc with a white numeral (SSV 2.56) sets a minimum speed in km/h. Vehicles unable to maintain at least that speed must not use the road. Common at the entry of motorways or fast tunnels.",
    category: "signs",
    legalRefs: ["SSV Art. 22", "SSV Anhang 2 Ziff. 2.56"],
    tags: ["sign:2.56", "speed", "minimum"],
    examWeight: 0.3,
    workedExamples: [
      "A blue '60' sign at a tunnel entrance: vehicles incapable of 60 km/h (slow tractors, mopeds) must take an alternative route.",
      "The minimum-speed sign is round and blue — distinguish from the round red-bordered '60' which is a maximum.",
    ],
  },
  {
    id: "signs.snow-chains",
    title: "Snow chains required (2.57)",
    statement:
      "A blue disc with a tyre-and-chain pictogram (SSV 2.57) requires snow chains on at least two driving wheels. It applies in winter on certain mountain passes during snow conditions.",
    category: "signs",
    legalRefs: ["SSV Art. 30", "SSV Anhang 2 Ziff. 2.57"],
    tags: ["sign:2.57", "winter", "mountain"],
    examWeight: 0.35,
    workedExamples: [
      "A pass road posts the snow-chains sign during a snowfall: you must fit chains to two driving wheels before continuing — 4-season tyres alone are not sufficient.",
      "The sign is cancelled by a corresponding end sign (often a struck-through chain) further uphill.",
    ],
  },
  {
    id: "signs.give-way-to-oncoming",
    title: "Give way to oncoming (3.05)",
    statement:
      "A square white sign with a black upward arrow and a red downward arrow (SSV 3.05) requires you to yield to oncoming traffic on a narrow stretch. Used where two-way traffic cannot pass safely side by side.",
    category: "signs",
    legalRefs: ["SSV Art. 36", "SSV Anhang 2 Ziff. 3.05"],
    tags: ["sign:3.05", "narrow", "priority"],
    examWeight: 0.5,
    workedExamples: [
      "On a narrow bridge with the 'give way to oncoming' sign on your side: stop short and let the oncoming car pass before crossing.",
      "The matching priority-over-oncoming sign (3.06) faces the opposite direction so only one side has priority.",
    ],
  },
  {
    id: "signs.priority-over-oncoming",
    title: "Priority over oncoming (3.06)",
    statement:
      "A square blue sign with a white upward arrow and a red downward arrow (SSV 3.06) grants you priority through a narrow section. Oncoming traffic must wait. The sign always pairs with 3.05 facing the other way.",
    category: "signs",
    legalRefs: ["SSV Art. 36", "SSV Anhang 2 Ziff. 3.06"],
    tags: ["sign:3.06", "narrow", "priority"],
    examWeight: 0.5,
    workedExamples: [
      "You see the blue 'priority over oncoming' sign before a narrow road-works contraflow: continue without stopping, but be ready to yield if an oncoming driver fails to obey 3.05.",
      "Priority does not justify driving without due care — VRV Art. 4 still requires speed adapted to view and conditions.",
    ],
  },
  {
    id: "signs.end-priority-road",
    title: "End of priority road (3.04)",
    statement:
      "The yellow-diamond priority-road sign with a black diagonal stripe (SSV 3.04) cancels priority. From this point on, the right-hand rule applies again unless local signs say otherwise.",
    category: "signs",
    legalRefs: ["SSV Art. 22", "SSV Anhang 2 Ziff. 3.04"],
    tags: ["sign:3.04", "priority", "end"],
    examWeight: 0.5,
    workedExamples: [
      "Driving on a priority road through town, you see the diamond struck through with a black bar: at the next intersection vehicles from your right have priority again.",
      "Until you see this sign or a give-way/stop sign, you keep priority — even at large-looking side roads.",
    ],
  },
  {
    id: "signs.junction-right-priority",
    title: "Junction with right-hand priority (3.10)",
    statement:
      "A black-on-yellow square sign showing a T or +-junction with thick lines (SSV 3.10) warns that vehicles from the right have priority at the next junction. Used where drivers might assume priority from main-road appearance.",
    category: "signs",
    legalRefs: ["SSV Art. 37", "SSV Anhang 2 Ziff. 3.10"],
    tags: ["sign:3.10", "priority", "intersection"],
    examWeight: 0.45,
    workedExamples: [
      "A wide-looking road into a residential area shows this sign: at the next junction the side street from your right has priority despite the road's appearance.",
      "Sign 3.11 instead warns of a non-priority road joining your priority road — opposite situation.",
    ],
  },
  {
    id: "signs.junction-non-priority",
    title: "Junction with non-priority road (3.11)",
    statement:
      "A black-on-yellow square sign showing a thinner side road meeting a thicker through road (SSV 3.11) warns that you are on the priority road and a side road joins. You keep priority unless other signs override it.",
    category: "signs",
    legalRefs: ["SSV Art. 37", "SSV Anhang 2 Ziff. 3.11"],
    tags: ["sign:3.11", "priority", "intersection"],
    examWeight: 0.45,
    workedExamples: [
      "The thicker line points along your direction of travel: traffic from the joining side street must yield to you.",
      "The sign confirms priority but does not increase your speed limit — speed depends on the speed sign in force.",
    ],
  },
  {
    id: "signs.warning-curves",
    title: "Curve warning signs (1.01–1.04)",
    statement:
      "Red-bordered triangular warning signs (SSV 1.01–1.04) announce single or double curves. Reduce speed before the curve so braking inside the curve is unnecessary; brake straight, steer slow.",
    category: "signs",
    legalRefs: ["VRV Art. 4", "SSV Anhang 2 Ziff. 1.01–1.04"],
    tags: ["sign:1.01", "sign:1.02", "warning", "curve"],
    examWeight: 0.55,
    workedExamples: [
      "A 1.02 right-curve warning before a wet bend: brake on the straight, choose a gear that lets you accelerate gently out of the curve.",
      "Double-curve sign 1.03: the first curve is to the left — plan your line so the second (right) curve is also catered for.",
    ],
  },
  {
    id: "signs.warning-pedestrian-crossing",
    title: "Pedestrian crossing ahead (1.18)",
    statement:
      "A triangular warning sign showing a pedestrian on a striped crossing (SSV 1.18) warns of a pedestrian crossing further along. Slow enough to stop if a pedestrian appears; overtaking is prohibited approaching the crossing.",
    category: "signs",
    legalRefs: ["VRV Art. 33", "SSV Anhang 2 Ziff. 1.18"],
    tags: ["sign:1.18", "warning", "pedestrian"],
    examWeight: 0.5,
    workedExamples: [
      "A 1.18 sign on a town avenue: be ready to brake and watch the kerbs even before you can see the zebra.",
      "Even without the warning sign, an unsignalised zebra crossing always confers priority to waiting pedestrians.",
    ],
  },
  {
    id: "signs.warning-slippery",
    title: "Slippery road (1.10)",
    statement:
      "A triangular warning sign with a skidding car icon (SSV 1.10) warns of an unusually slippery surface — wet leaves, oil, or polished asphalt. Reduce speed, brake gently, avoid sudden steering inputs.",
    category: "signs",
    legalRefs: ["VRV Art. 4", "SSV Anhang 2 Ziff. 1.10"],
    tags: ["sign:1.10", "warning", "slippery"],
    examWeight: 0.45,
    workedExamples: [
      "A 1.10 sign before a section that is shaded year-round: slow well below the limit; the surface may be damp or icy when nowhere else is.",
      "A supplementary plate showing 'glatte Fahrbahn bei Nässe' restricts the warning to wet conditions only.",
    ],
  },
  {
    id: "signs.warning-tram",
    title: "Tram crossing (1.17)",
    statement:
      "A triangular warning sign showing a tram (SSV 1.17) warns of a tram line crossing or sharing the road. Trams have priority by default; rails can also throw bicycles and motorcycles off-line.",
    category: "signs",
    legalRefs: ["VRV Art. 38", "SSV Anhang 2 Ziff. 1.17"],
    tags: ["sign:1.17", "warning", "tram"],
    examWeight: 0.4,
    workedExamples: [
      "A 1.17 sign in town: expect a tram to cross or share the road — a tram from your left has priority over you.",
      "Cross tram rails at as steep an angle as possible to reduce the risk of a wheel slipping into the groove.",
    ],
  },
  {
    id: "signs.warning-other-dangers",
    title: "Other dangers (1.26)",
    statement:
      "A triangular warning sign with an exclamation mark (SSV 1.26) warns of an unspecified hazard. A supplementary plate names it. Without a plate, slow and look ahead carefully.",
    category: "signs",
    legalRefs: ["VRV Art. 4", "SSV Anhang 2 Ziff. 1.26"],
    tags: ["sign:1.26", "warning"],
    examWeight: 0.35,
    workedExamples: [
      "A 1.26 sign with a 'Smoke' plate near a sawmill: visibility may suddenly drop — slow and turn on dipped headlights.",
      "1.26 alone in winter often warns of black ice — a real and frequent hazard.",
    ],
  },
  {
    id: "signs.distance-plate",
    title: "Supplementary distance plate (5.01)",
    statement:
      "A small white rectangular plate placed below a sign and showing a distance in metres (SSV 5.01) tells you how far ahead the announced situation begins. It does not change the sign's meaning, only its location.",
    category: "signs",
    legalRefs: ["SSV Art. 63", "SSV Anhang 2 Ziff. 5.01"],
    tags: ["sign:5.01", "supplementary"],
    examWeight: 0.35,
    workedExamples: [
      "A no-overtaking sign with '300 m' below it: the ban begins 300 m further on, not at this sign — it is just a pre-warning.",
      "A children-warning sign with '100 m': children may be expected starting 100 m further on, e.g. at the school yard around the bend.",
    ],
  },
  {
    id: "signs.length-plate",
    title: "Length-of-section plate (5.02)",
    statement:
      "A small white rectangular plate showing a distance with arrows (SSV 5.02) gives the length of the section to which the sign applies. Useful for steep descents, slippery road warnings, or no-overtaking stretches.",
    category: "signs",
    legalRefs: ["SSV Art. 63", "SSV Anhang 2 Ziff. 5.02"],
    tags: ["sign:5.02", "supplementary"],
    examWeight: 0.3,
    workedExamples: [
      "A steep-descent sign with a '4 km' length plate: plan engine braking and cooling for the full descent, not just the next bend.",
      "A no-overtaking sign with '2 km' length plate: even if traffic clears, the ban remains until you have travelled the full 2 km.",
    ],
  },
  {
    id: "signs.icy-road-plate",
    title: "Icy road plate (5.05)",
    statement:
      "A supplementary plate showing 'Vereiste Fahrbahn' or an ice-crystal symbol (SSV 5.05) restricts a slippery-road warning to icy conditions. The warning applies whenever ice is or may be present.",
    category: "signs",
    legalRefs: ["VRV Art. 4", "SSV Anhang 2 Ziff. 5.05"],
    tags: ["sign:5.05", "supplementary", "winter"],
    examWeight: 0.3,
    workedExamples: [
      "A 1.10 slippery-road sign with a 5.05 ice plate: ice is the specific hazard; in dry summer conditions you may treat the section normally.",
      "Even without 5.05, a slippery-road sign forces caution year-round — 5.05 only narrows the warning to ice.",
    ],
  },

  // ---------- maneuvers ----------
  {
    id: "maneuvers.pedestrian-crossing",
    title: "Pedestrian crossings",
    statement:
      "At an unsignalised pedestrian crossing you must yield to pedestrians who are on the crossing or clearly approaching it. You may not overtake on the approach.",
    category: "maneuvers",
    legalRefs: ["VRV Art. 33"],
    tags: ["pedestrian"],
    examWeight: 0.85,
    workedExamples: [
      "Approaching a zebra with a pedestrian visibly waiting at the kerb and looking to cross: stop and let them pass.",
      "Parking is prohibited within 10 m before the crossing on both sides of the road so approaching drivers can see pedestrians about to step off.",
    ],
  },
  {
    id: "maneuvers.keep-right",
    title: "Keep right and lane discipline",
    statement:
      "Outside town, traffic drives as far right as safe. On multi-lane roads, overtake on the left, then return to the right as soon as you can do so without forcing the overtaken vehicle to brake.",
    category: "maneuvers",
    legalRefs: ["SVG Art. 34", "VRV Art. 7"],
    tags: ["lane", "highway"],
    examWeight: 0.8,
    workedExamples: [
      "You finish overtaking on a two-lane highway: move back to the right promptly; lingering in the left lane is a fault.",
      "In-town driving: keep to the right but need not hug the kerb; drive at a sensible offset to allow for parked cars opening doors and pedestrians stepping out.",
    ],
  },
  {
    id: "maneuvers.lane-change",
    title: "Lane change on multi-lane roads",
    statement:
      "Before changing lanes: check mirrors, look over the shoulder, signal in time, and complete the change without forcing another driver to brake or swerve. Signal only in the direction you actually move.",
    category: "maneuvers",
    legalRefs: ["SVG Art. 34", "VRV Art. 28"],
    tags: ["lane-change", "mirrors"],
    examWeight: 0.75,
    workedExamples: [
      "You move from the middle lane to the right lane on a motorway: mirror, indicator, blind-spot check, then a smooth single manoeuvre — no drift.",
      "In a queue stopped at a red light, switching lanes at the last moment to reach the turning lane is a signalling violation because it forces others to adjust.",
    ],
  },
  {
    id: "maneuvers.overtaking-left",
    title: "Overtake on the left",
    statement:
      "Overtaking other motor vehicles is permitted only on the left. You must have clear forward visibility, sufficient speed reserve, and space to return to the right without crowding.",
    category: "maneuvers",
    legalRefs: ["VRV Art. 10", "VRV Art. 35"],
    tags: ["overtaking"],
    examWeight: 0.8,
    workedExamples: [
      "You approach a slow lorry on a country road with a solid oncoming curve: do not start an overtake you cannot finish inside the sight line.",
      "Trams in the centre of the street: you may overtake on the right if there is space; on the left is also allowed when no oncoming traffic prevents it.",
    ],
  },
  {
    id: "maneuvers.undertaking-ban",
    title: "Undertaking ban on motorways",
    statement:
      "On motorways and expressways, passing a vehicle on the right (undertaking) is prohibited. Driving faster in a right lane than in an adjacent left lane is permitted only when traffic is dense and moving in lanes.",
    category: "maneuvers",
    legalRefs: ["VRV Art. 36 Abs. 5"],
    tags: ["motorway", "overtaking"],
    examWeight: 0.7,
    workedExamples: [
      "A driver cruises in the middle lane at 100 km/h while the right lane is clear: you must not sweep past them on the right. Flash, wait, or use the left lane.",
      "Stop-and-go rush-hour traffic where both lanes crawl: passing on the right within the flow of stationary lanes is permitted because everyone is moving as a group.",
    ],
  },
  {
    id: "maneuvers.parking-distances",
    title: "Parking distances and forbidden spots",
    statement:
      "Parking is prohibited within 5 m of an intersection corner, within 10 m before a pedestrian crossing, in front of driveways, on zebra crossings, within 1.5 m of fire hydrants, and on bike paths. Where space between kerb and vehicle is less than 3 m on a public road, you may not park opposite another parked vehicle.",
    category: "maneuvers",
    legalRefs: ["VRV Art. 18", "VRV Art. 19"],
    tags: ["parking"],
    examWeight: 0.75,
    workedExamples: [
      "A zebra crossing is 8 m ahead: do not park between your current spot and the crossing — the 10 m exclusion starts at the crossing, not at the sign post.",
      "A driveway to a house entrance: do not park directly in front, even briefly, unless the occupant has agreed. This applies both on public roads and in private forecourts visible to traffic.",
    ],
  },
  {
    id: "maneuvers.u-turn",
    title: "U-turn legality",
    statement:
      "U-turns are prohibited on motorways, expressways, narrow roads, within 50 m of intersections without clear visibility, on pedestrian crossings, at railway level crossings, and wherever a prohibition sign applies. Elsewhere they are allowed only when they do not endanger or obstruct traffic.",
    category: "maneuvers",
    legalRefs: ["VRV Art. 17"],
    tags: ["u-turn"],
    examWeight: 0.55,
    workedExamples: [
      "You realise you missed an exit on a motorway: you may not turn back; continue to the next exit.",
      "A quiet two-lane road with unlimited sight in both directions and no nearby intersections: a U-turn is permitted, but you still signal and yield to any approaching traffic.",
    ],
  },
  {
    id: "maneuvers.reversing",
    title: "Reversing rules",
    statement:
      "Reversing is permitted only over short distances and only when you can see the path is clear; otherwise you must have a competent person guide you. Reversing on motorways and expressways is prohibited at all times.",
    category: "maneuvers",
    legalRefs: ["VRV Art. 17"],
    tags: ["reversing"],
    examWeight: 0.5,
    workedExamples: [
      "You need to leave a perpendicular parking space: reverse only once you have checked all around — use mirrors, camera, and a direct look back. Do not rely on mirrors alone.",
      "On a motorway you miss the exit: continue to the next one. Reversing to reach the missed exit is a serious offence.",
    ],
  },
  {
    id: "maneuvers.tunnel-behavior",
    title: "Tunnel entry, driving, and breakdown",
    statement:
      "Before entering a tunnel: switch on low beams, remove sunglasses, check distance to the vehicle ahead (≥2 seconds, more in long tunnels). On breakdown: use hazard lights, stop in a lay-by if possible, keep the engine running only long enough to move clear, then leave the vehicle on the uphill side and walk to the nearest emergency call point.",
    category: "maneuvers",
    legalRefs: ["SSV Art. 36", "VRV Art. 39"],
    tags: ["tunnel"],
    examWeight: 0.55,
    workedExamples: [
      "Approaching a long Gotthard-style tunnel: low beams on before the portal (not at the portal), sunglasses off, maintain the 2-second gap printed on the wall markers.",
      "Engine fails mid-tunnel: hazards on, coast into the breakdown lay-by, leave the vehicle and walk to a yellow SOS phone cabinet — do not attempt repairs in the traffic lane.",
    ],
  },
  {
    id: "maneuvers.signalling",
    title: "Signal use and direction indicators",
    statement:
      "Signal every intended change of direction and lane change, in time for other road users to react, and cancel the signal once the manoeuvre is complete. Do not signal when not moving — for example, do not leave indicators on during a long wait in traffic.",
    category: "maneuvers",
    legalRefs: ["VRV Art. 28"],
    tags: ["signalling"],
    examWeight: 0.65,
    workedExamples: [
      "Turning right into a side street: signal before you begin to slow, not during the turn, so following traffic knows you plan to decelerate.",
      "You overtake and return to the right lane: cancel the left signal and briefly signal right before moving back, so the overtaken driver can read your intent.",
    ],
  },
  {
    id: "maneuvers.hazard-lights",
    title: "Hazard lights and their lawful use",
    statement:
      "Hazard warning lights are used to warn other traffic of imminent danger — most importantly when approaching the back of a stopped queue on a motorway, during a breakdown, being towed, or during an accident. They are not a substitute for indicators on lane changes or parking.",
    category: "maneuvers",
    legalRefs: ["VRV Art. 29 Abs. 1bis"],
    tags: ["hazard-lights"],
    examWeight: 0.5,
    workedExamples: [
      "You see traffic ahead slam on brakes on the motorway: briefly switch on hazard lights to warn drivers behind you of the forming queue.",
      "You double-park briefly while collecting a child from school: hazards do not make this legal, and should not be used to substitute for finding a legal spot.",
    ],
  },
  {
    id: "maneuvers.seatbelt",
    title: "Seatbelt and child restraint duty",
    statement:
      "Every occupant of a seat with a seatbelt must wear it while the vehicle is in motion. Children under 12 shorter than 150 cm must use an approved restraint system appropriate to their weight. The driver is responsible for passengers under 18.",
    category: "maneuvers",
    legalRefs: ["VRV Art. 3a"],
    tags: ["seatbelt", "children"],
    examWeight: 0.55,
    workedExamples: [
      "Adult passenger refuses to buckle up: the driver is penalised, not only the passenger, because the duty to ensure proper restraint is on the driver for minors and on each adult for themselves.",
      "A 9-year-old child who is 145 cm tall: must use a booster seat or equivalent; a regular adult belt alone does not comply.",
    ],
  },

  // ---------- speeds ----------
  {
    id: "speeds.default-limits",
    title: "Default speed limits",
    statement:
      "Unless signed otherwise: 50 km/h in built-up areas, 80 km/h on rural roads, 100 km/h on expressways, 120 km/h on motorways.",
    category: "speeds",
    legalRefs: ["VRV Art. 4a"],
    tags: ["speed"],
    examWeight: 0.95,
    workedExamples: [
      "On an unsigned country road outside a town: maximum 80 km/h.",
      "Entering a town with the place-name sign: 50 km/h applies until the end-of-town sign.",
    ],
    de: {
      title: "Allgemeine Höchstgeschwindigkeiten",
      statement:
        "Ohne anderslautende Signalisation gilt: 50 km/h innerorts, 80 km/h ausserorts, 100 km/h auf Autostrassen, 120 km/h auf Autobahnen.",
      workedExamples: [
        "Auf einer nicht signalisierten Landstrasse ausserorts: maximal 80 km/h.",
        "Beim Passieren der Ortstafel gilt 50 km/h bis zum Ende-Ortstafel-Signal.",
      ],
    },
  },
  {
    id: "speeds.tempo30",
    title: "Tempo-30 zones",
    statement:
      "Inside a Tempo-30 zone, the limit is 30 km/h and right-of-way from the right applies at every intersection unless signed otherwise. There are typically no zebra crossings.",
    category: "speeds",
    legalRefs: ["SSV Art. 22a"],
    tags: ["zone", "tempo30"],
    examWeight: 0.7,
    workedExamples: [
      "On a Tempo-30 residential street, you must yield to pedestrians on the road but they cross anywhere — there is no marked crossing.",
      "A car approaches from your right at a side-street junction inside the zone: even without a priority sign, you yield — Tempo-30 keeps the right-hand rule.",
    ],
    de: {
      title: "Tempo-30-Zone",
      statement:
        "In der Tempo-30-Zone gilt Höchstgeschwindigkeit 30 km/h. An allen Verzweigungen gilt ohne anderslautende Signalisation der Rechtsvortritt. Fussgängerstreifen sind in der Regel nicht markiert.",
      workedExamples: [
        "In einer Tempo-30-Quartierstrasse: Fussgänger dürfen die Fahrbahn überall überqueren — es gibt keinen markierten Streifen.",
        "Ein Fahrzeug nähert sich von rechts aus einer Seitenstrasse innerhalb der Zone: Rechtsvortritt gilt trotz fehlender Signalisation.",
      ],
    },
  },
  {
    id: "speeds.motorway-minimum",
    title: "Motorway minimum usable speed",
    statement:
      "Motorways and expressways are reserved for motor vehicles that can sustain at least 60 km/h on the flat. Slower vehicles — tractors, mopeds, bicycles, E-bikes limited to 45 km/h — may not use them.",
    category: "speeds",
    legalRefs: ["VRV Art. 35"],
    tags: ["motorway", "speed"],
    examWeight: 0.5,
    workedExamples: [
      "A vintage car that tops out at 55 km/h: not allowed on the motorway. Use the parallel cantonal road.",
      "An agricultural tractor: not allowed on any motorway or expressway, regardless of its speed.",
    ],
    de: {
      title: "Mindestgeschwindigkeit auf der Autobahn",
      statement:
        "Autobahnen und Autostrassen sind Motorfahrzeugen vorbehalten, die in der Ebene mindestens 60 km/h erreichen können. Langsamere Fahrzeuge — Traktoren, Mofas, Fahrräder, auf 45 km/h begrenzte E-Bikes — sind nicht zugelassen.",
      workedExamples: [
        "Ein Oldtimer, der höchstens 55 km/h fährt: nicht autobahnzulässig. Stattdessen auf der parallelen Kantonsstrasse fahren.",
        "Ein landwirtschaftlicher Traktor: weder auf Autobahn noch Autostrasse zugelassen, unabhängig von der erreichten Geschwindigkeit.",
      ],
    },
  },
  {
    id: "speeds.trailer-reduced",
    title: "Trailer and towing speed limits",
    statement:
      "When towing a trailer with a Cat. B vehicle: 80 km/h on all roads including motorways (the 120 km/h default does not apply). Exceeding this is a moving violation, not a parking fault.",
    category: "speeds",
    legalRefs: ["VRV Art. 5"],
    tags: ["trailer", "towing", "speed"],
    examWeight: 0.55,
    workedExamples: [
      "You drive a car towing a small cargo trailer on the motorway: maximum 80 km/h regardless of posted limits of 120.",
      "Camping trailer behind your car on a national highway: 80 km/h applies everywhere; you stay in the right lane unless overtaking a slower vehicle.",
    ],
    de: {
      title: "Höchstgeschwindigkeit mit Anhänger",
      statement:
        "Mit einem Anhänger hinter einem Cat.-B-Fahrzeug gilt auf allen Strassen inklusive Autobahn 80 km/h (die allgemeinen 120 km/h gelten nicht). Überschreitungen sind eine bewegliche Übertretung.",
      workedExamples: [
        "Personenwagen mit kleinem Lastanhänger auf der Autobahn: höchstens 80 km/h, auch wenn 120 signalisiert ist.",
        "Wohnwagen am Zugfahrzeug auf der Nationalstrasse: 80 km/h gilt überall; bleiben Sie auf der rechten Spur, ausser zum Überholen langsamerer Fahrzeuge.",
      ],
    },
  },
  {
    id: "speeds.begegnungszone",
    title: "Begegnungszone (encounter zone, 20 km/h)",
    statement:
      "An encounter zone limits motor traffic to 20 km/h. Pedestrians have priority over vehicles and may use the entire width of the road; vehicles may not be parked outside marked bays.",
    category: "speeds",
    legalRefs: ["SSV Art. 22b"],
    tags: ["zone", "begegnungszone"],
    examWeight: 0.5,
    workedExamples: [
      "You enter a Begegnungszone at the door of a restaurant district: drive at 20 km/h maximum and yield to pedestrians stepping off the kerb.",
      "You cannot park on the street in a Begegnungszone unless you are within a marked parking bay — even a short stop to load must be within marked areas.",
    ],
    de: {
      title: "Begegnungszone (20 km/h)",
      statement:
        "In der Begegnungszone gilt für Fahrzeuge Höchstgeschwindigkeit 20 km/h. Fussgänger haben Vortritt und dürfen die ganze Strassenbreite benützen. Parkieren ist nur auf markierten Feldern erlaubt.",
      workedExamples: [
        "Sie fahren in eine Begegnungszone vor einem Restaurantbereich: höchstens 20 km/h und Fussgängern Vortritt gewähren, sobald diese die Fahrbahn betreten.",
        "Parkieren in der Begegnungszone ist nur innerhalb markierter Felder zulässig — auch kurzes Halten zum Laden muss innerhalb der Markierung erfolgen.",
      ],
    },
  },
  {
    id: "speeds.adapted-speed",
    title: "Adapt speed to conditions",
    statement:
      "The posted limit is a maximum, not a target. You must reduce speed when visibility, weather, road surface, traffic density, or the presence of vulnerable road users means the limit would be unsafe. Driving at the limit when conditions are adverse is itself a violation.",
    category: "speeds",
    legalRefs: ["VRV Art. 4"],
    tags: ["speed", "conditions"],
    examWeight: 0.85,
    workedExamples: [
      "Heavy fog reduces visibility to about 60 m on an 80 km/h road: you must slow to a speed from which you can stop inside your sight line — likely 40 km/h or less, not 80.",
      "A 30 km/h limit through a school zone at dismissal time: the 30 may still be too fast if children are running near the road. Reduce further.",
    ],
    de: {
      title: "Geschwindigkeit den Verhältnissen anpassen",
      statement:
        "Die signalisierte Geschwindigkeit ist eine Höchstgrenze, nicht eine Sollgeschwindigkeit. Bei eingeschränkter Sicht, schlechtem Wetter, schlechtem Strassenzustand, dichtem Verkehr oder Anwesenheit schwacher Verkehrsteilnehmer muss die Geschwindigkeit reduziert werden. Mit der signalisierten Höchstgeschwindigkeit unter ungünstigen Bedingungen zu fahren ist eine Verkehrsregelverletzung.",
      workedExamples: [
        "Dichter Nebel reduziert die Sicht auf 60 m auf einer 80er-Strasse: Sie müssen auf eine Geschwindigkeit reduzieren, bei der Sie innerhalb der Sichtweite anhalten können — wahrscheinlich 40 km/h oder weniger, nicht 80.",
        "30 km/h vor einer Schule beim Schulschluss: Auch 30 kann zu schnell sein, wenn Kinder neben der Strasse rennen. Weiter reduzieren.",
      ],
    },
  },
  {
    id: "speeds.school-approach",
    title: "Approaching schools and playgrounds",
    statement:
      "On roads passing schools, kindergartens, and playgrounds you must be ready for children stepping into the road without warning. The sensible speed is usually well below the posted limit at start and end of school day, especially if view is obstructed by parked cars.",
    category: "speeds",
    legalRefs: ["VRV Art. 4", "SSV Art. 5"],
    tags: ["children", "school"],
    examWeight: 0.55,
    workedExamples: [
      "You approach a school marked with the children-warning sign at 08:05: drop to a speed you can stop from immediately — often 30 km/h is sensible even if the sign says 50.",
      "A line of parked cars in front of a playground: slow down and expect a ball (and a child following) to emerge between two cars without looking.",
    ],
    de: {
      title: "Annäherung an Schulen und Kinderspielplätze",
      statement:
        "Auf Strassen entlang Schulen, Kindergärten und Spielplätzen müssen Sie damit rechnen, dass Kinder ohne Vorwarnung auf die Fahrbahn treten. Die angepasste Geschwindigkeit liegt zu Schulbeginn und Schulschluss meist deutlich unter der signalisierten Höchstgeschwindigkeit, besonders wenn die Sicht durch parkierte Fahrzeuge eingeschränkt ist.",
      workedExamples: [
        "Sie nähern sich um 08:05 einer Schule mit Kinder-Warnsignal: auf eine Geschwindigkeit reduzieren, bei der Sie sofort anhalten können — häufig sind 30 km/h sinnvoll, auch wenn 50 signalisiert ist.",
        "Eine Reihe parkierter Fahrzeuge vor einem Spielplatz: Geschwindigkeit reduzieren und damit rechnen, dass ein Ball (und ein Kind dahinter) zwischen den Autos hervortritt.",
      ],
    },
  },

  // ---------- mountain ----------
  {
    id: "mountain.ascending",
    title: "Mountain road: ascending vehicle has priority",
    statement:
      "On narrow mountain roads where two vehicles cannot pass, the descending vehicle yields to the ascending vehicle, except when a passing place behind the ascending vehicle is closer.",
    category: "mountain",
    legalRefs: ["VRV Art. 38"],
    tags: ["mountain", "narrow"],
    examWeight: 0.7,
    workedExamples: [
      "Two cars meet on a single-lane alpine pass: the one going downhill backs up to the nearest passing place.",
      "An ascending heavy vehicle vs. a descending car with a passing bay just 5 m uphill: the descending car still reverses uphill into the bay if it is the closer passing place.",
    ],
  },
  {
    id: "mountain.chains-mandatory",
    title: "Snow chains mandatory sign",
    statement:
      "A circular blue sign showing a tyre with chains means snow chains are mandatory on at least two driving wheels. It overrides the usual 'winter tyres appropriate to conditions' rule. A matching end-of-obligation sign cancels it.",
    category: "mountain",
    legalRefs: ["SSV Art. 31"],
    tags: ["sign:2.48", "winter", "chains"],
    examWeight: 0.55,
    workedExamples: [
      "You approach a mountain pass with a 'chains required' sign: fit chains on at least two driving wheels before continuing, even if the road looks dry at that moment.",
      "End-of-chains sign: you may remove the chains but should still drive carefully — the surface may still be mixed snow/ice.",
    ],
  },
  {
    id: "mountain.descending-gear",
    title: "Descending mountain roads: engine braking",
    statement:
      "On long descents, use a low gear to let engine braking hold your speed. Riding the service brakes causes fade and loss of braking power; the correct technique is to pick a gear that limits speed naturally, with brakes used only for short corrections.",
    category: "mountain",
    legalRefs: ["VRV Art. 4"],
    tags: ["mountain", "braking"],
    examWeight: 0.55,
    workedExamples: [
      "A 10 km descent at 12% grade: shift down so the engine holds you near the speed limit; brake in short bursts only to adjust before corners.",
      "You smell hot brakes mid-descent: the brakes are already over-heated. Pull over safely, let them cool, and use a lower gear for the remainder.",
    ],
  },
  {
    id: "mountain.headlights",
    title: "Headlights in alpine roads and galleries",
    statement:
      "Through covered galleries, short tunnels, and mountain avalanche shelters you must have at least low beams on. Daytime running lights are not always enough — rear DRLs are not required and rear lights must also be lit.",
    category: "mountain",
    legalRefs: ["VRV Art. 41"],
    tags: ["mountain", "lights"],
    examWeight: 0.4,
    workedExamples: [
      "Short unlit gallery on an alpine pass: low beams on before entry; switching to headlights after you enter is too late.",
      "Many DRL systems turn off the rear lights — in a gallery this is unlawful. Explicitly switch on low beams to ensure both front and rear lights are lit.",
    ],
  },
  {
    id: "mountain.heavy-vehicle-priority",
    title: "Heavy vehicles on steep gradients",
    statement:
      "A heavy goods vehicle ascending a narrow or steep mountain road retains priority over descending cars. When heavy traffic (buses, lorries) is on an alpine route, lighter vehicles should expect to reverse to passing places more often, not less.",
    category: "mountain",
    legalRefs: ["VRV Art. 38"],
    tags: ["mountain", "heavy-vehicle"],
    examWeight: 0.45,
    workedExamples: [
      "A coach and your car meet on a narrow ascending alpine road: even if you were travelling 'first', back up to the nearest bay rather than ask the coach to reverse.",
      "A descending lorry approaches your ascending car on a single lane: you hold position because you're ascending, but if a bay is much closer behind you, courtesy and safety argue for reversing into it.",
    ],
  },

  // ---------- adverse-conditions ----------
  {
    id: "adverse.aquaplaning",
    title: "Aquaplaning response",
    statement:
      "On heavy water layers, do not brake abruptly or steer suddenly. Lift off the accelerator, hold the wheel straight, and let speed bleed off until tyres regain contact.",
    category: "adverse-conditions",
    legalRefs: ["SVG Art. 31"],
    tags: ["rain", "skid"],
    examWeight: 0.5,
    workedExamples: [
      "Felt the steering go light in a deep puddle at speed: relax pressure on the gas, do not jerk the wheel.",
      "You feel the front tyres float briefly through standing water: keep steering straight and let speed wash off naturally; sudden inputs are what turn aquaplaning into a crash.",
    ],
  },
  {
    id: "adverse.fog-lights",
    title: "Fog lights and rear fog lamp",
    statement:
      "Use the rear fog lamp only when visibility falls below about 50 m. Using it in light rain or clear weather dazzles drivers behind you. Front fog lights are permitted when visibility is reduced by fog, heavy rain, or snow.",
    category: "adverse-conditions",
    legalRefs: ["VRV Art. 41"],
    tags: ["fog", "lights"],
    examWeight: 0.5,
    workedExamples: [
      "Visibility drops to 30 m on a motorway: fog lights and rear fog lamp on; reduce speed so you can stop inside the visible distance.",
      "Fog lifts and visibility is back to 200 m: switch off the rear fog lamp immediately — leaving it on is an offence.",
    ],
  },
  {
    id: "adverse.winter-tires",
    title: "Winter tyres and adapted equipment",
    statement:
      "Swiss law does not mandate winter tyres by calendar date but requires tyres appropriate to conditions. On snow or ice, summer tyres are typically inadequate, and the driver is liable for any resulting accident — insurance may reduce payout for clearly inappropriate tyres.",
    category: "adverse-conditions",
    legalRefs: ["SVG Art. 29", "VTS Art. 58"],
    tags: ["winter", "tyres"],
    examWeight: 0.65,
    workedExamples: [
      "You drive on summer tyres after a snowfall and skid into a parked car: the accident is attributed to your choice of tyre, not 'unavoidable conditions'.",
      "Forecast says snow in the mountains but not in the plains: fit winter tyres if you plan to reach the higher altitudes; the rule is practical adequacy, not geography.",
    ],
  },
  {
    id: "adverse.black-ice",
    title: "Black ice — detection and response",
    statement:
      "Black ice forms most often on bridges, shaded sections, and at dawn/dusk near freezing. If you suspect it, reduce speed, avoid braking or steering inputs, and test with a very gentle brake application on a clear stretch. Keep a larger gap to the vehicle ahead than you would on dry tarmac.",
    category: "adverse-conditions",
    legalRefs: ["VRV Art. 4"],
    tags: ["ice", "winter"],
    examWeight: 0.55,
    workedExamples: [
      "Bridge on a rural road early morning, 0 °C, road looks shiny black: assume ice, halve speed, do not touch the brakes aggressively.",
      "You skid briefly on a shaded curve: lift the accelerator, steer gently in the direction the car is going, and let it stabilise; countersteering hard often makes it worse.",
    ],
  },
  {
    id: "adverse.night-glare",
    title: "Night driving and dipping headlights",
    statement:
      "Dip from high beams to low beams as soon as you see oncoming vehicles, well before they reach you. Also dip when following another vehicle within about 100 m. When you are dazzled, slow and look towards the right edge of your lane, not at the oncoming lights.",
    category: "adverse-conditions",
    legalRefs: ["VRV Art. 41"],
    tags: ["night", "lights"],
    examWeight: 0.5,
    workedExamples: [
      "An approaching car is half a kilometre off on a rural road: dip now, not when they are already close.",
      "An oncoming driver fails to dip and dazzles you: slow, keep eyes on the right side of the road, and resume high beams only once they are well past you.",
    ],
  },

  // ---------- vehicle ----------
  {
    id: "vehicle.headlights-day",
    title: "Daytime running lights are mandatory",
    statement:
      "Since 2014, motor vehicles must have daytime running lights or low-beam headlights on at all times when driving.",
    category: "vehicle",
    legalRefs: ["VRV Art. 41"],
    tags: ["lights"],
    examWeight: 0.6,
    workedExamples: [
      "Driving in clear midday weather: DRLs must be active. A fine applies if they are off.",
      "A vehicle built before the DRL-mandatory equipment cutoff: you must turn on low beams manually whenever you drive — there is no DRL exemption for older cars.",
    ],
  },
  {
    id: "vehicle.tyre-tread-minimum",
    title: "Minimum tyre tread depth",
    statement:
      "The legal minimum tread depth is 1.6 mm on all tyres, measured in the primary tread grooves. Below this the tyre is unsafe; insurers may reduce payouts after an accident with under-tread tyres. Replacement is sensibly planned well above the minimum, especially for winter tyres.",
    category: "vehicle",
    legalRefs: ["VTS Art. 58"],
    tags: ["tyres"],
    examWeight: 0.55,
    workedExamples: [
      "A casual check shows 1.4 mm on the front tyres: they are below the legal limit; the vehicle is not roadworthy until replaced.",
      "Winter tyres at 3.5 mm with more snow expected: the tyres are legal but already compromised — wet and snow braking grows rapidly worse below 4 mm.",
    ],
  },
  {
    id: "vehicle.mirrors-blindspot",
    title: "Mirrors and the blind spot (toter Winkel)",
    statement:
      "Before any manoeuvre, check interior mirror, appropriate exterior mirror, and turn your head to check the blind spot — the area mirrors cannot see. Side-view mirrors of large vehicles have particularly wide blind spots, especially on the passenger side.",
    category: "vehicle",
    legalRefs: ["VRV Art. 28"],
    tags: ["mirrors", "blind-spot"],
    examWeight: 0.75,
    workedExamples: [
      "You change from the left lane to the right lane on a motorway: mirror, indicator, right-shoulder check — a car in the blind spot would be invisible to the mirrors alone.",
      "You pull away from the kerb after parallel parking: check left blind spot before moving; cyclists pass on the kerbside and are in the blind spot for many car layouts.",
    ],
  },
  {
    id: "vehicle.insurance-minimum",
    title: "Minimum vehicle insurance: Haftpflicht",
    statement:
      "Every motor vehicle in Switzerland must carry mandatory third-party liability insurance (Haftpflicht / RC). It covers damage you cause to others; it does not cover your own vehicle. Kasko (comprehensive) is optional but commonly added.",
    category: "vehicle",
    legalRefs: ["SVG Art. 63"],
    tags: ["insurance"],
    examWeight: 0.55,
    workedExamples: [
      "You cause a rear-end collision in a parking lot: your Haftpflicht pays the other driver's repair. Your own damage is paid only if you carry Kasko.",
      "A brand-new car is typically insured with both Haftpflicht and Vollkasko; an older car is often insured with only Haftpflicht plus Teilkasko for theft, glass, and animal strike.",
    ],
  },
  {
    id: "vehicle.registration-card",
    title: "Vehicle registration card and driving licence",
    statement:
      "While driving you must carry your driving licence and the vehicle registration card (Fahrzeugausweis). On request by police you present both immediately. Driving without the card is a fault; driving without the licence is a more serious offence.",
    category: "vehicle",
    legalRefs: ["SVG Art. 10"],
    tags: ["papers", "licence"],
    examWeight: 0.5,
    workedExamples: [
      "Routine traffic check: produce licence and Fahrzeugausweis within the normal 'couple of minutes' grace a driver is allowed to find them.",
      "You realise at the office you left the card at home: you drove without carrying it; the fault was committed, even if no one checked.",
    ],
  },
  {
    id: "vehicle.load-securing",
    title: "Load securing and projection",
    statement:
      "Cargo must be secured so that it cannot shift, fall, or exit the vehicle during normal braking and cornering. Loads projecting more than 1 m beyond the rear must be marked (red cloth by day, red light by night). The driver — not the loader — is responsible for adequate securing.",
    category: "vehicle",
    legalRefs: ["VRV Art. 30"],
    tags: ["load"],
    examWeight: 0.5,
    workedExamples: [
      "Ladder on a roof rack projecting 1.5 m beyond the rear: fit a red warning cloth by day; after sunset swap to a red marker light.",
      "A fridge in the boot not tied down: in a hard brake it can punch through the rear seats. Secure with straps — the driver is liable for any injuries, not the helper who loaded it.",
    ],
  },
  {
    id: "vehicle.lighting-inspection",
    title: "Lighting check before departure",
    statement:
      "Before driving, verify that all mandatory lights work: low beam, high beam, indicators (front and rear), brake lights, rear position lights, number-plate light, and reverse light. A failed brake light is both dangerous and a fault; replace bulbs promptly.",
    category: "vehicle",
    legalRefs: ["VTS Art. 76"],
    tags: ["lights", "pre-trip"],
    examWeight: 0.4,
    workedExamples: [
      "Routine fortnightly check: walk around the car with the parking brake on, ask a helper to operate brake and indicator while you observe; repeat for reverse by briefly selecting reverse gear.",
      "On a winter evening you notice only one brake light works via a car behind: drive carefully home, replace the bulb, and do not plan long trips on one brake light.",
    ],
  },
  {
    id: "vehicle.warning-triangle",
    title: "Warning triangle and high-visibility vest",
    statement:
      "Every car must carry a compliant warning triangle accessible without leaving the vehicle. A high-visibility vest is strongly recommended (mandatory in many neighbouring countries) — put it on before stepping out onto a motorway or busy road.",
    category: "vehicle",
    legalRefs: ["VTS Art. 90", "VRV Art. 23"],
    tags: ["breakdown", "equipment"],
    examWeight: 0.5,
    workedExamples: [
      "Breakdown on the hard shoulder: put on the vest before you open the door; set the triangle ≥50 m behind the vehicle on normal roads, ≥100 m on motorways.",
      "The triangle is stored in the spare-wheel well under the boot floor: in an accident the boot may be jammed shut. Keep it somewhere reachable from the cabin.",
    ],
  },
  {
    id: "vehicle.child-seat",
    title: "Child seats and restraint systems",
    statement:
      "Children under 12 and shorter than 150 cm must use an approved child-restraint system matched to their weight (ECE R44 or R129/iSize). Rear-facing seats must not be used in a seat with an active front airbag unless the airbag is deactivated.",
    category: "vehicle",
    legalRefs: ["VRV Art. 3a"],
    tags: ["children", "child-seat"],
    examWeight: 0.45,
    workedExamples: [
      "A 4-year-old passenger: use a forward-facing seat with harness, secured by ISOFIX or the adult belt according to the seat's manufacturer instructions.",
      "A baby in a rear-facing seat in the front passenger seat: the airbag for that seat must be deactivated — otherwise deployment in a crash is fatal for the child.",
    ],
  },

  // ---------- driver-fitness ----------
  {
    id: "fitness.fatigue-break",
    title: "Fatigue and fitness to drive",
    statement:
      "You must not drive if tiredness, illness, medication, or any other condition impairs your ability to control the vehicle. When you notice signs of fatigue on a long trip, take a break at the next safe opportunity — fatigue cannot be waited out by opening a window or turning up the radio.",
    category: "driver-fitness",
    legalRefs: ["SVG Art. 31 Abs. 2", "VRV Art. 2"],
    tags: ["fatigue", "fitness", "medication"],
    examWeight: 0.6,
    workedExamples: [
      "You've been driving four hours, notice you've stopped recognising the last few kilometres: pull into the next rest area and sleep or take coffee + walk before continuing.",
      "A new prescription says 'may cause drowsiness': you must not drive until you know how it actually affects you, even if you feel fine at the start of a trip.",
    ],
  },
  {
    id: "fitness.medications",
    title: "Medications that affect driving",
    statement:
      "Many common medications — sedatives, strong painkillers, some antihistamines, sleep aids — impair reaction time and judgement. Check the package insert or ask the pharmacist. Driving under their influence can be prosecuted as driving while unfit even without alcohol.",
    category: "driver-fitness",
    legalRefs: ["SVG Art. 31 Abs. 2"],
    tags: ["medication", "fitness"],
    examWeight: 0.5,
    workedExamples: [
      "A pharmacy dispenses a benzodiazepine for sleep: do not drive the next morning if you still feel groggy; the active metabolite lingers 8–10 hours.",
      "Over-the-counter cold medicine with a drowsiness warning: if you feel affected, do not drive — 'it's not prescription, so it's OK' is a mistake many drivers make.",
    ],
  },
  {
    id: "fitness.eyewear",
    title: "Prescription eyewear and vision",
    statement:
      "If your licence carries a glasses/contact-lens condition you must wear the corrective aid whenever driving. It is wise to carry a spare pair in the car in case of loss or breakage. Sudden vision changes require a check-up before driving again.",
    category: "driver-fitness",
    legalRefs: ["VZV Art. 7"],
    tags: ["vision", "eyewear"],
    examWeight: 0.45,
    workedExamples: [
      "You wear contact lenses that are listed on the licence: if a lens becomes uncomfortable during a trip, stop safely and replace it; driving half-blind is driving unfit.",
      "You notice sudden double vision at the wheel: pull over immediately and do not resume driving until a medical review clears you.",
    ],
  },
  {
    id: "fitness.max-driving-hours",
    title: "Private-driver fatigue and rest guidance",
    statement:
      "Professional drivers follow strict ARV rest-time rules. Private drivers are held only to the general duty to remain fit to drive (VRV Art. 2), but the practical guidance is similar: a break of about 15 minutes every two hours and no more than about nine hours of driving in a day.",
    category: "driver-fitness",
    legalRefs: ["VRV Art. 2", "ARV 1"],
    tags: ["fatigue", "long-trip"],
    examWeight: 0.45,
    workedExamples: [
      "An 800 km summer holiday drive: plan stops at about the two-hour mark rather than pushing through — reaction times climb sharply beyond three hours of continuous driving.",
      "You're a private driver, so ARV does not apply to you — but if you cause an accident after seven hours at the wheel, the court will still treat fatigue as driving unfit.",
    ],
  },
  {
    id: "fitness.illness",
    title: "Driving while ill",
    statement:
      "Acute illness — high fever, severe cold, migraine, gastric distress, acute injury — impairs the ability to control the vehicle. Common sense plus SVG Art. 31 Abs. 2 require you not to drive until recovered. Chronic conditions may trigger specific licence conditions to be reviewed by the cantonal authority.",
    category: "driver-fitness",
    legalRefs: ["SVG Art. 31 Abs. 2"],
    tags: ["illness", "fitness"],
    examWeight: 0.45,
    workedExamples: [
      "You've had severe flu with fever for three days: do not drive on the day you first feel 'a bit better' — reaction time is still compromised. Wait until clearly recovered.",
      "You develop a seizure disorder: you must inform the cantonal licensing authority; driving after a seizure without medical clearance can cost your licence permanently.",
    ],
  },
  {
    id: "fitness.distraction-phone",
    title: "Phone use and driver distraction",
    statement:
      "Using a handheld mobile phone while driving is prohibited. Hands-free systems are permitted but must not occupy your attention such that you can no longer observe traffic. Texting or reading messages at the wheel is treated as a serious inattention offence.",
    category: "driver-fitness",
    legalRefs: ["VRV Art. 3 Abs. 1"],
    tags: ["phone", "distraction"],
    examWeight: 0.6,
    workedExamples: [
      "A call comes in while driving: answer via hands-free if at all; keep conversation short and abandon if traffic demands full attention.",
      "You glance at a WhatsApp notification at 80 km/h: that 2-second look covers 44 m — the length of a football penalty area. A crash during that blind distance is treated as grave inattention.",
    ],
  },

  // ---------- penalties-bac ----------
  {
    id: "fitness.bac-novice",
    title: "Probationary BAC limit (0.1‰)",
    statement:
      "Probationary licence holders (first three years) must drive with a blood-alcohol concentration below 0.1‰ — effectively zero.",
    category: "penalties-bac",
    legalRefs: ["VRV Art. 2a"],
    tags: ["alcohol", "novice"],
    examWeight: 0.85,
    workedExamples: [
      "After one beer at lunch: a probationary driver should not drive for several hours and even then a breath test may exceed 0.1‰.",
      "A probationary driver caught at 0.11‰ loses the probationary licence — the probationary period restarts from zero after a new psychological review.",
    ],
    de: {
      title: "Promillegrenze während der Probezeit (0,1‰)",
      statement:
        "Inhaber eines Führerausweises auf Probe (die ersten drei Jahre) müssen mit einer Blutalkoholkonzentration unter 0,1‰ fahren — das entspricht praktisch einer Null-Promille-Grenze.",
      workedExamples: [
        "Nach einem Bier am Mittag: ein Fahrer in der Probezeit sollte mehrere Stunden nicht fahren — und selbst dann kann eine Atemprobe 0,1‰ überschreiten.",
        "Ein Probezeit-Fahrer wird mit 0,11‰ erwischt: der Führerausweis auf Probe wird entzogen, und die Probezeit beginnt nach einer verkehrspsychologischen Begutachtung von neuem.",
      ],
    },
  },
  {
    id: "fitness.bac-general",
    title: "General BAC limit (0.5‰)",
    statement:
      "Outside the probationary period, the legal limit is below 0.5‰. From 0.5‰ to 0.79‰ counts as a low-level offence; from 0.8‰ as a serious offence.",
    category: "penalties-bac",
    legalRefs: ["SVG Art. 31"],
    tags: ["alcohol"],
    examWeight: 0.85,
    workedExamples: [
      "Reading 0.6‰: at minimum a warning and a fine. At 0.85‰: licence withdrawal of at least 3 months.",
      "A driver at 0.4‰ is technically legal but any accident they cause will still be aggravated by detectable alcohol in blood tests.",
    ],
    de: {
      title: "Allgemeine Promillegrenze (0,5‰)",
      statement:
        "Ausserhalb der Probezeit liegt die gesetzliche Grenze unter 0,5‰. Werte von 0,5‰ bis 0,79‰ gelten als leichte Widerhandlung, ab 0,8‰ als schwere Widerhandlung.",
      workedExamples: [
        "Wert 0,6‰: mindestens eine Verwarnung und eine Busse. Bei 0,85‰: Führerausweisentzug von mindestens 3 Monaten.",
        "Ein Fahrer mit 0,4‰ ist zwar rechtlich erlaubt unterwegs, aber bei einem von ihm verursachten Unfall wird der nachweisbare Alkohol im Blut die Schuldfrage verschärfen.",
      ],
    },
  },
  {
    id: "penalties.bac-grave",
    title: "Grave BAC offence (≥0.8‰)",
    statement:
      "A BAC at or above 0.8‰ is categorised as a grave traffic offence (qualifizierte Fahrunfähigkeit). Consequences include mandatory licence withdrawal of at least three months for a first offence, a criminal record, insurance loss of recourse, and — for repeats — up to indefinite withdrawal.",
    category: "penalties-bac",
    legalRefs: ["SVG Art. 16c"],
    tags: ["alcohol", "grave"],
    examWeight: 0.7,
    workedExamples: [
      "First offence at 0.85‰: licence withdrawn ≥3 months, fine, entered on criminal record. You must also retake a fitness-to-drive assessment before reinstatement.",
      "Second offence within 10 years at 0.9‰: licence withdrawn ≥12 months, with obligatory alcohol-dependency assessment.",
    ],
    de: {
      title: "Qualifizierte Fahrunfähigkeit (≥0,8‰)",
      statement:
        "Eine Blutalkoholkonzentration ab 0,8‰ gilt als qualifizierte Fahrunfähigkeit und damit als schwere Widerhandlung. Folgen sind ein Führerausweisentzug von mindestens drei Monaten bei der ersten Widerhandlung, ein Eintrag im Strafregister, Verlust des Versicherungsrückgriffs und — bei Wiederholung — bis zu unbefristetem Entzug.",
      workedExamples: [
        "Erste Widerhandlung mit 0,85‰: Führerausweisentzug ≥3 Monate, Busse, Eintrag im Strafregister. Vor Wiedererteilung ist eine verkehrsmedizinische Begutachtung erforderlich.",
        "Zweite Widerhandlung innert 10 Jahren mit 0,9‰: Entzug ≥12 Monate, mit obligatorischer verkehrspsychologischer Abklärung.",
      ],
    },
  },
  {
    id: "penalties.drug-impairment",
    title: "Drug impairment: zero tolerance",
    statement:
      "Swiss law defines 'unfit to drive' as including the presence of certain illegal substances at any detectable level — cannabis (THC), cocaine, heroin, amphetamines, methamphetamines, MDMA. Even trace levels are prosecuted as driving while unfit, equivalent in severity to grave BAC.",
    category: "penalties-bac",
    legalRefs: ["VRV Art. 2 Abs. 2", "SVG Art. 31 Abs. 2"],
    tags: ["drugs", "unfit"],
    examWeight: 0.55,
    workedExamples: [
      "A cannabis user stopped 10 hours after consumption: THC still detectable in blood — this is prosecuted the same as a BAC ≥0.8‰, with ≥3 months licence withdrawal on first offence.",
      "Prescription opioids with a driving-warning label are subject to the impairment test, not the zero-tolerance list. But you can still be charged if the doctor flagged it and you drove.",
    ],
    de: {
      title: "Drogen am Steuer: Nulltoleranz",
      statement:
        "Nach Schweizer Recht gilt als fahrunfähig auch, wer bestimmte Betäubungsmittel in jeder nachweisbaren Konzentration im Blut hat — Cannabis (THC), Kokain, Heroin, Amphetamine, Methamphetamin, MDMA. Bereits Spurenkonzentrationen werden gleichwertig zur qualifizierten Fahrunfähigkeit bei Alkohol verfolgt.",
      workedExamples: [
        "Cannabis-Konsument wird 10 Stunden nach Konsum angehalten: THC ist noch nachweisbar — das wird gleich wie ein BAK ≥0,8‰ verfolgt, mit Führerausweisentzug ≥3 Monate bei Ersttat.",
        "Verschreibungspflichtige Opiate mit Warnhinweis fallen unter die Beeinträchtigungsprüfung, nicht die Nulltoleranzliste. Dennoch drohen Strafen, wenn der Arzt vor dem Fahren gewarnt hat.",
      ],
    },
  },
  {
    id: "penalties.speeding-katalog",
    title: "Speeding penalty catalogue (Raserkatalog)",
    statement:
      "Beyond a fixed fine, Swiss speeding penalties escalate to licence withdrawal above prescribed thresholds — roughly +25 km/h in town, +30 on country roads, +35 on expressways, +40 on motorways. Extreme excess (the 'Raser' threshold) triggers criminal prosecution, vehicle seizure, and withdrawal of at least 24 months.",
    category: "penalties-bac",
    legalRefs: ["SVG Art. 16b", "SVG Art. 90 Abs. 3"],
    tags: ["speed", "penalty"],
    examWeight: 0.65,
    workedExamples: [
      "110 km/h in a 50 zone (60 over): classified as a 'Raser' offence — criminal prosecution, vehicle seized, licence ≥24 months withdrawn, possible custodial sentence.",
      "50 over on a motorway (170 in a 120 zone): above the licence-withdrawal threshold; expect ≥3 months withdrawal plus a substantial fine — even for a first offence.",
    ],
    de: {
      title: "Raserkatalog und Geschwindigkeitsüberschreitungen",
      statement:
        "Über die Ordnungsbusse hinaus führen Geschwindigkeitsüberschreitungen zum Führerausweisentzug: rund +25 km/h innerorts, +30 ausserorts, +35 auf Autostrassen, +40 auf Autobahnen. Extreme Überschreitungen ('Raser-Tatbestand') ziehen Strafverfahren, Fahrzeug-Einziehung und Entzug von mindestens 24 Monaten nach sich.",
      workedExamples: [
        "110 km/h in einer 50er-Zone (60 zu viel): Raser-Tatbestand — Strafverfahren, Fahrzeug-Einziehung, Führerausweisentzug ≥24 Monate, Freiheitsstrafe möglich.",
        "50 zu viel auf der Autobahn (170 in einer 120er-Zone): über der Entzugsschwelle; mit Entzug ≥3 Monaten und einer erheblichen Busse ist bereits bei Ersttat zu rechnen.",
      ],
    },
  },

  // ---------- accidents-insurance ----------
  {
    id: "accidents.secure-scene",
    title: "Accidents: secure the scene first",
    statement:
      "At any accident the first duty is to secure the scene. Turn on hazards, set out the warning triangle at an appropriate distance behind the scene (≥50 m on normal roads, ≥100 m on motorways), put on a high-visibility vest before stepping out, and keep other road users from adding to the collision.",
    category: "accidents-insurance",
    legalRefs: ["SVG Art. 51", "VRV Art. 23"],
    tags: ["accident", "securing"],
    examWeight: 0.6,
    workedExamples: [
      "Minor collision on a rural 80 km/h road: hazards on, triangle 50 m behind, then assess. Do not stand between the cars on the carriageway.",
      "Motorway rear-end in a queue: vest on before stepping out, triangle placed well back beyond the queue so approaching drivers see it in time.",
    ],
  },
  {
    id: "accidents.aid",
    title: "Accidents: first aid to the injured",
    statement:
      "Once the scene is secured, check for injured persons. Do not move the injured unless they are in immediate danger (fire, oncoming traffic, water). Keep them warm, talk to them, and — within your training — perform CPR or first aid. Calling for help is part of aid.",
    category: "accidents-insurance",
    legalRefs: ["SVG Art. 51", "StGB Art. 128"],
    tags: ["accident", "first-aid"],
    examWeight: 0.65,
    workedExamples: [
      "Driver trapped in a crashed car with obvious neck pain but no fire: do not pull them out; keep them warm, speak calmly, and wait for emergency services.",
      "Unconscious cyclist on the roadside: check breathing, open airway, and begin CPR if absent. Failing to try is an offence (Unterlassung der Nothilfe, StGB Art. 128).",
    ],
  },
  {
    id: "accidents.notification",
    title: "Accidents: when to call emergency services",
    statement:
      "Call 144 (medical) for any injury or doubt; 117 (police) must be called for injuries, uncertain liability, disputes, foreign plates, or damage to public infrastructure; 118 (fire) for fuel leaks, fires, and vehicles in water. 112 connects to all services from mobile phones.",
    category: "accidents-insurance",
    legalRefs: ["SVG Art. 51"],
    tags: ["accident", "emergency"],
    examWeight: 0.6,
    workedExamples: [
      "Two-car collision, both drivers walking and talking, only material damage, agreement on fault: police not mandatory — exchange details. Police must be called if any party asks for it.",
      "You hit a guardrail on the motorway, no other vehicle involved: you still must call the police because damage to public infrastructure is to be reported.",
    ],
  },
  {
    id: "accidents.documentation",
    title: "Accidents: documenting the scene",
    statement:
      "Before moving vehicles, photograph the scene from several angles showing road layout, vehicle positions, and any skid marks. Note witness contact details and the names/addresses/insurers of all involved drivers. Do not sign admissions of fault at the scene — that is your insurer's job.",
    category: "accidents-insurance",
    legalRefs: ["SVG Art. 51"],
    tags: ["accident", "documentation"],
    examWeight: 0.55,
    workedExamples: [
      "Parking-lot scrape with no injuries: take photos of both cars and the layout first; then exchange details; move vehicles only once the evidence is recorded.",
      "The other driver asks you to sign a handwritten note admitting fault: decline politely and offer to exchange details only. Your insurer decides liability from the evidence.",
    ],
  },
  {
    id: "accidents.european-form",
    title: "European accident statement form",
    statement:
      "The European accident statement (Europäischer Unfallbericht / Constat amiable) is a standardised form accepted across Europe for material-damage collisions. Both drivers fill it together; each keeps one signed copy. It records what happened, not fault.",
    category: "accidents-insurance",
    legalRefs: ["SVG Art. 51"],
    tags: ["insurance", "form"],
    examWeight: 0.4,
    workedExamples: [
      "Fender-bender with a driver from Germany in Switzerland: the European form works identically for both jurisdictions — fill it together and each send it to their own insurer.",
      "A disagreement on how the accident happened: both parties should still sign the sketched layout; each can add a written note of their own version. The form captures facts, not agreement on blame.",
    ],
  },
  {
    id: "accidents.casco-haftpflicht",
    title: "Haftpflicht vs. Kasko coverage",
    statement:
      "Haftpflicht (mandatory third-party liability) covers damage you cause to others. Teilkasko (partial) covers glass, theft, animal strike, and natural hazards. Vollkasko (full) adds self-caused damage to your own vehicle. A leasing company usually requires Vollkasko during the lease.",
    category: "accidents-insurance",
    legalRefs: ["SVG Art. 63"],
    tags: ["insurance", "coverage"],
    examWeight: 0.45,
    workedExamples: [
      "You reverse into your own garage door: only Vollkasko would pay for the car's bodywork; Haftpflicht covers nothing of your own vehicle.",
      "A marten chews your wiring: Teilkasko covers it — animal strike is a listed peril, not a self-caused accident.",
    ],
  },
];

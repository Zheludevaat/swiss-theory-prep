// Hand-authored seed rules. Replace / extend in the parallel content repo
// (`swiss-theory-content`) — these exist so the app is testable on day 1.
//
// Each rule is short, statable, and has worked examples for teach mode.
// Legal references use Swiss abbreviations: SVG (Strassenverkehrsgesetz),
// VRV (Verkehrsregelnverordnung), SSV (Signalisationsverordnung).

import type { Rule } from "./schema";

export const seedRules: Rule[] = [
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
    ],
  },
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
    ],
  },
  {
    id: "signs.stop",
    title: "Stop sign (2.30)",
    statement:
      "At a stop sign, you must come to a complete stop at the marked line (or before the crossing if no line is marked) and then yield to all cross traffic.",
    category: "signs",
    legalRefs: ["SSV Art. 36"],
    tags: ["sign:2.30"],
    examWeight: 0.95,
    workedExamples: [
      "Approaching a stop sign on a quiet road with no visible cross traffic: still required to stop completely (wheels at zero), then proceed.",
    ],
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
    ],
  },
  {
    id: "signs.no-overtaking",
    title: "No overtaking (2.44)",
    statement:
      "From a no-overtaking sign you may not overtake other motor vehicles until the end-of-prohibition sign or the next intersection.",
    category: "signs",
    legalRefs: ["SSV Art. 19"],
    tags: ["sign:2.44"],
    examWeight: 0.65,
    workedExamples: [
      "Bicycles and tractors moving slower than 30 km/h may still be overtaken even where the sign applies.",
    ],
  },
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
    ],
  },
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
    ],
  },
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
    ],
  },
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
    ],
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
    ],
  },
  {
    id: "accidents.first-response",
    title: "First response at an accident",
    statement:
      "At any accident: secure the scene (warning triangle, hazards), then provide first aid, then call 112 / 144. Move vehicles only if they obstruct traffic and only after photographing the scene if injuries are absent.",
    category: "accidents-insurance",
    legalRefs: ["SVG Art. 51"],
    tags: ["accident", "first-aid"],
    examWeight: 0.55,
    workedExamples: [
      "Minor parking-lot collision: photograph positions, exchange details, fill the European accident form.",
      "Injury collision: do not move the injured unless they are in immediate danger; stabilise, then call 144.",
    ],
  },
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
    ],
  },
];

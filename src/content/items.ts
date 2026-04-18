// Hand-authored seed items. Each item has exactly 1 or 2 correct options
// (ASA format). Keep rationales short, factual, and rule-linked — the
// rationale is what the learner reads after Submit, and it's what teaches.

import type { Item } from "./schema";

export const seedItems: Item[] = [
  {
    id: "q.priority.unmarked-4way",
    ruleIds: ["priority.right-hand.default"],
    question:
      "At an unmarked four-way intersection in a residential area, who has priority?",
    options: [
      { text: "The vehicle approaching from your right", correct: true },
      { text: "The vehicle on the wider road", correct: false },
      { text: "Whichever vehicle arrived first", correct: false },
    ],
    rationale:
      "Unless signs or markings say otherwise, traffic from the right has priority at all intersections (VRV Art. 36).",
    tags: ["intersection"],
    difficulty: 2,
  },
  {
    id: "q.priority.roundabout.yield",
    ruleIds: ["priority.roundabout"],
    question: "You are approaching a single-lane roundabout. What applies?",
    options: [
      { text: "Traffic already inside the roundabout has priority", correct: true },
      { text: "You must stop even if the circle is empty", correct: false },
      { text: "Signal left while inside the circle", correct: false },
    ],
    rationale:
      "Inside traffic has priority. You may enter without stopping if the circle is clear, and you only signal right when leaving.",
    tags: ["roundabout"],
    difficulty: 2,
  },
  {
    id: "q.priority.roundabout.signal",
    ruleIds: ["priority.roundabout"],
    question: "Which statements about signalling in a roundabout are correct?",
    options: [
      { text: "Signal right just before the exit", correct: true },
      { text: "Signal left while circulating past exits you skip", correct: false },
      { text: "Do not signal on entry", correct: true },
    ],
    rationale:
      "Swiss practice: no entry signal; signal right immediately before the exit you take.",
    tags: ["roundabout"],
    difficulty: 3,
  },
  {
    id: "q.priority.tram.cross",
    ruleIds: ["priority.tram"],
    question: "A tram approaches from your left at an unmarked intersection. You:",
    options: [
      { text: "Have priority because the tram is on your left", correct: false },
      { text: "Must yield to the tram", correct: true },
      { text: "Proceed only if the tram has stopped", correct: false },
    ],
    rationale:
      "Trams always have priority, which overrides the right-hand rule (SVG Art. 38).",
    tags: ["tram"],
    difficulty: 3,
  },
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
  },
  {
    id: "q.signs.stop.behaviour",
    ruleIds: ["signs.stop"],
    question: "At a stop sign on a quiet road with no cross traffic in sight:",
    options: [
      { text: "You must come to a complete stop at the line", correct: true },
      { text: "You may roll through if the way is clear", correct: false },
      { text: "You yield only to traffic from the right", correct: false },
    ],
    rationale:
      "A stop sign requires wheels-at-zero at the marked line, regardless of visible traffic.",
    tags: ["sign:2.30"],
    difficulty: 1,
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
      "Give-way (3.02): slow and yield, no stop required if clear. Stop (2.30): always a full stop.",
    tags: ["sign:2.30", "sign:3.02"],
    difficulty: 2,
  },
  {
    id: "q.signs.no-overtaking.applies",
    ruleIds: ["signs.no-overtaking"],
    question:
      "You see the no-overtaking sign (2.44). Which overtakings remain permitted?",
    options: [
      { text: "Overtaking a bicycle at walking pace", correct: true },
      { text: "Overtaking a car driving at the speed limit", correct: false },
      { text: "Overtaking a tractor moving at 20 km/h", correct: true },
    ],
    rationale:
      "The ban applies to overtaking motor vehicles. Slow vehicles (<30 km/h) and cyclists remain overtake-able.",
    tags: ["sign:2.44"],
    difficulty: 3,
  },
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
  },
  {
    id: "q.accidents.secure-scene",
    ruleIds: ["accidents.first-response"],
    question: "You arrive first at an injury accident. Your immediate priority is to:",
    options: [
      { text: "Secure the scene (hazards, warning triangle)", correct: true },
      { text: "Move injured people off the road to clear traffic", correct: false },
      { text: "Exchange insurance details first", correct: false },
    ],
    rationale:
      "Sequence: secure — aid — call. Moving the injured risks further harm unless they are in immediate danger.",
    tags: ["accident"],
    difficulty: 2,
  },
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
    id: "q.priority.emergency-vehicles",
    ruleIds: ["priority.emergency-vehicles"],
    question:
      "An emergency vehicle with blue lights and siren approaches from behind. You:",
    options: [
      { text: "Pull over as far right as safe and let it pass", correct: true },
      { text: "Stop immediately in your lane", correct: false },
      { text: "Maintain speed — emergency vehicles must pass on the left", correct: false },
    ],
    rationale:
      "Emergency vehicles under siren have right of way. Clear a path by pulling right; stopping in-lane can block them.",
    tags: ["emergency"],
    difficulty: 2,
  },
  {
    id: "q.signs.priority-road",
    ruleIds: ["signs.priority-road"],
    question:
      "You are on a road marked with the yellow-diamond priority-road sign. At the next intersection:",
    options: [
      { text: "You keep priority over crossing traffic", correct: true },
      { text: "You must still yield to traffic from your right", correct: false },
      { text: "Priority depends on the size of the side road", correct: false },
    ],
    rationale:
      "The priority-road sign (3.03) overrides the right-hand rule until cancelled by 3.04.",
    tags: ["sign:3.03", "priority"],
    difficulty: 2,
  },
];

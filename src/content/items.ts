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
    id: "q.priority.yielding-on-entry",
    ruleIds: ["priority.yielding-on-entry"],
    question:
      "You are leaving a supermarket car park to join a busy main road. Which is correct?",
    options: [
      { text: "Yield to all traffic on the priority road in both directions", correct: true },
      { text: "You may join if a 2-second gap exists, even if the approaching driver must brake", correct: false },
      { text: "Right-of-way from the right applies because no priority sign is visible from the car park", correct: false },
    ],
    rationale:
      "Joining from private property or a side street: you yield to the priority road in both directions and only enter when no one needs to brake (VRV Art. 15).",
    tags: ["yield"],
    difficulty: 2,
  },
  {
    id: "q.priority.rescue-corridor",
    ruleIds: ["priority.rescue-corridor"],
    question:
      "Traffic on a three-lane motorway slows to a crawl. How is the rescue corridor formed?",
    options: [
      { text: "Left lane moves fully left; middle and right lanes move fully right", correct: true },
      { text: "All lanes move to the right shoulder", correct: false },
      { text: "Drivers wait until they hear sirens before moving aside", correct: false },
    ],
    rationale:
      "Rettungsgasse: corridor opens between the leftmost and the next-to-leftmost lane, formed as soon as traffic slows — not when sirens arrive (VRV Art. 36 Abs. 1bis).",
    tags: ["emergency", "highway"],
    difficulty: 3,
  },
  {
    id: "q.priority.school-bus",
    ruleIds: ["priority.school-bus"],
    question:
      "A school bus is stopped at the roadside with flashing yellow warning lights. You:",
    options: [
      { text: "Pass at walking pace, ready to stop", correct: true },
      { text: "Maintain the posted speed if your lane is clear", correct: false },
      { text: "Stop completely until the bus moves off", correct: false },
    ],
    rationale:
      "Flashing yellows on a stopped school bus: pass at walking pace, watching for children stepping out (VRV Art. 18).",
    tags: ["school", "bus"],
    difficulty: 2,
  },

  // ---------- signs ----------
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
  {
    id: "q.signs.no-entry",
    ruleIds: ["signs.no-entry"],
    question:
      "You see a red disc with a horizontal white bar at the mouth of a street. You:",
    options: [
      { text: "Must not enter the street with a motor vehicle", correct: true },
      { text: "May briefly enter to turn around", correct: false },
      { text: "May enter if no other vehicle is visible inside the street", correct: false },
    ],
    rationale:
      "Sign 2.02 (no entry) is absolute. Even a brief entry to turn around is not allowed (SSV Art. 17).",
    tags: ["sign:2.02"],
    difficulty: 1,
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
  },
  {
    id: "q.signs.no-parking",
    ruleIds: ["signs.no-parking"],
    question:
      "Under a no-parking sign (2.50), which of these is permitted?",
    options: [
      { text: "Stopping briefly to let a passenger get out", correct: true },
      { text: "Leaving the car for two minutes to run into a shop", correct: false },
      { text: "Parking with hazard lights on", correct: false },
    ],
    rationale:
      "No-parking (2.50) prohibits parking but allows brief boarding/loading. A short shop visit is parking, not a stop.",
    tags: ["sign:2.50", "parking"],
    difficulty: 2,
  },
  {
    id: "q.signs.no-stopping",
    ruleIds: ["signs.no-stopping"],
    question:
      "Under a no-stopping sign (2.49) you may:",
    options: [
      { text: "Stop only if traffic control (red light, pedestrian crossing) requires it", correct: true },
      { text: "Stop briefly to drop a passenger", correct: false },
      { text: "Stop to load groceries", correct: false },
    ],
    rationale:
      "No-stopping (2.49) is absolute except for traffic-control duties. Even loading and boarding are forbidden.",
    tags: ["sign:2.49", "parking"],
    difficulty: 2,
  },
  {
    id: "q.signs.children-warning",
    ruleIds: ["signs.children-warning"],
    question:
      "You see the children-warning sign (1.23) on a town road posted at 50 km/h. The right action is to:",
    options: [
      { text: "Reduce speed below 50 and watch for children stepping out", correct: true },
      { text: "Maintain 50 km/h — the sign does not change the limit", correct: false },
      { text: "Sound the horn to alert children", correct: false },
    ],
    rationale:
      "The warning sign does not lower the limit, but VRV Art. 4 still requires speed adapted to conditions.",
    tags: ["sign:1.23"],
    difficulty: 2,
  },
  {
    id: "q.signs.mandatory-direction",
    ruleIds: ["signs.mandatory-direction"],
    question:
      "A blue disc with a single white arrow pointing straight up faces you at a junction. You:",
    options: [
      { text: "Must continue straight ahead — turning is prohibited", correct: true },
      { text: "May turn right but not left", correct: false },
      { text: "May choose any direction if no other sign appears", correct: false },
    ],
    rationale:
      "Mandatory direction (2.37 series): you must take the indicated direction; turning is treated as a prohibited movement.",
    tags: ["sign:2.37"],
    difficulty: 2,
  },
  {
    id: "q.signs.bicycle-path",
    ruleIds: ["signs.bicycle-path"],
    question:
      "A blue disc shows a single white bicycle. Which is correct?",
    options: [
      { text: "Path is reserved for bicycles; motor vehicles must not enter", correct: true },
      { text: "Bicycles must yield to motor vehicles using the path", correct: false },
      { text: "Pedestrians may use the path freely alongside cyclists", correct: false },
    ],
    rationale:
      "A bicycle-only sign reserves the path for bicycles. Pedestrians belong on the pedestrian-and-bicycle combined sign, not this one.",
    tags: ["sign:2.60"],
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
];

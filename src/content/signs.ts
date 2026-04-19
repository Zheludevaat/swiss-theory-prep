// Authoritative manifest of Swiss road-sign assets shipped in public/signs/.
// Codes follow the SSV family numbering used throughout the app:
//   1.xx  warning            (Gefahrensignale)
//   2.01-39  prohibition     (Verbote)
//   2.40-79  mandatory order (Gebote)
//   3.xx  priority           (Vortritt)
//   5.xx  supplementary      (Zusatztafeln)
//
// The manifest drives:
//   - Library.tsx Signs tab family grouping (A-13)
//   - Card.tsx default alt text fallback (D-6)
//   - validateContent.ts asset existence checks (indirectly — any item with
//     imageAssetId gets checked against public/signs/)
//
// To add a sign:
//   1. Drop the SVG in public/signs/<code>.svg
//   2. Add an entry here (code, family, label, optional source note)
//   3. Record the source + license in public/signs/ATTRIBUTION.md
//   4. Author items in items.ts referencing `imageAssetId: "<code>.svg"`

export type SignFamily =
  | "warning"
  | "prohibition"
  | "mandatory"
  | "priority"
  | "supplementary";

export const SIGN_FAMILY_LABELS: Record<SignFamily, string> = {
  warning: "Warning (1.xx)",
  prohibition: "Prohibition (2.01–2.39)",
  mandatory: "Mandatory (2.40–2.79)",
  priority: "Priority (3.xx)",
  supplementary: "Supplementary plates (5.xx)",
};

export type SignManifestEntry = {
  /** Local filename stem, e.g. "1.01". The on-disk file is `<code>.svg`. */
  code: string;
  family: SignFamily;
  /** Short English title, shown in Library grid. */
  label: string;
  /** German SSV name for cross-reference. */
  nameDe?: string;
};

/** Derive a sign's family from its code prefix. Used as a fallback when the
 *  manifest doesn't list an explicit entry. Keeps Library grouping robust to
 *  forgotten manifest updates. */
export function familyFromCode(code: string): SignFamily {
  if (code.startsWith("1.")) return "warning";
  if (code.startsWith("3.")) return "priority";
  if (code.startsWith("5.")) return "supplementary";
  if (code.startsWith("2.")) {
    const n = Number(code.slice(2));
    if (Number.isFinite(n) && n >= 40) return "mandatory";
    return "prohibition";
  }
  // Unknown — bucket as supplementary so it still renders somewhere.
  return "supplementary";
}

export const SIGN_MANIFEST: SignManifestEntry[] = [
  // --- 1.xx warning -------------------------------------------------------
  { code: "1.01", family: "warning", label: "Curve left", nameDe: "Linkskurve" },
  { code: "1.02", family: "warning", label: "Curve right", nameDe: "Rechtskurve" },
  { code: "1.03", family: "warning", label: "Double curve, left first", nameDe: "Doppelkurve links" },
  { code: "1.04", family: "warning", label: "Double curve, right first", nameDe: "Doppelkurve rechts" },
  { code: "1.05", family: "warning", label: "Narrow road", nameDe: "Engpass" },
  { code: "1.06", family: "warning", label: "Road narrows on left", nameDe: "Verengung links" },
  { code: "1.07", family: "warning", label: "Road narrows on right", nameDe: "Verengung rechts" },
  { code: "1.08", family: "warning", label: "Oncoming traffic", nameDe: "Gegenverkehr" },
  { code: "1.09", family: "warning", label: "Uneven road surface", nameDe: "Unebene Fahrbahn" },
  { code: "1.10", family: "warning", label: "Slippery road", nameDe: "Schleudergefahr" },
  { code: "1.11", family: "warning", label: "Loose gravel", nameDe: "Rollsplitt" },
  { code: "1.12", family: "warning", label: "Falling rocks", nameDe: "Steinschlag" },
  { code: "1.13", family: "warning", label: "Steep ascent", nameDe: "Starke Steigung" },
  { code: "1.14", family: "warning", label: "Steep descent", nameDe: "Gefährliches Gefälle" },
  { code: "1.15", family: "warning", label: "Unguarded level crossing", nameDe: "Bahnübergang ohne Schranken" },
  { code: "1.16", family: "warning", label: "Level crossing with barriers", nameDe: "Schranken" },
  { code: "1.17", family: "warning", label: "Tram crossing", nameDe: "Strassenbahn" },
  { code: "1.18", family: "warning", label: "Pedestrian crossing ahead", nameDe: "Fussgängerstreifen" },
  { code: "1.19", family: "warning", label: "Children", nameDe: "Kinder" },
  { code: "1.20", family: "warning", label: "Cyclists", nameDe: "Radfahrer" },
  { code: "1.21", family: "warning", label: "Animals", nameDe: "Tiere" },
  { code: "1.22", family: "warning", label: "Wildlife crossing", nameDe: "Wildwechsel" },
  { code: "1.23", family: "warning", label: "Traffic signals ahead", nameDe: "Lichtsignale" },
  { code: "1.24", family: "warning", label: "Road works", nameDe: "Baustelle" },
  { code: "1.25", family: "warning", label: "Traffic queue", nameDe: "Stau" },
  { code: "1.26", family: "warning", label: "Other dangers", nameDe: "Andere Gefahren" },

  // --- 2.01-2.39 prohibition ---------------------------------------------
  { code: "2.01", family: "prohibition", label: "No vehicles", nameDe: "Allgemeines Fahrverbot" },
  { code: "2.02", family: "prohibition", label: "No entry (one-way)", nameDe: "Einfahrt verboten" },
  { code: "2.03", family: "prohibition", label: "No left turn", nameDe: "Abbiegen nach links verboten" },
  { code: "2.04", family: "prohibition", label: "No right turn", nameDe: "Abbiegen nach rechts verboten" },
  { code: "2.05", family: "prohibition", label: "No U-turn", nameDe: "Wenden verboten" },
  { code: "2.06", family: "prohibition", label: "No overtaking", nameDe: "Überholen verboten" },
  { code: "2.07", family: "prohibition", label: "No overtaking by trucks", nameDe: "Überholen für Lastwagen verboten" },
  { code: "2.08", family: "prohibition", label: "Minimum distance", nameDe: "Mindestabstand" },
  { code: "2.09", family: "prohibition", label: "Maximum speed", nameDe: "Höchstgeschwindigkeit" },
  { code: "2.10", family: "prohibition", label: "General speed limit 50", nameDe: "Höchstgeschwindigkeit 50 generell" },
  { code: "2.11", family: "prohibition", label: "Maximum weight", nameDe: "Höchstgewicht" },
  { code: "2.12", family: "prohibition", label: "Axle load limit", nameDe: "Achsdruck" },
  { code: "2.13", family: "prohibition", label: "Maximum width", nameDe: "Höchstbreite" },
  { code: "2.14", family: "prohibition", label: "Maximum height", nameDe: "Höchsthöhe" },
  { code: "2.15", family: "prohibition", label: "Maximum length", nameDe: "Höchstlänge" },
  { code: "2.16", family: "prohibition", label: "No stopping", nameDe: "Halten verboten" },
  { code: "2.17", family: "prohibition", label: "No parking", nameDe: "Parkieren verboten" },
  { code: "2.18", family: "prohibition", label: "No pedestrians", nameDe: "Verbot für Fussgänger" },
  { code: "2.19", family: "prohibition", label: "No bicycles / mopeds", nameDe: "Verbot für Fahrräder und Motorfahrräder" },
  { code: "2.20", family: "prohibition", label: "No motorcycles", nameDe: "Verbot für Motorräder" },
  { code: "2.21", family: "prohibition", label: "No trucks", nameDe: "Verbot für Lastwagen" },
  { code: "2.22", family: "prohibition", label: "No dangerous goods vehicles", nameDe: "Verbot für Fahrzeuge mit gefährlicher Ladung" },
  { code: "2.23", family: "prohibition", label: "No trailers", nameDe: "Verbot für Anhänger" },
  { code: "2.24", family: "prohibition", label: "No motor vehicles", nameDe: "Verbot für Motorwagen und Motorräder" },
  { code: "2.25", family: "prohibition", label: "End of speed limit", nameDe: "Ende der Höchstgeschwindigkeit" },
  { code: "2.26", family: "prohibition", label: "End of 50 general speed limit", nameDe: "Ende der Höchstgeschwindigkeit 50 generell" },
  { code: "2.27", family: "prohibition", label: "End of overtaking ban", nameDe: "Ende des Überholverbotes" },
  { code: "2.28", family: "prohibition", label: "End of all restrictions", nameDe: "Freie Fahrt" },

  // --- 2.40-2.79 mandatory orders ----------------------------------------
  { code: "2.40", family: "mandatory", label: "Straight ahead", nameDe: "Geradeausfahren" },
  { code: "2.41", family: "mandatory", label: "Turn right", nameDe: "Rechtsabbiegen" },
  { code: "2.42", family: "mandatory", label: "Turn left", nameDe: "Linksabbiegen" },
  { code: "2.43", family: "mandatory", label: "Straight or right", nameDe: "Geradeaus oder Rechtsabbiegen" },
  { code: "2.44", family: "mandatory", label: "Straight or left", nameDe: "Geradeaus oder Linksabbiegen" },
  { code: "2.45", family: "mandatory", label: "Right or left", nameDe: "Rechts- oder Linksabbiegen" },
  { code: "2.46", family: "mandatory", label: "Direction left", nameDe: "Fahrtrichtung links" },
  { code: "2.47", family: "mandatory", label: "Direction right", nameDe: "Fahrtrichtung rechts" },
  { code: "2.48", family: "mandatory", label: "Pass obstacle on left", nameDe: "Hindernis links umfahren" },
  { code: "2.49", family: "mandatory", label: "Pass obstacle on right", nameDe: "Hindernis rechts umfahren" },
  { code: "2.50", family: "mandatory", label: "Roundabout", nameDe: "Kreisverkehrsplatz" },
  { code: "2.51", family: "mandatory", label: "Bicycle path", nameDe: "Radweg" },
  { code: "2.52", family: "mandatory", label: "Pedestrian path", nameDe: "Fussweg" },
  { code: "2.53", family: "mandatory", label: "Shared bike/pedestrian path", nameDe: "Gemeinsamer Rad- und Fussweg" },
  { code: "2.54", family: "mandatory", label: "Separated bike/pedestrian path", nameDe: "Rad- und Fussweg mit getrennten Verkehrsflächen" },
  { code: "2.55", family: "mandatory", label: "Bus lane", nameDe: "Busfahrbahn" },
  { code: "2.56", family: "mandatory", label: "Minimum speed", nameDe: "Mindestgeschwindigkeit" },
  { code: "2.57", family: "mandatory", label: "Snow chains required", nameDe: "Schneeketten obligatorisch" },

  // --- 3.xx priority -----------------------------------------------------
  { code: "3.01", family: "priority", label: "Stop", nameDe: "Stop" },
  { code: "3.02", family: "priority", label: "Give way", nameDe: "Kein Vortritt" },
  { code: "3.03", family: "priority", label: "Priority road", nameDe: "Hauptstrasse" },
  { code: "3.04", family: "priority", label: "End of priority road", nameDe: "Ende der Hauptstrasse" },
  { code: "3.05", family: "priority", label: "Give way to oncoming", nameDe: "Dem Gegenverkehr Vortritt lassen" },
  { code: "3.06", family: "priority", label: "Priority over oncoming", nameDe: "Vortritt vor dem Gegenverkehr" },
  { code: "3.07", family: "priority", label: "Rail crossing (St. Andrew's)", nameDe: "Einfaches Andreaskreuz" },
  { code: "3.08", family: "priority", label: "Rail flashing light", nameDe: "Einfaches Blinklicht" },
  { code: "3.09", family: "priority", label: "Alternating flashing light", nameDe: "Wechselblinklicht" },
  { code: "3.10", family: "priority", label: "Junction with right-hand priority", nameDe: "Verzweigung mit Rechtsvortritt" },
  { code: "3.11", family: "priority", label: "Junction with non-priority road", nameDe: "Verzweigung mit Strasse ohne Vortritt" },

  // --- 5.xx supplementary plates -----------------------------------------
  { code: "5.01", family: "supplementary", label: "Distance to start", nameDe: "Distanztafel" },
  { code: "5.02", family: "supplementary", label: "Length of affected section", nameDe: "Streckenlänge" },
  { code: "5.03", family: "supplementary", label: "Exceptions to parking ban", nameDe: "Ausnahmen vom Parkierungsverbot" },
  { code: "5.04", family: "supplementary", label: "Priority road direction", nameDe: "Richtung der Hauptstrasse" },
  { code: "5.05", family: "supplementary", label: "Icy road surface", nameDe: "Vereiste Fahrbahn" },
];

/** Fast lookup by code (filename without `.svg`). */
export const signByCode: Map<string, SignManifestEntry> = new Map(
  SIGN_MANIFEST.map((s) => [s.code, s]),
);

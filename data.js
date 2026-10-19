// Schema uit "Home workout" van Jan-Bart
const EXERCISES = [
  { id:'push', nr:1, muscle:'Borst (pectoralis maior)', accent:'#1f6fe0', sets:4, unit:'reps', min:15, max:20,
    variants:[{ name:'Push up (op knieën)', load:'kg', steps:[
      '15–20 herhalingen op je knieën (eerst opbouwen naar 15)',
      'Vertragen: langzaam omlaag en omhoog',
      '1 gewone push up + de rest op je knieën',
      'Elke week 1 extra gewone push up erbij' ]}]},
  { id:'lunge', nr:2, muscle:'Bovenbenen (quadriceps)', accent:'#e07a1f', sets:3, unit:'reps', min:15, max:20,
    variants:[{ name:'Reverse lunge (achteruit)', load:'kg', steps:[
      'Herhalingen verhogen',
      'Vertragen',
      'Met dumbbells of flesjes water' ]}]},
  { id:'rot', nr:3, muscle:'Schouders (deltoids)', accent:'#7a3fe0', sets:2, unit:'reps', min:15, max:20,
    variants:[{ name:'Banded internal & external rotation', load:'band', steps:[
      'Herhalingen verhogen met lichte band',
      'Vertragen',
      'Zwaardere band' ]}]},
  { id:'ham', nr:4, muscle:'Achterkant bovenbeen (hamstrings)', accent:'#e01f4f', sets:3, unit:'reps', min:15, max:20,
    variants:[
      { name:'Single leg romanian deadlift', load:'kg', steps:[
        'Herhalingen verhogen zonder gewicht',
        'Vertragen',
        'Gewicht toevoegen (dumbbells of flesjes)',
        'Beweging vergroten' ]},
      { name:'Banded good mornings', load:'band', steps:[
        'Herhalingen verhogen',
        'Vertragen',
        'Zwaardere band',
        'Beweging vergroten' ]}]},
  { id:'core', nr:5, muscle:'Buikspieren', accent:'#0d9b8a', sets:3, unit:'sec', min:30, max:120,
    variants:[
      { name:'Plank', load:'none', steps:[
        'Tijd opbouwen (30 s tot 2 min)',
        '1 been optillen',
        'Afwisselend een voet omhoog' ]},
      { name:'Side plank', load:'none', steps:[
        'Tijd opbouwen (30 s tot 2 min)',
        'Side plank met beenheffing',
        'Star side plank' ]}]},
  { id:'row', nr:6, muscle:'Rug (latissimus dorsi)', accent:'#0aa5c8', sets:3, unit:'reps', min:15, max:20,
    variants:[{ name:'Banded seated row', load:'band', steps:[
      'Herhalingen opbouwen',
      'Vertragen',
      'Zwaardere band' ]}]},
  { id:'glute', nr:7, muscle:'Billen (glutes)', accent:'#e05a1f', sets:3, unit:'reps', min:15, max:20,
    variants:[
      { name:'Fire hydrant', load:'kg', steps:[
        'Herhalingen verhogen',
        'Vertragen',
        'Bovenaan het been even aanhouden',
        'Miniband toevoegen',
        'Enkelgewichten' ]},
      { name:'Lying hip abductor', load:'kg', steps:[
        'Herhalingen verhogen',
        'Bovenaan even vasthouden',
        'Neerwaartse beweging vertragen',
        'Enkelgewichten',
        'Weerstandsband' ]}]},
  { id:'bridge', nr:8, muscle:'Onderrug (erector spinae)', accent:'#c21f8a', sets:3, unit:'reps', min:15, max:20,
    variants:[{ name:'Glute bridge', load:'kg', steps:[
      'Meer herhalingen',
      'Vertragen',
      'Gewicht toevoegen',
      'Miniband rond de knieën',
      'Single leg glute bridges' ]}]},
  { id:'calf', nr:9, muscle:'Kuiten (calves)', accent:'#d99a00', sets:3, unit:'reps', min:15, max:20,
    variants:[{ name:'Plié squat calf raises', load:'kg', steps:[
      'Herhalingen verhogen',
      'Vertragen',
      'Bovenaan langer aanhouden',
      'Gewicht toevoegen' ]}]},
];
const BANDS = [ {id:'licht', label:'Licht', color:'#7cc4ff'}, {id:'middel', label:'Middel', color:'#1f6fe0'}, {id:'zwaar', label:'Zwaar', color:'#0b1f44'} ];

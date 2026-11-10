/** The ten quiz questions with their scored answer options. */

export const QUESTIONS = [
  {
    type:'likert', target:'checker',
    text:'Egal ob eine Vokabeltabelle in Englisch, eine Grafik in Deutsch oder ein Diagramm in Mathe … Ihr Kind kann sich diese Dinge gut merken und anschließend selbst aufzeichnen.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, manchmal.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'forced',
    text:'Ihr Kind möchte ein YouTube-Video drehen und hochladen, weiß aber nicht wie. Was macht es?',
    options:[
      {label:'Es sucht ein Tutorial auf YouTube, um zu sehen, wie es geht.', mapsTo:'lauscher'},
      {label:'Es liest es auf einer Internetseite nach.', mapsTo:'checker'},
      {label:'Es versucht es einfach und probiert drauflos.', mapsTo:'macher'},
      {label:'Es fragt Freunde, ob sie das schon mal gemacht haben.', mapsTo:'schnacker'}
    ]
  },
  {
    type:'likert', target:'schnacker',
    text:'Ihr Kind tauscht sich gern mit anderen darüber aus, was gerade los ist.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, manchmal.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'likert', target:'checker',
    text:'Die Lehrkraft kaut morgens beim konzentrierten Denken auf einem Filzstift herum und malt sich dabei selbst an. Könnte sich Ihr Kind am Abend noch erinnern, mit welcher Farbe der Mund angemalt war?',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, glaube schon.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'likert', target:'schnacker',
    text:'Dinge, die Ihr Kind in einer Diskussion mit anderen bespricht, kann es sich viel besser vorstellen als gelesene Texte.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, denke schon.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'likert', target:'lauscher',
    text:'Wenn Ihr Kind einen Songtext auswendig lernen will, hört es sich lieber das ganze Lied an, anstatt den Text durchzulesen.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, glaub’ schon.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'forced',
    text:'Angenommen, Ihr Kind plant eine Reise nach Las Vegas und ist sich bei der genauen Route noch unsicher. Wie geht es vor?',
    options:[
      {label:'Es fragt Leute, die schon dort waren.', mapsTo:'schnacker'},
      {label:'Es fliegt erst einmal in die USA und schaut dann weiter.', mapsTo:'macher'},
      {label:'Es hört einen Reisebericht im Internetradio.', mapsTo:'lauscher'},
      {label:'Es holt sich Reiseführer aus der Bibliothek oder von Freunden und verschafft sich einen Überblick.', mapsTo:'checker'}
    ]
  },
  {
    type:'likert', target:'macher',
    text:'Wenn sich Ihr Kind beim Lernen bewegen kann, geht es leichter und schneller.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, meistens.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'likert', target:'lauscher',
    text:'Mündliche Erklärungen versteht Ihr Kind sehr gut, selbst wenn die Inhalte richtig kompliziert sind.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, manchmal.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'likert', target:'macher',
    text:'Am liebsten führt Ihr Kind Experimente selbst durch, praktische Themen liegen ihm am meisten.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, denke schon.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  }
];

/** The ten quiz questions with their scored answer options. */

export const QUESTIONS = [
  {
    type:'likert', target:'checker',
    text:'Egal ob eine Vokabeltabelle in Englisch, eine Grafik in Deutsch oder ein Diagramm in Mathe … Du kannst dir diese Dinge gut merken und anschließend selbst aufzeichnen.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, manchmal.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'forced',
    text:'Du möchtest ein YouTube Video drehen und hochladen, weißt aber nicht wie. Was machst du?',
    options:[
      {label:'Du suchst ein Tutorial auf YouTube, um zu sehen, wie es geht.', mapsTo:'lauscher'},
      {label:'Du liest es auf einer Internetseite nach.', mapsTo:'checker'},
      {label:'Du versuchst es einfach und probierst drauf los.', mapsTo:'macher'},
      {label:'Du fragst deinen Kumpel oder deine BFF, ob sie das schon mal gemacht haben.', mapsTo:'schnacker'}
    ]
  },
  {
    type:'likert', target:'schnacker',
    text:'Du unterhältst dich in der Pause immer gerne mit anderen darüber, was abgeht.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, manchmal.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'likert', target:'checker',
    text:'Dein Lehrer kaut morgens beim konzentrierten Denken auf einem Filzstift herum und malt sich selbst an. Kannst du dich am Abend noch erinnern, mit welcher Farbe der Lehrer seinen Mund angemalt hat?',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, glaube schon.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'likert', target:'schnacker',
    text:'Sachen, die du in einer Diskussion mit anderen besprichst, kannst du dir immer viel besser vorstellen als gelesene Texte.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, denke schon.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'likert', target:'lauscher',
    text:'Wenn du einen Songtext auswendig lernen willst, hörst du dir lieber das ganze Lied an, anstatt dir den Text durchzulesen.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, glaub’ schon.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'forced',
    text:'Du planst eine Reise nach Las Vegas und bist dir noch unsicher über die genaue Route. Wie gehst du vor?',
    options:[
      {label:'Du fragst Leute, die schon dort waren.', mapsTo:'schnacker'},
      {label:'Du fliegst erstmal in die USA und schaust dann weiter.', mapsTo:'macher'},
      {label:'Du hörst einen Reisebericht im Internetradio.', mapsTo:'lauscher'},
      {label:'Du schnappst dir die Reiseführer aus den Bücherregalen von Freunden und der Bibliothek und verschaffst dir einen Überblick.', mapsTo:'checker'}
    ]
  },
  {
    type:'likert', target:'macher',
    text:'Wenn du dich bewegen kannst, während du lernst, geht es leichter und schneller.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, meistens.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'likert', target:'lauscher',
    text:'Mündliche Erklärungen verstehst du sehr gut, selbst wenn die Inhalte richtig kompliziert sind.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, manchmal.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  },
  {
    type:'likert', target:'macher',
    text:'Am liebsten führst du Experimente selber durch, praktische Themen liegen dir am meisten.',
    options:[
      {label:'Ja, auf jeden Fall.', points:2},
      {label:'Ja, denke schon.', points:1},
      {label:'Nein, auf keinen Fall.', points:0}
    ]
  }
];

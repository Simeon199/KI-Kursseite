/** Icons and descriptions of the four learning types. */

export const ICONS = {
  checker: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M2 12C4.5 7 8 4.5 12 4.5S19.5 7 22 12c-2.5 5-6 7.5-10 7.5S4.5 17 2 12Z" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="12" r="3.1" fill="#fff"/></svg>',
  macher: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2.3" stroke="#fff" stroke-width="1.6"/><circle cx="12" cy="12" r="6" stroke="#fff" stroke-width="1.6"/><circle cx="12" cy="12" r="9.4" stroke="#fff" stroke-width="1.6"/></svg>',
  lauscher: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M14.5 3.5C10 3.5 8 7.5 8 10.5c0 2 1 3 2 3.6 1 .6 1.5 1.4 1.5 2.6 0 2-1.6 3.3-3.6 3.1" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M14.5 7c-2 0-3 2-3 3.7 0 1 .5 1.6 1.1 2" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  schnacker: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M4 5.5h16v10H9l-4 3.5v-3.5H4v-10Z" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 9.5h8M8 12.5h5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>'
};

export const TYPES = {
  checker:{
    name:'Checker', name_key:'visuell',
    short:'Du verstehst Dinge besonders gut, wenn du sie sehen kannst. Bilder, Skizzen, Farben, Mindmaps oder Videos helfen dir, Zusammenhänge zu erkennen und Wissen zu ordnen.',
    strength:'Sehen &amp; Strukturieren',
    tagline:'Lernen durch Sehen liegt dir besonders.',
    paragraphs:[
      'Du verstehst Dinge besonders gut, wenn du sie vor dir sehen kannst. Bilder, Skizzen, Grafiken, Farben oder Videos helfen dir dabei, Zusammenhänge zu erkennen und neue Informationen zu ordnen.',
      'Mach dir den Lernstoff deshalb sichtbar. Statt eine Seite immer wieder nur zu lesen, kannst du wichtige Informationen markieren, Zusammenhänge aufzeichnen oder aus einem komplizierten Thema eine übersichtliche Skizze machen.'
    ],
    tipsHeading:'Das kannst du beim Lernen ausprobieren:',
    tips:[
      {lead:'Markiere Wichtiges:', text:'Hebe Schlüsselbegriffe und zentrale Informationen hervor. Aber Vorsicht: Wenn am Ende alles bunt ist, hilft dir das nicht weiter. Weniger ist mehr!'},
      {lead:'Arbeite mit Farben:', text:'Gib bestimmten Farben eine Bedeutung. Zum Beispiel eine Farbe für wichtige Begriffe und eine andere für Beispiele oder Formeln.'},
      {lead:'Nutze Symbole:', text:'Kleine Zeichen und Symbole auf Karteikarten oder in deinen Notizen können dir helfen, Informationen schneller zu erkennen und zuzuordnen.'},
      {lead:'Erstelle Mindmaps:', text:'Ordne ein Thema rund um einen zentralen Begriff an und verbinde die einzelnen Informationen miteinander. So kannst du Zusammenhänge auf einen Blick erkennen.'},
      {lead:'Mach aus Wissen Bilder:', text:'Denk dir zu schwierigen Begriffen oder Fakten ein passendes Bild aus. Je ungewöhnlicher oder lustiger die Vorstellung ist, desto leichter kann sie im Gedächtnis bleiben.'},
      {lead:'Zeichne Zusammenhänge:', text:'Pfeile, Kästen, kleine Skizzen oder einfache Schaubilder können aus einer langen Textseite eine verständliche Übersicht machen.'},
      {lead:'Sorge für Übersicht:', text:'Ein aufgeräumter Arbeitsplatz kann dabei helfen, unnötige Ablenkungen aus deinem Blickfeld zu entfernen. Auf den Tisch kommt am besten nur das, was du gerade zum Lernen brauchst.'}
    ],
    importantHeading:'Wichtig zu wissen',
    importantParagraphs:[
      'Auch wenn dir Lernen durch Sehen besonders liegt, solltest du nicht ausschließlich auf Bilder, Farben und Grafiken setzen.',
      'Kombiniere verschiedene Lernwege: anschauen, zuhören, erklären, aufschreiben und selbst ausprobieren.',
      'Je aktiver du dich mit einem Lernstoff beschäftigst und je mehr sinnvolle Verbindungen du zu deinem vorhandenen Wissen herstellst, desto leichter kannst du ihn später wieder abrufen.'
    ],
    resultStrength:'Sehen &amp; Strukturieren'
  },
  macher:{
    name:'Macher', name_key:'motorisch',
    short:'Du willst nicht nur zuschauen, sondern selbst loslegen. Ausprobieren, üben und anwenden hilft dir dabei, neue Inhalte zu verstehen und zu behalten.',
    strength:'Ausprobieren &amp; Anwenden',
    tagline:'Lernen durch Ausprobieren liegt dir besonders.',
    paragraphs:[
      'Learning by doing passt zu dir: Du verstehst Dinge besonders gut, wenn du selbst aktiv wirst, etwas ausprobierst und Wissen direkt anwendest.',
      'Nur dasitzen und zuhören? Das kann für dich schnell anstrengend werden. Viel leichter fällt dir das Lernen, wenn Bewegung ins Spiel kommt oder du selbst etwas tun kannst. Experimente, praktische Übungen, Modelle oder kleine Aktionen helfen dir dabei, neue Inhalte zu verstehen und im Gedächtnis zu verankern.'
    ],
    tipsHeading:'Das kannst du beim Lernen ausprobieren:',
    tips:[
      {lead:'Lernen in Bewegung:', text:'Lauf beim Auswendiglernen durch dein Zimmer. Verbinde bestimmte Stellen oder Bewegungen mit einzelnen Begriffen oder Lerninhalten.'},
      {lead:'Mach Wissen sichtbar:', text:'Stelle Abläufe mit Gegenständen nach, baue ein Modell oder nutze deine Hände, um dir Zusammenhänge klarzumachen.'},
      {lead:'Gesten als Gedächtnisstütze:', text:'Verbinde wichtige Begriffe mit einer bestimmten Bewegung. Die Bewegung kann dir später helfen, dich wieder an den Inhalt zu erinnern.'},
      {lead:'Vom Wissen ins Tun:', text:'Rechne Aufgaben, führe kleine Experimente durch oder probiere eine Methode direkt aus. Für dich gilt besonders: Nicht nur anschauen – anwenden!'},
      {lead:'Bewegte Lernpausen:', text:'Nutze kurze Pausen, um aufzustehen, dich zu bewegen oder ein paar Schritte zu gehen. Danach kann dein Kopf wieder konzentrierter weiterarbeiten.'}
    ],
    importantHeading:'Wichtig zu wissen',
    importantParagraphs:[
      'Auch wenn dir Lernen durch Bewegung und Ausprobieren besonders liegt, solltest du dich nicht darauf beschränken.',
      'Kombiniere verschiedene Lernwege: anschauen, zuhören, erklären, aufschreiben und selbst ausprobieren.',
      'Je mehr Wege du beim Lernen nutzt, desto mehr Möglichkeiten gibst du deinem Gehirn, neues Wissen zu verarbeiten und wieder abzurufen.'
    ],
    resultStrength:'Ausprobieren &amp; Anwenden'
  },
  lauscher:{
    name:'Lauscher', name_key:'auditiv',
    short:'Du merkst dir Dinge besonders gut, wenn du sie hörst. Erklärungen, Gespräche oder den Lernstoff selbst laut auszusprechen kann dir beim Lernen helfen.',
    strength:'Hören &amp; Erinnern',
    tagline:'Lernen durch Hören liegt dir besonders.',
    paragraphs:[
      'Du kannst dir Dinge gut merken, wenn du sie hörst, erklärt bekommst oder selbst laut aussprichst. Wenn jemand einen komplizierten Zusammenhang verständlich erklärt, macht es bei dir oft schneller „Klick", als wenn du ihn nur im Schulbuch liest.',
      'Auch deine eigene Stimme kannst du beim Lernen nutzen. Erkläre dir den Lernstoff selbst, sprich wichtige Begriffe laut aus oder erzähle mit deinen eigenen Worten, was du gerade gelernt hast.'
    ],
    tipsHeading:'Das kannst du beim Lernen ausprobieren:',
    tips:[
      {text:'Lies dir wichtige Inhalte laut vor. So nimmst du den Lernstoff nicht nur über das Lesen, sondern zusätzlich über das Hören auf.'},
      {lead:'Erklär es dir selbst:', text:'Stell dir vor, du müsstest jemand anderem das Thema erklären. Sprich deine Erklärung laut aus – möglichst mit deinen eigenen Worten.'},
      {lead:'Mach deine eigenen Lern-Audios:', text:'Nimm Zusammenfassungen, Vokabeln oder wichtige Begriffe mit dem Smartphone auf und hör sie dir später noch einmal an.'},
      {lead:'Nutze Audioangebote:', text:'Podcasts, Hörtexte und Erklärvideos können eine gute Ergänzung sein – besonders beim Sprachenlernen und für die richtige Aussprache.'},
      {lead:'Frag nach Erklärungen:', text:'Wenn du etwas nicht verstehst, lass es dir erklären. Manchmal reicht ein anderer Satz oder ein anderes Beispiel und plötzlich wird es klar.'},
      {lead:'Sorge für Ruhe:', text:'Geräusche können deine Aufmerksamkeit schnell auf sich ziehen. Teste deshalb, ob du dich in einer ruhigen Umgebung besser konzentrieren kannst.'}
    ],
    importantHeading:'Wichtig zu wissen',
    importantParagraphs:[
      'Auch wenn dir Lernen durch Hören besonders liegt, solltest du andere Lernwege nicht außer Acht lassen.',
      'Kombiniere zum Beispiel Hören mit Aufschreiben, Anschauen, Erklären und Anwenden. So beschäftigst du dich auf unterschiedliche Weise mit dem Lernstoff und kannst ihn besser verarbeiten.'
    ],
    resultStrength:'Hören &amp; Erklären'
  },
  schnacker:{
    name:'Erklärer', name_key:'kommunikativ',
    short:'Du lernst besonders gut, wenn du dich mit anderen austauschst. Fragen stellen, über ein Thema sprechen oder es jemandem erklären hilft dir, deine Gedanken zu sortieren und Wissen zu festigen.',
    strength:'Austauschen &amp; Erklären',
    tagline:'Lernen durch Austausch liegt dir besonders.',
    paragraphs:[
      'Du verstehst Dinge besonders gut, wenn du darüber sprechen, Fragen stellen und deine Gedanken mit anderen teilen kannst. Einfach nur lesen und auswendig lernen? Das reicht dir oft nicht.',
      'Wenn du jemandem einen Lernstoff mit deinen eigenen Worten erklärst, merkst du schnell, was du schon verstanden hast – und wo noch eine Lücke steckt. Gespräche und Diskussionen helfen dir dabei, deine Gedanken zu sortieren und Zusammenhänge besser zu verstehen.'
    ],
    tipsHeading:'Das kannst du beim Lernen ausprobieren:',
    tips:[
      {lead:'Erklär es jemandem:', text:'Schnapp dir einen Freund, eine Freundin oder jemanden aus deiner Familie und erkläre das Thema so, als wärst du selbst der Lehrer. Kannst du es verständlich erklären, hast du schon viel verstanden.'},
      {lead:'Lernt gemeinsam:', text:'Trefft euch zu zweit oder in einer kleinen Gruppe. Stellt euch gegenseitig Fragen, vergleicht eure Antworten und erklärt euch schwierige Stellen.'},
      {lead:'Mach eine Quizrunde:', text:'Schreibt Fragen zum aktuellen Lernstoff auf Karteikarten und legt sie verdeckt auf den Tisch. Zieht abwechselnd eine Karte und versucht, die Frage möglichst genau zu beantworten. Für eine richtige Antwort gibt es einen Punkt – und für eine besonders gute Erklärung vielleicht sogar einen Extrapunkt.'},
      {lead:'Stell Fragen:', text:'Wenn dir etwas unklar ist, frag nach. Eine gute Frage kann dir manchmal mehr bringen als zehn Minuten weiteres Lesen.'},
      {lead:'Diskutiere verschiedene Lösungen:', text:'Gerade bei schwierigen Aufgaben kann es helfen, unterschiedliche Lösungswege miteinander zu vergleichen. Erklärt euch gegenseitig, wie ihr auf eure Lösung gekommen seid.'}
    ],
    importantHeading:'Wichtig zu wissen',
    importantParagraphs:[
      'Auch wenn dir Lernen durch Austausch und Erklären besonders liegt, funktioniert gemeinsames Lernen nur dann gut, wenn ihr wirklich beim Thema bleibt.',
      'Und auch für dich gilt: Kombiniere verschiedene Lernwege. Anschauen, zuhören, aufschreiben, ausprobieren und erklären ergänzen sich.',
      'Je mehr du einen Lernstoff selbst verarbeitest und mit deinem vorhandenen Wissen verbindest, desto besser kannst du ihn verstehen und später wieder abrufen.'
    ],
    resultStrength:'Austauschen &amp; Erklären'
  }
};

export const TYPE_ORDER = ['checker','macher','lauscher','schnacker'];

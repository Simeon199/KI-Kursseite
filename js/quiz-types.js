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
    short:'Ihr Kind versteht Dinge besonders gut, wenn es sie sehen kann. Bilder, Skizzen, Farben, Mindmaps oder Videos helfen ihm, Zusammenhänge zu erkennen und Wissen zu ordnen.',
    strength:'Sehen &amp; Strukturieren',
    tagline:'Lernen durch Sehen liegt Ihrem Kind besonders.',
    paragraphs:[
      'Ihr Kind versteht Dinge besonders gut, wenn es sie vor sich sehen kann. Bilder, Skizzen, Grafiken, Farben oder Videos helfen ihm dabei, Zusammenhänge zu erkennen und neue Informationen zu ordnen.',
      'Ermutigen Sie Ihr Kind deshalb, den Lernstoff sichtbar zu machen. Statt eine Seite immer wieder nur zu lesen, kann es wichtige Informationen markieren, Zusammenhänge aufzeichnen oder aus einem komplizierten Thema eine übersichtliche Skizze machen.'
    ],
    tipsHeading:'Das kann Ihr Kind beim Lernen ausprobieren:',
    tips:[
      {lead:'Wichtiges markieren:', text:'Schlüsselbegriffe und zentrale Informationen hervorheben. Aber Vorsicht: Wenn am Ende alles bunt ist, hilft das nicht weiter. Weniger ist mehr!'},
      {lead:'Mit Farben arbeiten:', text:'Bestimmten Farben eine Bedeutung geben, zum Beispiel eine Farbe für wichtige Begriffe und eine andere für Beispiele oder Formeln.'},
      {lead:'Symbole nutzen:', text:'Kleine Zeichen und Symbole auf Karteikarten oder in den Notizen helfen, Informationen schneller zu erkennen und zuzuordnen.'},
      {lead:'Mindmaps erstellen:', text:'Ein Thema rund um einen zentralen Begriff anordnen und die einzelnen Informationen miteinander verbinden. So werden Zusammenhänge auf einen Blick sichtbar.'},
      {lead:'Aus Wissen Bilder machen:', text:'Zu schwierigen Begriffen oder Fakten ein passendes Bild ausdenken. Je ungewöhnlicher oder lustiger die Vorstellung ist, desto leichter bleibt sie im Gedächtnis.'},
      {lead:'Zusammenhänge zeichnen:', text:'Pfeile, Kästen, kleine Skizzen oder einfache Schaubilder machen aus einer langen Textseite eine verständliche Übersicht.'},
      {lead:'Für Übersicht sorgen:', text:'Ein aufgeräumter Arbeitsplatz hält unnötige Ablenkungen aus dem Blickfeld. Auf den Tisch kommt am besten nur das, was Ihr Kind gerade zum Lernen braucht.'}
    ],
    importantHeading:'Wichtig zu wissen',
    importantParagraphs:[
      'Auch wenn Ihrem Kind Lernen durch Sehen besonders liegt, sollte es nicht ausschließlich auf Bilder, Farben und Grafiken setzen.',
      'Am besten kombiniert es verschiedene Lernwege: anschauen, zuhören, erklären, aufschreiben und selbst ausprobieren.',
      'Je aktiver sich Ihr Kind mit einem Lernstoff beschäftigt und je mehr sinnvolle Verbindungen es zu seinem vorhandenen Wissen herstellt, desto leichter kann es ihn später wieder abrufen.'
    ],
    resultStrength:'Sehen &amp; Strukturieren'
  },
  macher:{
    name:'Macher', name_key:'motorisch',
    short:'Ihr Kind will nicht nur zuschauen, sondern selbst loslegen. Ausprobieren, üben und anwenden hilft ihm dabei, neue Inhalte zu verstehen und zu behalten.',
    strength:'Ausprobieren &amp; Anwenden',
    tagline:'Lernen durch Ausprobieren liegt Ihrem Kind besonders.',
    paragraphs:[
      'Learning by doing passt zu Ihrem Kind: Es versteht Dinge besonders gut, wenn es selbst aktiv wird, etwas ausprobiert und Wissen direkt anwendet.',
      'Nur dasitzen und zuhören? Das kann für Ihr Kind schnell anstrengend werden. Viel leichter fällt ihm das Lernen, wenn Bewegung ins Spiel kommt oder es selbst etwas tun kann. Experimente, praktische Übungen, Modelle oder kleine Aktionen helfen ihm dabei, neue Inhalte zu verstehen und im Gedächtnis zu verankern.'
    ],
    tipsHeading:'Das kann Ihr Kind beim Lernen ausprobieren:',
    tips:[
      {lead:'Lernen in Bewegung:', text:'Beim Auswendiglernen durchs Zimmer laufen und bestimmte Stellen oder Bewegungen mit einzelnen Begriffen oder Lerninhalten verbinden.'},
      {lead:'Wissen sichtbar machen:', text:'Abläufe mit Gegenständen nachstellen, ein Modell bauen oder die Hände nutzen, um sich Zusammenhänge klarzumachen.'},
      {lead:'Gesten als Gedächtnisstütze:', text:'Wichtige Begriffe mit einer bestimmten Bewegung verbinden. Die Bewegung hilft später, sich wieder an den Inhalt zu erinnern.'},
      {lead:'Vom Wissen ins Tun:', text:'Aufgaben rechnen, kleine Experimente durchführen oder eine Methode direkt ausprobieren. Für Ihr Kind gilt besonders: Nicht nur anschauen – anwenden!'},
      {lead:'Bewegte Lernpausen:', text:'Kurze Pausen nutzen, um aufzustehen, sich zu bewegen oder ein paar Schritte zu gehen. Danach kann der Kopf wieder konzentrierter weiterarbeiten.'}
    ],
    importantHeading:'Wichtig zu wissen',
    importantParagraphs:[
      'Auch wenn Ihrem Kind Lernen durch Bewegung und Ausprobieren besonders liegt, sollte es sich nicht darauf beschränken.',
      'Am besten kombiniert es verschiedene Lernwege: anschauen, zuhören, erklären, aufschreiben und selbst ausprobieren.',
      'Je mehr Wege Ihr Kind beim Lernen nutzt, desto mehr Möglichkeiten bekommt sein Gehirn, neues Wissen zu verarbeiten und wieder abzurufen.'
    ],
    resultStrength:'Ausprobieren &amp; Anwenden'
  },
  lauscher:{
    name:'Lauscher', name_key:'auditiv',
    short:'Ihr Kind merkt sich Dinge besonders gut, wenn es sie hört. Erklärungen, Gespräche oder den Lernstoff selbst laut auszusprechen kann ihm beim Lernen helfen.',
    strength:'Hören &amp; Erinnern',
    tagline:'Lernen durch Hören liegt Ihrem Kind besonders.',
    paragraphs:[
      'Ihr Kind kann sich Dinge gut merken, wenn es sie hört, erklärt bekommt oder selbst laut ausspricht. Wenn jemand einen komplizierten Zusammenhang verständlich erklärt, macht es bei ihm oft schneller „Klick“, als wenn es ihn nur im Schulbuch liest.',
      'Auch die eigene Stimme kann Ihr Kind beim Lernen nutzen: sich den Lernstoff selbst erklären, wichtige Begriffe laut aussprechen oder mit eigenen Worten erzählen, was es gerade gelernt hat.'
    ],
    tipsHeading:'Das kann Ihr Kind beim Lernen ausprobieren:',
    tips:[
      {text:'Wichtige Inhalte laut vorlesen. So nimmt Ihr Kind den Lernstoff nicht nur über das Lesen, sondern zusätzlich über das Hören auf.'},
      {lead:'Sich selbst erklären:', text:'Sich vorstellen, jemand anderem das Thema zu erklären, und die Erklärung laut aussprechen – möglichst mit eigenen Worten.'},
      {lead:'Eigene Lern-Audios:', text:'Zusammenfassungen, Vokabeln oder wichtige Begriffe mit dem Smartphone aufnehmen und später noch einmal anhören.'},
      {lead:'Audioangebote nutzen:', text:'Podcasts, Hörtexte und Erklärvideos können eine gute Ergänzung sein – besonders beim Sprachenlernen und für die richtige Aussprache.'},
      {lead:'Nach Erklärungen fragen:', text:'Wenn Ihr Kind etwas nicht versteht, darf es sich das erklären lassen. Manchmal reicht ein anderer Satz oder ein anderes Beispiel und plötzlich wird es klar.'},
      {lead:'Für Ruhe sorgen:', text:'Geräusche ziehen die Aufmerksamkeit schnell auf sich. Testen Sie gemeinsam, ob sich Ihr Kind in einer ruhigen Umgebung besser konzentrieren kann.'}
    ],
    importantHeading:'Wichtig zu wissen',
    importantParagraphs:[
      'Auch wenn Ihrem Kind Lernen durch Hören besonders liegt, sollte es andere Lernwege nicht außer Acht lassen.',
      'Gut ist zum Beispiel, Hören mit Aufschreiben, Anschauen, Erklären und Anwenden zu kombinieren. So beschäftigt sich Ihr Kind auf unterschiedliche Weise mit dem Lernstoff und kann ihn besser verarbeiten.'
    ],
    resultStrength:'Hören &amp; Erklären'
  },
  schnacker:{
    name:'Erklärer', name_key:'kommunikativ',
    short:'Ihr Kind lernt besonders gut, wenn es sich mit anderen austauscht. Fragen stellen, über ein Thema sprechen oder es jemandem erklären hilft ihm, seine Gedanken zu sortieren und Wissen zu festigen.',
    strength:'Austauschen &amp; Erklären',
    tagline:'Lernen durch Austausch liegt Ihrem Kind besonders.',
    paragraphs:[
      'Ihr Kind versteht Dinge besonders gut, wenn es darüber sprechen, Fragen stellen und seine Gedanken mit anderen teilen kann. Einfach nur lesen und auswendig lernen? Das reicht ihm oft nicht.',
      'Wenn Ihr Kind jemandem einen Lernstoff mit eigenen Worten erklärt, merkt es schnell, was es schon verstanden hat – und wo noch eine Lücke steckt. Gespräche und Diskussionen helfen ihm dabei, seine Gedanken zu sortieren und Zusammenhänge besser zu verstehen.'
    ],
    tipsHeading:'Das kann Ihr Kind beim Lernen ausprobieren:',
    tips:[
      {lead:'Jemandem erklären:', text:'Ihr Kind erklärt einem Freund, einer Freundin oder Ihnen das Thema so, als wäre es selbst die Lehrkraft. Kann es das verständlich erklären, hat es schon viel verstanden.'},
      {lead:'Gemeinsam lernen:', text:'Zu zweit oder in einer kleinen Gruppe lernen: sich gegenseitig Fragen stellen, Antworten vergleichen und schwierige Stellen erklären.'},
      {lead:'Quizrunde machen:', text:'Fragen zum aktuellen Lernstoff auf Karteikarten schreiben und verdeckt auf den Tisch legen. Abwechselnd wird eine Karte gezogen und die Frage möglichst genau beantwortet. Für eine richtige Antwort gibt es einen Punkt – und für eine besonders gute Erklärung vielleicht sogar einen Extrapunkt. Das funktioniert auch gut als Familienrunde.'},
      {lead:'Fragen stellen:', text:'Wenn etwas unklar ist, nachfragen. Eine gute Frage bringt manchmal mehr als zehn Minuten weiteres Lesen.'},
      {lead:'Lösungen diskutieren:', text:'Gerade bei schwierigen Aufgaben hilft es, unterschiedliche Lösungswege zu vergleichen und sich gegenseitig zu erklären, wie man auf die Lösung gekommen ist.'}
    ],
    importantHeading:'Wichtig zu wissen',
    importantParagraphs:[
      'Auch wenn Ihrem Kind Lernen durch Austausch und Erklären besonders liegt, funktioniert gemeinsames Lernen nur dann gut, wenn alle wirklich beim Thema bleiben.',
      'Und auch für Ihr Kind gilt: Verschiedene Lernwege kombinieren. Anschauen, zuhören, aufschreiben, ausprobieren und erklären ergänzen sich.',
      'Je mehr Ihr Kind einen Lernstoff selbst verarbeitet und mit seinem vorhandenen Wissen verbindet, desto besser kann es ihn verstehen und später wieder abrufen.'
    ],
    resultStrength:'Austauschen &amp; Erklären'
  }
};

export const TYPE_ORDER = ['checker','macher','lauscher','schnacker'];

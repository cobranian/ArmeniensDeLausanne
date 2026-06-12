/* =========================================================================
   Arméniens de Lausanne — i18n
   Dictionnaires FR / EN / HY + commutateur de langue.
   Vanille, sans dépendance. Le défaut est FR ; ?lang=… ou localStorage
   peuvent override. La langue choisie est persistée.
   ========================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "alausanne.lang";
  var DEFAULT_LANG = "fr";
  var SUPPORTED = ["fr", "en", "hy"];

  /* -------------------------------------------------------------------------
     Dictionnaires
     ------------------------------------------------------------------------- */
  var dict = {
    fr: {
      /* document */
      "doc.title": "Arméniens de Lausanne — Revue communautaire",
      "doc.description": "La communauté arménienne de Lausanne : histoire, culture, cuisine, mémoire et vie associative — une revue continue, depuis la Suisse romande.",

      /* skip + masthead */
      "nav.skip": "Aller au contenu principal",
      "masthead.wordmark.word1": "Arméniens",
      "masthead.wordmark.word2": "Lausanne",
      "masthead.wordmark.aria": "Arméniens de Lausanne, accueil",
      "masthead.location": "Suisse romande",
      "masthead.tagline.fr": "<em>Une revue continue de la communauté arménienne de Lausanne</em>",

      /* lang switcher */
      "lang.switcher.label": "Langue",

      /* nav */
      "nav.aria.primary": "Navigation principale",
      "nav.open": "Ouvrir le menu",
      "nav.close": "Fermer le menu",
      "nav.home": "Accueil",
      "nav.community": "Communauté",
      "nav.history": "Histoire",
      "nav.culture": "Culture",
      "nav.doudouk": "Doudouk",
      "nav.peintres": "Peintres",
      "nav.network": "Réseau",
      "nav.cuisine": "Cuisine",
      "nav.agenda": "Agenda",
      "nav.cta": "Nous rejoindre",

      /* hero */
      "hero.title.line1": "Arméniens",
      "hero.title.line2": "<em>de</em>&nbsp;Lausanne",
      "hero.lead": "Préserver nos racines, transmettre notre culture et vivre notre mémoire — <em>ensemble, au cœur de la Suisse romande.</em>",
      "hero.cta1": "Lire la revue",
      "hero.cta2": "Rejoindre la communauté",
      "hero.toc.label": "Sommaire",
      "hero.toc.community": "Communauté",
      "hero.toc.history": "Histoire&nbsp;&amp;&nbsp;Patrimoine",
      "hero.toc.culture": "Culture&nbsp;&amp;&nbsp;Arts",
      "hero.toc.cuisine": "La&nbsp;table",
      "hero.toc.agenda": "Agenda",
      "hero.image.alt": "Les ruines de la cathédrale de Zvartnots avec le mont Ararat enneigé en arrière-plan, paysage d'Arménie.",
      "hero.frontispiece.label": "Frontispice",
      "hero.frontispiece.body": "<em>Les ruines de Zvartnots devant l'Ararat</em> — emblème d'une mémoire qui demeure.",

      /* community */
      "community.label": "Communauté",
      "community.eyebrow": "Qui sommes-nous",
      "community.title": "Une&nbsp;communauté vivante <em>en&nbsp;terre vaudoise.</em>",
      "community.lead": "La communauté arménienne de Lausanne réunit des familles et des individus attachés à une histoire millénaire et à une culture qu'ils font vivre, génération après génération, loin de la terre d'origine. Issue d'une longue histoire de migrations et de résilience, la diaspora arménienne de Suisse romande s'inscrit aujourd'hui pleinement dans la vie locale tout en cultivant sa singularité.",
      "community.p2": "Notre association a pour vocation de rassembler, de transmettre la langue et les traditions aux plus jeunes, de préserver la mémoire et de tisser des liens de solidarité — entre Arméniens, et avec toutes celles et ceux qui souhaitent découvrir cette culture.",
      "community.pillars.label": "Nos quatre engagements",
      "community.pillar1.title": "Transmettre",
      "community.pillar1.desc": "Langue, musique, danse et savoir-faire confiés aux nouvelles générations.",
      "community.pillar2.title": "Rassembler",
      "community.pillar2.desc": "Des rencontres régulières, des fêtes et des moments de partage.",
      "community.pillar3.title": "Se souvenir",
      "community.pillar3.desc": "Honorer la mémoire et faire connaître l'histoire arménienne.",
      "community.pillar4.title": "Accueillir",
      "community.pillar4.desc": "Une porte ouverte à toute personne curieuse de l'Arménie.",

      /* history */
      "history.label": "Histoire",
      "history.eyebrow": "Histoire &amp; Patrimoine",
      "history.title": "Aux sources d'une des plus anciennes <em>civilisations.</em>",
      "history.sub": "Du mont Ararat aux monastères de pierre, un héritage de plus de trois mille ans.",
      "history.feature.alt": "« La descente de Noé du mont Ararat », peinture d'Ivan Aïvazovski",
      "history.feature.caption": "Ivan Aïvazovski — <em>La descente de Noé du mont Ararat</em>",
      "history.feature.title": "Le berceau d'Ararat",
      "history.feature.body": "Le mont Ararat, où la tradition situe l'arche de Noé, domine l'imaginaire arménien. Première nation à adopter le christianisme comme religion d'État en 301, l'Arménie a forgé une identité indissociable de sa foi, de ses églises et de ses khatchkars — ces croix de pierre sculptées.",
      "history.feature.pull": "<em>« Nous sommes nos montagnes. »</em>",
      "history.timeline.label": "Chronologie",
      "history.timeline.301": "L'Arménie adopte le christianisme comme religion d'État, une première mondiale.",
      "history.timeline.405": "Mesrop Machtots crée l'alphabet arménien, pilier de la culture écrite.",
      "history.timeline.1915": "Le génocide des Arméniens ; l'exil façonne la diaspora mondiale, jusqu'en Suisse.",
      "history.timeline.1991": "L'Arménie retrouve son indépendance.",
      "history.gallery.alt1": "Le temple hellénistique de Garni, surplombant une gorge en Arménie",
      "history.gallery.cap1": "Le temple de Garni, <em>vestige hellénistique</em>",
      "history.gallery.alt2": "La cathédrale d'Etchmiadzine, berceau de l'Église apostolique arménienne",
      "history.gallery.cap2": "L'architecture sacrée arménienne",
      "history.gallery.alt3": "Le monument « Nous sommes nos montagnes », sculpture monumentale en tuf",
      "history.gallery.cap3": "<em>« Nous sommes nos montagnes »</em> — emblème identitaire",

      /* culture */
      "culture.label": "Culture &amp; Arts",
      "culture.eyebrow": "Culture &amp; Arts",
      "culture.title": "Une culture <em>qui chante,</em> danse <em>et</em> peint.",
      "culture.sub": "La langue, la musique du doudouk, la danse et une peinture flamboyante.",
      "culture.feature.alt": "Danseurs arméniens en costumes traditionnels lors d'une fête",
      "culture.feature.caption": "La danse traditionnelle, <em>transmise de génération en génération</em>",
      "culture.feature.title": "Le geste et le chant",
      "culture.feature.body": "Les danses circulaires, les costumes brodés et la voix nostalgique du doudouk — flûte en bois d'abricotier classée par l'UNESCO — accompagnent chaque grande occasion. La langue arménienne, avec son alphabet unique, demeure le fil rouge de cette transmission.",
      "culture.feature.pull": "<em>Le doudouk pleure ce que les mots taisent.</em>",
      "culture.doudouk.link": "Le souffle du bois d'abricotier",
      "culture.dance.kicker": "Pratiquer la danse",
      "culture.dance.title": "Cours de danse arménienne",
      "culture.dance.org": "Association de l'École arménienne de Lausanne <strong>ARARAT</strong> &amp; le Groupe de danse <strong>MARGARIT</strong>",
      "culture.dance.lead": "Un projet unique à Lausanne, ouvert à toutes et à tous, autour d'un héritage culturel plurimillénaire.",
      "culture.dance.where": "Où nous trouver&nbsp;?",
      "culture.dance.slot1.day": "Dimanche · 9h – 10h",
      "culture.dance.slot1.place": "Studio 2 — Rue du Valentin 35, 1004 Lausanne",
      "culture.dance.slot2.day": "Mardi · 18h – 19h",
      "culture.dance.slot2.place": "Maison de quartier des Faverges — ch. de Bonne-Espérance 30, 1006 Lausanne",
      "culture.dance.frieze": "En mouvement",
      "culture.dance.cap1": "L'élan de la ronde",
      "culture.dance.cap2": "Le pas, transmis",
      "culture.dance.cap3": "Mains liées",
      "culture.dance.cap4": "La joie partagée",
      "culture.dance.alt1": "Danse arménienne en cercle, mouvement d'ensemble",
      "culture.dance.alt2": "Pas de danse arménienne traditionnelle",
      "culture.dance.alt3": "Danseurs aux mains liées formant une ronde",
      "culture.dance.alt4": "Moment de fête autour de la danse arménienne",
      "culture.painters.kicker": "Galerie de peinture",
      "culture.painters.title": "Neuf peintres, <em>neuf regards</em>",
      "culture.painters.lead": "Le soleil de Martiros Saryan, le feu de Minas Avetisyan, le silence de Movses Poghosyan, la lumière d'Armen Harutyunyan « Lorenc », la grâce de Matevos Sargsyan, la floraison de Shahen Ordubekyan, le fragment d'Artsrun Asatryan, l'or de Hayk Miqayelyan et le conte de Mher Chatinyan — une même terre, traduite en couleur.",
      "culture.painters.saryan.word": "Le soleil",
      "culture.painters.saryan.alt": "Paysage monumental d'Arménie : gorges dorées, cyprès et ronde de femmes — Martiros Saryan, 1923",
      "culture.painters.minas.word": "Le feu",
      "culture.painters.minas.alt": "Village arménien aux maisons en coupole, rouges et oranges incandescents — Minas Avetisyan, 1971",
      "culture.painters.movses.word": "Le silence",
      "culture.painters.movses.alt": "Une mère enlace son enfant endormi, figures stylisées en tons sépia — Movses Poghosyan, 2021",
      "culture.painters.lorenc.word": "La lumière",
      "culture.painters.lorenc.alt": "Vallée de montagne traversée par des rayons de lumière, peinture au couteau — Armen Harutyunyan « Lorenc »",
      "culture.painters.matevos.word": "La grâce",
      "culture.painters.matevos.alt": "Femme stylisée au long visage et aux yeux bleus, couronne colorée et petit oiseau — Matevos Sargsyan",
      "culture.painters.shahen.word": "La floraison",
      "culture.painters.shahen.alt": "Tulipes rouges et fleurs des champs devant une clôture de bois, jardin multicolore — Shahen Ordubekyan",
      "culture.painters.artsrun.word": "Le fragment",
      "culture.painters.artsrun.alt": "Visage à facettes vives, un œil cerné de rouge et lèvres rouges, cubo-futurisme — Artsrun Asatryan",
      "culture.painters.hayk.word": "L'or",
      "culture.painters.hayk.alt": "Femme en coiffe traditionnelle arménienne tenant une grenade, tons chauds et or — Hayk Miqayelyan",
      "culture.painters.mher.word": "Le conte",
      "culture.painters.mher.alt": "Femme à la coiffe rouge fleurie tenant un coq, un âne bleu à ses côtés — Mher Chatinyan",
      "culture.painters.link": "Entrer dans la galerie",

      /* cuisine */
      "cuisine.label": "La&nbsp;table",
      "cuisine.eyebrow": "Cuisine",
      "cuisine.title": "La table arménienne, <em>généreuse et partagée.</em>",
      "cuisine.sub": "Une cuisine de transmission, où chaque plat raconte une famille.",
      "cuisine.dish1.alt": "Manti arméniens : petits raviolis nappés de yaourt à l'ail",
      "cuisine.dish1.n": "N°&nbsp;01",
      "cuisine.dish1.name": "Manti",
      "cuisine.dish1.desc": "Minuscules raviolis de viande, nappés de yaourt à l'ail.",
      "cuisine.dish2.alt": "Dolma : feuilles de chou farcies, plat traditionnel arménien",
      "cuisine.dish2.n": "N°&nbsp;02",
      "cuisine.dish2.name": "Dolma",
      "cuisine.dish2.desc": "Feuilles de chou ou de vigne farcies, mijotées avec soin.",

      /* events */
      "events.label": "Agenda",
      "events.eyebrow": "Prochains rendez-vous",
      "events.title": "L'agenda <em>de la saison.</em>",
      "events.sub": "Rendez-vous arméniens à travers la diaspora et l'Arménie — classés par pays, région et ville.",
      "events.source": "Source&nbsp;: <a href=\"https://armenopole.com/ArmenianEvents\" target=\"_blank\" rel=\"noopener noreferrer\">armenopole.com</a>&nbsp;— instantané du 12&nbsp;juin 2026.",

      /* contact */
      "contact.label": "Correspondance",
      "contact.eyebrow": "Nous rejoindre",
      "contact.title": "Prenons <em>contact.</em>",
      "contact.sub": "Une question, l'envie d'adhérer ou de participer à la vie de la communauté&nbsp;? Écrivez-nous.",
      "contact.form.kicker": "Correspondance",
      "contact.form.lead": "Le moyen le plus simple de nous joindre&nbsp;: <em>un courrier électronique.</em> Présentez-vous en quelques mots et nous reviendrons vers vous.",
      "contact.form.cta": "Écrire à contact@armeniensdelausanne.ch",
      "contact.form.hint": "Le lien ouvre votre application de messagerie. Vous pouvez aussi copier l'adresse&nbsp;: <code>contact@armeniensdelausanne.ch</code>",
      "contact.info.kicker": "Coordonnées",
      "contact.info.title": "La rédaction",
      "contact.info.email.label": "E-mail",
      "contact.info.address.label": "Adresse",
      "contact.info.address.value": "Lausanne, Suisse<br /><em>[à compléter]</em>",
      "contact.info.social.label": "Réseaux",
      "contact.info.social.value": "Facebook · Instagram<br /><em>[liens à compléter]</em>",
      "contact.info.note": "Les coordonnées ci-dessus sont des champs à renseigner par l'association.",

      /* footer */
      "footer.brand.name": "Arméniens de Lausanne",
      "footer.brand.sub": "<em>Revue communautaire — Vol.&nbsp;I, édition continue.</em>",
      "footer.nav.aria": "Liens de pied de page",
      "footer.nav.label": "Sommaire",
      "footer.nav.community": "Communauté",
      "footer.nav.history": "Histoire",
      "footer.nav.culture": "Culture",
      "footer.nav.cuisine": "Cuisine",
      "footer.nav.agenda": "Agenda",
      "footer.nav.contact": "Contact",
      "footer.colophon.label": "Colophon",
      "footer.colophon.body": "Composé en <em>Fraunces</em> et <em>Spectral</em>.<br />Palette&nbsp;: grenade, abricot, cobalt, parchemin.<br />Site statique, sans suivi.",
      "footer.colophon.region": "Suisse romande",
      "footer.totop.aria": "Retour en haut",
      "footer.totop.text": "Haut de page"
    },

    en: {
      "doc.title": "Armenians of Lausanne — Community chronicle",
      "doc.description": "The Armenian community of Lausanne: history, culture, cuisine, memory and community life — an ongoing chronicle, from French-speaking Switzerland.",

      "nav.skip": "Skip to main content",
      "masthead.wordmark.word1": "Armenians",
      "masthead.wordmark.word2": "Lausanne",
      "masthead.wordmark.aria": "Armenians of Lausanne, home",
      "masthead.location": "French-speaking Switzerland",
      "masthead.tagline.fr": "<em>A continuing chronicle of the Armenian community of Lausanne</em>",

      "lang.switcher.label": "Language",

      "nav.aria.primary": "Main navigation",
      "nav.open": "Open menu",
      "nav.close": "Close menu",
      "nav.home": "Home",
      "nav.community": "Community",
      "nav.history": "History",
      "nav.culture": "Culture",
      "nav.doudouk": "Duduk",
      "nav.peintres": "Painters",
      "nav.network": "Network",
      "nav.cuisine": "Cuisine",
      "nav.agenda": "Agenda",
      "nav.cta": "Join us",

      "hero.title.line1": "Armenians",
      "hero.title.line2": "<em>of</em>&nbsp;Lausanne",
      "hero.lead": "Preserving our roots, passing on our culture and living our memory — <em>together, in the heart of French-speaking Switzerland.</em>",
      "hero.cta1": "Read the chronicle",
      "hero.cta2": "Join the community",
      "hero.toc.label": "Contents",
      "hero.toc.community": "Community",
      "hero.toc.history": "History&nbsp;&amp;&nbsp;Heritage",
      "hero.toc.culture": "Culture&nbsp;&amp;&nbsp;Arts",
      "hero.toc.cuisine": "The&nbsp;table",
      "hero.toc.agenda": "Agenda",
      "hero.image.alt": "The ruins of Zvartnots Cathedral with snow-capped Mount Ararat in the background, an Armenian landscape.",
      "hero.frontispiece.label": "Frontispiece",
      "hero.frontispiece.body": "<em>The ruins of Zvartnots before Ararat</em> — emblem of a memory that endures.",

      "community.label": "Community",
      "community.eyebrow": "Who we are",
      "community.title": "A&nbsp;living community <em>in&nbsp;the canton of Vaud.</em>",
      "community.lead": "The Armenian community of Lausanne brings together families and individuals devoted to a thousand-year history and a culture they keep alive, generation after generation, far from the land of origin. Born of a long history of migration and resilience, the Armenian diaspora of French-speaking Switzerland is today fully part of local life while cultivating its singularity.",
      "community.p2": "Our association exists to bring people together, to pass on the language and traditions to the young, to preserve memory, and to weave bonds of solidarity — among Armenians, and with everyone who wishes to discover this culture.",
      "community.pillars.label": "Our four commitments",
      "community.pillar1.title": "Transmit",
      "community.pillar1.desc": "Language, music, dance and craft, entrusted to the new generations.",
      "community.pillar2.title": "Gather",
      "community.pillar2.desc": "Regular gatherings, celebrations and moments of sharing.",
      "community.pillar3.title": "Remember",
      "community.pillar3.desc": "Honoring memory and sharing Armenian history.",
      "community.pillar4.title": "Welcome",
      "community.pillar4.desc": "An open door to anyone curious about Armenia.",

      "history.label": "History",
      "history.eyebrow": "History &amp; Heritage",
      "history.title": "At the source of one of the oldest <em>civilizations.</em>",
      "history.sub": "From Mount Ararat to monasteries of stone, a heritage spanning more than three thousand years.",
      "history.feature.alt": "'The Descent of Noah from Mount Ararat', a painting by Ivan Aivazovsky",
      "history.feature.caption": "Ivan Aivazovsky — <em>The Descent of Noah from Mount Ararat</em>",
      "history.feature.title": "The cradle of Ararat",
      "history.feature.body": "Mount Ararat, where tradition places Noah's ark, presides over the Armenian imagination. The first nation to adopt Christianity as its state religion in 301, Armenia forged an identity inseparable from its faith, its churches and its khachkars — those carved stone crosses.",
      "history.feature.pull": "<em>'We are our mountains.'</em>",
      "history.timeline.label": "Timeline",
      "history.timeline.301": "Armenia adopts Christianity as its state religion — a world first.",
      "history.timeline.405": "Mesrop Mashtots creates the Armenian alphabet, the cornerstone of written culture.",
      "history.timeline.1915": "The Armenian Genocide; exile shapes a worldwide diaspora, all the way to Switzerland.",
      "history.timeline.1991": "Armenia regains its independence.",
      "history.gallery.alt1": "The Hellenistic temple of Garni, overlooking a gorge in Armenia",
      "history.gallery.cap1": "The temple of Garni, <em>a Hellenistic vestige</em>",
      "history.gallery.alt2": "Etchmiadzin Cathedral, cradle of the Armenian Apostolic Church",
      "history.gallery.cap2": "Sacred Armenian architecture",
      "history.gallery.alt3": "The 'We Are Our Mountains' monument, a monumental tufa sculpture",
      "history.gallery.cap3": "<em>'We are our mountains'</em> — emblem of identity",

      "culture.label": "Culture &amp; Arts",
      "culture.eyebrow": "Culture &amp; Arts",
      "culture.title": "A culture <em>that sings,</em> dances <em>and</em> paints.",
      "culture.sub": "The language, the music of the duduk, the dance, and a vivid painting tradition.",
      "culture.feature.alt": "Armenian dancers in traditional costumes during a celebration",
      "culture.feature.caption": "Traditional dance, <em>passed down from generation to generation</em>",
      "culture.feature.title": "Gesture and song",
      "culture.feature.body": "Round dances, embroidered costumes and the wistful voice of the duduk — an apricot-wood flute inscribed on UNESCO's list — accompany every major occasion. The Armenian language, with its unique alphabet, remains the unbroken thread of this transmission.",
      "culture.feature.pull": "<em>The duduk weeps what words cannot speak.</em>",
      "culture.doudouk.link": "The breath of apricot wood",
      "culture.dance.kicker": "Practise the dance",
      "culture.dance.title": "Armenian dance classes",
      "culture.dance.org": "Lausanne Armenian School association <strong>ARARAT</strong> &amp; the <strong>MARGARIT</strong> dance group",
      "culture.dance.lead": "A project unique to Lausanne, open to everyone, around a cultural heritage thousands of years old.",
      "culture.dance.where": "Where to find us",
      "culture.dance.slot1.day": "Sunday · 9–10 am",
      "culture.dance.slot1.place": "Studio 2 — Rue du Valentin 35, 1004 Lausanne",
      "culture.dance.slot2.day": "Tuesday · 6–7 pm",
      "culture.dance.slot2.place": "Maison de quartier des Faverges — ch. de Bonne-Espérance 30, 1006 Lausanne",
      "culture.dance.frieze": "In motion",
      "culture.dance.cap1": "The sweep of the round",
      "culture.dance.cap2": "The step, handed down",
      "culture.dance.cap3": "Hands joined",
      "culture.dance.cap4": "Joy, shared",
      "culture.dance.alt1": "Armenian circle dance, the group in motion",
      "culture.dance.alt2": "A step of traditional Armenian dance",
      "culture.dance.alt3": "Dancers with joined hands forming a round",
      "culture.dance.alt4": "A festive moment around Armenian dance",
      "culture.painters.kicker": "Painting gallery",
      "culture.painters.title": "Nine painters, <em>nine gazes</em>",
      "culture.painters.lead": "The sun of Martiros Saryan, the fire of Minas Avetisyan, the silence of Movses Poghosyan, the light of Armen Harutyunyan « Lorenc », the grace of Matevos Sargsyan, the bloom of Shahen Ordubekyan, the fragment of Artsrun Asatryan, the gold of Hayk Miqayelyan and the tale of Mher Chatinyan — one land, rendered in colour.",
      "culture.painters.saryan.word": "Sun",
      "culture.painters.saryan.alt": "Monumental landscape of Armenia: golden gorges, cypresses and a ring of women — Martiros Saryan, 1923",
      "culture.painters.minas.word": "Fire",
      "culture.painters.minas.alt": "Armenian village of domed houses in incandescent reds and oranges — Minas Avetisyan, 1971",
      "culture.painters.movses.word": "Silence",
      "culture.painters.movses.alt": "A mother embraces her sleeping child, stylised figures in sepia tones — Movses Poghosyan, 2021",
      "culture.painters.lorenc.word": "Light",
      "culture.painters.lorenc.alt": "Mountain valley pierced by rays of light, palette-knife painting — Armen Harutyunyan « Lorenc »",
      "culture.painters.matevos.word": "Grace",
      "culture.painters.matevos.alt": "Stylised long-faced woman with blue eyes, a colourful crown and a small bird — Matevos Sargsyan",
      "culture.painters.shahen.word": "Bloom",
      "culture.painters.shahen.alt": "Red tulips and wildflowers before a wooden fence, a multicoloured garden — Shahen Ordubekyan",
      "culture.painters.artsrun.word": "Fragment",
      "culture.painters.artsrun.alt": "Face in vivid facets, one eye rimmed in red and red lips, cubo-futurism — Artsrun Asatryan",
      "culture.painters.hayk.word": "Gold",
      "culture.painters.hayk.alt": "Woman in traditional Armenian headdress holding a pomegranate, warm tones and gold — Hayk Miqayelyan",
      "culture.painters.mher.word": "Tale",
      "culture.painters.mher.alt": "Woman in a red flowered headdress holding a rooster, a blue donkey at her side — Mher Chatinyan",
      "culture.painters.link": "Enter the gallery",

      "cuisine.label": "The&nbsp;table",
      "cuisine.eyebrow": "Cuisine",
      "cuisine.title": "The Armenian table, <em>generous and shared.</em>",
      "cuisine.sub": "A cuisine of transmission, where every dish tells a family.",
      "cuisine.dish1.alt": "Armenian manti: tiny ravioli topped with garlic yogurt",
      "cuisine.dish1.n": "No.&nbsp;01",
      "cuisine.dish1.name": "Manti",
      "cuisine.dish1.desc": "Tiny meat ravioli, topped with garlic yogurt.",
      "cuisine.dish2.alt": "Dolma: stuffed cabbage leaves, a traditional Armenian dish",
      "cuisine.dish2.n": "No.&nbsp;02",
      "cuisine.dish2.name": "Dolma",
      "cuisine.dish2.desc": "Cabbage or grape leaves stuffed and gently simmered.",

      "events.label": "Agenda",
      "events.eyebrow": "Upcoming events",
      "events.title": "The season's <em>agenda.</em>",
      "events.sub": "Armenian gatherings across the diaspora and Armenia — ordered by country, region and city.",
      "events.source": "Source:&nbsp;<a href=\"https://armenopole.com/ArmenianEvents\" target=\"_blank\" rel=\"noopener noreferrer\">armenopole.com</a>&nbsp;— snapshot dated 12&nbsp;June 2026.",

      "contact.label": "Correspondence",
      "contact.eyebrow": "Join us",
      "contact.title": "Let's get <em>in touch.</em>",
      "contact.sub": "A question, a wish to join, or to take part in community life?&nbsp;Write to us.",
      "contact.form.kicker": "Correspondence",
      "contact.form.lead": "The simplest way to reach us:&nbsp;<em>an email.</em> Tell us about yourself in a few words and we will get back to you.",
      "contact.form.cta": "Email contact@armeniensdelausanne.ch",
      "contact.form.hint": "The link opens your email app. You can also copy the address:&nbsp;<code>contact@armeniensdelausanne.ch</code>",
      "contact.info.kicker": "Contact",
      "contact.info.title": "The editorial team",
      "contact.info.email.label": "Email",
      "contact.info.address.label": "Address",
      "contact.info.address.value": "Lausanne, Switzerland<br /><em>[to complete]</em>",
      "contact.info.social.label": "Social",
      "contact.info.social.value": "Facebook · Instagram<br /><em>[links to complete]</em>",
      "contact.info.note": "The contact details above are fields to be filled in by the association.",

      "footer.brand.name": "Armenians of Lausanne",
      "footer.brand.sub": "<em>Community chronicle — Vol.&nbsp;I, ongoing edition.</em>",
      "footer.nav.aria": "Footer links",
      "footer.nav.label": "Contents",
      "footer.nav.community": "Community",
      "footer.nav.history": "History",
      "footer.nav.culture": "Culture",
      "footer.nav.cuisine": "Cuisine",
      "footer.nav.agenda": "Agenda",
      "footer.nav.contact": "Contact",
      "footer.colophon.label": "Colophon",
      "footer.colophon.body": "Typeset in <em>Fraunces</em> and <em>Spectral</em>.<br />Palette:&nbsp;pomegranate, apricot, cobalt, parchment.<br />Static site, no tracking.",
      "footer.colophon.region": "French-speaking Switzerland",
      "footer.totop.aria": "Back to top",
      "footer.totop.text": "Top of page"
    },

    hy: {
      "doc.title": "Լոզանի հայերը — Համայնքային հանդես",
      "doc.description": "Լոզանի հայ համայնքը՝ պատմություն, մշակույթ, խոհանոց, հիշողություն և համայնքային կյանք։ Շարունակական հանդես՝ Ֆրանսախոս Շվեյցարիայից։",

      "nav.skip": "Անցնել հիմնական բովանդակությանը",
      "masthead.wordmark.word1": "Լոզանի",
      "masthead.wordmark.word2": "հայերը",
      "masthead.wordmark.aria": "Լոզանի հայերը, գլխավոր",
      "masthead.location": "Ֆրանսախոս Շվեյցարիա",
      "masthead.tagline.fr": "<em>Լոզանի հայ համայնքի շարունակական հանդեսը</em>",

      "lang.switcher.label": "Լեզու",

      "nav.aria.primary": "Հիմնական նավարկում",
      "nav.open": "Բացել մենյուն",
      "nav.close": "Փակել մենյուն",
      "nav.home": "Գլխավոր",
      "nav.community": "Համայնք",
      "nav.history": "Պատմություն",
      "nav.culture": "Մշակույթ",
      "nav.doudouk": "Դուդուկ",
      "nav.peintres": "Նկարիչներ",
      "nav.network": "Ցանց",
      "nav.cuisine": "Խոհանոց",
      "nav.agenda": "Օրակարգ",
      "nav.cta": "Միանալ մեզ",

      "hero.title.line1": "Լոզանի",
      "hero.title.line2": "հայերը",
      "hero.lead": "Պահպանել մեր արմատները, փոխանցել մեր մշակույթը և ապրել մեր հիշողությունը — <em>միասին՝ Ֆրանսախոս Շվեյցարիայի սրտում։</em>",
      "hero.cta1": "Կարդալ հանդեսը",
      "hero.cta2": "Միանալ համայնքին",
      "hero.toc.label": "Բովանդակություն",
      "hero.toc.community": "Համայնք",
      "hero.toc.history": "Պատմություն&nbsp;և&nbsp;ժառանգություն",
      "hero.toc.culture": "Մշակույթ&nbsp;և&nbsp;արվեստ",
      "hero.toc.cuisine": "Սեղանը",
      "hero.toc.agenda": "Օրակարգ",
      "hero.image.alt": "Զվարթնոցի տաճարի ավերակները՝ ձյունածածկ Արարատ լեռան ֆոնին, հայկական բնանկար։",
      "hero.frontispiece.label": "Շապիկ",
      "hero.frontispiece.body": "<em>Զվարթնոցի ավերակներն Արարատի դիմաց</em>՝ մնայուն հիշողության խորհրդանիշը։",

      "community.label": "Համայնք",
      "community.eyebrow": "Ով ենք մենք",
      "community.title": "Կենդանի համայնք <em>Վոյի կանտոնում։</em>",
      "community.lead": "Լոզանի հայ համայնքը միավորում է հազարամյա պատմությանն ու մշակույթին նվիրված ընտանիքների և անհատների, որոնք սերնդեսերունդ կենդանի են պահում այն՝ հայրենիքից հեռու։ Գաղթի ու հարատևության երկար պատմությունից ծնված Ֆրանսախոս Շվեյցարիայի հայ սփյուռքն այսօր լիարժեքորեն ներգրավված է տեղական կյանքին՝ պահպանելով իր ինքնատիպությունը։",
      "community.p2": "Մեր ընկերակցության կոչումն է միավորել, լեզուն ու ավանդույթները փոխանցել երիտասարդներին, պահպանել հիշողությունը և հյուսել համերաշխության կապեր՝ հայերի միջև և բոլոր նրանց հետ, ովքեր ցանկանում են ճանաչել այս մշակույթը։",
      "community.pillars.label": "Մեր չորս ուխտերը",
      "community.pillar1.title": "Փոխանցել",
      "community.pillar1.desc": "Լեզու, երաժշտություն, պար և արհեստներ՝ վստահված նոր սերունդներին։",
      "community.pillar2.title": "Միավորել",
      "community.pillar2.desc": "Կանոնավոր հանդիպումներ, տոներ և կիսելու պահեր։",
      "community.pillar3.title": "Հիշել",
      "community.pillar3.desc": "Հարգել հիշողությունը և ճանաչելի դարձնել հայոց պատմությունը։",
      "community.pillar4.title": "Ընդունել",
      "community.pillar4.desc": "Բաց դռներ Հայաստանով հետաքրքրված ամեն մեկի համար։",

      "history.label": "Պատմություն",
      "history.eyebrow": "Պատմություն և ժառանգություն",
      "history.title": "Հնագույն քաղաքակրթություններից մեկի <em>ակունքներում։</em>",
      "history.sub": "Արարատ լեռնից մինչև քարե վանքերը՝ ավելի քան երեք հազարամյա ժառանգություն։",
      "history.feature.alt": "«Նոյի իջնելը Արարատից», Հովհաննես Այվազովսկու նկար",
      "history.feature.caption": "Հովհաննես Այվազովսկի՝ <em>Նոյի իջնելը Արարատից</em>",
      "history.feature.title": "Արարատի օրրանը",
      "history.feature.body": "Արարատ լեռը, ուր ավանդույթը զետեղում է Նոյյան տապանը, իշխում է հայի երևակայության մեջ։ 301 թվականին քրիստոնեությունը որպես պետական կրոն ընդունած առաջին ազգը՝ Հայաստանը կերտել է իր հավատին, եկեղեցիներին ու քարակերտ խաչքարերին անքակտելիորեն կապված ինքնություն։",
      "history.feature.pull": "<em>«Մենք մեր լեռներն ենք»։</em>",
      "history.timeline.label": "Ժամանակագրություն",
      "history.timeline.301": "Հայաստանն ընդունում է քրիստոնեությունը որպես պետական կրոն՝ համաշխարհային առաջին անգամ։",
      "history.timeline.405": "Մեսրոպ Մաշտոցը ստեղծում է հայոց այբուբենը՝ գրավոր մշակույթի հիմնասյունը։",
      "history.timeline.1915": "Հայոց ցեղասպանությունը. աքսորը ձևավորում է համաշխարհային սփյուռքը՝ մինչև Շվեյցարիա։",
      "history.timeline.1991": "Հայաստանը վերականգնում է իր անկախությունը։",
      "history.gallery.alt1": "Հելլենիստական Գառնիի տաճարը՝ կիրճի վրա, Հայաստանում",
      "history.gallery.cap1": "Գառնիի տաճարը՝ <em>հելլենիստական ժառանգություն</em>",
      "history.gallery.alt2": "Էջմիածնի մայր տաճարը՝ Հայ առաքելական եկեղեցու օրրանը",
      "history.gallery.cap2": "Հայկական սրբազան ճարտարապետությունը",
      "history.gallery.alt3": "«Մենք մեր լեռներն ենք» հուշարձանը՝ տուֆից կերտված հուշակոթող",
      "history.gallery.cap3": "<em>«Մենք մեր լեռներն ենք»</em>՝ ինքնության խորհրդանիշ",

      "culture.label": "Մշակույթ և արվեստ",
      "culture.eyebrow": "Մշակույթ և արվեստ",
      "culture.title": "Մշակույթ, որ <em>երգում է,</em> պարում <em>և</em> նկարում։",
      "culture.sub": "Լեզուն, դուդուկի երաժշտությունը, պարը և բոցավառ գեղանկարչությունը։",
      "culture.feature.alt": "Հայ պարողներ ավանդական տարազներով՝ տոնակատարության ընթացքում",
      "culture.feature.caption": "Ավանդական պարը՝ <em>սերնդեսերունդ փոխանցվող</em>",
      "culture.feature.title": "Շարժուն և երգ",
      "culture.feature.body": "Շուրջպարերը, ասեղնագործ տարազները և դուդուկի կարոտաբեր ձայնը՝ ՅՈՒՆԵՍԿՕ-ի ցանկում ընդգրկված ծիրանի փայտից սրինգը՝ ուղեկցում են ամեն մեծ առիթ։ Հայերենը՝ իր ինքնատիպ այբուբենով, մնում է այս փոխանցման կարմիր թելը։",
      "culture.feature.pull": "<em>Դուդուկը լալիս է այն, ինչ բառերը լռում են։</em>",
      "culture.doudouk.link": "Ծիրանի փայտի շունչը",
      "culture.dance.kicker": "Սովորել պարը",
      "culture.dance.title": "Հայկական պարի դասընթացներ",
      "culture.dance.org": "Լոզանի հայկական դպրոցի <strong>ARARAT</strong> ընկերակցությունը և <strong>MARGARIT</strong> պարախումբը",
      "culture.dance.lead": "Լոզանում եզակի նախագիծ՝ բաց բոլորի համար, հազարամյա մշակութային ժառանգության շուրջ։",
      "culture.dance.where": "Որտեղ գտնել մեզ",
      "culture.dance.slot1.day": "Կիրակի · 9:00 – 10:00",
      "culture.dance.slot1.place": "Studio 2 — Rue du Valentin 35, 1004 Lausanne",
      "culture.dance.slot2.day": "Երեքշաբթի · 18:00 – 19:00",
      "culture.dance.slot2.place": "Maison de quartier des Faverges — ch. de Bonne-Espérance 30, 1006 Lausanne",
      "culture.dance.frieze": "Շարժման մեջ",
      "culture.dance.cap1": "Շուրջպարի թափը",
      "culture.dance.cap2": "Քայլը՝ փոխանցված",
      "culture.dance.cap3": "Միացած ձեռքեր",
      "culture.dance.cap4": "Կիսված ուրախություն",
      "culture.dance.alt1": "Հայկական շուրջպար, ընդհանուր շարժում",
      "culture.dance.alt2": "Հայկական ավանդական պարի քայլ",
      "culture.dance.alt3": "Ձեռք ձեռքի բռնած պարողներ՝ շուրջպար կազմելով",
      "culture.dance.alt4": "Տոնական պահ հայկական պարի շուրջ",
      "culture.painters.kicker": "Գեղանկարի պատկերասրահ",
      "culture.painters.title": "Ինը նկարիչ՝ <em>ինը հայացք</em>",
      "culture.painters.lead": "Մարտիրոս Սարյանի արևը, Մինաս Ավետիսյանի կրակը, Մովսես Պողոսյանի լռությունը, Արմեն Հարությունյան «Լորենց»-ի լույսը, Մատևոս Սարգսյանի շնորհը, Շահեն Օրդուբեկյանի ծաղկումը, Արծրուն Ասատրյանի բեկորը, Հայկ Միքայելյանի ոսկին և Մհեր Չատինյանի հեքիաթը — մեկ հող՝ թարգմանված գույնով։",
      "culture.painters.saryan.word": "Արևը",
      "culture.painters.saryan.alt": "Հայաստանի վիթխարի բնանկար՝ ոսկեգույն կիրճեր, նոճիներ և կանանց պար — Մարտիրոս Սարյան, 1923",
      "culture.painters.minas.word": "Կրակը",
      "culture.painters.minas.alt": "Հայկական գյուղ՝ կաթնագմբեթ տներով, բոցավառ կարմիր ու նարնջագույն — Մինաս Ավետիսյան, 1971",
      "culture.painters.movses.word": "Լռությունը",
      "culture.painters.movses.alt": "Մայրը գրկում է իր քնած երեխային, ոճավորված կերպարներ՝ սեպիա երանգներով — Մովսես Պողոսյան, 2021",
      "culture.painters.lorenc.word": "Լույսը",
      "culture.painters.lorenc.alt": "Լեռնային հովիտ՝ լույսի շողերով, դանակով արված նկար — Արմեն Հարությունյան «Լորենց»",
      "culture.painters.matevos.word": "Շնորհը",
      "culture.painters.matevos.alt": "Ոճավորված երկարադեմ կին՝ կապույտ աչքերով, գունավոր պսակով և փոքրիկ թռչունով — Մատևոս Սարգսյան",
      "culture.painters.shahen.word": "Ծաղկումը",
      "culture.painters.shahen.alt": "Կարմիր կակաչներ և վայրի ծաղիկներ փայտե ցանկապատի առջև, բազմագույն այգի — Շահեն Օրդուբեկյան",
      "culture.painters.artsrun.word": "Բեկորը",
      "culture.painters.artsrun.alt": "Վառ նիստերով դեմք՝ կարմիրով եզերված աչքով և կարմիր շուրթերով, կուբո-ֆուտուրիզմ — Արծրուն Ասատրյան",
      "culture.painters.hayk.word": "Ոսկին",
      "culture.painters.hayk.alt": "Ավանդական հայկական գլխազարդով կին՝ նուռ բռնած, տաք երանգներ և ոսկի — Հայկ Միքայելյան",
      "culture.painters.mher.word": "Հեքիաթը",
      "culture.painters.mher.alt": "Կարմիր ծաղկավոր գլխազարդով կին՝ աքլոր բռնած, կողքին՝ կապույտ էշ — Մհեր Չատինյան",
      "culture.painters.link": "Մտնել պատկերասրահ",

      "cuisine.label": "Սեղանը",
      "cuisine.eyebrow": "Խոհանոց",
      "cuisine.title": "Հայկական սեղանը՝ <em>առատաձեռն և համահավաք։</em>",
      "cuisine.sub": "Փոխանցման խոհանոց, ուր ամեն ուտեստ պատմում է մի ընտանիք։",
      "cuisine.dish1.alt": "Հայկական մանթի՝ սխտորով մածնի մեջ մանր պելմեններ",
      "cuisine.dish1.n": "Հմր&nbsp;01",
      "cuisine.dish1.name": "Մանթի",
      "cuisine.dish1.desc": "Մսով մանր պելմեններ՝ սխտորով մածնի մեջ։",
      "cuisine.dish2.alt": "Տոլմա՝ լցոնված կաղամբի տերևներ, ավանդական հայկական ճաշատեսակ",
      "cuisine.dish2.n": "Հմր&nbsp;02",
      "cuisine.dish2.name": "Տոլմա",
      "cuisine.dish2.desc": "Կաղամբի կամ խաղողի լցոնված տերևներ՝ խնամքով եփված։",

      "events.label": "Օրակարգ",
      "events.eyebrow": "Առաջիկա միջոցառումներ",
      "events.title": "Եղանակի <em>օրակարգը։</em>",
      "events.sub": "Հայկական միջոցառումներ սփյուռքում և Հայաստանում՝ դասավորված ըստ երկրի, շրջանի և քաղաքի։",
      "events.source": "Աղբյուր՝&nbsp;<a href=\"https://armenopole.com/ArmenianEvents\" target=\"_blank\" rel=\"noopener noreferrer\">armenopole.com</a>&nbsp;— 2026 թ. հունիսի 12-ի դրությամբ։",

      "contact.label": "Նամակագրություն",
      "contact.eyebrow": "Միանալ մեզ",
      "contact.title": "Կապ <em>հաստատենք։</em>",
      "contact.sub": "Հարց ունե՞ք, ցանկանու՞մ եք միանալ կամ մասնակցել համայնքի կյանքին։&nbsp;Գրե՛ք մեզ։",
      "contact.form.kicker": "Նամակագրություն",
      "contact.form.lead": "Մեզ հետ կապվելու ամենահեշտ ճանապարհը՝&nbsp;<em>էլեկտրոնային նամակ։</em> Մի քանի բառով ներկայացեք մեզ, և մենք կպատասխանենք ձեզ։",
      "contact.form.cta": "Գրել contact@armeniensdelausanne.ch հասցեին",
      "contact.form.hint": "Հղումը կբացի ձեր փոստի հավելվածը։ Կարող եք նաև պատճենել հասցեն՝&nbsp;<code>contact@armeniensdelausanne.ch</code>",
      "contact.info.kicker": "Կոնտակտներ",
      "contact.info.title": "Խմբագրությունը",
      "contact.info.email.label": "Էլ. փոստ",
      "contact.info.address.label": "Հասցե",
      "contact.info.address.value": "Լոզան, Շվեյցարիա<br /><em>[լրացնելու]</em>",
      "contact.info.social.label": "Սոցցանցեր",
      "contact.info.social.value": "Facebook · Instagram<br /><em>[հղումները՝ լրացնելու]</em>",
      "contact.info.note": "Վերը նշված կոնտակտները ընկերակցության կողմից լրացնելու դաշտեր են։",

      "footer.brand.name": "Լոզանի հայերը",
      "footer.brand.sub": "<em>Համայնքային հանդես՝ հատոր&nbsp;Ա, շարունակական թողարկում։</em>",
      "footer.nav.aria": "Ստորին հղումներ",
      "footer.nav.label": "Բովանդակություն",
      "footer.nav.community": "Համայնք",
      "footer.nav.history": "Պատմություն",
      "footer.nav.culture": "Մշակույթ",
      "footer.nav.cuisine": "Խոհանոց",
      "footer.nav.agenda": "Օրակարգ",
      "footer.nav.contact": "Կապ",
      "footer.colophon.label": "Կոլոֆոն",
      "footer.colophon.body": "Շարադրված է <em>Fraunces</em> և <em>Spectral</em> տառատեսակներով։<br />Գունապնակ՝&nbsp;նուռ, ծիրան, կոբալտ, մագաղաթ։<br />Ստատիկ կայք՝ առանց հետևումի։",
      "footer.colophon.region": "Ֆրանսախոս Շվեյցարիա",
      "footer.totop.aria": "Վերև",
      "footer.totop.text": "Վերև"
    }
  };

  /* -------------------------------------------------------------------------
     Resolution + application
     ------------------------------------------------------------------------- */
  function t(lang, key) {
    var lDict = dict[lang];
    if (lDict && lDict[key] !== undefined) return lDict[key];
    var fallback = dict[DEFAULT_LANG];
    if (fallback && fallback[key] !== undefined) return fallback[key];
    return key;
  }

  function getInitialLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("lang");
      if (q && SUPPORTED.indexOf(q) !== -1) return q;
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) { /* private mode / no storage */ }
    return DEFAULT_LANG;
  }

  var ATTR_MAP = {
    "data-i18n-alt": "alt",
    "data-i18n-aria-label": "aria-label",
    "data-i18n-title": "title"
  };

  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;

    // <html lang>
    document.documentElement.setAttribute("lang", lang);

    // text/html nodes
    var nodes = document.querySelectorAll("[data-i18n]");
    Array.prototype.forEach.call(nodes, function (el) {
      el.innerHTML = t(lang, el.getAttribute("data-i18n"));
    });

    // attribute nodes
    Object.keys(ATTR_MAP).forEach(function (dataAttr) {
      var realAttr = ATTR_MAP[dataAttr];
      var matches = document.querySelectorAll("[" + dataAttr + "]");
      Array.prototype.forEach.call(matches, function (el) {
        el.setAttribute(realAttr, t(lang, el.getAttribute(dataAttr)));
      });
    });

    // document title + meta description
    document.title = t(lang, "doc.title");
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t(lang, "doc.description"));

    // active language pill
    var langButtons = document.querySelectorAll(".lang-switcher [data-lang]");
    Array.prototype.forEach.call(langButtons, function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-current", isActive ? "true" : "false");
      btn.classList.toggle("is-active", isActive);
    });

    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    // let other scripts (main.js) react if needed
    try {
      document.dispatchEvent(new CustomEvent("i18n:applied", { detail: { lang: lang } }));
    } catch (e) {
      // older IE fallback — not strictly needed for modern browsers
      var evt = document.createEvent("Event");
      evt.initEvent("i18n:applied", true, true);
      document.dispatchEvent(evt);
    }
  }

  function init() {
    var lang = getInitialLang();
    apply(lang);

    var switcher = document.querySelector(".lang-switcher");
    if (switcher) {
      switcher.addEventListener("click", function (e) {
        var btn = e.target.closest && e.target.closest("[data-lang]");
        if (!btn) return;
        var nextLang = btn.getAttribute("data-lang");
        if (SUPPORTED.indexOf(nextLang) === -1) return;
        apply(nextLang);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Public surface for main.js (nav toggle aria-label) */
  window.ALI18n = {
    t: function (key) {
      var lang = document.documentElement.getAttribute("lang") || DEFAULT_LANG;
      if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
      return t(lang, key);
    },
    apply: apply,
    SUPPORTED: SUPPORTED
  };
})();

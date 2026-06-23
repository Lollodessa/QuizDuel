import { Question, Topic } from '../types';

const allQuestions: Question[] = [
  // ─── TEST vero/falso — RIMUOVERE dopo il collaudo ─────────────────────
  {
    id: 'test_tf_01', topic: 'Cinema',
    difficulty: 'medium',
    type: 'truefalse',
    text: {
      en: 'James Cameron directed "Titanic" (1997).',
      it: 'James Cameron ha diretto "Titanic" (1997).',
      fr: 'James Cameron a réalisé "Titanic" (1997).',
      es: 'James Cameron dirigió "Titanic" (1997).',
    },
    options: {
      en: ['True',       'False'],
      it: ['Vero',       'Falso'],
      fr: ['Vrai',       'Faux'],
      es: ['Verdadero',  'Falso'],
    },
    correctIndex: 0,
  },
  // ─── CINEMA ───────────────────────────────────────────────────────────
  {
    id: 'cin_01', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'Which film won the very first Academy Award for Best Picture?',
      it: 'Quale film vinse il primo Oscar come Miglior Film?',
      fr: 'Quel film a remporté le tout premier Oscar du meilleur film ?',
      es: '¿Qué película ganó el primer Óscar a la Mejor Película?',
    },
    options: {
      en: ['Wings', 'The Jazz Singer', 'Sunrise', 'Chang'],
      it: ['Wings', 'The Jazz Singer', 'Sunrise', 'Chang'],
      fr: ['Wings', 'The Jazz Singer', 'Sunrise', 'Chang'],
      es: ['Wings', 'The Jazz Singer', 'Sunrise', 'Chang'],
    },
    correctIndex: 0,
  },
  {
    id: 'cin_02', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: "Who directed \"Schindler's List\" (1993)?",
      it: "Chi ha diretto 'Schindler's List' (1993)?",
      fr: "Qui a réalisé 'La Liste de Schindler' (1993) ?",
      es: "¿Quién dirigió 'La Lista de Schindler' (1993)?",
    },
    options: {
      en: ['Martin Scorsese', 'Francis Ford Coppola', 'Steven Spielberg', 'Stanley Kubrick'],
      it: ['Martin Scorsese', 'Francis Ford Coppola', 'Steven Spielberg', 'Stanley Kubrick'],
      fr: ['Martin Scorsese', 'Francis Ford Coppola', 'Steven Spielberg', 'Stanley Kubrick'],
      es: ['Martin Scorsese', 'Francis Ford Coppola', 'Steven Spielberg', 'Stanley Kubrick'],
    },
    correctIndex: 2,
  },
  {
    id: 'cin_03', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'In which year was "The Godfather" released?',
      it: "In quale anno è uscito 'Il Padrino'?",
      fr: "En quelle année est sorti 'Le Parrain' ?",
      es: "¿En qué año se estrenó 'El Padrino'?",
    },
    options: {
      en: ['1970', '1971', '1972', '1973'],
      it: ['1970', '1971', '1972', '1973'],
      fr: ['1970', '1971', '1972', '1973'],
      es: ['1970', '1971', '1972', '1973'],
    },
    correctIndex: 2,
  },
  {
    id: 'cin_04', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'Which actor played Iron Man in the Marvel Cinematic Universe?',
      it: 'Quale attore ha interpretato Iron Man nel Marvel Cinematic Universe?',
      fr: 'Quel acteur a joué Iron Man dans le MCU ?',
      es: '¿Qué actor interpretó a Iron Man en el MCU?',
    },
    options: {
      en: ['Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo'],
      it: ['Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo'],
      fr: ['Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo'],
      es: ['Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo'],
    },
    correctIndex: 2,
  },
  {
    id: 'cin_05', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'What is the highest-grossing film of all time (nominal box office)?',
      it: "Qual è il film con il maggiore incasso di tutti i tempi (nominale)?",
      fr: 'Quel est le film ayant réalisé les plus gros revenus de tous les temps (en valeur nominale) ?',
      es: '¿Cuál es la película más taquillera de todos los tiempos (ingresos nominales)?',
    },
    options: {
      en: ['Titanic', 'Avengers: Endgame', 'Avatar', 'Star Wars: The Force Awakens'],
      it: ['Titanic', 'Avengers: Endgame', 'Avatar', 'Star Wars: Il Risveglio della Forza'],
      fr: ['Titanic', 'Avengers: Endgame', 'Avatar', 'Star Wars: Le Réveil de la Force'],
      es: ['Titanic', 'Avengers: Endgame', 'Avatar', 'Star Wars: El Despertar de la Fuerza'],
    },
    correctIndex: 2,
  },
  {
    id: 'cin_06', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'Who played Jack Dawson in "Titanic" (1997)?',
      it: "Chi ha interpretato Jack Dawson in 'Titanic' (1997)?",
      fr: "Qui a joué Jack Dawson dans 'Titanic' (1997) ?",
      es: "¿Quién interpretó a Jack Dawson en 'Titanic' (1997)?",
    },
    options: {
      en: ['Brad Pitt', 'Tom Hanks', 'Johnny Depp', 'Leonardo DiCaprio'],
      it: ['Brad Pitt', 'Tom Hanks', 'Johnny Depp', 'Leonardo DiCaprio'],
      fr: ['Brad Pitt', 'Tom Hanks', 'Johnny Depp', 'Leonardo DiCaprio'],
      es: ['Brad Pitt', 'Tom Hanks', 'Johnny Depp', 'Leonardo DiCaprio'],
    },
    correctIndex: 3,
  },
  {
    id: 'cin_07', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'Which film features the iconic line "I\'ll be back"?',
      it: "In quale film compare la celebre frase 'I'll be back'?",
      fr: "Dans quel film apparaît la réplique emblématique 'I'll be back' ?",
      es: "¿En qué película aparece la icónica frase 'I'll be back'?",
    },
    options: {
      en: ['RoboCop', 'The Terminator', 'Predator', 'Total Recall'],
      it: ['RoboCop', 'Terminator', 'Predator', 'Atto di Forza'],
      fr: ['RoboCop', 'Terminator', 'Predator', 'Total Recall'],
      es: ['RoboCop', 'Terminator', 'Predator', 'El Vengador del Futuro'],
    },
    correctIndex: 1,
  },
  {
    id: 'cin_08', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'Christopher Nolan directed which of these films?',
      it: 'Christopher Nolan ha diretto quale di questi film?',
      fr: 'Christopher Nolan a réalisé lequel de ces films ?',
      es: '¿Cuál de estas películas dirigió Christopher Nolan?',
    },
    options: {
      en: ['Gravity', 'Inception', 'Ex Machina', 'The Martian'],
      it: ['Gravity', 'Inception', 'Ex Machina', 'The Martian'],
      fr: ['Gravity', 'Inception', 'Ex Machina', 'Seul sur Mars'],
      es: ['Gravity', 'El Origen', 'Ex Machina', 'Marte (The Martian)'],
    },
    correctIndex: 1,
  },
  {
    id: 'cin_09', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'Which animated film features the song "Let It Go"?',
      it: "Quale film d'animazione contiene la canzone 'Let It Go'?",
      fr: "Quel film d'animation contient la chanson 'Let It Go' ?",
      es: "¿Qué película de animación incluye la canción 'Let It Go'?",
    },
    options: {
      en: ['Tangled', 'Brave', 'Frozen', 'Moana'],
      it: ['Rapunzel', 'Ribelle', 'Frozen', 'Oceania'],
      fr: ['Raiponce', 'Rebelle', 'La Reine des neiges', 'Vaiana'],
      es: ['Enredados', 'Valiente', 'Frozen', 'Vaiana'],
    },
    correctIndex: 2,
  },
  {
    id: 'cin_10', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'In "The Matrix", which pill does Neo choose?',
      it: "In 'Matrix', quale pillola sceglie Neo?",
      fr: "Dans 'Matrix', quelle pilule Neo choisit-il ?",
      es: "En 'Matrix', ¿qué pastilla elige Neo?",
    },
    options: {
      en: ['Blue pill', 'Red pill', 'Green pill', 'Yellow pill'],
      it: ['Pillola blu', 'Pillola rossa', 'Pillola verde', 'Pillola gialla'],
      fr: ['Pilule bleue', 'Pilule rouge', 'Pilule verte', 'Pilule jaune'],
      es: ['Pastilla azul', 'Pastilla roja', 'Pastilla verde', 'Pastilla amarilla'],
    },
    correctIndex: 1,
  },
  {
    id: 'cin_11', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'Who directed "Pulp Fiction" and "Kill Bill"?',
      it: "Chi ha diretto 'Pulp Fiction' e 'Kill Bill'?",
      fr: "Qui a réalisé 'Pulp Fiction' et 'Kill Bill' ?",
      es: "¿Quién dirigió 'Pulp Fiction' y 'Kill Bill'?",
    },
    options: {
      en: ['David Fincher', 'Quentin Tarantino', 'Joel Coen', 'Oliver Stone'],
      it: ['David Fincher', 'Quentin Tarantino', 'Joel Coen', 'Oliver Stone'],
      fr: ['David Fincher', 'Quentin Tarantino', 'Joel Coen', 'Oliver Stone'],
      es: ['David Fincher', 'Quentin Tarantino', 'Joel Coen', 'Oliver Stone'],
    },
    correctIndex: 1,
  },
  {
    id: 'cin_12', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'Who played the Joker in "The Dark Knight" (2008)?',
      it: "Chi ha interpretato il Joker in 'Il Cavaliere Oscuro' (2008)?",
      fr: "Qui a joué le Joker dans 'The Dark Knight' (2008) ?",
      es: "¿Quién interpretó al Joker en 'El Caballero Oscuro' (2008)?",
    },
    options: {
      en: ['Jared Leto', 'Joaquin Phoenix', 'Heath Ledger', 'Jack Nicholson'],
      it: ['Jared Leto', 'Joaquin Phoenix', 'Heath Ledger', 'Jack Nicholson'],
      fr: ['Jared Leto', 'Joaquin Phoenix', 'Heath Ledger', 'Jack Nicholson'],
      es: ['Jared Leto', 'Joaquin Phoenix', 'Heath Ledger', 'Jack Nicholson'],
    },
    correctIndex: 2,
  },
  {
    id: 'cin_13', topic: 'Cinema',
    difficulty: 'medium',
    text: {
      en: 'Which studio produced "Toy Story" (1995)?',
      it: "Quale studio ha prodotto 'Toy Story' (1995)?",
      fr: "Quel studio a produit 'Toy Story' (1995) ?",
      es: "¿Qué estudio produjo 'Toy Story' (1995)?",
    },
    options: {
      en: ['DreamWorks', 'Warner Bros.', 'Pixar', 'Universal'],
      it: ['DreamWorks', 'Warner Bros.', 'Pixar', 'Universal'],
      fr: ['DreamWorks', 'Warner Bros.', 'Pixar', 'Universal'],
      es: ['DreamWorks', 'Warner Bros.', 'Pixar', 'Universal'],
    },
    correctIndex: 2,
  },

  // ─── SPORT ────────────────────────────────────────────────────────────
  {
    id: 'spt_01', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'Which country won the 2022 FIFA World Cup in Qatar?',
      it: 'Quale paese ha vinto i Mondiali FIFA 2022 in Qatar?',
      fr: 'Quel pays a remporté la Coupe du Monde FIFA 2022 au Qatar ?',
      es: '¿Qué país ganó la Copa del Mundo FIFA 2022 en Qatar?',
    },
    options: {
      en: ['Brazil', 'France', 'Argentina', 'Germany'],
      it: ['Brasile', 'Francia', 'Argentina', 'Germania'],
      fr: ['Brésil', 'France', 'Argentine', 'Allemagne'],
      es: ['Brasil', 'Francia', 'Argentina', 'Alemania'],
    },
    correctIndex: 2,
  },
  {
    id: 'spt_02', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'How many players from each team are on a basketball court at once?',
      it: 'Quanti giocatori per squadra ci sono contemporaneamente su un campo da basket?',
      fr: 'Combien de joueurs par équipe sont sur le terrain de basketball à la fois ?',
      es: '¿Cuántos jugadores por equipo hay simultáneamente en una cancha de baloncesto?',
    },
    options: {
      en: ['4', '5', '6', '7'],
      it: ['4', '5', '6', '7'],
      fr: ['4', '5', '6', '7'],
      es: ['4', '5', '6', '7'],
    },
    correctIndex: 1,
  },
  {
    id: 'spt_03', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'What is the maximum score achievable in a single bowling frame?',
      it: 'Qual è il punteggio massimo ottenibile in un singolo frame al bowling?',
      fr: 'Quel est le score maximum réalisable dans un seul frame au bowling ?',
      es: '¿Cuál es la puntuación máxima en un solo turno de bowling?',
    },
    options: {
      en: ['10', '20', '30', '25'],
      it: ['10', '20', '30', '25'],
      fr: ['10', '20', '30', '25'],
      es: ['10', '20', '30', '25'],
    },
    correctIndex: 2,
  },
  {
    id: 'spt_04', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'How many Grand Slam titles did Rafael Nadal win in his career?',
      it: 'Quanti titoli del Grande Slam ha vinto Rafael Nadal in carriera?',
      fr: 'Combien de titres du Grand Chelem Rafael Nadal a-t-il remportés dans sa carrière ?',
      es: '¿Cuántos títulos de Grand Slam ganó Rafael Nadal en su carrera?',
    },
    options: {
      en: ['20', '21', '22', '23'],
      it: ['20', '21', '22', '23'],
      fr: ['20', '21', '22', '23'],
      es: ['20', '21', '22', '23'],
    },
    correctIndex: 2,
  },
  {
    id: 'spt_05', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'In which city were the 2016 Summer Olympics held?',
      it: 'In quale città si sono svolte le Olimpiadi estive del 2016?',
      fr: "Dans quelle ville se sont déroulés les Jeux olympiques d'été 2016 ?",
      es: '¿En qué ciudad se celebraron los Juegos Olímpicos de Verano 2016?',
    },
    options: {
      en: ['London', 'Beijing', 'Rio de Janeiro', 'Tokyo'],
      it: ['Londra', 'Pechino', 'Rio de Janeiro', 'Tokyo'],
      fr: ['Londres', 'Pékin', 'Rio de Janeiro', 'Tokyo'],
      es: ['Londres', 'Pekín', 'Río de Janeiro', 'Tokio'],
    },
    correctIndex: 2,
  },
  {
    id: 'spt_06', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'Which Formula 1 driver holds the record for most World Championship titles?',
      it: 'Quale pilota di Formula 1 detiene il record di titoli mondiali?',
      fr: 'Quel pilote de Formule 1 détient le record du plus grand nombre de titres de champion du monde ?',
      es: '¿Qué piloto de Fórmula 1 tiene el récord de más títulos mundiales?',
    },
    options: {
      en: ['Ayrton Senna', 'Michael Schumacher', 'Lewis Hamilton', 'Sebastian Vettel'],
      it: ['Ayrton Senna', 'Michael Schumacher', 'Lewis Hamilton', 'Sebastian Vettel'],
      fr: ['Ayrton Senna', 'Michael Schumacher', 'Lewis Hamilton', 'Sebastian Vettel'],
      es: ['Ayrton Senna', 'Michael Schumacher', 'Lewis Hamilton', 'Sebastian Vettel'],
    },
    correctIndex: 2,
  },
  {
    id: 'spt_07', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'What is the official distance of a marathon race?',
      it: "Qual è la distanza ufficiale di una maratona?",
      fr: "Quelle est la distance officielle d'un marathon ?",
      es: "¿Cuál es la distancia oficial de una maratón?",
    },
    options: {
      en: ['40 km', '42.195 km', '40.195 km', '44 km'],
      it: ['40 km', '42,195 km', '40,195 km', '44 km'],
      fr: ['40 km', '42,195 km', '40,195 km', '44 km'],
      es: ['40 km', '42,195 km', '40,195 km', '44 km'],
    },
    correctIndex: 1,
  },
  {
    id: 'spt_08', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'In which sport is the Davis Cup awarded?',
      it: 'In quale sport viene assegnata la Coppa Davis?',
      fr: 'Dans quel sport la Coupe Davis est-elle décernée ?',
      es: '¿En qué deporte se otorga la Copa Davis?',
    },
    options: {
      en: ['Golf', 'Squash', 'Badminton', 'Tennis'],
      it: ['Golf', 'Squash', 'Badminton', 'Tennis'],
      fr: ['Golf', 'Squash', 'Badminton', 'Tennis'],
      es: ['Golf', 'Squash', 'Bádminton', 'Tenis'],
    },
    correctIndex: 3,
  },
  {
    id: 'spt_09', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'How many rings are on the Olympic flag?',
      it: 'Quanti anelli ci sono sulla bandiera olimpica?',
      fr: 'Combien y a-t-il de cercles sur le drapeau olympique ?',
      es: '¿Cuántos aros hay en la bandera olímpica?',
    },
    options: {
      en: ['4', '5', '6', '7'],
      it: ['4', '5', '6', '7'],
      fr: ['4', '5', '6', '7'],
      es: ['4', '5', '6', '7'],
    },
    correctIndex: 1,
  },
  {
    id: 'spt_10', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'Which NBA team has won the most championships?',
      it: 'Quale squadra NBA ha vinto più campionati?',
      fr: "Quelle équipe NBA a remporté le plus de championnats ?",
      es: '¿Qué equipo de la NBA ha ganado más campeonatos?',
    },
    options: {
      en: ['Los Angeles Lakers', 'Boston Celtics', 'Chicago Bulls', 'Golden State Warriors'],
      it: ['Los Angeles Lakers', 'Boston Celtics', 'Chicago Bulls', 'Golden State Warriors'],
      fr: ['Los Angeles Lakers', 'Boston Celtics', 'Chicago Bulls', 'Golden State Warriors'],
      es: ['Los Angeles Lakers', 'Boston Celtics', 'Chicago Bulls', 'Golden State Warriors'],
    },
    correctIndex: 1,
  },
  {
    id: 'spt_11', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'In soccer, how many players per team are on the field during normal play?',
      it: 'Nel calcio, quanti giocatori per squadra ci sono in campo?',
      fr: 'Au football, combien de joueurs par équipe sont sur le terrain ?',
      es: 'En fútbol, ¿cuántos jugadores por equipo hay en el campo?',
    },
    options: {
      en: ['10', '11', '12', '9'],
      it: ['10', '11', '12', '9'],
      fr: ['10', '11', '12', '9'],
      es: ['10', '11', '12', '9'],
    },
    correctIndex: 1,
  },
  {
    id: 'spt_12', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'In which sport would you perform a "slam dunk"?',
      it: 'In quale sport si esegue la schiacciata (slam dunk)?',
      fr: 'Dans quel sport réalise-t-on un "slam dunk" ?',
      es: '¿En qué deporte se realiza un "mate" (slam dunk)?',
    },
    options: {
      en: ['Volleyball', 'Tennis', 'Basketball', 'Handball'],
      it: ['Pallavolo', 'Tennis', 'Basket', 'Pallamano'],
      fr: ['Volleyball', 'Tennis', 'Basketball', 'Handball'],
      es: ['Voleibol', 'Tenis', 'Baloncesto', 'Balonmano'],
    },
    correctIndex: 2,
  },
  {
    id: 'spt_13', topic: 'Sport',
    difficulty: 'medium',
    text: {
      en: 'Who holds the world record for the 100m sprint?',
      it: 'Chi detiene il record mondiale dei 100 metri piani?',
      fr: 'Qui détient le record du monde du 100 m sprint ?',
      es: '¿Quién posee el récord mundial de los 100 metros lisos?',
    },
    options: {
      en: ['Tyson Gay', 'Yohan Blake', 'Usain Bolt', 'Justin Gatlin'],
      it: ['Tyson Gay', 'Yohan Blake', 'Usain Bolt', 'Justin Gatlin'],
      fr: ['Tyson Gay', 'Yohan Blake', 'Usain Bolt', 'Justin Gatlin'],
      es: ['Tyson Gay', 'Yohan Blake', 'Usain Bolt', 'Justin Gatlin'],
    },
    correctIndex: 2,
  },

  // ─── GEOGRAPHY ────────────────────────────────────────────────────────
  {
    id: 'geo_01', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: "What is the capital city of Australia?",
      it: "Qual è la capitale dell'Australia?",
      fr: "Quelle est la capitale de l'Australie ?",
      es: "¿Cuál es la capital de Australia?",
    },
    options: {
      en: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      it: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      fr: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      es: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    },
    correctIndex: 2,
  },
  {
    id: 'geo_02', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'Which is the longest river in the world?',
      it: 'Qual è il fiume più lungo del mondo?',
      fr: 'Quel est le fleuve le plus long du monde ?',
      es: '¿Cuál es el río más largo del mundo?',
    },
    options: {
      en: ['Amazon', 'Yangtze', 'Nile', 'Mississippi'],
      it: ['Rio delle Amazzoni', 'Yangtze', 'Nilo', 'Mississippi'],
      fr: ['Amazone', 'Yangtsé', 'Nil', 'Mississippi'],
      es: ['Amazonas', 'Yangtsé', 'Nilo', 'Misisipi'],
    },
    correctIndex: 2,
  },
  {
    id: 'geo_03', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'How many continents are there on Earth?',
      it: 'Quanti continenti ci sono sulla Terra?',
      fr: 'Combien y a-t-il de continents sur Terre ?',
      es: '¿Cuántos continentes hay en la Tierra?',
    },
    options: {
      en: ['5', '6', '7', '8'],
      it: ['5', '6', '7', '8'],
      fr: ['5', '6', '7', '8'],
      es: ['5', '6', '7', '8'],
    },
    correctIndex: 2,
  },
  {
    id: 'geo_04', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'Which country surpassed China to become the most populous in the world in 2023?',
      it: 'Quale paese ha superato la Cina diventando il più popoloso al mondo nel 2023?',
      fr: 'Quel pays a dépassé la Chine pour devenir le plus peuplé du monde en 2023 ?',
      es: '¿Qué país superó a China para convertirse en el más poblado del mundo en 2023?',
    },
    options: {
      en: ['USA', 'India', 'Indonesia', 'Pakistan'],
      it: ['USA', 'India', 'Indonesia', 'Pakistan'],
      fr: ['USA', 'Inde', 'Indonésie', 'Pakistan'],
      es: ['EE. UU.', 'India', 'Indonesia', 'Pakistán'],
    },
    correctIndex: 1,
  },
  {
    id: 'geo_05', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'What is the smallest country in the world by area?',
      it: "Qual è il paese più piccolo del mondo per estensione?",
      fr: 'Quel est le plus petit pays du monde par superficie ?',
      es: '¿Cuál es el país más pequeño del mundo por superficie?',
    },
    options: {
      en: ['Monaco', 'San Marino', 'Liechtenstein', 'Vatican City'],
      it: ['Monaco', 'San Marino', 'Liechtenstein', 'Città del Vaticano'],
      fr: ['Monaco', 'Saint-Marin', 'Liechtenstein', 'Vatican'],
      es: ['Mónaco', 'San Marino', 'Liechtenstein', 'Ciudad del Vaticano'],
    },
    correctIndex: 3,
  },
  {
    id: 'geo_06', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'Which is the largest ocean on Earth?',
      it: "Qual è l'oceano più grande della Terra?",
      fr: 'Quel est le plus grand océan sur Terre ?',
      es: '¿Cuál es el océano más grande de la Tierra?',
    },
    options: {
      en: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
      it: ['Atlantico', 'Indiano', 'Artico', 'Pacifico'],
      fr: ['Atlantique', 'Indien', 'Arctique', 'Pacifique'],
      es: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
    },
    correctIndex: 3,
  },
  {
    id: 'geo_07', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'What is the capital city of Canada?',
      it: 'Qual è la capitale del Canada?',
      fr: 'Quelle est la capitale du Canada ?',
      es: '¿Cuál es la capital de Canadá?',
    },
    options: {
      en: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
      it: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
      fr: ['Toronto', 'Vancouver', 'Montréal', 'Ottawa'],
      es: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
    },
    correctIndex: 3,
  },
  {
    id: 'geo_08', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'Which mountain is the highest in the world?',
      it: 'Quale montagna è la più alta del mondo?',
      fr: 'Quelle montagne est la plus haute du monde ?',
      es: '¿Qué montaña es la más alta del mundo?',
    },
    options: {
      en: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'],
      it: ['K2', 'Kangchenjunga', 'Monte Everest', 'Lhotse'],
      fr: ['K2', 'Kangchenjunga', 'Mont Everest', 'Lhotse'],
      es: ['K2', 'Kangchenjunga', 'Monte Everest', 'Lhotse'],
    },
    correctIndex: 2,
  },
  {
    id: 'geo_09', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'What is the capital of Brazil?',
      it: 'Qual è la capitale del Brasile?',
      fr: 'Quelle est la capitale du Brésil ?',
      es: '¿Cuál es la capital de Brasil?',
    },
    options: {
      en: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
      it: ['San Paolo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
      fr: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
      es: ['São Paulo', 'Río de Janeiro', 'Brasilia', 'Salvador'],
    },
    correctIndex: 2,
  },
  {
    id: 'geo_10', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'What is the currency of Japan?',
      it: 'Qual è la valuta del Giappone?',
      fr: 'Quelle est la monnaie du Japon ?',
      es: '¿Cuál es la moneda de Japón?',
    },
    options: {
      en: ['Yuan', 'Won', 'Yen', 'Ringgit'],
      it: ['Yuan', 'Won', 'Yen', 'Ringgit'],
      fr: ['Yuan', 'Won', 'Yen', 'Ringgit'],
      es: ['Yuan', 'Won', 'Yen', 'Ringgit'],
    },
    correctIndex: 2,
  },
  {
    id: 'geo_11', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'The Sahara Desert covers most of which continent?',
      it: 'Il deserto del Sahara si estende principalmente su quale continente?',
      fr: 'Le désert du Sahara couvre la majeure partie de quel continent ?',
      es: '¿El desierto del Sahara ocupa principalmente qué continente?',
    },
    options: {
      en: ['Asia', 'South America', 'Africa', 'Australia'],
      it: ['Asia', 'America del Sud', 'Africa', 'Australia'],
      fr: ['Asie', 'Amérique du Sud', 'Afrique', 'Australie'],
      es: ['Asia', 'América del Sur', 'África', 'Australia'],
    },
    correctIndex: 2,
  },
  {
    id: 'geo_12', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: 'Which country has the most time zones?',
      it: 'Quale paese ha il maggior numero di fusi orari?',
      fr: 'Quel pays possède le plus grand nombre de fuseaux horaires ?',
      es: '¿Qué país tiene más husos horarios?',
    },
    options: {
      en: ['Russia', 'USA', 'China', 'France'],
      it: ['Russia', 'USA', 'Cina', 'Francia'],
      fr: ['Russie', 'USA', 'Chine', 'France'],
      es: ['Rusia', 'EE. UU.', 'China', 'Francia'],
    },
    correctIndex: 3,
  },
  {
    id: 'geo_13', topic: 'Geography',
    difficulty: 'medium',
    text: {
      en: "Lake Baikal, the world's deepest lake, is located in which country?",
      it: 'Il lago Bajkal, il lago più profondo del mondo, si trova in quale paese?',
      fr: 'Le lac Baïkal, le lac le plus profond du monde, se trouve dans quel pays ?',
      es: 'El lago Baikal, el lago más profundo del mundo, ¿en qué país se encuentra?',
    },
    options: {
      en: ['Kazakhstan', 'Mongolia', 'Russia', 'China'],
      it: ['Kazakhstan', 'Mongolia', 'Russia', 'Cina'],
      fr: ['Kazakhstan', 'Mongolie', 'Russie', 'Chine'],
      es: ['Kazajistán', 'Mongolia', 'Rusia', 'China'],
    },
    correctIndex: 2,
  },

  // ─── MUSIC ────────────────────────────────────────────────────────────
  {
    id: 'mus_01', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'Which band performed the legendary song "Bohemian Rhapsody"?',
      it: "Quale band ha eseguito la leggendaria canzone 'Bohemian Rhapsody'?",
      fr: "Quel groupe a interprété la légendaire chanson 'Bohemian Rhapsody' ?",
      es: "¿Qué banda interpretó la legendaria canción 'Bohemian Rhapsody'?",
    },
    options: {
      en: ['The Rolling Stones', 'Led Zeppelin', 'Queen', 'The Beatles'],
      it: ['The Rolling Stones', 'Led Zeppelin', 'Queen', 'The Beatles'],
      fr: ['The Rolling Stones', 'Led Zeppelin', 'Queen', 'The Beatles'],
      es: ['The Rolling Stones', 'Led Zeppelin', 'Queen', 'The Beatles'],
    },
    correctIndex: 2,
  },
  {
    id: 'mus_02', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'How many strings does a standard acoustic guitar have?',
      it: 'Quante corde ha una chitarra acustica standard?',
      fr: 'Combien de cordes a une guitare acoustique standard ?',
      es: '¿Cuántas cuerdas tiene una guitarra acústica estándar?',
    },
    options: {
      en: ['4', '5', '6', '7'],
      it: ['4', '5', '6', '7'],
      fr: ['4', '5', '6', '7'],
      es: ['4', '5', '6', '7'],
    },
    correctIndex: 2,
  },
  {
    id: 'mus_03', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'Which artist released the album "Thriller" in 1982?',
      it: "Quale artista ha pubblicato l'album 'Thriller' nel 1982?",
      fr: "Quel artiste a sorti l'album 'Thriller' en 1982 ?",
      es: "¿Qué artista lanzó el álbum 'Thriller' en 1982?",
    },
    options: {
      en: ['Prince', 'Michael Jackson', 'David Bowie', 'Stevie Wonder'],
      it: ['Prince', 'Michael Jackson', 'David Bowie', 'Stevie Wonder'],
      fr: ['Prince', 'Michael Jackson', 'David Bowie', 'Stevie Wonder'],
      es: ['Prince', 'Michael Jackson', 'David Bowie', 'Stevie Wonder'],
    },
    correctIndex: 1,
  },
  {
    id: 'mus_04', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'From which country does K-pop originate?',
      it: 'Da quale paese proviene il K-pop?',
      fr: 'De quel pays est originaire le K-pop ?',
      es: '¿De qué país es originario el K-pop?',
    },
    options: {
      en: ['Japan', 'China', 'South Korea', 'Thailand'],
      it: ['Giappone', 'Cina', 'Corea del Sud', 'Tailandia'],
      fr: ['Japon', 'Chine', 'Corée du Sud', 'Thaïlande'],
      es: ['Japón', 'China', 'Corea del Sur', 'Tailandia'],
    },
    correctIndex: 2,
  },
  {
    id: 'mus_05', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'How many keys does a standard modern piano have?',
      it: 'Quanti tasti ha un pianoforte moderno standard?',
      fr: 'Combien de touches a un piano moderne standard ?',
      es: '¿Cuántas teclas tiene un piano moderno estándar?',
    },
    options: {
      en: ['72', '76', '88', '84'],
      it: ['72', '76', '88', '84'],
      fr: ['72', '76', '88', '84'],
      es: ['72', '76', '88', '84'],
    },
    correctIndex: 2,
  },
  {
    id: 'mus_06', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'Which artist is commonly known as the "Queen of Pop"?',
      it: "Quale artista è conosciuta come la 'Regina del Pop'?",
      fr: "Quel artiste est communément connu comme la 'Reine de la Pop' ?",
      es: "¿Qué artista es conocida como la 'Reina del Pop'?",
    },
    options: {
      en: ['Beyoncé', 'Mariah Carey', 'Madonna', 'Lady Gaga'],
      it: ['Beyoncé', 'Mariah Carey', 'Madonna', 'Lady Gaga'],
      fr: ['Beyoncé', 'Mariah Carey', 'Madonna', 'Lady Gaga'],
      es: ['Beyoncé', 'Mariah Carey', 'Madonna', 'Lady Gaga'],
    },
    correctIndex: 2,
  },
  {
    id: 'mus_07', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'Which band sang "Smells Like Teen Spirit"?',
      it: "Quale band ha cantato 'Smells Like Teen Spirit'?",
      fr: "Quel groupe a chanté 'Smells Like Teen Spirit' ?",
      es: "¿Qué banda cantó 'Smells Like Teen Spirit'?",
    },
    options: {
      en: ['Pearl Jam', 'Nirvana', 'Soundgarden', 'Alice in Chains'],
      it: ['Pearl Jam', 'Nirvana', 'Soundgarden', 'Alice in Chains'],
      fr: ['Pearl Jam', 'Nirvana', 'Soundgarden', 'Alice in Chains'],
      es: ['Pearl Jam', 'Nirvana', 'Soundgarden', 'Alice in Chains'],
    },
    correctIndex: 1,
  },
  {
    id: 'mus_08', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'In what year did The Beatles officially break up?',
      it: 'In quale anno si sono ufficialmente sciolti i Beatles?',
      fr: 'En quelle année les Beatles se sont-ils officiellement séparés ?',
      es: '¿En qué año se disolvieron oficialmente The Beatles?',
    },
    options: {
      en: ['1969', '1970', '1971', '1968'],
      it: ['1969', '1970', '1971', '1968'],
      fr: ['1969', '1970', '1971', '1968'],
      es: ['1969', '1970', '1971', '1968'],
    },
    correctIndex: 1,
  },
  {
    id: 'mus_09', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: "Which rapper's debut album was \"Reasonable Doubt\" (1996)?",
      it: "L'album d'esordio 'Reasonable Doubt' (1996) appartiene a quale rapper?",
      fr: "L'album de débuts 'Reasonable Doubt' (1996) appartient à quel rappeur ?",
      es: "El álbum debut 'Reasonable Doubt' (1996) pertenece a ¿qué rapero?",
    },
    options: {
      en: ['Nas', 'Biggie', 'Jay-Z', 'Rakim'],
      it: ['Nas', 'Biggie', 'Jay-Z', 'Rakim'],
      fr: ['Nas', 'Biggie', 'Jay-Z', 'Rakim'],
      es: ['Nas', 'Biggie', 'Jay-Z', 'Rakim'],
    },
    correctIndex: 2,
  },
  {
    id: 'mus_10', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'What genre of music is primarily associated with New Orleans?',
      it: 'Quale genere musicale è principalmente associato a New Orleans?',
      fr: 'Quel genre musical est principalement associé à la Nouvelle-Orléans ?',
      es: '¿Qué género musical está principalmente asociado con Nueva Orleans?',
    },
    options: {
      en: ['Blues', 'Jazz', 'Soul', 'Gospel'],
      it: ['Blues', 'Jazz', 'Soul', 'Gospel'],
      fr: ['Blues', 'Jazz', 'Soul', 'Gospel'],
      es: ['Blues', 'Jazz', 'Soul', 'Gospel'],
    },
    correctIndex: 1,
  },
  {
    id: 'mus_11', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: "What is the name of Taylor Swift's re-recorded debut album?",
      it: "Come si chiama l'album di debutto re-registrato di Taylor Swift?",
      fr: "Quel est le nom de l'album de débuts réenregistré de Taylor Swift ?",
      es: "¿Cómo se llama el álbum debut regrabado de Taylor Swift?",
    },
    options: {
      en: ['Fearless (TV)', 'Taylor Swift (TV)', 'Speak Now (TV)', '1989 (TV)'],
      it: ['Fearless (TV)', 'Taylor Swift (TV)', 'Speak Now (TV)', '1989 (TV)'],
      fr: ['Fearless (TV)', 'Taylor Swift (TV)', 'Speak Now (TV)', '1989 (TV)'],
      es: ['Fearless (TV)', 'Taylor Swift (TV)', 'Speak Now (TV)', '1989 (TV)'],
    },
    correctIndex: 1,
  },
  {
    id: 'mus_12', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'A person who makes string instruments is called a what?',
      it: 'Come si chiama chi costruisce strumenti a corde?',
      fr: 'Comment appelle-t-on quelqu\'un qui fabrique des instruments à cordes ?',
      es: '¿Cómo se llama quien fabrica instrumentos de cuerda?',
    },
    options: {
      en: ['Luthier', 'Artisan', 'Cooper', 'Fletcher'],
      it: ['Liutaio', 'Artigiano', 'Bottaio', 'Arciere'],
      fr: ['Luthier', 'Artisan', 'Tonnelier', 'Armurier'],
      es: ['Lutier', 'Artesano', 'Tonelero', 'Flechero'],
    },
    correctIndex: 0,
  },
  {
    id: 'mus_13', topic: 'Music',
    difficulty: 'medium',
    text: {
      en: 'Which Italian city is associated with the origin of opera?',
      it: "Quale città italiana è associata alle origini dell'opera?",
      fr: "Quelle ville italienne est associée à l'origine de l'opéra ?",
      es: '¿Qué ciudad italiana está asociada con los orígenes de la ópera?',
    },
    options: {
      en: ['Rome', 'Naples', 'Florence', 'Venice'],
      it: ['Roma', 'Napoli', 'Firenze', 'Venezia'],
      fr: ['Rome', 'Naples', 'Florence', 'Venise'],
      es: ['Roma', 'Nápoles', 'Florencia', 'Venecia'],
    },
    correctIndex: 2,
  },

  // ─── SCIENCE ──────────────────────────────────────────────────────────
  {
    id: 'sci_01', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'What is the chemical symbol for Gold?',
      it: "Qual è il simbolo chimico dell'oro?",
      fr: "Quel est le symbole chimique de l'or ?",
      es: '¿Cuál es el símbolo químico del oro?',
    },
    options: {
      en: ['Go', 'Gd', 'Au', 'Ag'],
      it: ['Go', 'Gd', 'Au', 'Ag'],
      fr: ['Go', 'Gd', 'Au', 'Ag'],
      es: ['Go', 'Gd', 'Au', 'Ag'],
    },
    correctIndex: 2,
  },
  {
    id: 'sci_02', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'How many bones are in the adult human body?',
      it: 'Quante ossa ha il corpo umano adulto?',
      fr: 'Combien d\'os y a-t-il dans le corps humain adulte ?',
      es: '¿Cuántos huesos tiene el cuerpo humano adulto?',
    },
    options: {
      en: ['196', '206', '216', '186'],
      it: ['196', '206', '216', '186'],
      fr: ['196', '206', '216', '186'],
      es: ['196', '206', '216', '186'],
    },
    correctIndex: 1,
  },
  {
    id: 'sci_03', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'Which planet is known as the "Red Planet"?',
      it: "Quale pianeta è conosciuto come il 'Pianeta Rosso'?",
      fr: "Quelle planète est connue comme la 'Planète Rouge' ?",
      es: "¿Qué planeta es conocido como el 'Planeta Rojo'?",
    },
    options: {
      en: ['Jupiter', 'Saturn', 'Venus', 'Mars'],
      it: ['Giove', 'Saturno', 'Venere', 'Marte'],
      fr: ['Jupiter', 'Saturne', 'Vénus', 'Mars'],
      es: ['Júpiter', 'Saturno', 'Venus', 'Marte'],
    },
    correctIndex: 3,
  },
  {
    id: 'sci_04', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'Approximately how fast does light travel in a vacuum?',
      it: 'Circa a quale velocità viaggia la luce nel vuoto?',
      fr: 'À quelle vitesse approximative la lumière voyage-t-elle dans le vide ?',
      es: '¿A qué velocidad viaja aproximadamente la luz en el vacío?',
    },
    options: {
      en: ['200,000 km/s', '300,000 km/s', '400,000 km/s', '250,000 km/s'],
      it: ['200.000 km/s', '300.000 km/s', '400.000 km/s', '250.000 km/s'],
      fr: ['200 000 km/s', '300 000 km/s', '400 000 km/s', '250 000 km/s'],
      es: ['200.000 km/s', '300.000 km/s', '400.000 km/s', '250.000 km/s'],
    },
    correctIndex: 1,
  },
  {
    id: 'sci_05', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'What organelle is often called the "powerhouse of the cell"?',
      it: "Quale organello è spesso chiamato 'la centrale della cellula'?",
      fr: "Quel organite est souvent appelé 'la centrale énergétique de la cellule' ?",
      es: "¿Qué orgánulo suele llamarse 'la central energética de la célula'?",
    },
    options: {
      en: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'],
      it: ['Nucleo', 'Ribosoma', 'Mitocondrio', 'Apparato di Golgi'],
      fr: ['Noyau', 'Ribosome', 'Mitochondrie', 'Appareil de Golgi'],
      es: ['Núcleo', 'Ribosoma', 'Mitocondria', 'Aparato de Golgi'],
    },
    correctIndex: 2,
  },
  {
    id: 'sci_06', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'What gas do plants absorb from the air during photosynthesis?',
      it: 'Quale gas assorbono le piante dall\'aria durante la fotosintesi?',
      fr: 'Quel gaz les plantes absorbent-elles de l\'air pendant la photosynthèse ?',
      es: '¿Qué gas absorben las plantas del aire durante la fotosíntesis?',
    },
    options: {
      en: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
      it: ['Ossigeno', 'Azoto', 'Anidride carbonica', 'Idrogeno'],
      fr: ['Oxygène', 'Azote', 'Dioxyde de carbone', 'Hydrogène'],
      es: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Hidrógeno'],
    },
    correctIndex: 2,
  },
  {
    id: 'sci_07', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'What is the atomic number of Carbon?',
      it: 'Qual è il numero atomico del carbonio?',
      fr: 'Quel est le numéro atomique du carbone ?',
      es: '¿Cuál es el número atómico del carbono?',
    },
    options: {
      en: ['4', '6', '8', '12'],
      it: ['4', '6', '8', '12'],
      fr: ['4', '6', '8', '12'],
      es: ['4', '6', '8', '12'],
    },
    correctIndex: 1,
  },
  {
    id: 'sci_08', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'Which theory did Einstein publish in 1905, revolutionizing physics?',
      it: 'Quale teoria pubblicò Einstein nel 1905, rivoluzionando la fisica?',
      fr: "Quelle théorie Einstein a-t-il publiée en 1905, révolutionnant la physique ?",
      es: '¿Qué teoría publicó Einstein en 1905, revolucionando la física?',
    },
    options: {
      en: ['General Relativity', 'Special Theory of Relativity', 'Quantum Theory', 'String Theory'],
      it: ['Relatività Generale', 'Relatività Ristretta', 'Teoria dei Quanti', 'Teoria delle Stringhe'],
      fr: ['Relativité générale', 'Relativité restreinte', 'Théorie quantique', 'Théorie des cordes'],
      es: ['Relatividad General', 'Relatividad Especial', 'Teoría Cuántica', 'Teoría de Cuerdas'],
    },
    correctIndex: 1,
  },
  {
    id: 'sci_09', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: "What is the most abundant gas in Earth's atmosphere?",
      it: "Qual è il gas più abbondante nell'atmosfera terrestre?",
      fr: "Quel est le gaz le plus abondant dans l'atmosphère terrestre ?",
      es: '¿Cuál es el gas más abundante en la atmósfera terrestre?',
    },
    options: {
      en: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
      it: ['Ossigeno', 'Anidride carbonica', 'Azoto', 'Argon'],
      fr: ['Oxygène', 'Dioxyde de carbone', 'Azote', 'Argon'],
      es: ['Oxígeno', 'Dióxido de carbono', 'Nitrógeno', 'Argón'],
    },
    correctIndex: 2,
  },
  {
    id: 'sci_10', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'What does DNA stand for?',
      it: 'Cosa significa DNA?',
      fr: "Que signifie l'ADN ?",
      es: '¿Qué significa ADN?',
    },
    options: {
      en: ['Deoxyribonucleic Acid', 'Diribonucleic Acid', 'Deoxyribose Nucleic Acid', 'Dioxy Ribonucleic Acid'],
      it: ['Acido Desossiribonucleico', 'Acido Diribonucleico', 'Acido Desossiribosio Nucleico', 'Acido Diossiribonocleico'],
      fr: ['Acide désoxyribonucléique', 'Acide diribonucléique', 'Acide nucléique désoxyribose', 'Acide dioxyribonucléique'],
      es: ['Ácido Desoxirribonucleico', 'Ácido Dirribonucleico', 'Ácido Nucleico Desoxirribosa', 'Ácido Dioxirribonucleico'],
    },
    correctIndex: 0,
  },
  {
    id: 'sci_11', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'Which planet in our solar system has the most known moons?',
      it: 'Quale pianeta del sistema solare ha il maggior numero di lune conosciute?',
      fr: 'Quelle planète de notre système solaire a le plus grand nombre de lunes connues ?',
      es: '¿Qué planeta de nuestro sistema solar tiene más lunas conocidas?',
    },
    options: {
      en: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      it: ['Giove', 'Saturno', 'Urano', 'Nettuno'],
      fr: ['Jupiter', 'Saturne', 'Uranus', 'Neptune'],
      es: ['Júpiter', 'Saturno', 'Urano', 'Neptuno'],
    },
    correctIndex: 1,
  },
  {
    id: 'sci_12', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'At what temperature does water boil at sea level?',
      it: "A quale temperatura bolle l'acqua al livello del mare?",
      fr: "À quelle température l'eau bout-elle au niveau de la mer ?",
      es: '¿A qué temperatura hierve el agua al nivel del mar?',
    },
    options: {
      en: ['90°C', '95°C', '100°C', '105°C'],
      it: ['90°C', '95°C', '100°C', '105°C'],
      fr: ['90°C', '95°C', '100°C', '105°C'],
      es: ['90°C', '95°C', '100°C', '105°C'],
    },
    correctIndex: 2,
  },
  {
    id: 'sci_13', topic: 'Science',
    difficulty: 'medium',
    text: {
      en: 'What is the hardest natural substance on Earth?',
      it: 'Qual è la sostanza naturale più dura sulla Terra?',
      fr: 'Quelle est la substance naturelle la plus dure sur Terre ?',
      es: '¿Cuál es la sustancia natural más dura de la Tierra?',
    },
    options: {
      en: ['Granite', 'Quartz', 'Diamond', 'Titanium'],
      it: ['Granito', 'Quarzo', 'Diamante', 'Titanio'],
      fr: ['Granit', 'Quartz', 'Diamant', 'Titane'],
      es: ['Granito', 'Cuarzo', 'Diamante', 'Titanio'],
    },
    correctIndex: 2,
  },
];

export const getQuestionsByTopic = (topic: Topic): Question[] =>
  allQuestions.filter((q) => q.topic === topic);

/** Fisher-Yates shuffle returning `count` random question IDs for the topic */
export const shuffleQuestionIds = (topic: Topic, count = 10): string[] => {
  const pool = getQuestionsByTopic(topic).map((q) => q.id);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
};

export const getQuestionById = (id: string): Question | undefined =>
  allQuestions.find((q) => q.id === id);

/** Like shuffleQuestionIds but prefers questions matching `difficulty`, falling back to others */
export const shuffleQuestionIdsByDifficulty = (
  topic: Topic,
  difficulty: 'easy' | 'medium' | 'hard',
  count = 10,
): string[] => {
  const byTopic = getQuestionsByTopic(topic);
  const shuffle = (ids: string[]) => {
    const a = [...ids];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const primary   = shuffle(byTopic.filter((q) => q.difficulty === difficulty).map((q) => q.id));
  const secondary = shuffle(byTopic.filter((q) => q.difficulty !== difficulty).map((q) => q.id));
  return [...primary, ...secondary].slice(0, count);
};

export default allQuestions;

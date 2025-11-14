# GameInsight
Repository del progetto "GameInsight" per il corso di Basi di Dati 2 del Corso di Laurea Magistrale in Informatica.

# Overview
GameInsight è una piattaforma interattiva per analizzare e gestire i dati relativi alle sessioni di gioco. Contiene diverse sezioni: HomePage, Giocatori, Sessioni e Analisi, ognuna delle quali con le sue peculiarità.

## Autori
<a href="https://github.com/Rokuoganz/GameInsight/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Rokuoganz/GameInsight" />
</a>

* [Francesco Ferrara](https://github.com/Rokuoganz)

## Obiettivi
- Il progetto ha come obiettivo principale lo sviluppo di un sistema interattivo, sotto forma
di web application, per la consultazione e l’analisi dei dati relativi al comportamento dei
giocatori online. L’applicazione mira a fornire una piattaforma che consenta di esplorare,
filtrare e correlare informazioni sui profili dei giocatori, le loro abitudini di gioco e le statistiche aggregate, in modo da rendere l’esperienza di analisi intuitiva e accessibile anche a
utenti non esperti.

## Dataset
Il dataset è progettato per rappresentare dati relativi al mondo del gaming online, consentendo agli utenti di praticare, sviluppare e mostrare le loro abilità di manipolazione e analisi dei dati nel contesto del settore dei videogiochi. Ogni colonna fornisce informazioni specifiche sui giocatori, sulle loro sessioni di gioco e sulle attività online svolte, rendendo questo dataset adatto a diversi compiti di analisi dei dati, modellazione e valutazione delle performance nel contesto del gaming online.

## Strumenti e Tecnologie
<div style="display: flex; align-items: center; gap: 30px;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" width="50"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/38/Jupyter_logo.svg" width="50"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="100"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" width="125"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/React_Logo_SVG.svg" width="50"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" width="50"/>
</div> 

- Python: linguaggio di programmazione utilizzato per l'analisi preliminare del dataset.
- Jupyter Notebook (.ipynb): formato di file utilizzato per organizzare il codice in celle, con testo e risultati integrati.
- Node.js: runtime JavaScript lato server utilizzato per eseguire il backend dell’applicazione e gestire la logica lato server.
- MongoDB: database NoSQL utilizzato per memorizzare e gestire i dati dei giocatori e delle sessioni di gioco.
- React: libreria JavaScript per la creazione dell’interfaccia utente dinamica e reattiva del client.
- Vite: strumento di build e sviluppo rapido per progetti frontend basati su JavaScript, usato per ottimizzare e avviare il client React.

## Installazione e Uso
1. Clonare il repository GitHub del progetto sul proprio PC.
2. Installare Node.js, npm e MongoDB e verificare che siano correttamente raggiungibili dai terminali, aggiornando la variabile path contenuta nelle variabili d'ambiente relative al sistema.
4. Connettersi al database usando la stringa di connessione, contenuta nel file [ProgettoBD2/server/.env](ProgettoBD2/server/.env), attraverso MongoDB Compass oppure attraverso l'estensione di MongoDB per Visual Studio Code.
7. Ripopolare il database eseguendo su CMD, nella directory del database, il comando npm run reload-db
8. Avviare 2 CMD separati, posizionarsi nella cartella server per il primo e nella cartella client per il secondo, ed eseguire il comando npm run dev in ognuna.
9. Attraverso un browser, come Google Chrome, ricercare http://localhost:5173/.

## Struttura del Progetto
- [DocumentazioneGameInsight.pdf](DocumentazioneGameInsight.pdf): Documentazione del progetto.
- [Dataset/](Dataset/): Directory contenente il dataset utilizzato.
- [ProgettoBD2/](ProgettoBD2/): Directory contenente gli script utilizzati.
- [ProgettoBD2/data_preprocessing](ProgettoBD2/data_preprocessing): Directory contente l'analisi preliminare del dataset, e i file csv utilizzati come Collection di MongoDB.

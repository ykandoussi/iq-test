# Redeneertest

Statische webapp zonder build-stap en zonder externe afhankelijkheden. De site toont geen score en bevat geen antwoordsleutel. Aan het eind kopieert de gebruiker de resultaten (antwoorden, getoonde cijfers en seconden per vraag) om die te laten analyseren.

## Bestanden in deze repository

| Bestand | Functie |
|---|---|
| `index.html` | Startpagina en structuur van de app |
| `style.css` | Vormgeving, lichte en donkere modus, toegankelijke focus |
| `questions.js` | Alle 111 vragen en antwoordopties (geen antwoorden) |
| `app.js` | Logica: vragen tonen, cijfers onthouden, navigatie, timers, kopieerfunctie |
| `README.md` | Deze uitleg en het bestandsoverzicht |

Niet uploaden naar GitHub: map `private/` met `answerkey.json` (de antwoordsleutel, alleen voor de analyse).

## Vraagsoorten
- Analogieën (12)
- Getallenreeksen (19)
- Logica en redeneren (7)
- Woorden of getallen die niet passen (5)
- Rekenen en tekstsommen (26)
- Cijfers onthouden, vooruit en achteruit (10)
- Figuur na draaien herkennen (12)
- Figuurmatrices met regels (20)

## Live zetten met GitHub Pages
1. Maak op github.com een nieuwe repository (bijv. `redeneertest`).
2. Upload de bestanden `index.html`, `style.css`, `questions.js`, `app.js` en `README.md` (**Add file → Upload files**).
3. Ga naar **Settings → Pages**, kies bij *Source* **Deploy from a branch**, branch `main`, map `/ (root)`, en klik **Save**.
4. Na een minuut staat de test op `https://<jouw-gebruikersnaam>.github.io/redeneertest/`.

Lokaal testen: open `index.html` in een browser.

## Let op
Zoals bij elke webtest kan iemand die de broncode bekijkt de vragen zien. Laat de test daarom in één keer, zonder de code te bekijken, maken.

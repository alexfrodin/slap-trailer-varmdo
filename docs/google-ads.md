# Google Ads-mätning

Webbplatsen mäter två saker efter samtycke:

1. **Primär konvertering:** en serviceförfrågan som faktiskt har skickats (`service_request_submitted`).
2. **Sekundär konvertering:** ett klick på ett telefonnummer (`phone_click`). Det är en avsikt att ringa, inte ett genomfört samtal.

Sidvisningar, klick på "Boka service" och misslyckade formulär är inte konverteringar.

## Arkitektur

Direkt `gtag.js`. Google Tag Manager används inte.

Consent Mode v2 sätts i `<head>` innan någon Google-tagg laddas, med dessa standardvärden nekade:

- `ad_storage`
- `analytics_storage`
- `ad_user_data`
- `ad_personalization`

Själva Google-skriptet laddas först när besökaren godkänner. Det är grundläggande Consent Mode (inte avancerat läge). Google får därför inga cookiefria pingar före samtycke, och kan inte modellera konverteringar för den som avvisar. Det är ett medvetet val för en svensk sajt: inga marknadsföringsskript före ett aktivt val.

`ads_data_redaction` är på. Förbättrade konverteringar är avstängda (`allow_enhanced_conversions: false`). Inga namn, e-postadresser, telefonnummer eller meddelanden skickas till Google.

Sajten använder vanliga sidladdningar, inte Astro View Transitions. Lyssnare sätts en gång per sidladdning.

GA4 ingår inte. Sätt `PUBLIC_GA4_MEASUREMENT_ID` bara om ett GA4-egendom ska ta emot händelser. Då skickas `generate_lead` tillsammans med den primära konverteringen, och `phone_click` till GA4. `analytics_storage` förblir nekad om GA4-id saknas.

Vercel Analytics och eventuell Plausible är oförändrade och cookiefria.

## Händelser

| Händelse | När | Google Ads |
| --- | --- | --- |
| `service_request_submitted` | En förfrågan har tagits emot | Primär konvertering, label för lead |
| `generate_lead` | Samma tillfälle, bara om GA4 är satt | Nej |
| `phone_click` | Klick på en `tel:`-länk | Egen konvertering, label för telefon |

Telefonklick får bara en plats: `hero`, `header`, `footer`, `contact`, `sticky` eller `other`.

### Förfrågan

Formuläret postas till `/api/contact` och omdirigerar till `/tack?skickad=1` först när mejlet har skickats (i lokal utveckling även utan mejl, så flödet går att testa). Konverteringen skickas på tack-sidan, inte när knappen trycks.

Den skickas bara om båda stämmer:

- adressen innehöll `skickad=1` (sätts inte vid honeypot eller vid fel)
- samma flik satte en engångstoken när formuläret skickades

Parametern tas bort ur adressen direkt. En omladdning, ett bokmärke på `/tack` eller ett misslyckat formulär ger ingen ny konvertering. Om besökaren godkänner mätning först efteråt skickas samma förfrågan en gång, inom samma flik.

### Telefon

Alla kundvända `tel:`-länkar går genom samma klicklyssnare. "Boka service" scrollar eller länkar till formuläret och räknas inte.

### Kampanjdata

`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid` och `wbraid` sparas i `sessionStorage` under besöket och bifogas mejlet om de finns. De visas inte på sidan och skickas inte som parametrar till Google. Första träffen i fliken behålls tills ett nytt klick-id kommer.

Google kan själv koppla konverteringen till annonsklicket om besökaren godkänner medan `gclid` fortfarande gäller, alltså helst på landningssidan. Vi laddar inte Google-taggen före samtycke, så ett sent godkännande kan göra att Google saknar klick-id även om verkstaden ser det i mejlet.

## Miljövariabler

Lämna dem tomma lokalt. Saknas de fungerar sajten som vanligt, utan samtyckesruta och utan Google-skript.

```bash
PUBLIC_GOOGLE_ADS_ID=AW-1234567890
PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL=AbCDefGhijkL
PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL=ZyXwVuTsRqPo

# Valfri. Lämna tom om GA4 inte ska användas.
PUBLIC_GA4_MEASUREMENT_ID=
```

`PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` läses fortfarande som reserv för lead-label, om den gamla variabeln redan finns i Vercel. Telefonklick kräver den nya variabeln.

Värdena är inte hemligheter. De syns i webbläsaren. Lägg dem inte i annan kod.

## Google Ads

Det här görs i Google Ads-kontot, inte av koden.

Skapa två konverteringsåtgärder av typen webbplats. Använd händelsen `conversion` med `send_to` (konverterings-id + label). Skapa inte en sidvisningskonvertering på `/tack`, och markera inte de egna händelsenamnen som konverteringar. Då dubbelräknas de.

1. **Förfrågan skickad** — kategori lead / skicka formulär. Räkna en per klick. Sätt som **Primär**. Kopiera label till `PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL`.
2. **Telefonklick** — kategori telefon eller kontakt. Räkna en per klick. Sätt som **Sekundär**. Kopiera label till `PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_LABEL`.

Konverterings-id (`AW-…`) är samma för båda och ska in i `PUBLIC_GOOGLE_ADS_ID`.

Primär betyder att budgivningen optimerar mot skickade förfrågningar. Telefonklick kan senare göras primär i kontot om samtal visar sig ge riktiga kunder. Den ändringen görs i Google Ads.

Kampanjer, budget, bud, sökord och annonstext ingår inte i den här ändringen.

### Förbättrade konverteringar

Inte infört. För att slå på Enhanced Conversions senare behöver verksamheten först ta ställning till att hashade e-postadresser eller telefonnummer skickas till Google, och till kraven i GDPR och marknadsföringssamtycke. Gör inte det bara för att få mer data i kontot.

## Vercel

Lägg variablerna under Project → Settings → Environment Variables.

- **Production:** alla tre Google Ads-variabler när kontot är klart.
- **Preview:** bara om ni medvetet vill testa mot samma konverteringsåtgärder. Preview-trafik räknas då i kontot.
- **Development:** lämna tomt. Lokal `astro dev` skickar inget så länge variablerna saknas i `.env`.

`PUBLIC_`-variabler bakas in vid build. En ändring kräver en ny deploy.

## Test

1. Utan variabler: ingen samtyckesruta, inget anrop till `googletagmanager.com`, formulär och telefonlänkar fungerar.
2. Med variabler, före val: `dataLayer` innehåller `consent` `default` med alla fyra värden `denied`. Nätverket har inget `gtag/js`.
3. **Avvisa:** valet ligger kvar efter omladdning, formulär och `tel:` fungerar, inget `gtag/js` och ingen `conversion`.
4. **Godkänn:** `dataLayer` får `consent` `update` med annonslagring `granted` innan `gtag/js` hämtas. `analytics_storage` är `denied` om GA4-id saknas.
5. Telefonklick: en `phone_click` och en `conversion` med telefon-label. Omladdning av en annan sida lägger inte på en extra lyssnare utöver den nya sidans enda lyssnare.
6. Förfrågan: fyll i formuläret, vänta minst tre sekunder, skicka. På `/tack` ska adressen tappa `skickad`, och `dataLayer` ska innehålla en `service_request_submitted` och en `conversion` med lead-label. Ladda om: ingen ny conversion.
7. Skicka för fort eller med fel: ni stannar på formuläret med `?fel=`, och ingen conversion skickas.
8. Kontrollera att händelserna saknar namn, e-post, telefon, registreringsnummer och meddelande.

Tag Assistant (Google) eller nätverksfliken räcker. I konsolen går det att läsa `window.dataLayer` efteråt.

Kör `npm test` för reglerna kring samtycke, engångskonvertering och att kampanjfält inte tar med personuppgifter.

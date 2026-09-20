export type Service = {
  slug: string;
  navLabel: string;
  cardTitle: string;
  cardBlurb: string;
  h1: string;
  title: string;
  description: string;
  heroLead: string;
  sections: {
    symptomsTitle?: string;
    symptoms?: string[];
    whatWeDoTitle: string;
    whatWeDo: string[];
    notes?: string[];
  };
  notice?: string;
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
  schemaServiceType: string;
  adsGroup: string;
  priceHint?: string;
};

export const services: Service[] = [
  {
    slug: 'batslap-service',
    navLabel: 'Båttrailer',
    cardTitle: 'Båttrailer',
    cardBlurb: 'Rullar, vinsch, stödhjul, lager, bromsar och belysning.',
    h1: 'Service och reparation av båttrailer',
    title: 'Båttrailer service på Värmdö',
    description:
      'Service av båttrailer på Värmdö: rullar, vinsch, stödhjul, hjullager, bromsar och belysning. Lämna gärna trailern när båten är inne.',
    heroLead:
      'Båttrailer utsätts för mycket slitage från vatten, rampkörning och regelbunden användning. Vi hjälper dig med service, felsökning och reparation i vår verkstad på Värmdö.',
    sections: {
      symptomsTitle: 'Vanliga tecken på att trailern behöver ses över',
      symptoms: [
        'Hjul som låter, glappar eller går trögt ',
        'Rullar som inte snurrar eller har spruckit',
        'Vinsch som slirar, kärvar eller har sliten lina',
        'Stödhjul som kärvar eller sitter löst',
        'Glapp, fel eller andra problem med släpets belysning och elsystem',
      ],
      whatWeDoTitle: 'Vad vi går igenom på ett båttrailer',
      whatWeDo: [
        'Hjullager, nav och tätningar',
        'Bromsar, påskjutsbroms och handbroms',
        'Belysning, släpkontakt och jordfel',
        'Vinsch, lina och fästen',
        'Rullar, stöttor och stödhjul',
        'Däck, lufttryck och synliga skador på ram och fästen',
      ],
    },
    faqs: [
      {
        q: 'Hur ofta bör hjullager på båttrailer kontrolleras?',
        a: 'Efter varje säsong med mycket sjösättning är det klokt att kolla lager, fett och tätningar. Vatten och salt sliter snabbare än på ett vanligt släp som bara rullar på asfalt. Hör av dig om det låter, glappar eller har gått varmt.',
      },
      {
        q: 'Kan ni byta rullar och vinsch?',
        a: 'Ja. Vi byter rullar, ser över vinsch och stödhjul och lagar fästen när det behövs.',
      },
      {
        q: 'Behöver trailern vara tom?',
        a: 'Det är enklast att arbeta med trailern när båten är av. Hör av dig så stämmer vi av vad som behöver göras och hur vi löser det på smidigast sätt.',
      },
    ],
    relatedSlugs: ['hjullager-slapvagn', 'bromsservice-slapvagn', 'el-belysning-slapvagn'],
    schemaServiceType: 'Båttrailer service',
    adsGroup: 'Boat trailer',
  },
  {
    slug: 'hjullager-slapvagn',
    navLabel: 'Hjullager',
    cardTitle: 'Hjullager & nav',
    cardBlurb: 'Byte av lager, nav och tätningar när det låter, glappar eller skurit.',
    h1: 'Hjullager och nav till släpvagn',
    title: 'Byta hjullager på släpvagn',
    description:
      'Vi byter hjullager, nav och tätningar på släpvagnar och båttrailer. Om släpet låter, glappar eller går trögt – hör av dig.',
    heroLead:
      'Låter det, glappar det eller har lagret skurit? Vi byter hjullager och nav i verkstaden på Värmdö.',
    sections: {
      symptomsTitle: 'Hur vet jag att hjullagret är dåligt?',
      symptoms: [
        'Ett brummande eller malande ljud som följer farten',
        'Hjulet har glapp när du lyfter och vickar',
        'Hjulet går trögt eller har skurit',
        'Fett som läcker ut vid navet',
        'Navet blir onormalt varmt efter en kort körning',
      ],
      whatWeDoTitle: 'Vad vi gör',
      whatWeDo: [
        'Kontrollerar glapp, ljud och tätningar',
        'Byter hjullager, och nav när det behövs',
        'Byter tätningar och packar med rätt fett',
        'Ser över båda sidor när slitage talar för det',
        'Kollar hjulbultar och att hjulet sitter som det ska',
      ],
      notes: [
        'Om det ylar, har tydligt glapp eller har skurit ska du inte dra släpet. Ring oss i stället.',
        'Båttrailer som backas i vatten behöver oftare tillsyn av lager och tätningar.',
      ],
    },
    faqs: [
      {
        q: 'Hur vet jag att hjullagret är dåligt?',
        a: 'Vanliga tecken är brummande ljud, glapp i hjulet, fettläckage eller att navet blir hett. Om hjulet har skurit ska släpet inte rullas.',
      },
      {
        q: 'Kan ni byta hjullager på alla fabrikat?',
        a: 'Vi tar emot de flesta vanliga släp och båttrailer. Ta med registreringsnummer och gärna märke om du har det, så kan vi kolla upp lager innan du kommer.',
      },
      {
        q: 'Måste båda sidor bytas?',
        a: 'Inte alltid. Vi bedömer efter kontroll. Ofta är slitaget liknande på båda sidor, särskilt på släp som rullat långt eller stått mycket i vatten.',
      },
      {
        q: 'Hur lång tid tar det?',
        a: 'Ett rakt lagerbyte är ofta ett kortare jobb. Om navet är skadat, bultar har skurit eller delarna måste beställas tar det längre tid. Vi säger till när vi sett släpet.',
      },
    ],
    relatedSlugs: ['bromsservice-slapvagn', 'batslap-service', 'el-belysning-slapvagn'],
    schemaServiceType: 'Hjullagerbyte släpvagn',
    adsGroup: 'Wheel bearings',
  },
  {
    slug: 'bromsservice-slapvagn',
    navLabel: 'Bromsar',
    cardTitle: 'Bromsar & påskjutsbroms',
    cardBlurb: 'Påskjutsbroms, vajrar, bromsbackar och parkeringsbroms.',
    h1: 'Bromsar, påskjutsbroms och handbroms till släpvagn',
    title: 'Bromsservice för släpvagn',
    description:
      'Service av påskjutsbroms, bromsvajrar och parkeringsbroms på släpvagnar och båttrailer. Vi justerar, felsöker och reparerar.',
    heroLead:
      'Problem med bromsarna eller påskjaren? Vi hjälper dig att felsöka, serva och reparera bromsar, vajrar och påskjutsbroms på släpvagnar och trailers i vår verkstad på Värmdö.',
    sections: {
      symptomsTitle: 'Tecken på att bromsarna behöver service',
      symptoms: [
        'Släpet drar snett eller nickar hårt vid inbromsning',
        'Dålig eller ingen bromsverkan',
        'Parkeringsbromsen tar inte eller släpper inte',
        'Vajrar som kärvar, är frätta eller har släppt',
        'Påskjutsbromsen går trögt eller tar inte',
      ],
      whatWeDoTitle: 'Vad vi gör',
      whatWeDo: [
        'Felsöker påskjutsbroms och justerar när det går',
        'Byter bromsvajrar, bromsbackar och andra slitdelar',
        'Ser över parkeringsbroms',
        'Kontrollerar att hjulen rullar fritt efter justering',
        'Kombinerar gärna med lagerkontroll om släpet ändå är uppe',
      ],
      notes: [
        'Bromsar är säkerhet. Om släpet inte bromsar som det ska ska du inte lasta och köra. Ring oss.',
      ],
    },
    faqs: [
      {
        q: 'Hur vet jag att påskjutsbromsen är dålig?',
        a: 'Släpet kan nicka, dra snett, rulla på vid inbromsning eller ha en påskjutsbroms som inte går lätt. Ibland tar handbromsen inte heller.',
      },
      {
        q: 'Kan ni byta bromsvajrar?',
        a: 'Ja. Vajrar som kärvar eller är frätta är ett vanligt jobb, särskilt på släp som står ute.',
      },
      {
        q: 'Tar ni båttrailer med bromsar?',
        a: 'Ja. Vatten och salt sliter extra på bromsar och vajrar på båttrailer.',
      },
      {
        q: 'Behöver jag lämna släpet hela dagen?',
        a: 'Inte alltid. En justering kan gå snabbt. Byte av vajrar eller backar tar längre tid. Vi stämmer av när du hör av dig.',
      },
    ],
    relatedSlugs: ['hjullager-slapvagn', 'el-belysning-slapvagn', 'batslap-service'],
    schemaServiceType: 'Bromsservice släpvagn',
    adsGroup: 'Brakes',
  },
  {
    slug: 'el-belysning-slapvagn',
    navLabel: 'El & belysning',
    cardTitle: 'El & belysning',
    cardBlurb: 'Felsökning av lampor, släpkontakt, jordfel och kablar.',
    h1: 'El och belysning till släpvagn',
    title: 'El och belysning på släpvagn',
    description:
      'Felsökning av belysning, släpkontakt, jordfel och kablar på släpvagnar och båttrailer. Vi hittar felet och lagar det.',
    heroLead:
      'En lampa släckt, säkring som går eller släpkontakt som krånglar. Vi felsöker elen på släpet.',
    sections: {
      symptomsTitle: 'Vanliga elfel på släp',
      symptoms: [
        'En eller flera lampor lyser inte',
        'Blinkers eller bromsljus som strular',
        'Säkring i bilen som går när släpet kopplas i',
        'Fukt eller korrosion i 7-polig eller 13-polig kontakt',
        'Belysning som funkar ibland, särskilt efter regn eller sjösättning',
      ],
      whatWeDoTitle: 'Vad vi gör',
      whatWeDo: [
        'Felsöker belysning, kablar och jord',
        'Byter lampor, kontakter och skadade sladdar',
        'Rensar och lagar släpkontakt',
        'Letar jordfel som tar säkringar i bilen',
        'Kollar att belysningen är hel inför besiktning',
      ],
      notes: [
        'Belysning är ett vanligt skäl till anmärkning vid besiktning. Hör av dig i tid om släpet ska besiktigas.',
      ],
    },
    faqs: [
      {
        q: 'Kan ni felsöka belysningen?',
        a: 'Ja. Det är ett av de vanligaste jobben. Ta med släpet så går vi igenom lampor, kontakt och kablar.',
      },
      {
        q: 'Min bils säkring går – kan det vara släpet?',
        a: 'Ofta. Kortslutning eller dålig jord i släpet tar gärna säkringen i bilen. Vi letar felet på släpet.',
      },
      {
        q: 'Lagar ni både 7-polig och 13-polig kontakt?',
        a: 'Ja, båda förekommer. Säg vilken kontakt du har om du vet, annars ser vi det på plats.',
      },
      {
        q: 'Kan korrosion i kontakten vara orsaken?',
        a: 'Ja, särskilt på släp som står ute eller båttrailer som kommer nära vatten. Kontakt och jord är första stället vi tittar.',
      },
    ],
    relatedSlugs: ['svetsning-slapvagn', 'batslap-service', 'bromsservice-slapvagn'],
    schemaServiceType: 'El och belysning släpvagn',
    adsGroup: 'Electrics',
  },
  {
    slug: 'svetsning-slapvagn',
    navLabel: 'Svetsning',
    cardTitle: 'Svetsning & reparation',
    cardBlurb: 'Fästen, stänkskärmar och andra skador i plåt och rör.',
    h1: 'Svetsning och reparation av släpvagn',
    title: 'Svetsning och reparation av släp',
    description:
      'Vi svetsar och lagar fästen, stänkskärmar och andra skador på släpvagnar. Bedömning på plats i verkstaden på Värmdö.',
    heroLead:
      'Sprucket fäste, bucklad skärm eller löst stöd. Vi bedömer skadan och svetsar när det är rimligt att laga.',
    sections: {
      symptomsTitle: 'Sådant vi ofta lagar',
      symptoms: [
        'Spruckna fästen och konsoler',
        'Stänkskärmar som släppt eller spruckit',
        'Stödben och stöd som slakat',
        'Mindre sprickor i ram och tvärbalkar',
        'Fästen till vinsch, rullar eller stöttor på båttrailer',
      ],
      whatWeDoTitle: 'Hur vi jobbar',
      whatWeDo: [
        'Tittar på skadan innan vi lovar svets',
        'Lagar fästen, skärmar och andra detaljer som går att rädda',
        'Säger till om ramen är så rostig att det inte är värt att laga',
        'Kan ofta kombinera svets med annan service på samma släp',
      ],
      notes: [
        'Vi lovar inte att varje rostig ram går att rädda. Först tittar vi, sedan ger vi ett upplägg.',
        'Vi utför inte karosseriarbete på bilar.',
      ],
    },
    faqs: [
      {
        q: 'Kan ni svetsa mitt släp?',
        a: 'Ofta ja, på fästen, skärmar och liknande. Ring eller skicka en förfrågan, så kan vi säga mer.',
      },
      {
        q: 'Svetsar ni rostskador?',
        a: 'Mindre skador och fästen ja. Genomrostad ram är en annan sak – då säger vi vad som är rimligt i stället för att lova för mycket.',
      },
      {
        q: 'Behöver jag ha med reservdelar?',
        a: 'Inte nödvändigtvis. Har du delar eller vet märke och modell underlättar det. Annars löser vi det efter bedömning.',
      },
      {
        q: 'Kan ni laga stänkskärmar och stödben?',
        a: 'Ja, det är typiska jobb.',
      },
    ],
    relatedSlugs: ['el-belysning-slapvagn', 'batslap-service', 'hjullager-slapvagn'],
    schemaServiceType: 'Svetsning släpvagn',
    adsGroup: 'Welding',
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getRelatedServices(service: Service): Service[] {
  return service.relatedSlugs
    .map((slug) => getService(slug))
    .filter((item): item is Service => Boolean(item));
}

export const reservedSlugs = ['kontakt', 'integritetspolicy', 'tack', 'api'];

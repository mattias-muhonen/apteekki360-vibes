export interface Story {
  name: string;
  description: {
    en: string;
    fi: string;
  };
  story: {
    en: string;
    fi: string;
  };
  message: {
    en: string;
    fi: string;
  };
}

export const stories: Story[] = [
  {
    name: "David P.",
    description: {
      en: "Husband and aspiring marathon runner",
      fi: "Aviomies ja pyrkivä maratonari"
    },
    story: {
      en: "I used to think my heart was fine because I exercised regularly, but something felt off. After a routine check-in, I discovered my cholesterol was higher than it should be. The guidance I received helped me change my diet and training plan. Now, my numbers are great, and I feel confident pushing myself further in my runs.",
      fi: "Luulin sydämeni olevan kunnossa, koska liikuin säännöllisesti, mutta jokin tuntui olevan vialla. Rutiininomaisessa tarkastuksessa huomasin kolesterolin olevan liian korkea. Saamani ohjaus auttoi minua muuttamaan ruokavaliotani ja harjoittelusuunnitelmaani. Nyt lukuni ovat hyvät ja tunnen itseni itsevarmaksi työntämään itseäni pidemmälle juoksuissa."
    },
    message: {
      en: "My message to anyone who thinks they're too fit for a health check is this: don't assume your body is working perfectly. Understanding your health from the inside out is the only way to truly unlock your potential.",
      fi: "Viestini kaikille, jotka luulevat olevansa liian kunnossa terveystarkastukseen: älä oleta kehosi toimivan täydellisesti. Terveytesi ymmärtäminen sisältä päin on ainoa tapa todella vapauttaa potentiaalisi."
    }
  },
  {
    name: "Sarah T.",
    description: {
      en: "Busy professional and mother of one",
      fi: "Kiireinen ammattilainen ja yhden lapsen äiti"
    },
    story: {
      en: "Weight loss always felt like a battle. I'd try a new diet, get frustrated, and fall back into old habits. It wasn't until I focused on understanding my body's unique needs that things clicked. The tailored advice I followed helped me make small, consistent changes that led to big results. It felt like I was working with my body, not against it.",
      fi: "Painonpudotus tuntui aina taistelulta. Kokeilin uutta dieettiä, turhauduin ja palasin vanhoihin tapoihin. Vasta kun keskityin ymmärtämään kehoni ainutlaatuisia tarpeita, asiat naksahtivat paikoilleen. Seuraamani räätälöidyt neuvot auttoivat tekemään pieniä, johdonmukaisia muutoksia, jotka johtivat suuriin tuloksiin. Tuntui kuin olisin työskennellyt kehoni kanssa, en sitä vastaan."
    },
    message: {
      en: "My advice to anyone on a similar journey: it's not about quick fixes. It's about learning what your body needs to thrive. The knowledge you gain is what truly makes the difference.",
      fi: "Neuvoni kaikille samankaltaisella matkalla oleville: kyse ei ole pikakorjauksista. Kyse on siitä, että oppii mitä keho tarvitsee kukoistaakseen. Saamasi tieto on se, mikä todella tekee eron."
    }
  },
  {
    name: "Michael J.",
    description: {
      en: "Artist and night owl",
      fi: "Taiteilija ja yöpöllö"
    },
    story: {
      en: "I spent years believing that tossing and turning at night was just part of who I was. I felt groggy and uninspired, and it was taking a toll on my work and my personal life. By getting to the root of my sleep issues and making simple changes, I've transformed my nights. I fall asleep faster, stay asleep longer, and wake up feeling genuinely rested.",
      fi: "Vietin vuosia uskoen, että yöllinen vääntelehtiminen oli vain osa minua. Tunsin itseni uneliaiksi ja inspiroimattomaksi, ja se vaikutti työhöni ja henkilökohtaiseen elämääni. Menemällä univaikeuteni juurisyihin ja tekemällä yksinkertaisia muutoksia, olen muuttanut yöni. Nukahdan nopeammin, pysyn unessa pidempään ja herään todella levänneenä."
    },
    message: {
      en: "I'd tell anyone struggling with sleep: it's not a character flaw. It's a health issue that can be solved. Don't accept feeling tired as your normal.",
      fi: "Sanoisin kaikille univaikeuksista kärsiville: se ei ole luonteenpiirre. Se on terveysasia, joka voidaan ratkaista. Älä hyväksy väsymystä normaaliksi olotilaksesi."
    }
  },
  {
    name: "Jessica A.",
    description: {
      en: "Freelance writer and dog owner",
      fi: "Freelance-kirjoittaja ja koiranomistaja"
    },
    story: {
      en: "My energy levels were a roller coaster—some days I could barely get out of bed, others I'd crash mid-afternoon. It wasn't just a coffee problem; it was a deeper issue. By analyzing my nutritional habits and getting a clearer picture of my body's inner workings, I finally figured out why I was always drained. Now I have a consistent, steady supply of energy throughout the day.",
      fi: "Energiatasoni olivat kuin vuoristorata - jonakin päivänä tuskin sain itseni sängystä, toisina romahduin keskipäivällä. Se ei ollut vain kahviongelma; se oli syvempi asia. Analysoimalla ravitsemustottumuksiani ja saamalla selkeämmän kuvan kehoni sisäisestä toiminnasta, selvittelin vihdoin miksi olin aina uupunut. Nyt minulla on johdonmukainen, tasainen energiansaanti koko päivän."
    },
    message: {
      en: "My message to others who feel perpetually tired is this: fatigue isn't just in your head. There's a reason for it, and you deserve to find out what it is.",
      fi: "Viestini muille jatkuvasti väsyneille: väsymys ei ole vain päässäsi. Sille on syy, ja ansaitset selvittää mikä se on."
    }
  },
  {
    name: "Brian C.",
    description: {
      en: "Graduate student and tutor",
      fi: "Jatko-opiskelija ja yksityisopettaja"
    },
    story: {
      en: "The pressure of my studies often left me feeling anxious and unable to focus. My mind was always racing, and it was hard to concentrate on a single task. I decided to take a deeper look at my mental health and discovered how nutrition and stress hormones were impacting my brain. I made some adjustments, and now I feel a sense of calm and clarity that allows me to tackle my studies with confidence.",
      fi: "Opintojen paine sai minut usein tuntemaan ahdistusta ja kyvyttömyyttä keskittyä. Mieleni oli aina kiire, ja oli vaikea keskittyä yhteen tehtävään. Päätin tutkia mielenterveyttäni syvemmin ja huomasin, kuinka ravitsemus ja stressihormonit vaikuttivat aivoihini. Tein joitain muutoksia, ja nyt tunnen rauhaa ja selkeyttä, joka antaa minun hoitaa opintoni itsevarmuudella."
    },
    message: {
      en: "To other students or anyone under pressure: prioritizing your mental well-being is the most important study skill you'll ever learn.",
      fi: "Muille opiskelijoille tai kaikille paineen alla oleville: mielenterveyden hyvinvoinnin priorisoiminen on tärkein opiskelutaito, jonka koskaan opit."
    }
  },
  {
    name: "Chloe K.",
    description: {
      en: "Creative director and mother of three",
      fi: "Luova johtaja ja kolmen lapsen äiti"
    },
    story: {
      en: "For years, I just thought feeling moody and bloated was part of being a woman. I'd have days where I felt totally unlike myself, and it impacted my family and my work. A health expert helped me understand how my hormones were fluctuating and how I could support my body. The difference has been incredible. I feel like myself again—steady, energetic, and happy.",
      fi: "Vuosia luulin, että mielialanvaihtelut ja turvotus olivat vain osa naiseutta. Minulla oli päiviä, jolloin tunsin itseni täysin erilaiseksi, ja se vaikutti perheeseeni ja työhöni. Terveysasiantuntija auttoi minua ymmärtämään, kuinka hormonini vaihtelivat ja kuinka voisin tukea kehoani. Ero on ollut uskomaton. Tunnen taas itseni itsekseni - tasapainoiseksi, energiseksi ja onnelliseksi."
    },
    message: {
      en: "I want to say to other women: you don't have to just accept feeling 'off.' There are real, tangible ways to understand your body better and feel balanced again.",
      fi: "Haluan sanoa muille naisille: sinun ei tarvitse vain hyväksyä 'huonoa' oloa. On olemassa todellisia, konkreettisia tapoja ymmärtää kehoasi paremmin ja tuntea tasapaino jälleen."
    }
  },
  {
    name: "Liam F.",
    description: {
      en: "Competitive cyclist",
      fi: "Kilpapyöräilijä"
    },
    story: {
      en: "I was training hard, but I kept hitting a wall. My performance would plateau, and recovery felt like a drag. The key wasn't to train harder, but to train smarter. By looking at my body's data, I learned exactly what nutrients I was missing and how to optimize my recovery. Now I'm faster, stronger, and bounce back quicker after a long ride.",
      fi: "Harjoittelin kovaa, mutta törmäsin aina seinään. Suorituskykyni tasaantui, ja palautuminen tuntui raskaalta. Avain ei ollut harjoitella kovemmin vaan älykkäämmin. Tarkastelemalla kehoni dataa opin tarkalleen mitä ravintoaineita minulta puuttui ja kuinka optimoida palautumiseni. Nyt olen nopeampi, vahvempi ja toivun nopeammin pitkän ajon jälkeen."
    },
    message: {
      en: "My advice for any athlete: data doesn't lie. Using it to inform your training is the ultimate performance enhancer.",
      fi: "Neuvoni kaikille urheilijoille: data ei valehtele. Sen käyttäminen harjoittelun ohjaamiseen on paras suorituskyvyn parantaja."
    }
  },
  {
    name: "Olivia B.",
    description: {
      en: "Retired librarian and gardener",
      fi: "Eläkkeellä oleva kirjastonhoitaja ja puutarhuri"
    },
    story: {
      en: "My joint pain was getting so bad that I thought I'd have to give up my favorite hobby, gardening. After a while, I decided to seek professional help, and it was a revelation. We found the root cause and a new regimen that, while not a cure, has significantly reduced my pain. I'm back in my garden, and the joy I feel is immeasurable.",
      fi: "Nivelsärkyni pahenivat niin paljon, että luulin joutuvan luopumaan lempiharrastuksestani, puutarhanhoidosta. Jonkin ajan kuluttua päätin hakea ammattiapua, ja se oli ilmestys. Löysimme juurisyyn ja uuden hoito-ohjelman, joka ei ole parannus, mutta on merkittävästi vähentänyt kipuani. Olen takaisin puutarhassani, ja tuntemani ilo on mittaamaton."
    },
    message: {
      en: "If you're suffering from chronic pain, don't give up. There are solutions out there, and finding them can give you your life back.",
      fi: "Jos kärsit kroonisesta kivusta, älä luovuta. Ratkaisuja on olemassa, ja niiden löytäminen voi antaa elämäsi takaisin."
    }
  },
  {
    name: "Ethan G.",
    description: {
      en: "Gourmet chef",
      fi: "Gourmet-kokki"
    },
    story: {
      en: "Working in a high-stress kitchen, my diet was a mess, and my gut health was paying the price. I constantly felt bloated and uncomfortable. I decided to get serious about understanding my digestive system. A deep dive into my gut health gave me the information I needed to make changes to my diet, and it has completely changed my life. I feel lighter, and my stomach issues are gone.",
      fi: "Työskennellessäni stressaavassa keittiössä ruokavalioni oli sekaisin, ja suoliston terveyteni kärsi. Tunsin itseni jatkuvasti turvonneeksi ja epämukavaksi. Päätin ottaa ruoansulatusjärjestelmäni ymmärtämisen vakavasti. Suoliston terveyden syvällinen tutkiminen antoi minulle tarvitsemani tiedon ruokavalion muuttamiseksi, ja se on muuttanut elämäni täysin. Tunnen itseni kevyemmäksi, ja mahavaikeuteni ovat poissa."
    },
    message: {
      en: "My advice to fellow food lovers: you can't be a master chef if you don't treat your own body like a temple.",
      fi: "Neuvoni ruoan ystäville: et voi olla mestarikokki, jos et kohtele omaa kehoasi kuin temppeliä."
    }
  },
  {
    name: "Maria S.",
    description: {
      en: "New business owner",
      fi: "Uusi yrittäjä"
    },
    story: {
      en: "When I started my own business, I knew I needed to be at the top of my game, both mentally and physically. I took a proactive approach to my health, getting a full check-up to see what was happening on a deeper level. I found out I had some minor deficiencies and was able to address them before they became bigger problems. Now I feel confident and ready to take on anything.",
      fi: "Kun aloitin oman yritykseni, tiesin että minun piti olla parhaimmillani sekä henkisesti että fyysisesti. Otin ennakoivan lähestymistavan terveyteeni, kävin täydellisessä tarkastuksessa nähdäkseni mitä syvemmällä tasolla tapahtui. Sain selville, että minulla oli pieniä puutoksia ja pystyin korjaamaan ne ennen kuin niistä tuli suurempia ongelmia. Nyt tunnen itseni itsevarmaksi ja valmiiksi ottamaan vastaan mitä tahansa."
    },
    message: {
      en: "I would tell other entrepreneurs: investing in your health is the best business decision you can make. It's the foundation for everything else you want to achieve.",
      fi: "Sanoisin muille yrittäjille: terveyteen sijoittaminen on paras liiketoimintapäätös, jonka voit tehdä. Se on perusta kaikelle muulle, mitä haluat saavuttaa."
    }
  }
];

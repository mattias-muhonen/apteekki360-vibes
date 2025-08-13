export interface Product {
  name: string;
  price: string;
  description: string | null;
  image_url: string | null;
}

export const products: Product[] = [
  {
    "name": "Harmonia Ksm66",
    "price": "18,89 €",
    "description": "Harmonia Ksm66 on ravintolisä, joka sisältää kliinisesti dokumentoitua KSM66® ashwagandha-uutetta, suunniteltu tukemaan stressinhallintaa ja edistämään henkistä tasapainoa. Sen luonnolliset ainesosat auttavat parantamaan unen laatua ja energiatasoja. Yksinkertainen tapa lisätä hyvinvointia arkeen. Sisältää KSM66® ashwagandha-uutetta Auttaa hallitsemaan stressiä ja edistää rentoutumista Tukee henkistä vireyttä ja tasapainoa Edesauttaa hyvän unen saamista Kehitetty tukemaan toipumista stressaavista tilanteista Koe tasapainoisen elämän voima ja lisää Harmonia Ksm66 päivittäiseen rutiiniisi. Ota askel kohti rauhallisempaa arkea!",
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-harmonia-ksm66-2416568-220380.jpg?v=1746473077&width=1080"
  },
  {
    "name": "Sininen Uni Valeriaana-Teaniini",
    "price": "12,66 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-sininen-uni-valeriaana-teaniini-9233375-382688.jpg?v=1746472605&width=1080"
  },
  {
    "name": "Sedix Tabletti 200 mg",
    "price": "17,90 €",
    "description": "Sedix Tabletti 200 mg on perinteinen kasvirohdosvalmiste, joka sisältää kuivattua kärsimyskukkauutetta (Passiflora incarnata L.). Sen käyttö perustuu pitkään traditioon lievittää lievää henkistä stressiä ja hermostuneisuutta sekä helpottaa nukahtamista aikuisilla ja yli 12-vuotiailla lapsilla. Sedix ja melatoniini ovat suosittuja luonnollisia vaihtoehtoja henkisen hyvinvoinnin tukemiseen. Sisältää kuivattua kärsimyskukkauutetta Tarkoitettu lievittämään lievää henkistä stressiä ja hermostuneisuutta Helpottaa nukahtamista Käyttö aikuisille ja yli 12-vuotiaille lapsille Koe luonnollinen tapa tukea henkistä hyvinvointiasi ja parantaa unen laatua. Tutustu Sedix Tablettiin jo tänään!",
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-sedix-tabletti-200-mg-156375-749275.jpg?v=1746472488&width=1080"
  },
  {
    "name": "Sedonium 300 mg Tabletti, Päällystetty (Rohtovirmajuuri/Valeriana)",
    "price": "18,55 €",
    "description": "Sedonium on kasvirohdosvalmiste, joka sisältää valeriaanaa eli rohtovirmajuurta, ja sitä käytetään tilapäisten lievien jännitystilojen ja unensaantivaikeuksien hoitoon. Alle 12-vuotiaiden ja pitkäaikaiseen käyttöön vain lääkärin ohjeen mukaan. Lue tarkemmat tuotetiedot alta. Sisältää 300 mg valeriaanaa (rohtovirmajuuri) Tarkoitettu tilapäisten jännitystilojen lievitykseen Auttaa tilapäisiin unensaantivaikeuksiin",
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-sedonium-300-mg-tabletti-paallystetty-rohtovirmajuurivaleriana-084396-661798.jpg?v=1746474265&width=1080"
  },
  {
    "name": "Lunixen 500 mg Tabl, Kalvopääll",
    "price": "22,46 €",
    "description": "Lunixen 500 Mg Tabl, Kalvopääll on kasviperäinen valmiste, joka sisältää rohtovirmajuurta (Valeriana officinal L., radix) ja on suunniteltu lievittämään lievää hermostuneisuutta sekä unihäiriöitä aikuisilla ja yli 12-vuotiailla. Valmisteen rauhoittava vaikutus kehittyy vähitellen, joten pitkäaikainen käyttö 2–4 viikon ajan on suositeltavaa parhaan tuloksen saavuttamiseksi. Lue pakkausseloste huolellisesti ennen käyttöä, ja mikäli oireet jatkuvat, ota yhteys terveydenalan ammattilaiseen. Vähentää lievää hermostuneisuutta ja unihäiriöitä. Sopii aikuisille ja yli 12-vuotiaille. Sisältää rauhoittavaa rohtovirmajuurta. Ei sovellu akuutteihin tilanteisiin, vaan jatkuvaan käyttöön. Helppo annostella: 1 tabletti 1-3 kertaa päivässä tai tarvittaessa ennen nukkumaanmenoa. Aloita matkasi kohti levollisempia öitä Lunixenin avulla ja koe rohtovirmajuuren luonnollinen rauhoittava vaikutus.",
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-lunixen-500-mg-tabl-kalvopaall-553096-221818.jpg?v=1746472551&width=1080"
  },
  {
    "name": "Bertils No Stress, Stressinhallintaan",
    "price": "21,90 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-bertils-no-stress-stressinhallintaan-9509560-179628.png?v=1746472418&width=1080"
  },
    {
    "name": "Panasonic Pr 13",
    "price": "7,69 €",
    "description": "Panasonic Pr 13 -kuulokojeparisto on suunniteltu nykyaikaisiin kuulolaitteisiin, tarjoten vakaan tehon 1,4V jännitteellä. Se tukee laitteen optimaalista toimintaa ilman häiriöitä. Paristo on erinomainen valinta p.r. lääke -käyttöön. Vakaa 1,4V jännite Sopii moderniin kuulokojeteknologiaan Luotettava ja pitkäkestoinen teho Valitse Panasonic Pr 13 ja koe kuulokojeesi täysi potentiaali. Tilaa nyt ja huomaa ero arjessasi.",
    "image_url": "https://apteekki360.fi/cdn/shop/files/apteekki-360-panasonic-pr-13-1434794-309468.jpg?v=1746476728&width=1080"
  },
  {
    "name": "O.B. Procomfort Normal",
    "price": "5,00 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/files/apteekki-360-ob-procomfort-normal-2060192-247804.jpg?v=1746476727&width=1080"
  },
  {
    "name": "O.B. Procomfort Super",
    "price": "5,00 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/files/apteekki-360-ob-procomfort-super-2060341-949086.jpg?v=1746476727&width=1080"
  },
  {
    "name": "Mesoft Kuitutaitos 10X10cm Epäster.",
    "price": "4,38 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-mesoft-kuitutaitos-10x10cm-epaster-210302-150117.jpg?v=1746476729&width=1080"
  },
  {
    "name": "Tummeli Antiseptinen Hoitovoide",
    "price": "alk. 6,09 €",
    "description": "Tummeli antiseptinen hoitovoide on suunniteltu auttamaan ihon hyvinvoinnin ylläpitämisessä. Se on hajusteeton voide, joka sopii kaikille ihotyypeille, erityisesti kuivalle iholle. Tummeli voide pehmentää rohtunutta ihoa ja kovettumia tehokkaasti. Hajusteeton: Ei sisällä hajusteita, joten se sopii herkälle iholle. Monipuolinen: Sopii kaikille ihotyypeille, erityisesti kuivaihoisille. Kosteuttava: Pitää ihon pehmeänä ja joustavana. Kokeile Tummeli voidetta ja anna ihollesi sen ansaitsema hoito. Tilaa nyt ja koe ero ihosi pehmeydessä.",
    "image_url": "https://apteekki360.fi/cdn/shop/files/apteekki-360-tummeli-antiseptinen-hoitovoide-309674-172411.jpg?v=1746476722&width=1080"
  },
  {
    "name": "Z-Pinsetti Punkinpoistoon",
    "price": "20,40 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/files/apteekki-360-z-pinsetti-punkinpoistoon-8011696-394695.png?v=1746476721&width=1080"
  },
  {
    "name": "Sarvikuono Nenänhuuhtelukannu Punainen",
    "price": "8,25 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/files/apteekki-360-sarvikuono-nenanhuuhtelukannu-punainen-1918945-594471.webp?v=1746476600&width=1080"
  },
  {
    "name": "Apteekki Kynsisakset Taivutettu Kärki",
    "price": "5,48 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/files/apteekki-360-apteekki-kynsisakset-taivutettu-karki-9203323-528102.png?v=1746476602&width=1080"
  },
  {
    "name": "Hansaplast Classic Kiinn.Teippi 5Mx2,5cm Me10",
    "price": "3,44 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-hansaplast-classic-kiinnteippi-5mx25cm-me10-2121382-287359.png?v=1746476599&width=1080"
  },
  {
    "name": "Leukofix Muoviteippi 1.25cm X 5M",
    "price": "37,75 €",
    "description": null,
    "image_url": null
  },
  {
    "name": "Xyliderm Geeli kuivalle ja atooppiselle iholle",
    "price": "alk. 11,95 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-xyliderm-geeli-kuivalle-ja-atooppiselle-iholle-8005013-266416.jpg?v=1746476597&width=1080"
  },
  {
    "name": "Listerine Total",
    "price": "alk. 2,05 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-listerine-total-2044899-466464.jpg?v=1746476590&width=1080"
  },
  {
    "name": "Microlax - Peräruiskeliuos ummetukseen",
    "price": "alk. 7,92 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/files/apteekki-360-microlax-peraruiskeliuos-ummetukseen-507813-969699.webp?v=1746476591&width=1080"
  },
  {
    "name": "Zyrtec 10 mg/ml Tipat, Liuos",
    "price": "21,93 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-zyrtec-10-mgml-tipat-liuos-105124-140104.jpg?v=1746476588&width=1080"
  },
  {
    "name": "Aspirin Zipp 500 mg Rakeet Annospussi",
    "price": "alk. 5,69 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-aspirin-zipp-500-mg-rakeet-annospussi-015015-744616.jpg?v=1746476587&width=1080"
  },
  {
    "name": "Aspirin 500 mg Tabl",
    "price": "alk. 5,48 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-aspirin-500-mg-tabl-196774-374969.jpg?v=1746476588&width=1080"
  },
  {
    "name": "Panadol 125 mg Peräpuikko",
    "price": "5,93 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-panadol-125-mg-perapuikko-533406-482655.jpg?v=1746476490&width=1080"
  },
  {
    "name": "Corega 3Min Tabs Hammasproteesin Puhdistustabletti",
    "price": "5,26 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-corega-3min-tabs-hammasproteesin-puhdistustabletti-2132017-205357.jpg?v=1746476480&width=1080"
  },
  {
    "name": "Mefix Kiinnit.Materiaali 5cm x 2,5M 310570",
    "price": "3,50 €",
    "description": null,
    "image_url": null
  },
  {
    "name": "Needs Lasiviila",
    "price": "8,27 €",
    "description": null,
    "image_url": null
  },
  {
    "name": "Panadol Coffein 65 mg/500 mg Tabl, Kalvopääll",
    "price": "alk. 5,24 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-panadol-coffein-65-mg500-mg-tabl-kalvopaall-563718-233310.jpg?v=1746476364&width=1080"
  },
  {
    "name": "Yotuel Suuvesi",
    "price": "9,25 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-yotuel-suuvesi-320971-177395.jpg?v=1746476356&width=1080"
  },
  {
    "name": "Yotuel Breath Spray",
    "price": "5,42 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-yotuel-breath-spray-336908-962398.jpg?v=1746476356&width=1080"
  },
  {
    "name": "Novalan",
    "price": "alk. 2,70 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-novalan-9281665-256929.jpg?v=1746476355&width=1080"
  },
  {
    "name": "Ceralan Perusvoide",
    "price": "alk. 4,31 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-ceralan-perusvoide-9280466-921942.jpg?v=1746476356&width=1080"
  },
  {
    "name": "Aqualan L",
    "price": "alk. 2,56 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-aqualan-l-9279960-413772.jpg?v=1746476359&width=1080"
  },
  {
    "name": "Aqualan",
    "price": "alk. 2,56 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-aqualan-9280004-157565.jpg?v=1746476355&width=1080"
  },
  {
    "name": "Otrivin Säilytysaineeton 0,5 mg/ml Nenäsumute, Liuos",
    "price": "7,24 €",
    "description": null,
    "image_url": "https://apteekki360.fi/cdn/shop/products/apteekki-360-otrivin-sailytysaineeton-05-mgml-nenasumute-liuos-433136-668807.jpg?v=1746476353&width=1080"
  }
];

export default products;
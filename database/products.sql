DROP TABLE IF EXISTS `products`;

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `imageurls` JSON NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `rating` DECIMAL(2,1) DEFAULT 0.0,
  `price` INT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`imageurls`, `title`, `description`, `rating`, `price`, `category`) VALUES
(
  '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800", "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800"]',
  'Fitnesz Okosóra Pro',
  'A Fitnesz Okosóra Pro a legmodernebb technológiát ötvözi az elegáns dizájnnal, hogy a legjobb fitness élményt nyújtsa számodra. Ez a prémium okosóra kifejezetten azoknak készült, akik komolyan veszik az egészségüket és szeretnék nyomon követni minden egyes lépésüket, pulzusukat és alvási szokásaikat. A beépített GPS rendszernek köszönhetően pontosan méri a megtett távolságot futás vagy kerékpározás közben, míg a fejlett pulzusmérő folyamatosan figyeli a szívritmusodat, még edzés közben is. Az alváskövetési funkció részletes elemzést ad az alvásminőségedről, beleértve a mély alvás és REM fázisokat is. A vízálló kialakításnak köszönhetően akár úszás közben is viselheted, így soha nem kell aggódnod az időjárás vagy a víz miatt. Az akkumulátor üzemideje akár 7 napig is kitart egyetlen töltéssel, ami azt jelenti, hogy nem kell naponta töltened. A nagy felbontású AMOLED kijelző még erős napfényben is jól olvasható, és a személyre szabható óralapoknak köszönhetően mindig a saját stílusodhoz igazíthatod. Kompatibilis Android és iOS eszközökkel egyaránt, és a dedikált alkalmazás segítségével részletes statisztikákat és elemzéseket kaphatsz a teljesítményedről.',
  4.8,
  45990,
  'Okosórák'
),
(
  '["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800"]',
  'Sport Okosóra Lite',
  'A Sport Okosóra Lite a tökéletes választás azoknak, akik aktív életmódot folytatnak és szeretnének egy megbízható társat az edzéseikhez. Ez a könnyű és kényelmes okosóra úgy lett tervezve, hogy a lehető legkevésbé zavarja a mozgást, miközben minden fontos adatot rögzít. A beépített GPS nyomkövetés pontosan rögzíti az útvonaladat futás, kerékpározás vagy túrázás közben, így később visszanézheted, merre jártál és milyen tempóban haladtál. A pulzusmérő folyamatosan monitorozza a szívritmusodat, és figyelmeztet, ha az túl magas vagy alacsony lenne. Az edzésmódok széles választéka lehetővé teszi, hogy pontosan azt a sportágat válaszd, amit éppen űzöl, legyen az futás, úszás, jóga vagy akár súlyemelés. A vízállóság IP68 besorolású, ami azt jelenti, hogy akár 50 méter mélységig is viselheted víz alatt. Az intelligens értesítések segítségével a telefonod értesítéseit közvetlenül az órádon olvashatod, így nem kell folyton a zsebedbe nyúlnod. A Sport Okosóra Lite hosszú akkumulátor élettartammal rendelkezik, akár 10 napig is bírja egyetlen töltéssel normál használat mellett.',
  4.5,
  32990,
  'Okosórák'
),
(
  '["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800", "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800"]',
  'Klasszikus Fitnesz Karkötő',
  'A Klasszikus Fitnesz Karkötő az ideális belépő szintű fitness tracker azoknak, akik most ismerkednek a viselhető technológiával, vagy egyszerűen csak egy egyszerű, megbízható eszközt keresnek a napi aktivitásuk követésére. Ez az elegáns karkötő diszkréten illeszkedik a csuklódra, és szinte észrevétlenül végzi a dolgát egész nap. A lépésszámláló pontosan méri minden egyes lépésedet, míg a kalóriaszámláló segít nyomon követni, mennyi energiát égettél el a nap folyamán. A távolságmérő funkció kiszámolja, hány kilométert tettél meg gyalog vagy futva. Az alvásmonitor rögzíti az alvási mintáidat, és segít megérteni, hogyan alszol éjszakánként. A csendes ébresztő funkció finoman rezegve ébreszt, anélkül hogy megzavarnád a melletted alvókat. Az OLED kijelző éles és jól olvasható, és egyetlen gombnyomással váltogathatsz a különböző megjelenítési módok között. Az akkumulátor akár 14 napig is bírja, és a töltés mindössze 2 órát vesz igénybe. A karkötő vízálló, így zuhanyzás közben sem kell levenned.',
  4.2,
  15990,
  'Okosórák'
),
(
  '["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800", "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800", "https://images.unsplash.com/photo-1609695675815-f838d1c0e3fd?w=800", "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800"]',
  'Prémium Telefontok - iPhone',
  'A Prémium Telefontok az iPhone készülékek tökéletes védelmét biztosítja, miközben megőrzi a telefon elegáns megjelenését. Ez a tok a legmagasabb minőségű anyagokból készült, hogy maximális védelmet nyújtson az ütések, karcolások és esések ellen. A tok külső héja ütésálló polikarbonátból készült, míg a belső része puha mikroszálas anyaggal van bélelve, ami megvédi a telefon hátlapját a karcolásoktól. A precíz kivágások biztosítják a könnyű hozzáférést minden gombhoz, porthoz és funkcióhoz. A tok vékony profilja azt jelenti, hogy alig növeli a telefon méretét, így továbbra is kényelmesen elfér a zsebedben vagy a táskádban. A csúszásmentes textúra biztos fogást biztosít, így kisebb az esélye, hogy kicsúszik a kezedből. A tok kompatibilis a vezeték nélküli töltéssel, így nem kell levenned töltés közben. Többféle színben és mintában elérhető, így biztosan találsz olyat, ami illik a stílusodhoz. A Prémium Telefontok nem csak védelmet nyújt, hanem stílusos kiegészítője is lesz a mindennapjaidnak.',
  4.6,
  8990,
  'Telefon kiegészítők'
),
(
  '["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800", "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=800", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800"]',
  'Vezeték nélküli Töltő Állvány',
  'A Vezeték nélküli Töltő Állvány a modern otthon vagy iroda nélkülözhetetlen kiegészítője, amely elegáns megoldást kínál az okostelefonod és okosórád töltésére. Ez az innovatív töltőállvány egyszerre képes tölteni a telefonodat és az okosórádat, így kevesebb kábellel és rendetlenséggel kell foglalkoznod. A 15W gyorstöltés támogatásnak köszönhetően a telefonod villámgyorsan feltöltődik, akár 50%-ot is elérhet mindössze 30 perc alatt a kompatibilis készülékeken. Az állvány kialakítása lehetővé teszi, hogy álló vagy fekvő helyzetben is használd a telefonodat töltés közben, így kényelmesen nézhetsz videókat vagy használhatod FaceTime-ot. A beépített biztonsági funkciók megvédik a készülékeidet a túltöltéstől, túlmelegedéstől és rövidzárlattól. Az elegáns, minimalista dizájn bármilyen környezetbe beleillik, legyen az a hálószobád éjjeliszekrénye vagy az íróasztalod. A csúszásmentes alap stabilan tartja a töltőt a helyén, míg a szilikonos felület megvédi a telefonodat a karcolásoktól. Kompatibilis az összes Qi szabványt támogató készülékkel.',
  4.4,
  12990,
  'Telefon kiegészítők'
),
(
  '["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800", "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"]',
  'Bluetooth Fülhallgató Sport',
  'A Bluetooth Fülhallgató Sport kifejezetten aktív emberek számára készült, akik nem akarnak lemondani a kiváló hangminőségről edzés közben sem. Ezek a vezeték nélküli fülhallgatók ergonomikus kialakításuknak köszönhetően tökéletesen illeszkednek a fülbe, és még a legintenzívebb mozgás közben sem esnek ki. A speciális sport füldugók különböző méretekben érhetők el, így biztosan megtalálod a számodra legkényelmesebbet. Az IPX7 vízállósági besorolás azt jelenti, hogy nem kell aggódnod az izzadságtól vagy az esőtől, sőt, akár rövid ideig víz alá is merülhetnek anélkül, hogy károsodnának. A Bluetooth 5.2 technológia stabil és gyors kapcsolatot biztosít a telefonoddal, akár 15 méter távolságból is. A hangminőség lenyűgöző, mély basszusokkal és tiszta magasságokkal, amelyek motiválnak az edzés során. A beépített mikrofon lehetővé teszi a handsfree hívásokat, így nem kell megszakítanod az edzést egy fontos hívás miatt. Az akkumulátor 8 órás folyamatos zenehallgatást tesz lehetővé, és a töltőtokkal együtt akár 32 órányi üzemidőt kapsz. Az érintésvezérlés segítségével könnyedén vezérelheted a zenét és a hívásokat.',
  4.7,
  24990,
  'Fülhallgatók'
),
(
  '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800", "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800"]',
  'Prémium Fejhallgató ANC',
  'A Prémium Fejhallgató ANC a hangélmény csúcsa, amely aktív zajszűrő technológiájával teljesen új dimenzióba emeli a zenehallgatást. Ez a fejhallgató azoknak készült, akik nem hajlandók kompromisszumot kötni a hangminőség terén, és szeretnék kizárni a külvilág zaját, hogy teljes mértékben elmerülhessenek a zenében. Az aktív zajszűrés (ANC) fejlett algoritmusokat használ a környezeti zajok kioltására, legyen szó a repülőgép motorjának zajáról, a forgalomról vagy az iroda háttérzajáról. A 40 mm-es egyedi hangszórók kristálytiszta hangzást biztosítanak a teljes frekvenciatartományban, a mély, dús basszusoktól a csillogó magasságokig. A memóriahabos fülpárnák órákon át tartó kényelmet nyújtanak, és tökéletesen szigetelnek a külső zajoktól. A fejhallgató összehajtható kialakítása megkönnyíti a szállítást, és a mellékelt prémium hordtáska védelmet nyújt útközben. Az akkumulátor lenyűgöző 30 órás üzemidőt biztosít bekapcsolt ANC mellett is, és a gyorstöltésnek köszönhetően 10 perc töltéssel 3 órányi zenehallgatást kapsz. A többpontos Bluetooth kapcsolat lehetővé teszi, hogy egyszerre két eszközhöz csatlakozz.',
  4.9,
  89990,
  'Fülhallgatók'
),
(
  '["https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800", "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800", "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800"]',
  'Hordozható Powerbank 20000mAh',
  'A Hordozható Powerbank 20000mAh a megbízható energiaforrás, amelyre számíthatsz, amikor a legjobban szükséged van rá. Ez a nagy kapacitású külső akkumulátor elegendő energiát tárol ahhoz, hogy akár 4-5 alkalommal is teljesen feltöltse az okostelefonodat, vagy kétszer az iPad-edet. A két USB kimenet lehetővé teszi, hogy egyszerre két készüléket tölts, így te és a barátod is feltölthetitek a telefonotokat egyidejűleg. Az USB-C port kétirányú töltést támogat, ami azt jelenti, hogy ugyanazon a porton keresztül töltheted a powerbanket és a készülékeidet is. A Quick Charge 3.0 és a Power Delivery támogatásnak köszönhetően a kompatibilis készülékek villámgyorsan feltöltődnek. Az intelligens töltésvezérlés automatikusan felismeri a csatlakoztatott készüléket és optimalizálja a töltési sebességet. A LED kijelző valós időben mutatja a powerbank töltöttségi szintjét, így mindig tudod, mennyi energia maradt. A kompakt, de masszív kialakítás ellenáll a mindennapi használat viszontagságainak, és kényelmesen elfér a táskádban vagy a zsebedben.',
  4.3,
  11990,
  'Telefon kiegészítők'
),
(
  '["https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800", "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800"]',
  'Okos Mérleg WiFi',
  'Az Okos Mérleg WiFi nem csupán egy egyszerű mérleg, hanem egy komplett testösszetétel-elemző eszköz, amely segít jobban megérteni a tested és nyomon követni a fitness céljaid felé tett előrehaladásodat. A bioelektromos impedancia analízis (BIA) technológia segítségével a mérleg nem csak a testsúlyodat méri, hanem 13 különböző testösszetétel mutatót is elemez, beleértve a testzsír százalékot, izomtömeget, csonttömeget, víztartalmat, zsigeri zsírt és az alapanyagcserét. A WiFi kapcsolatnak köszönhetően az adatok automatikusan szinkronizálódnak a felhőbe, és a dedikált alkalmazásban részletes grafikonok és trendek segítenek nyomon követni a változásokat. A mérleg akár 8 különböző felhasználó adatait is képes tárolni és automatikusan felismeri, ki áll rá. A nagy, edzett üveg felület elegáns megjelenést kölcsönöz, és könnyen tisztítható. A jól látható LED kijelző még gyenge fényviszonyok között is jól olvasható. Az alkalmazás kompatibilis az Apple Health, Google Fit és Fitbit alkalmazásokkal, így az összes egészségügyi adatod egy helyen lehet. A mérleg akár 180 kg-ig pontos mérést biztosít.',
  4.5,
  18990,
  'Fitness eszközök'
),
(
  '["https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800", "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800"]',
  'Futóöv Telefontartóval',
  'A Futóöv Telefontartóval a futók és aktív emberek nélkülözhetetlen kiegészítője, amely lehetővé teszi, hogy kényelmesen és biztonságosan magaddal vidd a telefonodat, kulcsaidat és egyéb apróságaidat edzés közben. Az ergonomikus kialakítás biztosítja, hogy az öv stabilan a helyén maradjon még a legintenzívebb mozgás közben is, anélkül hogy pattogna vagy csúszkálna. A vízálló telefontartó zseb megvédi a telefonodat az izzadságtól és a könnyű esőtől, miközben az érintőképernyő továbbra is használható a speciális anyagon keresztül. Az állítható derékpánt 65-110 cm-es derékbőséghez igazítható, így szinte mindenkinek megfelel. A fényvisszaverő elemek fokozzák a láthatóságodat sötétben vagy rossz látási viszonyok között, növelve a biztonságodat esti futás közben. A légáteresztő anyag minimalizálja az izzadást a bőr és az öv között. A kiegészítő zsebek alkalmasak kulcsok, bankkártyák vagy energiaszeletek tárolására. Az öv rendkívül könnyű, mindössze 80 gramm, így szinte észre sem veszed, hogy viseled. Géppel mosható az egyszerű tisztítás érdekében.',
  4.1,
  6990,
  'Fitness eszközök'
),
(
  '["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800"]',
  'Luxus Okosóra Arany',
  'A Luxus Okosóra Arany az elegancia és a technológia tökéletes ötvözete, amely azoknak készült, akik nem hajlandók kompromisszumot kötni sem a stílus, sem a funkcionalitás terén. Ez az exkluzív okosóra prémium anyagokból készült, az arany színű rozsdamentes acél tok és a hozzá illő fém szíj tartós szépséget és időtlen eleganciát sugároz. A zafírüveg kijelzővédő rendkívül ellenálló a karcolásokkal szemben, így az óra évek múlva is olyan szép lesz, mint új korában. A nagy felbontású AMOLED kijelző élénk színeket és mély feketéket produkál, és az always-on display funkciónak köszönhetően mindig láthatod az időt anélkül, hogy fel kellene ébresztened az órát. A fejlett egészségügyi funkciók közé tartozik a folyamatos pulzusmérés, véroxigén szint monitorozás, EKG mérés és stressz szint követés. Az óra támogatja a contactless fizetést is, így a telefonod nélkül is fizethetsz az üzletekben. A prémium bőr szíj és egy sport szilikon szíj is jár hozzá, így minden alkalomra a megfelelő megjelenést választhatod. A 5ATM vízállóság azt jelenti, hogy úszás közben is viselheted.',
  4.8,
  129990,
  'Okosórák'
),
(
  '["https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800", "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800", "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800"]',
  'Autós Telefontartó Szellőzőre',
  'Az Autós Telefontartó Szellőzőre a legpraktikusabb megoldás a telefonod biztonságos rögzítésére vezetés közben. Ez a univerzális tartó egyszerűen és gyorsan felszerelhető bármilyen autó szellőzőrácsára, erős kapcsokkal, amelyek stabilan tartják a helyén még rázós utakon is. A 360 fokos forgatható gömbcsukló lehetővé teszi, hogy a telefonodat pontosan olyan szögben állítsd be, ami a legkényelmesebb a számodra, legyen szó álló vagy fekvő tájolásról. Az egykezes kezelés azt jelenti, hogy könnyedén behelyezheted és kiveheted a telefonodat egyetlen kézzel, ami különösen fontos vezetés közben. A puha szilikon párnák megvédik a telefonodat a karcolásoktól, miközben stabilan tartják a helyén. A tartó kompatibilis szinte minden okostelefonnal, 4-7 colos képátlóig, beleértve a nagyobb méretű készülékeket is, mint a iPhone Pro Max vagy a Samsung Ultra modellek. A kompakt kialakítás nem takarja el a szellőzőnyílást, így a klíma vagy a fűtés továbbra is zavartalanul működik. A tartó nem zavarja a telefonod vezeték nélküli töltését sem a kompatibilis autós töltőkkel.',
  4.0,
  4990,
  'Telefon kiegészítők'
),
(
  '["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800", "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800"]',
  'USB-C Gyorstöltő Kábel',
  'Az USB-C Gyorstöltő Kábel a megbízható és gyors töltés záloga, amely prémium anyagokból készült a maximális tartósság érdekében. Ez a 2 méter hosszú kábel elegendő szabadságot biztosít, hogy kényelmesen használd a telefonodat töltés közben, akár az ágyadban fekve is. A fonott nylon borítás nem csak elegánsan néz ki, hanem rendkívül ellenálló is a hajlításokkal és törésekkel szemben, így akár ötször tovább bírja, mint a hagyományos kábelek. A kábel támogatja a Power Delivery 3.0 és Quick Charge 4.0 szabványokat, ami azt jelenti, hogy a kompatibilis készülékeket a lehető leggyorsabban képes tölteni, akár 100W teljesítménnyel is. Az aluinium csatlakozóházak tartósak és korróziógátló bevonattal rendelkeznek. A kábel nem csak töltésre, hanem adatátvitelre is alkalmas, akár 480 Mbps sebességgel. Kompatibilis az összes USB-C porttal rendelkező készülékkel, beleértve az okostelefonokat, tableteket, laptopokat és Nintendo Switch-et is. A praktikus tépőzáras kábelrendező segít rendben tartani a kábelt, amikor nem használod.',
  4.4,
  3990,
  'Telefon kiegészítők'
),
(
  '["https://images.unsplash.com/photo-1608156639585-b3a776f3a4c0?w=800", "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800", "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800"]',
  'Digitális Ugrókötél',
  'A Digitális Ugrókötél a modern fitness edzések nélkülözhetetlen eszköze, amely ötvözi a hagyományos ugrókötél előnyeit az okos technológia kényelmével. A beépített digitális kijelző valós időben mutatja az ugrások számát, az eltelt időt, az elégetett kalóriákat és az ugrások percenkénti számát, így pontosan nyomon követheted az edzésed intenzitását. A kötél hossza könnyen állítható, így tökéletesen beállíthatod a saját magasságodhoz, 150 cm-től egészen 200 cm-es testmagasságig. A golyóscsapágyas forgómechanizmus sima és egyenletes forgást biztosít, minimalizálva a kötél összeakadásának esélyét. Az ergonomikus markolatok kényelmesen és biztosan illeszkednek a tenyeredbe, és a csúszásmentes felület még izzadt kézzel is biztos fogást biztosít. A kötél PVC anyagból készült, amely tartós és rugalmas, és nem károsítja a padlót. A memóriafunkció elmenti az előző edzésed adatait, így összehasonlíthatod a teljesítményedet. A kötél összehajtható és a mellékelt táskában könnyen szállítható. Az elemek cseréje egyszerű, és egy készlet elem akár 6 hónapig is kitart rendszeres használat mellett.',
  4.2,
  7990,
  'Fitness eszközök'
),
(
  '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800", "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800", "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800", "https://images.unsplash.com/photo-1608156639585-b3a776f3a4c0?w=800"]',
  'Yoga Matrac Prémium',
  'A Yoga Matrac Prémium a jóga és fitness gyakorlatok ideális alapja, amely kiváló minőségű anyagokból készült a maximális kényelem és teljesítmény érdekében. Ez az extra vastag, 8 mm-es matrac tökéletes párnázást nyújt az ízületeidnek és a gerincednek, így kényelmesen végezheted a gyakorlatokat keményebb felületeken is. A csúszásmentes felület mindkét oldalon biztosítja, hogy a matrac stabilan maradjon a helyén, és te is biztos fogást találj még a legdinamikusabb pózokban is. A zárt cellás szerkezet megakadályozza, hogy az izzadság és a nedvesség beszívódjon a matracba, így higiénikus és könnyen tisztítható marad. A matrac környezetbarát TPE anyagból készült, amely nem tartalmaz latex-et, PVC-t vagy más káros anyagokat, így biztonságos a bőrödnek és a bolygónak egyaránt. A könnyű, mindössze 1.2 kg-os súly és a mellékelt hordozópánt megkönnyíti a szállítást az edzőterembe vagy a parkba. A matrac mérete 183 x 61 cm, így elegendő helyet biztosít minden testtípus számára. A választható színek lehetővé teszik, hogy a matrac illeszkedjen a személyes stílusodhoz.',
  4.6,
  14990,
  'Fitness eszközök'
);

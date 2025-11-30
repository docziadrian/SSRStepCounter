# 📚 StepSetGo - Edzésterv Generátor API Dokumentáció

## Tartalomjegyzék

1. [Áttekintés](#áttekintés)
2. [Hitelesítés](#hitelesítés)
3. [Végpontok](#végpontok)
   - [Edzésterv Oldalak](#edzésterv-oldalak)
   - [Edzésterv Generálás API](#edzésterv-generálás-api)
   - [Haladás Követés API](#haladás-követés-api)
   - [Lookup Adatok API](#lookup-adatok-api)
4. [Adatmodellek](#adatmodellek)
5. [Hibakezelés](#hibakezelés)
6. [Példák](#példák)

---

## Áttekintés

A StepSetGo Edzésterv Generátor egy mesterséges intelligencia alapú rendszer, amely személyre szabott, többhetes edzésterveket készít a felhasználók számára.

### Főbb jellemzők:
- 🎯 Cél-alapú edzésterv generálás
- 📊 Edzettségi szint figyelembevétele
- 🏋️ Eszköz-specifikus gyakorlatok
- 📍 Helyszín-alapú tervezés
- 📈 Progresszív nehézség
- 👟 Lépésszám integráció

### Technológiai stack:
- **Backend:** Node.js + Express.js
- **Template Engine:** EJS
- **Adatbázis:** MySQL
- **AI Provider:** OpenRouter API

---

## Hitelesítés

Az API védett végpontjai session-alapú hitelesítést használnak.

### Session követelmények:
- A felhasználónak be kell jelentkeznie (`/users/login`)
- A session tartalmazza: `userid`, `username`, `useremail`
- Bejelentkezés nélküli hozzáférés esetén átirányítás történik

### Session adatok:
```javascript
req.session = {
  userid: Number,      // Felhasználó azonosító
  username: String,    // Felhasználónév
  useremail: String,   // Email cím
  message: String,     // Flash üzenet (opcionális)
  severity: String     // Üzenet súlyossága (opcionális)
}
```

---

## Végpontok

### Edzésterv Oldalak

#### `GET /plans/view`
Edzésterv generátor főoldal megjelenítése.

**Hitelesítés:** Kötelező

**Válasz:** HTML oldal (EJS template)

**Renderelt adatok:**
| Mező | Típus | Leírás |
|------|-------|--------|
| `goals` | Array | Elérhető célok listája |
| `fitnessLevels` | Array | Edzettségi szintek |
| `equipment` | Array | Összes eszköz |
| `equipmentByCategory` | Object | Eszközök kategóriánként |
| `locations` | Array | Helyszínek |
| `userPlans` | Array | Felhasználó korábbi tervei (max 10) |
| `avgSteps` | Number | 30 napos átlagos lépésszám |

---

#### `GET /plans/view/:id`
Konkrét edzésterv részletes megjelenítése.

**Hitelesítés:** Kötelező

**Paraméterek:**
| Paraméter | Típus | Leírás |
|-----------|-------|--------|
| `id` | Number | Edzésterv azonosító |

**Válasz:** HTML oldal (EJS template)

**Renderelt adatok:**
| Mező | Típus | Leírás |
|------|-------|--------|
| `plan` | Object | Edzésterv fő adatai |
| `planContent` | Object | JSON tartalom (hetek, napok, gyakorlatok) |
| `planDays` | Array | Napi bontások az adatbázisból |
| `progress` | Array | Felhasználó haladása |
| `equipmentNames` | Array | Használt eszközök nevei |

---

### Edzésterv Generálás API

#### `POST /plans/generate`
Új edzésterv generálása AI segítségével.

**Hitelesítés:** Kötelező

**Request Content-Type:** `application/json`

**Request Body:**
```json
{
  "goalId": 1,
  "fitnessLevelId": 2,
  "locationId": 1,
  "equipmentIds": [1, 2, 5],
  "durationWeeks": 4,
  "daysPerWeek": 3,
  "sessionDuration": 45,
  "additionalNotes": "Térd sérülés volt, kerülni a mélyguggolást"
}
```

**Paraméterek:**
| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| `goalId` | Number | ✅ | Cél azonosító (goals tábla) |
| `fitnessLevelId` | Number | ✅ | Edzettségi szint azonosító |
| `locationId` | Number | ✅ | Helyszín azonosító |
| `equipmentIds` | Array<Number> | ❌ | Elérhető eszközök azonosítói |
| `durationWeeks` | Number | ❌ | Terv hossza hetekben (2-12, alapértelmezett: 4) |
| `daysPerWeek` | Number | ❌ | Edzésnapok száma (2-6, alapértelmezett: 3) |
| `sessionDuration` | Number | ❌ | Edzés hossza percben (20-90, alapértelmezett: 45) |
| `additionalNotes` | String | ❌ | Speciális megjegyzések, korlátozások |

**Sikeres válasz (200):**
```json
{
  "success": true,
  "planId": 42,
  "message": "Az edzésterv sikeresen elkészült!",
  "redirectUrl": "/plans/view/42"
}
```

**Hibás válasz (400/500):**
```json
{
  "success": false,
  "error": "Kérlek válaszd ki a célt, edzettségi szintet és helyszínt!"
}
```

---

#### `DELETE /plans/:id`
Edzésterv archiválása (soft delete).

**Hitelesítés:** Kötelező

**Paraméterek:**
| Paraméter | Típus | Leírás |
|-----------|-------|--------|
| `id` | Number | Edzésterv azonosító |

**Sikeres válasz (200):**
```json
{
  "success": true,
  "message": "Az edzésterv sikeresen archiválva!"
}
```

**Hibás válasz (404):**
```json
{
  "success": false,
  "error": "Az edzésterv nem található."
}
```

---

### Haladás Követés API

#### `POST /plans/progress`
Napi edzés haladás rögzítése.

**Hitelesítés:** Kötelező

**Request Content-Type:** `application/json`

**Request Body:**
```json
{
  "planId": 42,
  "planDayId": 156,
  "completed": true,
  "completionPercentage": 100,
  "durationActual": 52,
  "caloriesBurned": 320,
  "stepsCount": 8500,
  "difficultyFelt": "moderate",
  "moodBefore": "good",
  "moodAfter": "excellent",
  "energyLevel": 8,
  "notes": "Jól ment, növeltem a súlyokat",
  "exercisesCompleted": ["fekvőtámasz", "guggolás", "plank"]
}
```

**Paraméterek:**
| Mező | Típus | Kötelező | Leírás |
|------|-------|----------|--------|
| `planId` | Number | ✅ | Edzésterv azonosító |
| `planDayId` | Number | ❌ | Napi edzés azonosító |
| `completed` | Boolean | ❌ | Teljesítve lett-e |
| `completionPercentage` | Number | ❌ | Teljesítés százaléka (0-100) |
| `durationActual` | Number | ❌ | Tényleges időtartam percben |
| `caloriesBurned` | Number | ❌ | Elégetett kalóriák |
| `stepsCount` | Number | ❌ | Napi lépésszám |
| `difficultyFelt` | String | ❌ | Érzékelt nehézség |
| `moodBefore` | String | ❌ | Hangulat előtte |
| `moodAfter` | String | ❌ | Hangulat utána |
| `energyLevel` | Number | ❌ | Energia szint (1-10) |
| `notes` | String | ❌ | Megjegyzések |
| `exercisesCompleted` | Array | ❌ | Teljesített gyakorlatok |

**Lehetséges értékek:**
- `difficultyFelt`: `too_easy`, `easy`, `moderate`, `hard`, `too_hard`
- `moodBefore/moodAfter`: `very_bad`, `bad`, `neutral`, `good`, `excellent`

**Sikeres válasz (200):**
```json
{
  "success": true,
  "message": "Haladás sikeresen rögzítve!"
}
```

---

### Lookup Adatok API

#### `GET /plans/api/goals`
Elérhető célok lekérdezése.

**Hitelesítés:** Nem kötelező

**Sikeres válasz (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Fogyás",
      "description": "Testsúlycsökkentés és zsírégetés",
      "icon": "scale",
      "display_order": 1,
      "is_active": true
    }
  ]
}
```

---

#### `GET /plans/api/fitness-levels`
Edzettségi szintek lekérdezése.

**Hitelesítés:** Nem kötelező

**Sikeres válasz (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kezdő",
      "description": "Nincs vagy kevés edzéstapasztalat (0-3 hónap)",
      "min_weeks_experience": 0,
      "display_order": 1,
      "is_active": true
    }
  ]
}
```

---

#### `GET /plans/api/equipment`
Elérhető eszközök lekérdezése.

**Hitelesítés:** Nem kötelező

**Sikeres válasz (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Saját testsúly",
      "description": "Csak saját testsúlyos gyakorlatok",
      "category": "bodyweight",
      "icon": "person",
      "is_basic": true,
      "is_active": true
    }
  ]
}
```

**Eszköz kategóriák:**
- `bodyweight` - Saját testsúly
- `free_weight` - Szabad súlyok
- `machine` - Gépek
- `cardio` - Kardió eszközök
- `accessory` - Kiegészítők
- `other` - Egyéb

---

#### `GET /plans/api/locations`
Helyszínek lekérdezése.

**Hitelesítés:** Nem kötelező

**Sikeres válasz (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Otthon",
      "description": "Otthoni edzés korlátozott eszközökkel",
      "icon": "home",
      "display_order": 1,
      "is_active": true
    }
  ]
}
```

---

#### `GET /plans/api/user-plans`
Felhasználó edzésterveinek lekérdezése.

**Hitelesítés:** Kötelező

**Sikeres válasz (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "user_id": 1,
      "plan_name": "Fogyás edzésterv",
      "goal_name": "Fogyás",
      "level_name": "Kezdő",
      "duration_weeks": 4,
      "days_per_week": 3,
      "status": "completed",
      "created_at": "2025-11-28T10:30:00.000Z"
    }
  ]
}
```

---

## Adatmodellek

### AI Generált Edzésterv Struktúra

Az AI által generált `plan_content` JSON struktúrája:

```json
{
  "planName": "4 hetes Fogyás edzésterv",
  "planDescription": "Személyre szabott program a testsúly csökkentésére",
  "totalWeeks": 4,
  "daysPerWeek": 3,
  "difficultyProgression": "Hétről hétre fokozatosan növekvő intenzitás",
  "weeks": [
    {
      "weekNumber": 1,
      "weekFocus": "Alapok lefektetése",
      "weekTips": "Figyelj a helyes technikára!",
      "days": [
        {
          "dayNumber": 1,
          "dayName": "Hétfő",
          "dayFocus": "Teljes test",
          "isRestDay": false,
          "totalDuration": 45,
          "estimatedCalories": 300,
          "stepGoal": 8000,
          "blocks": [
            {
              "blockName": "Bemelegítés",
              "blockType": "warmup",
              "duration": 10,
              "exercises": [
                {
                  "name": "Helyben futás",
                  "sets": 1,
                  "reps": "2 perc",
                  "rest": "0",
                  "notes": "Fokozatosan gyorsítva",
                  "muscleGroups": ["kardió", "lábak"]
                }
              ]
            },
            {
              "blockName": "Fő rész",
              "blockType": "main",
              "duration": 30,
              "exercises": [...]
            },
            {
              "blockName": "Levezetés",
              "blockType": "cooldown",
              "duration": 5,
              "exercises": [...]
            }
          ]
        }
      ]
    }
  ],
  "generalTips": [
    "Mindig melegíts be az edzés előtt",
    "Figyelj a megfelelő vízfogyasztásra"
  ],
  "nutritionTips": [
    "Fogyassz elegendő fehérjét az izomépüléshez",
    "Kerüld a feldolgozott ételeket"
  ],
  "recoveryTips": [
    "Aludj legalább 7-8 órát",
    "Használj hab hengert regenerációhoz"
  ],
  "equipmentAlternatives": {
    "kézi súlyzók": "vizes palackok",
    "húzódzkodó rúd": "asztal alatti húzódzkodás"
  }
}
```

### Block Types (Blokk típusok)

| blockType | Magyar név | Szín kód |
|-----------|------------|----------|
| `warmup` | Bemelegítés | #FFA726 |
| `main` | Fő rész | #42A5F5 |
| `cooldown` | Levezetés | #26A69A |
| `hiit` | HIIT | #FF7043 |
| `core` | Core | #66BB6A |
| `cardio` | Kardió | #EF5350 |
| `strength` | Erősítés | #42A5F5 |
| `flexibility` | Nyújtás | #AB47BC |

---

## Hibakezelés

### HTTP státusz kódok

| Kód | Jelentés | Leírás |
|-----|----------|--------|
| 200 | OK | Sikeres kérés |
| 400 | Bad Request | Hiányzó vagy érvénytelen paraméterek |
| 401 | Unauthorized | Nincs bejelentkezve |
| 404 | Not Found | Erőforrás nem található |
| 500 | Server Error | Szerver oldali hiba |

### Hiba válasz formátum

```json
{
  "success": false,
  "error": "Részletes hibaüzenet magyarul"
}
```

### Gyakori hibák

| Hiba | Ok | Megoldás |
|------|-----|----------|
| "A funkció használatához be kell jelentkezned!" | Nincs session | Bejelentkezés szükséges |
| "Kérlek válaszd ki a célt..." | Hiányzó kötelező mező | Töltsd ki az összes kötelező mezőt |
| "Hiba történt az edzésterv generálása során" | AI API hiba | Próbáld újra később |
| "Az edzésterv nem található" | Érvénytelen ID | Ellenőrizd az azonosítót |

---

## Példák

### cURL példa - Edzésterv generálás

```bash
curl -X POST http://localhost:3000/plans/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your_session_cookie" \
  -d '{
    "goalId": 1,
    "fitnessLevelId": 2,
    "locationId": 1,
    "equipmentIds": [1, 2, 5],
    "durationWeeks": 4,
    "daysPerWeek": 3,
    "sessionDuration": 45
  }'
```

### JavaScript fetch példa

```javascript
// Edzésterv generálás
async function generateWorkoutPlan() {
  const response = await fetch('/plans/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      goalId: 1,
      fitnessLevelId: 2,
      locationId: 1,
      equipmentIds: [1, 2, 5],
      durationWeeks: 4,
      daysPerWeek: 3,
      sessionDuration: 45,
      additionalNotes: "Nincs speciális igény"
    })
  });

  const result = await response.json();
  
  if (result.success) {
    // Átirányítás az elkészült tervhez
    window.location.href = result.redirectUrl;
  } else {
    console.error('Hiba:', result.error);
  }
}

// Haladás rögzítése
async function logProgress(planId, completed) {
  const response = await fetch('/plans/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      planId: planId,
      completed: completed,
      completionPercentage: completed ? 100 : 50,
      difficultyFelt: 'moderate',
      moodAfter: 'good'
    })
  });

  const result = await response.json();
  return result.success;
}

// Célok lekérdezése
async function getGoals() {
  const response = await fetch('/plans/api/goals');
  const result = await response.json();
  return result.data;
}
```

---

## OpenRouter API Integráció

A rendszer az OpenRouter API-t használja az edzéstervek generálásához.

### Környezeti változók

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
APP_URL=http://localhost:3000
```

### Támogatott modellek

- `anthropic/claude-3.5-sonnet` (ajánlott)
- `anthropic/claude-3-opus`
- `openai/gpt-4-turbo`
- `openai/gpt-4`

### API hívás részletei

- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **Temperature:** 0.7
- **Max tokens:** 8000
- **Response format:** JSON

---

## Verziókövetés

| Verzió | Dátum | Változások |
|--------|-------|------------|
| 1.0.0 | 2025-11-28 | Első kiadás |

---

## Kapcsolat

Ha kérdésed van az API-val kapcsolatban, fordulj a fejlesztőkhöz:
- Email: info@stepsetgo.hu
- GitHub: [StepSetGo Repository]

---

*Készítette: StepSetGo Development Team*
*Utolsó frissítés: 2025. november 28.*


/**
 * =====================================================
 * EDZÉSTERV GENERÁTOR MODUL
 * StepSetGo - Személyre szabott AI edzésterv generálás
 * =====================================================
 */

const express = require("express");
const router = express.Router();
const ejs = require("ejs");
const db = require("./db");
const crypto = require("crypto");

const {
  guestNavbarItemsRight,
  guestNavbarItemsLeft,
  userNavbarItemsRight,
  userNavbarItemsLeft,
} = require("../modules/clientRendering/navbar");

// =====================================================
// SEGÉDFÜGGVÉNYEK
// =====================================================

/**
 * Session üzenetek törlése
 */
function clearSessionMessages(req, res, next) {
  req.session.message = null;
  req.session.severity = null;
  if (typeof next === "function") next();
}

/**
 * Bejelentkezés ellenőrzése middleware
 */
function requireLogin(req, res, next) {
  if (!req.session.userid) {
    req.session.message = "A funkció használatához be kell jelentkezned!";
    req.session.severity = "warning";
    return res.redirect("/users/login");
  }
  next();
}

/**
 * Promise-alapú adatbázis lekérdezés
 */
function queryAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

/**
 * Prompt hash generálása a duplikáció elkerüléséhez
 */
function generatePromptHash(params) {
  const str = JSON.stringify(params);
  return crypto.createHash("sha256").update(str).digest("hex").substring(0, 64);
}

// =====================================================
// OPENROUTER API INTEGRÁCIÓ
// =====================================================

/**
 * OpenRouter API hívás az edzésterv generálásához
 * @param {Object} userParams - Felhasználói paraméterek
 * @returns {Promise<Object>} - Generált edzésterv
 */
async function generateWorkoutPlanWithAI(userParams) {
  const {
    goal,
    fitnessLevel,
    location,
    equipment,
    durationWeeks,
    daysPerWeek,
    sessionDuration,
    additionalNotes,
    userStepsData,
  } = userParams;

  // Prompt összeállítása magyarul
  const systemPrompt = `Te egy professzionális személyi edző vagy, aki személyre szabott edzésterveket készít. 
A válaszaidat mindig magyarul add meg, strukturált JSON formátumban.
Az edzéstervnek tartalmaznia kell:
- Heti bontást a megadott hétek számára
- Napi edzésterveket bemelegítéssel, fő résszel és levezetéssel
- Progresszív nehézséget (hétről hétre fokozódó intenzitás)
- Konkrét gyakorlatokat sorozatszámmal, ismétlésszámmal és pihenőidővel
- Napi lépéscélokat az edzésnapokhoz és pihenőnapokhoz
- Motivációs tippeket és tanácsokat

FONTOS: A válasz CSAK érvényes JSON legyen, semmi más szöveg ne legyen előtte vagy utána!`;

  const userPrompt = `Készíts egy személyre szabott edzéstervet az alábbi paraméterek alapján:

📎 CÉL: ${goal}
💪 EDZETTSÉGI SZINT: ${fitnessLevel}
📍 HELYSZÍN: ${location}
🏋️ ELÉRHETŐ ESZKÖZÖK: ${equipment.join(", ")}
📅 IDŐTARTAM: ${durationWeeks} hét
📆 EDZÉSNAPOK SZÁMA: ${daysPerWeek} nap/hét
⏱️ EDZÉS IDŐTARTAMA: ${sessionDuration} perc/alkalom
${additionalNotes ? `📝 MEGJEGYZÉSEK: ${additionalNotes}` : ""}
${userStepsData ? `👟 ÁTLAGOS NAPI LÉPÉSSZÁM: ${userStepsData} lépés` : ""}

Válaszolj az alábbi JSON struktúrában:
{
  "planName": "Edzésterv neve",
  "planDescription": "Rövid leírás a tervről",
  "totalWeeks": ${durationWeeks},
  "daysPerWeek": ${daysPerWeek},
  "difficultyProgression": "Leírás a progresszióról",
  "weeks": [
    {
      "weekNumber": 1,
      "weekFocus": "Heti fókusz",
      "weekTips": "Heti tanácsok",
      "days": [
        {
          "dayNumber": 1,
          "dayName": "Hétfő",
          "dayFocus": "Napi fókusz (pl. Felső test)",
          "isRestDay": false,
          "totalDuration": ${sessionDuration},
          "estimatedCalories": 300,
          "stepGoal": 8000,
          "blocks": [
            {
              "blockName": "Bemelegítés",
              "blockType": "warmup",
              "duration": 10,
              "exercises": [
                {
                  "name": "Gyakorlat neve",
                  "sets": 2,
                  "reps": "10-15",
                  "rest": "30 mp",
                  "notes": "Fontos megjegyzés",
                  "muscleGroups": ["izmok"]
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
  "generalTips": ["Általános tanácsok listája"],
  "nutritionTips": ["Táplálkozási tanácsok"],
  "recoveryTips": ["Regenerációs tanácsok"],
  "equipmentAlternatives": {"eszköz": "alternatíva"}
}`;

  const startTime = Date.now();

  try {
    // OpenRouter API hívás
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "StepSetGo Edzésterv Generátor",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 8000,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API hiba:", errorData);
      throw new Error(`API hiba: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const generationTime = Date.now() - startTime;

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Érvénytelen API válasz struktúra");
    }

    let planContent;
    try {
      const content = data.choices[0].message.content;
      // Próbáljuk kinyerni a JSON-t, ha van körülötte szöveg
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planContent = JSON.parse(jsonMatch[0]);
      } else {
        planContent = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("JSON parse hiba:", parseError);
      console.error("Nyers válasz:", data.choices[0].message.content);
      throw new Error("Az AI válasz nem érvényes JSON formátum");
    }

    return {
      success: true,
      planContent,
      rawResponse: data.choices[0].message.content,
      generationTimeMs: generationTime,
      model: data.model || process.env.OPENROUTER_MODEL,
    };
  } catch (error) {
    console.error("Edzésterv generálási hiba:", error);
    return {
      success: false,
      error: error.message,
      generationTimeMs: Date.now() - startTime,
    };
  }
}

// =====================================================
// ROUTE KEZELŐK
// =====================================================

/**
 * GET /plans/view
 * Edzésterv generátor főoldal - űrlap megjelenítése
 */
router.get("/view", requireLogin, async (req, res) => {
  clearSessionMessages(req, res);
  const isLoggedIn = !!req.session.userid;

  try {
    // Párhuzamos lekérdezések az alapadatokért
    const [goals, fitnessLevels, equipment, locations, userPlans, stepsData] =
      await Promise.all([
        queryAsync("SELECT * FROM goals WHERE is_active = TRUE ORDER BY display_order"),
        queryAsync("SELECT * FROM fitness_levels WHERE is_active = TRUE ORDER BY display_order"),
        queryAsync("SELECT * FROM equipment WHERE is_active = TRUE ORDER BY category, name"),
        queryAsync("SELECT * FROM locations WHERE is_active = TRUE ORDER BY display_order"),
        queryAsync(
          `SELECT agp.*, g.name as goal_name, fl.name as level_name, l.name as location_name
           FROM ai_generated_plans agp
           LEFT JOIN goals g ON agp.goal_id = g.id
           LEFT JOIN fitness_levels fl ON agp.fitness_level_id = fl.id
           LEFT JOIN locations l ON agp.location_id = l.id
           WHERE agp.user_id = ? AND agp.status = 'completed'
           ORDER BY agp.created_at DESC
           LIMIT 10`,
          [req.session.userid]
        ),
        queryAsync(
          `SELECT AVG(steps) as avg_steps FROM steps WHERE userid = ? AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
          [req.session.userid]
        ),
      ]);

    // Eszközök kategóriánként csoportosítva
    const equipmentByCategory = equipment.reduce((acc, item) => {
      const cat = item.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    const categoryNames = {
      bodyweight: "Saját testsúly",
      free_weight: "Szabad súlyok",
      machine: "Gépek",
      cardio: "Kardió eszközök",
      accessory: "Kiegészítők",
      other: "Egyéb",
    };

    ejs.renderFile(
      "views/plans/plans.ejs",
      {
        error: req.session.message || null,
        severity: req.session.severity || null,
        user: req.session.username || null,
        useremail: req.session.useremail || null,
        userid: req.session.userid,
        goals,
        fitnessLevels,
        equipment,
        equipmentByCategory,
        categoryNames,
        locations,
        userPlans,
        avgSteps: stepsData[0]?.avg_steps ? Math.round(stepsData[0].avg_steps) : null,
        navbarItemsLeft: isLoggedIn ? userNavbarItemsLeft : guestNavbarItemsLeft,
        navbarItemsRight: isLoggedIn ? userNavbarItemsRight : guestNavbarItemsRight,
      },
      (err, html) => {
        if (err) {
          console.error("Sablon renderelési hiba:", err);
          res.status(500).send("Hiba a sablon renderelésekor.");
        } else {
          clearSessionMessages(req, res);
          res.send(html);
        }
      }
    );
  } catch (error) {
    console.error("Adatbázis hiba:", error);
    req.session.message = "Hiba történt az adatok betöltésekor.";
    req.session.severity = "error";
    res.redirect("/");
  }
});

/**
 * POST /plans/generate
 * Új edzésterv generálása AI-val
 */
router.post("/generate", requireLogin, async (req, res) => {
  const {
    goalId,
    fitnessLevelId,
    locationId,
    equipmentIds,
    durationWeeks,
    daysPerWeek,
    sessionDuration,
    additionalNotes,
  } = req.body;

  try {
    // Validáció
    if (!goalId || !fitnessLevelId || !locationId) {
      return res.status(400).json({
        success: false,
        error: "Kérlek válaszd ki a célt, edzettségi szintet és helyszínt!",
      });
    }

    // Alapadatok lekérdezése az AI prompthoz
    const [goalData, levelData, locationData] = await Promise.all([
      queryAsync("SELECT name FROM goals WHERE id = ?", [goalId]),
      queryAsync("SELECT name FROM fitness_levels WHERE id = ?", [fitnessLevelId]),
      queryAsync("SELECT name FROM locations WHERE id = ?", [locationId]),
    ]);

    // Kiválasztott eszközök
    let equipmentNames = ["Saját testsúly"];
    if (equipmentIds && equipmentIds.length > 0) {
      const eqData = await queryAsync(
        "SELECT name FROM equipment WHERE id IN (?)",
        [equipmentIds]
      );
      equipmentNames = eqData.map((e) => e.name);
    }

    // Felhasználó átlagos lépésszáma
    const stepsData = await queryAsync(
      "SELECT AVG(steps) as avg FROM steps WHERE userid = ? AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
      [req.session.userid]
    );

    // AI paraméterek összeállítása
    const aiParams = {
      goal: goalData[0]?.name || "Általános fittség",
      fitnessLevel: levelData[0]?.name || "Kezdő",
      location: locationData[0]?.name || "Otthon",
      equipment: equipmentNames,
      durationWeeks: parseInt(durationWeeks) || 4,
      daysPerWeek: parseInt(daysPerWeek) || 3,
      sessionDuration: parseInt(sessionDuration) || 45,
      additionalNotes: additionalNotes || "",
      userStepsData: stepsData[0]?.avg ? Math.round(stepsData[0].avg) : null,
    };

    // Prompt hash a duplikáció elkerüléséhez
    const promptHash = generatePromptHash(aiParams);

    // Új terv rekord létrehozása 'generating' státusszal
    const insertResult = await queryAsync(
      `INSERT INTO ai_generated_plans 
       (user_id, plan_name, goal_id, fitness_level_id, location_id, 
        duration_weeks, days_per_week, session_duration_minutes, 
        equipment_ids, additional_notes, ai_prompt_hash, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'generating')`,
      [
        req.session.userid,
        "Edzésterv generálás...",
        goalId,
        fitnessLevelId,
        locationId,
        aiParams.durationWeeks,
        aiParams.daysPerWeek,
        aiParams.sessionDuration,
        JSON.stringify(equipmentIds || []),
        additionalNotes || null,
        promptHash,
      ]
    );

    const planId = insertResult.insertId;

    // AI generálás
    const aiResult = await generateWorkoutPlanWithAI(aiParams);

    if (!aiResult.success) {
      // Sikertelen generálás
      await queryAsync(
        "UPDATE ai_generated_plans SET status = 'failed' WHERE id = ?",
        [planId]
      );
      return res.status(500).json({
        success: false,
        error: aiResult.error || "Hiba történt az edzésterv generálása során.",
      });
    }

    // Sikeres generálás - terv mentése
    const planContent = aiResult.planContent;

    await queryAsync(
      `UPDATE ai_generated_plans SET 
        plan_name = ?,
        plan_description = ?,
        plan_content = ?,
        ai_response_raw = ?,
        generation_time_ms = ?,
        ai_model = ?,
        status = 'completed'
       WHERE id = ?`,
      [
        planContent.planName || `${aiParams.goal} edzésterv`,
        planContent.planDescription || "",
        JSON.stringify(planContent),
        aiResult.rawResponse,
        aiResult.generationTimeMs,
        aiResult.model,
        planId,
      ]
    );

    // Napi bontások mentése a plan_days táblába
    if (planContent.weeks && planContent.weeks.length > 0) {
      for (const week of planContent.weeks) {
        if (week.days && week.days.length > 0) {
          for (const day of week.days) {
            await queryAsync(
              `INSERT INTO plan_days 
               (plan_id, week_number, day_number, day_name, day_focus, 
                total_duration_minutes, estimated_calories, rest_day, content)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                planId,
                week.weekNumber,
                day.dayNumber,
                day.dayName || `${day.dayNumber}. nap`,
                day.dayFocus || "",
                day.totalDuration || aiParams.sessionDuration,
                day.estimatedCalories || 0,
                day.isRestDay ? 1 : 0,
                JSON.stringify(day),
              ]
            );
          }
        }
      }
    }

    res.json({
      success: true,
      planId,
      message: "Az edzésterv sikeresen elkészült!",
      redirectUrl: `/plans/view/${planId}`,
    });
  } catch (error) {
    console.error("Edzésterv generálási hiba:", error);
    res.status(500).json({
      success: false,
      error: "Hiba történt az edzésterv generálása során. Kérlek próbáld újra!",
    });
  }
});

/**
 * GET /plans/view/:id
 * Konkrét edzésterv megtekintése
 */
router.get("/view/:id", requireLogin, async (req, res) => {
  clearSessionMessages(req, res);
  const isLoggedIn = !!req.session.userid;
  const planId = req.params.id;

  try {
    // Edzésterv lekérdezése
    const plans = await queryAsync(
      `SELECT agp.*, g.name as goal_name, fl.name as level_name, l.name as location_name
       FROM ai_generated_plans agp
       LEFT JOIN goals g ON agp.goal_id = g.id
       LEFT JOIN fitness_levels fl ON agp.fitness_level_id = fl.id
       LEFT JOIN locations l ON agp.location_id = l.id
       WHERE agp.id = ? AND agp.user_id = ?`,
      [planId, req.session.userid]
    );

    if (plans.length === 0) {
      req.session.message = "Az edzésterv nem található vagy nincs hozzáférésed.";
      req.session.severity = "error";
      return res.redirect("/plans/view");
    }

    const plan = plans[0];

    // Plan content parse
    let planContent = {};
    try {
      planContent = JSON.parse(plan.plan_content || "{}");
    } catch (e) {
      console.error("Plan content parse hiba:", e);
    }

    // Napi edzések lekérdezése
    const planDays = await queryAsync(
      "SELECT * FROM plan_days WHERE plan_id = ? ORDER BY week_number, day_number",
      [planId]
    );

    // Haladás lekérdezése
    const progress = await queryAsync(
      `SELECT * FROM progress_logs 
       WHERE plan_id = ? AND user_id = ? 
       ORDER BY log_date DESC`,
      [planId, req.session.userid]
    );

    // Eszköznevek lekérdezése
    let equipmentNames = [];
    try {
      const eqIds = JSON.parse(plan.equipment_ids || "[]");
      if (eqIds.length > 0) {
        const eqData = await queryAsync(
          "SELECT name FROM equipment WHERE id IN (?)",
          [eqIds]
        );
        equipmentNames = eqData.map((e) => e.name);
      }
    } catch (e) {
      console.error("Equipment parse hiba:", e);
    }

    ejs.renderFile(
      "views/plans/planDetail.ejs",
      {
        error: req.session.message || null,
        severity: req.session.severity || null,
        user: req.session.username || null,
        useremail: req.session.useremail || null,
        plan,
        planContent,
        planDays,
        progress,
        equipmentNames,
        navbarItemsLeft: isLoggedIn ? userNavbarItemsLeft : guestNavbarItemsLeft,
        navbarItemsRight: isLoggedIn ? userNavbarItemsRight : guestNavbarItemsRight,
      },
      (err, html) => {
        if (err) {
          console.error("Sablon renderelési hiba:", err);
          res.status(500).send("Hiba a sablon renderelésekor.");
        } else {
          clearSessionMessages(req, res);
          res.send(html);
        }
      }
    );
  } catch (error) {
    console.error("Edzésterv lekérdezési hiba:", error);
    req.session.message = "Hiba történt az edzésterv betöltésekor.";
    req.session.severity = "error";
    res.redirect("/plans/view");
  }
});

/**
 * POST /plans/progress
 * Napi edzés haladás rögzítése
 */
router.post("/progress", requireLogin, async (req, res) => {
  const {
    planId,
    planDayId,
    completed,
    completionPercentage,
    durationActual,
    caloriesBurned,
    stepsCount,
    difficultyFelt,
    moodBefore,
    moodAfter,
    energyLevel,
    notes,
    exercisesCompleted,
  } = req.body;

  try {
    const today = new Date().toISOString().split("T")[0];

    // Ellenőrizzük, hogy van-e már mai bejegyzés
    const existing = await queryAsync(
      "SELECT id FROM progress_logs WHERE user_id = ? AND plan_id = ? AND log_date = ?",
      [req.session.userid, planId, today]
    );

    if (existing.length > 0) {
      // Frissítés
      await queryAsync(
        `UPDATE progress_logs SET
          plan_day_id = ?, completed = ?, completion_percentage = ?,
          duration_actual_minutes = ?, calories_burned = ?, steps_count = ?,
          difficulty_felt = ?, mood_before = ?, mood_after = ?,
          energy_level = ?, notes = ?, exercises_completed = ?
         WHERE id = ?`,
        [
          planDayId || null,
          completed ? 1 : 0,
          completionPercentage || 0,
          durationActual || null,
          caloriesBurned || null,
          stepsCount || null,
          difficultyFelt || null,
          moodBefore || null,
          moodAfter || null,
          energyLevel || null,
          notes || null,
          JSON.stringify(exercisesCompleted || []),
          existing[0].id,
        ]
      );
    } else {
      // Új bejegyzés
      await queryAsync(
        `INSERT INTO progress_logs
         (user_id, plan_id, plan_day_id, log_date, completed, completion_percentage,
          duration_actual_minutes, calories_burned, steps_count,
          difficulty_felt, mood_before, mood_after, energy_level, notes, exercises_completed)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.session.userid,
          planId,
          planDayId || null,
          today,
          completed ? 1 : 0,
          completionPercentage || 0,
          durationActual || null,
          caloriesBurned || null,
          stepsCount || null,
          difficultyFelt || null,
          moodBefore || null,
          moodAfter || null,
          energyLevel || null,
          notes || null,
          JSON.stringify(exercisesCompleted || []),
        ]
      );
    }

    // Lépésszám mentése a steps táblába is
    if (stepsCount && stepsCount > 0) {
      const existingSteps = await queryAsync(
        "SELECT id FROM steps WHERE userid = ? AND date = ?",
        [req.session.userid, today]
      );

      if (existingSteps.length === 0) {
        await queryAsync(
          "INSERT INTO steps (userid, date, steps) VALUES (?, ?, ?)",
          [req.session.userid, today, stepsCount]
        );
      }
    }

    res.json({
      success: true,
      message: "Haladás sikeresen rögzítve!",
    });
  } catch (error) {
    console.error("Haladás rögzítési hiba:", error);
    res.status(500).json({
      success: false,
      error: "Hiba történt a haladás rögzítésekor.",
    });
  }
});

/**
 * DELETE /plans/:id
 * Edzésterv törlése/archiválása
 */
router.delete("/:id", requireLogin, async (req, res) => {
  const planId = req.params.id;

  try {
    // Ellenőrzés, hogy a felhasználóé-e a terv
    const plans = await queryAsync(
      "SELECT id FROM ai_generated_plans WHERE id = ? AND user_id = ?",
      [planId, req.session.userid]
    );

    if (plans.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Az edzésterv nem található.",
      });
    }

    // Archiválás (soft delete)
    await queryAsync(
      "UPDATE ai_generated_plans SET status = 'archived', is_active = FALSE WHERE id = ?",
      [planId]
    );

    res.json({
      success: true,
      message: "Az edzésterv sikeresen archiválva!",
    });
  } catch (error) {
    console.error("Edzésterv törlési hiba:", error);
    res.status(500).json({
      success: false,
      error: "Hiba történt az edzésterv törlésekor.",
    });
  }
});

/**
 * GET /plans/api/goals
 * Célok lekérdezése API-ként
 */
router.get("/api/goals", async (req, res) => {
  try {
    const goals = await queryAsync(
      "SELECT * FROM goals WHERE is_active = TRUE ORDER BY display_order"
    );
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /plans/api/fitness-levels
 * Edzettségi szintek lekérdezése API-ként
 */
router.get("/api/fitness-levels", async (req, res) => {
  try {
    const levels = await queryAsync(
      "SELECT * FROM fitness_levels WHERE is_active = TRUE ORDER BY display_order"
    );
    res.json({ success: true, data: levels });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /plans/api/equipment
 * Eszközök lekérdezése API-ként
 */
router.get("/api/equipment", async (req, res) => {
  try {
    const equipment = await queryAsync(
      "SELECT * FROM equipment WHERE is_active = TRUE ORDER BY category, name"
    );
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /plans/api/locations
 * Helyszínek lekérdezése API-ként
 */
router.get("/api/locations", async (req, res) => {
  try {
    const locations = await queryAsync(
      "SELECT * FROM locations WHERE is_active = TRUE ORDER BY display_order"
    );
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /plans/api/user-plans
 * Felhasználó edzésterveinek lekérdezése
 */
router.get("/api/user-plans", requireLogin, async (req, res) => {
  try {
    const plans = await queryAsync(
      `SELECT agp.*, g.name as goal_name, fl.name as level_name
       FROM ai_generated_plans agp
       LEFT JOIN goals g ON agp.goal_id = g.id
       LEFT JOIN fitness_levels fl ON agp.fitness_level_id = fl.id
       WHERE agp.user_id = ? AND agp.status IN ('completed', 'generating')
       ORDER BY agp.created_at DESC`,
      [req.session.userid]
    );
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


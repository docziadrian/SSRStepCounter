-- =====================================================
-- EDZÉSTERV GENERÁTOR - ADATBÁZIS SÉMA
-- StepSetGo Workout Plan Generator
-- Verzió: 1.0.0
-- Utolsó frissítés: 2025-11-28
-- =====================================================

-- =====================================================
-- 1. ALAPADATOK TÁBLÁK (Lookup Tables)
-- =====================================================

-- Célok táblája
DROP TABLE IF EXISTS `goals`;
CREATE TABLE IF NOT EXISTS `goals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `icon` VARCHAR(50) DEFAULT 'target',
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `goals` (`name`, `description`, `icon`, `display_order`) VALUES
('Fogyás', 'Testsúlycsökkentés és zsírégetés', 'scale', 1),
('Izomépítés', 'Izomtömeg növelése és erősítés', 'muscle', 2),
('Állóképesség', 'Kardió és állóképesség fejlesztése', 'heart', 3),
('Erőnövelés', 'Maximális erő fejlesztése', 'dumbbell', 4),
('Rugalmasság', 'Nyújtás és mobilitás javítása', 'yoga', 5),
('Általános fittség', 'Komplex edzésprogram a teljes testnek', 'star', 6),
('Rehabilitáció', 'Sérülés utáni felépülés és erősítés', 'medical', 7),
('Sport-specifikus', 'Adott sportághoz kapcsolódó edzés', 'trophy', 8);

-- Edzettségi szintek táblája
DROP TABLE IF EXISTS `fitness_levels`;
CREATE TABLE IF NOT EXISTS `fitness_levels` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `min_weeks_experience` INT DEFAULT 0,
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fitness_levels` (`name`, `description`, `min_weeks_experience`, `display_order`) VALUES
('Kezdő', 'Nincs vagy kevés edzéstapasztalat (0-3 hónap)', 0, 1),
('Alapfokú', 'Némi tapasztalat, alapvető gyakorlatok ismerete (3-6 hónap)', 12, 2),
('Középhaladó', 'Rendszeres edzés, jó technika (6-12 hónap)', 26, 3),
('Haladó', 'Jelentős tapasztalat, fejlett technika (1-3 év)', 52, 4),
('Profi', 'Versenyző szint vagy nagyon tapasztalt (3+ év)', 156, 5);

-- Eszközök táblája
DROP TABLE IF EXISTS `equipment`;
CREATE TABLE IF NOT EXISTS `equipment` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `category` ENUM('free_weight', 'machine', 'bodyweight', 'cardio', 'accessory', 'other') DEFAULT 'other',
  `icon` VARCHAR(50) DEFAULT 'dumbbell',
  `is_basic` BOOLEAN DEFAULT FALSE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `equipment` (`name`, `description`, `category`, `icon`, `is_basic`) VALUES
('Saját testsúly', 'Csak saját testsúlyos gyakorlatok', 'bodyweight', 'person', TRUE),
('Kézi súlyzók', 'Szabad súlyos kézisúlyzó pár', 'free_weight', 'dumbbell', TRUE),
('Rúdsúlyzó', 'Olimpiai vagy standard rúdsúlyzó', 'free_weight', 'barbell', FALSE),
('Kettlebell', 'Különböző súlyú kettlebell-ek', 'free_weight', 'kettlebell', FALSE),
('Ellenállás szalag', 'Gumiszalagok különböző erősségben', 'accessory', 'band', TRUE),
('Húzódzkodó rúd', 'Fix vagy ajtófélfára szerelhető rúd', 'bodyweight', 'bar', FALSE),
('TRX/Heveder', 'Felfüggesztéses edzőeszköz', 'accessory', 'trx', FALSE),
('Ugrókötél', 'Kardió és koordináció fejlesztéshez', 'cardio', 'rope', TRUE),
('Fitness labda', 'Stabilitás labda (Swiss ball)', 'accessory', 'ball', FALSE),
('Hab henger', 'Foam roller regenerációhoz', 'accessory', 'roller', FALSE),
('Futópad', 'Kardió gép beltéri futáshoz', 'cardio', 'treadmill', FALSE),
('Kerékpár/Spinning', 'Szobabicikli vagy spinning kerékpár', 'cardio', 'bike', FALSE),
('Evezőgép', 'Rowing machine kardióhoz', 'cardio', 'rowing', FALSE),
('Kábeles gép', 'Csigás ellenállásos gépek', 'machine', 'cable', FALSE),
('Smith gép', 'Vezetett rúdsúlyzó gép', 'machine', 'smith', FALSE),
('Leg press', 'Lábprésgép', 'machine', 'legpress', FALSE),
('Padok', 'Különböző szögű edzőpadok', 'accessory', 'bench', FALSE),
('Medicinlabda', 'Súlyozott labda funkcionális edzéshez', 'accessory', 'medball', FALSE),
('Zsámoly/Box', 'Ugrásokhoz és step gyakorlatokhoz', 'accessory', 'box', FALSE),
('Tornaszőnyeg', 'Jóga vagy fitness szőnyeg', 'accessory', 'mat', TRUE);

-- Helyszínek táblája
DROP TABLE IF EXISTS `locations`;
CREATE TABLE IF NOT EXISTS `locations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `icon` VARCHAR(50) DEFAULT 'location',
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `locations` (`name`, `description`, `icon`, `display_order`) VALUES
('Otthon', 'Otthoni edzés korlátozott eszközökkel', 'home', 1),
('Konditerem', 'Teljes felszereltségű edzőterem', 'gym', 2),
('Szabadtér', 'Park, játszótér vagy kültéri edzés', 'tree', 3),
('Iroda', 'Munkahely környezetében végezhető gyakorlatok', 'office', 4),
('Úszómedence', 'Vízi edzésprogramok', 'pool', 5),
('Vegyes', 'Több helyszínen végezhető edzések', 'mixed', 6);

-- =====================================================
-- 2. EDZÉSBLOKKOK ÉS GYAKORLATOK
-- =====================================================

-- Edzésblokk típusok táblája
DROP TABLE IF EXISTS `workout_block_types`;
CREATE TABLE IF NOT EXISTS `workout_block_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `typical_duration_minutes` INT DEFAULT 10,
  `display_order` INT DEFAULT 0,
  `color_code` VARCHAR(7) DEFAULT '#76ABAE',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `workout_block_types` (`name`, `description`, `typical_duration_minutes`, `display_order`, `color_code`) VALUES
('Bemelegítés', 'Keringés fokozása, ízületek előkészítése', 10, 1, '#FFA726'),
('Kardió', 'Szív-érrendszeri edzés', 20, 2, '#EF5350'),
('Erősítés', 'Izomerősítő gyakorlatok', 30, 3, '#42A5F5'),
('Core', 'Törzs és hasizom erősítés', 10, 4, '#66BB6A'),
('HIIT', 'Magas intenzitású intervall edzés', 20, 5, '#FF7043'),
('Nyújtás', 'Rugalmasság fejlesztése', 10, 6, '#AB47BC'),
('Levezetés', 'Pulzuscsökkentés, regeneráció', 5, 7, '#26A69A'),
('Funkcionális', 'Komplex, többízületes mozgások', 25, 8, '#5C6BC0'),
('Mobilitás', 'Ízületi mozgásterjedelem növelése', 10, 9, '#8D6E63');

-- Alapgyakorlatok táblája (referencia adatok az AI-hoz)
DROP TABLE IF EXISTS `exercises`;
CREATE TABLE IF NOT EXISTS `exercises` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `muscle_groups` JSON,
  `equipment_ids` JSON,
  `difficulty_level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  `block_type_id` INT,
  `video_url` VARCHAR(500),
  `image_url` VARCHAR(500),
  `instructions` TEXT,
  `common_mistakes` TEXT,
  `calories_per_minute` DECIMAL(4,2) DEFAULT 5.00,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`block_type_id`) REFERENCES `workout_block_types`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mintagyakorlatok beszúrása
INSERT INTO `exercises` (`name`, `description`, `muscle_groups`, `equipment_ids`, `difficulty_level`, `block_type_id`, `instructions`, `calories_per_minute`) VALUES
-- Bemelegítés
('Helyben futás', 'Könnyű kardió bemelegítéshez', '["lábak", "kardió"]', '[1]', 'beginner', 1, 'Emeld a térdeidet közepes magasságig, tartsd egyenletesen a tempót.', 8.00),
('Jumping Jack', 'Teljes testet aktiváló kardió gyakorlat', '["teljes test", "kardió"]', '[1]', 'beginner', 1, 'Ugrás közben oldalra lépj és karokkal tapsolj a fej fölött.', 10.00),
('Körzések', 'Ízületi bemelegítő mozgások', '["vállak", "csípő", "boka"]', '[1]', 'beginner', 1, 'Lassan és kontrolláltan körözz minden fő ízülettel.', 3.00),
('Dinamikus nyújtás', 'Aktív nyújtógyakorlatok', '["lábak", "csípő"]', '[1]', 'beginner', 1, 'Lendületes, de kontrollált mozdulatokkal nyújts.', 4.00),

-- Erősítés
('Fekvőtámasz', 'Alapvető felső test erősítő', '["mell", "tricepsz", "vállak", "core"]', '[1]', 'beginner', 3, 'Törzs feszes, könyök 45 fokos szögben. Mélyre ereszkedj.', 7.00),
('Guggolás', 'Alapvető alsó test gyakorlat', '["combizom", "fenék", "core"]', '[1]', 'beginner', 3, 'Sarok a földön, térdek lábfej irányába. Mélyre guggolj.', 8.00),
('Kitörés', 'Egyoldali láberősítő', '["combizom", "fenék", "egyensúly"]', '[1]', 'beginner', 3, 'Nagy lépés előre, mindkét térd 90 fokban. Törzs egyenes.', 7.00),
('Húzódzkodás', 'Hát és bicepsz erősítő', '["hát", "bicepsz", "alkar"]', '[6]', 'intermediate', 3, 'Vállszélességű fogás, kontrollált mozgás fel és le.', 9.00),
('Plank', 'Izometrikus core gyakorlat', '["core", "vállak"]', '[1]', 'beginner', 4, 'Alkar és lábujj támasz, test egyenes vonalban.', 4.00),

-- Kardió
('Burpee', 'Intenzív teljes test gyakorlat', '["teljes test", "kardió"]', '[1]', 'intermediate', 5, 'Guggolás-fekvőtámasz-felugrás egy folyamatos mozdulatban.', 12.00),
('Mountain Climber', 'Dinamikus core és kardió', '["core", "vállak", "kardió"]', '[1]', 'beginner', 5, 'Fekvőtámasz pozícióban gyors térdemeléssel futás.', 10.00),
('Box Jump', 'Robbanékony láberősítő', '["lábak", "fenék", "robbanékonyság"]', '[19]', 'intermediate', 5, 'Párhuzamos lábakkal ugorj fel a dobozra, lágy érkezés.', 11.00),

-- Nyújtás és levezetés
('Ülő előrehajlás', 'Hátulsó lánc nyújtása', '["hátsó comb", "hát"]', '[20]', 'beginner', 6, 'Egyenes lábakkal ülve, lassan hajolj előre a lábfej felé.', 2.00),
('Galamb póz', 'Csípőhajlító nyújtás', '["csípő", "fenék"]', '[20]', 'beginner', 6, 'Az egyik láb behajlítva elöl, a másik nyújtva hátul.', 2.00),
('Gyermek póz', 'Hát és váll lazítás', '["hát", "vállak"]', '[20]', 'beginner', 7, 'Térdelő pozícióból hajolj előre, karok nyújtva.', 2.00),
('Mély légzés', 'Légzőgyakorlat regenerációhoz', '["légzés", "relaxáció"]', '[1]', 'beginner', 7, 'Lassan lélegezz be 4 másodperc, ki 6 másodperc alatt.', 1.00);

-- =====================================================
-- 3. AI GENERÁLT EDZÉSTERVEK
-- =====================================================

-- AI által generált edzéstervek fő táblája
DROP TABLE IF EXISTS `ai_generated_plans`;
CREATE TABLE IF NOT EXISTS `ai_generated_plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `plan_name` VARCHAR(255) NOT NULL,
  `plan_description` TEXT,
  
  -- Felhasználó bemeneti paraméterek
  `goal_id` INT,
  `fitness_level_id` INT,
  `location_id` INT,
  `duration_weeks` INT DEFAULT 4,
  `days_per_week` INT DEFAULT 3,
  `session_duration_minutes` INT DEFAULT 45,
  `equipment_ids` JSON,
  `additional_notes` TEXT,
  
  -- AI generálási metaadatok
  `ai_model` VARCHAR(100) DEFAULT 'openrouter',
  `ai_prompt_hash` VARCHAR(64),
  `ai_response_raw` LONGTEXT,
  `generation_time_ms` INT,
  
  -- Terv tartalma (strukturált JSON)
  `plan_content` LONGTEXT,
  
  -- Státusz és időbélyegek
  `status` ENUM('generating', 'completed', 'failed', 'archived') DEFAULT 'generating',
  `is_active` BOOLEAN DEFAULT TRUE,
  `started_at` DATE,
  `completed_at` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`goal_id`) REFERENCES `goals`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`fitness_level_id`) REFERENCES `fitness_levels`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL,
  
  INDEX `idx_user_plans` (`user_id`, `status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Edzésterv napok táblája
DROP TABLE IF EXISTS `plan_days`;
CREATE TABLE IF NOT EXISTS `plan_days` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `plan_id` INT NOT NULL,
  `week_number` INT NOT NULL,
  `day_number` INT NOT NULL,
  `day_name` VARCHAR(50),
  `day_focus` VARCHAR(100),
  `total_duration_minutes` INT,
  `estimated_calories` INT,
  `difficulty_rating` DECIMAL(2,1) DEFAULT 5.0,
  `rest_day` BOOLEAN DEFAULT FALSE,
  `notes` TEXT,
  `content` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`plan_id`) REFERENCES `ai_generated_plans`(`id`) ON DELETE CASCADE,
  INDEX `idx_plan_week_day` (`plan_id`, `week_number`, `day_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Napi edzésblokkok táblája
DROP TABLE IF EXISTS `plan_day_blocks`;
CREATE TABLE IF NOT EXISTS `plan_day_blocks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `plan_day_id` INT NOT NULL,
  `block_type_id` INT,
  `block_order` INT DEFAULT 1,
  `block_name` VARCHAR(100),
  `duration_minutes` INT,
  `exercises_json` LONGTEXT,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`plan_day_id`) REFERENCES `plan_days`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`block_type_id`) REFERENCES `workout_block_types`(`id`) ON DELETE SET NULL,
  INDEX `idx_day_blocks` (`plan_day_id`, `block_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. HALADÁS KÖVETÉS
-- =====================================================

-- Felhasználói haladás naplózás
DROP TABLE IF EXISTS `progress_logs`;
CREATE TABLE IF NOT EXISTS `progress_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `plan_id` INT,
  `plan_day_id` INT,
  `log_date` DATE NOT NULL,
  `completed` BOOLEAN DEFAULT FALSE,
  `completion_percentage` INT DEFAULT 0,
  `duration_actual_minutes` INT,
  `calories_burned` INT,
  `steps_count` INT,
  `heart_rate_avg` INT,
  `difficulty_felt` ENUM('too_easy', 'easy', 'moderate', 'hard', 'too_hard'),
  `mood_before` ENUM('very_bad', 'bad', 'neutral', 'good', 'excellent'),
  `mood_after` ENUM('very_bad', 'bad', 'neutral', 'good', 'excellent'),
  `energy_level` INT CHECK (`energy_level` >= 1 AND `energy_level` <= 10),
  `notes` TEXT,
  `exercises_completed` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`plan_id`) REFERENCES `ai_generated_plans`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`plan_day_id`) REFERENCES `plan_days`(`id`) ON DELETE SET NULL,
  
  INDEX `idx_user_date` (`user_id`, `log_date`),
  INDEX `idx_plan_progress` (`plan_id`, `log_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Felhasználói beállítások és preferenciák edzéstervhez
DROP TABLE IF EXISTS `user_workout_preferences`;
CREATE TABLE IF NOT EXISTS `user_workout_preferences` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `preferred_goal_id` INT,
  `preferred_fitness_level_id` INT,
  `preferred_location_id` INT,
  `preferred_equipment_ids` JSON,
  `preferred_days_per_week` INT DEFAULT 3,
  `preferred_session_duration` INT DEFAULT 45,
  `injuries_or_limitations` TEXT,
  `favorite_exercises` JSON,
  `disliked_exercises` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`preferred_goal_id`) REFERENCES `goals`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`preferred_fitness_level_id`) REFERENCES `fitness_levels`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`preferred_location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. LÉPÉSSZÁM INTEGRÁCIÓ EDZÉSTERVVEL
-- =====================================================

-- Napi lépéscélok edzéstervhez kapcsolva
DROP TABLE IF EXISTS `daily_step_goals`;
CREATE TABLE IF NOT EXISTS `daily_step_goals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `plan_id` INT,
  `plan_day_id` INT,
  `target_date` DATE NOT NULL,
  `step_goal` INT DEFAULT 10000,
  `step_goal_type` ENUM('rest_day', 'light', 'moderate', 'active', 'intense') DEFAULT 'moderate',
  `achieved` BOOLEAN DEFAULT FALSE,
  `actual_steps` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`plan_id`) REFERENCES `ai_generated_plans`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`plan_day_id`) REFERENCES `plan_days`(`id`) ON DELETE SET NULL,
  
  UNIQUE KEY `unique_user_date` (`user_id`, `target_date`),
  INDEX `idx_user_goals` (`user_id`, `target_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. INDEXEK ÉS OPTIMALIZÁCIÓ
-- =====================================================

-- További hasznos indexek a gyorsabb lekérdezésekhez
CREATE INDEX IF NOT EXISTS `idx_exercises_difficulty` ON `exercises`(`difficulty_level`);
CREATE INDEX IF NOT EXISTS `idx_exercises_block` ON `exercises`(`block_type_id`);
CREATE INDEX IF NOT EXISTS `idx_plans_status` ON `ai_generated_plans`(`status`, `is_active`);

-- =====================================================
-- SÉMA VÉGE
-- =====================================================


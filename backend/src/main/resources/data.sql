-- ============================================================
-- Seed data cho môi trường development/test
-- Password được hash bằng BCrypt (strength=10)
--
-- Credentials:
--   teacher@edumind.dev  / Teacher123!
--   student@edumind.dev  / Student123!
--   admin@edumind.dev    / Admin1234!
-- ============================================================

INSERT INTO users (role, name, email, password_hash, status, created_at)
VALUES
  ('TEACHER', 'Nguyễn Demo Teacher', 'teacher@edumind.dev',
   '$2b$10$Ail1nAo4FpqfHTzWw0Uj4.TcGjZXteLuR5EnpBGTwwoPVuOMF3rvi',
   'ACTIVE', NOW()),
  ('STUDENT', 'Trần Demo Student', 'student@edumind.dev',
   '$2b$10$fBJEqFBkg6lFty3btNoVkujryqSAUTn..Q6DyZ/QbknJjS6XxFC.O',
   'ACTIVE', NOW()),
  ('ADMIN', 'Admin EduMind', 'admin@edumind.dev',
   '$2b$10$mp3BRURQvkevLTbY2BwkZeYGITaHF0p/P/E6P4/PtMDQ1lKWSibHq',
   'ACTIVE', NOW())
ON CONFLICT (email) DO NOTHING;
INSERT INTO lectures (teacher_id, title, original_source, video_status, created_at)
VALUES
  (1, 'Lecture 1', 'src 1', 'PENDING', NOW()),
  (1, 'Lecture 2', 'src 2', 'PENDING', NOW()),
  (1, 'Lecture 3', 'src 3', 'PENDING', NOW()),
  (1, 'Lecture 4', 'src 4', 'PENDING', NOW()),
  (1, 'Lecture 5', 'src 5', 'PENDING', NOW())
ON CONFLICT DO NOTHING;
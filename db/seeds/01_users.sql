-- since it's a demo phase, we'll use a global password for the users
ALTER TABLE users
ALTER COLUMN password
SET DEFAULT
'$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.';


INSERT INTO users (username, latitude, longitude)
VALUES
('torontofam', 43.6523736, -79.3857858),
('montrealtbk', 45.5069794, -73.5587676);

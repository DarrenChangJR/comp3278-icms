INSERT INTO student (name, email, last_login, last_logout) VALUES
('Chang Darren Juin Rong', 'darrenjr@connect.hku.hk', '2023-01-02 12:00:00', '2023-01-02 12:10:00'),
('Zhang Xichen', 'u3584465@connect.hku.hk', '2023-11-11 16:00:00', '2023-01-02 17:10:00'),
('Wong Aidan Weng Seng','aidan21@connect.hku.hk','2023-11-18 01:25:00', '2023-11-11 11:11:11'),
('Ziya Shaheer','shaheer@connect.hku.hk','2023-11-18 01:25:00', '2023-11-11 11:11:11'),
('Yaw Jalik','u3572943@connect.hku.hk','2023-11-18 01:25:00', '2023-11-11 11:11:11');

INSERT INTO course (code, semester, academic_year, name, moodle_link) VALUES
-- COMP3278 : 1, FINA1310: 2, COMP3230: 3, MATH3301: 4, MATH3401: 5, MATH3603: 6, MATH3904: 7, COMP0297: 8
('COMP3278', '1', '2023', 'Introduction to database management systems', 'https://moodle.hku.hk/course/view.php?id=106523'),
('FINA1310', '1', '2023', 'Corporate Finance', 'https://moodle.hku.hk/course/view.php?id=111971'),
('COMP3230', '1', '2023', 'Principles of Operating Systems', 'https://moodle.hku.hk/course/view.php?id=106508'),
('MATH3301', '1', '2023', 'Algebra I', 'https://webapp.science.hku.hk/sr4/servlet/enquiry?Type=Course&course_code=MATH3301'),
('MATH3401', '1', '2023', 'Analysis I', 'https://webapp.science.hku.hk/sr4/servlet/enquiry?Type=Course&course_code=MATH3401'),
('MATH3603', '1', '2023', 'Probability Theory', 'https://webapp.science.hku.hk/sr4/servlet/enquiry?Type=Course&course_code=MATH3603'),
('MATH3904', '1', '2023', 'Introduction to Optimization', 'https://webapp.science.hku.hk/sr4/servlet/enquiry?Type=Course&course_code=MATH3904'),
('COMP0297', '1', '2023', 'Software Engineering', 'https://www.cs.hku.hk/index.php/programmes/course-offered?infile=2022/comp3297.html');

INSERT INTO takes (student_id, course_id) VALUES
(1, 1), (1, 3), (1, 2),
(2, 1), (2, 6), (2, 7),
(3, 1),
(4, 1), (4, 3), (4, 4), (4, 5),
(5, 1);

-- type: true for lecture, false for tutorial
INSERT INTO class (course_id, teacher_message, location, day, type, zoom_link, start_date, end_date, start_time, end_time) 
VALUES 
-- COMP3278 [DBMS]
(1, "Median for SQL challenge was 2/10", "MWT1", '1', '0', "https://hku.zoom.us/j/98307568693?pwd=QmlqZERWeDdWRVZ3SGdqWG51YUtndz09", '2023-10-09', '2023-10-09', '14:30', '15:20'),
(1, "Median for SQL challenge was 2/10", "MWT1", '1', '0', "https://hku.zoom.us/j/98307568693?pwd=QmlqZERWeDdWRVZ3SGdqWG51YUtndz09", '2023-09-07', '2023-10-12', '14:30', '15:20'),
(1, "Median for SQL challenge was 2/10", "MWT1", '1', '0', "https://hku.zoom.us/j/98307568693?pwd=QmlqZERWeDdWRVZ3SGdqWG51YUtndz09", '2023-10-30', '2023-11-27', '14:30', '15:20'),
(1, "You may bring GPUs for the final exam", "MWT1", '4', '1', "https://hku.zoom.us/j/98307568693?pwd=QmlqZERWeDdWRVZ3SGdqWG51YUtndz09", '2023-09-07', '2023-10-12', '13:30', '15:20'),
(1, "You may bring GPUs for the final exam", "MWT1", '4', '1', "https://hku.zoom.us/j/98307568693?pwd=QmlqZERWeDdWRVZ3SGdqWG51YUtndz09", '2023-10-26', '2023-11-30', '13:30', '15:20'),

-- FINA1310 [Corporate Finance]

-- COMP3230
(3, "Please bring your computers to Tutorials", "CYCP1", '2', '0', NULL, '2023-09-05', '2023-10-10', '10:30', '12:20'),
(3, "Please bring your computers to Tutorials", "CYCP1", '2', '0', NULL, '2023-10-24', '2023-11-28', '10:30', '12:20'),
(3, "Please do the readings before lectures", "CYCP1", '4', '1', NULL, '2023-09-07', '2023-10-12', '10:30', '12:20'),
(3, "Reading Week is over, the finals are approaching", "CYCP1", '4', '1', NULL, '2023-10-26', '2023-11-30', '10:30', '12:20'),

-- MATH3301
(4, "Please prepare your questions for presentation", "MWT1", '4', '0', NULL, '2023-09-07', '2023-10-12', '15:30', '16:20'),
(4, "Please prepare your questions for presentation", "MWT1", '4', '0', NULL, '2023-10-26', '2023-11-30', '15:30', '16:20'),
(4, "Please do the exercises before the lecture!", "MB237", '4', '1', NULL, '2023-09-07', '2023-10-12', '12:30', '13:20'),
(4, "Please do the exercises before the lecture!", "MB237", '4', '1', NULL, '2023-10-26', '2023-11-30', '12:30', '13:20'),
(4, "Please do the exercises before the lecture!", "MB237", '1', '1', NULL, '2023-09-04', '2023-09-25', '12:30', '14:20'),
(4, "Please do the exercises before the lecture!", "MB237", '1', '1', NULL, '2023-09-09', '2023-09-09', '12:30', '14:20'),
(4, "Please do the exercises before the lecture!", "MB237", '1', '1', NULL, '2023-10-30', '2023-11-27', '12:30', '14:20');

INSERT INTO note (course_id, title, note_link) VALUES
(1, "Lecture 1: Introduction", "https://moodle.hku.hk/mod/resource/view.php?id=3081895"),
(1, "Lecture 2: ER Model", "https://moodle.hku.hk/mod/resource/view.php?id=3081960"),
(1, "Lecture 2: ER Model (Answers)", "https://moodle.hku.hk/mod/resource/view.php?id=3095353"),
(1, "Lecture 2: Group Discussion", "https://moodle.hku.hk/mod/resource/view.php?id=3088157"),
(1, "Lecture 3: ER Design", "https://moodle.hku.hk/mod/resource/view.php?id=3095373");

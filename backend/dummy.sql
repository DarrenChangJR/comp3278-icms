INSERT INTO student (name, email, last_login, last_logout) VALUES
('Chang Darren Juin Rong', 'darrenjr@connect.hku.hk', '2023-01-02 12:00:00', '2023-01-02 12:10:00'),
('Zhang Xichen', 'u3584465@connect.hku.hk', '2023-11-11 16:00:00', '2023-01-02 17:10:00'),
('Wong Aidan Weng Seng','aidan21@connect.hku.hk','2023-11-18 01:25:00', '2023-11-11 11:11:11'),
('Ziya Shaheer','shaheer@connect.hku.hk','2023-11-18 01:25:00', '2023-11-11 11:11:11'),
('Yaw Jalik','"u3572943@connect.hku.hk','2023-11-18 01:25:00', '2023-11-11 11:11:11');

INSERT INTO course (code, semester, academic_year, name, moodle_link) VALUES
('COMP3278', '1', '2023', 'Introduction to database management systems', 'https://moodle.hku.hk/course/view.php?id=106523'),
('FINA1310', '1', '2023', 'Corporate Finance', 'https://moodle.hku.hk/course/view.php?id=111971'),
('COMP3230', '1', '2023', 'Principles of Operating Systems', 'https://moodle.hku.hk/course/view.php?id=106508');

INSERT INTO takes (student_id, course_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(1, 2),
(1, 3);

INSERT INTO class (course_id, teacher_message, location, day, type, zoom_link, start_date, end_date, start_time, end_time) 
VALUES 
(1, "Median for SQL challenge was 2/10", "MWT1", '1', 'Tutorial', "https://hku.zoom.us/j/98307568693?pwd=QmlqZERWeDdWRVZ3SGdqWG51YUtndz09", '2023-09-07', '2023-10-12', '14:30', '15:20'),
(1, "Median for SQL challenge was 2/10", "MWT1", '1', 'Tutorial', "https://hku.zoom.us/j/98307568693?pwd=QmlqZERWeDdWRVZ3SGdqWG51YUtndz09", '2023-10-09', '2023-10-09', '14:30', '15:20'),
(1, "Median for SQL challenge was 2/10", "MWT1", '1', 'Tutorial', "https://hku.zoom.us/j/98307568693?pwd=QmlqZERWeDdWRVZ3SGdqWG51YUtndz09", '2023-10-30', '2023-11-27', '14:30', '15:20'),
(1, "You may bring GPUs for the final exam", "MWT1", '4', 'Lecture', "https://hku.zoom.us/j/98307568693?pwd=QmlqZERWeDdWRVZ3SGdqWG51YUtndz09", '2023-09-07', '2023-10-12', '13:30', '15:20'),
(1, "You may bring GPUs for the final exam", "MWT1", '4', 'Lecture', "https://hku.zoom.us/j/98307568693?pwd=QmlqZERWeDdWRVZ3SGdqWG51YUtndz09", '2023-10-26', '2023-11-30', '13:30', '15:20');

INSERT INTO note (course_id, title, note_link) VALUES
(1, "Lecture 1: Introduction", "https://moodle.hku.hk/mod/resource/view.php?id=3081895"),
(1, "Lecture 2: ER Model", "https://moodle.hku.hk/mod/resource/view.php?id=3081960"),
(1, "Lecture 2: ER Model (Answers)", "https://moodle.hku.hk/mod/resource/view.php?id=3095353"),
(1, "Lecture 2: Group Discussion", "https://moodle.hku.hk/mod/resource/view.php?id=3088157"),
(1, "Lecture 3: ER Design", "https://moodle.hku.hk/mod/resource/view.php?id=3095373");

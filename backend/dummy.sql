INSERT INTO student (name, email, last_login, last_logout) VALUES
('John Doe', 'johndoe@example.com', '2023-01-02 12:00:00', '2023-01-02 12:10:00'),
('Jane Nigga', 'janenigga@example.com', '2023-11-11 16:00:00', '2023-01-02 17:10:00'),
('Dontabusemyemail','aidan21@connect.hku.hk','2023-11-18 01:25:00', '2023-11-11 11:11:11');

INSERT INTO course (code, semester, academic_year, name, moodle_link) VALUES
('COMP3278', '2', '2023', 'Introduction to Database Management Nigga', 'https://nigga.com'),
('FINA1310', '2', '2023', 'Introduction to Finance Nigger', 'https://nigger.com');

INSERT INTO takes (student_id, course_id) VALUES
(1, 1),
(1, 2),
(2, 1);

INSERT INTO class (course_id, teacher_message, location, day, type, zoom_link, start_date, end_date, start_time, end_time) 
VALUES 
(1, "HI", "csa", '1', 'Lecture', "njeklsd", '2023-01-17', '2023-05-30', '10:30:00', '11:20:00'),
(1, "Nigga", "sky hall", '1', 'Tutorial', "dasgvhj", '2023-01-17', '2023-05-30', '11:30:00', '13:20:00'),
(1, "How are u", "u hall", '2', 'Tutorial', "hjbasd", '2023-01-17', '2023-05-30', '13:30:00', '14:20:00'),
(2, "Are you John Doe? Only He takes this class", "u hall", '4', 'Tutorial', "hjbasd",'2023-01-17', '2023-05-30', '13:30:00', '14:20:00');

INSERT INTO note (course_id, title, note_link) VALUES
(1, "Lecture 1: Niggbase Diagrams", "father.com"),
(2, "Lecture 0: Chilling 'cuz Business Faculty", "shaadi.com");
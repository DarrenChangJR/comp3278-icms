INSERT INTO student (name, email, last_login, last_logout) VALUES
('John Doe', 'johndoe@example.com', '2023-01-02 12:00:00', '2023-01-02 12:10:00'),
('Jane Nigga', 'janenigga@example.com', '2023-11-11 16:00:00', '2023-01-02 17:10:00');

INSERT INTO course (code, semester, academic_year, name, moodle_link) VALUES
('COMP3278', '2', '2023', 'Introduction to Database Management Nigga', 'https://nigga.com'),
('FINA1310', '2', '2023', 'Introduction to Finance Nigger', 'https://nigger.com');

INSERT INTO takes (student_id, course_id) VALUES
(1, 1),
(1, 2),
(2, 1);

-- Generate fourteen base users

insert into users (first_name, last_name, password, username) values ('Bibi', 'Haseman', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'bhaseman0');
insert into users (first_name, last_name, password, username) values ('Creight', 'Dalyiel', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'cdalyiel1');
insert into users (first_name, last_name, password, username) values ('Conant', 'Merigot', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'cmerigot2');
insert into users (first_name, last_name, password, username) values ('Michell', 'Leabeater', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'mleabeater3');
insert into users (first_name, last_name, password, username) values ('Agnella', 'Tropman', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'atropman4');
insert into users (first_name, last_name, password, username) values ('Marieann', 'Simm', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'msimm5');
insert into users (first_name, last_name, password, username) values ('Blinny', 'Toyer', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'btoyer6');
insert into users (first_name, last_name, password, username) values ('Betta', 'Hanscomb', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'bhanscomb7');
insert into users (first_name, last_name, password, username) values ('Lynett', 'Shitliff', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'lshitliff8');
insert into users (first_name, last_name, password, username) values ('Abbye', 'Hearnaman', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'ahearnaman9');
insert into users (first_name, last_name, password, username) values ('Locke', 'Plaunch', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'lplauncha');
insert into users (first_name, last_name, password, username) values ('Leoline', 'Jenicke', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'ljenickeb');
insert into users (first_name, last_name, password, username) values ('Candra', 'Harcus', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'charcusc');
insert into users (first_name, last_name, password, username) values ('Bibbie', 'Bellocht', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'bbellochtd');

-- Assign two as administrator (1, 2)

insert into admins (id) values (1);
insert into admins (id) values (2);

-- Assign five as customers (3, 4, 5, 6, 7)

insert into customers (address, phone_number, id) values ('080 Atwood Park', '357 290 8605', 3);
insert into customers (address, phone_number, id) values ('9 Division Crossing', '606 904 1519', 4);
insert into customers (address, phone_number, id) values ('072 Barnett Circle', '593 611 8522', 5);
insert into customers (address, phone_number, id) values ('552 Pond Junction', '297 916 8815', 6);
insert into customers (address, phone_number, id) values ('1580 Westend Alley', '347 921 6570', 7);

-- Assign three as workers (8, 9, 10)

insert into workers (role, id) values ('Legal', 8);
insert into workers (role, id) values ('Research and Development', 9);
insert into workers (role, id) values ('Marketing', 10);

-- Create three bookings for one worker (8) with three other customers (3, 4, 5)

insert into bookings (booking_id, end_time, start_time, user_id, worker_id) values (280, '2020-08-03 09:00:00', '2020-08-03 07:30:00', 3, 8);
insert into bookings (booking_id, end_time, start_time, user_id, worker_id) values (665, '2020-08-04 10:15:00', '2020-08-04 09:15:00', 4, 8);
insert into bookings (booking_id, end_time, start_time, user_id, worker_id) values (56, '2020-08-07 15:45:00', '2020-08-07 14:30:00', 5, 8);

-- Fill out availability for the two other workers (9, 10)

insert into working_hours (entry_id, end_time, start_time, worker_id) values (991, '2020-11-10 08:30:00', '2020-11-10 07:30:00', 9);
insert into working_hours (entry_id, end_time, start_time, worker_id) values (504, '2020-11-12 08:30:00', '2020-11-12 07:30:00', 9);
insert into working_hours (entry_id, end_time, start_time, worker_id) values (864, '2020-11-14 10:45:00', '2020-11-14 09:45:00', 9);
insert into working_hours (entry_id, end_time, start_time, worker_id) values (89, '2020-11-11 12:30:00', '2020-11-11 10:30:00', 10);
insert into working_hours (entry_id, end_time, start_time, worker_id) values (52, '2020-11-13 15:30:00', '2020-11-13 14:30:00', 10);

-- Generate fourteen base users

insert into users (first_name, last_name, password, username)
values ('Bibi', 'Haseman', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'bhaseman0');
insert into users (first_name, last_name, password, username)
values ('Conant', 'Merigot', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'cmerigot2');
insert into users (first_name, last_name, password, username)
values ('Agnella', 'Tropman', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'atropman4');
insert into users (first_name, last_name, password, username)
values ('Abbye', 'Hearnaman', '$2a$10$E1fb7N0M/hS.7faWztnC0O76r/D37iKBbl3E.6W8NRgvf5fasNg0i', 'ahearnaman9');

insert into admins (id)
values (1);

insert into customers (address, phone_number, id)
values ('080 Atwood Park', '357 290 8605', 3);

insert into workers (role, id)
values ('Legal', 8);


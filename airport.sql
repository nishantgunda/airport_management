create table airport(IATA char(3),City varchar(20) NOT NULL,Name varchar(50) NOT NULL,primary key(IATA));
create table company(ID char(5),Location varchar(20) NOT NULL,Name varchar(50) NOT NULL,primary key(ID));
create table model(name varchar(10),seats numeric NOT NULL,fuel_capacity numeric(3) NOT NULL,weight_capacity numeric(2) NOT NULL,primary key(name));
create table plane(ID varchar(7),model_name varchar(10),company_id char(5),manufacturer varchar(20),Foreign key(model_name) references model(name),Foreign key(company_id) references company(id));
create table leg(flight_id varchar(7),source_id char(3) NOT NULL,destination_id char(3) NOT NULL,departure datetime NOT NULL,arrival datetime NOT NULL,primary key(flight_id,departure),foreign key(flight_id) references plane(id),foreign key(source_id) references airport(IATA),foreign key(destination_id) references airport(IATA),check(departure<arrival));
create table runway(ID char(1),airport_id char(3),primary key(ID,airport_id),foreign key(airport_id) references airport(IATA));
create table employee(ID char(7),phone numeric(10,0) not null,name varchar(20)not null,airport_id char(3) not null,company_id char(5),foreign key(airport_id) references airport(IATA),foreign key(company_id) references company(id));
create table fare(id char(1),fare_plan varchar(10) NOT NULL,disc_amt numeric NOT NULL,primary key(id));
create table passenger(id varchar(9),name varchar(20) not null,phone numeric not null,email varchar(40)not null,address varchar(25)not null,primary key(id));
create table ticket(flight_id varchar(7),seat numeric NOT NULL,passenger_id varchar(9),departure datetime,fare_id char(1) NOT NULL,primary key(flight_id,passenger_id,departure),foreign key(flight_id) references plane(id),foreign key(passenger_id) references passenger(id),foreign key(fare_id) references fare(id),foreign key(flight_id,departure) references leg);
create table baggage(id char(1),passenger_id varchar(9),weight numeric NOT NULL,primary key(id,passenger_id),foreign key(passenger_id)references passenger(id));
CREATE TRIGGER delete_data_after_airport_delete
AFTER DELETE ON airport
FOR EACH ROW
BEGIN
    -- Delete flights connecting to the deleted airport
    DELETE FROM leg WHERE source_id = OLD.IATA OR destination_id = OLD.IATA;

    -- Delete tickets of flights connecting to the deleted airport
    DELETE FROM ticket WHERE flight_id IN (SELECT ID FROM plane WHERE plane.ID IN (SELECT flight_id FROM leg WHERE source_id = OLD.IATA OR destination_id = OLD.IATA));

    -- Delete employees assigned to the deleted airport
    DELETE FROM employee WHERE airport_id = OLD.IATA;

    -- Delete runways of the deleted airport
    DELETE FROM runway WHERE airport_id = OLD.IATA;
END;
CREATE TRIGGER delete_employees_after_company_delete
AFTER DELETE ON company
FOR EACH ROW
BEGIN
    -- Delete employees belonging to the deleted company
    DELETE FROM employee WHERE company_id = OLD.ID;
END;
CREATE TRIGGER delete_tickets_after_plane_delete
AFTER DELETE ON plane
FOR EACH ROW
BEGIN
    -- Delete tickets related to the deleted plane
    DELETE FROM ticket WHERE flight_id = OLD.ID;
END;
CREATE TRIGGER delete_tickets_after_passenger_delete
AFTER DELETE ON passenger
FOR EACH ROW
BEGIN
    -- Delete tickets related to the deleted passenger
    DELETE FROM ticket WHERE passenger_id = OLD.id;
END;
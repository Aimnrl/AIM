-- Buildings table
CREATE TABLE buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    description TEXT
);

-- Add a building
INSERT INTO buildings (name, address, description)
VALUES ("Woodland", "1600 Woodland RD", "Main Science building");

-- areas table
CREATE TABLE areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    building_id INTEGER NOT NULL,
    level INTEGER NOT NULL,
    floor_plan TEXT,  -- Path to floor plan image
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

-- Add area 1
INSERT INTO areas (building_id, level, floor_plan)
VALUES (1, 1, "Floor Plans\\Woodland 0979008-1.pdf");
-- Add area 2
INSERT INTO areas (building_id, level, floor_plan)
VALUES (1, 1, "Floor Plans\\Woodland 0979008-1.pdf");
-- Add area 3
INSERT INTO areas (building_id, level, floor_plan)
VALUES (1, 2, "Floor Plans\\Woodland 0979008-2.pdf");
-- Add area 4
INSERT INTO areas (building_id, level, floor_plan)
VALUES (1, 2, "Floor Plans\\Woodland 0979008-2.pdf");
-- Add area 5
INSERT INTO areas (building_id, level, floor_plan)
VALUES (1, 3, "Floor Plans\\Woodland 0979008-3.pdf");
-- Add area 6
INSERT INTO areas (building_id, level, floor_plan)
VALUES (1, 3, "Floor Plans\\Woodland 0979008-3.pdf");


-- Rooms table
CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area_id INTEGER NOT NULL,
    room_number TEXT NOT NULL,
    name TEXT,
    x_coord INTEGER,   -- Optional: position on floor plan
    y_coord INTEGER,
    FOREIGN KEY (area_id) REFERENCES areas(id)
);

-- Add 1st floor rooms
INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (1, "104", "Multi-Media Production", 1715, 260);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (1, "105", "Lib Womens Restroom", 1695, 300);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (1, "107", "Lib Mens Restroom", 1695, 300);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (1, "108", "Staff Office", 1650, 400);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (1, "113", "Womens Restroom", 1495, 665);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (1, "115", "Mens Restroom", 1484, 685);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (1, "116", "Gallery", 1535, 660);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (1, "121", "General Purpose Classroom", 1480, 745);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (1, "123", "Department Computing Laboratory", 1450, 735);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (1, "124", "Class Laboratory", 1445, 820);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (2, "127", "Womens Restroom", 1332, 965);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (2, "128", "Mens Restroom", 1325, 1050);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (2, "132A", "Department Computing Laboratory", 1334, 1117);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (2, "132B", "Department Computing Laboratory", 1260, 1200);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (2, "133A", "Class Laboratory", 1255, 1207);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (2, "133B", "Departmental Classroom", 1180, 1290);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (2, "134", "Departmental Classroom", 1170, 1305);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (2, "135", "Departmental Classroom", 1103, 1379);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (2, "136A", "Departmental Classroom", 1080, 1373);

INSERT INTO rooms (area_id, room_number, name, x_coord, y_coord)
VALUES (2, "136b", "Departmental Classroom", 1036, 1422);


-- Pictures table
CREATE TABLE pictures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,  -- Path to the hallway image
    orientation TEXT,         -- e.g., 'north', 'toward room 203'
    coordinates TEXT,         -- Optional (e.g., "x:100,y:250" or geo JSON)
    nearby_rooms TEXT,        -- Optional (e.g., "201,203")
    notes TEXT,
    FOREIGN KEY (area_id) REFERENCES areas(id)
);


-- Add a picture
INSERT INTO pictures (area_id, file_path, orientation, coordinates, notes)
VALUES (1, "211CANON\\IMG_1130.JPG", "north", "1680,550", "Taken infront of Library");

INSERT INTO pictures (area_id, file_path, orientation, coordinates, notes)
VALUES (1, "211CANON\\IMG_1131.JPG", "south", "1590,515", "Taken by elevator");

INSERT INTO pictures (area_id, file_path, orientation, coordinates, notes)
VALUES (1, "211CANON\\IMG_1149.JPG", "north", "1430,820", "Taken by 124 lab");

INSERT INTO pictures (area_id, file_path, orientation, coordinates, notes)
VALUES (2, "211CANON\\IMG_1143.JPG", "north", "1085,1370", "Taken by 136A");

INSERT INTO pictures (area_id, file_path, orientation, coordinates, notes)
VALUES (2, "211CANON\\IMG_1146.JPG", "south", "1327,1100", "Taken by 132A");

INSERT INTO pictures (area_id, file_path, orientation, coordinates, notes)
VALUES (2, "211CANON\\IMG_1148.JPG", "south", "1343,920", "Taken outside the entrance of area 2");

INSERT INTO pictures (area_id, file_path, orientation, coordinates, notes)
VALUES (2, "211CANON\\IMG_1155.JPG", "west", "1590,530", "Taken in lobby");
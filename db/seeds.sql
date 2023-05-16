INSERT INTO department (name)
VALUES  ("Grocery"),
        ('Produce'),
        ('Meat'),
        ('Frozen'),
        ('Fired');

INSERT INTO role (title, salary, department_id)
VALUES  ('Manager', 50000, 1),
        ('Stocker', 20000, 1),
        ('Floor Sweep', 10000, 1),
        
        ('Manager', 50000, 2),
        ('Stocker', 20000, 2),
        ('Cleaner', 10000, 2),
        
        ('Meat Manager', 50000, 3),
        ('Head Meat Cutter', 40000, 3),
        ('Meat Cutter', 30000, 3),
        
        ('Manager', 40000, 4),
        ('Stocker', 20000, 4),
        ('Cleaner', 10000, 4),

        ('Fired', 0, 5);

INSERT INTO employee(first_name, last_name,role_id, manager_id)
VALUES  ('Selena', 'Salas', 1, 0),
        ('David','King',2, 1),
        ('Sarah','Joyner',3, 1),
        ('Emma','Kite',4, 0),
        ('Stacy','Kirkt',5, 4),
        ('Joy','Knowles',6, 4),
        ('Zach','Battles',7, 0),
        ('Joe','Boyd',8, 7),
        ('Ken','Shepherd',9, 7),
        ('Daniel','Ashworth',10, 0),
        ('Albert','Hunt',11, 10),
        ('Taylor','Thompson',12, 10);

-- ==========================================================
-- E-COMPLAINT COMPLETE DATABASE SETUP
-- ==========================================================

CREATE DATABASE IF NOT EXISTS e_complaint;
USE e_complaint;

-- ==========================================================
-- Users Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
  id       INT(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email    VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  points   INT DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- Workers Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS workers (
  id       INT(11) NOT NULL AUTO_INCREMENT,
  name     VARCHAR(100) NOT NULL,
  email    VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  status   ENUM('free','busy') DEFAULT 'free',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- Departments Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS departments (
  id       INT(11) NOT NULL AUTO_INCREMENT,
  name     VARCHAR(100) NOT NULL,
  email    VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  category ENUM('streetlight','water','road','sanitation','other') NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- Complaints Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS complaints (
  id                  INT(11) NOT NULL AUTO_INCREMENT,
  user_id             INT(11),
  title               VARCHAR(255) NOT NULL,
  description         TEXT NOT NULL,
  location            VARCHAR(255) NOT NULL,
  category            ENUM('streetlight','water','road','sanitation','other') DEFAULT 'other',
  image               VARCHAR(255),
  department_id       INT(11),
  assigned_worker_id  INT(11),
  status              ENUM('pending','in_progress','resolved') DEFAULT 'pending',
  verification_status ENUM('pending','verified') DEFAULT 'pending',
  admin_verification  ENUM('pending','genuine','fake') DEFAULT 'pending',
  resolved_image      VARCHAR(255),
  latitude            DECIMAL(10, 8),
  longitude           DECIMAL(11, 8),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id)            REFERENCES users(id)       ON DELETE SET NULL,
  FOREIGN KEY (department_id)      REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_worker_id) REFERENCES workers(id)     ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- Default Departments (plain-text passwords for initial seed)
-- Use the Admin → Add Department form to create hashed-password depts.
-- ==========================================================
INSERT INTO departments (name, email, password, category) VALUES
('Electricity Department', 'electricity@gov.in', 'Dept@1234', 'streetlight'),
('Water & Drainage Board',  'water@gov.in',       'Dept@1234', 'water'),
('Roads & Infrastructure',  'roads@gov.in',       'Dept@1234', 'road'),
('Sanitation Department',   'sanitation@gov.in',  'Dept@1234', 'sanitation');

SELECT 'E-Complaint Database Setup Completed' AS Status;

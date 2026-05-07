-- ============================================================
-- School Management API — Database Setup Script
-- Run this once before starting the application
-- ============================================================

-- 1. Create the database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS school_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE school_management;

-- 2. Create the schools table
CREATE TABLE IF NOT EXISTS schools (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255)   NOT NULL,
  address    VARCHAR(500)   NOT NULL,
  latitude   FLOAT          NOT NULL,
  longitude  FLOAT          NOT NULL,
  created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. (Optional) Seed data for testing
INSERT INTO schools (name, address, latitude, longitude) VALUES
  ('Delhi Public School',       'Sector 45, Gurugram, Haryana',          28.4595,  77.0266),
  ('Kendriya Vidyalaya',        'IIT Campus, Powai, Mumbai',             19.1334,  72.9133),
  ('The Cathedral School',      'Fort Area, Mumbai, Maharashtra',        18.9322,  72.8338),
  ('Ryan International School', 'Sector 31, Noida, Uttar Pradesh',      28.5706,  77.3215),
  ('Symbiosis School',          'Senapati Bapat Road, Pune, MH',        18.5204,  73.8567);

-- Verify
SELECT * FROM schools;

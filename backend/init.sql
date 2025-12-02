-- ==========================================
-- Usinagem Limmar - Banco completo atualizado
-- ==========================================

CREATE DATABASE IF NOT EXISTS usinagemlimmar;
USE usinagemlimmar;

-- ==========================================
-- TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  cpf VARCHAR(20) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'supervisor', 'operator') DEFAULT 'operator',
  active BOOLEAN DEFAULT TRUE,
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  type VARCHAR(100),
  diameter DECIMAL(10,2),
  length DECIMAL(10,2),
  material VARCHAR(100),
  coating VARCHAR(100),
  max_rpm INT,
  cutting_edges INT,
  location VARCHAR(100),
  status ENUM('active', 'inactive', 'maintenance', 'retired') DEFAULT 'active',
  total_life_cycles INT DEFAULT 0,
  max_life_cycles INT,
  last_maintenance DATETIME,
  next_maintenance DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS production_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tool_id INT NOT NULL,
  operator_id INT,
  machine VARCHAR(100) NOT NULL,
  pieces INT NOT NULL,
  pieces_rejected INT DEFAULT 0,
  entry_datetime DATETIME,
  exit_datetime DATETIME,
  production_time INT,
  setup_time INT,
  status ENUM('in_progress', 'completed', 'interrupted') DEFAULT 'in_progress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tool_id) REFERENCES tools(id),
  FOREIGN KEY (operator_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS production_observations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  record_id INT NOT NULL,
  user_id INT NOT NULL,
  observation TEXT NOT NULL,
  observation_type ENUM('quality', 'maintenance', 'general') DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (record_id) REFERENCES production_records(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tool_maintenance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tool_id INT NOT NULL,
  technician_id INT,
  maintenance_type ENUM('preventive', 'corrective', 'failure') NOT NULL,
  description TEXT NOT NULL,
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME,
  cost DECIMAL(10,2),
  status ENUM('scheduled', 'in_progress', 'completed') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tool_id) REFERENCES tools(id),
  FOREIGN KEY (technician_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tool_failures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tool_id INT NOT NULL,
  operator_id INT,
  failure_datetime DATETIME NOT NULL,
  failure_type VARCHAR(100),
  severity ENUM('low','medium','high') NOT NULL,
  machine VARCHAR(100),
  operation_type VARCHAR(100),
  material_processed VARCHAR(100),
  cutting_parameters TEXT,
  reason TEXT NOT NULL,
  action_taken TEXT,
  maintenance_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tool_id) REFERENCES tools(id),
  FOREIGN KEY (operator_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS production_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  record_id INT NOT NULL,
  oee DECIMAL(5,2),
  availability DECIMAL(5,2),
  performance DECIMAL(5,2),
  quality DECIMAL(5,2),
  cycle_time DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (record_id) REFERENCES production_records(id)
);

CREATE TABLE IF NOT EXISTS tool_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tool_id INT NOT NULL,
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by INT,
  change_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tool_id) REFERENCES tools(id),
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- ==========================================
-- PROCEDURES
-- ==========================================

DROP PROCEDURE IF EXISTS insert_user;
DROP PROCEDURE IF EXISTS update_user;
DROP PROCEDURE IF EXISTS delete_user;
DROP PROCEDURE IF EXISTS insert_tool;
DROP PROCEDURE IF EXISTS update_tool;
DROP PROCEDURE IF EXISTS delete_tool;

DELIMITER $$

CREATE PROCEDURE insert_user(
  IN p_name VARCHAR(200),
  IN p_cpf VARCHAR(20),
  IN p_password_hash VARCHAR(255),
  IN p_role ENUM('admin','supervisor','operator')
)
BEGIN
  INSERT INTO users (name, cpf, password_hash, role)
  VALUES (p_name, p_cpf, p_password_hash, p_role);
END $$

CREATE PROCEDURE update_user(
  IN p_id INT,
  IN p_name VARCHAR(200),
  IN p_role ENUM('admin','supervisor','operator'),
  IN p_active BOOLEAN
)
BEGIN
  UPDATE users
  SET name = p_name,
      role = p_role,
      active = p_active
  WHERE id = p_id;
END $$

CREATE PROCEDURE delete_user(IN p_id INT)
BEGIN
  DELETE FROM users WHERE id = p_id;
END $$

-- TOOLS
CREATE PROCEDURE insert_tool(
  IN p_code VARCHAR(50),
  IN p_description VARCHAR(255),
  IN p_brand VARCHAR(100),
  IN p_type VARCHAR(100),
  IN p_diameter DECIMAL(10,2),
  IN p_length DECIMAL(10,2),
  IN p_material VARCHAR(100),
  IN p_coating VARCHAR(100),
  IN p_max_rpm INT,
  IN p_cutting_edges INT,
  IN p_location VARCHAR(100),
  IN p_max_life_cycles INT
)
BEGIN
  INSERT INTO tools (
    code, description, brand, type, diameter, length,
    material, coating, max_rpm, cutting_edges, location,
    max_life_cycles
  )
  VALUES (
    p_code, p_description, p_brand, p_type, p_diameter,
    p_length, p_material, p_coating, p_max_rpm,
    p_cutting_edges, p_location, p_max_life_cycles
  );
END $$

CREATE PROCEDURE update_tool(
  IN p_id INT,
  IN p_description VARCHAR(255),
  IN p_location VARCHAR(100),
  IN p_status ENUM('active','inactive','maintenance','retired'),
  IN p_notes TEXT
)
BEGIN
  UPDATE tools
  SET description = p_description,
      location = p_location,
      status = p_status,
      notes = p_notes
  WHERE id = p_id;
END $$

CREATE PROCEDURE delete_tool(IN p_id INT)
BEGIN
  DELETE FROM tools WHERE id = p_id;
END $$

DELIMITER ;

-- ==========================================
-- TRIGGERS
-- ==========================================

DROP TRIGGER IF EXISTS trg_observation_set_failed;
DROP TRIGGER IF EXISTS trg_update_tool_life;
DROP TRIGGER IF EXISTS trg_tool_status_history;
DROP TRIGGER IF EXISTS trg_tool_maintenance_date;

DELIMITER $$

-- Observação ⇒ status = maintenance
CREATE TRIGGER trg_observation_set_failed
AFTER INSERT ON production_observations
FOR EACH ROW
BEGIN
  UPDATE tools
  SET status = 'maintenance'
  WHERE id = (SELECT tool_id FROM production_records WHERE id = NEW.record_id);

  INSERT INTO tool_status_history(tool_id, previous_status, new_status, changed_by, change_reason)
  SELECT 
      t.id,
      t.status,
      'maintenance',
      NEW.user_id,
      CONCAT('Status alterado automaticamente após observação: ', NEW.observation)
  FROM production_records pr
  JOIN tools t ON t.id = pr.tool_id
  WHERE pr.id = NEW.record_id;
END $$

-- Acumular ciclos ao completar produção
CREATE TRIGGER trg_update_tool_life
AFTER UPDATE ON production_records
FOR EACH ROW
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE tools
    SET total_life_cycles = total_life_cycles + NEW.pieces
    WHERE id = NEW.tool_id;
  END IF;
END $$

-- Registrar histórico ao mudar status manualmente
CREATE TRIGGER trg_tool_status_history
BEFORE UPDATE ON tools
FOR EACH ROW
BEGIN
  IF NEW.status <> OLD.status THEN
    INSERT INTO tool_status_history(tool_id, previous_status, new_status, change_reason)
    VALUES (OLD.id, OLD.status, NEW.status, 'Alteração manual de status');
  END IF;
END $$

-- Registrar data da manutenção
CREATE TRIGGER trg_tool_maintenance_date
BEFORE UPDATE ON tools
FOR EACH ROW
BEGIN
  IF NEW.status = 'maintenance' AND OLD.status <> 'maintenance' THEN
    SET NEW.last_maintenance = NOW();
  END IF;
END $$

DELIMITER ;

-- ==========================================
-- VIEWS (Atualizadas)
-- ==========================================

DROP VIEW IF EXISTS vw_top_tools;
DROP VIEW IF EXISTS vw_tool_status;

-- Mostrar somente ferramentas com produção > 0
CREATE VIEW vw_top_tools AS
SELECT 
    t.id AS tool_id,
    t.code,
    t.description,
    SUM(pr.pieces) AS total_pieces
FROM tools t
JOIN production_records pr ON pr.tool_id = t.id
GROUP BY t.id, t.code, t.description
HAVING total_pieces > 0
ORDER BY total_pieces DESC;

-- Mostrar somente ferramentas que já tiveram uso
CREATE VIEW vw_tool_status AS
SELECT 
    id AS tool_id,
    code,
    description,
    status,
    total_life_cycles,
    max_life_cycles,
    last_maintenance,
    next_maintenance
FROM tools
WHERE total_life_cycles > 0;

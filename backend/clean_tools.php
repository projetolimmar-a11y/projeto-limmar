<?php
// Script para limpar ferramentas FERR-* do banco de dados
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db = 'usinagemlimmar';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Conectado ao MySQL com sucesso!\n";
    
    // Primeiro, listar as ferramentas FERR-%
    $stmt = $pdo->query("SELECT id, code, description FROM tools WHERE code LIKE 'FERR-%'");
    $ferramentsToDelete = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($ferramentsToDelete) > 0) {
        echo "\nFerramentas encontradas:\n";
        foreach ($ferramentsToDelete as $tool) {
            echo "  - ID: {$tool['id']}, Código: {$tool['code']}, Descrição: {$tool['description']}\n";
        }
        
        // Deletar registros de produção associados (para evitar constraint)
        $stmt = $pdo->prepare("DELETE FROM production_records WHERE tool_id IN (SELECT id FROM tools WHERE code LIKE 'FERR-%')");
        $stmt->execute();
        echo "\n✓ Deletados " . $stmt->rowCount() . " registros de produção associados\n";
        
        // Deletar falhas associadas
        $stmt = $pdo->prepare("DELETE FROM tool_failures WHERE tool_id IN (SELECT id FROM tools WHERE code LIKE 'FERR-%')");
        $stmt->execute();
        echo "✓ Deletadas " . $stmt->rowCount() . " falhas associadas\n";
        
        // Deletar observações associadas
        $stmt = $pdo->prepare("DELETE FROM production_observations WHERE record_id IN (SELECT id FROM production_records WHERE tool_id IN (SELECT id FROM tools WHERE code LIKE 'FERR-%'))");
        $stmt->execute();
        echo "✓ Deletadas " . $stmt->rowCount() . " observações associadas\n";
        
        // Deletar manutenção associada
        $stmt = $pdo->prepare("DELETE FROM tool_maintenance WHERE tool_id IN (SELECT id FROM tools WHERE code LIKE 'FERR-%')");
        $stmt->execute();
        echo "✓ Deletadas " . $stmt->rowCount() . " manutenções associadas\n";
        
        // Deletar histórico de status
        $stmt = $pdo->prepare("DELETE FROM tool_status_history WHERE tool_id IN (SELECT id FROM tools WHERE code LIKE 'FERR-%')");
        $stmt->execute();
        echo "✓ Deletado " . $stmt->rowCount() . " históricos de status\n";
        
        // Deletar métricas
        $stmt = $pdo->prepare("DELETE FROM production_metrics WHERE record_id IN (SELECT id FROM production_records WHERE tool_id IN (SELECT id FROM tools WHERE code LIKE 'FERR-%'))");
        $stmt->execute();
        echo "✓ Deletadas " . $stmt->rowCount() . " métricas\n";
        
        // Agora deletar as ferramentas
        $stmt = $pdo->prepare("DELETE FROM tools WHERE code LIKE 'FERR-%'");
        $stmt->execute();
        echo "\n✓ Ferramentas FERR-* deletadas com sucesso! (" . $stmt->rowCount() . " ferramentas)\n";
    } else {
        echo "✓ Nenhuma ferramenta FERR-* encontrada\n";
    }
    
    // Verificar quantas ferramentas restaram
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM tools");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "\n✓ Ferramentas restantes no banco: " . $result['total'] . "\n";
    
    echo "\n✅ Banco de dados limpo com sucesso!\n";
    
} catch(PDOException $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}
?>

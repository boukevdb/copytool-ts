<?php
// Basic Auth check
if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
    header('WWW-Authenticate: Basic realm="CopyTool - Beveiligde Omgeving"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Toegang geweigerd';
    exit;
}

// Check credentials (admin/Formule189!)
if ($_SERVER['PHP_AUTH_USER'] !== 'admin' || $_SERVER['PHP_AUTH_PW'] !== 'Formule189!') {
    header('HTTP/1.0 401 Unauthorized');
    echo 'Ongeldige credentials';
    exit;
}

// Serve the React app
$indexFile = __DIR__ . '/dist/index.html';
if (file_exists($indexFile)) {
    $content = file_get_contents($indexFile);
    
    // Fix asset paths - use relative paths
    $content = str_replace('src="./', 'src="/copytool/dist/', $content);
    $content = str_replace('href="./', 'href="/copytool/dist/', $content);
    
    echo $content;
} else {
    echo 'React app niet gevonden. Controleer of dist/index.html bestaat.';
}
?>

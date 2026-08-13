<?php
$html_files = glob("c:/xampp/htdocs/juego/html/capitulo*.html");

$orphan_regex = '/\s*<div style="display: flex; gap: 10px; align-items: center;">\s*<button id="musicButton" class="music-button">Música<\/button>\s*<button id="exitButton" class="exit-button" onclick="window\.location\.href=\'\.\.\/introduccion\.html\'">Salir<\/button>\s*<\/div>\s*<\/div>/s';
// Note: It might have a different spelling of Música (e.g. Msica) if encoding is messed up by powershell but PHP file_get_contents handles bytes perfectly. We will use a more generic regex to wipe the orphans.

$orphan_regex2 = '/\s*<div style="display: flex; gap: 10px; align-items: center;">\s*<button id="musicButton"[^>]*>.*?<\/button>\s*<button id="exitButton"[^>]*>.*?<\/button>\s*<\/div>\s*<\/div>/s';

foreach ($html_files as $file) {
    $content = file_get_contents($file);
    if (preg_match($orphan_regex2, $content)) {
        $content = preg_replace($orphan_regex2, '', $content);
        file_put_contents($file, $content);
        echo "Removed orphans from " . basename($file) . "\n";
    }
}
?>

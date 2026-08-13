<?php
$directorios = [
    'c:/xampp/htdocs/juego',
    'c:/xampp/htdocs/juego/html',
    'c:/xampp/htdocs/juego/js',
    'c:/xampp/htdocs/juego/data'
];

foreach ($directorios as $dir) {
    $archivos = array_merge(glob("$dir/*.html"), glob("$dir/*.js"), glob("$dir/*.json"));
    foreach ($archivos as $archivo) {
        $contenido = file_get_contents($archivo);
        $modificado = false;
        
        $reversiones = [
            'aún' => 'an',
            'Aún' => 'An',
            'Aquí' => 'Aqu',
            'aquí' => 'aqu',
            'Nómina' => 'Nmina',
            'Música' => 'Msica',
            'música' => 'msica',
            'Sección' => 'Seccin',
            'Configuración' => 'Configuracin',
            'Sesión' => 'Sesin',
            '¿Qué' => 'Qu',
            '¿Cómo' => 'Cmo',
            '¿Cuál' => 'Cul',
            '¿Dónde' => 'Dnde',
            '¿Cuánto' => 'Cunto',
        ];
        
        foreach ($reversiones as $mal => $bien) {
            if (strpos($contenido, $mal) !== false) {
                $contenido = str_replace($mal, $bien, $contenido);
                $modificado = true;
            }
        }
        
        if ($modificado) {
            file_put_contents($archivo, $contenido);
            echo "Revertido: " . basename($archivo) . "\n";
        }
    }
}
?>

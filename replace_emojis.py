import os
import re

files_to_process = [
    'login.html', 'registro.html', 
    'dashboard_alumno.html', 'js/dashboard_alumno.js',
    'dashboard_docente.html', 'js/dashboard_docente.js',
    'dashboard_admin.html', 'js/dashboard_admin.js'
]

fa_link = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n'

emoji_to_icon = {
    '🔍': '<i class="fas fa-search"></i>',
    '🔑': '<i class="fas fa-key"></i>',
    '❌': '<i class="fas fa-times"></i>',
    '➕': '<i class="fas fa-plus"></i>',
    '💾': '<i class="fas fa-save"></i>',
    '🗑️': '<i class="fas fa-trash"></i>',
    '🔄': '<i class="fas fa-sync-alt"></i>',
    '📄': '<i class="fas fa-file-pdf"></i>',
    '▶': '<i class="fas fa-play"></i>',
    '✏️': '<i class="fas fa-pencil-alt"></i>'
}

emojis_to_strip = [
    '☕️', '☕', '🏠', '🎯', '📊', '🎮', '⚙️', '⚙', '🚪', '⭐', '🏆', '📈', '🕹️', '🕹', '✅', '🔒', '⏳', 
    '👨‍🏫', '📚', '☀️', '📝', '👤', '👨‍🎓', '👨‍💼', '🔐', '🎓', '👑'
]

for file in files_to_process:
    path = f'c:/xampp/htdocs/cronicas/{file}'
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add FontAwesome if HTML
    if file.endswith('.html') and 'font-awesome' not in content:
        content = content.replace('</head>', f'    {fa_link}</head>')
    
    # Replace icons
    for emoji, icon in emoji_to_icon.items():
        content = content.replace(emoji + ' ', icon + ' ')
        content = content.replace(emoji, icon + ' ')
        
    # Strip others
    for emoji in emojis_to_strip:
        content = content.replace(emoji + ' ', '')
        content = content.replace(emoji, '')
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

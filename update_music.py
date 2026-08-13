import os
import glob
import re

search_pattern = r"""let isMusicPlaying = false;

function playMusic\(\) \{
    if \(!isMusicPlaying\) \{
        backgroundMusicEl\.play\(\)\.then\(\(\) => \{
            isMusicPlaying = true;
            musicButtonEl\.innerHTML = '<span>🔇</span> Silencio';
        \}\)\.catch\(e => \{\}\);
    \}
\}
musicButtonEl\.onclick = \(\) => \{
    if \(isMusicPlaying\) \{
        backgroundMusicEl\.pause\(\);
        isMusicPlaying = false;
        musicButtonEl\.innerHTML = '<span>🎵</span> Música';
    \} else \{
        backgroundMusicEl\.play\(\);
        isMusicPlaying = true;
        musicButtonEl\.innerHTML = '<span>🔇</span> Silencio';
    \}
\};"""

replace_pattern = """let isMusicPlaying = false;

function playMusic() {
    if (localStorage.getItem('musicEnabled') === 'false') {
        musicButtonEl.innerHTML = '<span>🎵</span> Música';
        return;
    }
    if (!isMusicPlaying) {
        backgroundMusicEl.play().then(() => {
            isMusicPlaying = true;
            musicButtonEl.innerHTML = '<span>🔇</span> Silencio';
            localStorage.setItem('musicEnabled', 'true');
        }).catch(e => {});
    }
}
musicButtonEl.onclick = () => {
    if (isMusicPlaying) {
        backgroundMusicEl.pause();
        isMusicPlaying = false;
        musicButtonEl.innerHTML = '<span>🎵</span> Música';
        localStorage.setItem('musicEnabled', 'false');
    } else {
        backgroundMusicEl.play();
        isMusicPlaying = true;
        musicButtonEl.innerHTML = '<span>🔇</span> Silencio';
        localStorage.setItem('musicEnabled', 'true');
    }
};"""

directory = r"c:\xampp\htdocs\cronicas\js"
files = glob.glob(os.path.join(directory, "capitulo*.js"))

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = re.sub(search_pattern, replace_pattern, content, flags=re.MULTILINE)
    
    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes needed or pattern not found in {filepath}")

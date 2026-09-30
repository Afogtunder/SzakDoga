$(document).ready(function() {
    // --- HÁTTÉRZENE KEZELÉSE ---
    const bgMusic = new Audio('music/menutitle.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;

    let musicStarted = false;

    const startBgMusic = () => {
        if (!musicStarted) {
            bgMusic.play().then(() => {
                musicStarted = true;
                console.log("🎵 Háttérzene elindult.");
                // Eltávolítjuk a figyelőket, mert már megy a zene
                $(document).off('click.musicTrigger');
            }).catch((error) => {
                console.log("⏳ Böngésző blokkolja az autostartot.");
            });
        }
    };

    // Zene elindítása BÁRMELYEN olyan kattintásra, ami NEM a játék indító gomb
    $(document).on('click.musicTrigger', function(e) {
        // Ha nem a játék indító gombra kattintott, indíthatjuk a zenét
        if (!$(e.target).closest('#btn-start-game').length) {
            startBgMusic();
        }
    });

    // --- MENÜ GOMBOK ÉS PANELEK LOGIKÁJA ---

    // Játék indítása -> átvisz az index.html-be
    $('#btn-start-game').on('click', function() {
        window.location.href = 'index.html';
    });

    // Játékmenet & Útmutató panel megnyitása (EZ HIÁNYZOTT!)
    $('#btn-guide').on('click', function() {
        startBgMusic();
        $('#guide-panel').addClass('open');
    });

    // Lore panel megnyitása
    $('#btn-lore').on('click', function() {
        startBgMusic();
        $('#lore-panel').addClass('open');
    });

    // Credits panel megnyitása
    $('#btn-credits').on('click', function() {
        startBgMusic();
        $('#credits-panel').addClass('open');
    });

    // Panelek bezárása a X gombra kattintva
    $('.close-panel-btn').on('click', function() {
        $('.slide-panel').removeClass('open');
    });

    // Bezárás, ha a panelen kívülre kattintanak
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.slide-panel, .nav-item').length) {
            $('.slide-panel').removeClass('open');
        }
    });
});
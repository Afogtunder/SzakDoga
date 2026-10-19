$(document).ready(function() {
    
    // Background zene
    const bgMusic = new Audio('music/menutitle.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;

    let musicStarted = false;

    const startBgMusic = () => {
        if (!musicStarted) {
            bgMusic.play().then(() => {
                musicStarted = true;
                console.log("🎵 Háttérzene elindult.");
                $(document).off('click.musicTrigger');
            }).catch((error) => {
                console.log("⏳ Böngésző blokkolja az autostartot.");
            });
        }
    };

    // Zene csak ezzel lehet, mast nem talaltam ra
    $(document).on('click.musicTrigger', function(e) {
        if (!$(e.target).closest('#btn-start-game').length) {
            startBgMusic();
        }
    });

    // Indexre visz
    $('#btn-start-game').on('click', function() {
        window.location.href = 'index.html';
    });

    // Guide
    $('#btn-guide').on('click', function() {
        startBgMusic();
        $('#guide-panel').addClass('open');
    });

    // Lore
    $('#btn-lore').on('click', function() {
        startBgMusic();
        $('#lore-panel').addClass('open');
    });

    // Credits 
    $('#btn-credits').on('click', function() {
        startBgMusic();
        $('#credits-panel').addClass('open');
    });

    // X-el bezaras
    $('.close-panel-btn').on('click', function() {
        $('.slide-panel').removeClass('open');
    });

    // Kattintva zarni
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.slide-panel, .nav-item').length) {
            $('.slide-panel').removeClass('open');
        }
    });
});
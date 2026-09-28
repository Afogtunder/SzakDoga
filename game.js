$(document).ready(function() {
    // Bolt & Kispad lenyitó toggle
    $('#toggle-shop-btn').on('click', function() {
        $('#hud-drawer').toggleClass('collapsed');
        
        if ($('#hud-drawer').hasClass('collapsed')) {
            $(this).text('▲ BOLT & KISPAD MEGNYITÁSA ▲');
        } else {
            $(this).text('▼ BOLT & KISPAD ELREJTÉSE ▼');
        }
    });

    // Spell Inventory lenyitó toggle
    $('#toggle-spells-btn').on('click', function() {
        $('#spell-drawer').toggleClass('collapsed');
        
        if ($('#spell-drawer').hasClass('collapsed')) {
            $(this).text('▲ SPELL INVENTORY MEGNYITÁSA ▲');
        } else {
            $(this).text('▼ SPELL INVENTORY ELREJTÉSE ▼');
        }
    });




    // ==========================================
    // ZENELEJÁTSZÓ / PLAYLIST LOGIKA
    // ==========================================
    const playlist = [
        'music/track1.mp3',
        'music/track2.mp3',
        'music/track3.mp3'
    ];

    let currentTrackIndex = 0;
    const bgAudio = new Audio();
    bgAudio.volume = 0.3; // Hangerő (0.0 és 1.0 között, pl. 30%)

    function playCurrentTrack() {
        bgAudio.src = playlist[currentTrackIndex];
        bgAudio.play().then(() => {
            console.log(`🎵 Most szól: ${playlist[currentTrackIndex]}`);
        }).catch(error => {
            console.log("A böngésző blokkolta az autoplayt, kattintásra indul.");
        });
    }

    // Amikor egy zene véget ér, lépjünk a következőre (végtelenített körforgás)
    bgAudio.addEventListener('ended', function() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        playCurrentTrack();
    });

    // Mivel a böngészők tiltják az automatikus zeneindítást kattintás nélkül,
    // az első bármilyen kattintásra elindítjuk a zenelejátszót:
    $(document).one('click', function() {
        playCurrentTrack();
    });
});
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
   const playlist = [
        'music/track1.mp3',
        'music/track2.mp3',
        'music/track3.mp3'
    ];

    let playIndex = 0;
    const maxPlays = playlist.length * 33; // 3 zene * 33 kör = 99 lejátszás összesen
    
    const bgAudio = new Audio();
    bgAudio.volume = 0.9;

    function playMusic() {
        if (playIndex >= maxPlays) {
            console.log("🎵 Lejárt a lejátszási limit.");
            return;
        }

        // Kiválasztjuk a zenét a soron következő index alapján (0, 1, 2)
        let currentTrack = playlist[playIndex % playlist.length];

        bgAudio.src = currentTrack;
        bgAudio.play().then(() => {
            console.log(`🎵 Lejátszás: ${playIndex + 1} / ${maxPlays} | Fájl: ${currentTrack}`);
        }).catch(error => {
            console.log("A böngésző blokkolta az autoplayt.");
        });
    }

    bgAudio.addEventListener('ended', function() {
        playIndex++; // Lépünk a következőre
        playMusic();
    });

    $(document).one('click', function() {
        playIndex = 0;
        playMusic();
    });
});
$(document).ready(function() {
    $('#toggle-shop-btn').on('click', function() {
        $('#hud-drawer').toggleClass('collapsed');
        
        // Opcionálisan a gomb szövegét is változtathatjuk:
        if ($('#hud-drawer').hasClass('collapsed')) {
            $(this).text('▲ BOLT & KISPAD MEGNYITÁSA ▲');
        } else {
            $(this).text('▼ BOLT & KISPAD ELREJTÉSE ▼');
        }
    });
});
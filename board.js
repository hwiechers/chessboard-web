$(document).ready(function() {
    $('.board img').draggable({revert: true, revertDuration: 0});
    $('.board td').droppable({
        drop: function(event, ui) {
            $(this).empty().append(ui.draggable);
        }
    });
});

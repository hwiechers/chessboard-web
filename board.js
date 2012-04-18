$(document).ready(function() {
    $('.board img').draggable({revert: true, revertDuration: 0});
    $('.extra img:not(.trash)').draggable({
        revert: true, 
        revertDuration: 0, 
        helper: 'clone'});
    $('.board td').droppable({
        drop: function(event, ui) {
            var toPlace = (ui.draggable.closest('.extra').length > 0 
                           ? ui.draggable.clone()  
                           : ui.draggable); 
            $(this).empty().append(toPlace);
        }
    });
});

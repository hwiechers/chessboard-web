$(document).ready(function() {
    var undoStack = [];

    $('.board img').draggable({revert: true, revertDuration: 0});
    $('.extra img:not(.trash)').draggable({
        revert: true, 
        revertDuration: 0, 
        helper: 'clone'});
    $('.board td').droppable({
        drop: function(event, ui) {
            var draggable = ui.draggable;

            var $this = $(this);
            var thisSquare = $this.data('square');

            var undoEntry = [];
            undoEntry.push({
                piece:draggable.data('piece'),
                from:draggable.closest('.square').data('square'),
                to:thisSquare});

            var oldPiece = $this.children('img');
            if (oldPiece.length > 0) {
                undoEntry.push({
                    piece:oldPiece.data('piece'),
                    from:thisSquare,
                    to:null});
                oldPiece.remove();
            }

            var toPlace = (ui.draggable.closest('.extra').length > 0 
                           ? ui.draggable.clone()  
                           : ui.draggable); 
            $this.append(toPlace);

            undoStack.push(undoEntry);
            alert(JSON.stringify(undoEntry));
        }
    });

    $('img.trash').droppable({
        drop: function(event, ui) {
            if (ui.draggable.closest('.board').length > 0) {
                ui.draggable.remove();
            }
        }
    });

    $('#undo').on('click', function() {
        if (undoStack.length === 0) {
            return;
        }

        var undoEntry = undoStack.pop();
        $.each(undoEntry, function (index, value) {
            if (value.to !== null) {
                var piece = $('[data-square=' + value.to + '] img');
                if (value.from !== null) {
                    piece.appendTo($('[data-square=' + value.from + ']'))
                }
                else {
                    piece.remove();
                }
            }
        });
    });
});

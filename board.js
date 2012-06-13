$(document).ready(function() {
    var undoStack = [];
    var dragSettings = {revert: true, revertDuration: 0};

    $('.board img').draggable(dragSettings);
    $('.extra img:not(.trash)').draggable({
        revert: true, 
        revertDuration: 0, 
        helper: 'clone'});
    $('.board td').droppable({
        drop: function(event, ui) {
            var draggable = ui.draggable;

            var $this = $(this);
            var here = $this.data('square');
            var from = draggable.closest('.square').data('square');
            if (from === here) {
                return;
            }

            var undoEntry = [];
            undoEntry.push({
                piece : draggable.data('piece'),
                from  : from,
                to    : here});

            var oldPiece = $this.children('img');
            if (oldPiece.length > 0) {
                undoEntry.push({
                    piece : oldPiece.data('piece'),
                    from  : here,
                    to    : null});
                oldPiece.remove();
            }

            var toPlace = (ui.draggable.closest('.extra').length > 0 
                           ? ui.draggable.clone()
                           : ui.draggable); 
            $this.append(toPlace);

            undoStack.push(undoEntry);
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
            var piece = (value.to !== null
                 ? $('[data-square=' + value.to + '] img')
                 : $('.extra [data-piece=' + value.piece + ']')
                    .clone()
                    .draggable(dragSettings));

            if (value.from !== null) {
                piece.appendTo($('[data-square=' + value.from + ']'));
            }
            else {
                piece.remove();
            }
        });
    });
});

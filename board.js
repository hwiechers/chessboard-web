$(document).ready(function() {
    var undoStack = [];
    var redoStack = [];
    var dragSettings = {revert: true,
                        revertDuration: 0,
                        zIndex: 1};

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
            redoStack.length = 0;
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
        redoStack.push(undoEntry);
    });

    $('#redo').on('click', function() {
        if (redoStack.length === 0) {
            return;
        }

        var moves = [];

        var redoEntry = redoStack.pop();
        redoEntry.forEach(function(item) {
            moves.push({
                piece : $('[data-square=' + item.from + '] img'),
                to    : item.to ? $('[data-square=' + item.to + ']') : null
            });
        });

        moves.forEach(function(item) {
            if (item.to) {
                item.piece.appendTo(item.to);
            }
            else {
                item.piece.remove();
            }
        });

        undoStack.push(redoEntry);
    });
});

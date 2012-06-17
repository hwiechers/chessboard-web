$(document).ready(function() {
    var undoStack = [];
    var redoStack = [];
    var dragSettings = {revert: true,
                        revertDuration: 0,
                        zIndex: 1};

    var square = function(name) {
        return $('[data-square=' + name + ']');
    }

    var pieceOn = function(name) {
        return $('[data-square=' + name + '] img');
    }

    var extra = function(name) {
        return $('.extra [data-piece=' + name + ']');
    }

    var undoButton = $('#undo');
    var redoButton = $('#redo');

    //Disable buttons since refreshing page sometimes retains their state.
    undoButton.prop('disabled', true);
    redoButton.prop('disabled', true);

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
            undoButton.prop('disabled', false);

            redoStack.length = 0;
            redoButton.prop('disabled', true);
        }
    });

    $('img.trash').droppable({
        drop: function(event, ui) {
            if (ui.draggable.closest('.board').length > 0) {
                ui.draggable.remove();
            }
        }
    });

    undoButton.on('click', function() {
        var undoEntry = undoStack.pop();
        undoEntry.forEach(function (item) {
            var piece = item.piece;
            var to    = item.to;
            var from  = item.from;

            var piece = (to !== null
                 ? pieceOn(to)
                 : extra(piece)
                    .clone()
                    .draggable(dragSettings));

            if (from !== null) {
                piece.appendTo(square(from));
            }
            else {
                piece.remove();
            }
        });
        redoStack.push(undoEntry);
        redoButton.prop('disabled', false);

        if (undoStack.length === 0) {
            undoButton.prop('disabled', true);
        }
    });

    redoButton.on('click', function() {
        var moves = [];

        var redoEntry = redoStack.pop();
        redoEntry.forEach(function(item) {
            moves.push({
                piece : pieceOn(item.from),
                to    : square(item.to)
            });
        });

        moves.forEach(function(item) {
            var to = item.to;
            var piece = item.piece;

            if (to.length > 0) {
                piece.appendTo(to);
            }
            else {
                piece.remove();
            }
        });

        undoStack.push(redoEntry);
        undoButton.prop('disabled', false);

        if (redoStack.length === 0) {
            redoButton.prop('disabled', true);
        }
    });
});

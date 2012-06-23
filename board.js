/*global $, document*/
'use strict';

$(document).ready(function () {
    var undoStack, redoStack, pieceDragSettings, extraDragSettings, undoButton, redoButton;
    undoStack = [];
    redoStack = [];
    pieceDragSettings = {revert: true, revertDuration: 0, zIndex: 1};
    extraDragSettings = {revert: true, revertDuration: 0, zIndex: 1,
        helper: 'clone'};

    function square(name) {
        return $('[data-square=' + name + ']');
    }

    function pieceOn(name) {
        return $('[data-square=' + name + '] img');
    }

    function extra(name) {
        return $('.extra [data-piece=' + name + ']');
    }

    undoButton = $('#undo');
    redoButton = $('#redo');

    //Disable buttons since refreshing page sometimes retains their state.
    undoButton.prop('disabled', true);
    redoButton.prop('disabled', true);

    $('.board img').draggable(pieceDragSettings);
    $('.extra img:not(.trash)').draggable(extraDragSettings);
    $('.board td').droppable({
        drop: function (event, ui) {
            var $this, draggable, here, from, undoEntry, oldPiece, toPlace;

            $this = $(this);
            draggable = ui.draggable;
            here = $this.data('square');
            from = draggable.closest('.square').data('square');

            if (from === here) {
                return;
            }

            undoEntry = [];
            undoEntry.push({piece: draggable.data('piece'), from: from,
                to: here});

            oldPiece = $this.children('img');
            if (oldPiece.length > 0) {
                undoEntry.push({piece: oldPiece.data('piece'),
                    from: here,
                    to: null});
                oldPiece.remove();
            }

            toPlace = (ui.draggable.closest('.extra').length > 0 ?
                    ui.draggable.clone() :
                    ui.draggable);
            $this.append(toPlace);

            undoStack.push(undoEntry);
            undoButton.prop('disabled', false);

            redoStack.length = 0;
            redoButton.prop('disabled', true);
        }
    });

    $('img.trash').droppable({
        drop: function (event, ui) {
            if (ui.draggable.closest('.board').length > 0) {
                ui.draggable.remove();
            }
        }
    });

    undoButton.on('click', function () {
        var undoEntry = undoStack.pop();
        undoEntry.forEach(function (item) {
            var piece, to, from, pieceElement;

            piece = item.piece;
            to = item.to;
            from = item.from;

            pieceElement = (to !== null
                 ? pieceOn(to)
                 : extra(piece)
                    .clone()
                    .draggable(pieceDragSettings));

            if (from !== null) {
                pieceElement.appendTo(square(from));
            } else {
                pieceElement.remove();
            }
        });
        redoStack.push(undoEntry);
        redoButton.prop('disabled', false);

        if (undoStack.length === 0) {
            undoButton.prop('disabled', true);
        }
    });

    redoButton.on('click', function () {
        var redoEntry, moves;

        redoEntry = redoStack.pop();

        moves = [];
        redoEntry.forEach(function (item) {
            moves.push({
                piece : pieceOn(item.from),
                to    : square(item.to)
            });
        });

        moves.forEach(function (item) {
            var to, piece;
            to = item.to;
            piece = item.piece;

            if (to.length > 0) {
                piece.appendTo(to);
            } else {
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

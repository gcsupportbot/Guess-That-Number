(function() {
    const ws = new WebSocket('ws://localhost:3000/admin/games');

    var games = {};
    var gamesDiv = document.querySelector('#games');
    var cols = [];
    var rowAmount;

    ws.onopen = function() {
        console.log('Successfully opened WebSocket.');
    };

    ws.onclose = function(code) {
        console.log('Closed WebSocket with code: ' + code);
    };

    ws.onmessage = function(data) {
        try {
            data = JSON.parse(data.data);
            if (data.op === 1) {
                // initial data
                rowAmount = Math.ceil(data.d.length / 2);
                while (gamesDiv.firstChild) {
                    gamesDiv.removeChild(gamesDiv.firstChild);
                }
                for (let i = 0; i < Math.ceil(data.d.length / 2); i++) {
                    var div = document.createElement('div');
                    div.id = 'col' + i;
                    div.className = 'columns';
                    gamesDiv.appendChild(div);
                }
                for (let i = 0; i < data.d.length; i++) {
                    games[data.d[i].id] = data.d[i];
                    var col = document.createElement('div');
                    col.className = 'column is-6';
                    var card = document.createElement('div');
                    card.className = 'card';
                    card.id = 'game-' + data.d[i].id;
                    var header = document.createElement('div');
                    header.className = 'card-header';
                    var headerP = document.createElement('p');
                    headerP.className = 'card-header-title';
                    headerP.innerText = data.d[i].tag;
                    var content = document.createElement('div');
                    content.className = 'card-content';
                    var content2 = document.createElement('div');
                    content2.className = 'content';
                    content2.innerHTML = '<b>Difficulty</b>: ' + (data.d[i].difficulty === 1 ? 'Easy' : data.d[i].difficulty === 2 ? 'Medium' : 'Hard') + '<br><b>Guesses</b>: ' + data.d[i].score + '<br><b>Duration</b>: ' + humanizeDuration(Date.now() - data.d[i].start_time, { round: true }) + '<br><b>Correct Number</b>: ' + data.d[i].number.toLocaleString();
                    header.appendChild(headerP);
                    content.appendChild(content2);
                    card.appendChild(header);
                    card.appendChild(content);
                    col.appendChild(card);
                    var thisRow = findEmptiestRow();
                    var colu = document.createElement('div');
                    thisRow.appendChild(col);
                }
            }
        } catch(e) {
            // ignore
        }
    };

    function findEmptiestRow() {
        for (let i = 0; i < rowAmount; i++) {
            var thisRow = document.querySelector('#col' + i);
            if (thisRow.children.length < 2) {
                return thisRow;
            }
        }
    }
})();
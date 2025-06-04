        // Game state
        const gameState = {
            board: ['', '', '', '', '', '', '', '', ''],
            currentPlayer: 'X',
            gameActive: true,
            playerScore: 0,
            aiScore: 0,
            draws: 0,
            totalGames: 0,
            difficulty: 'unbeatable'
        };

        // DOM elements
        const cells = document.querySelectorAll('.cell');
        const statusDisplay = document.getElementById('status');
        const restartButton = document.getElementById('restartBtn');
        const newGameButton = document.getElementById('newGameBtn');
        const aiThinking = document.getElementById('aiThinking');
        const difficultySelect = document.getElementById('difficulty');
        const gamesPlayedEl = document.getElementById('gamesPlayed');
        const playerWinsEl = document.getElementById('playerWins');
        const aiWinsEl = document.getElementById('aiWins');
        const drawsEl = document.getElementById('draws');

        // Winning conditions
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        // Initialize game
        function initGame() {
            gameState.board = ['', '', '', '', '', '', '', '', ''];
            gameState.currentPlayer = 'X';
            gameState.gameActive = true;
            
            updateBoard();
            statusDisplay.textContent = "Your turn! You are X";
            statusDisplay.style.color = "#ffffff";
            
            // Reset cell animations
            cells.forEach(cell => {
                cell.classList.remove('winning-cell');
                cell.classList.remove('x');
                cell.classList.remove('o');
            });
            
            aiThinking.classList.remove('active');
        }

        // Update board display
        function updateBoard() {
            for (let i = 0; i < cells.length; i++) {
                cells[i].textContent = gameState.board[i];
                if (gameState.board[i] === 'X') {
                    cells[i].classList.add('x');
                } else if (gameState.board[i] === 'O') {
                    cells[i].classList.add('o');
                }
            }
        }

        // Handle cell click
        function handleCellClick(clickedCellEvent) {
            if (!gameState.gameActive) return;
            
            const clickedCell = clickedCellEvent.target;
            const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
            
            // Check if cell is empty
            if (gameState.board[clickedCellIndex] !== '') {
                return;
            }
            
            // Make player move
            gameState.board[clickedCellIndex] = gameState.currentPlayer;
            updateBoard();
            
            // Check for win or draw
            if (checkWin()) {
                gameState.gameActive = false;
                gameState.playerScore++;
                playerWinsEl.textContent = gameState.playerScore;
                highlightWinningCells();
                statusDisplay.textContent = "You win! 🎉";
                statusDisplay.style.color = "#4cd137";
                gameState.totalGames++;
                gamesPlayedEl.textContent = gameState.totalGames;
                return;
            }
            
            if (checkDraw()) {
                gameState.gameActive = false;
                gameState.draws++;
                drawsEl.textContent = gameState.draws;
                statusDisplay.textContent = "It's a draw! 🏳️";
                statusDisplay.style.color = "#fbc531";
                gameState.totalGames++;
                gamesPlayedEl.textContent = gameState.totalGames;
                return;
            }
            
            // Switch to AI player
            gameState.currentPlayer = 'O';
            statusDisplay.textContent = "AI's turn...";
            
            // AI move
            setTimeout(() => {
                aiThinking.classList.add('active');
                setTimeout(() => {
                    makeAIMove();
                    aiThinking.classList.remove('active');
                }, 600);
            }, 500);
        }

        // AI move logic
        function makeAIMove() {
            if (!gameState.gameActive) return;
            
            let moveIndex;
            
            // Choose AI strategy based on difficulty
            switch (gameState.difficulty) {
                case 'easy':
                    moveIndex = getRandomMove();
                    break;
                case 'medium':
                    moveIndex = Math.random() > 0.5 ? getRandomMove() : getBestMove();
                    break;
                case 'hard':
                    moveIndex = Math.random() > 0.2 ? getBestMove() : getRandomMove();
                    break;
                case 'unbeatable':
                default:
                    moveIndex = getBestMove();
                    break;
            }
            
            // Make AI move
            gameState.board[moveIndex] = 'O';
            updateBoard();
            
            // Check for win or draw
            if (checkWin()) {
                gameState.gameActive = false;
                gameState.aiScore++;
                aiWinsEl.textContent = gameState.aiScore;
                highlightWinningCells();
                statusDisplay.textContent = "AI wins! 🤖";
                statusDisplay.style.color = "#e84118";
                gameState.totalGames++;
                gamesPlayedEl.textContent = gameState.totalGames;
                return;
            }
            
            if (checkDraw()) {
                gameState.gameActive = false;
                gameState.draws++;
                drawsEl.textContent = gameState.draws;
                statusDisplay.textContent = "It's a draw! 🏳️";
                statusDisplay.style.color = "#fbc531";
                gameState.totalGames++;
                gamesPlayedEl.textContent = gameState.totalGames;
                return;
            }
            
            // Switch back to player
            gameState.currentPlayer = 'X';
            statusDisplay.textContent = "Your turn! You are X";
        }

        // Get best move using minimax algorithm
        function getBestMove() {
            let bestScore = -Infinity;
            let bestMove;
            
            for (let i = 0; i < 9; i++) {
                if (gameState.board[i] === '') {
                    gameState.board[i] = 'O';
                    let score = minimax(gameState.board, 0, false);
                    gameState.board[i] = '';
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            
            return bestMove;
        }

        // Minimax algorithm
        function minimax(board, depth, isMaximizing) {
            // Check for terminal states
            if (checkWinForPlayer('O')) return 10 - depth;
            if (checkWinForPlayer('X')) return depth - 10;
            if (checkDraw()) return 0;
            
            if (isMaximizing) {
                let bestScore = -Infinity;
                
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') {
                        board[i] = 'O';
                        let score = minimax(board, depth + 1, false);
                        board[i] = '';
                        bestScore = Math.max(score, bestScore);
                    }
                }
                
                return bestScore;
            } else {
                let bestScore = Infinity;
                
                for (let i = 0; i < 9; i++) {
                    if (board[i] === '') {
                        board[i] = 'X';
                        let score = minimax(board, depth + 1, true);
                        board[i] = '';
                        bestScore = Math.min(score, bestScore);
                    }
                }
                
                return bestScore;
            }
        }

        // Get a random valid move
        function getRandomMove() {
            const emptyCells = [];
            for (let i = 0; i < 9; i++) {
                if (gameState.board[i] === '') {
                    emptyCells.push(i);
                }
            }
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        // Check win for current player
        function checkWin() {
            return checkWinForPlayer(gameState.currentPlayer);
        }

        // Check win for specific player
        function checkWinForPlayer(player) {
            return winConditions.some(condition => {
                return condition.every(index => {
                    return gameState.board[index] === player;
                });
            });
        }

        // Check for draw
        function checkDraw() {
            return !gameState.board.includes('') && !checkWin();
        }

        // Highlight winning cells
        function highlightWinningCells() {
            for (const condition of winConditions) {
                const [a, b, c] = condition;
                if (gameState.board[a] !== '' && 
                    gameState.board[a] === gameState.board[b] && 
                    gameState.board[a] === gameState.board[c]) {
                    
                    cells[a].classList.add('winning-cell');
                    cells[b].classList.add('winning-cell');
                    cells[c].classList.add('winning-cell');
                    break;
                }
            }
        }

        // Event listeners
        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        restartButton.addEventListener('click', initGame);
        
        newGameButton.addEventListener('click', () => {
            gameState.totalGames++;
            gamesPlayedEl.textContent = gameState.totalGames;
            initGame();
        });
        
        difficultySelect.addEventListener('change', () => {
            gameState.difficulty = difficultySelect.value;
        });

        // Initialize the game
        initGame();

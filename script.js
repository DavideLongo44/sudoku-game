function SudokuGrid() {
    const [grid, setGrid] = React.useState(generateSudoku());

    function generateSudoku() {
        let newGrid = Array(9).fill(null).map(() => Array(9).fill(0));
    
        // Funzione per controllare se un numero può essere inserito in una data posizione
        const isValid = (grid, row, col, num) => {
            for (let i = 0; i < 9; i++) {
                if (grid[row][i] === num || grid[i][col] === num) {
                    return false;
                }
                const subgridRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
                const subgridCol = 3 * Math.floor(col / 3) + (i % 3);
                if (grid[subgridRow][subgridCol] === num) {
                    return false;
                }
            }
            return true;
        };
    
        // Funzione per risolvere il Sudoku usando il backtracking
        const solveSudoku = (grid) => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (grid[row][col] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (isValid(grid, row, col, num)) {
                                grid[row][col] = num;
                                if (solveSudoku(grid)) {
                                    return true;
                                } else {
                                    grid[row][col] = 0; // Backtrack
                                }
                            }
                        }
                        return false; // Nessun numero valido trovato per questa cella
                    }
                }
            }
            return true; // Il Sudoku è risolto
        };
    
        // Riempi la griglia (in questo caso, usa la soluzione di esempio o una logica più complessa)
        let solvedGrid = newGrid.map(row => [...row]); // Crea una copia
        solveSudoku(solvedGrid);
    
        // Rimuovi alcune cifre per creare il puzzle
        let puzzleGrid = solvedGrid.map(row => [...row]); // Crea una copia
        let numToRemove = 45; // Numero di cifre da rimuovere
        while(numToRemove > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            if(puzzleGrid[row][col] !== 0) {
                puzzleGrid[row][col] = 0;
                numToRemove--;
            }
        }
        return puzzleGrid;

    }

    const handleCellChange = (row, col, event) => {
        const value = parseInt(event.target.value, 10) || 0; // Converte a numero o 0 se vuoto
        if (value >= 0 && value <= 9) {
            setGrid(prevGrid => {
                const newGrid = prevGrid.map(r => [...r]);
                newGrid[row][col] = value;
                return newGrid;
            });
        }
    };

    const isGiven = (row, col) => {
        const initialGrid = generateSudoku();
        return initialGrid[row][col] !== 0;
      };
    
    // Funzione per validare la griglia
    const validateGrid = () => {
        let isValid = true;
        let invalidCells = [];
    
        // Controlla le righe
        for (let row = 0; row < 9; row++) {
            let rowValues = grid[row].filter(x => x !== 0); // Rimuove gli zeri
            if (rowValues.length !== [...new Set(rowValues)].length) {
                isValid = false;
                for (let col = 0; col < 9; col++) {
                    if (grid[row][col] !== 0)
                    {
                        invalidCells.push({row:row, col:col});
                    }
                }
            }
        }
    
        // Controlla le colonne
        for (let col = 0; col < 9; col++) {
            let colValues = grid.map(row => row[col]).filter(x => x !== 0); // Rimuove gli zeri
            if (colValues.length !== [...new Set(colValues)].length) {
              isValid = false;
                for (let row = 0; row < 9; row++) {
                    if (grid[row][col] !== 0)
                    {
                       invalidCells.push({row:row, col:col});
                    }
                }
            }
        }
    
        // Controlla i blocchi 3x3
        for (let blockRow = 0; blockRow < 3; blockRow++) {
            for (let blockCol = 0; blockCol < 3; blockCol++) {
                let blockValues = [];
                 for (let i = blockRow * 3; i < blockRow * 3 + 3; i++) {
                     for (let j = blockCol * 3; j < blockCol * 3 + 3; j++) {
                           if (grid[i][j] !== 0)
                            blockValues.push(grid[i][j]);
                        }
                }
                if (blockValues.length !== [...new Set(blockValues)].length) {
                    isValid = false;
                     for (let i = blockRow * 3; i < blockRow * 3 + 3; i++) {
                        for (let j = blockCol * 3; j < blockCol * 3 + 3; j++) {
                            if (grid[i][j] !== 0)
                            {
                                invalidCells.push({row:i, col:j});
                            }
                        }
                     }
                }
            }
        }
        if (isValid) {
            alert('Sudoku risolto correttamente!');
        } else {
            invalidCells.forEach(cell => {
              document.querySelector(`.sudoku-cell[data-row="${cell.row}"][data-col="${cell.col}"]`).classList.add('invalid-cell');
            });
            alert('Il Sudoku non è corretto. Ci sono delle incongruenze.');

            // Rimuovi la classe di errore dalle celle dopo 2 secondi
              setTimeout(() => {
                invalidCells.forEach(cell => {
                  document.querySelector(`.sudoku-cell[data-row="${cell.row}"][data-col="${cell.col}"]`).classList.remove('invalid-cell');
                });
              }, 2000);
        }
    };

    return (
        <div>
            <div className="sudoku-grid">
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`sudoku-cell ${isGiven(rowIndex, colIndex) ? 'given' : ''}`}
                            data-row={rowIndex}
                            data-col={colIndex}
                        >
                            {isGiven(rowIndex, colIndex) ? (
                                cell
                            ) : (
                                <input
                                    type="number"
                                    min="1"
                                    max="9"
                                    className="input-cell"
                                    value={cell === 0 ? '' : cell}
                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e)}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
            <div className="button-container">
              <button className="btn btn-primary" onClick={validateGrid}>Verifica Sudoku</button>
            </div>
        </div>
    );
}

ReactDOM.render(<SudokuGrid />, document.getElementById('root'));
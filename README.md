## Mine Sweeper
Minesweeper fully implemented in python on the backend and javascript on the front end

### Production URL
Project running in production:

`https://campo-minado-iktech.herokuapp.com/`

### Installation and run
```
pip install -r requirements.txt

python main.py
```

### Challenges
#### Value Fill Matrix
One of the challenges encountered was the algorithm for filling in the values between cells adjacent to the mines.
The strategy was to fill in the values with ranges from 0 to 2 in each coordinate adjacent to each value of the lenght-1 of the mine matrix so that they were added to the values of the account of the previous sum. So if in the first line it fills, for example, the value 1, and in the second line it finds adjacent values 2, it is added 1+2=3
#### Dynamic grid creation
The creation of the matrix grid is dynamically created by css according to the result of the first GET or POSTs (changing dimensions). By adding appends to the css elements of the container's html, we were able to dynamically create the grid visually on the screen.


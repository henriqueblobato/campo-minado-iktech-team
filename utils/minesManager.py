from utils.minesMaker import generateMines


class MinesManager:
    def __init__(self):
        self.__width = 0
        self.__height = 0
        self.__countOfMines = 0
        self.__level = 0

    def __setLevel(self, width, height, count_of_mines):
        self.__width = int(width)
        self.__height = int(height)
        self.__countOfMines = int(count_of_mines)

    def getMines(self, width, height, count_of_mines):
        self.__setLevel(width, height, count_of_mines)
        return generateMines(self.__width, self.__height, self.__countOfMines)

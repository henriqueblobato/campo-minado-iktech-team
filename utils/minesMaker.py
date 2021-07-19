from random import randint
from copy import deepcopy


def createEmptyTable(width, height):
    ret = []
    line = []
    for i in range(0, width):
        line.append(0)
    for i in range(0, height):
        ret.append(deepcopy(line))
    return ret


def setRandomMines(table, countOfMines):
    i = 0
    while i < countOfMines:
        randY = randint(0, len(table) - 1)
        randX = randint(0, len(table[0]) - 1)
        if table[randY][randX] == 'mine':
            i -= 1
        else:
            table[randY][randX] = 'mine'
        i += 1
    return table


def fillFields(table):
    for y in range(0, len(table)):
        for x in range(0, len(table[0])):
            if not table[y][x] == 'mine':
                count = 0
                for i in range(-1, 2):
                    for j in range(-1, 2):
                        if 0 <= y + i < len(table) and 0 <= x + j < len(table[0]):
                            if table[y + i][x + j] == 'mine':
                                count += 1
                if count > 0:
                    table[y][x] = count
    return table


def generateMines(width, height, countOfMines):
    ret = createEmptyTable(width, height)
    ret = setRandomMines(ret, countOfMines)
    ret = fillFields(ret)
    return ret

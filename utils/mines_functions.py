from random import randint
from copy import deepcopy


def create_matrix(rows, columns):
    return [
        [
            {'type': 'empty', 'clickable': True, 'marked': False}
            for j in range(columns)
        ]
        for i in range(rows)
    ]


def create_random_mines(table, mines):
    i = 0
    while i < mines:
        random_line = randint(0, len(table) - 1)
        random_column = randint(0, len(table[0]) - 1)
        if table[random_line][random_column] == 'mine':
            i -= 1
        else:
            table[random_line][random_column] = 'mine'
        i += 1
    return table


def create_number_fields(table):
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


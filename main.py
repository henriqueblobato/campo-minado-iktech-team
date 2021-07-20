from flask import Flask, request
import json

from utils.mines_functions import create_matrix, create_random_mines, create_number_fields
from utils.MinesChecker import MinesChecker
checker = MinesChecker()

app = Flask(__name__)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/newGameData', methods=['POST', 'GET'])
def new_game_data():
    request_data = request.get_json()
    try:
        width = min(20, int(request_data['rows']))
        height = min(20, int(request_data['columns']))
        mines = min(width*height, int(request_data['mines']))
    except Exception as e:
        print(f'{type(e)}, {str(format(e))}')
        width, height, mines = 5, 5, 5

    response = create_matrix(width, height)
    response = create_random_mines(response, mines)
    response = create_number_fields(response)

    print(response)
    return json.dumps(response)


@app.route('/postMoveData', methods=['POST'])
def post_move_data():
    ret = checker.checkMines(request.json)
    return json.dumps(ret)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=8080,
        debug=True
    )

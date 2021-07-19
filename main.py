from flask import Flask, request
import json

from utils.mines_functions import create_matrix, create_random_mines, create_number_fields

app = Flask(__name__)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/newGameData', methods=['POST'])
def new_game_data():
    request_data = request.get_json()
    try:
        width = min(20, int(request_data['width']))
        height = min(20, int(request_data['height']))
        mines = min(width*height, int(request_data['countOfMines']))
    except Exception as e:
        print(f'{type(e)}, {str(format(e))}')
        width, height, mines = 5, 5, 5

    response = create_matrix(width, height)
    response = create_random_mines(response, mines)
    response = create_number_fields(response)

    return json.dumps(response)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=8080,
        debug=True
    )

from flask import Flask, request, jsonify, abort
from utils.minesManager import MinesManager
import json

from utils.minesMaker import createEmptyTable, setRandomMines, fillFields

app = Flask(__name__)

manager = MinesManager()


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/newGameData')
def new_game_data():
    request_data = request.get_json()
    try:
        width = min(20, int(request_data['width']))
        height = min(20, int(request_data['height']))
        mines = min(width*height, int(request_data['countOfMines']))
    except Exception as e:
        print(f'{type(e)}, {str(format(e))}')
        width, height, mines = 5, 5, 5

    response = createEmptyTable(width, height)
    response = setRandomMines(response, mines)
    response = fillFields(response)

    return json.dumps(response)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=8080,
        debug=True
    )

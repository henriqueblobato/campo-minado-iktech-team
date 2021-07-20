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
        rows = min(20, int(request_data['rows']))
        columns = min(20, int(request_data['columns']))
        mines = min(rows*columns, int(request_data['mines']))
    except Exception as e:
        print(f'{type(e)}, {str(format(e))}')
        rows, columns, mines = 5, 5, 5

    response = create_matrix(rows, columns)
    response = create_random_mines(response, mines)
    response = create_number_fields(response)

    return json.dumps(response)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=8080,
        debug=True
    )

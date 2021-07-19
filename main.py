from flask import Flask, request, jsonify, abort

from utils.minesManager import MinesManager

app = Flask(__name__)

manager = MinesManager()


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/newGameData')
def new_game_data():
    # if not request.json:
    #     abort(400)
    request_data = request.get_json()
    width = 5 #request_data['width']
    height = 5 #request_data['height']
    count_of_mines = 5 #request_data['countOfMines']
    generated_json = manager.getMines(width, height, count_of_mines)
    print(generated_json)
    return jsonify(generated_json)


# @app.route('/postMoveData', methods=['POST'])
# def post_move_data():
#     if not request.json:
#         abort(400)
#     ret = checker.checkMines(request.json)
#     return jsonify(ret)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=8080,
        debug=True
    )

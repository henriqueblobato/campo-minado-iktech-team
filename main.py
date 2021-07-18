from os import abort

from flask import Flask, request, jsonify
import json
from minesManager import MinesManager
from minesChecker import MinesChecker

app = Flask(__name__)

manager = MinesManager()
checker = MinesChecker()
generatedJson = {}


@app.route('/')
def index():
    a = None
    return app.send_static_file('index.html')


@app.route('/newGameData')
def new_game_data():
    generated_json = manager.getMines()
    return jsonify(generated_json)


@app.route('/postMoveData', methods=['POST'])
def post_move_data():
    if not request.json:
        abort(400)
    ret = checker.checkMines(request.json)
    return jsonify(ret)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=8080,
        debug=True
    )

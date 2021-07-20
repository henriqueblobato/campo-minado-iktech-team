export default {
    $container: $('#main-container'),
    $rows: $("#rows"),
    $columns: $("#columns"),
    $mines: $('#mines'),
    matrixData:[],
    directions: [
        {'x': 0, 'y':-1},
        {'x': 1, 'y':-1},
        {'x': 1, 'y': 0},
        {'x': 1, 'y': 1},
        {'x': 0, 'y': 1},
        {'x':-1, 'y': 1},
        {'x':-1, 'y': 0},
        {'x':-1, 'y':-1}
    ],
}
from flask import Flask, request
from flask_pymongo import PyMongo
from bson.json_util import dumps
from flask_cors import CORS
from flask import Flask, jsonify



app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://yatharth:yatharth24@mongodb.nj7qvmf.mongodb.net/sales?retryWrites=true&w=majority&appName=mongodb"
mongo = PyMongo(app)

@app.route('/save', methods=['POST'])
def save_data():
    data = request.get_json()
    name = data['name']
    inOut = data['inOut']
    licensePlate = data['licensePlate']
    time = data['time']
    date = data['date']

    # Choose the collection based on the inOut value
    collection = mongo.db[inOut]

    collection.insert_one({
        'name': name,
        'inOut': inOut,
        'licensePlate': licensePlate,
        'time': time,
        'date': date,
    })

    return dumps({'message': 'Data saved successfully'}), 201
@app.route('/data', methods=['GET'])
def get_data():
    in_data = mongo.db['in'].find() 
    out_data = mongo.db['out'].find()

    data = {
        'in': [{**item, '_id': str(item['_id'])} for item in in_data],
        'out': [{**item, '_id': str(item['_id'])} for item in out_data]
    }

    return jsonify(data), 200

if __name__ == "__main__":
    app.run(debug=True, port=5002)


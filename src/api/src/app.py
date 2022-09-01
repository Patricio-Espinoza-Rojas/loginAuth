from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from models import db,User
from flask_cors import CORS
import datetime

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['ENV'] = 'development'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['JWT_SECRET_KEY'] = '38f1671f40da1e443f9b32a4f2dfd182'
app.config['JSON_SORT_KEYS'] = False

db.init_app(app)
Migrate(app,db)
CORS(app)
jwt = JWTManager(app)

@app.route('/', methods = ['GET'])
def default():
    return jsonify({"msg" : "API Working!"}), 200

@app.route('/login',methods = ['POST'])
def login_handle():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email : return jsonify({"msg" : "Email es requerido!"}), 400
    if not password : return jsonify({"msg" : "contraseña requerida!"}), 400

    userFound = User.query.filter_by(email = email).first()
    if not userFound : return jsonify({"status" : "failed" , "msg" : "Usuario no encontrado, intenta registrarte."}) , 401
    if not check_password_hash(userFound.password,password): return jsonify({"status" : "failed" , "msg" : "contraseña incorrecta."}), 401

    access_expiration = datetime.timedelta(minutes=5)
    access_token = create_access_token(identity=userFound.id, expires_delta=access_expiration)

    data = {
        "access_token": access_token,
        "user" : userFound.serialize()
    }

    return jsonify({"status" : "success", "message": "inicio de sesion exitoso", "data" : data}),200

@app.route('/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email: return jsonify({"status" : "failed" , "msg" : "Email requerido!"}), 400
    if not password: return jsonify({"status" : "failed", "msg" : "Contraseña requerida!"}), 400

    user = User()
    user.email = email
    user.password = generate_password_hash(password)
    user.save()

    if user:
        return jsonify({"status" : "success" , "msg" : "Registro exitoso"}),200
    else:
        return jsonify({"status" : "failed" , "msg" : "Error al registrar el ususario"}),400

@app.route('/private', methods=['GET'])
@jwt_required()
def private():
    id = get_jwt_identity()
    session_user = User.query.get(id)

    return jsonify(session_user.serialize()),200


if __name__ == '__main__':
    app.run()
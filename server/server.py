from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
import uuid
 
load_dotenv()
app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"
CORS(
    app,
    resources={r"/*": {"origins": "*", "supports_credentials": True}},
    supports_credentials=True,
)
 
# MongoDB connection
client = MongoClient(os.getenv("MONGO_URL"))
db = client[os.getenv("MONGO_DATABASE")]
collection = db[os.getenv("MONGO_USER_COLLECTION")]
projects_collection = db[os.getenv("MONGO_PROJECTS_COLLECTION")]
 
 
# Function to check if username already exists
def is_username_duplicate(username):
    return collection.find_one({"username": username}) is not None
 
@app.route('/user/<username>', methods=['GET'])
def get_user(username):
    user = collection.find_one({'username': username})
    if user:
        user.pop('_id')  # Remove ObjectId from JSON response
        user.pop('password')  # Remove password from JSON response
        return make_response(
            jsonify(user), 
            200
        )
    return make_response(
        jsonify({'message': 'User not found'}), 
        404
    )

# Route for user registration
@app.route("/register", methods=["POST"])
@cross_origin()
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    name = data.get("name")
    email = data.get("email")
 
    # Check if username already exists
    if is_username_duplicate(username):
        return jsonify({"message": "Username already exists!"}), 400
 
    # Hash the password before saving
    hashed_password = generate_password_hash(password)
 
    # Insert user data into MongoDB
    collection.insert_one(
        {
            "username": username,
            "password": hashed_password,
            "name": name,
            "email": email,
            "notifications": ["User created!"]
        }
    )
 
    # return jsonify({"message": "User registered successfully"}), 201
    response = jsonify({"message": "User registered successfully"})
    response.status_code = 201
    return response

@app.route("/notify", methods=["POST"])
@cross_origin()
def notify():
    data = request.get_json()
    collection.update_one(
        {"username": data["username"]}, 
        {"$push": {"notifications": [data["notification"]]}}
    )
    return jsonify({"message": "notified user!"})
 
 
# Route for user login
@app.route("/login", methods=["POST"])
@cross_origin()
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
 
    # Check if username exists
    user = collection.find_one({"username": username})
 
    if user and check_password_hash(user["password"], password):
        user.pop("_id")  # Remove ObjectId from JSON response
        user.pop("password")  # Remove password from JSON response
        response = jsonify(user)
        response.status_code = 200
        return response
 
    response = jsonify({"message": "Invalid username or password"})
    response.status_code = 401
    return response
 
 
@app.route("/projects", methods=["GET"])
@cross_origin()
def get_projects():
    projects = list(projects_collection.find({}, {"_id": 0}))
    return jsonify(projects)

@app.route("/projects/<username>", methods=["GET"])
@cross_origin()
def get_projects_by_username(username):
    projects = list(projects_collection.find(
        {'members': {'$in': [username]}}, 
        {"_id": 0}))
    return jsonify(projects)
 
 
@app.route("/projects", methods=["POST"])
@cross_origin()
def create_project():
    data = request.json
    project = {
        "project_id": str(uuid.uuid4()),
        "name": data["name"],
        "description": data["description"],
        "owner": data["owner"],
        "members": [data["owner"]],
        "tasks": [],
    }
    projects_collection.insert_one(project)
    return jsonify({"message": "Project created successfully"})
 
 
@app.route("/projects/<project_id>/join", methods=["PUT"])
@cross_origin()
def join_project(project_id):
    data = request.json
    # print(data)
    projects_collection.update_one(
        {"project_id": project_id}, {"$addToSet": {"members": data["user"]}}
    )
    return jsonify({"message": "User joined the project"})
 
 
@app.route("/projects/<project_id>/tasks", methods=["POST"])
@cross_origin()
def create_task(project_id):
    data = request.json
    project = projects_collection.find_one({"project_id": project_id})
    if project is None:
        return make_response(jsonify({"error": "Project not found"}), 404)
    if data["creator"] not in project["members"]:
        return make_response(
            jsonify({"error": "You are not a member of this project"}), 403
        )
    task = {
        "name": data["name"],
        "creator": data["creator"],
        "completed": False,
        "completed_by": None,
    }
    projects_collection.update_one(
        {"project_id": project_id}, {"$push": {"tasks": task}}
    )
    return jsonify({"message": "Task created successfully"})
 
 
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response
 
 
if __name__ == "__main__":
    app.run(debug=True)
 
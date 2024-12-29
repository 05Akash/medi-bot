from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import os
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from facebook import GraphAPI
from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError
from groq import Groq
import os

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'], allow_headers=['Content-Type', 'Authorization'])

groq_client = Groq(api_key=os.environ.get('GROQ_API_KEY'))

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    chats = db.relationship('Chat', backref='user', lazy=True)

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    messages = db.relationship('Message', backref='chat', lazy=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_bot = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

# Routes
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['name', 'email', 'password']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 409
            
        # Create new user
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=generate_password_hash(data['password'])
        )
        
        # Add to database
        try:
            db.session.add(new_user)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {str(e)}")  # Log the error
            return jsonify({'error': 'Database error occurred'}), 500
            
        # Generate access token
        access_token = create_access_token(identity=new_user.id)
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': new_user.id,
                'name': new_user.name,
                'email': new_user.email
            }
        }), 201
        
    except Exception as e:
        print(f"Signup error: {str(e)}")  # Log the error
        return jsonify({'error': 'An error occurred during signup'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({'token': access_token, 'user': {'name': user.name, 'email': user.email}}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/chat/new', methods=['POST'])
@jwt_required()
def create_chat():
    user_id = get_jwt_identity()
    new_chat = Chat(user_id=user_id)
    db.session.add(new_chat)
    db.session.commit()
    
    # Add initial welcome message
    welcome_message = Message(
        chat_id=new_chat.id,
        content="Hi! I'm your medical assistant. What can I help you with today?",
        is_bot=True
    )
    db.session.add(welcome_message)
    db.session.commit()
    
    return jsonify({
        'chat_id': new_chat.id,
        'welcome_message': {
            'id': welcome_message.id,
            'content': welcome_message.content,
            'is_bot': True,
            'created_at': welcome_message.created_at.isoformat()
        }
    }), 201

# @app.route('/api/chat/<int:chat_id>/message', methods=['POST'])
# @jwt_required()
# def send_message(chat_id):
#     user_id = get_jwt_identity()
#     data = request.get_json()
    
#     chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first()
#     if not chat:
#         return jsonify({'error': 'Chat not found'}), 404
    
#     # Store user message
#     user_message = Message(
#         chat_id=chat_id,
#         content=data['message'],
#         is_bot=False
#     )
#     db.session.add(user_message)
    
#     # Generate bot response (placeholder - implement your AI logic here)
#     bot_response = "This is a placeholder response. Implement AI processing here."
#     bot_message = Message(
#         chat_id=chat_id,
#         content=bot_response,
#         is_bot=True
#     )
#     db.session.add(bot_message)
    
#     db.session.commit()
    
#     return jsonify({
#         'user_message': user_message.content,
#         'bot_response': bot_message.content
#     }), 200

@app.route('/api/chat/<int:chat_id>/message', methods=['POST'])
@jwt_required()
def send_message(chat_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first()
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
    
    # Store user message
    user_message = Message(
        chat_id=chat_id,
        content=data['message'],
        is_bot=False
    )
    db.session.add(user_message)
    db.session.flush()  # Flush to get the message ID
    
    # Get response from Llama
    bot_response = get_llama_response(data['message'])
    
    # Store bot response
    bot_message = Message(
        chat_id=chat_id,
        content=bot_response,
        is_bot=True
    )
    db.session.add(bot_message)
    
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database error occurred'}), 500
    
    return jsonify({
        'user_message': user_message.content,
        'bot_response': bot_message.content
    }), 200

@app.route('/api/chat/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    user_id = get_jwt_identity()
    chats = Chat.query.filter_by(user_id=user_id).all()
    
    chat_history = []
    for chat in chats:
        messages = [{
            'id': msg.id,
            'content': msg.content,
            'is_bot': msg.is_bot,
            'created_at': msg.created_at.isoformat()
        } for msg in chat.messages]
        
        chat_history.append({
            'chat_id': chat.id,
            'created_at': chat.created_at.isoformat(),
            'messages': messages
        })
    
    return jsonify({'chats': chat_history}), 200

@app.route('/api/auth/social', methods=['POST'])
def social_auth():
    data = request.get_json()
    provider = data.get('provider')
    token = data.get('token')
    
    try:
        if provider == 'google':
            # Verify Google token
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                os.environ.get('GOOGLE_CLIENT_ID')
            )
            
            email = idinfo['email']
            name = idinfo['name']
            
        elif provider == 'facebook':
            # Verify Facebook token
            graph = GraphAPI(access_token=token)
            profile = graph.get_object('me', fields='name,email')
            
            email = profile['email']
            name = profile['name']
        else:
            return jsonify({'error': 'Invalid provider'}), 400
        
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Create new user if doesn't exist
            user = User(
                name=name,
                email=email,
                password=generate_password_hash(token[:32]) 
            )
            db.session.add(user)
            db.session.commit()
        
        # Generate JWT token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'token': access_token,
            'user': {'name': user.name, 'email': user.email}
        }), 200
        
    except ValueError as e:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(Exception)
def handle_error(error):
    return jsonify({'error': str(error)}), getattr(error, 'code', 500)

# Add this function to app.py
def get_llama_response(message):
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[{
                "role": "system",
                "content": "You are a medical assistant. Provide accurate, helpful medical information while being clear that you're not replacing professional medical advice."
            }, {
                "role": "user",
                "content": message
            }],
            model="llama3-8b-8192",
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
            stream=False
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error getting Llama response: {str(e)}")
        return "I apologize, but I'm having trouble processing your request. Please try again."

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True)
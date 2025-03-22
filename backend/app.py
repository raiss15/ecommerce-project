# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import google.generativeai as genai
# import os
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Configure Gemini API
# genai.configure(api_key=os.getenv("AIzaSyBBACSY1_6hts5hAALGdYas_GEI74ZjIzM"))
# model = genai.GenerativeModel('gemini-2.0-flash')

# @app.route('/api/welcome', methods=['GET'])
# def welcome():
#     """Endpoint to get the welcome message"""
#     return jsonify({
#         'message': "Welcome to our E-commerce Support! How can I help you today? You can ask about order status, returns, product information, or shipping options."
#     })

# @app.route('/api/chat', methods=['POST'])
# def chat():
#     """Main endpoint for chat functionality"""
#     try:
#         data = request.json
#         message = data.get('message', '')
#         context = data.get('context', '')
        
#         # Recognize intent
#         intent_prompt = f"""
#         Classify the following user input into one of these intents:
#         - order_status
#         - return_policy
#         - product_info
#         - shipping_info
#         - general_inquiry
        
#         User input: {message}
        
#         Return only the intent name.
#         """
        
#         intent_result = model.generate_content(intent_prompt)
#         intent = intent_result.text.strip()
        
#         # Generate response based on intent
#         response_prompt = f"""
#         You are an e-commerce customer support assistant. Respond helpfully and concisely.
        
#         User intent: {intent}
#         User message: {message}
#         {"Previous context: " + context if context else ""}
        
#         Provide a helpful response for an e-commerce customer support chatbot:
#         """
        
#         result = model.generate_content(response_prompt)
#         response = result.text
        
#         return jsonify({
#             'message': response,
#             'intent': intent
#         })
#     except Exception as e:
#         print(f"Error: {str(e)}")
#         return jsonify({
#             'error': True,
#             'message': "I'm sorry, I'm having trouble understanding. Could you please rephrase your question?"
#         }), 500

# @app.route('/api/collect-user-info', methods=['POST'])
# def collect_user_info():
#     """Endpoint to collect user information"""
#     data = request.json
#     name = data.get('name', '')
#     email = data.get('email', '')
#     order_number = data.get('orderNumber', '')
    
#     # In a real application, you would store this in a database
#     # For this simple version, we'll just return a confirmation
    
#     return jsonify({
#         'success': True,
#         'message': f"Thank you {name}! How can I help you with your order today?"
#     })

# @app.route('/api/end-conversation', methods=['POST'])
# def end_conversation():
#     """Endpoint to end the conversation"""
#     return jsonify({
#         'message': "Thank you for chatting with us today! If you have any more questions, feel free to return anytime. Have a great day!",
#         'conversation_ended': True
#     })

# if __name__ == '__main__':
#     # Use a different port (5001) to avoid conflicts
#     port = int(os.getenv("PORT", 5001))
#     app.run(debug=True, port=port)



from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
genai.configure(api_key=os.getenv("AIzaSyBBACSY1_6hts5hAALGdYas_GEI74ZjIzM"))
model = genai.GenerativeModel('gemini-2.0-flash')

@app.route('/api/welcome', methods=['GET'])
def welcome():
    """Endpoint to get the welcome message"""
    logger.info("Welcome message requested")
    return jsonify({
        'message': "Welcome to our E-commerce Support! How can I help you today? You can ask about order status, returns, product information, or shipping options."
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main endpoint for chat functionality"""
    try:
        data = request.json
        message = data.get('message', '')
        context = data.get('context', '')
        
        logger.info(f"Processing chat message: {message[:50]}...")
        
        # Recognize intent
        intent_prompt = f"""
        Classify the following user input into one of these intents:
        - order_status
        - return_policy
        - product_info
        - shipping_info
        - general_inquiry
        - fallback
        
        User input: {message}
        
        If the input doesn't clearly match any of the specific intents, classify it as 'fallback'.
        Return only the intent name.
        """
        
        intent_result = model.generate_content(intent_prompt)
        intent = intent_result.text.strip()
        logger.info(f"Detected intent: {intent}")
        
        # Handle fallback intent specifically
        if intent == 'fallback':
            fallback_prompt = f"""
            The user's message doesn't clearly match our defined intents. 
            Create a helpful fallback response that:
            1. Acknowledges we're not sure what they're asking
            2. Lists the topics we can help with (order status, returns, product info, shipping)
            3. Asks them to rephrase their question
            
            User message: {message}
            """
            fallback_result = model.generate_content(fallback_prompt)
            return jsonify({
                'message': fallback_result.text,
                'intent': 'fallback'
            })
        
        # Generate response based on intent
        response_prompt = f"""
        You are an e-commerce customer support assistant. Respond helpfully and concisely.
        
        User intent: {intent}
        User message: {message}
        {"Previous context: " + context if context else ""}
        
        Provide a helpful response for an e-commerce customer support chatbot:
        """
        
        result = model.generate_content(response_prompt)
        response = result.text
        
        return jsonify({
            'message': response,
            'intent': intent
        })
    except Exception as e:
        error_message = str(e)
        logger.error(f"Error in chat endpoint: {error_message}")
        
        # Provide more specific error messages based on the type of error
        if "API key" in error_message.lower():
            return jsonify({
                'error': True,
                'message': "I'm having trouble connecting to my knowledge base. Please try again in a moment while we fix this issue."
            }), 500
        elif "rate limit" in error_message.lower():
            return jsonify({
                'error': True,
                'message': "Our service is experiencing high demand right now. Please try again in a few moments."
            }), 500
        else:
            return jsonify({
                'error': True,
                'message': "I'm sorry, I'm having trouble understanding. Could you please rephrase your question? You can ask about order status, returns, product information, or shipping options."
            }), 500

@app.route('/api/collect-user-info', methods=['POST'])
def collect_user_info():
    """Endpoint to collect user information"""
    try:
        data = request.json
        name = data.get('name', '')
        email = data.get('email', '')
        order_number = data.get('orderNumber', '')
        
        logger.info(f"Collecting user info for: {name}")
        
        # In a real application, you would store this in a database
        # For this simple version, we'll just return a confirmation
        
        return jsonify({
            'success': True,
            'message': f"Thank you {name}! How can I help you with your order today?"
        })
    except Exception as e:
        logger.error(f"Error collecting user info: {str(e)}")
        return jsonify({
            'error': True,
            'message': "I'm sorry, I couldn't save your information. Please try again."
        }), 500

@app.route('/api/end-conversation', methods=['POST'])
def end_conversation():
    """Endpoint to end the conversation"""
    logger.info("Ending conversation")
    return jsonify({
        'message': "Thank you for chatting with us today! If you have any more questions, feel free to return anytime. Have a great day!",
        'conversation_ended': True
    })

if __name__ == '__main__':
    # Use a different port (5001) to avoid conflicts
    port = int(os.getenv("PORT", 5001))
    logger.info(f"Starting server on port {port}")
    app.run(debug=True, port=port)

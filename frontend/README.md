# 💬 Simple Chatbot Assistant (React + Flask)

A polished, interactive chatbot built with **React (Frontend)** and **Flask (Backend)**. This bot captures user details, recognizes intents, responds accordingly, and gracefully handles errors and unknown inputs. Designed as a portfolio-ready assignment project with all required functionalities and enhanced UX features.

---

## 📌 About the Project

This chatbot project was built to fulfill an academic assignment that required implementing:

- ✅ Welcome Message
- ✅ Intent Recognition (e.g., help, restart, end)
- ✅ User Input Collection (name & email)
- ✅ Conditional Logic (yes/no or structured branches)
- ✅ Textual Responses
- ✅ Fallback Handling for unknown inputs
- ✅ Error Handling for invalid formats (e.g., emails)
- ✅ Graceful End Conversation option

### ✨ Extra Features:

- Personalized replies using the user's name
- End Conversation and Restart buttons
- Typing indicator animation
- Display of captured user info (name & email)
- Clean UI using custom CSS and Flexbox layout

---

## 🚀 How to Set Up and Run the Project

### 📁 Project Structure

```
/chatbot-project
├── frontend/     # React app (Chatbot UI)
│   ├── App.js
│   ├── App.css
│   └── ...
├── backend/      # Flask API
│   ├── app.py
│   └── ...
```

---

### 🖥️ Frontend: React

1. Navigate to the `frontend/` folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

This will run the chatbot on [http://localhost:3000](http://localhost:3000)

---

### 🧠 Backend: Flask (Python)

1. Navigate to the `backend/` folder:

   ```bash
   cd backend
   ```

2. (Optional) Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Flask:

   ```bash
   pip install flask
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

This will start your backend at [http://localhost:5000](http://localhost:5000)

## 📝 License

This project is for educational purposes.

## 🙌 Acknowledgments

This chatbot was developed as part of a course assignment focused on conversation design, user input handling, and overall project polish.

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [userInfo, setUserInfo] = useState(null);
//   const [collectingInfo, setCollectingInfo] = useState(false);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [orderNumber, setOrderNumber] = useState('');
//   const [conversationEnded, setConversationEnded] = useState(false);
//   const [conversationContext, setConversationContext] = useState('');
  
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     const fetchWelcomeMessage = async () => {
//       try {
//         const response = await axios.get('http://localhost:5001/api/welcome');
//         setMessages([{ text: response.data.message, isBot: true }]);
//       } catch (error) {
//         console.error('Error fetching welcome message:', error);
//         setMessages([{ 
//           text: "Welcome to our E-commerce Support! How can I help you today?", 
//           isBot: true 
//         }]);
//       }
//     };
    
//     fetchWelcomeMessage();
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (input.trim() === '') return;

//     const userMessage = { text: input, isBot: false };
//     setMessages(prev => [...prev, userMessage]);
    
//     const updatedContext = conversationContext + `\nUser: ${input}`;
//     setConversationContext(updatedContext);
    
//     setInput('');

//     if (conversationEnded) {
//       setConversationEnded(false);
//     }

//     try {
//       if (collectingInfo) {
//         handleUserInfoCollection();
//         return;
//       }

//       if (input.toLowerCase().includes('bye') || 
//           input.toLowerCase().includes('thank you') || 
//           input.toLowerCase().includes('thanks for your help')) {
//         handleEndConversation();
//         return;
//       }

//       const response = await axios.post('http://localhost:5001/api/chat', {
//         message: input,
//         context: conversationContext
//       });
      
//       const botMessage = { text: response.data.message, isBot: true };
//       setMessages(prev => [...prev, botMessage]);
      
//       setConversationContext(updatedContext + `\nBot: ${response.data.message}`);
      
//       if (response.data.intent === 'order_status' && !userInfo) {
//         promptForUserInfo();
//       }
      
//     } catch (error) {
//       console.error('Error sending message:', error);
//       const errorMessage = { 
//         text: "I'm sorry, I'm having trouble responding right now. Please try again.", 
//         isBot: true 
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     }
//   };

//   const promptForUserInfo = () => {
//     const botMessage = { 
//       text: "To help you with your order, I'll need some information. What's your name?", 
//       isBot: true 
//     };
//     setMessages(prev => [...prev, botMessage]);
//     setCollectingInfo(true);
//   };

//   const handleUserInfoCollection = async () => {
//     if (!name) {
//       setName(input);
//       const botMessage = { text: `Nice to meet you, ${input}! What's your email address?`, isBot: true };
//       setMessages(prev => [...prev, botMessage]);
//     } else if (!email) {
//       setEmail(input);
//       const botMessage = { text: "Great! And what's your order number? (If you don't have it, just type 'none')", isBot: true };
//       setMessages(prev => [...prev, botMessage]);
//     } else if (!orderNumber) {
//       setOrderNumber(input);
//       setCollectingInfo(false);
      
//       try {
//         const response = await axios.post('http://localhost:5001/api/collect-user-info', {
//           name,
//           email,
//           orderNumber: input
//         });
        
//         const userInfoObj = { name, email, orderNumber: input };
//         setUserInfo(userInfoObj);
        
//         const botMessage = { text: response.data.message, isBot: true };
//         setMessages(prev => [...prev, botMessage]);
//       } catch (error) {
//         console.error('Error collecting user info:', error);
//         const errorMessage = { 
//           text: "I'm sorry, I couldn't save your information. Let's continue anyway. How can I help you?", 
//           isBot: true 
//         };
//         setMessages(prev => [...prev, errorMessage]);
//       }
//     }
//   };

//   const handleEndConversation = async () => {
//     try {
//       const response = await axios.post('http://localhost:5001/api/end-conversation');
//       const botMessage = { text: response.data.message, isBot: true };
//       setMessages(prev => [...prev, botMessage]);
//       setConversationEnded(true);
//     } catch (error) {
//       console.error('Error ending conversation:', error);
//       const errorMessage = { 
//         text: "Thank you for chatting with us today! If you have any more questions, feel free to return anytime.", 
//         isBot: true 
//       };
//       setMessages(prev => [...prev, errorMessage]);
//       setConversationEnded(true);
//     }
//   };

//   const restartConversation = () => {
//     setMessages([{ 
//       text: "Welcome back! How can I help you today?", 
//       isBot: true 
//     }]);
//     setConversationEnded(false);
//     setConversationContext('');
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>E-commerce Support Chat</h1>
//       </header>
//       <div className="chat-container">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
//             {message.text}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <form onSubmit={sendMessage} className="input-form">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message here..."
//           disabled={conversationEnded}
//         />
//         <button type="submit" disabled={conversationEnded}>Send</button>
//       </form>
//       {conversationEnded && (
//         <button className="restart-button" onClick={restartConversation}>
//           Start New Conversation
//         </button>
//       )}
//       {userInfo && (
//         <div className="user-info-display">
//           <p>Logged in as: {userInfo.name} ({userInfo.email})</p>
//           {userInfo.orderNumber !== 'none' && <p>Order: {userInfo.orderNumber}</p>}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [userInfo, setUserInfo] = useState(null);
//   const [collectingInfo, setCollectingInfo] = useState(false);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [orderNumber, setOrderNumber] = useState('');
//   const [conversationEnded, setConversationEnded] = useState(false);
//   const [conversationContext, setConversationContext] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

  // useEffect(() => {
  //   const fetchWelcomeMessage = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await axios.get('http://localhost:5001/api/welcome');
  //       setMessages([{ text: response.data.message, isBot: true }]);
  //     } catch (error) {
  //       console.error('Error fetching welcome message:', error);
  //       setMessages([{ 
  //         text: "Welcome to our E-commerce Support! How can I help you today?", 
  //         isBot: true 
  //       }]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
    
  //   fetchWelcomeMessage();
  // }, []);

//   useEffect(() => {
//     const fetchWelcomeMessage = async () => {
//       try {
//         const response = await axios.get('http://localhost:5001/api/welcome');
//         setMessages([{ text: response.data.message, isBot: true }]);
        
//         // Add a slight delay before asking for user info
//         setTimeout(() => {
//           promptForUserInfo();
//         }, 1000);
        
//       } catch (error) {
//         console.error('Error fetching welcome message:', error);
//         setMessages([{ 
//           text: "Welcome to our E-commerce Support! How can I help you today?", 
//           isBot: true 
//         }]);
        
//         // Still prompt for user info even if welcome message fails
//         setTimeout(() => {
//           promptForUserInfo();
//         }, 1000);
//       }
//     };
    
//     fetchWelcomeMessage();
//   }, []);
  

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (input.trim() === '') return;

//     const userMessage = { text: input, isBot: false };
//     setMessages(prev => [...prev, userMessage]);
    
//     const updatedContext = conversationContext + `\nUser: ${input}`;
//     setConversationContext(updatedContext);
    
//     setInput('');

//     if (conversationEnded) {
//       setConversationEnded(false);
//     }

//     try {
//       setIsLoading(true);
      
//       if (collectingInfo) {
//         handleUserInfoCollection();
//         return;
//       }

//       if (input.toLowerCase().includes('bye') || 
//           input.toLowerCase().includes('thank you') || 
//           input.toLowerCase().includes('thanks for your help')) {
//         handleEndConversation();
//         return;
//       }

//       const response = await axios.post('http://localhost:5001/api/chat', {
//         message: input,
//         context: conversationContext
//       });
      
//       const botMessage = { text: response.data.message, isBot: true };
//       setMessages(prev => [...prev, botMessage]);
      
//       setConversationContext(updatedContext + `\nBot: ${response.data.message}`);
      
//       if (response.data.intent === 'order_status' && !userInfo) {
//         promptForUserInfo();
//       }
      
//     } catch (error) {
//       console.error('Error sending message:', error);
//       let errorMessage = "I'm sorry, I'm having trouble responding right now. Please try again.";
      
//       // More specific error messages based on error type
//       if (error.response) {
//         if (error.response.status === 429) {
//           errorMessage = "Our service is experiencing high demand right now. Please try again in a few moments.";
//         } else if (error.response.data && error.response.data.message) {
//           errorMessage = error.response.data.message;
//         }
//       } else if (error.request) {
//         errorMessage = "I can't connect to our support system right now. Please check your internet connection and try again.";
//       }
      
//       setMessages(prev => [...prev, { 
//         text: errorMessage, 
//         isBot: true 
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const promptForUserInfo = () => {
//     const botMessage = { 
//       text: "To help you with your order, I'll need some information. What's your name?", 
//       isBot: true 
//     };
//     setMessages(prev => [...prev, botMessage]);
//     setCollectingInfo(true);
//   };

//   const handleUserInfoCollection = async () => {
//     try {
//       if (!name) {
//         setName(input);
//         const botMessage = { text: `Nice to meet you, ${input}! What's your email address?`, isBot: true };
//         setMessages(prev => [...prev, botMessage]);
//       } else if (!email) {
//         setEmail(input);
//         const botMessage = { text: "Great! And what's your order number? (If you don't have it, just type 'none')", isBot: true };
//         setMessages(prev => [...prev, botMessage]);
//       } else if (!orderNumber) {
//         setOrderNumber(input);
//         setCollectingInfo(false);
//         setIsLoading(true);
        
//         const response = await axios.post('http://localhost:5001/api/collect-user-info', {
//           name,
//           email,
//           orderNumber: input
//         });
        
//         const userInfoObj = { name, email, orderNumber: input };
//         setUserInfo(userInfoObj);
        
//         const botMessage = { text: response.data.message, isBot: true };
//         setMessages(prev => [...prev, botMessage]);
//       }
//     } catch (error) {
//       console.error('Error collecting user info:', error);
//       const errorMessage = { 
//         text: "I'm sorry, I couldn't save your information. Let's continue anyway. How can I help you?", 
//         isBot: true 
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEndConversation = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.post('http://localhost:5001/api/end-conversation');
//       const botMessage = { text: response.data.message, isBot: true };
//       setMessages(prev => [...prev, botMessage]);
//       setConversationEnded(true);
//     } catch (error) {
//       console.error('Error ending conversation:', error);
//       const errorMessage = { 
//         text: "Thank you for chatting with us today! If you have any more questions, feel free to return anytime.", 
//         isBot: true 
//       };
//       setMessages(prev => [...prev, errorMessage]);
//       setConversationEnded(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const restartConversation = () => {
//     setMessages([{ 
//       text: "Welcome back! How can I help you today?", 
//       isBot: true 
//     }]);
//     setConversationEnded(false);
//     setConversationContext('');
//     setUserInfo(null);
//     setName('');
//     setEmail('');
//     setOrderNumber('');
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>E-commerce Support Chat</h1>
//       </header>
//       <div className="chat-container">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
//             {message.text}
//           </div>
//         ))}
//         {isLoading && (
//           <div className="message bot typing">
//             <div className="typing-indicator">
//               <span></span>
//               <span></span>
//               <span></span>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <form onSubmit={sendMessage} className="input-form">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message here..."
//           disabled={conversationEnded || isLoading}
//         />
//         <button type="submit" disabled={conversationEnded || isLoading}>Send</button>
//         <button 
//           type="button" 
//           className="end-conversation-button" 
//           onClick={handleEndConversation}
//           disabled={conversationEnded || isLoading}
//         >
//           End Chat
//         </button>
//       </form>
//       {conversationEnded && (
//         <button className="restart-button" onClick={restartConversation}>
//           Start New Conversation
//         </button>
//       )}
//       {userInfo && (
//         <div className="user-info-display">
//           <p>Logged in as: {userInfo.name} ({userInfo.email})</p>
//           {userInfo.orderNumber !== 'none' && <p>Order: {userInfo.orderNumber}</p>}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


//above is working code


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [collectingInfo, setCollectingInfo] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [conversationEnded, setConversationEnded] = useState(false);
  const [conversationContext, setConversationContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5001/api/welcome');
        setMessages([{ text: response.data.message, isBot: true }]);
        promptForUserInfo();
      } catch (error) {
        console.error('Error fetching welcome message:', error);
        setMessages([{ 
          text: "Welcome to our E-commerce Support! How can I help you today?", 
          isBot: true 
        }]);
        promptForUserInfo();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWelcomeMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    
    const updatedContext = conversationContext + `\nUser: ${input}`;
    setConversationContext(updatedContext);
    
    setInput('');

    if (conversationEnded) {
      setConversationEnded(false);
    }

    try {
      setIsLoading(true);
      
      if (collectingInfo) {
        handleUserInfoCollection();
        return;
      }

      const response = await axios.post('http://localhost:5001/api/chat', {
        message: input,
        context: conversationContext
      });
      
      const botMessage = { text: response.data.message, isBot: true };
      setMessages(prev => [...prev, botMessage]);
      
      setConversationContext(updatedContext + `\nBot: ${response.data.message}`);
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        text: "I'm sorry, I'm having trouble responding right now. Please try again.", 
        isBot: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const promptForUserInfo = () => {
    const botMessage = { 
      text: "To help you with your order, I'll need some information. What's your name?", 
      isBot: true 
    };
    setMessages(prev => [...prev, botMessage]);
    setCollectingInfo(true);
  };

    const handleUserInfoCollection = async () => {
      if (!name) {
        setName(input);
        const botMessage = { text: `Nice to meet you, ${input}! What's your email address?`, isBot: true };
        setMessages(prev => [...prev, botMessage]);
      } else if (!email) {
        setEmail(input);
        const botMessage = { text: "Great! And what's your order number? (If you don't have it, just type 'none')", isBot: true };
        setMessages(prev => [...prev, botMessage]);
      } else if (!orderNumber) {
        setOrderNumber(input);
        setCollectingInfo(false);
        
        try {
          const response = await axios.post('http://localhost:5001/api/collect-user-info', {
            name,
            email,
            orderNumber: input
          });
          
          const userInfoObj = { name, email, orderNumber: input };
          setUserInfo(userInfoObj);
          
          const botMessage = { text: response.data.message, isBot: true };
          setMessages(prev => [...prev, botMessage]);
        } catch (error) {
          console.error('Error collecting user info:', error);
          const errorMessage = { 
            text: "I'm sorry, I couldn't save your information. Let's continue anyway. How can I help you?", 
            isBot: true 
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }
    };

  


  const handleEndConversation = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5001/api/end-conversation');
      const botMessage = { text: response.data.message, isBot: true };
      setMessages(prev => [...prev, botMessage]);
      setConversationEnded(true);
    } catch (error) {
      console.error('Error ending conversation:', error);
      const errorMessage = { 
        text: "Thank you for chatting with us today! If you have any more questions, feel free to return anytime.", 
        isBot: true 
      };
      setMessages(prev => [...prev, errorMessage]);
      setConversationEnded(true);
    } finally {
      setIsLoading(false);
    }
  };

  const restartConversation = () => {
    setMessages([{ 
      text: "Welcome back! How can I help you today?", 
      isBot: true 
    }]);
    setConversationEnded(false);
    setConversationContext('');
    setUserInfo(null);
    setName('');
    setEmail('');
    setOrderNumber('');
    promptForUserInfo();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>E-commerce Support Chat</h1>
      </header>
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={conversationEnded || isLoading}
        />
        <button type="submit" disabled={conversationEnded || isLoading}>Send</button>
        <button 
          type="button" 
          className="end-conversation-button" 
          onClick={handleEndConversation}
          disabled={conversationEnded || isLoading}
        >
          End Chat
        </button>
      </form>
      {conversationEnded && (
        <button className="restart-button" onClick={restartConversation}>
          Start New Conversation
        </button>
      )}
      {userInfo && (
        <div className="user-info-display">
          <p>Logged in as: {userInfo.name} ({userInfo.email})</p>
          {userInfo.orderNumber !== 'none' && <p>Order: {userInfo.orderNumber}</p>}
        </div>
      )}
    </div>
  );
}

export default App;

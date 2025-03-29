# **PrevPapers – PYQ Repository**
A **student-friendly** web application to search, download, and upload previous year question papers (PYQs). Built with **MERN Stack & Firebase**, it enables role-based access where **only college students** can upload PDFs after OTP verification.  

🚀 **Live Demo**: [PrevPapers](https://prevpapers.pages.dev)  

---

## **✨ Features**  
✔️ **Search & Download** – Anyone can search and download PYQs easily.  
✔️ **Restricted Uploads** – Only **@smit.smu.edu.in** email users can upload PDFs.  
✔️ **OTP-Based Signup** – Secure authentication via **NodeMailer OTP verification**.  
✔️ **JWT Authentication** – Protects user sessions.  
✔️ **File Upload Validation** – Enforces **standardized filenames** using regex.  
✔️ **Top Contributors Leaderboard** – Displays most active contributors.  
✔️ **Forgot Password** – Users can reset their password via email OTP.  
✔️ **User Dashboard** – View & delete uploaded files.  

---

## **🛠️ Tech Stack**  
- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Storage:** Firebase  
- **Authentication:** JWT, NodeMailer (OTP-based verification)  
- **Deployment:** Cloudflare Pages (Frontend) & Koyeb (Backend)  

---

## **🚀 Installation & Setup**  

### **Prerequisites**  
Ensure you have the following installed:  
- **Node.js** (v18+)  
- **MongoDB** (local or Atlas)  
- **Firebase Project**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/yourusername/prevpapers.git
cd prevpapers
```

### **2️⃣ Backend Setup**
```sh
cd backend
npm install
```

Create a .env file in the backend folder with:
```sh
MONGO_URL_USER = your_mongodb_connection_string1
PORT = 8000
EMAIL_USER = your_email
EMAIL_PASS = your_email_password
JWT_SECRET = your_secret_key
MONGO_URL_FILE = your_mongodb_connection_string2
FIREBASE_CREDENTIALS = your_firebase_credentials
```

Start the backend
```sh
nodemon index.js
```
### **3️⃣ Frontend Setup**
```sh
cd ../frontend
npm install
```

Create a .env file in the frontend folder with:
```sh
VITE_API_URL=http://localhost:8000
```

Start the frontend
```sh
npm run dev
```

---

## **🤝Contributing** 
We welcome contributions from the community! Follow these steps to contribute:

### **1️⃣ Fork & Clone the Repository**
```
git clone https://github.com/yourusername/prevpapers.git
cd prevpapers
```

### **2️⃣ Create a New Branch**
```
git checkout -b feature-branch
```

### **3️⃣ Make Your Changes**
- Fix bugs, add features, or improve documentation.
- Follow coding standards and best practices.

### **4️⃣ Commit & Push**
```
git add .
git commit -m "Add your message here"
git push origin feature-branch
```

### **5️⃣ Submit a Pull Request (PR)**
- Go to the Pull Requests tab in the GitHub repo.
- Click New Pull Request, select your branch, and submit.
- Wait for review and merge approval.


## Connect with me
 Follow me on twitter : @ryythem  
 
 Email : imrythem16@gmail.com
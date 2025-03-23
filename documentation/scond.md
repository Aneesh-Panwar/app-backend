# Table of Contents  
- [DATA MODELING](#data-modeling)  
  - [JWT](#jwt)  
  - [bcrypt](#bcrypt)  
  - [User Model (*user.model.js*)](#user-model-usermodeljs)  
    - [Pre Hooks](#pre)  
    - [Schema Methods](#userschema-methods)  
  - [Video Model (*video.model.js*)](#video-model-videomodeljs)  
- [FILE HANDLING (pdf, img, vid etc.)](#file-handling-pdf-img-vid-etc)  
  - [Multer](#multer)  
  - [Cloudinary](#cloudinary)  
- [HTTP](#http)  
  - [HTTP Headers](#http-headers)  
  - [Production-Grade Features](#production-grade-not-always-used)  
  - [HTTP Methods](#http-methods)  
  - [HTTP Status Codes](#http-status-codes)  
---

# 📌 DATA MODELING


## 🔐 JSON Web Token (JWT)

JWT is a **compact** and **self-contained** way of securely transmitting information between parties as a JSON object.

### 🔹 Features:
- **Stateless Authentication** → No need to store user session data on the server.
- **Security** → Uses cryptographic signing to prevent tampering.

### 🔹 JWT Structure:
JWT consists of **three parts**: `header.payload.signature`

```json
{
  "header": {
    "alg": "HS256",  // Algorithm used for signing
    "typ": "JWT"      // Type of token
  },
  "payload": {
    "userData": "..." // User data
  },
  "signature": "..."  // Prevents tampering
}
```

**Signature Calculation:**
```js
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

---

## 🔑 Bcrypt

Bcrypt is a **password-hashing algorithm** used to securely store passwords.

### 🔹 Common Methods:
```js
await bcrypt.hash(plainPassword, saltRounds);  // Hashing a password
await bcrypt.compare(plainPassword, hashedPassword);  // Comparing/Verifying
```

---

## 🏗️ User Model (`user.model.js`)

## 🔹 Schema Creation:
```js
const userSchema = new Schema({ ... }); // Defines fields, types, and rules
const User = model("User", userSchema); // Creates a model constructor
```

### 🔹 Example Constructor Function:
```js
function User(username, email) {
  this.username = username;
  this.email = email;
}

const user1 = new User("john_doe", "john@example.com");
console.log(user1); 
// OUTPUT: { username: 'john_doe', email: 'john@example.com' }
```

---

## 🔹 Mongoose Middleware - `pre`

Middleware in Mongoose executes code **before** a database operation (like `save`, `remove`, `updateOne`).

```js
userSchema.pre("save", function (next) {
  console.log("Pre-save middleware running...");
  next();
});
```
✅ `next()` passes control to:
- The **next middleware** in the chain (if multiple `pre()` hooks exist).
- The **main operation** (e.g., saving to the database).

**🛠️ Usage:**
```js
const user1 = new User({ name: "Alice", password: "mypassword" });
user1.save(); // Triggers the pre-save hook
```

---

## 🔹 Custom Methods (`userSchema.methods`)

Custom instance methods allow defining reusable functions for a schema.

### 🔹 Example:
```js
userSchema.methods.generateAccessToken = function() {
  return jwt.sign({ userId: this._id }, "secret_key");
};

const user = await User.findOne({ email: "alice@example.com" });
const token = user.generateAccessToken();
console.log(token); // JWT Token
```
✅ These methods work **only when a user is fetched or inserted into the database.**

---

## 🎥 Video Model (`video.model.js`)

### 🔹 `mongoose-aggregate-paginate-v2`
 A **plugin** that helps paginate aggregate queries in Mongoose.

```js
videoSchema.plugin(mongooseAggregatePaginate);
```

✅ **Why Pagination?**
- Loading all records at once is **inefficient**.
- Instead, **paginate** to fetch a limited number of documents (e.g., 10 per page).

---

# 📂 File Handling (PDF, Image, Video, etc.)

⚡ **Not every API endpoint receives a file**, so we handle it via **separate utilities or middleware.**

## 📦 File Handling Services & Packages:
- **Services:** Cloudinary, AWS
- **Packages:** `express-fileupload`, `multer`

### 🔹 File Upload Process:
1. **Receive file** using `multer`
2. **Store locally** on the server
3. **Upload to Cloudinary**

---

## 📸 Multer (Middleware for File Uploads)

✅ Handles file uploads in **Node.js + Express**

### 🔹 Configuration:
```js
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.random().toString(36).slice(2);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage });
```

### 🔹 Usage:
```js
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded!', file: req.file });
});
```

---

## ☁️ Cloudinary (Cloud Storage for Images/Videos)

✅ **Steps to Use Cloudinary:**
1️⃣ Upload files via API or manually.
2️⃣ Cloudinary stores them and returns a URL.
3️⃣ Modify URL for transformations (resize, crop, optimize, etc.).
4️⃣ Cloudinary delivers optimized files via **CDN**.

### 🔹 Configuration:
```js
cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});
```

### 🔹 Upload File:
```js
await cloudinary.uploader.upload("local_path", { public_id: "sample_image" });
```

✅ **Using Multer + Cloudinary:**
```js
app.post('/upload', upload.single('file'), async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  res.json({ message: 'Uploaded!', url: result.secure_url });
});
```

---

# 🌐 HTTP Basics

## 🔹 HTTP Headers
Metadata (key-value pairs) sent along with requests/responses.

✅ **Common Headers:**
- `Accept: application/json` → Specifies data format
- `User-Agent: Mozilla/5.0` → Identifies client application
- `Authorization: Bearer token` → Authentication (JWT, OAuth, etc.)
- `Content-Type: image/png` → Specifies media type
- `Cache-Control: no-cache` → Caching behavior

---

## 🔹 HTTP Methods              
| Method | Description |     
|--------|------------|      
| `GET` | Retrieve data |
| `POST` | Add new data |         
| `PUT` | Replace data |                            
| `PATCH` | Modify data |       
| `DELETE` | Remove data |                  


## 🔹 HTTP Status Codes 
| Code | Meaning |
|------|---------|
| `200` | OK |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Internal Server Error |
---

<table>
  <tr>
    <td>
      <h3>🔹 HTTP Methods</h3>
      <table>
        <tr>
          <th>Method</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>GET</td>
          <td>Retrieve data</td>
        </tr>
        <tr>
          <td>POST</td>
          <td>Add new data</td>
        </tr>
        <tr>
          <td>PUT</td>
          <td>Replace data</td>
        </tr>
        <tr>
          <td>PATCH</td>
          <td>Modify data</td>
        </tr>
        <tr>
          <td>DELETE</td>
          <td>Remove data</td>
        </tr>
      </table>
    </td>
    <td>
      <h3>🔹 HTTP Status Codes</h3>
      <table>
        <tr>
          <th>Code</th>
          <th>Meaning</th>
        </tr>
        <tr>
          <td>200</td>
          <td>OK</td>
        </tr>
        <tr>
          <td>400</td>
          <td>Bad Request</td>
        </tr>
        <tr>
          <td>401</td>
          <td>Unauthorized</td>
        </tr>
        <tr>
          <td>404</td>
          <td>Not Found</td>
        </tr>
        <tr>
          <td>500</td>
          <td>Internal Server Error</td>
        </tr>
      </table>
    </td>
  </tr>
</table>


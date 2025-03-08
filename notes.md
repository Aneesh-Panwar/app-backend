# 📌 NPM & GIT COMMANDS

- **Install a package for development only:**  
  ```sh
  npm i -D [package]
  ```
  *(This installs dependencies needed only for development, not for production.)*

- **Push a branch to GitHub:**  
  ```sh
  git push -u origin branch-name
  ```
  *(The `-u` flag sets upstream, so later you can just use `git push`.)*

---

# 🌍 Using MongoDB Atlas (Online Database)

1. Go to **MongoDB Atlas**
2. Navigate to **Cluster → Connect → Compass**
3. Copy the **URI** and use it in your project

⚠️ Always use **try-catch** and **async-await** when connecting to a database.

Example:
```js
(async () => {
  // Database connection logic here
})();
```
> `;` is optional but helps prevent errors if another script doesn't end with a semicolon.

⚠️ In URLs (like database connection URLs), special symbols like `@` can cause errors.

---

# 📂 Project File Structure

```
  📁 public
  📁 src
    ├── 📁 controller  (Functions for specific routes)
    ├── 📁 db          (Database connection)
    │     ├── index.js
    ├── 📁 middlewares 
    ├── 📁 models      (Schema definitions)
    ├── 📁 routes      (API routes)
    ├── 📁 utils       (Reusable utility functions)
    │     ├── ApiError.js       (Custom error handling)
    │     ├── ApiResponse.js    (Custom response handling)
    │     ├── asyncHandler.js   (Try-catch handling)
    ├── app.js         (Main app file)
    ├── constants.js   (Global constants)
    ├── index.js       (Entry point)
  📄 .env               (Environment variables)
  📄 .gitignore         (Ignore files/folders for Git tracking)
  📄 .prettierrc        (Code formatting rules)
  📄 .prettierignore    (Files not formatted by Prettier)
  📄 package.json       (Project metadata & dependencies)
  📄 package-lock.json  (Exact dependency versions)
  📄 README.md          (Project documentation)
```

---


# 📦 Dependencies

| Package          | Purpose                       |
|------------------|--------------------------------|
| **mongoose**     | Database management (MongoDB)  |
| **express**      | Web framework for routing      |
| **dotenv**       | Load environment variables     |
| **cookie-parser**| Access user browser cookies    |
| **cors**         | Enable Cross-Origin Requests   |

---


# 🌍 Online Database Setup (MongoDB Atlas)

1. **Go to MongoDB Atlas**
2. **Choose a cluster → Select server location**
3. **Set username & password**
4. **Create a user → Add allowed IPs** *(Manage in the **NETWORK** tab)*
5. **Go to DATABASE → Connect → Compass → Copy connection string**

---

# 🔄 Async Handler Utility

### **Definition**
```js
const asyncHandler = (fn) => {
    return (req, res, next) => {  
        Promise.resolve(fn(req, res, next))  
               .catch((err) => next(err));
    };
};
```

### **Usage**
```js
app.get("/users/:id", asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
}));
```
OR
```js
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (err) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message,
        });
    }
};
```

### **Flow Explanation**
1. Express receives a request to `/users/:id`
2. `asyncHandler()` returns a middleware function
3. Middleware executes `fn(req, res, next)`
4. - If **successful**, it sends a response ✅
   - If **error occurs**, it catches and handles it ⚠️

---

# ❌ Custom Error Handling (ApiError.js)

✅ Ensures all errors have a **consistent format** in API responses.

### **Example Usage**
```js
app.get("/user/:id", async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");

    res.json({ success: true, user });
});
```
### **Example Output**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "data": null,
  "errors": [],
  "success": false
}
```

---

# ✅ Custom Response Handling (ApiResponse.js)

📌 Helps **structure API responses** consistently.

### **Features**
- ✅ **Status Code** *(200, 201, etc.)*
- ✅ **Data** *(Response payload)*
- ✅ **Message** *(Default: "Success")*
- ✅ **Success Flag** *(`true` if status < 400, else `false`)*

### **Example Usage**
```js
app.get('/user/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json(new ApiResponse(404, null, "User not found"));

    res.json(new ApiResponse(200, user, "User fetched successfully"));
});
```
### **Example Output**
```json
{
  "statusCode": 200,
  "data": { "id": "123", "name": "John Doe" },
  "message": "User fetched successfully",
  "success": true
}
```
---

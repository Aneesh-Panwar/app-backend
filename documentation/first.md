 # Table Of Content
1. [NPM & Git Commands](#-npm--git-commands)
2. [Using MongoDB Atlas (Online Database)](#-using-mongodb-atlas-online-database)
3. [Project File Structure](#-project-file-structure)
4. [Dependencies](#-dependencies)
5. [Online Database Setup (MongoDB Atlas)](#-online-database-setup-mongodb-atlas)
6. [Async Handler Utility](#-async-handler-utility)
7. [Custom Error Handling (ApiError.js)](#-custom-error-handling-apierrorjs)
8. [Custom Response Handling (ApiResponse.js)](#-custom-response-handling-apiresponsejs)
---

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
    |     ├── 📄user.controller.js  (user controllers)
    |
    ├── 📁 db          (Database connection)
    │     ├── 📄index.js
    ├── 📁 middlewares 
    |     ├── 📄multer.middleware.js   (for file handeling)
    |     ├── 
    |
    ├── 📁 models      (Schema definitions)
    |     ├── 📄user.model.js     (user schema + some functions related to user)
    |     ├── 📄video.model.js    (video schema + aggregation plugin for complex queries)
    |     ├── 📄
    |     ├── 📄
    ├── 📁 routes      (API routes)
    |     ├── 📄user.routes.js
    |
    ├── 📁 utils       (Reusable utility functions)
    │     ├── 📄ApiError.js       (Custom error handling)
    │     ├── 📄ApiResponse.js    (Custom response handling)
    │     ├── 📄asyncHandler.js   (Try-catch handling)
    │     ├── 📄cloudinary.service.js   (to store files on cloud/online)
    ├── 📄app.js         (Main app file)
    ├── 📄constants.js   (Global constants)
    ├── 📄index.js       (Entry point)
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

| Package          | Purpose                        |
|------------------|--------------------------------|
| **mongoose**     | Database management (MongoDB)  |
| **express**      | Web framework for routing      |
| **dotenv**       | Load environment variables     |
| **cookie-parser**| Access user browser cookies    |
| **cors**         | Enable Cross-Origin Requests   |
| **bcrypt**         | password-hashing algorithm used to securely store passwords   |
| **jsonwebtoken**         | transmitting information between parties as a JSON object  |
| **mongoose-aggregate-paginate**         | plugin that helps with pagination when using aggregate queries.  |

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

#### *how this `next(err)` works 👇*
```js
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});
```

### ***Since we added this middleware at the end of all routes, Express will now use it:***
- *Express sees that next(err) was called.*
- *It skips all normal routes and middleware.*
- *It finds the first middleware with err as the first argument.*
- *It sends a JSON error response :*
```json
{
  "success": false,
  "message": "User not found"
}
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



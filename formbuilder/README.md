# FormForge — No-Code Form Builder

A full-stack MERN MVP for creating and sharing forms without code.

---

## Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React 18 + Vite             |
| Backend   | Node.js + Express           |
| Database  | MongoDB + Mongoose          |
| HTTP      | Axios                       |
| Routing   | React Router v6             |

---

## Project Structure

```
formbuilder/
├── backend/
│   ├── models/
│   │   ├── Form.js          # Form schema
│   │   └── Response.js      # Response schema
│   ├── routes/
│   │   ├── forms.js         # CRUD for forms
│   │   └── responses.js     # Submit & view responses
│   ├── server.js            # Express app entry
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── FormsList.jsx    # Admin: all forms
│   │   │   ├── CreateForm.jsx   # Admin: build a form
│   │   │   ├── FillForm.jsx     # Public: fill a form
│   │   │   └── Responses.jsx    # Admin: view responses
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── api.js           # Axios instance
│   │   ├── App.jsx          # Routes
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) OR a MongoDB Atlas connection string

### 1. Install Dependencies

```bash
# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI if using Atlas
```

Default `.env`:
```
MONGO_URI=mongodb://localhost:27017/formbuilder
PORT=5000
```

### 3. Start Backend

```bash
cd backend
npm run dev    # uses nodemon (auto-restart)
# or
npm start      # plain node
```

Backend runs at: `http://localhost:5000`

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## API Reference

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| POST   | `/forms`               | Create a new form            |
| GET    | `/forms`               | List all forms               |
| GET    | `/forms/:id`           | Get single form              |
| DELETE | `/forms/:id`           | Delete form                  |
| POST   | `/responses`           | Submit a form response       |
| GET    | `/responses/:formId`   | Get all responses for a form |

---

## Features

### Admin Side (`/admin`)
- Create forms with title, description, and dynamic fields
- Field types: **Text**, **Textarea**, **Dropdown**, **Checkbox**
- Set fields as required
- Add options (comma-separated) for dropdown/checkbox
- View all forms in a card grid
- Delete forms
- Copy public form link
- View all responses per form

### Public Side (`/form/:id`)
- Dynamic form rendering from database
- Client-side validation (required fields)
- Confirmation screen after submit

---

## Schemas

### Form
```js
{
  title: String,
  description: String,
  fields: [{
    label: String,
    type: "text" | "textarea" | "dropdown" | "checkbox",
    options: [String],
    required: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Response
```js
{
  formId: ObjectId,
  answers: [{
    fieldLabel: String,
    value: Mixed  // String or Array (for checkboxes)
  }],
  createdAt: Date
}
```

---

## Notes

- Vite proxies `/forms` and `/responses` to `http://localhost:5000` during development
- For production, set `VITE_API_URL` in frontend `.env` to your backend URL
- No authentication — this is an MVP. Add JWT auth for production use.

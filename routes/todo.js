const express = require("express");
const router = express.Router();

const {
  getTodoById,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
  getAllTodoByUserId,
} = require("../controllers/todo");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//all of params
router.param("userId", getUserById);
router.param("todoId", getTodoById);

//all of actual routes
//create route
router.post("/todo/create/:userId", isSignedIn, isAuthenticated, createTodo);

// read routes
router.get("/todo/:todoId/:userId", isSignedIn, isAuthenticated, getTodo);

//delete route
router.delete("/todo/:todoId/:userId", isSignedIn, isAuthenticated, deleteTodo);

//update route
router.put("/todo/:todoId/:userId", isSignedIn, isAuthenticated, updateTodo);

//listing route
router.get("/todos/:userId", isSignedIn, isAuthenticated, getAllTodoByUserId);

module.exports = router;

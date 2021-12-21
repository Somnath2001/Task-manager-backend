const Todo = require("../models/todo");
const _ = require("lodash");

exports.getTodoById = (req, res, next, id) => {
  Todo.findById(id).exec((err, todo) => {
    if (err) {
      return res.status(400).json({
        error: "Tasks not found",
      });
    }
    req.todo = todo;
    next();
  });
};

exports.createTodo = async (req, res) => {
  try {
    const todo = new Todo(req.body);
    if (!todo.name || !todo.description || !todo.status || !todo.priority) {
      return res.status(400).json({
        error: "Please include all fields.",
      });
    }
    const todos = await Todo.findOne({ userId: req.profile._id }).exec();

    await Todo.create({
      userId: req.profile._id,
      name: todo.name,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
    });

    todos.todos = todo;
    await todos.save();

    res.json(todo);
  } catch (error) {
    return res.status(400).json({
      error: "Failed to save todo in db",
    });
  }
};

exports.getTodo = (req, res) => {
  return res.json(req.todo);
};

// delete controllers
exports.deleteTodo = (req, res) => {
  let todo = req.todo;
  todo.remove((err, deletedTodo) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the task",
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedTodo,
    });
  });
};

// update controllers
exports.updateTodo = (req, res) => {
  const todo = req.todo;
  todo.name = req.body.name;
  todo.description = req.body.description;
  todo.status = req.body.status;
  todo.priority = req.body.priority;
  todo.save((err, updatedTodo) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update task",
      });
    }
    res.json(updatedTodo);
  });
};

//todo listing
exports.getAllTodoByUserId = (req, res) => {
  Todo.find({ userId: req.profile._id }).exec((err, todos) => {
    if (err) {
      return res.status(400).json({
        error: "NO TASK FOUND",
      });
    }
    if (todos.length === 0) {
      return res.status(400).json({
        error: "No task found",
      });
    }
    res.json(todos);
  });
};

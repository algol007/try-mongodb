const errors = require('restify-errors');
const User = require('../models/User');

module.exports = server => {
  // Get all users
  server.get('/users', async (req, res, next) => {
    
    try {
      const users = await User.find({});
      res.send(users);
      next();
    } catch(err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Get single user
  server.get('/users/:id', async (req, res, next) => {
    
    try {
      const users = await User.findById(req.params.id);
      res.send(users);
      next();
    } catch(err) {
      return next(new errors.ResourceNotFoundError(`Costumer ${req.params.id} is not found!`));
    }
  });

  // Add user
  server.post('/users', async (req, res, next) => {
    // Check for JSON
    if(!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    const { name, email, balance } = req.body;

    const user = new User({
      name,
      email,
      balance
    });

    try {
      const newUser = await user.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  // Update user
  server.put('/users/:id', async (req, res, next) => {
    // Check for JSON
    if(!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    try {
      const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.send(200);
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`Costumer ${req.params.id} is not found!`));
    }
  });

  // Delete user
  server.del('/users/:id', async (req, res, next) => {

    try {
      const user = await User.findOneAndRemove({ _id: req.params.id });
      res.send(204);
      next();
    } catch (err) {
      return next(new errors.ResourceNotFoundError(`Costumer ${req.params.id} is not found!`));
    }
  });
};

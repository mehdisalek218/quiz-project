package service;

import java.util.List;
import model.User;
import dao.UserDao;

public class UserService {

    private UserDao userDao;

    public UserService() {
        userDao = new UserDao(); // Initialize UserDao in constructor
    }

    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }

    public User addUser(User user) {
        // Validate user fields
        if (!validateUser(user)) {
            throw new IllegalArgumentException("Invalid user data");
        }

        // Perform additional business logic if needed

        // Add user to database using UserDao
        return userDao.addUser(user);
    }

    public void deleteUser(User user) {
        // Perform additional business logic if needed

        // Delete user from database using UserDao
        userDao.deleteUser(user);
    }

    public User updateUser(User user) {
        // Validate user fields
        if (!validateUser(user)) {
            throw new IllegalArgumentException("Invalid user data");
        }

        // Check if user exists
        User existingUser = userDao.getUserById(user.getId());
        if (existingUser == null) {
            throw new IllegalArgumentException("User not found with ID: " + user.getId());
        }

        // Perform additional business logic if needed

        // Update user in database using UserDao
        return userDao.updateUser(user);
    }

    // Method to validate user fields
    private boolean validateUser(User user) {
        return user.getEmail() != null && !user.getEmail().isEmpty() &&
               user.getName() != null && !user.getName().isEmpty() &&
               user.getGender() != null && !user.getGender().isEmpty() &&
               user.getPassword() != null && !user.getPassword().isEmpty() &&
               user.getBirthDate() != null && user.getWeight() > 0 && user.getHeight() > 0;
    }
}

package controller;

import java.io.IOException;
import java.io.PrintWriter;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import model.User;
import service.UserService;

@WebServlet("/users/*")
public class UserController extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private UserService userService;

    @Override
    public void init() throws ServletException {
        userService = new UserService();
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid endpoint");
            return;
        }

        String endpoint = pathInfo.substring(1); // Remove leading slash

        StringBuilder jsonUser = new StringBuilder();
        String line;
        while ((line = req.getReader().readLine()) != null) {
            jsonUser.append(line.trim());
        }
        System.out.println("Received JSON: " + jsonUser.toString());

        ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            User user = mapper.readValue(jsonUser.toString(), User.class);

            switch (endpoint) {
                case "emailPassword":
                    handleEmailPasswordForm(resp, mapper, user);
                    break;
                case "birthDate":
                    handleBirthDateForm(resp, mapper, user);
                    break;
                case "name":
                    handleNameForm(resp, mapper, user);
                    break;
                case "weight":
                    handleWeightForm(resp, mapper, user);
                    break;
                case "gender":
                    handleGenderForm(resp, mapper, user);
                    break;
                case "height":
                    handleHeightForm(resp, mapper, user);
                    break;
                default:
                    resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid endpoint");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Failed to parse JSON: " + e.getMessage());
        }
    }

    private void handleEmailPasswordForm(HttpServletResponse resp, ObjectMapper mapper, User user) throws IOException {
        if (user.getEmail() == null || user.getPassword() == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Email and Password are required");
            return;
        }
        User createdUser = userService.addUser(user);
        if (createdUser != null) {
            PrintWriter response = resp.getWriter();
            response.write(mapper.writeValueAsString(createdUser));
        }
    }

    private void handleBirthDateForm(HttpServletResponse resp, ObjectMapper mapper, User user) throws IOException {
        if (user.getBirthDate() == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Birth Date is required");
            return;
        }
        User updatedUser = userService.updateUser(user);
        if (updatedUser != null) {
            PrintWriter response = resp.getWriter();
            response.write(mapper.writeValueAsString(updatedUser));
        }
    }

    private void handleNameForm(HttpServletResponse resp, ObjectMapper mapper, User user) throws IOException {
        if (user.getName() == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Name is required");
            return;
        }
        User updatedUser = userService.updateUser(user);
        if (updatedUser != null) {
            PrintWriter response = resp.getWriter();
            response.write(mapper.writeValueAsString(updatedUser));
        }
    }

    private void handleWeightForm(HttpServletResponse resp, ObjectMapper mapper, User user) throws IOException {
        if (user.getWeight() == 0) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Weight is required");
            return;
        }
        User updatedUser = userService.updateUser(user);
        if (updatedUser != null) {
            PrintWriter response = resp.getWriter();
            response.write(mapper.writeValueAsString(updatedUser));
        }
    }

    private void handleGenderForm(HttpServletResponse resp, ObjectMapper mapper, User user) throws IOException {
        if (user.getGender() == null) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Gender is required");
            return;
        }
        User updatedUser = userService.updateUser(user);
        if (updatedUser != null) {
            PrintWriter response = resp.getWriter();
            response.write(mapper.writeValueAsString(updatedUser));
        }
    }

    private void handleHeightForm(HttpServletResponse resp, ObjectMapper mapper, User user) throws IOException {
        if (user.getHeight() == 0) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Height is required");
            return;
        }
        User updatedUser = userService.updateUser(user);
        if (updatedUser != null) {
            PrintWriter response = resp.getWriter();
            response.write(mapper.writeValueAsString(updatedUser));
        }
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}

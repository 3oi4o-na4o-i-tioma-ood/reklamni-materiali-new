package com.rm.repositories;

import java.util.Optional;

import com.rm.models.users.Role;
import com.rm.models.users.User;
import com.rm.models.users.UserUpdateInfo;
import com.rm.util.db.Database;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class UsersRepository {
    private final Database database;

    public UsersRepository(Database database) {
        this.database = database;
        this.database.registerSerializer(Role.class,
            (statement, index, value) -> statement.setString(index, value.name()),
            (resultSet, columnName) -> Role.valueOf(resultSet.getString(columnName)));
    }

    public Optional<User> getOne(String email, String password) {
        return database.findFirstIntoRecord(User.class,
            "SELECT * FROM Users WHERE email = ? AND password = ?",
            email, password);
    }

    public Optional<User> getOne(String email) {
        return database.findFirstIntoRecord(User.class, "SELECT * FROM Users WHERE email = ?", email);
    }

    public Optional<User> getOne(long id) {
        return database.findFirstIntoRecord(User.class, "SELECT * FROM Users WHERE id = ?", id);
    }

    public void setEmailVerified(String email, Boolean emailVerified) {
        database.update("UPDATE Users SET email_verified = ? WHERE email = ?", emailVerified, email);
    }

    public void updateUserInfo(User user, UserUpdateInfo userInfo) {
        database.update(
            "UPDATE Users SET name = ?, surname = ?, phone = ?, delivery_address = ? WHERE id = ?",
            userInfo.name() == null ? user.name() : userInfo.name(),
            userInfo.surname() == null ? user.surname() : userInfo.surname(),
            userInfo.phone() == null ? user.phone() : userInfo.phone(),
            userInfo.address() == null ? user.delivery_address() : userInfo.address(),
            user.id()
        );
    }

    public void setCartId(Long userId, String cartId) {
        database.update("UPDATE Users SET cart_id = ? WHERE id = ?", cartId, userId);
    }

    public void save(User user) {
        database.update("""
            INSERT INTO Users (
                role,
                name,
                surname,
                password,
                phone,
                email,
                delivery_address,
                delivery_phone,
                email_verified,
                cart_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            user.role(),
            user.name(),
            user.surname(),
            user.password(),
            user.phone(),
            user.email(),
            user.delivery_address(),
            user.delivery_phone(),
            user.email_verified(),
            user.cart_id());
    }
}

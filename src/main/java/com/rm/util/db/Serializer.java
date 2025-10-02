package com.rm.util.db;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public interface Serializer<T> {
    void writeToStatement(PreparedStatement statement, int idx, T value) throws SQLException;
    T readFromResultSet(ResultSet resultSet, int columnIndex) throws SQLException;
}

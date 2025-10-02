package com.rm.util.db;

import java.sql.ResultSet;
import java.sql.SQLException;

public interface ReadFromResultSet<T> {
    T read(ResultSet resultSet, int columnIndex) throws SQLException;
}

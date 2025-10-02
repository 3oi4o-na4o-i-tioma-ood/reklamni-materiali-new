package com.rm.util.db;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public interface WriteToStatement<T> {
    void write(PreparedStatement statement, int index, T value) throws SQLException;
}

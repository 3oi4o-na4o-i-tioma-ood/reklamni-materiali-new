package com.rm.util.db;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.RecordComponent;
import java.math.BigDecimal;
import java.sql.Array;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLXML;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Database {
    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Value("${spring.datasource.username}")
    private String databaseUsername;

    @Value("${spring.datasource.password}")
    private String databasePassword;

    private final Map<Class<?>, Serializer> serializers = new ConcurrentHashMap<>();

    public Database() {
        registerDefaultSerializers();
    }

    private void registerDefaultSerializers() {
        registerSerializer(boolean.class, PreparedStatement::setBoolean, ResultSet::getBoolean);
        registerSerializer(Boolean.class, PreparedStatement::setBoolean, ResultSet::getBoolean);
        registerSerializer(byte.class, PreparedStatement::setByte, ResultSet::getByte);
        registerSerializer(Byte.class, PreparedStatement::setByte, ResultSet::getByte);
        registerSerializer(short.class, PreparedStatement::setShort, ResultSet::getShort);
        registerSerializer(Short.class, PreparedStatement::setShort, ResultSet::getShort);
        registerSerializer(int.class, PreparedStatement::setInt, ResultSet::getInt);
        registerSerializer(Integer.class, PreparedStatement::setInt, ResultSet::getInt);
        registerSerializer(long.class, PreparedStatement::setLong, ResultSet::getLong);
        registerSerializer(Long.class, PreparedStatement::setLong, ResultSet::getLong);
        registerSerializer(float.class, PreparedStatement::setFloat, ResultSet::getFloat);
        registerSerializer(Float.class, PreparedStatement::setFloat, ResultSet::getFloat);
        registerSerializer(double.class, PreparedStatement::setDouble, ResultSet::getDouble);
        registerSerializer(Double.class, PreparedStatement::setDouble, ResultSet::getDouble);
        registerSerializer(BigDecimal.class, PreparedStatement::setBigDecimal, ResultSet::getBigDecimal);

        registerSerializer(char.class,
            (statement, index, value) -> statement.setString(index, Character.toString(value)),
            (resultSet, columnName) -> resultSet.getString(columnName).charAt(0));
        registerSerializer(Character.class,
            (statement, index, value) -> statement.setString(index, Character.toString(value)),
            (resultSet, columnName) -> resultSet.getString(columnName).charAt(0));
        registerSerializer(String.class, PreparedStatement::setString, ResultSet::getString);
        registerSerializer(byte[].class, PreparedStatement::setBytes, ResultSet::getBytes);
        registerSerializer(UUID.class,
            (statement, index, value) -> statement.setString(index, value.toString()),
            (resultSet, columnName) -> UUID.fromString(resultSet.getString(columnName)));

//        registerSerializer(Enum.class,
//            (statement, index, value) -> statement.setString(index, value.name()),
//            (resultSet, columnName) -> );

        registerSerializer(Date.class, PreparedStatement::setDate, ResultSet::getDate);
        registerSerializer(Time.class, PreparedStatement::setTime, ResultSet::getTime);
        registerSerializer(Timestamp.class, PreparedStatement::setTimestamp, ResultSet::getTimestamp);
        registerSerializer(Blob.class, PreparedStatement::setBlob, ResultSet::getBlob);
        registerSerializer(Clob.class, PreparedStatement::setClob, ResultSet::getClob);
        registerSerializer(Array.class, PreparedStatement::setArray, ResultSet::getArray);
        registerSerializer(SQLXML.class, PreparedStatement::setSQLXML, ResultSet::getSQLXML);
//            case LocalDate localDate -> statement.setDate(idx, localDate);
//            case LocalTime localTime -> statement.setTime(idx, localTime);
//            case OffsetTime offsetTime -> statement.setTime(idx, offsetTime);
//            case LocalDateTime localDateTime -> statement.setTimestamp(idx, localDateTime);
//            case OffsetDateTime offsetDateTime -> statement.setTimestamp(idx, offsetDateTime);
//            case Map map -> {}
//            arrays
    }

    public <T> void registerSerializer(Class<T> type, Serializer<T> serializer) {
        serializers.put(type, serializer);
    }

    public <T> void registerSerializer(Class<T> type, WriteToStatement<T> writeToStatement, ReadFromResultSet<T> readFromResultSet) {
        serializers.put(type, new Serializer<T>() {
            @Override
            public void writeToStatement(PreparedStatement statement, int idx, T value) throws SQLException {
                writeToStatement.write(statement, idx, value);
            }

            @Override
            public T readFromResultSet(ResultSet resultSet, int columnIndex) throws SQLException {
                return readFromResultSet.read(resultSet, columnIndex);
            }
        });
    }

    private Connection createConnection() throws SQLException {
        return DriverManager.getConnection(databaseUrl, databaseUsername, databasePassword);
    }

    public <T> Optional<T> findFirstFromColumn(Class<T> type, String query, Object... params) {
        try (Connection connection = createConnection()) {
            PreparedStatement statement = connection.prepareStatement(query);
            for (int i = 0; i < params.length; i++) {
                setParam(statement, i + 1, params[i]);
            }

            ResultSet resultSet = statement.executeQuery();
            if (!resultSet.next()) {
                return Optional.empty();
            }
            return Optional.of(readObject(resultSet, 1, type));
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public <T extends Record> Optional<T> findFirstIntoRecord(Class<T> type, String query, Object... params) {
        try (Connection connection = createConnection()) {
            PreparedStatement statement = connection.prepareStatement(query);
            for (int i = 0; i < params.length; i++) {
                setParam(statement, i + 1, params[i]);
            }

            ResultSet resultSet = statement.executeQuery();
            if (!resultSet.next()) {
                return Optional.empty();
            }
            return Optional.of(readRecord(type, resultSet));
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public <T extends Record> List<T> findAllIntoRecord(Class<T> type, String query, Object... params) {
        try (Connection connection = createConnection()) {
            PreparedStatement statement = connection.prepareStatement(query);
            for (int i = 0; i < params.length; i++) {
                setParam(statement, i + 1, params[i]);
            }

            ResultSet resultSet = statement.executeQuery();
            List<T> result = new ArrayList<>();
            while (resultSet.next()) {
                result.add(readRecord(type, resultSet));
            }
            return result;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void update(String query, Object... params) {
        try (Connection connection = createConnection()) {
            PreparedStatement statement = connection.prepareStatement(query);
            for (int i = 0; i < params.length; i++) {
                setParam(statement, i + 1, params[i]);
            }
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private <T> void setParam(PreparedStatement statement, int index, T param) throws SQLException {
        if (param == null) {
            statement.setObject(index, null);
            return;
        }
        Class<?> key = serializers
            .keySet()
            .stream()
            .filter(type -> type.isInstance(param))
            .min((t1, t2) -> t1.isAssignableFrom(t2) ? 1 : -1)
            .orElseThrow(() -> new IllegalArgumentException("Could not find serializer for type " + param.getClass()));
        serializers.get(key).writeToStatement(statement, index, param);
    }

    private <T> T readObject(ResultSet resultSet, String columnName, Class<T> type) throws SQLException {
        return readObject(resultSet, columnName, type, false);
    }

    private <T> T readObject(ResultSet resultSet, String columnName, Class<T> type, boolean nullable) throws SQLException {
        return readObject(resultSet, resultSet.findColumn(columnName), type, nullable);
    }

    private <T> T readObject(ResultSet resultSet, int columnIndex, Class<T> type) throws SQLException {
        return readObject(resultSet, columnIndex, type, false);
    }

    private <T> T readObject(ResultSet resultSet, int columnIndex, Class<T> type, boolean nullable) throws SQLException {
        if (nullable && resultSet.getObject(columnIndex) == null) {
            return null;
        }
        Class<?> key = serializers
            .keySet()
            .stream()
            .filter(t -> t.isAssignableFrom(type))
            .min((t1, t2) -> t1.isAssignableFrom(t2) ? 1 : -1)
            .orElseThrow(() -> new IllegalArgumentException("Could not find serializer for type " + type));
        return (T) serializers.get(key).readFromResultSet(resultSet, columnIndex);
    }

    private <T extends Record> T readRecord(Class<T> recordType, ResultSet resultSet) {
        try {
            RecordComponent[] components = recordType.getRecordComponents();
            Constructor<T> constructor = recordType.getConstructor(Arrays.stream(components).map(RecordComponent::getType).toArray(Class<?>[]::new));
            List<String> columnNames = Arrays.stream(components)
                .map(component -> {
                    ColumnName columnName = component.getAnnotation(ColumnName.class);
                    if (columnName != null && !Objects.equals(columnName.value(), "")) {
                        return columnName.value();
                    } else {
                        return component.getName();
                    }
                })
                .toList();
            return constructor.newInstance(
                IntStream.range(0, components.length)
                    .mapToObj(idx -> {
                        Nullable nullable = components[idx].getAnnotation(Nullable.class);
                        try {
                            return readObject(resultSet, columnNames.get(idx), components[idx].getType(), nullable != null);
                        } catch (SQLException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .toArray()
            );
        } catch (NoSuchMethodException | InvocationTargetException | InstantiationException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }
}

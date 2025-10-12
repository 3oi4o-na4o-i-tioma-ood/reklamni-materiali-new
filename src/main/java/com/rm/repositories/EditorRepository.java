package com.rm.repositories;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.rm.models.design.Design;
import com.rm.models.design.DesignSide;
import com.rm.models.design.Element;
import com.rm.models.design.ImageElement;
import com.rm.models.design.TextElement;
import com.rm.models.prices.NoteType;
import com.rm.models.prices.PrintType;
import com.rm.models.prices.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EditorRepository extends JpaRepository<Design.Raw, String> {
    default Design.Raw findDesignById(String id) {
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM Designs WHERE id = ?");
            statement.setString(1, id);
            ResultSet resultSet = statement.executeQuery();
            if (!resultSet.next()) {
                return null;
            }
            Design.Raw design = new Design.Raw();
            design.id = id;
            design.productType = ProductType.valueOf(resultSet.getString("product_type"));
            design.front = findSideById(resultSet.getObject("front_side_id", Long.class));
            design.back = findSideById(resultSet.getObject("back_side_id", Long.class));

            String printType = resultSet.getString("print_type");
            design.printType = printType == null ? null : PrintType.valueOf(printType);

            design.modelColorId = resultSet.getObject("model_color_id", Long.class);
            design.effects = findEffects(id);
            design.isFavorite = resultSet.getBoolean("is_favorite");
            design.name = resultSet.getString("name");

            return design;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    default List<Design.Raw> findUserFavoriteDesigns(Long userId) {
        // TO DO: move the credentials out
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection
                    .prepareStatement("SELECT * FROM Designs WHERE user_id = ? AND is_favorite = true");
            statement.setLong(1, userId);
            ResultSet resultSet = statement.executeQuery();

            List<Design.Raw> designs = new ArrayList<>();

            while (resultSet.next()) {
                Design.Raw design = new Design.Raw();
                design.id = resultSet.getString("id");
                design.productType = ProductType.valueOf(resultSet.getString("product_type"));
                design.front = findSideById(resultSet.getObject("front_side_id", Long.class));
                design.back = findSideById(resultSet.getObject("back_side_id", Long.class));

                String printType = resultSet.getString("print_type");
                design.printType = printType == null ? null : PrintType.valueOf(printType);

                design.modelColorId = resultSet.getObject("model_color_id", Long.class);
                design.effects = findEffects(design.id);
                design.isFavorite = resultSet.getBoolean("is_favorite");
                design.name = resultSet.getString("name");

                designs.add(design);
            }

            return designs;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    default Map<NoteType, Long> findEffects(String designId) {
        // TO DO: Move the credentials out
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection
                    .prepareStatement("SELECT * FROM Design_Effects WHERE design_id = ?");
            statement.setString(1, designId);
            ResultSet resultSet = statement.executeQuery();
            Map<NoteType, Long> effects = new HashMap<>();
            while (resultSet.next()) {
                effects.put(NoteType.valueOf(resultSet.getString("effect")), resultSet.getLong("value"));
            }

            return effects;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    default void updateEffects(String designId, Map<NoteType, Long> effects) {
        // TO DO: Move the credentials out
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection
                    .prepareStatement("DELETE FROM Design_Effects WHERE design_id = ?");
            statement.setString(1, designId);
            statement.executeUpdate();

            if(effects.size() == 0) {
                return;
            }

            PreparedStatement insertStatement = connection.prepareStatement("""
                    INSERT INTO Design_Effects (
                        design_id,
                        effect,
                        value
                    ) VALUES
                    """ + IntStream.range(0, effects.size())
                    .mapToObj(i -> "(?, ?, ?)").collect(Collectors.joining(",\n")));
            System.out.println("Effects total: " + effects.size());

            Integer index = 0;
            for (Map.Entry<NoteType, Long> entry : effects.entrySet()) {
                insertStatement.setString(index * 3 + 1, designId);
                insertStatement.setString(index * 3 + 2, entry.getKey().name());
                insertStatement.setLong(index * 3 + 3, entry.getValue());
                System.out.println("Add values for index: " + index);
                System.out.println(insertStatement);

                index++;
            }
            
            insertStatement.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    default DesignSide.Raw findSideById(Long sideId) {
        if (sideId == null) {
            return null;
        }

        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM Design_Sides WHERE id = ?");
            statement.setLong(1, sideId);
            ResultSet resultSet = statement.executeQuery();
            if (!resultSet.next()) {
                return null;
            }

            DesignSide.Raw side = new DesignSide.Raw();
            side.id = resultSet.getLong("id");
            side.bgPath = resultSet.getString("bg_path");
            side.bgImageId = resultSet.getString("bg_image_id");
            side.elements = findElements(side);

            return side;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    default List<Element.Raw> findElements(DesignSide.Raw side) {
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection
                    .prepareStatement("SELECT * FROM Elements WHERE design_side_id = ?");
            statement.setLong(1, side.id);
            ResultSet resultSet = statement.executeQuery();
            List<Element.Raw> elements = new ArrayList<>();
            ObjectReader deserializer = new ObjectMapper().reader();
            while (resultSet.next()) {
                Element.Raw element = switch (resultSet.getString("type")) {
                    case "image" -> new Element.ImageRaw();
                    case "text" -> new Element.TextRaw();
                    default -> throw new IllegalStateException("Unknown element type");
                };
                element.id = resultSet.getLong("id");
                element.type = resultSet.getString("type");
                element.position = deserializer.readValue(resultSet.getString("position"), Element.Position.class);
                element.size = deserializer.readValue(resultSet.getString("size"), Element.Size.class);
                element.fieldName = resultSet.getString("field_name");
                element.designSide = side;
                switch (element) {
                    case Element.TextRaw text -> {
                        text.text = resultSet.getString("text");
                        text.bold = resultSet.getBoolean("bold");
                        text.italic = resultSet.getBoolean("italic");
                        text.underline = resultSet.getBoolean("underline");
                        text.fontFamily = resultSet.getString("font_family");
                        text.fontSize = resultSet.getDouble("font_size");
                        text.color = resultSet.getString("color");
                        String alignment = resultSet.getString("alignment");

                        text.alignment = TextElement.Alignment.valueOf(alignment == null ? "CENTER" : alignment);
                        text.hasChanged = resultSet.getBoolean("has_changed");
                    }
                    case Element.ImageRaw image -> {
                        image.name = resultSet.getString("name");
                    }
                    default -> throw new IllegalStateException("Unknown element type");
                }

                elements.add(element);
            }
            return elements;
        } catch (SQLException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    default void saveElements(List<Element> elements, long sideId) {
        if (elements.isEmpty()) {
            return;
        }

        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection.prepareStatement("""
                    INSERT INTO Elements (
                        position, size, design_side_id, type,
                        name,
                        text, bold, italic, underline, font_family, font_size, color, alignment, field_name, has_changed
                    ) VALUES
                    """ + IntStream.range(0, elements.size())
                    .mapToObj(i -> "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").collect(Collectors.joining(",\n")));
            IntStream.range(0, elements.size()).forEach(idx -> {
                try {
                    switch (elements.get(idx)) {
                        case TextElement elem -> {
                            statement.setString(idx * 15 + 1,
                                    new JsonMapper().writer().writeValueAsString(elem.position()));
                            statement.setString(idx * 15 + 2,
                                    new JsonMapper().writer().writeValueAsString(elem.size()));
                            statement.setLong(idx * 15 + 3, sideId);
                            statement.setString(idx * 15 + 4, "text");
                            statement.setString(idx * 15 + 5, null);
                            statement.setString(idx * 15 + 6, elem.text());
                            statement.setBoolean(idx * 15 + 7, elem.bold());
                            statement.setBoolean(idx * 15 + 8, elem.italic());
                            statement.setBoolean(idx * 15 + 9, elem.underline());
                            statement.setString(idx * 15 + 10, elem.fontFamily());
                            statement.setDouble(idx * 15 + 11, elem.fontSize());
                            statement.setString(idx * 15 + 12, elem.color());
                            statement.setString(idx * 15 + 13, elem.alignment().name());
                            statement.setString(idx * 15 + 14, elem.fieldName());
                            statement.setBoolean(idx * 15 + 15, elem.hasChanged());
                        }
                        case ImageElement elem -> {
                            statement.setString(idx * 15 + 1,
                                    new JsonMapper().writer().writeValueAsString(elem.position()));
                            statement.setString(idx * 15 + 2,
                                    new JsonMapper().writer().writeValueAsString(elem.size()));
                            statement.setLong(idx * 15 + 3, sideId);
                            statement.setString(idx * 15 + 4, "image");
                            statement.setString(idx * 15 + 5, elem.name());
                            statement.setString(idx * 15 + 6, null);
                            statement.setObject(idx * 15 + 7, null);
                            statement.setObject(idx * 15 + 8, null);
                            statement.setObject(idx * 15 + 9, null);
                            statement.setString(idx * 15 + 10, null);
                            statement.setObject(idx * 15 + 11, null);
                            statement.setString(idx * 15 + 12, null);
                            statement.setString(idx * 15 + 13, null);
                            statement.setString(idx * 15 + 14, elem.fieldName());
                            statement.setObject(idx * 15 + 15, null);
                        }
                    }

                } catch (JsonProcessingException | SQLException e) {
                    System.out.println(e);
                }
            });
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    default void updateElements(List<Element> elements) {
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection.prepareStatement("""
                    UPDATE Elements SET
                        position = ?,
                        size = ?,
                        name = ?,
                        text = ?,
                        bold = ?,
                        italic = ?,
                        underline = ?,
                        font_family = ?,
                        font_size = ?,
                        color = ?,
                        alignment = ?,
                        field_name = ?,
                        has_changed = ?
                    WHERE id = ?
                    """);
            IntStream.range(0, elements.size()).forEach(idx -> {
                try {
                    switch (elements.get(idx)) {
                        case TextElement elem -> {
                            statement.setString(1, new JsonMapper().writer().writeValueAsString(elem.position()));
                            statement.setString(2, new JsonMapper().writer().writeValueAsString(elem.size()));
                            statement.setString(3, null);
                            statement.setString(4, elem.text());
                            statement.setBoolean(5, elem.bold());
                            statement.setBoolean(6, elem.italic());
                            statement.setBoolean(7, elem.underline());
                            statement.setString(8, elem.fontFamily());
                            statement.setDouble(9, elem.fontSize());
                            statement.setString(10, elem.color());
                            statement.setString(11, elem.alignment().name());
                            statement.setString(12, elem.fieldName());
                            statement.setBoolean(13, elem.hasChanged());
                            statement.setLong(14, elem.id());
                        }
                        case ImageElement elem -> {
                            statement.setString(1, new JsonMapper().writer().writeValueAsString(elem.position()));
                            statement.setString(2, new JsonMapper().writer().writeValueAsString(elem.size()));
                            statement.setString(3, elem.name());
                            statement.setString(4, null);
                            statement.setObject(5, null);
                            statement.setObject(6, null);
                            statement.setObject(7, null);
                            statement.setString(8, null);
                            statement.setObject(9, null);
                            statement.setString(10, null);
                            statement.setString(11, null);
                            statement.setString(12, null);
                            statement.setObject(13, null);
                            statement.setLong(14, elem.id());
                        }
                    }
                    statement.executeUpdate();
                } catch (JsonProcessingException | SQLException e) {
                }
            });
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    default void deleteElement(Element.Raw raw) {
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection.prepareStatement("DELETE FROM Elements WHERE id = ?");
            statement.setLong(1, raw.id);
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    default void update(Design.Raw designRaw) {
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            if (designRaw.back != null && designRaw.back.id == 0) {
                designRaw.back.id = createDesignSide(designRaw.back);
            }
            PreparedStatement statement = connection.prepareStatement("""
                    UPDATE Designs SET
                        back_side_id = ?,
                        print_type = ?,
                        model_color_id = ?,
                        is_favorite = ?,
                        name = ?
                    WHERE id = ?
                    """);

            statement.setObject(1, designRaw.back == null ? null : designRaw.back.id);
            statement.setString(2, designRaw.printType == null ? null : designRaw.printType.name());
            statement.setObject(3, designRaw.modelColorId == null ? null : designRaw.modelColorId);
            statement.setBoolean(4, designRaw.isFavorite);
            statement.setString(5, designRaw.name);
            statement.setString(6, designRaw.id);
            statement.executeUpdate();

            updateSide(designRaw.front);
            if (designRaw.back != null) {
                updateSide(designRaw.back);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    default long createDesignSide(DesignSide.Raw side) {
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection.prepareStatement("""
                    INSERT INTO Design_Sides (bg_path, bg_image_id)
                    VALUES (?, ?)
                    RETURNING id
                    """);
            statement.setString(1, side.bgPath);
            statement.setString(2, side.bgImageId);
            ResultSet resultSet = statement.executeQuery();
            if (!resultSet.next()) {
                throw new IllegalStateException("Could not create side");
            }
            return resultSet.getLong(1);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    default void updateSide(DesignSide.Raw side) {
        try (Connection connection = DriverManager
                .getConnection("jdbc:postgresql://localhost:5432/reklamni_materiali_db", "postgres", "1111")) {
            PreparedStatement statement = connection.prepareStatement("""
                    UPDATE Design_Sides SET
                        bg_path = ?,
                        bg_image_id = ?
                    WHERE id = ?
                    """);
            statement.setObject(1, side.bgPath);
            statement.setObject(2, side.bgImageId);
            statement.setLong(3, side.id);
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
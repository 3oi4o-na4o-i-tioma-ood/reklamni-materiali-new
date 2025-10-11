package com.rm.controllers;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.GraphicsEnvironment;
import java.awt.Graphics2D;
import java.awt.Insets;
import java.awt.RenderingHints;
import java.awt.color.ColorSpace;
import java.awt.font.TextAttribute;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.swing.JTextPane;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;
import javax.swing.text.StyledDocument;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rm.apis.EditorApi;
import com.rm.exceptions.BadRequestException;
import com.rm.exceptions.NotFoundException;
import com.rm.models.prices.ProductType;
import com.rm.repositories.EditorRepository;
import com.rm.models.design.BackgroundSelection;
import com.rm.models.design.Design;
import com.rm.models.design.DesignSide;
import com.rm.models.design.ImageElement;
import com.rm.models.design.Element;
import com.rm.models.design.TextElement;
import com.rm.util.ColorUtils;
import com.rm.util.JWTManager;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class EditorController implements EditorApi {
    @Value("${paths.images}")
    private String imagesFolderPath;

    @Value("${paths.designs}")
    private String previewFolderPath;

    @Value("${paths.designs}")
    private String designsFolderPath;

    @Value("${paths.categories}")
    private String categoriesDirectory;

    private final CategoriesController categoriesController;
    private final EditorRepository editorRepository;

    @Autowired
    public EditorController(CategoriesController categoriesController, EditorRepository editorRepository) {
        this.categoriesController = categoriesController;
        this.editorRepository = editorRepository;
    }

    // @Override
    // public String uploadBackground(MultipartFile file, BackgroundSelection
    // selection) throws IOException {
    // UUID backgroundUuid = UUID.randomUUID();
    // BufferedImage image = ImageIO.read(new
    // ByteArrayInputStream(file.getBytes()));
    // BufferedImage cut = image.getSubimage(selection.x(), selection.y(),
    // selection.width(), selection.height());
    // ImageIO.write(cut, "png", Path.of(backgroundsFolderPath, backgroundUuid +
    // ".png").toFile());
    // return backgroundUuid.toString();
    // }

    @Override
    public Resource getBackground(String filename, ProductType product, String path) {
        Resource resource;
        if (filename != null) {
            resource = new FileSystemResource(Path.of(imagesFolderPath, filename + ".png"));
        } else {
            resource = new FileSystemResource(
                    Path.of(categoriesDirectory, product.name().toLowerCase(), path).toFile());
        }

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            return null;
        }
    }

    @Override
    public String uploadImage(MultipartFile file, String selectionJSON) throws IOException {
        UUID imageName = UUID.randomUUID();
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        if (selectionJSON != null) {
            ObjectMapper objectMapper = new ObjectMapper();
            BackgroundSelection selection = objectMapper.readValue(selectionJSON, BackgroundSelection.class);
            if (selection != null) {
                image = image.getSubimage(selection.x(), selection.y(), selection.width(), selection.height());
            }
        }

        ImageIO.write(image, "png", Path.of(imagesFolderPath, imageName + ".png").toFile());
        return imageName.toString();
    }

    @Override
    public void updateImage(String imageId, String selectionJSON) throws IOException {
        BufferedImage image = ImageIO.read(Path.of(imagesFolderPath, imageId + ".png").toFile());
        if (selectionJSON != null) {
            ObjectMapper objectMapper = new ObjectMapper();
            BackgroundSelection selection = objectMapper.readValue(selectionJSON, BackgroundSelection.class);
            if (selection != null) {
                image = image.getSubimage(selection.x(), selection.y(), selection.width(), selection.height());
            }
        }

        ImageIO.write(image, "png", Path.of(imagesFolderPath, imageId + ".png").toFile());
    }

    @Override
    public Resource getImage(String name) {
        Resource resource = new FileSystemResource(Path.of(imagesFolderPath, name + ".png"));
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            return null;
        }
    }

    @Override
    public Resource getPreviewImage(String name, String side) {
        if (!Objects.equals(side, "front") && !Objects.equals(side, "back")) {
            throw new BadRequestException();
        }

        Resource resource = new FileSystemResource(Path.of(designsFolderPath, name + "_" + side + ".png"));
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            return null;
        }
    }

    @Override
    public String createDesign(Design design, String authorization) throws IOException {
        UUID designUuid = UUID.randomUUID();
        Design.Raw designRaw = new Design.Raw(design);

        if (authorization != null) {
            designRaw.userId = JWTManager.decodeClaim(authorization.substring(7), "id", Long.class);
        }

        designRaw.id = designUuid.toString();
        Design.Raw savedDesign = editorRepository.save(designRaw);

        generateImageFromDesign(design.front(), savedDesign.modelColorId, savedDesign.productType,
                Path.of(designsFolderPath, designUuid + "_front.png"));
        editorRepository.saveElements(design.front().elements(), savedDesign.front.id);
        if (savedDesign.back != null) {
            generateImageFromDesign(design.back(), savedDesign.modelColorId, savedDesign.productType,
                    Path.of(designsFolderPath, designUuid + "_back.png"));
            editorRepository.saveElements(design.back().elements(), savedDesign.back.id);
        }

        return designUuid.toString();
    }

    @Override
    public void updateDesign(Design design) throws IOException {
        if (design.id() == null) {
            throw new BadRequestException();
        }

        Design.Raw designRaw = new Design.Raw(design);
        System.out.println(new ObjectMapper().writer().writeValueAsString(designRaw));
        editorRepository.update(designRaw); // TODO: delete back side if needed

        generateImageFromDesign(design.front(), designRaw.modelColorId, design.productType(),
                Path.of(designsFolderPath, design.id() + "_front.png"));
        editorRepository.findElements(new DesignSide.Raw(design.front())).stream()
                .filter(elem -> design.front().elements().stream().noneMatch(e -> Objects.equals(e.id(), elem.id)))
                .forEach(editorRepository::deleteElement);
        editorRepository.saveElements(design.front().elements().stream().filter(elem -> elem.id() == null).toList(),
                design.front().id());
        editorRepository.updateElements(design.front().elements().stream().filter(elem -> elem.id() != null).toList());
        if (design.back() != null) {
            generateImageFromDesign(design.back(), designRaw.modelColorId, design.productType(),
                    Path.of(designsFolderPath, design.id() + "_back.png"));
            editorRepository.findElements(new DesignSide.Raw(design.back())).stream()
                    .filter(elem -> design.back().elements().stream().noneMatch(e -> Objects.equals(e.id(), elem.id)))
                    .forEach(editorRepository::deleteElement);
            editorRepository.saveElements(design.back().elements().stream().filter(elem -> elem.id() == null).toList(),
                    design.back().id());
            editorRepository
                    .updateElements(design.back().elements().stream().filter(elem -> elem.id() != null).toList());
        }

        editorRepository.updateEffects(design.id(), design.effects());
    }

    @Override
    public Resource getDesignPdf(ProductType product, String designId, boolean isFront) {
        Path designPath = Path.of(designsFolderPath, designId + "_" + (isFront ? "front" : "back") + ".png");

        try (PDDocument pdf = new PDDocument()) {
            pdf.getDocumentInformation().setCreator("PDFBox");
            pdf.getDocumentCatalog().setAcroForm(new PDAcroForm(pdf));
            PDFont font = PDType0Font.load(pdf, EditorController.class.getResourceAsStream("/static/fonts/arial.ttf"),
                    false);
            COSName fontName = pdf.getDocumentCatalog().getAcroForm().getDefaultResources().add(font);

            PDFDimensions dimensions = DIMENSION_INFO.get(product);
            PDPage page = new PDPage(new PDRectangle(dimensions.width, dimensions.height));
            try (PDPageContentStream contentStream = new PDPageContentStream(pdf, page,
                    PDPageContentStream.AppendMode.APPEND, true, true)) {
                contentStream.beginText();
                contentStream.setFont(pdf.getDocumentCatalog().getAcroForm().getDefaultResources().getFont(fontName),
                        10);
                contentStream.newLineAtOffset(0, 0);
                // TODO: models
                contentStream.showText(switch (product) {
                    case BUSINESS_CARD -> "ВИЗИТКИ";
                    case WORK_CALENDAR -> "КАЛЕНДАР {МОДЕЛ}";
                    case POCKET_CALENDAR -> "ДЖОБНИ КАЛЕНДАРЧЕТА";
                    case FLIER_10x15 -> "ФЛАЕРИ 10Х15";
                    case FLIER_10x20 -> "ФЛАЕРИ 10Х20";
                    case PEN -> "ХИМИКАЛКА {МОДЕЛ}";
                    case LIGHTER -> "ЗАПАЛКА {МОДЕЛ}";
                } + (isFront ? " - лице" : " - гръб"));
                contentStream.endText();

                PDImageXObject image = PDImageXObject.createFromFile(designPath.toString(), pdf);
                switch (product) {
                    case BUSINESS_CARD, POCKET_CALENDAR ->
                        drawImage(product, contentStream, image, 6, 3, dimensions.topMargin, dimensions.leftMargin);
                    case FLIER_10x15, FLIER_10x20 ->
                        drawImage(product, contentStream, image, 2, 3, dimensions.topMargin, dimensions.leftMargin);
                    case PEN, LIGHTER, WORK_CALENDAR ->
                        drawImage(product, contentStream, image, 1, 1, dimensions.topMargin, dimensions.leftMargin);
                }
            }

            pdf.addPage(page);

            ByteArrayOutputStream pdfBytes = new ByteArrayOutputStream();
            pdf.save(pdfBytes);
            Resource resource = new ByteArrayResource(pdfBytes.toByteArray());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                return null;
            }
        } catch (IOException e) {
            return null;
        }
    }

    private void drawImage(ProductType product, PDPageContentStream contentStream, PDImageXObject image, int rows,
            int cols, float topMargin, float leftMargin) throws IOException {
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                contentStream.drawImage(image, leftMargin + col * product.imageMMWidth(),
                        topMargin + row * product.imageMMHeight(), product.imageMMWidth(), product.imageMMHeight());
            }
        }
    }

    private void generateImageFromDesign(DesignSide side, Long modelColorId, ProductType product, Path savePath)
            throws IOException {
        BufferedImage image;
        if (side.bgPath() != null) {
            image = ImageIO.read(Path.of(categoriesDirectory, product.name().toLowerCase(), side.bgPath()).toFile());
        } else if (side.bgImageId() != null) {
            image = ImageIO.read(Path.of(imagesFolderPath, side.bgImageId() + ".png").toFile());
        } else if (modelColorId != null) {
            image = ImageIO.read(categoriesController.getModelImage(modelColorId).getFile());
        } else {
            image = new BufferedImage(product.imagePixelWidth(), product.imagePixelHeight(),
                    BufferedImage.TYPE_INT_RGB);
            Graphics2D graphics = image.createGraphics();
            graphics.setBackground(Color.WHITE);
            graphics.fillRect(0, 0, image.getWidth(), image.getHeight());
            graphics.dispose();
        }

        if (image.getColorModel().getColorSpace().getType() == ColorSpace.TYPE_CMYK) {
            image = ColorUtils.cmykToRgb(image);
        }

        Graphics2D graphics = image.createGraphics();
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);

        System.out.println("bg type=" + image.getType()
                + " cs=" + image.getColorModel().getColorSpace().getType()
                + " model=" + image.getColorModel().toString());

        List<Element> elementsToRender = side
                .elements()
                .stream()
                .sorted(Comparator.comparing(elem -> elem.getClass().getSimpleName()))
                .toList();
        for (Element element : elementsToRender) {
            switch (element) {
                case ImageElement(Long id, Element.Size size, Element.Position position, String name, String fieldName) ->
                    graphics.drawImage(
                            ImageIO.read(getImage(name).getInputStream()),
                            mmToPixels(position.x(), product, image.getWidth()),
                            mmToPixels(position.y(), product, image.getWidth()),
                            mmToPixels(size.w(), product, image.getWidth()),
                            mmToPixels(size.h(), product, image.getWidth()),
                            null);
                case TextElement(Long id, Element.Size size, Element.Position position, String text, boolean bold, boolean italic, boolean underline, String fontFamily, double fontSize, String color, TextElement.Alignment alignment, String fieldName, boolean hasChanged) -> {
                    if (!hasChanged) {
                        break;
                    }

                    System.out.println("fontFamily=" + fontFamily);

                    JTextPane pane = new JTextPane();
                    pane.setBounds(mmToPixels(position.x(), product, image.getWidth()),
                            mmToPixels(position.y(), product, image.getWidth()),
                            mmToPixels(size.w(), product, image.getWidth()), image.getHeight());
                    pane.setMargin(new Insets(0, 0, 0, 0));
                    Font baseFont = resolveFontFromResources(fontFamily);
                    if (baseFont == null) {
                        baseFont = new Font(fontFamily == null ? "Arial" : fontFamily, Font.PLAIN,
                                mmToPixels(fontSize, product, image.getWidth()));
                    } else {
                        baseFont = baseFont.deriveFont((float) mmToPixels(fontSize, product, image.getWidth()));
                    }

                    pane.setFont(baseFont.deriveFont(
                            Map.ofEntries(
                                    Map.entry(TextAttribute.WEIGHT,
                                            bold ? TextAttribute.WEIGHT_BOLD : TextAttribute.WEIGHT_REGULAR),
                                    Map.entry(TextAttribute.POSTURE,
                                            italic ? TextAttribute.POSTURE_OBLIQUE : TextAttribute.POSTURE_REGULAR),
                                    Map.entry(TextAttribute.UNDERLINE,
                                            underline ? TextAttribute.UNDERLINE_ON : -1),
                                    Map.entry(TextAttribute.FOREGROUND,
                                            color == null ? Color.BLACK : Color.decode(color)))));
                    pane.setForeground(color == null ? Color.BLACK : Color.decode(color));
                    pane.setBackground(new Color(0, 0, 0, 0));
                    pane.setText(breakLines(text, graphics.getFontMetrics(pane.getFont()), pane.getWidth()));
                    System.out.println(image.getWidth());
                    System.out.println(pane.getWidth());
                    System.out.println(pane.getFont().getSize2D());
                    System.out.println(color == null ? Color.BLACK : Color.decode(color));

                    StyledDocument alignmentDocument = pane.getStyledDocument();
                    SimpleAttributeSet alignmentAttribute = new SimpleAttributeSet();
                    StyleConstants.setAlignment(alignmentAttribute, alignment.styleConstantsAlignment());
                    alignmentDocument.setParagraphAttributes(0, text.length(), alignmentAttribute, false);

                    graphics.translate(pane.getX(), pane.getY());
                    pane.paint(graphics);
                    graphics.translate(-pane.getX(), -pane.getY());
                }
            }
        }

        ImageIO.write(image, "png", savePath.toFile());
    }

    private static final Map<String, String> FONT_FILES = Map.ofEntries(
            Map.entry("Arial", "/static/fonts/arial.ttf"),
            Map.entry("Azbuka", "/static/fonts/azbuka02.ttf"),
            Map.entry("Azbuka Decorative", "/static/fonts/azbuka03_d.ttf"),
            Map.entry("Comic Sans MS", "/static/fonts/comic.ttf"),
            Map.entry("Courier New", "/static/fonts/cour.ttf"),
            Map.entry("Kovanovic 68", "/static/fonts/nk68.ttf"),
            Map.entry("Kovanovic 85", "/static/fonts/nk85.ttf"),
            Map.entry("Kovanovic 91", "/static/fonts/nk91.ttf"),
            Map.entry("Kovanovic 112", "/static/fonts/nk112.ttf"),
            Map.entry("Kovanovic 113", "/static/fonts/nk113.ttf"),
            Map.entry("Kovanovic 114", "/static/fonts/nk114.ttf"),
            Map.entry("Kovanovic 115", "/static/fonts/nk115.ttf"),
            Map.entry("Kovanovic 162", "/static/fonts/nk162.ttf"),
            Map.entry("Kovanovic 226", "/static/fonts/nk226.ttf"),
            Map.entry("Kovanovic 251", "/static/fonts/nk251.ttf"),
            Map.entry("Kovanovic 254", "/static/fonts/nk254.ttf"),
            Map.entry("Kovanovic 257", "/static/fonts/nk257.ttf"),
            Map.entry("Kovanovic 510", "/static/fonts/nk510.ttf"),
            Map.entry("Old Cyrillic", "/static/fonts/nkcirpp.ttf"),
            Map.entry("Shadow", "/static/fonts/senka.ttf"),
            Map.entry("Times New Roman", "/static/fonts/times.ttf"),
            Map.entry("Verdana", "/static/fonts/verdana.ttf"));

    private static Font resolveFontFromResources(String fontFamily) {
        String path = FONT_FILES.get(fontFamily);
        if (path == null) {
            return null;
        }
        try (InputStream is = EditorController.class.getResourceAsStream(path)) {
            if (is == null) {
                return null;
            }
            Font created = Font.createFont(Font.TRUETYPE_FONT, is);
            try {
                GraphicsEnvironment.getLocalGraphicsEnvironment().registerFont(created);
            } catch (Exception ignored) {
            }
            return created;
        } catch (Exception e) {
            return null;
        }
    }

    public Design.Raw getDesign(String id) {

        if (id.equals("null")) {
            throw new BadRequestException("INVALID_ID");
        }

        Design.Raw design = editorRepository.findDesignById(id);
        if (design == null) {
            throw new NotFoundException();
        }
        return design;
    }

    @Override
    public List<Design.Raw> getFavoriteDesigns(@RequestHeader("Authorization") String authorization) {
        try {
            return editorRepository
                    .findUserFavoriteDesigns(JWTManager.decodeClaim(authorization.substring(7), "id", Long.class));
        } catch (Exception e) {
            System.out.println(e);
            return null;
        }
    }

    private static int mmToPixels(double mm, ProductType product, int imagePixelWidth) {
        double scale = product.imageMMWidth() / (double) imagePixelWidth;

        return (int) (mm / scale);
        // return (int) (mm * product.dpi() / 25.4);
    }

    private static String breakLines(String text, FontMetrics fontMetrics, int width) {
        StringBuilder result = new StringBuilder();
        StringBuilder current = new StringBuilder();
        int breakableIdx = -1;

        for (char c : text.toCharArray()) {
            if (Character.isWhitespace(c)) {
                breakableIdx = current.length();
            }
            current.append(c);

            if (fontMetrics.stringWidth(current.toString()) > width) {
                if (breakableIdx != -1) {
                    result.append(current, 0, breakableIdx).append("\n");
                    current.delete(0, breakableIdx + 1);
                } else {
                    result.append(current, 0, current.length() - 1).append("\n");
                    current.delete(0, current.length() - 1);
                }
                breakableIdx = -1;
            }
        }
        if (!current.isEmpty()) {
            result.append(current);
        }

        return result.toString();
    }

    private record PDFDimensions(int width, int height, float topMargin, float leftMargin, String orientation) {
    }

    private static final Map<ProductType, PDFDimensions> DIMENSION_INFO = Map.ofEntries(
            Map.entry(ProductType.BUSINESS_CARD, new PDFDimensions(311, 346, 11f, 14.5f, "P")),
            Map.entry(ProductType.WORK_CALENDAR, new PDFDimensions(311, 346, 5f, 14.5f, "P")),
            Map.entry(ProductType.POCKET_CALENDAR, new PDFDimensions(220, 110, 0f, 0f, "L")),
            Map.entry(ProductType.FLIER_10x15, new PDFDimensions(311, 418, 5f, 4f, "P")),
            Map.entry(ProductType.FLIER_10x20, new PDFDimensions(311, 212, 5f, 4f, "L")),
            Map.entry(ProductType.PEN, new PDFDimensions(210, 297, 1.5f, 10f, "P")),
            Map.entry(ProductType.LIGHTER, new PDFDimensions(210, 297, 1.5f, 10f, "P")));
}
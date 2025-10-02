package com.rm.util;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;

public class ColorUtils {
    private ColorUtils() {}

    public static BufferedImage cmykToRgb(BufferedImage image) {
        byte[] buffer = ((DataBufferByte) image.getRaster().getDataBuffer()).getData();
        int pixelCount = buffer.length;
        byte[] new_data = new byte[pixelCount / 4 * 3];
        float lastC = -1, lastM = -1, lastY = -1, lastK = -1;
        float C, M, Y, K;
        float[] rgb = new float[3];
        // loop through each pixel changing CMYK values to RGB
        int pixelReached = 0;

        for (int i = 0; i < pixelCount; i += 4) {
            C = (buffer[i] & 0xff) / 255f;
            M = (buffer[i + 1] & 0xff) / 255f;
            Y = (buffer[i + 2] & 0xff) / 255f;
            K = (buffer[i + 3] & 0xff) / 255f;
            if (lastC == C && lastM == M && lastY == Y && lastK == K) {
                // use existing values if not changed
            } else { // work out new
                rgb[0] = (1 - C) * (1 - K);
                rgb[1] = (1 - M) * (1 - K);
                rgb[2] = (1 - Y) * (1 - K);

                // cache values
                lastC = C;
                lastM = M;
                lastY = Y;
                lastK = K;
            }
            new_data[pixelReached++] = (byte) (rgb[0] * 255);
            new_data[pixelReached++] = (byte) (rgb[1] * 255);
            new_data[pixelReached++] = (byte) (rgb[2] * 255);
        }

        BufferedImage rgbImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);

        for (int y = 0; y < image.getHeight(); y++)
            for (int x = 0; x < image.getWidth(); x++) {
                int pos = (y * image.getWidth() + x) * 3;
                rgbImage.getRaster().setSample(x, y, 0, new_data[pos] & 0xFF);
                rgbImage.getRaster().setSample(x, y, 1, new_data[pos + 1] & 0xFF);
                rgbImage.getRaster().setSample(x, y, 2, new_data[pos + 2] & 0xFF);
            }

        return rgbImage;
    }
}

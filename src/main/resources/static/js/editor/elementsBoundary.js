const elementsBoundary = {
    getBoundaryInMM(currentProduct, isBackSide = false) {
        switch (currentProduct) {
          case "BUSINESS_CARD":
          case "POCKET_CALENDAR": {
            if(isBackSide) {
              return {
                left: 6,
                right: 6,
                top: 29,
                bottom: 16,
              };
            }
    
            return {
              left: 7,
              right: 7,
              top: 7,
              bottom: 7,
            };
          }
          case "PEN": {
            return {
              left: 30,
              right: 20,
              top: 13,
              bottom: 13,
            };
          }
          case "LIGHTER": {
            return {
              left: 20,
              right: 35,
              top: 8,
              bottom: 8,
            };
          }
          default: {
            return {
              left: 7,
              right: 7,
              top: 7,
              bottom: 7,
            };
          }
        }
      },
      getBoundaryInPx(currentProduct, canvasPxPerProductMM, isBackSide = false) {
        const inMM = elementsBoundary.getBoundaryInMM(currentProduct, isBackSide);
    
        return {
          left: inMM.left * canvasPxPerProductMM,
          right: inMM.right * canvasPxPerProductMM,
          top: inMM.top * canvasPxPerProductMM,
          bottom: inMM.bottom * canvasPxPerProductMM,
        };
      },
}
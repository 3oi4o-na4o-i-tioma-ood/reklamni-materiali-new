const pricesCalculation = {
    _pricesCache: new Map(),
    _effectsCache: new Map(),
    _effectPapersCache: null,
    _generateCacheId(productType, modelColorId) {
        return JSON.stringify({
            productType, modelColorId
        })
    },
    _generateEffetcsCacheId(productType) {
        return productType
    },
    async getPrices(productType, modelColorId) {
        console.log("pricesCalculation.getPrices: ", productType, modelColorId)
        const cacheId = pricesCalculation._generateCacheId(productType, modelColorId)
        const cached = pricesCalculation._pricesCache.get(cacheId)
        if (cached) {
            return cached
        }

        const fetchedPromise = API.getPrices(productType, modelColorId)
        pricesCalculation._pricesCache.set(cacheId, fetchedPromise)
        return fetchedPromise
    },
    async getCartItemPrice({ productType, modelColorId, printType, amount, effects }) {
        const {priceAmounts, modelPrice} = await pricesCalculation.getCartItemAmountsPrices(productType, modelColorId, printType)
        const basePriceMaybeSingle = priceAmounts.find(amountOption => amountOption.amount === amount)?.price

        let basePrice
        if (["PEN", "LIGHTER"].includes(productType)) {
            basePrice = basePriceMaybeSingle * amount
        }
        else {
            basePrice = basePriceMaybeSingle
        }

        const effectsOverhead = await pricesCalculation.getEffectsOverhead(effects, productType, amount)

        return basePrice + effectsOverhead
    },
    async getEffectPaperPrice(effectPaperId) {
        const effectPaperPrices = await pricesCalculation.getEffectPapersPrices()
        return effectPaperPrices.find(price => price.id === effectPaperId)?.price || 0
    },
    async getEffectsOverhead(effects, productType, amount) {
        const effectsPrices = await pricesCalculation.getEffectsPrices(productType)

        const effectMultiplier = amount / 100

        const effectsOverhead = Object
            .entries(effects)
            .filter(([effectName, effectValue]) => effectName !== "EFFECT_CARTON" && effectValue)
            .map(([effectName]) => {
                const effectNote = effectsPrices.find(note => note.noteType === effectName)
                return effectNote?.price * effectMultiplier || 0
            })
            .reduce((sum, effectPrice) => sum + effectPrice, 0)

        const effectPaper = effects.EFFECT_CARTON
        const effectPaperPrice = await pricesCalculation.getEffectPaperPrice(effectPaper) * effectMultiplier

        return effectsOverhead + effectPaperPrice
    },
    getProductionTimeCoefficient(productionTime) {
        switch (productionTime) {
            case "NORMAL": return 1;
            case "FAST": return 1.5;
            case "EXPRESS": return 2;
        }
    },
    formatPrice(price) {
        price = Number(price)
        if (isNaN(price)) {
            console.log("Invalid price")
            return "?"
        }
        return price.toFixed(2) + " лв."
    },
    async getEffectsPrices(productType) {
        const cacheId = pricesCalculation._generateEffetcsCacheId(productType)
        const cached = pricesCalculation._effectsCache.get(cacheId)
        if (cached) {
            return cached
        }

        const fetchedPromise = API.getEffectsPrices(productType)
        pricesCalculation._effectsCache.set(cacheId, fetchedPromise)
        return fetchedPromise
    },
    async getEffectPapersPrices() {
        if (pricesCalculation._effectPapersCache) {
            return pricesCalculation._effectPapersCache
        }

        const fetchedPromise = API.getEffectPapersPrices()
        pricesCalculation._effectPapersCache = fetchedPromise
        return fetchedPromise
    },
    async getCartItemAmountsPrices(productType, modelColorId, printType) {
        const prices = await pricesCalculation.getPrices(productType, modelColorId)

        let priceAmounts
        if (!printType) {
            priceAmounts = prices.printPrices[0]?.amounts
        }
        else {
            priceAmounts = prices.printPrices?.find(price => price.printType === printType)?.amounts
        }

        console.log("priceAmounts: ", priceAmounts, "prices: ", prices, "printType:", printType)

        return {
            modelPrice: prices.modelPrice,
            priceAmounts
        }
    }
}
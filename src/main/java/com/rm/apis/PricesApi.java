package com.rm.apis;

import java.util.List;

import com.rm.models.prices.ModelPriceInfo;
import com.rm.models.prices.Note;
import com.rm.models.prices.ProductType;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.rm.models.EffectCarton;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Tag(name = "Prices")
public interface PricesApi {
    @Operation(summary = "Get product prices for model")
    @GetMapping("/api/prices")
    @ResponseBody
    ModelPriceInfo getPricesForAmounts(@RequestParam("product") ProductType productType,
                                       @RequestParam(value = "modelColorId", required = false) Long modelColorId);

    @Operation(summary = "Get effect prices")
    @GetMapping("/api/prices/effects")
    @ResponseBody
    List<Note> getEffectPrices(@RequestParam("product") ProductType product);

    @Operation(summary = "Get effect cartons")
    @GetMapping("/api/prices/effect-cartons")
    @ResponseBody
    List<EffectCarton> getEffectCartons();
}

function newEffectsTool({
    baseInputId,
    onChange
}) {

    // LAMINATION: "LAMINATION",
    // LAMINATION_MAT: "LAMINATION_MAT",
    // LAMINATION_GLOSSY: "LAMINATION_GLOSSY",
    // ROUNDED_CORNERS: "ROUNDED_CORNERS",
    // EFFECT_CARTON: "EFFECT_CARTON",
    // PARTIAL_VARNISH: "PARTIAL_VARNISH",

    const allEffects = [
        {
            name: "LAMINATION"
        },
        {
            name: "LAMINATION_MAT"
        },
        {
            name: "LAMINATION_GLOSSY"
        },
        {
            name: "ROUNDED_CORNERS"
        },
        // {
        //     id: "laminirane",
        //     name: "EFFECT_CARTON"
        // },
        {
            name: "PARTIAL_VARNISH"
        },
    ]

    function getEffectCheckbox(effectName) {
        return document.getElementById(`${baseInputId}-${effectName}`)
    }

    function getEffectsInputs() {

        return allEffects.map(effect => ({
            checkbox: getEffectCheckbox(effect.name),
            effect
        })).filter(effect => effect.checkbox)
    }

    const effectsTool = {
        update() {
            getEffectsInputs().map(effect => {
                effect.checkbox.checked = !!designRepo.effects[effect.effect.name]
            })
        },
        init() {
            const effects = getEffectsInputs()
            console.log("Init effects: ", baseInputId, effects)
    
            effectsTool.update()
    
            effects.map(effect => {
                effect.checkbox.addEventListener("change", async e => {
                    const value = e.target.checked ? 1 : 0
                    designRepo.effects[effect.effect.name] = value
                    console.log("Change: ", {
                        effect: effect.effect,
                        value
                    })
    
                    onChange?.({
                        effect: effect.effect,
                        value
                    })
                })
            })
        }
    }

    return effectsTool
}


const effectsTool = newEffectsTool({
    baseInputId: "effect-checkbox"
})

window.addEventListener("load", () => {
    effectsTool.init()
})
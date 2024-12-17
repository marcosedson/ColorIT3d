export const getObjectName = (key) => {
    const names = { obj1: "Cubo", obj2: "Esfera", obj3: "Cilindro" };
    return names[key] || "Objeto";
};

export const validateColors = (inputs) => {
    const errors = [];
    const isValidColor = (color) => {
        const s = new Option().style;
        s.color = color;
        return s.color !== "";
    };

    Object.entries(inputs).forEach(([key, value]) => {
        if (!value.trim()) {
            errors.push(`${getObjectName(key)}: campo vazio.`);
        } else if (!isValidColor(value)) {
            errors.push(`${getObjectName(key)}: '${value}' é inválido.`);
        }
    });

    return errors;
};

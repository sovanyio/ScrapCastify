const sanitizeToAlpha = string => {
    return [...string].reduce((out, char) => {
        const lowerChar = char.toLowerCase();
        
        if (lowerChar >= 'a' && lowerChar <= 'z') {
            out = `${out}${char}`
        }
        
        return out;
    }, '')
}

module.exports = {
    sanitizeToAlpha
}
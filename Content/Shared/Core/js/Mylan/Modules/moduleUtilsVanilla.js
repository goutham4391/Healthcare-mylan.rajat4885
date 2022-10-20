var util = (function () {
    function convertToBool(value) {
        return value.toLowerCase() === 'true';
    }

    function convertToInt(value) {
        return parseInt(value, 10);
    }

    function convertToNull(value) {
        return value === '' ? null : value;
    }

    return {
        convertToBool: convertToBool,
        convertToInt: convertToInt,
        convertToNull: convertToNull
    }
})();
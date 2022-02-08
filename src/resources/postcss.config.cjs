module.exports = () => {
    return {
        map: false,
        plugins: {
            "postcss-preset-env": {
                autoprefixer: {
                    grid: true
                }
            },
        }
    }
};
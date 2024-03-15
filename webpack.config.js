const path = require("path");


module.exports = {
    mode: "development",
    entry: {
        parameterization: './src/parameterization.ts',
        graph: './src/graph.ts'
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
}
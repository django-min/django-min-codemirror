const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const project_dst = path.resolve(__dirname, "../min_codemirror/static/min_codemirror/")
const project_src = path.resolve(__dirname, "../static_src/")
const project_copy = []


// webpack entry points -------------------------------------------------------

module.exports = [

    // project assets ---------------------------------------------------------
    {
        entry: {
            'widget': project_src + "/widget.js",
        },
        resolve: get_resolve(),
        output: get_output(project_dst),
        plugins: get_plugins(project_copy),
        module: {
            rules: [
                get_css_rule(),
                get_file_rule(project_src)
            ],
        },
    },
]


// DRY ------------------------------------------------------------------------

function get_css_rule() {
    return {
        // sass/scss compiler
        test: /\.scss$/i,
        use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
        ],
    }
}

function get_file_rule(source) {
    // file handler
    return {
        test: /\.(svg|png|jpg|gif|webp|eot|woff|woff2|ttf|otf|ico)$/,
        exclude: /node_modules/,
        use: {
            loader: 'file-loader',
            options: {
                context: source,
                name: '[path][name].[ext]'
            }
        }
    }
}

function get_output(destination) {
    return {
        path: destination,
        filename: "[name].js",
    }
}

function get_plugins(copy_patterns) {
    const plugins = [new MiniCssExtractPlugin()]
    if (copy_patterns && copy_patterns.length > 0) {
        plugins.push(new CopyPlugin({ patterns: copy_patterns }))
    }
    return plugins
}

function get_resolve() {
    const node_modules = path.resolve(__dirname, 'node_modules');
    return {
        // add custom  node_modules import path
        modules: [node_modules, 'node_modules'],
    }
}
// config-overrides.js
const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
    (config) => {
        // Tắt các thông báo ResizeObserver
        config.stats = "none"; // Hoặc "normal" nếu cần thông tin build cơ bản

        // Thêm đoạn mã này để tắt ResizeObserver warnings
        config.plugins.push(
            {
                apply: (compiler) => {
                    compiler.hooks.done.tap("done", (stats) => {
                        // Lọc các thông báo ResizeObserver
                        if (stats.compilation.warnings) {
                            stats.compilation.warnings = stats.compilation.warnings.filter(
                                (warning) => !warning.message.includes("ResizeObserver")
                            );
                        }
                    });
                }
            }
        );

        return config;
    }
);

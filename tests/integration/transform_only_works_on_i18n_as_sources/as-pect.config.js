module.exports = {
    include: ["index.ts", "**/*.spec.ts"],
    add: ["**/*.include.ts"],
    flags: {
        "--runtime": ["stub"],
        "--transform": [
            "@shopify/i18n-as/dist/transform.js",
        ]
    },
    disclude: [/node_modules/],
    imports: {},
    performance: {
        enabled: false,
        maxSamples: 10000,
        maxTestRunTime: 5000,
        reportMedian: true,
        reportAverage: true,
        reportStandardDeviation: false,
        reportMax: false,
        reportMin: false,
    },
    wasi: {
      args: [],
      env: process.env,
      preopens: {},
      returnOnExit: false,
    },
    outputBinary: false,
};

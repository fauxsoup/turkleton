export default function(api) {
    return {
        'presets': [
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'usage',
                    modules: false,
                    targets: {
                        esmodules: true,
                    }
                }
            ]
        ],
        'plugins': [
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
        ]
    };
}

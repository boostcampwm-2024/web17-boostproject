module.exports = {
    extends: ['@commitlint/config-conventional'],
    "parserPreset": {
        "parserOpts": {
            "headerPattern": "^(?<type>.+):\\s(?<subject>.+)$",
            "headerCorrespondence": ["type", "subject"]
        }
    },
    rules: {
        'type-enum': [
            2,
            'always',
            [
                '🚚 chore',
                '📦️ ci',
                '📝 docs',
                '✨ feat',
                '🐛 fix',
                '♻️ refactor',
                '💄 style',
                '✅ test'
            ]
        ]
    }
};
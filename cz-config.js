module.exports = {
  types: [
    { value: '✨ feat', name: '✨ feat:\t새로운 기능 추가' },
    { value: '🐛 fix', name: '🐛 fix:\t기능, UI/UX 코드 수정' },
    { value: '📝 docs', name: '📝 docs:\t문서 추가 혹은 업데이트' },
    { value: '💄 style', name: '💄 style:\t코드 형식 추가 및 수정' },
    {
      value: '♻️ refactor',
      name: '♻️ refactor:\t기능 추가와 버그 수정이 아닌 코드 수정',
    },
    { value: '📦️ ci', name: '📦️ ci:\t배포 관련 코드 추가 및 수정' },
    { value: '✅ test', name: '✅ test:\t테스트 코드 추가 및 수정' },
    { value: '🚚 chore', name: '🚚 chore:\t빌드 관련 도구 수정' },
  ],
  messages: {
    type: "Select the type of change that you're committing:",
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    footer:
      'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body', 'scope'],
  subjectLimit: 100,
};

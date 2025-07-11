export default function (results) {
    const summary = { issues: [] }
    results.forEach(function (result) {
      result.warnings.forEach(function (warning) {
        const logMessage = {
          engineId: 'stylelint',
          ruleId: warning.rule,
          primaryLocation: {
            message: warning.text,
            filePath: result.source,
            textRange: {
              startLine: warning.line,
              endLine: warning.endLine,
              endColumn: warning.endColumn
            }
          }
        }
        if (warning.severity === 'warning') {
          logMessage.type = 'CODE_SMELL'
          logMessage.severity = 'INFO'
        }
        if (warning.severity === 'error') {
          logMessage.type = 'BUG'
          logMessage.severity = 'MAJOR'
        }
        summary.issues.push(logMessage)
      })
    })
    return JSON.stringify(summary)
  }